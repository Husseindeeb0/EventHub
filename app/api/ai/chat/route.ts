import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import Event from "@/models/Event";

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "AI service not configured. Please add GEMINI_API_KEY to .env.local",
        },
        { status: 503 }
      );
    }

    // 1. Authenticate user
    const authResult = await authMiddleware(req);
    if (authResult.error) return authResult.response;

    const { userId } = authResult.user!;
    const { messages, currentEventId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    await connectDb();

    // 2. Fetch User & Context
    const user = await User.findById(userId).lean();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const upcomingEvents = await Event.find({ startsAt: { $gte: new Date() } })
      .select("title category location startsAt")
      .limit(5)
      .lean();

    let currentEventInfo = "";
    if (currentEventId && currentEventId.length === 24) {
      const ce = await Event.findById(currentEventId).lean();
      if (ce) {
        currentEventInfo = `CONTEXT: User is currently looking at "${ce.title}".`;
      }
    }

    const systemPrompt = `
      You are "EventHub AI Assistant".
      USER: ${user.name}.
      ${currentEventInfo}
      UPCOMING EVENTS: ${JSON.stringify(upcomingEvents)}
      
      STRICT RULES:
      1. ONLY talk about EventHub and events.
      2. REJECT other topics with: "Sorry, I am designed to assist only with EventHub-related inquiries."
    `;

    // 3. Clean History (Must start with User)
    const history = messages
      .slice(0, -1)
      .filter((m: any, i: number) =>
        i === 0 && m.role !== "user" ? false : true
      )
      .map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: String(m.content || m.text || "") }],
      }));

    const lastMessage = messages[messages.length - 1];
    const userText = String(lastMessage.content || lastMessage.text || "");

    // 4. Try multiple models in case 1.5-flash is not available for this key/region
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-pro", "gemini-pro"];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });

        let responseText = "";
        if (history.length === 0) {
          const result = await model.generateContent(userText);
          const response = await result.response;
          responseText = response.text();
        } else {
          const chat = model.startChat({ history });
          const result = await chat.sendMessage(userText);
          const response = await result.response;
          responseText = response.text();
        }

        return NextResponse.json({ text: responseText });
      } catch (err: any) {
        lastError = err;
        console.warn(`AI Chat: Model ${modelName} failed.`, err.message);

        // If it's a 404 (Not Found), we try the next model in the list
        if (
          err.message?.includes("404") ||
          err.message?.includes("not found")
        ) {
          continue;
        } else {
          // If it's another error (like 429 quota or 400 bad request), stop and report
          break;
        }
      }
    }

    // 5. Final fallback error
    return NextResponse.json(
      {
        error: "Gemini API Error",
        details: lastError?.message || "All models failed",
        suggestion:
          "Please verify that your API key is correct and has access to Gemini models in Google AI Studio.",
      },
      { status: 502 }
    );
  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

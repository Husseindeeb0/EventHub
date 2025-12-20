This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn)  - Fallback to initials if no photo is uploaded.

### 3. Real-Time Event Chat System
A deeply integrated, feature-rich chat experience designed for seamless event coordination.

- **Message Interactions**:
  - **Replies (TikTok Style)**: Users can reply to specific messages with a quoted preview. Clicking the quote smoothly scrolls to and highlights the original message.
  - **Likes**: Engage with messages using the heart reaction.
  - **Delete**: Users can delete their own messages.
- **Host Privileges (Crown Badge 👑)**:
  - **Visual Distinction**: Event organizers are clearly marked with a "HOST" badge and crown icon.
  - **Moderation**: Hosts have the power to **delete any message** in the chat to maintain order.
  - **Pinned Messages (Sticky Header)**: Hosts can **pin important updates** to the top of the chat, ensuring they are always visible to attendees.
- **Tech Stack**:
  - **Optimistic UI**: Instant feedback on likes, deletes, and pins for a snappy experience.
  - **Polling**: Lightweight real-time updates (every 5s) to keep everyone in sync.

---You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# EventHub Project

## 🚀 Features & Implementation Details

### 1. Gmail SMTP Authentication & OTP Verification
We have implemented a secure and robust authentication system using **Gmail SMTP** to solve common `localhost` and domain verification issues.

- **OTP (One-Time Password)**: Instead of verifying via links (which can be problematic on local environments), we now send a **6-digit code** to the user's email.
- **Flows Covered**:
  - **Signup**: User receives a code to verify their new account immediately.
  - **Login**: Unverified users are blocked and prompted to verify via code.
  - **Forgot Password**: Users receive a code to verify their identity before resetting their password.
- **Tech Stack**:
  - `Nodemailer` with Gmail Service.
  - Secure `App Password` configuration.
  - Custom API routes for `verify-email`, `resend-verification`, and `reset-password`.

### 2. Profile Photo Upload with ImageKit
A complete profile management system allowing users to upload and manage their profile pictures seamlessly.

- **Upload**: Integrated with **ImageKit.io** for high-performance image hosting and delivery.
- **Smart Management**:
  - When a user uploads a new photo, the **old photo is automatically deleted** from ImageKit to save storage and keep the gallery clean.
  - The user's profile in the database is updated with the new image URL immediately.
- **UI/UX**:
  - Real-time preview of uploaded images.
  - Modern drag-and-drop or click-to-upload interface.
  - Fallback to initials if no photo is uploaded.

---

## 👨‍💻 Credits

**Implemented by Full Stack Developer: Houssam Yakhni**

---

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

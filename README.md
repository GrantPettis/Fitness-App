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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing Procdedures
Sign-Up Testing:
UI: Ensured all fields (email, password, confirm password) were displayed correctly and validation was applied (e.g., password strength, matching passwords).
Form Submission: Submitted valid and invalid data to the API endpoint (/api/signup). Checked for successful account creation
Backend: Verified with Postman that the API correctly handled requests and responses, returning proper status codes 
Sign-In Testing:
UI: Verified the login form layout, validation (empty fields, incorrect credentials), and proper error messages.
Form Submission: Tested API requests to /api/signin with valid and invalid credentials. Verified that successful login returned a token and failed attempts showed appropriate messages.
Session Management: Ensured authenticated users could access restricted pages, with correct handling of expired or invalid sessions

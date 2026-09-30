# Firebase setup for Portfolio Studio

The public portfolio continues to work with its bundled content before Firebase is connected.

## 1. Create the Firebase services

1. Open the Firebase console and create or select a project.
2. Add a Web app and copy its configuration values.
3. In Authentication, enable **Email/Password**.
4. Create the admin user with `dagmawieliaswork@gmail.com`.
5. Create a Firestore database.
6. Publish the rules from `firestore.rules`.

## 2. Configure local development

Copy `.env.example` to `.env.local` and fill in the Firebase Web app values.

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Restart the Vite server, visit `/admin`, and sign in. Select **Initialize existing content** once to copy the current profile and five projects into Firestore.

## 3. Configure Vercel

Add the same six `VITE_FIREBASE_*` variables to the Vercel project for Production, Preview, and Development, then redeploy.

## Security

- Public visitors can read the published portfolio content.
- Only the authenticated Firebase user with the canonical admin email can write.
- The admin route is excluded from search indexing.
- Change the email in `firestore.rules` if the admin account changes.

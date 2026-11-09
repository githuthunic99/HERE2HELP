# Here2Help v2 — Setup Instructions

## New Files in This Update

```
App.js                          ← Updated with auth + role routing
src/
├── context/
│   └── AuthContext.js          ← Global auth state (NEW)
├── services/
│   └── firebase.js             ← Firebase auth + Firestore (NEW)
└── screens/
    ├── AuthScreen.js           ← Login, Signup, Forgot Password (NEW)
    ├── ChangePasswordScreen.js ← Change password (NEW)
    ├── AIChatScreen.js         ← Real Claude AI, mental health only (UPDATED)
    ├── SessionRatingScreen.js  ← 5-star post-session rating (NEW)
    ├── CounsellorDashboard.js  ← Counsellor inbox + session management (NEW)
    └── AdminDashboard.js       ← User management + stats (NEW)
```

## Step 1 — Copy files into your project

Copy all files into `C:\Users\Asus\Here2Help\` replacing existing ones.

## Step 2 — Copy google-services.json

Copy `google-services.json` from your Downloads into:
```
C:\Users\Asus\Here2Help\android\app\google-services.json
```

## Step 3 — Install Firebase packages

In PowerShell at `C:\Users\Asus\Here2Help\`:
```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

## Step 4 — Configure the AI chat securely

Do not put an Anthropic API key in the React Native app or its `.env` file: mobile app bundles can be inspected. The chat screen intentionally has no client-side key. Add a server-side endpoint that stores the key and forwards chat requests, then connect the app to that endpoint. Until that is configured, the chat displays a service-configuration message instead of silently repeating a generic reply.

## Step 5 — Update android/build.gradle

Open `android/build.gradle` and add inside `dependencies {}`:
```gradle
classpath 'com.google.gms:google-services:4.4.0'
```

## Step 6 — Update android/app/build.gradle

At the very bottom of `android/app/build.gradle` add:
```gradle
apply plugin: 'com.google.gms.google-services'
```

## Step 7 — Clean and rebuild

```bash
cd android
.\gradlew clean
cd ..
npx react-native run-android
```

## How the 3 roles work

| Role | What they see |
|---|---|
| Student | Full Here2Help app (home, journal, AI chat, articles, etc.) |
| Counsellor | Session inbox with waiting/active/completed tabs |
| Admin | User management dashboard + platform stats |

## Setting the first Admin

1. Sign up normally with any email
2. Go to Firebase Console → Firestore → users collection
3. Find your user document
4. Change `role` field from `student` to `admin`
5. Sign out and sign back in

## AI Chat — Mental Health Only

The AI is now powered by Claude and will ONLY discuss:
- Depression, anxiety, BPD, PTSD, OCD
- Student stress, burnout, homesickness  
- Relationships, grief, loneliness
- Coping strategies and psychoeducation

If asked anything unrelated, it politely redirects to mental health topics.

# English Guru

A React Native mobile app for learning English, designed for women in India. The app offers courses, video lessons, practice quizzes, and subscription-based access to locked content. UI is bilingual (Hindi + English) with a pink/teal theme.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Architecture](#architecture)
- [Features](#features)
- [Configuration](#configuration)
- [Assets](#assets)
- [Scripts](#scripts-packagejson)
- [App Icon](#app-icon)
- [Dependencies](#dependencies)

---

## Tech Stack

| Category        | Technology |
|----------------|------------|
| **Architecture** | Component-based + Stack/Tab navigation + Context-based state (feature/screen-based structure) |
| Framework      | React Native 0.83 |
| Language       | JavaScript (React 19) |
| Navigation     | React Navigation 7 (Stack + Bottom Tabs) |
| Styling        | NativeWind 4 (Tailwind CSS) |
| State          | React Context (UserContext) |
| Video          | react-native-video |
| Icons          | react-native-vector-icons (Feather) |
| UI             | react-native-linear-gradient, Safe Area |

---

## Prerequisites

- **Node.js** >= 20
- **npm** or **yarn**
- **Android:** Android Studio, JDK, Android SDK, emulator or physical device
- **iOS:** Xcode (macOS only), CocoaPods
- **React Native CLI** (installed via project devDependencies)

---

## Installation

1. Clone the repository and go to the app folder:
   ```bash
   cd englishguru
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **(iOS only)** Install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

4. Start Metro bundler (in one terminal):
   ```bash
   npm start
   ```

5. Run the app (in another terminal):
   - **Android:** `npm run android` (ensure emulator is running or device is connected)
   - **iOS:** `npm run ios`

---

## Running the App

| Command            | Description |
|--------------------|-------------|
| `npm start`        | Start Metro bundler |
| `npm run android`  | Run on Android (device/emulator) |
| `npm run ios`      | Run on iOS (simulator/device) |
| `npm run android:build` | Build Android debug APK (skips lint) |
| `npm run android:release` | Build Android **release** APK (smaller, minified; output in `android/app/build/outputs/apk/release/`) |
| `npm run android:bundle`  | Build Android App Bundle (AAB) for Play Store |
| `npm run dev:android`   | Run dev script for Android |
| `npm run lint`     | Run ESLint |
| `npm test`         | Run Jest tests |

**Note:** For Android, if you see "No connected devices", start an emulator from Android Studio or connect a physical device with USB debugging enabled.

**APK size:** Debug APKs are large (~150MB+) because they include all CPU architectures and unminified code. For a smaller installable, build a **release** APK: `npm run android:release`. Release builds use Proguard/R8 minification, resource shrinking, and only ARM ABIs (`arm64-v8a`, `armeabi-v7a`), which typically cuts size by roughly half. For Play Store, use `npm run android:bundle` to generate an AAB; Google Play then serves a smaller, device-specific APK.

---

## Folder Structure

All application code lives under **`src/`**. Entry points are `App.js` and `index.js` at the project root.

```
englishguru/
├── App.js                 # Root component, providers, NavigationContainer
├── index.js               # Entry point
├── global.css             # Tailwind base/components/utilities
├── app.json               # App name, displayName, version, icon path
├── package.json
├── react-native.config.js # Font assets: ./src/assets/fonts/
├── tailwind.config.js     # Tailwind + NativeWind theme (colors, fonts); content: App, index, src/**
├── babel.config.js
├── metro.config.js
├── jest.config.js
│
├── src/
│   ├── components/        # Reusable UI (each: ComponentName.js + ComponentName.styles.js)
│   │   ├── PrimaryButton/
│   │   ├── SecondaryButton/
│   │   ├── MenuRow/
│   │   ├── ScreenHeader/
│   │   ├── FormField/
│   │   ├── ContentCard/
│   │   └── ConfirmModal/
│   │
│   ├── config/
│   │   └── env.js         # App config / env (e.g. react-native-config)
│   │
│   ├── context/
│   │   └── UserContext.js # user (userName, phoneNumber, age, profileImageUri), updateUser, setUser
│   │
│   ├── data/
│   │   └── courses.js     # Course/list data (courses, lessons, unlocked state, images)
│   │
│   ├── navigation/
│   │   ├── RootNavigator.js   # Root stack: Home | FillInfo | MainTabs
│   │   ├── AuthNavigator.js   # Home (HomeScreen)
│   │   ├── OnboardingNavigator.js # FillInfo
│   │   ├── MainTabs.js        # Bottom tabs: Home (stack) | Practice | Profile (stack)
│   │   ├── HomeStack.js       # CoursesList, CourseDetail, Lesson, LessonPractice, LessonComplete, Subscription, PaymentSuccess
│   │   └── ProfileStack.js    # ProfileMain, ProfileDetails, Contact, Privacy, Help
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   └── HomeScreen/      # HomeScreen.js + HomeScreen.styles.js — Landing, Google CTA → FillInfo
│   │   ├── onboarding/
│   │   │   └── FillInfoScreen/  # FillInfoScreen.js — Name, mobile, age, toggles → MainTabs
│   │   └── app/                 # App screens grouped by bottom tab
│   │       ├── HomeTab/         # Home tab (stack): courses, lessons, subscription
│   │       │   ├── CoursesScreen/
│   │       │   ├── CourseDetailScreen/
│   │       │   ├── LessonScreen/
│   │       │   ├── LessonPracticeScreen/
│   │       │   ├── LessonCompleteScreen/
│   │       │   ├── SubscriptionScreen/
│   │       │   └── PaymentSuccessScreen/
│   │       ├── PracticeTab/     # Practice tab
│   │       │   └── PracticeScreen/
│   │       └── ProfileTab/     # Profile tab (stack)
│   │           ├── ProfileScreen/
│   │           ├── ProfileDetailsScreen/
│   │           ├── ContactScreen/
│   │           ├── PrivacyScreen/
│   │           └── HelpScreen/
│   │
│   ├── services/
│   │   ├── api/           # apiClient.js, endpoints.js
│   │   ├── auth/          # authService.js, googleSignIn.js
│   │   └── storage/       # secureStorage.js
│   │
│   ├── theme/
│   │   ├── index.js       # Theme exports
│   │   └── shadows.js     # cardShadow, cardShadowStrong, buttonShadow (Platform-specific)
│   │
│   ├── utils/
│   │   └── videoPointsStore.js # In-memory: which lessons got +5 video points
│   │
│   ├── assets/             # Images, fonts, video. See “Assets” below.
│   │   ├── EnglishGurulogo.png  # App icon source + in-app logo
│   │   ├── English.png         # Home character image
│   │   ├── google.png          # Google sign-in icon
│   │   ├── course/             # c1.png–c8.png (course covers)
│   │   ├── lesson/             # V.mp4 (fallback lesson video)
│   │   └── fonts/              # Custom fonts (linked via react-native.config.js); see src/assets/fonts/README.md
│   │
│   └── scripts/            # Custom Node scripts. See “Scripts (scripts/)” below.
│       └── dev-android.js  # Starts Metro, then runs Android app (optional device selection)
│
├── android/                # Android native project (res, mipmap icons, build)
└── ios/                    # iOS native project (Images.xcassets, AppIcon, build)
```

---

## Architecture

**Architecture pattern:** **Component-based architecture** with **stack + tab navigation** and **Context-based state management**.

- **Component-based (React):** UI is built from reusable components (screens, shared components in `src/components/`). Each screen is a component; shared pieces (buttons, headers, forms, modals, cards) are extracted for reuse.
- **Navigation:** React Navigation’s **stack navigators** (per flow) and one **bottom tab navigator** (main app). Each navigator owns its screens (RootNavigator → MainTabs → HomeStack / ProfileStack).
- **State:** **React Context** (no Redux/MobX). `UserContext` in `src/context/` holds global user data; screens read/update via `useUser()`. Local UI state lives in component `useState`.
- **Data:** Static course/lesson data in `src/data/`; in-memory helpers (e.g. `src/utils/videoPointsStore`) for session-only state. No backend in this repo.
- **Styling:** **Utility-first (NativeWind/Tailwind)** with a small **theme** layer (`src/theme/shadows.js`) for shared styles.

This is the standard **React Native** approach: components + navigation + Context, with a **feature/screen-based** folder structure (screens, components, navigation, context, data, theme, utils).

### Navigation Flow

```
App (GestureHandler, SafeAreaProvider, UserProvider, NavigationContainer)
└── RootNavigator (Stack, headerShown: false)
    ├── Home          → HomeScreen (Continue with Google → FillInfo)
    ├── FillInfo      → FillInfoScreen (submit → MainTabs)
    └── MainTabs      → Bottom Tabs
        ├── Home (Tab)    → HomeStack
        │   ├── CoursesList   → CoursesScreen
        │   ├── CourseDetail  → CourseDetailScreen
        │   ├── Lesson        → LessonScreen
        │   ├── LessonPractice→ LessonPracticeScreen
        │   ├── LessonComplete→ LessonCompleteScreen
        │   ├── Subscription  → SubscriptionScreen
        │   └── PaymentSuccess→ PaymentSuccessScreen
        ├── Practice (Tab)  → PracticeScreen (standalone)
        └── Profile (Tab)    → ProfileStack
            ├── ProfileMain   → ProfileScreen
            ├── ProfileDetails→ ProfileDetailsScreen
            ├── Contact       → ContactScreen
            ├── Privacy       → PrivacyScreen
            └── Help          → HelpScreen
```

- **Tab bar** is hidden on: CourseDetail, Lesson, LessonPractice, LessonComplete, Subscription, PaymentSuccess.
- **Logout** (Profile) resets navigation to `Home` (root).

### State & Data

- **UserContext** (`src/context/UserContext.js`): Global user state — `userName`, `phoneNumber`, `age`, `profileImageUri`. Used by FillInfoScreen (on continue), ProfileScreen, ProfileDetailsScreen, ContactScreen, PrivacyScreen. Provides `updateUser` and `setUser`.
- **Courses data** (`src/data/courses.js`): Static list of courses with `id`, `unlocked`, `titleHi`, `titleEn`, `image`, `lessons` (each with `id`, `title`, `completed`, `unlocked`). First course has first N lessons unlocked; others follow course-level lock.
- **videoPointsStore** (`src/utils/videoPointsStore.js`): In-memory set of lesson IDs that have already received +5 video completion points (awarded once per lesson).

### Styling

- **NativeWind (Tailwind):** `className` on React Native components. Config in `tailwind.config.js`: custom colors (`button`, `lightPinkBorder`), font sizes (`heading`, `body`, `rest`), font families (`openSans`, `hindi`).
- **Theme:** `src/theme/shadows.js` exports `cardShadow`, `cardShadowStrong`, `buttonShadow` (iOS shadow + Android elevation).
- **Reusable components** in `src/components/` use these shadows and shared classNames to keep UI consistent.

### Reusable Components

| Component       | Use |
|-----------------|-----|
| ScreenHeader   | Back button + title on Help, Contact, Privacy, ProfileDetails |
| PrimaryButton  | Main CTAs (Save, Continue, Start trial, Next lesson, etc.) |
| SecondaryButton| Outline actions (Logout, Not now, Back to course) |
| FormField      | Label + TextInput on Contact, ProfileDetails, (FillInfo optional) |
| MenuRow        | Profile menu items (icon, title, subtitle, chevron) |
| ConfirmModal   | Logout confirmation (title, message, Cancel/Logout) |
| ContentCard    | Content blocks with title (Help, Privacy) |

---

## Features

- **Onboarding:** Home (Google CTA) → FillInfo (name, mobile, age, toggles) → Main app.
- **Courses:** List with progress, locked/unlocked; tap to open course detail and lesson list.
- **Lessons:** Video player with auto-hiding controls; “Start” opens quiz (LessonPractice).
- **Quiz:** Multiple-choice questions; on finish → LessonComplete with score (e.g. 10/10 or 5/10) and optional +5 video points once per lesson.
- **Lesson complete:** Score card, lesson summary, progress; “Next lesson” or “Subscription” if no next; “Back to course.”
- **Subscription:** Lock hero, feature card, pricing (trial/monthly), “Start trial” → PaymentSuccess; “Not now” → back.
- **Payment success:** Success screen → Courses list.
- **Locked course:** “Start” on locked course opens Subscription.
- **Practice tab:** List of practice modules with status/score; “Start” / “Do again” opens LessonPractice; “Start next practice” from bottom.
- **Profile:** Avatar (placeholder edit), name, phone, menu (Profile Details, Contact, Privacy, Help), Logout with confirmation modal.
- **Profile sub-screens:** Profile Details (name, age), Contact (phone), Privacy (Google info), Help (support hours, email).
- **App icon:** Generated from `src/assets/EnglishGurulogo.png` for Android (mipmap) and iOS (AppIcon). Same asset used in-app where logo is needed.

---

## Configuration

- **app.json:** `name`, `displayName` (English Guru), `version`, `icon` path. Display name is synced to Android `strings.xml` and iOS `Info.plist` for the launcher label.
- **react-native.config.js:** `assets: ['./src/assets/fonts/']` for font linking.
- **tailwind.config.js:** Content paths (`./App`, `./index`, `./src/**`), NativeWind preset, custom colors/fonts/font sizes.
- **global.css:** Tailwind directives; imported in `App.js`.

---

## Assets

**Location:** Assets live in **`src/assets/`**.

| Path | Use |
|------|-----|
| `src/assets/EnglishGurulogo.png` | App icon source and in-app logo |
| `src/assets/English.png` | Home screen character image |
| `src/assets/google.png` | Google sign-in button icon |
| `src/assets/course/` | Course cover images (e.g. c1.png–c8.png); referenced in `src/data/courses.js` |
| `src/assets/lesson/` | Fallback lesson video (e.g. V.mp4); used when a lesson has no `videoUrl` |
| `src/assets/fonts/` | Custom fonts; linked via `react-native.config.js`. See **src/assets/fonts/README.md** for adding/linking fonts. |

**Referencing assets from code:** From `src/data/` use `require('../assets/...')`. From `src/screens/auth/HomeScreen/` or `src/screens/app/...` use `require('../../../assets/...')`.

---

## Scripts (package.json)

| Script              | Command                         | Description |
|---------------------|----------------------------------|-------------|
| start               | `npm start`                     | Metro bundler |
| android             | `npm run android`               | Run Android app |
| ios                 | `npm run ios`                   | Run iOS app |
| android:build       | `npm run android:build`         | Build Android debug APK |
| android:release     | `npm run android:release`      | Build Android release APK (Proguard + ABI filter for smaller size) |
| android:bundle      | `npm run android:bundle`       | Build release AAB for Play Store |
| dev:android         | `npm run dev:android`           | Runs **src/scripts/dev-android.js** (see below) |
| icon:generate      | `npm run icon:generate`         | Regenerate app icons from `src/assets/EnglishGurulogo.png` |
| lint                | `npm run lint`                  | ESLint |
| test                | `npm test`                      | Jest |

### Scripts folder (`src/scripts/`)

Custom Node.js scripts used by npm scripts:

- **src/scripts/dev-android.js** (run via `npm run dev:android`): One-command Android dev flow. Starts Metro on port 8081 (or 8082 if 8081 is in use), waits for the dev server to be ready, then runs the Android app. On Windows it can free the port if needed; it also detects a preferred device/emulator via `adb devices` and passes it to the CLI. Use this instead of starting Metro and `npm run android` in two separate terminals.

---

## App Icon

- **Source image:** `src/assets/EnglishGurulogo.png`
- **Generate launcher icons:**  
  `npm run icon:generate`  
  This runs `npx rn-app-icons --input src/assets/EnglishGurulogo.png` and updates:
  - **Android:** `android/app/src/main/res/mipmap-*/ic_launcher.png` and `ic_launcher_round.png`
  - **iOS:** `ios/englishguru/Images.xcassets/AppIcon.appiconset/`
- Rebuild the app after regenerating icons.

---

## Dependencies

**Core / UI**

- react, react-native
- @react-navigation/native, bottom-tabs, native-stack, stack
- nativewind, tailwindcss
- react-native-gesture-handler, react-native-reanimated, react-native-screens, react-native-safe-area-context
- react-native-linear-gradient, react-native-vector-icons
- react-native-video, react-native-worklets

**Dev**

- @react-native-community/cli, cli-platform-android, cli-platform-ios
- @react-native/babel-preset, eslint-config, metro-config
- babel, eslint, jest, prettier, react-test-renderer

**Engines:** Node >= 20

---

## License

Private project. All rights reserved.

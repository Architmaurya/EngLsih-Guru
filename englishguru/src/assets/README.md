# Assets

App images, fonts, and media live in **`src/assets/`**.

- **fonts/** — Custom fonts (linked via `react-native.config.js`). See `src/assets/fonts/README.md`.
- **course/** — Course cover images (e.g. c1.png–c8.png).
- **lesson/** — Fallback lesson video (e.g. V.mp4).
- **EnglishGurulogo.png**, **English.png**, **google.png** — App logo, home image, Google icon.

From `src/data/` use: `require('../assets/...')`.
From `src/screens/auth/HomeScreen/` or `src/screens/app/...` use: `require('../../../assets/...')`.

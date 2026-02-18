# Custom fonts

Add your font files (.ttf or .otf) here, then run:

```bash
npx react-native-asset
```

(or `npx react-native link` on older React Native)

**Font family names in the app (see `tailwind.config.js`):**

- **English:** `Plus Jakarta Sans` — used for `font-openSans` (title, button text).
- **Hindi:** `Plus Jakarta Sans` — used for `font-hindi` (greeting, subtitle, Hindi lines). You can use a different font (e.g. Tiro Devanagari Hindi) by adding it here and updating `tailwind.config.js` `theme.extend.fontFamily.hindi`.

**Important:** The name in the app must match the font’s name after linking. If the font doesn’t apply, try the filename without extension (e.g. `PlusJakartaSans-Regular` for `PlusJakartaSans-Regular.ttf`) in `tailwind.config.js`.

After linking, rebuild: `npm run dev:android` or `react-native run-android`.

# Date Invitation App - React Version

This is the React version of the date invitation app, converted exactly as it was in vanilla JavaScript.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
├── src/
│   ├── components/          # React components for each screen
│   │   ├── IntroScreen.jsx
│   │   ├── TimeScreen.jsx
│   │   ├── PlaceScreen.jsx
│   │   ├── TransportScreen.jsx
│   │   └── ConfirmScreen.jsx
│   ├── hooks/
│   │   └── useTimePicker.js  # Custom hook for time picker
│   ├── data.js              # Restaurant configuration
│   ├── App.jsx              # Main app component
│   ├── App.css              # Styles (imports original CSS)
│   └── main.jsx             # React entry point
├── css/
│   └── styles.css           # Original styles (preserved exactly)
├── public/
│   └── assets/             # Static assets (images)
├── package.json
└── vite.config.js
```

## Features

- ✅ Exact same UI and functionality as the original
- ✅ All animations and transitions preserved
- ✅ Interactive analog clock time picker
- ✅ Leaflet map with restaurant selection
- ✅ Transportation selection
- ✅ Confirmation screen

## Customization

Edit `src/data.js` to customize:
- Map center coordinates
- Restaurant locations and details
- Restaurant images (place in `public/assets/images/`)

## Technologies

- React 18
- Vite
- React-Leaflet
- Leaflet


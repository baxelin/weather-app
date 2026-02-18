<div align="center">

# ⛅ Weather App

A modern, responsive weather application with an **iOS-inspired design**, built with **Astro** and powered by the **Open-Meteo API**. Features real-time weather data, hourly & weekly forecasts, geolocation, favorites, search history, and a clean layered architecture following **Clean Code** and **OOP** best practices.

![Astro](https://img.shields.io/badge/Astro-5.17-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)

</div>

---

## ✨ Features

| Feature                       | Description                                                               |
| :---------------------------- | :------------------------------------------------------------------------ |
| 🌡️ **Current Weather**        | Temperature, humidity, wind speed, feels like, UV index, sunrise & sunset |
| ⏱️ **Hourly Forecast**        | Next 12 hours with precipitation bars and drag-to-scroll                  |
| 📅 **Weekly Forecast**        | 7-day outlook with min/max temperatures and weather icons                 |
| 🔍 **Smart Search**           | Autocomplete with 20+ built-in cities + live geocoding via Open-Meteo     |
| 📍 **Geolocation**            | One-tap current location detection with reverse geocoding                 |
| ⭐ **Favorites**              | Save up to 5 favorite cities for quick access                             |
| 🕐 **Search History**         | Quick access to your 5 most recent searches                               |
| 🔄 **°C / °F Toggle**         | Seamless unit switching across all components                             |
| ⚡ **Stale-While-Revalidate** | Instant cached data display while fetching fresh results                  |
| ⚠️ **Weather Alerts**         | Visual banners for severe weather conditions (storms, heavy rain)         |
| 📱 **Fully Responsive**       | Mobile-first design with desktop two-column grid layout                   |

---

## 🛠️ Tech Stack

| Technology                       | Purpose                                                |
| :------------------------------- | :----------------------------------------------------- |
| **[Astro](https://astro.build)** | Static site framework with component islands           |
| **SCSS**                         | Modular, scoped stylesheets with CSS custom properties |
| **Open-Meteo API**               | Free weather forecast data (current, hourly, daily)    |
| **Open-Meteo Geocoding**         | City search and forward geocoding                      |
| **Nominatim (OSM)**              | Reverse geocoding for geolocation                      |
| **ESLint**                       | Code quality and linting                               |

---

## 🏗️ Architecture

The codebase follows a **layered architecture** with clear separation of concerns, applying **Clean Code** principles and **OOP** patterns:

```
src/
├── pages/
│   └── index.astro              # App shell & responsive layout
│
├── components/                   # Presentation layer (thin UI components)
│   ├── InputButton.astro         # Search, weather card, favorites, history
│   ├── HourlyForecast.astro      # Hourly forecast with drag-to-scroll
│   ├── WeeklyForecast.astro      # 7-day forecast
│   └── TempToggle.astro          # °C/°F segmented control
│
├── lib/
│   ├── constants/                # Single source of truth
│   │   ├── api.js                # API endpoint URLs
│   │   ├── cities.js             # Default city list with coordinates
│   │   ├── config.js             # Cache TTLs, limits, magic numbers
│   │   └── weather-codes.js      # WMO code maps, icons, alert codes
│   │
│   ├── services/                 # Infrastructure layer
│   │   ├── CacheService.js       # Generic localStorage cache with TTL
│   │   ├── GeocodingService.js   # Forward & reverse geocoding + geolocation
│   │   └── WeatherService.js     # All weather API calls + caching
│   │
│   ├── stores/                   # State management
│   │   ├── FavoritesStore.js     # Favorites CRUD (localStorage)
│   │   └── HistoryStore.js       # Search history management
│   │
│   └── utils/                    # Pure utility functions
│       ├── temperature.js        # Conversion, formatting, unit symbols
│       └── time.js               # Time & date formatting helpers
│
└── styles/                       # iOS-inspired design system
    ├── global.scss               # CSS variables, tokens, base reset
    ├── InputButton.scss          # Search, card, chips, favorites styles
    ├── HourlyForecast.scss       # Horizontal scroll card
    ├── WeeklyForecast.scss       # Daily list card
    └── TempToggle.scss           # Segmented control
```

### Key Architecture Decisions

- **Zero code duplication** — shared logic (weather codes, cache, temperature utils) extracted into reusable modules imported by all components
- **Service classes** (`WeatherService`, `GeocodingService`, `CacheService`) encapsulate all external API communication and caching strategy
- **Store classes** (`FavoritesStore`, `HistoryStore`) isolate localStorage persistence with clear CRUD interfaces
- **Constants extracted** — all magic numbers (TTLs, limits, debounce delays) centralized in `config.js`
- **Thin components** — Astro components handle only DOM rendering and event wiring, delegating business logic to the service layer

---

## 🎨 Design System

Built with an **iOS / Apple-inspired** aesthetic:

- **Color tokens** via CSS custom properties (`--color-bg`, `--color-card`, `--color-accent`, etc.)
- **SF Pro** system font stack for native feel
- **16px border radius** cards with subtle `box-shadow`
- **Mobile-first** responsive layout → desktop two-column grid at `1025px`
- **Smooth micro-interactions** — hover states, scale transforms, transition animations

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**

### Installation

```bash
# Clone the repository
git clone https://github.com/baxelin/weather-app
cd weather-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:4321**

### Commands

| Command           | Action                               |
| :---------------- | :----------------------------------- |
| `npm run dev`     | Start dev server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`   |
| `npm run preview` | Preview production build locally     |

---

## 📡 APIs Used

| API                                                                  | Usage                                       | Auth                |
| :------------------------------------------------------------------- | :------------------------------------------ | :------------------ |
| [Open-Meteo Forecast](https://open-meteo.com/en/docs)                | Current weather, hourly & daily forecasts   | Free, no key needed |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search autocomplete                    | Free, no key needed |
| [Nominatim](https://nominatim.org/release-docs/latest/api/Reverse/)  | Reverse geocoding (coordinates → city name) | Free, no key needed |

> **No API keys required** — the app works out of the box.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

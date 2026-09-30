# F1 Hub

A Formula 1 web application built with **React.js** and **TypeScript**. It brings together race calendars, race results, driver profiles and championship standings in one place, along with a live countdown to the next Grand Prix and a weather forecast for the upcoming race.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Data Sources](#data-sources)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Notes](#notes)
- [Acknowledgements](#acknowledgements)

## Features

### Home

- Countdown to the **next race**
- **Podium** of the most recent race
- **Top 5 drivers** in the current season standings
- **Top 5 constructors** in the current season standings

### Race Calendar

- Full list of races in the season with their dates
- Winner shown for every race that has already taken place
- Season progress: number of rounds completed and rounds remaining

### Race Details

- Race info: location, date, circuit, circuit details, circuit image, race distance, lap record, number of laps and more
- **Results table** (for completed races) showing:
  - driver and constructor
  - driver's fastest lap
  - grid position
  - difference between grid and final position
  - race time / gap
  - points
- Fastest lap of the race
- **7-day weather forecast** for the next upcoming race (when the race hasn't taken place yet)

### Drivers

- Card list of all drivers in the current season

### Driver Details

- Photo, nationality (with flag), driver code, car number, full name and current constructor
- Link to the driver's Wikipedia page
- Age and date of birth
- Career totals: **wins**, **podiums** and **pole positions**
- **Stats by season**: wins, podiums, pole positions, points and the constructor driven for in each season

### Standings

- Current **Drivers'** and **Constructors'** championship standings
- Historical standings for several previous seasons

## Tech Stack

- [React.js](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- HTML5
- CSS3

## Data Sources

### APIs

| Service                                                 | Purpose                                                              |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| [Jolpica F1 API](https://github.com/jolpica/jolpica-f1) | All Formula 1 data: races, results, drivers, constructors, standings |
| [Open-Meteo](https://open-meteo.com/)                   | Weather forecast for the upcoming race (7 days ahead)                |
| [Flag CDN](https://flagpedia.net/download/api)          | Country flags for drivers' nationalities and race host countries     |

### Images

| Images         | Source                     |
| -------------- | -------------------------- |
| Circuit images | Official Formula 1 website |
| Driver photos  | Sky Sports                 |

Images were downloaded from these sources and are stored locally in the project (they are not fetched at runtime).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/<repository-name>.git
cd <repository-name>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

### Build for production

```bash
npm run build
```

## Project Structure

```
├── public/           # Static files
├── src/
│   ├── api/          # API layer (Jolpica, Open-Meteo)
│   ├── assets/       # Locally stored circuit and driver images
│   ├── components/   # Reusable UI components
│   ├── constants/    # Shared constants
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Home, Races, RaceDetails, Drivers, DriverDetails, Standings
│   ├── types/        # TypeScript types and interfaces
│   ├── utils/        # Helper functions
│   ├── App.tsx       # Root component and routing
│   └── main.tsx      # Application entry point
└── index.html        # HTML entry point
```

> Update this section to match your actual folder layout.

## Notes

- The Jolpica API enforces rate limits (including a small burst limit), so requests are kept to a minimum where possible.
- Weather forecasts are only displayed for the next upcoming race, as Open-Meteo provides a 7-day forecast window.

## Acknowledgements

- [Jolpica F1](https://github.com/jolpica/jolpica-f1) for the open Formula 1 data API
- [Open-Meteo](https://open-meteo.com/) for the free weather API
- [Formula 1](https://www.formula1.com/) and [Sky Sports](https://www.skysports.com/) for the circuit and driver imagery

## Disclaimer

This is an unofficial fan project and is not affiliated with, endorsed by, or associated with Formula 1, the FIA, or any F1 team. All trademarks and images belong to their respective owners.

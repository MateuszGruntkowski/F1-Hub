import { useEffect, useState } from "react";
import { getRaces } from "./api/racesApi";
import "./App.css";
import type { RaceBase } from "./types/race";
import { Header } from "./components/Header";
import { HomePage } from "./pages/Home/HomePage";
import { Route, Routes } from "react-router";
import { RacesPage } from "./pages/Races/RacesPage";
import { StandingsPage } from "./pages/Standings/StandingsPage";
import { RaceDetailsPage } from "./pages/RaceDetails/RaceDetailsPage";
import { DriversPage } from "./pages/Drivers/DriversPage";

function App() {
  const [races, setRaces] = useState<RaceBase[]>([]);

  useEffect(() => {
    async function fetchRaces() {
      try {
        const races = await getRaces(2026);
        setRaces(races);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRaces();
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage races={races} />} />
        <Route path="/races" element={<RacesPage races={races} />} />
        <Route path="/races/:season/:round" element={<RaceDetailsPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/standings" element={<StandingsPage races={races} />} />
      </Routes>
    </>
  );
}

export default App;

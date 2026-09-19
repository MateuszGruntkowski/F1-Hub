import { useEffect, useState } from "react";
import { getRaces } from "./api/racesApi";
import "./App.css";
import type { RaceBase } from "./types/race";
import { Header } from "./components/Header";
import { HomePage } from "./pages/Home/HomePage";
import { Route, Routes } from "react-router";
import { RacesPage } from "./pages/Races/RacesPage";

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
      </Routes>
    </>
  );
}

export default App;

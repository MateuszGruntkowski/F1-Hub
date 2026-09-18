import { useEffect, useState } from "react";
import { getRaces } from "./api/racesApi";
import "./App.css";
import type { Race } from "./types/race";
import { Header } from "./components/Header";
import { HomgePage } from "./pages/HomePage";

function App() {
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    async function fetchRaces() {
      try {
        const races = await getRaces(2026);
        console.log(races);
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
      <HomgePage races={races} />
    </>
  );
}

export default App;

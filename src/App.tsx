import { useEffect, useState } from "react";
import "./App.css";
import type { RaceBase } from "./types/race";
import { Header } from "./components/Header";
import { HomePage } from "./pages/Home/HomePage";
import { Route, Routes } from "react-router";
import { RacesPage } from "./pages/Races/RacesPage";
import { StandingsPage } from "./pages/Standings/StandingsPage";
import { RaceDetailsPage } from "./pages/RaceDetails/RaceDetailsPage";
import { DriversPage } from "./pages/Drivers/DriversPage";
import { CURRENT_SEASON } from "./constants/seasons";
import { DriverDetailsPage } from "./pages/DriverDetails/DriverDetailsPage";
import Footer from "./components/Footer";
import type { Status } from "./types/status";
import Spinner from "./components/Spinner";
import ErrorMessage from "./components/ErrorMessage";
import { getRaces } from "./api/f1-jolpica/racesApi";

function App() {
  const [races, setRaces] = useState<RaceBase[]>([]);
  const [racesStatus, setRacesStatus] = useState<Status>("loading");

  useEffect(() => {
    async function fetchRaces() {
      setRacesStatus("loading");
      try {
        const races = await getRaces(CURRENT_SEASON);
        setRaces(races);
        setRacesStatus("success");
      } catch (error) {
        console.log(error);
        setRacesStatus("error");
      }
    }

    fetchRaces();
  }, []);

  if (racesStatus === "loading") {
    return (
      <section className="page-loading">
        <Spinner />
      </section>
    );
  }

  if (racesStatus === "error") {
    return (
      <section className="page-error">
        <ErrorMessage message="Couldn't load races." />
      </section>
    );
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage races={races} />} />
        <Route path="/races" element={<RacesPage races={races} />} />
        <Route path="/races/:season/:round" element={<RaceDetailsPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/drivers/:driverId" element={<DriverDetailsPage />} />
        <Route path="/standings" element={<StandingsPage races={races} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

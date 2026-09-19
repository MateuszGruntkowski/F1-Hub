import type { RaceBase } from "../../types/race";
import "./HomePage.css";
import { NextRace } from "./NextRace";
import { LastRace } from "./LastRace";
import { Standings } from "./Standings";

type HomePageProps = {
  races: RaceBase[];
};

export function HomePage({ races }: HomePageProps) {
  return (
    <div className="page">
      <NextRace races={races} />
      <LastRace races={races} />
      <Standings />
    </div>
  );
}

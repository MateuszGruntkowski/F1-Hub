import type { RaceBase } from "../../types/race";
import { RacesGrid } from "./RacesGrid";
import "./RacesPages.css";
import { RacesHeader } from "./RacesHeader";

type RacesPageProps = {
  races: RaceBase[];
};

export function RacesPage({ races }: RacesPageProps) {
  return (
    <>
      <RacesHeader races={races} />
      <section className="page">
        <RacesGrid races={races} />
      </section>
    </>
  );
}

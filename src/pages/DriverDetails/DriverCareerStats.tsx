import dayjs from "dayjs";
import type { Driver } from "../../types/driver";
import type { DriverTotalStats } from "../../types/driverStats";

function countAge(birthday: string | undefined) {
  if (!birthday) {
    return;
  }

  const today = dayjs();
  const convertedBirthday = dayjs(birthday);
  let age = today.year() - convertedBirthday.year();

  if (
    convertedBirthday.month() > today.month() ||
    (convertedBirthday.month() === today.month() &&
      convertedBirthday.date() > today.date())
  ) {
    age--;
  }
  return age;
}

type DriverCareerProps = {
  driver: Driver;
  driverStats: DriverTotalStats;
};

export function DriverCareerStats({ driver, driverStats }: DriverCareerProps) {
  return (
    <div className="quick-facts">
      <div className="quick-fact">
        <div className="label">AGE</div>
        <div className="value">{countAge(driver.dateOfBirth)}</div>
      </div>
      <div className="quick-fact">
        <div className="label">BORN</div>
        <div className="value">
          {dayjs(driver.dateOfBirth).format("D MMM YYYY")}
        </div>
      </div>
      <div className="quick-fact">
        <div className="label">TOTAL WINS</div>
        <div className="value">{driverStats?.totalWins}</div>
      </div>
      <div className="quick-fact">
        <div className="label">PODIUMS</div>
        <div className="value">{driverStats?.totalPodiums}</div>
      </div>
      <div className="quick-fact">
        <div className="label">POLE POSITIONS</div>
        <div className="value">{driverStats?.totalPolePositions}</div>
      </div>
    </div>
  );
}

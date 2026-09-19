import { useEffect, useState } from "react";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

const EMPTY: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalMs: 0,
};

function getCountdown(date?: string, time?: string): Countdown {
  if (!date) return EMPTY;

  const target = new Date(`${date}T${time ?? "00:00:00Z"}`).getTime();
  const totalMs = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(totalMs / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs,
  };
}

export function useCountdown(date?: string, time?: string) {
  const [countdown, setCountdown] = useState(() => getCountdown(date, time));

  useEffect(() => {
    setCountdown(getCountdown(date, time));
    const id = setInterval(() => setCountdown(getCountdown(date, time)), 1000);
    return () => clearInterval(id);
  }, [date, time]);

  return countdown;
}

export const driversCountryCodes: Record<string, string> = {
  Polish: "pl",
  British: "gb",
  German: "de",
  Italian: "it",
  Spanish: "es",
  French: "fr",
  Dutch: "nl",
  Australian: "au",
  Japanese: "jp",
  Canadian: "ca",
  Mexican: "mx",
  Brazilian: "br",
  Argentine: "ar",
};

export const racesCountryCodes: Record<string, string> = {
  Australia: "au",
  China: "cn",
  Japan: "jp",
  USA: "us",
  Canada: "ca",
  Monaco: "mc",
  Spain: "es",
  Austria: "at",
  UK: "gb",
  Belgium: "be",
  Hungary: "hu",
  Netherlands: "nl",
  Italy: "it",
  Azerbaijan: "az",
  Malaysia: "my",
  Singapore: "sg",
  Mexico: "mx",
  Brazil: "br",
  Qatar: "qa",
  UAE: "ae",
};

export function getDriverCountryFlag(
  country: string | undefined,
): string | undefined {
  if (!country) {
    return undefined;
  }

  const code = driversCountryCodes[country];

  if (!code) {
    return undefined;
  }
  return `https://flagcdn.com/${driversCountryCodes[country]}.svg`;
}

export function getRaceCountryFlag(country: string): string | undefined {
  const code = racesCountryCodes[country];

  if (!code) {
    return undefined;
  }
  return `https://flagcdn.com/${racesCountryCodes[country]}.svg`;
}

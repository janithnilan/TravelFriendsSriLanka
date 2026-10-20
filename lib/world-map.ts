import world from "@svg-maps/world";

export const worldMap = world as {
  viewBox: string;
  locations: { id: string; name: string; path: string }[];
};

export function countryFlag(code: string) {
  return /^[A-Z]{2}$/.test(code)
    ? String.fromCodePoint(
        ...[...code].map((letter) => 127397 + letter.charCodeAt(0)),
      )
    : "";
}

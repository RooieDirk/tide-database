import { around, distance } from "geokdbush";
import { stations } from "./stations.js";
import { createIndex } from "./search-index.js" with { type: "macro" };
import { loadIndex } from "./search-index.js";
import type { Station } from "./types.js";

export type Position = Latitude & Longitude;
type Latitude = { latitude: number } | { lat: number };
type Longitude = { longitude: number } | { lon: number } | { lng: number };

export type NearestOptions = Position & {
  maxDistance?: number;
  filter?: (station: Station) => boolean;
};

export type NearOptions = NearestOptions & {
  maxResults?: number;
};

/**
 * A tuple of a station and its distance from a given point, in kilometers.
 */
export type StationWithDistance = [Station, number];

// Load the index, which gets inlined at build time
const index = loadIndex(await createIndex());

/**
 * Find stations near a given position.
 */
export function near({
  maxDistance = Infinity,
  maxResults = 10,
  filter,
  ...position
}: NearOptions): StationWithDistance[] {
  const point = positionToPoint(position);

  const ids: number[] = around(
    index,
    ...point,
    maxResults,
    maxDistance,
    filter ? (id: number) => filter(stations[id]!) : undefined,
  );
  return ids.map((id) => {
    const station = stations[id]!;

    return [station, distance(...point, ...positionToPoint(station))] as const;
  });
}

/**
 * Find the single nearest station to a given position.
 */
export function nearest(options: NearestOptions): StationWithDistance | null {
  const results = near({ ...options, maxResults: 1 });
  return results[0] ?? null;
}

export function positionToPoint(options: Position): [number, number] {
  const longitude =
    "longitude" in options
      ? options.longitude
      : "lon" in options
        ? options.lon
        : options.lng;
  const latitude = "latitude" in options ? options.latitude : options.lat;
  return [longitude, latitude];
}

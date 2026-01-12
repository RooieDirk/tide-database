import type { Station, StationData } from "./types.js";

const modules = import.meta.glob<StationData>("./**/*.json", {
  eager: true,
  import: "default",
  base: "../data",
});

export const stations: Station[] = Object.entries(modules).map(
  ([path, data]) => {
    const id = path.replace(/^\.\//, "").replace(/\.json$/, "");
    return { id, ...data };
  },
);

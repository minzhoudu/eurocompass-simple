import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";

const WORLD_GEO_URL = "/data/world-110m.json";
const SERBIA_ID = "688";

export const RouteMap = () => {
  return (
    <div className="mx-auto aspect-[2/1] w-full max-w-4xl">
      <ComposableMap projection="geoEqualEarth" className="h-full w-full">
        <Sphere
          id="rsm-sphere"
          className="fill-brand-yellow-50 stroke-gray-200"
          strokeWidth={0.5}
        />
        <Graticule className="stroke-gray-200" strokeWidth={0.5} />

        <Geographies geography={WORLD_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) =>
              geo.id === SERBIA_ID ? (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="map-highlight fill-brand-yellow-500 stroke-brand-yellow-700 outline-none"
                  strokeWidth={1.2}
                />
              ) : (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="fill-gray-200 stroke-gray-300 outline-none"
                  strokeWidth={0.5}
                />
              ),
            )
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

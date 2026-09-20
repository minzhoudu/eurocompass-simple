import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
} from "react-simple-maps";

const WORLD_GEO_URL = "/data/world-110m.json";
const SERBIA_ID = "688";

export const RouteMap = () => {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ center: [20, 43.5], scale: 1700 }}
      width={1400}
      height={400}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <Graticule className="stroke-line" strokeWidth={0.5} />

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
                className="fill-sunken stroke-line-strong outline-none"
                strokeWidth={0.5}
              />
            ),
          )
        }
      </Geographies>
    </ComposableMap>
  );
};

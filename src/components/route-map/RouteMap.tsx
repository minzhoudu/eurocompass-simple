import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps";

const SERBIA_GEO_URL = "/data/serbia.geo.json";

const KRUSEVAC: [number, number] = [21.335, 43.5804];
const BEOGRAD: [number, number] = [20.4489, 44.7866];

export const RouteMap = () => {
  return (
    <div className="mx-auto aspect-[4/3] w-full max-w-xl">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [20.9, 44.15], scale: 6500 }}
        className="h-full w-full"
      >
        <Geographies geography={SERBIA_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="fill-brand-yellow-200 stroke-brand-yellow-400 outline-none"
                strokeWidth={1.5}
              />
            ))
          }
        </Geographies>

        <Line
          from={KRUSEVAC}
          to={BEOGRAD}
          className="route-line"
          stroke="#c98a12"
          strokeWidth={2}
          strokeLinecap="round"
        />

        <Marker coordinates={KRUSEVAC}>
          <circle
            r={5}
            className="fill-brand-yellow-700 stroke-white"
            strokeWidth={2}
          />
          <text
            textAnchor="middle"
            y={-12}
            className="select-none fill-brand-black-900 text-[11px] font-semibold"
          >
            Kruševac
          </text>
        </Marker>

        <Marker coordinates={BEOGRAD}>
          <circle
            r={5}
            className="fill-brand-yellow-700 stroke-white"
            strokeWidth={2}
          />
          <text
            textAnchor="middle"
            y={-12}
            className="select-none fill-brand-black-900 text-[11px] font-semibold"
          >
            Beograd
          </text>
        </Marker>
      </ComposableMap>
    </div>
  );
};

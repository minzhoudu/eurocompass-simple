import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  useMapContext,
} from "react-simple-maps";

const WORLD_GEO_URL = "/data/world-110m.json";
const SERBIA_ID = "688";

type Coordinates = [number, number];

const BEOGRAD: Coordinates = [20.4633, 44.8176];
const KRUSEVAC: Coordinates = [21.3339, 43.58];

const ROUTE_BEND = 0.28;

const TravelRoute = () => {
  const { projection } = useMapContext();

  const start = projection(BEOGRAD);
  const end = projection(KRUSEVAC);

  if (!start || !end) return null;

  const [x1, y1] = start;
  const [x2, y2] = end;
  const controlX = (x1 + x2) / 2 + (y2 - y1) * ROUTE_BEND;
  const controlY = (y1 + y2) / 2 - (x2 - x1) * ROUTE_BEND;
  const path = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;

  return (
    <g fill="none" strokeLinecap="round">
      <path d={path} className="stroke-brand-black-900/30" strokeWidth={2} />
      <path
        d={path}
        className="route-line stroke-brand-black-900"
        strokeWidth={3.5}
      />
    </g>
  );
};

const CityMarker = ({
  name,
  coordinates,
}: {
  name: string;
  coordinates: Coordinates;
}) => (
  <Marker coordinates={coordinates}>
    <circle r={6} className="fill-brand-black-900 stroke-white" strokeWidth={2.5} />
    <text
      x={-12}
      y={5}
      textAnchor="end"
      strokeWidth={4}
      strokeLinejoin="round"
      className="fill-brand-black-900 stroke-white text-[15px] font-bold [paint-order:stroke]"
    >
      {name}
    </text>
  </Marker>
);

export const RouteMap = () => {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ center: [20.6, 44], scale: 2500 }}
      width={1400}
      height={400}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label="Karta Srbije sa relacijom Kruševac - Beograd"
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

      <TravelRoute />
      <CityMarker name="Beograd" coordinates={BEOGRAD} />
      <CityMarker name="Kruševac" coordinates={KRUSEVAC} />
    </ComposableMap>
  );
};

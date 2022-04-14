import * as React from 'react';
import Map, { Source, Layer } from 'react-map-gl';

import { withRouter } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const geojson = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-122.4, 37.8] } },
  ],
};

const layerStyle = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf',
  },
};

function App() {
  const [viewport, setViewport] = React.useState();
  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}>
      <Source id="my-data" type="geojson" data={geojson}>
      style={{ width: 100, height: 100 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
        <Layer {...layerStyle}/>
      </Source>
    </Map>
  );
}
const MapBox = () => (
  // Important! Always set the container height explicitly
  <div id={COMPONENT_IDS.FILTER_OPPORTUNITIES_MAP} className={'map-border'}>
    <App/>
  </div>
);

export default withRouter(MapBox);

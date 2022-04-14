import * as React from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { withRouter } from 'react-router-dom';

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
    <Map initialViewState={{
      longitude: -122.45,
      latitude: 37.78,
      zoom: 14,
    }}>
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
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

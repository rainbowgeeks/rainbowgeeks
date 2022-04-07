import * as React from 'react';
import Map from 'react-map-gl';

import { withRouter } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

function App() {
  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: 100, height: 100 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}
const MapBox = () => (
  // Important! Always set the container height explicitly
  <div id={COMPONENT_IDS.FILTER_OPPORTUNITIES_MAP} className={'google-map-border'}>
    <App/>
  </div>
);

export default withRouter(MapBox);

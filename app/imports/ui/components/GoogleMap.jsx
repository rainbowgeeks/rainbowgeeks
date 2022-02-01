import React from 'react';
import GoogleMapReact from 'google-map-react';
import { withRouter } from 'react-router-dom';

const defaultProps = {
  center: {
    lat: 21.33510,
    lng: -157.87429,
  },
  zoom: 10,
};

const GoogleMap = () => (
  // Important! Always set the container height explicitly
  <div style={{ height: '70vh', width: '100%' }}>
    <GoogleMapReact
      bootstrapURLKeys={{ key: '' }}
      defaultCenter={defaultProps.center}
      defaultZoom={defaultProps.zoom}
    >
    </GoogleMapReact>
  </div>
);

export default withRouter(GoogleMap);

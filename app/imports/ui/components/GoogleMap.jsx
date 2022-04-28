import React from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

// eslint-disable-next-line react/jsx-no-undef
const AddressPin = () => (
  // console.log(pin);
  <Icon name={'map pin'} size={'big'} color={'red'}></Icon>
);

AddressPin.propTypes = {
  pin: PropTypes.object,
};

// InfoWindow component
const defaultProps = {
  center: {
    lat: 21.460208193991974,
    lng: -157.96690508208914,
  },
  zoom: 11,
};

const GoogleMap = ({ markers }) => {
  // console.log(markers);
  return (
    // Important! Always set the container height explicitly
    <div id={COMPONENT_IDS.FILTER_OPPORTUNITIES_MAP} className={'google-map-border'}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyA8P8TFj6VpzBM4dNJWayH6fi5zLU7qmOw' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {markers.map(m => <AddressPin key={m._id} lat={m.lat} lng={m.long} title={m.title}/>)}
      </GoogleMapReact>
    </div>
  );
};

GoogleMap.propTypes = {
  markers: PropTypes.array,
};

export default withRouter(GoogleMap);

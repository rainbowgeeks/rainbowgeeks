import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const GoogleAutocomplete = ({ getThem }) => {
  const [address, setAddress] = useState('');

  const handleChange = (data) => {
    setAddress(data);
  };

  const handleSelect = (data) => {
    setAddress(data);
    geocodeByAddress(data)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };

  console.log(address);
  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <Input
            {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input',
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map(suggestion => (
              // eslint-disable-next-line react/jsx-key
              <div {...getSuggestionItemProps(suggestion)} key={suggestion.placeId}>
                <span>{suggestion.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

GoogleAutocomplete.propTypes = {
  getThem: PropTypes.func,
};

export default withRouter(GoogleAutocomplete);

import React, { useState, useRef } from 'react';
import classnames from 'classnames';
import { connectField, filterDOMProps } from 'uniforms';
import { Input } from 'semantic-ui-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

/**
 * Provide Semantic UI multi-select functionality.
 * Adapted from https://github.com/vazco/uniforms/blob/master/packages/uniforms-semantic/src/SelectField.tsx
 *
 * The MIT License (MIT)
 * Copyright (c) 2016-2019 Vazco
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint react/prop-types: 0 */
const renderDropdown = ({ disabled, placeholder, value, id }) => {
  // console.log('renderMultiSelect value=%o allowedValues=%o', value, allowedValues);
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
  console.log(value);
  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <Input
            value={value}
            disabled={disabled}
            id={id}
            {...getInputProps({
              placeholder: placeholder,
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

const GoogleSelect = ({
  allowedValues,
  checkboxes,
  className,
  disabled,
  error,
  errorMessage,
  fieldType,
  id,
  inputRef,
  label,
  name,
  placeholder,
  required,
  showInlineError,
  transform,
  value,
  ...props
}) => {
  console.log(value, name, id, 'here');
  return (
    <div className={classnames({ disabled, error, required }, className, 'field')} {...filterDOMProps(props)}>
      {label && <label htmlFor={id}>{label}</label>}
      {renderDropdown({
        allowedValues,
        checkboxes,
        disabled,
        id,
        placeholder,
        transform,
        value,
      })}
      {!!(error && showInlineError) && <div className="ui red basic pointing label">{errorMessage}</div>}
    </div>
  );
};
export default connectField(GoogleSelect, { kind: 'leaf' });

// import React, { useState } from 'react';
// import { Input } from 'semantic-ui-react';
// import PropTypes from 'prop-types';
// import { withRouter } from 'react-router-dom';
// import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
//
// const GoogleAutocomplete = ({ getThem }) => {
//   const [address, setAddress] = useState('');
//
//   const handleChange = (data) => {
//     setAddress(data);
//   };
//
//   const handleSelect = (data) => {
//     setAddress(data);
//     geocodeByAddress(data)
//       .then(results => getLatLng(results[0]))
//       .then(latLng => console.log('Success', latLng))
//       .catch(error => console.error('Error', error));
//   };
//
//   console.log(address);
//   return (
//     <PlacesAutocomplete
//       value={address}
//       onChange={handleChange}
//       onSelect={handleSelect}
//     >
//       {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//         <div>
//           <Input
//             {...getInputProps({
//               placeholder: 'Search Places ...',
//               className: 'location-search-input',
//             })}
//           />
//           <div className="autocomplete-dropdown-container">
//             {loading && <div>Loading...</div>}
//             {suggestions.map(suggestion => (
//               // eslint-disable-next-line react/jsx-key
//               <div {...getSuggestionItemProps(suggestion)} key={suggestion.placeId}>
//                 <span>{suggestion.description}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </PlacesAutocomplete>
//   );
// };
//
// GoogleAutocomplete.propTypes = {
//   getThem: PropTypes.func,
// };
//
// export default withRouter(GoogleAutocomplete);

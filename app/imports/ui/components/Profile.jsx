import React from 'react';
import { Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx. */
// eslint-disable-next-line no-unused-vars
const Profile = ({ profile }) => (
  <Segment>

  </Segment>
);

// Require a document to be passed to this component.
Profile.propTypes = {
  profile: PropTypes.shape({
    _id: PropTypes.string,
    interest: PropTypes.string,
    environmentalPref: String,
    availability: Date,
  }).isRequired,
};

export default Profile;

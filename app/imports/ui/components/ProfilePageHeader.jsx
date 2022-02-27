import React from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders the profilepage header. See pages/ProfilePage.jsx. */
const ProfilePageHeader = ({ linkData }) => (
  <Grid>
    <Grid.Column floated='left' width={9}>
      <Header as="h2" textAlign="right">My Profile Page </Header>
    </Grid.Column>
    <Grid.Column floated='right' width={1}>
      <Link className={COMPONENT_IDS.LIST_PROFILE_EDIT} to={`/edit-profile/${linkData._id}`}>
        <Icon name='setting' size='large'/>
      </Link>
    </Grid.Column>
  </Grid>
);

// Require a document to be passed to this component.
ProfilePageHeader.propTypes = {
  linkData: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
};
// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageHeader);

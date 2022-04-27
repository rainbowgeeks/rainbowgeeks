import React from 'react';
import { Image, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const styling = { paddingBottom: '10px' };
/** Renders the List of Organizations Associated with the User. See pages/ProfilePage.jsx. */
const ProfilePageDisplayHoursEvent = ({ Events }) => (
  <List.Item>
    <Image avatar src={Events.imageCover}/>
    <List.Content>
      <List.Header as='h4'>{Events.eventTitle}</List.Header>
      <List.Description style={styling}>
        Event started at {Events.date}
      </List.Description>
    </List.Content>
  </List.Item>
);

// Require a document to be passed to this component.
ProfilePageDisplayHoursEvent.propTypes = {
  Events: PropTypes.shape({
    eventTitle: PropTypes.string,
    date: PropTypes.string,
    endDate: PropTypes.string,
    imageCover: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageDisplayHoursEvent);

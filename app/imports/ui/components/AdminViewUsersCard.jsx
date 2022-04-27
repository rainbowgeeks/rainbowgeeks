import React from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { sortDate } from './ProfilePageAboutUser';

/** Renders a single Card Item in the ConfirmVolunteerCard, but it just confirms volunteer volunteering to the event. */
const AdminViewUsersCard = ({ UserData }) => (
  <Card color={'blue'}>
    <Card.Content>
      <Image
        src={UserData.profileImage}
        floated='right'
        size='small'
      />
      <Card.Header>{UserData.firstName} {UserData.lastName}</Card.Header>
      <Card.Meta>Availability: {sortDate(UserData.availability)}</Card.Meta>
      <Card.Meta>Interests: {UserData.specialInterest}</Card.Meta>
      <Card.Description>
        {UserData.aboutUser}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <a>
        <Icon name='building outline' />
        {UserData.numberOfOrgs} Opportunities Completed
      </a>
    </Card.Content>
    <Card.Content extra>
      <Button.Group floated="right">
        <Button positive>Edit</Button>
        <Button negative>Remove</Button>
      </Button.Group>
    </Card.Content>
  </Card>
);

// Require a document to be passed to this component.
AdminViewUsersCard.propTypes = {
  UserData: PropTypes.shape({
    numberOfOrgs: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    aboutUser: PropTypes.string,
    profileImage: PropTypes.string,
    availability: PropTypes.array,
    specialInterest: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(AdminViewUsersCard);

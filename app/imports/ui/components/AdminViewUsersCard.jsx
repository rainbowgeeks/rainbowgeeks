import React from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { showValue, sortDate } from './ProfilePageAboutUser';

/** Renders a single Card Item in the ConfirmVolunteerCard, but it just confirms volunteer volunteering to the event. */
const AdminViewUsersCard = ({ UserData }) => (
  <Card color={'blue'}>
    <Card.Content>
      <Image
        src={UserData.profileImage}
        floated='right'
        size='small'
      />
      <Card.Header style={{ marginBottom: '20px' }}>
        <u>
          {UserData.firstName} {UserData.lastName}
        </u>
      </Card.Header>
      <Card.Meta as={'h3'}>Email: {UserData.owner}</Card.Meta>
      <Card.Meta as={'h3'}>Primary Phone Number: {UserData.phoneNumber}</Card.Meta>
      <Card.Meta as={'h3'}>Date of Birth: {UserData.DOB}</Card.Meta>
    </Card.Content>
    <Card.Content as={'h4'}>
      <Card.Meta>Address: {UserData.address}</Card.Meta>
    </Card.Content>
    <Card.Content>
      <Card.Meta as={'h4'}>Interest: {showValue(UserData.interest)}</Card.Meta>
    </Card.Content>
    <Card.Content as={'h4'}>
      <Card.Meta>Availability: {sortDate(UserData.availability)}</Card.Meta>
    </Card.Content>
    <Card.Content extra>
      <a>
        <Icon name='building outline' />
        Number of Volunteers: {UserData.numberOfOrgs}
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
    owner: PropTypes.string,
    numberOfOrgs: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    aboutUser: PropTypes.string,
    profileImage: PropTypes.string,
    availability: PropTypes.array,
    interest: PropTypes.array,
    specialInterest: PropTypes.string,
    address: PropTypes.string,
    environmentalPref: PropTypes.array,
    DOB: PropTypes.string,
    phoneNumber: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(AdminViewUsersCard);

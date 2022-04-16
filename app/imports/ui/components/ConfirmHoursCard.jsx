import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const ConfirmHoursCard = ({ linkData }) => (
  <Card>
    <Card.Header textAlign='center'><strong>Volunteer Event: {linkData.oppID}</strong></Card.Header>
    <Card.Content>
      <Image className='Confirm-Hours-Card-Image'
        src={linkData.profileImage}
      />
      <Card.Header>{linkData.firstName} {linkData.lastName}</Card.Header>

      <Card.Meta>Interest: {linkData.interest}</Card.Meta>
      <Card.Meta>Environmental Preference: {linkData.environmentalPref}</Card.Meta>
      <Card.Meta>Availability: {linkData.availability}</Card.Meta>
      <Card.Meta>Phone Number: {linkData.phoneNumber}</Card.Meta>
      <Card.Meta>Email: {linkData.owner}</Card.Meta>
      <Card.Description textAlign='center' as='h3'>
        {linkData.firstName} {linkData.lastName} wants to volunteer for {linkData.oppID}.
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <div className='ui two buttons'>
        <Button positive>
                    Approve
        </Button>
        <Button negative>
                    Decline
        </Button>
      </div>
    </Card.Content>
  </Card>
);

// Require a document to be passed to this component.
ConfirmHoursCard.propTypes = {
  linkData: PropTypes.shape({
    _id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    profileImage: PropTypes.string,
    oppID: PropTypes.string,
    interest: PropTypes.array,
    environmentalPref: PropTypes.array,
    availability: PropTypes.array,
    phoneNumber: PropTypes.string,
    owner: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ConfirmHoursCard);

import React from 'react';
import { Card, Image, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { showValue, sortDate } from './ProfilePageAboutUser';

/** Renders a single Card Item in the ConfirmVolunteerCard, but it just confirms volunteer volunteering to the event. */
const ConfirmVolunteerCard = ({ linkData }) => (
  <Card centered color={'blue'}>
    <Card.Header textAlign='center'><strong>Volunteer Event Request</strong></Card.Header>
    <Card.Content>
      <Image className='Confirm-Hours-Card-Image'
        src={linkData.profileImage}
      />
      <Card.Header as='h1' textAlign='center'>{linkData.firstName} {linkData.lastName}</Card.Header>
      <Card centered>
        <Segment padded size='large'>
          <Card.Header as='h4' textAlign='left'>
              Interest:
            <Card.Meta as='h3'>
              {showValue(linkData.interest)}
            </Card.Meta>
          </Card.Header>
          <Card.Header as='h4' textAlign='left'>
            Environmental Preference:
            <Card.Meta as='h3'>
              {showValue(linkData.environmentalPref)}
            </Card.Meta>
          </Card.Header>
          <Card.Header as='h4' textAlign='left'>
            Availability:
            <Card.Meta as='h3'>
              {sortDate(linkData.availability)}
            </Card.Meta>
          </Card.Header>
          <Card.Header as='h4' textAlign='left'>
            Primary Phone Number:
            <Card.Meta as='h3'>
              {linkData.phoneNumber}
            </Card.Meta>
          </Card.Header>
          <Card.Header as='h4' textAlign='left'>
            Secondary Phone Number:
            <Card.Meta as='h3'>
              {linkData.submittedPhoneNumber}
            </Card.Meta>
          </Card.Header>
          <Card.Header as='h4' textAlign='left'>
            Email:
            <Card.Meta as='h3'>
              {linkData.phoneNumber}
            </Card.Meta>
          </Card.Header>
          <Card.Header as='h4' textAlign='left'>
            Date of Birth:
            <Card.Meta as='h3'>
              {linkData.DOB}
            </Card.Meta>
          </Card.Header>
        </Segment>
      </Card>
      <Card.Description textAlign='center' as='h3'>
        {linkData.firstName} {linkData.lastName} wants to volunteer for {linkData.title}.
      </Card.Description>
    </Card.Content>
  </Card>
);

// Require a document to be passed to this component.
ConfirmVolunteerCard.propTypes = {
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
    volunteerEmail: PropTypes.string,
    title: PropTypes.string,
    submittedPhoneNumber: PropTypes.string,
    DOB: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ConfirmVolunteerCard);

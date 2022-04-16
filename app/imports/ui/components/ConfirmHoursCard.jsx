import React, { useState } from "react";
import { Button, Card, Image, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { showValue, sortDate } from './ProfilePageAboutUser';


/** Renders a single Card Item in the ConfirmHoursCard, but it just confirms volunteer volunteering to the event. */
const ConfirmHoursCard = ({ linkData }) => {
  const confirmation = [];
  const [disablePosButton, setdisablePosButton]= useState(false);
  const [disableNegButton, setdisableNegButton]= useState(false);
  const [datas, setDatas] = useState([]);
  const Confirming = (data) => {
    setdisablePosButton(true);
    setdisableNegButton(false);

  };

  const declining = (data) => {
    setdisablePosButton(false);
    setdisableNegButton(true);

  };



  return (
    <Card centered>
      <Card.Header textAlign='center'><strong>Volunteer Event: {linkData.oppID}</strong></Card.Header>
      <Card.Content>
        <Image className='Confirm-Hours-Card-Image'
          src={linkData.profileImage}
        />
        <Card.Header as='h1' textAlign='center'>{linkData.firstName} {linkData.lastName}</Card.Header>
        <Card centered>
          <Segment padded size='large'>
              <Card.Meta as='h3'><strong>Interest:</strong> {showValue(linkData.interest)}</Card.Meta>
              <Card.Meta><strong>Environmental Preference:</strong> {showValue(linkData.environmentalPref)}</Card.Meta>
            <Card.Meta as='h3'><strong>Availability:</strong> {sortDate(linkData.availability)}</Card.Meta>
              <Card.Meta as='h3'><strong>Phone Number:</strong> {linkData.phoneNumber}</Card.Meta>
              <Card.Meta as='h3'><strong>Email:</strong> {linkData.owner}</Card.Meta>
          </Segment>
        </Card>
        <Card.Description textAlign='center' as='h3'>
          {linkData.firstName} {linkData.lastName} wants to volunteer for {linkData.oppID}.
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui two buttons'>
          <Button positive disabled={disablePosButton} onClick={() => Confirming(linkData)}>
              Approve
          </Button>
          <Button negative disabled={disableNegButton} onClick={() => declining(linkData)}>
              Decline
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

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

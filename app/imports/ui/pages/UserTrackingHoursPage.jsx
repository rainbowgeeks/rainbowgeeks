import React, { useRef } from 'react';
import {
  Container,
  Header,
  Grid,
  Segment,
  Divider, Loader, Button,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
import { PAGE_IDS } from '../utilities/PageIDs';
import ListUserHours from './ListUserHours';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { ProfilePageHours } from '../../api/profile/ProfilePageHoursCollection';
import { Hours } from '../../api/hours/HoursCollection';

/** Renders the User's Profile hours detail. */
const UserTrackingHoursPage = ({ userHours, ready, totalHours }) => {

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return ((ready) ? (
    <div ref={componentRef}>
      <Container id={PAGE_IDS.USER_TRACK_HOURS}>
        <Header as="h1" textAlign="center">My Hours</Header>
        <Divider/>
        <Grid columns={'two'} divided stackable>
          <Grid.Row>
            <Grid.Column>
              <Segment padded='very'>
                <Header as='h2' textAlign='center'>
                  Number of Volunteer: {userHours.length}
                </Header>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded='very'>
                <Header as='h2' textAlign='center'>
                  Total Hours: {totalHours}
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Segment padded='very'>
          <ListUserHours/>
        </Segment>
        <Button onClick={handlePrint}> Export as PDF </Button>
        <Container>
          <Divider/>
        </Container>
      </Container>
    </div>
  ) : <Loader active>Getting User Data!</Loader>);
};

UserTrackingHoursPage.propTypes = {
  userHours: PropTypes.array.isRequired,
  totalHours: PropTypes.number.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const subscribeUserProfile = UserProfileData.subscribeUserProfile();
  const subscribeProfilePageHour = ProfilePageHours.subscribeProfilePageHour();
  const hours = Hours.subscribeHour();
  const ready = subscribeProfilePageHour.ready() && subscribeUserProfile.ready() && hours.ready();
  const userData = UserProfileData.find({}, { sort: { lastName: 1 } }).fetch();
  const userHourData = ProfilePageHours.find({}).fetch();
  const hoursData = Hours.find({}).fetch();
  const userHours = [];
  let totalHours = 0;

  if (ready) {
    userHourData.forEach(function (items) {
      if (userData[0].owner === items.volunteerEmail) {
        for (let i = 0; i < hoursData.length; i++) {
          if (hoursData[i]._id === items.hourID) {
            Object.assign(items, { hours: hoursData[i].numberOfHours });
          }
        }
        userHours.push(items);
      }
    });
    userHours.forEach(function (items) {
      totalHours += items.hours;
    });
  }
  return {
    userHours,
    totalHours,
    ready,
  };
})(UserTrackingHoursPage);

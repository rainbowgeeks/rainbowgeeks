import React from 'react';
import {
  Container,
  Header,
  Card,
  Feed,
  Grid,
  Segment,
  List,
  Divider, Loader,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import { useParams } from 'react-router';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import ProfilePageAboutUser from '../components/ProfilePageAboutUser';
import ProfilePageUserInformation from '../components/ProfilePageUserInformation';
import ProfilePageDisplayHoursEvent from '../components/ProfilePageDisplayHoursEvent';
import ProfilePageRecentEvent from '../components/ProfilePageRecentEvent';
import ProfilePageHeader from '../components/ProfilePageHeader';
import Footer2 from '../components/Footer2';
import { ProfilePageHours } from '../../api/profile/ProfilePageHoursCollection';
import { Hours } from '../../api/hours/HoursCollection';

/** Renders the User's Profile. Profile Page is broken down into 4 components */
const ProfilePage = ({ ready, userData, userHours }) => {
  const getHours = (data) => {
    let hours = 0;
    if (data && ready) {
      data.forEach(function (items) {
        hours += items.hours;
      });
    }
    return hours;
  };
  return ((ready) ? (
    <Container id={PAGE_IDS.PROFILE_PAGE}>
      {userData.map((data) => <ProfilePageHeader key={data._id} linkData={data}/>)}
      <Container>
        <Divider/>
        <Grid columns={'three'} divided stackable>
          <Grid.Row>
            <Grid.Column>
              {userData.map((data) => <ProfilePageUserInformation key={data._id} aboutUser={data}/>)}
            </Grid.Column>
            {userData.map((data) => <ProfilePageAboutUser key={data._id} userInfo={data}/>)}
            <Grid.Column>
              <Segment padded='very'>
                <Container textAlign={'center'}>
                  <Header as='h2'> Number of Hours: {getHours(userHours)}</Header>
                  <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={'/track-hours'}>
                  Additional Information
                  </Link>
                </Container>
              </Segment>

              <Divider section/>
              <Header as='h3' textAlign='center'>Events</Header>
              <List>
                {userHours.map((data) => <ProfilePageDisplayHoursEvent key={data._id}/>)}
              </List>
              <Divider section/>
              <Card>
                <Card.Content>
                  <Card.Header>Recent Activity</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Feed>
                    <ProfilePageRecentEvent/>
                    <ProfilePageRecentEvent/>
                    <ProfilePageRecentEvent/>
                  </Feed>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <Footer2/>
    </Container>
  ) : <Loader active>Getting User Data!</Loader>);
};

ProfilePage.propTypes = {
  userData: PropTypes.array.isRequired,
  userHours: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const subscription = UserProfileData.subscribeUserProfile();
  const hoursSubscription = ProfilePageHours.subscribeProfilePageHour();
  const hours = Hours.subscribeHour();
  const ready = hoursSubscription.ready() && subscription.ready() && hours.ready();
  const userData = UserProfileData.find({}, { sort: { lastName: 1 } }).fetch();
  const userHourData = ProfilePageHours.find({}).fetch();
  const hoursData = Hours.find({}).fetch();
  const userHours = [];

  if (ready) {
    userHourData.forEach(function (items) {
      if (userData[0].owner === items.volunteerEmail) {
        userHours.push(items);
      }
    });

    userHours.forEach(function (items) {
      for (let i = 0; i < hoursData.length; i++) {
        if (hoursData[i]._id === items.hourID) {
          Object.assign(items, { hours: hoursData[i].numberOfHours });
        }
      }
    });
  }

  return {
    userData,
    userHours,
    ready,
  };
})(ProfilePage);

import React, { useState } from 'react';
import {
  Container,
  Header,
  Card,
  Feed,
  Grid,
  Segment,
  List,
  Divider, Loader, Button,
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
import { Opportunities } from '../../api/opportunity/OpportunityCollection';

/** Renders the User's Profile. Profile Page is broken down into 4 components */
const ProfilePage = ({ ready, userData, userHours }) => {
  const [myDatas, setMyDatas] = useState([]);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
  const [prevButtonDisabled, setPrevButtonDisabled] = useState(true);
  const [index, setIndex] = useState(4);
  const [prevIndex, setPrevIndex] = useState(4);
  let nums = index;
  let prev = prevIndex;
  const displayNextData = (data) => {
    if (userHours && ready) {
      prev = nums;
      nums += 4;
      if (nums >= data.length - 1) {
        nums = data.length;
        setNextButtonDisabled(true);
        setPrevButtonDisabled(false);
      } else {
        setNextButtonDisabled(false);
        setPrevButtonDisabled(false);
      }
      const copy = data.slice(prev, nums);
      setIndex(nums);
      setPrevIndex(prev);
      setMyDatas(copy);
    }
  };
  const displayPrevData = (data) => {
    if (userHours && ready) {
      nums = prev;
      prev -= 4;
      if (prev <= 0) {
        prev = 0;
        nums = 4;
        setPrevButtonDisabled(true);
        setNextButtonDisabled(false);
      } else {
        setPrevButtonDisabled(false);
        setNextButtonDisabled(false);
      }
      const copy = data.slice(prev, nums);
      setIndex(nums);
      setPrevIndex(prev);
      setMyDatas(copy);
    }
  };

  if (userData.length === 0) {
    return (
      <Container>
        <Header textAlign={'center'}>
        Account had Been Removed! Contact Admin for more information
        </Header>
      </Container>);
  }

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
              <Segment>
                <Header as='h3' textAlign='center'>Passed Events</Header>
                <List celled>
                  {(myDatas.length > 0) ? myDatas.map((data) => <ProfilePageDisplayHoursEvent key={data._id} Events={data}/>) :
                    userHours.slice(0, 4).map((data) => <ProfilePageDisplayHoursEvent key={data._id} Events={data}/>)}
                  <List.Item>
                    <List.Content>
                      <Button floated='left' circular onClick={() => displayPrevData(userHours)} disabled={prevButtonDisabled}>Prev</Button>
                      <Button floated='right' circular onClick={() => displayNextData(userHours)} disabled={nextButtonDisabled}>Next</Button>
                    </List.Content>
                  </List.Item>

                </List>
              </Segment>
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
  const subscribeOpportunity = Opportunities.subscribeOpportunity();
  const hours = Hours.subscribeHour();
  const ready = hoursSubscription.ready() && subscription.ready() && hours.ready() && subscribeOpportunity.ready();
  const userData = UserProfileData.find({}, { sort: { lastName: 1 } }).fetch();
  const userHourData = ProfilePageHours.find({}).fetch();
  const hoursData = Hours.find({}).fetch();
  const opportunities = Opportunities.find({}).fetch();
  const userHours = [];

  if (ready) {
    if (userData.length === 1) {
      userHourData.forEach(function (items) {
        if (userData[0].owner === items.volunteerEmail) {
          userHours.push(items);
        }
      });
      Object.assign(userData[0], { numberOfOrgs: userHours.length });
      userHours.forEach(function (items) {
        for (let i = 0; i < hoursData.length; i++) {
          if (hoursData[i]._id === items.hourID) {
            Object.assign(items, { hours: hoursData[i].numberOfHours });
          }
        }
        for (let i = 0; i < opportunities.length; i++) {
          if (opportunities[i]._id === items.oppID) {
            Object.assign(items, { eventTitle: opportunities[i].title });
            Object.assign(items, { date: opportunities[i].oppStart.toDateString() });
            Object.assign(items, { endDate: opportunities[i].oppEnd.toDateString() });
            Object.assign(items, { imageCover: opportunities[i].cover });
          }
        }
      });
    }
  }
  return {
    userData,
    userHours,
    ready,
  };
})(ProfilePage);

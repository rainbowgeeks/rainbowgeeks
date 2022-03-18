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
import ProfilePageAssociatedOrganization from '../components/ProfilePageAssociatedOrganization';
import ProfilePageRecentEvent from '../components/ProfilePageRecentEvent';
import ProfilePageHeader from '../components/ProfilePageHeader';
import { ProfilePageInterest } from '../../api/profile/ProfilePageInterestCollection';
import { ProfilePageEnvironmentPref } from '../../api/profile/ProfilePageEnvironementPrefCollection';

/** Renders the User's Profile. Profile Page is broken down into 4 components */
const ProfilePage = ({ ready, userDocument }) => ((ready) ? (
  <Container id={PAGE_IDS.PROFILE_PAGE}>
    {userDocument.map((data) => <ProfilePageHeader key={data._id} linkData={data}/>)}
    <Container>
      <Divider/>
      <Grid columns={'three'} divided stackable>
        <Grid.Row>
          <Grid.Column>
            {userDocument.map((data) => <ProfilePageUserInformation key={data._id} aboutUser={data}/>)}
          </Grid.Column>
          {userDocument.map((data) => <ProfilePageAboutUser key={data._id} userInfo={data}/>)}
          <Grid.Column>
            <Segment padded='very'>
              <Container textAlign={'center'}>
                <Header as='h2'>Total Hours 20</Header>
                <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={'/track-hours'}>
                  Additional Information
                </Link>
              </Container>
            </Segment>

            <Divider section/>
            <Header as='h3' textAlign='center'>Recommended Organization</Header>
            <List>
              <ProfilePageAssociatedOrganization/>
              <ProfilePageAssociatedOrganization/>
              <ProfilePageAssociatedOrganization/>
              <ProfilePageAssociatedOrganization/>
              <ProfilePageAssociatedOrganization/>
              <ProfilePageAssociatedOrganization/>
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
  </Container>
) : <Loader active>Getting User Data!</Loader>);

ProfilePage.propTypes = {
  userDocument: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const subscription = UserProfileData.subscribeUserProfile();
  const userInterestSubscription = ProfilePageInterest.subscribeProfileInterest();
  const userEnvironmentalPreference = ProfilePageEnvironmentPref.subscribeProfilePageEnvironmentPref();
  const ready = subscription.ready() && userInterestSubscription.ready() && userEnvironmentalPreference.ready();
  const userData = UserProfileData.find({}, { sort: { lastName: 1 } }).fetch();
  const userInterest = ProfilePageInterest.find().fetch();
  const userEnviroment = ProfilePageEnvironmentPref.find().fetch();
  const listInterests = [];
  const listEnviromentalPref = [];

  userInterest.forEach(function (item) {
    if (item.profileID === userData[0]._id) {
      listInterests.push(item.interest);
    }
  });

  userEnviroment.forEach(function (item) {
    if (item.profileID === userData[0]._id) {
      listEnviromentalPref.push(item.environmentPreference);
    }
  });
  const userDocument = [{ ...userData[0], listInterests, listEnviromentalPref }];
  return {
    userDocument,
    ready,
  };
})(ProfilePage);

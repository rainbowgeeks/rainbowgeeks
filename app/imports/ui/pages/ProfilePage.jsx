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

/** Renders the User's Profile. Profile Page is broken down into 4 components */
const ProfilePage = ({ ready, test }) => ((ready) ? (
  <Container id={PAGE_IDS.PROFILE_PAGE}>
    {test.map((data) => <ProfilePageHeader key={data._id} linkData={data}/>)}
    <Container>
      <Divider/>
      <Grid columns={'three'} divided stackable>
        <Grid.Row>
          <Grid.Column>
            {test.map((data) => <ProfilePageUserInformation key={data._id} aboutUser={data}/>)}
          </Grid.Column>
          {test.map((data) => <ProfilePageAboutUser key={data._id} userInfo={data}/>)}
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
            <Header as='h3' textAlign='centered'>Recommended Organization</Header>
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
  test: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const subscription = UserProfileData.subscribeUserProfile();
  const userInterestSubscription = ProfilePageInterest.subscribeProfileInterest();
  const ready = subscription.ready() && userInterestSubscription.ready();
  const userData = UserProfileData.find({}, { sort: { lastName: 1 } }).fetch();
  const userInterest = ProfilePageInterest.find().fetch();
  const interests = [];

  userInterest.forEach(function (item) {
    if (item.profileID === userData[0]._id) {
      interests.push(item.interest);
    }
  });
  const test = [{ ...userData[0], interests }];
  return {
    test,
    ready,
  };
})(ProfilePage);

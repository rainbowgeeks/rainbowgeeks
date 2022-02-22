import React from 'react';
import {
  Container,
  Header,
  Card,
  Icon,
  Feed,
  Grid,
  Segment,
  List,
  Divider, Loader,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import ProfilePageAboutUser from '../components/ProfilePageAboutUser';
import ProfilePageUserInformation from '../components/ProfilePageUserInformation';
import ProfilePageAssociatedOrganization from '../components/ProfilePageAssociatedOrganization';
import ProfilePageRecentEvent from '../components/ProfilePageRecentEvent';

/** Renders the User's Profile. Profile Page is broken down into 4 components */
const ProfilePage = ({ ready, userData }) => ((ready) ? (
  <Container id={PAGE_IDS.PROFILE_PAGE}>
    <Grid>
      <Grid.Column floated='left' width={9}>
        <Header as="h2" textAlign="right">My Profile Page </Header>
      </Grid.Column>
      <Grid.Column floated='right' width={1}>
        <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={'/edit-profile'}>
          <Icon name='setting' size='large'/>
        </Link>
      </Grid.Column>
    </Grid>

    <Container>
      <Divider/>
      <Grid columns={'three'} divided stackable>
        <Grid.Row>
          <Grid.Column>
            {/* eslint-disable-next-line react/prop-types */}
            {userData.map((data) => <ProfilePageUserInformation key={data._id} aboutUser={data}/>)}
          </Grid.Column>
          <ProfilePageAboutUser/>
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
  userData: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const subscription = UserProfileData.subscribeUserProfile();
  const ready = subscription.ready();
  const userData = UserProfileData.find({}, { sort: { lastName: 1 } }).fetch();
  return {
    userData,
    ready,
  };
})(ProfilePage);

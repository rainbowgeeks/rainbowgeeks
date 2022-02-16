import React from 'react';
import {
  Container,
  Header,
  Loader,
  Card,
  Image,
  Icon,
  Feed,
  Grid,
  Segment,
  List,
  Divider,
  Button,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Stuffs } from '../../api/stuff/StuffCollection';
// import StuffItem from '../components/StuffItem';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import ProfilePageAboutUser from '../components/ProfilePageAboutUser';
import ProfilePageUserInformation from '../components/ProfilePageUserInformation';
import ProfilePageAssociatedOrganization from '../components/ProfilePageAssociatedOrganization';
import ProfilePageRecentEvent from '../components/ProfilePageRecentEvent';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ProfilePage = ({ ready }) => ((ready) ? (
  <Container id={PAGE_IDS.PROFILE_PAGE}>
    <Grid columns={'two'} stackable>
      <Grid.Row>
        <Grid.Column>
          <Header as="h2" textAlign="right">PROFILE PAGE</Header>
        </Grid.Column>
        <Grid.Column>
          <Container textAlign='right'>
            <Button icon>
              <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={'/edit-profile'}><Icon name='setting'/>
              </Link>
            </Button>
          </Container>
        </Grid.Column>
      </Grid.Row>
    </Grid>

    <Container>
      <Divider/>
      <Grid columns={'three'} divided stackable>
        <Grid.Row>
          <ProfilePageUserInformation/>
          <ProfilePageAboutUser/>
          <Grid.Column>
            <Segment padded='very'>
              <Container textAlign={'center'}>
                <Header as='h2'>
                  Total Hours 20
                </Header>
              </Container>
            </Segment>

            <Divider section/>
            <Header as='h3'> List of Organizations</Header>
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
) : <Loader active>Loading Profile</Loader>);

// Require an array of Stuff documents in the props.
ProfilePage.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Stuffs.subscribeStuff();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const stuffs = Stuffs.find({}, { sort: { name: 1 } }).fetch();
  return {
    stuffs,
    ready,
  };
})(ProfilePage);

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
  Divider,
  Button,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import ProfilePageAboutUser from '../components/ProfilePageAboutUser';
import ProfilePageUserInformation from '../components/ProfilePageUserInformation';
import ProfilePageAssociatedOrganization from '../components/ProfilePageAssociatedOrganization';
import ProfilePageRecentEvent from '../components/ProfilePageRecentEvent';

/** Renders the User's Profile. Profile Page is broken down into 4 components */
const ProfilePage = () => (
  <Container id={PAGE_IDS.PROFILE_PAGE}>
    <Grid columns={'two'} stackable>
      <Grid.Row>
        <Grid.Column>
          <Header as="h2" textAlign="right">PROFILE PAGE</Header>
        </Grid.Column>
        <Grid.Column>
          <Container textAlign='right'>
            <Button icon>
              <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={'/edit-profile'}>
                <Icon name='setting'/>
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
          <Grid.Column>
            <ProfilePageUserInformation/>
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

          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </Container>
);

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default ProfilePage;

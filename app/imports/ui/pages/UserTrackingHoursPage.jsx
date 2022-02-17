import React from 'react';
import {
  Container,
  Header,
  Grid,
  Segment,
  Divider,
} from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';
import ListUserHours from './ListUserHours';

/** Renders the User's Profile. Profile Page is broken down into 4 components */
const UserTrackingHoursPage = () => (
  <Container id={PAGE_IDS.USER_TRACK_HOURS}>
    <Header as="h1" textAlign="centered">My Hours</Header>
    <Divider/>
    <Segment padded='very'>
      <ListUserHours/>
    </Segment>
    <Container>
      <Divider/>
      <Grid columns={'two'} divided stackable>
        <Grid.Row>
          <Grid.Column>
            <Segment padded='very'>
              <Header as='h2' textAlign='centered'>
                Number of Volunteer: 1
              </Header>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment padded='very'>
              <Header as='h2' textAlign='centered'>
                  Total Hours: 20
              </Header>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </Container>
);

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default UserTrackingHoursPage;

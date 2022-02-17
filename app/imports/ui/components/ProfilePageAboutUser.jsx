import React from 'react';
import { Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

/** Renders the column to display about the user. See pages/ProfilePage.jsx. */
const ProfilePageAboutUser = () => (
  <Grid.Column>
    <Segment>
      <Header as="h4">
        <Container textAlign='center'>
            Interest
        </Container>
      </Header>
      <Divider section/>
        Interest 1, Interest 2, Interest 3, Interest 4, Interest 5
    </Segment>
    <Segment>
      <Header as="h4">
        <Container textAlign='center'>
            Special Interest
        </Container>
      </Header>
      <Divider section/>
        Special Interest 1, Special Interest 2, Special Interest 3, Special Interest 4, Special Interest 5
    </Segment>
    <Segment>
      <Header as="h4">
        <Container textAlign='center'>
            Environmental Preference
        </Container>
      </Header>
      <Divider section/>
        Environmental Preference 1, Environmental Preference 2
    </Segment>
    <Segment>
      <Header as="h4">
        <Container textAlign={'center'}>
            Availability
        </Container>
      </Header>
      <Divider section/>
        Monday Noon, Tuesday noon , Saturday
    </Segment>
  </Grid.Column>
);

// Require a document to be passed to this component.

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageAboutUser);

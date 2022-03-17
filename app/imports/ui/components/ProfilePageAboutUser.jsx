import React from 'react';
import { Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders the column to display about the user. See pages/ProfilePage.jsx. */
const ProfilePageAboutUser = ({ userInfo }) => (
  <Grid.Column>
    <Segment>
      <Header as="h4">
        <Container textAlign='center'>
            Interest
        </Container>
      </Header>
      <Divider section/>
      <Container textAlign='center'>
        {userInfo.interests.join(', ').toString()}
      </Container>
    </Segment>
    <Segment>
      <Header as="h4">
        <Container textAlign='center'>
            Special Interest
        </Container>
      </Header>
      <Divider section/>
      <Container textAlign='center'>
        {userInfo.specialInterest}
      </Container>
    </Segment>
    <Segment>
      <Header as="h4">
        <Container textAlign='center'>
            Environmental Preference
        </Container>
      </Header>
      <Divider section/>
      <Container textAlign='center'>
        {userInfo.environmentalPref.join(', ')}
      </Container>
    </Segment>
    <Segment>
      <Header as="h4">
        <Container textAlign={'center'}>
            Availability
        </Container>
      </Header>
      <Divider section/>
      <Container textAlign={'center'}>
        {userInfo.availability.join(', ')}
      </Container>
    </Segment>
  </Grid.Column>
);

// Require a document to be passed to this component.
ProfilePageAboutUser.propTypes = {
  userInfo: PropTypes.shape({
    owner: PropTypes.string,
    specialInterest: PropTypes.string,
    environmentalPref: PropTypes.string,
    availability: PropTypes.string,
    interests: PropTypes.array,
  }).isRequired,

};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageAboutUser);

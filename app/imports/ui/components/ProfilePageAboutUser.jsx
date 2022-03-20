import React from 'react';
import { Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const sortDat = (arry) => {
  const temp = [...arry];
  const order = { sun: 0, mon: 1, tues: 2, weds: 3, thurs: 4, fri: 5, sat: 6, weekends: 7, 'week-days': 8, 'no-pref': 9 };
  const reorder = ['', '', '', '', '', '', '', '', '', ''];
  temp.forEach((item) => {
    switch (item) {
    case 'sun':
      reorder[order.sun] = 'Sunday';
      break;
    case 'mon':
      reorder[order.mon] = 'Monday';
      break;
    case 'tues':
      reorder[order.tues] = 'Tuesday';
      break;
    case 'weds':
      reorder[order.weds] = 'Wednesday';
      break;
    case 'thurs':
      reorder[order.thurs] = 'Thursday';
      break;
    case 'fri':
      reorder[order.fri] = 'Friday';
      break;
    case 'sat':
      reorder[order.sat] = 'Saturday';
      break;
    case 'weekends':
      reorder[order.weekends] = 'Weekends';
      break;
    case 'week-days':
      reorder[order['week-days']] = 'Week-days';
      break;
    case 'no-pref':
      reorder[order['no-pref']] = 'no-pref';
      break;
    default:
    }
  });
  const result = reorder.filter(element => element !== '');
  return result.join(', ');
};

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
        {userInfo.interest.sort().join(', ')}
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
        {userInfo.environmentalPref.sort().join(', ')}
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
        {
          sortDat(userInfo.availability)
        }
      </Container>
    </Segment>
  </Grid.Column>
);

// Require a document to be passed to this component.
ProfilePageAboutUser.propTypes = {
  userInfo: PropTypes.shape({
    owner: PropTypes.string,
    interest: PropTypes.array,
    specialInterest: PropTypes.string,
    environmentalPref: PropTypes.array,
    availability: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageAboutUser);

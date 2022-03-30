import React from 'react';
import { Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Sorts the array of day, in the following order { sun, mon, tues, weds, thurs, fri, sat, weekends, week-days }
 * no-pref will be filtered out unless no Availability value selected or selected 'no-pref' only
 * */
const sortDate = (arry) => {
  const temp = [...arry];
  const order = { sun: 0, mon: 1, tues: 2, weds: 3, thurs: 4, fri: 5, sat: 6, weekends: 7, 'week-days': 8, 'no-pref': 9 };
  const reorder = ['', '', '', '', '', '', '', '', '', ''];
  if (temp.length === 0 || (temp[0] === 'no-pref' && temp.length === 1)) {
    return 'no-pref';
  }
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
  const removeNoPref = result.filter(element => element !== 'no-pref');
  return removeNoPref.join(', ');
};

/** Filters out no pref if other options not selected */
const showValue = (data) => {
  const temp = [...data];
  if (temp.length === 0 || (temp[0] === 'no-pref' && temp.length === 1)) {
    return 'no-pref';
  }
  const result = temp.filter(element => element !== 'no-pref');
  return result.sort().join(', ');
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
        {showValue(userInfo.interest)}
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
        {showValue(userInfo.environmentalPref)}
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
          sortDate(userInfo.availability)
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

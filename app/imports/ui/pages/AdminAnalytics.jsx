import React from 'react';
import { Container, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const AdminAnalytics = ({ ready }) => ((ready) ? (
  <Container id={PAGE_IDS.ADMIN_ANALYTICS}>
    <Header as="h2" textAlign="center">Admin Analytics</Header>
    <table className="ui single line table">
      <thead>
        <tr>
          <th>Volunteer Name</th>
          <th>Registration Date</th>
          <th>E-mail address</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Person 1</td>
          <td>September 14, 2020</td>
          <td>person1@hawaii.edu</td>
        </tr>
        <tr>
          <td>Person 2</td>
          <td>January 11, 2022</td>
          <td>person2@hawaii.edu</td>
        </tr>
        <tr>
          <td>Person 3</td>
          <td>May 11, 2020</td>
          <td>person3@hawaii.edu</td>
        </tr>
      </tbody>
    </table>

    <table className="ui single line table">
      <thead>
        <tr>
          <th>Organization Name</th>
          <th>Registration Date</th>
          <th>E-mail address</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Organization 1</td>
          <td>September 14, 2020</td>
          <td>organization1@hawaii.edu</td>
        </tr>
        <tr>
          <td>Organization 2</td>
          <td>January 11, 2022</td>
          <td>organization2@hawaii.edu</td>
        </tr>
        <tr>
          <td>Organization 3</td>
          <td>May 11, 2020</td>
          <td>organization3@hawaii.edu</td>
        </tr>
      </tbody>
    </table>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
AdminAnalytics.propTypes = {
  opportunities: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = UserProfileData.subscribeAdminProfile();
  const subscription2 = Opportunities.subscribeOpportunityAdmin();
  // Determine if the subscription is ready
  const ready = subscription.ready() && subscription2.ready();
  // Get the Stuff documents and sort by owner then name
  const opportunities = Opportunities.find({}, { sort: { owner: 1, name: 1 } }).fetch();
  // Get the Stuff documents and sort by owner then name
  const users = UserProfileData.find({}, { sort: { owner: 1, name: 1 } }).fetch();
  // console.log(stuffs, ready);
  return {
    opportunities,
    users,
    ready,
  };
})(AdminAnalytics);

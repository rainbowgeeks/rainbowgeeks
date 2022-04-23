import React from 'react';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { OpportunityHours } from '../../api/opportunity/OpportunityHoursCollection';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { Hours } from '../../api/hours/HoursCollection';
import HoursPage from '../components/HoursPage';

const getHours = (oH, getUsers) => {
  const { _id, volunteerEmail, hourID } = oH;
  let volunteer = {};
  const hour = Hours.findDoc({ _id: hourID });
  console.log(oH);
  getUsers.forEach(function (item) {
    if (item.owner === volunteerEmail) {
      volunteer = item;
    }
  });
  console.log(volunteer);
  console.log(hour);
  const { firstName, lastName } = volunteer;
  const { numberOfHours } = hour;
  const selected = false;
  const x = _.extend({}, { _id, firstName, lastName, numberOfHours, volunteerEmail, selected });
  return x;
};

const OrganizationHoursPage = ({ opportunityHours, getUsers, ready }) => {
  let makeOppHours;
  if (opportunityHours && ready) {
    makeOppHours = opportunityHours.map(oH => getHours(oH, getUsers));
  }
  return ((ready) ? (
    <HoursPage opportunityHour={makeOppHours}/>
  ) : <Loader active>Loading Data</Loader>);
};
OrganizationHoursPage.propTypes = {
  opportunityHours: PropTypes.array.isRequired,
  getUsers: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const { _id } = useParams();
  // Get the Opportunity Hours documents
  const sub1 = OpportunityHours.subscribeHour();
  // Get the Hour documents
  const sub2 = Hours.subscribeHour();
  // Get the User Profile documents
  const sub3 = UserProfileData.subscribeAllUser();
  // Determine if all documents is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready();
  // Get the right documents
  const opportunityHours = OpportunityHours.find({ oppID: _id }).fetch();
  const getUsers = UserProfileData.find({}).fetch();
  return {
    opportunityHours,
    getUsers,
    ready,
  };
})(OrganizationHoursPage);

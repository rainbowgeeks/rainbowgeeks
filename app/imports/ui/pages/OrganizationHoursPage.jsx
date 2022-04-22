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

const getHours = (oH) => {
  const { _id, volunteerEmail, hourID } = oH;
  const volunteer = UserProfileData.findOne({ owner: volunteerEmail });
  const hour = Hours.findDoc({ _id: hourID });
  const { firstName, lastName } = volunteer;
  const { numberOfHours } = hour;
  const selected = false;
  return _.extend({}, { _id, firstName, lastName, numberOfHours, volunteerEmail, selected });
};

const OrganizationHoursPage = ({ opportunityHours, ready }) => {
  let makeOppHours;
  if (opportunityHours && ready) {
    makeOppHours = opportunityHours.map(oH => getHours(oH));
  }
  return ((ready) ? (
    <HoursPage opportunityHour={makeOppHours}/>
  ) : <Loader active>Loading Data</Loader>);
};
OrganizationHoursPage.propTypes = {
  opportunityHours: PropTypes.array.isRequired,
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
  return {
    opportunityHours,
    ready,
  };
})(OrganizationHoursPage);

import React from 'react';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { Hours } from '../../api/hours/HoursCollection';
import { ProfilePageHours } from '../../api/profile/ProfilePageHoursCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import ConfirmHour from '../components/ConfirmHour';

const getHours = (oH) => {
  const { _id, volunteerEmail, hourID, oppID } = oH;
  const volunteer = UserProfileData.findDoc({ owner: volunteerEmail });
  const hour = Hours.findDoc({ _id: hourID });
  const { firstName, lastName } = volunteer;
  const { numberOfHours } = hour;
  return _.extend({}, { _id, firstName, lastName, numberOfHours, volunteerEmail, oppID });
};

const ConfirmedHourPage = ({ opportunityHours, ready }) => {
  let makeOppHours;
  if (ready && opportunityHours) {
    makeOppHours = opportunityHours.map(oH => getHours(oH));
  }
  return ((ready) ? (
    <ConfirmHour opportunityHour={makeOppHours}/>
  ) : <Loader active>Loading Data</Loader>);
};

ConfirmedHourPage.propTypes = {
  opportunityHours: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const { _id } = useParams();
  // Get the User Profile documents
  const sub3 = UserProfileData.subscribeAllUser();
  // Get the Hour documents
  const sub2 = Hours.subscribeHour();
  // Get the User Profile documents
  const sub4 = ProfilePageHours.subscribeProfilePageHour();
  // Get the User Profile documents
  const sub5 = Opportunities.subscribeOpportunity();
  // Determine if all documents is ready
  const ready = sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready();
  // Get the right documents
  const opportunityHours = ProfilePageHours.find({ oppID: _id }).fetch();
  return {
    opportunityHours,
    ready,
  };
})(ConfirmedHourPage);

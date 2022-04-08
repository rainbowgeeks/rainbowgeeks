import React from 'react';
import { Table, Button, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { OpportunityHours } from '../../api/opportunity/OpportunityHoursCollection';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { Hours } from '../../api/hours/HoursCollection';
import HoursPage from '../components/HoursPage';

const getHours = ({ oH }) => {
  const { volunteerEmail, hourID } = oH;
  const volunteer = UserProfileData.findOne({ owner: volunteerEmail });
  const hour = Hours.findDoc({ _id: hourID });
  const { _id, firstName, lastName } = volunteer;
  const { numberOfHours } = hour;
  return _.extend({}, { _id, firstName, lastName, numberOfHours, volunteerEmail });
};

const OrganizationHoursPage = ({ opportunityHours, ready }) => {
  let makeOppHours;
  if (opportunityHours) {
    makeOppHours = opportunityHours.map(oH => getHours({ oH }));
  }
  return ((ready) ? (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>Volunteer Name</Table.HeaderCell>
          <Table.HeaderCell>E-mail Address</Table.HeaderCell>
          <Table.HeaderCell>Number of Hours</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {makeOppHours ? makeOppHours.map(mOH => <HoursPage key={mOH._id} opportunityHour={mOH}/>) : <Loader active>Loading Data</Loader>}
      </Table.Body>

      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell/>
          <Table.HeaderCell colSpan='4'>
            <Button floated='right' size='small'>Approve</Button>
            <Button floated='right' size='small'>
              Approve All
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
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

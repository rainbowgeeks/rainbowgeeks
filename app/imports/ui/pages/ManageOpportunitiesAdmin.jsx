import React from 'react';
import { Loader, Container, Header, Input, List, Card, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OpportunityHours } from '../../api/opportunity/OpportunityHoursCollection';
import { OpportunityRsvps } from '../../api/opportunity/OpportunitiesRsvpCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesPocs } from '../../api/opportunity/OpportunitiesPocCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import AdminViewOpportunitiesCard from '../components/AdminViewOpportunitiesCard';
import Footer2 from '../components/Footer2';

const getOpportunities = (ready, data) => {
  const { _id } = data;
  let oppHoursID; let oppAgeID; let oppCatID; let oppEnvID; let oppPocID;

  if (ready) {
    oppHoursID = OpportunityHours.findDoc({ oppID: _id })._id;
    oppCatID = OpportunitiesCats.findDoc({ oppID: _id })._id;
    oppEnvID = OpportunitiesEnvs.findDoc({ oppID: _id })._id;
    oppAgeID = OpportunitiesAges.findDoc({ oppID: _id })._id;
    oppPocID = OpportunitiesPocs.findDoc({ oppID: _id })._id;
  }
  return _.extend({}, data, { oppHoursID, oppCatID, oppEnvID, oppAgeID, oppPocID });
};

/** Renders a table containing all of the Opportunities documents. */
const ManageOpportunitiesAdmin = ({ ready }) => {
  const opp = Opportunities.find({}).fetch();
  const opportunity = opp.map(o => getOpportunities(ready, o));
  console.log(opportunity);
  return ((ready) ? (
    <Container id={PAGE_IDS.USER_LIBRARY_PAGE}>
      <Header as="h1" textAlign="center">Manage Profiles</Header>
      <Input fluid placeholder="Search Profiles..."/>
      <List horizontal style={{ paddingBottom: '20px' }}>
        <List.Item>
          <Header as='h4' style={{ paddingTop: '8px', width: '70px' }}>Filter By: </Header>
        </List.Item>
        <List.Item>
        </List.Item>
      </List>
      <Card.Group stackable itemsPerRow={3} style={{ width: '100%' }}>
        {opportunity.map(o => <AdminViewOpportunitiesCard key={o._id} opportunity={o}/>)}
      </Card.Group>
      <Divider/>
      <Footer2/>
    </Container>
  ) : <Loader active>Getting data</Loader>);
};

// Require an array of Stuff documents in the props.
ManageOpportunitiesAdmin.propTypes = {
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to opportunity documents.
  const sub1 = Opportunities.subscribeOpportunity();
  // Get access to opportunities environment documents.
  const sub2 = OpportunitiesEnvs.subscribeOpportunitiesEnvironment();
  // Get access to organization age documents.
  const sub3 = OpportunitiesAges.subscribeOpportunitiesAge();
  // Get access to opportunities poc documents.
  const sub4 = OpportunitiesPocs.subscribeOpportunitiesPoc();
  // Get access to opportunities category documents.
  const sub5 = OpportunitiesCats.subscribeOpportunitiesCategory();
  // Get access to opportunities rsvp documents.
  const sub6 = OpportunityRsvps.subscribeRsvp();
  // Get access to opportunities hours page.
  const sub7 = OpportunityHours.subscribeHour();
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready();
  return {
    ready,
  };
})(ManageOpportunitiesAdmin);

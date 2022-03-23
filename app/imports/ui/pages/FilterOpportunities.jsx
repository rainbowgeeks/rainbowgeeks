import React from 'react';
import { Container, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import { OpportunitiesPocs } from '../../api/opportunity/OpportunitiesPocCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import TabPanes from '../components/TabPanes';
import Footer from '../components/Footer';
//
export const schemaAge = ['Adults', 'Family-Friendly', 'Teens', 'Seniors'];
export const schemaEnv = ['Indoors', 'Mixed', 'Outdoors', 'Virtual'];
export const categories = [
  { index: 1, name: 'Crisis/Disaster Relief', icon: 'first aid' },
  { index: 2, name: 'Food Insecurity', icon: 'food' },
  { index: 3, name: 'Environment', icon: 'leaf' },
  { index: 4, name: 'Child/Family Support', icon: 'child' },
  { index: 5, name: 'Education', icon: 'graduation' },
  { index: 6, name: 'Ongoing Position', icon: 'check square' },
  { index: 7, name: 'Animal Welfare/Rescue', icon: 'paw' },
  { index: 8, name: 'Covid-19 Recovery', icon: 'heartbeat' },
];
//

const FilterOpportunities = ({ ready, opportunities }) => {
  const getOpportunities = (o) => {
    const [opportunity] = Opportunities.find({ _id: o }).fetch();
    const owner = opportunity.owner;
    const ID = _.pluck(OrganizationPocs.find({ pocEmail: owner }).fetch(), 'orgID');
    const organization = ID.map(d => Organizations.findOne({ _id: d }));
    const organizationName = _.pluck(organization, 'organizationName');
    const age = _.pluck(OpportunitiesAges.find({ oppID: o }).fetch(), 'age');
    const environment = _.pluck(OpportunitiesEnvs.find({ oppID: o }).fetch(), 'environment');
    return _.extend({}, opportunity, { age, environment, organizationName });
  };
  const makeOpportunities = opportunities.map(o => getOpportunities(o));
  const gridHeigth = { paddingRight: '50px', paddingLeft: '50px' };
  return ((ready) ? (
    <Container fluid style={gridHeigth}>
      <Header as={'h1'} textAlign={'center'} content={'Browse Opportunities'}/>
      <TabPanes opportunities={makeOpportunities} categories={categories}/>
      <Footer/>
    </Container>
  ) : <Loader active>Getting Data</Loader>);
};

// Require an array of Stuff documents in the props.
FilterOpportunities.propTypes = {
  opportunities: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

//
export default withTracker(() => {
  // Get access to opportunity documents.
  const sub1 = Opportunities.subscribeOpportunity();
  // Get access to oppAge documents.
  const sub2 = OpportunitiesAges.subscribeOpportunitiesAge();
  // Get access to oppEnvironment documents.
  const sub3 = OpportunitiesEnvs.subscribeOpportunitiesEnvironment();
  // Get access to opportunity opp Cat documents.
  const sub4 = OpportunitiesCats.subscribeOpportunitiesCategory();
  // Get access to organization documents.
  const sub5 = Organizations.subscribeOrganization();
  // Get access to opportunities poc documents.
  const sub6 = OpportunitiesPocs.subscribeOpportunitiesPoc();
  // Get access to organization poc documents.
  const sub7 = OrganizationPocs.subscribeOrganizationPoc();
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready();
  // Get all the opportunities.
  const opportunities = _.pluck(Opportunities.find({}).fetch(), '_id');
  return {
    opportunities,
    ready,
  };
})(FilterOpportunities);

import React from 'react';
import { Container, Grid, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import TabPanes from '../components/TabPanes';

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
  const gridHeigth = { paddingRight: '50px', paddingLeft: '50px' };
  return ((ready) ? (
    <Container fluid style={gridHeigth}>
      <Header as={'h1'} textAlign={'center'} content={'Browse Opportunities'}/>
      <Grid celled columns={3}>
        <Grid.Column width={4}>
          <Header
            as="h2" textAlign="center"
            content="Volunteer Opportunities"
            subheader="Powered by VolunteerAlly"
          />
          <TabPanes opportunities={opportunities} categories={categories}/>
        </Grid.Column>
      </Grid>
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
  // Get access to opportunity category documents.
  const sub2 = OpportunitiesCats.subscribeOpportunitiesCategory();
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready();
  // Get all the opportunities.
  const opportunities = Opportunities.find({}).fetch();
  return {
    opportunities,
    ready,
  };
})(FilterOpportunities);

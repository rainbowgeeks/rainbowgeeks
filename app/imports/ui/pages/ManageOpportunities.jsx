import React from 'react';
import { Loader, Container, Header, Input, List, Card, Button, Grid, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import { OpportunitiesPocs } from '../../api/opportunity/OpportunitiesPocCollection';
import { OrganizationProfiles } from '../../api/user/OrganizationProfileCollection';
import ManageOpportunity from '../components/ManageOpportunity';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Opportunities documents. */
const ManageOpportunities = ({ ready, username }) => {
  const pocIDS = _.pluck(OrganizationPocs.find({ orgEmail: username }).fetch(), 'pocID');
  const getOppIDS = _.flatten(pocIDS.map(pocID => OpportunitiesPocs.find({ pocID: pocID }).fetch()));
  const oppIDS = _.pluck(getOppIDS, 'oppID');
  const getOpp = _.uniq(oppIDS).map(oppID => Opportunities.find({ _id: oppID }).fetch());
  const opportunities = _.flatten(getOpp);
  return ((ready) ? (
    <Container id={PAGE_IDS.USER_LIBRARY_PAGE}>
      <Header as="h1" textAlign="center">Manage Opportunities</Header>
      <Input fluid placeholder="Search Profiles..."/>
      <List horizontal style={{ paddingBottom: '20px' }}>
        <List.Item>
          <Header as='h4' style={{ paddingTop: '8px', width: '70px' }}>Filter By: </Header>
        </List.Item>
        <List.Item>
          <Button compact size='small'>A-Z</Button>
        </List.Item>
        <List.Item>
          <Button compact size='small'>Category</Button>
        </List.Item>
        <List.Item>
          <Button compact size='small'>Newest</Button>
        </List.Item>
        <List.Item>
          <Button compact size='small'>Popular</Button>
        </List.Item>
      </List>
      <Card.Group stackable centered itemsPerRow={3}>
        {opportunities.map(opportunity => <ManageOpportunity key={opportunity._id} manageOpportunity={opportunity}/>)}
      </Card.Group>
      <Divider hidden></Divider>
      <Grid centered columns={1} padded>
        <Link to={'/add-opp'}>
          <Button size="big" positive>Add Opportunitiy</Button>
        </Link>
      </Grid>
    </Container>
  ) : <Loader active>Getting data</Loader>);
};

// Require an array of Stuff documents in the props.
ManageOpportunities.propTypes = {
  username: PropTypes.string,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const { username } = Meteor.user();
  // Get access to opportunity documents.
  const sub1 = Opportunities.subscribeOpportunity();
  // Get access to organization documents.
  const sub2 = Organizations.subscribeOrganization();
  // Get access to organization poc documents.
  const sub3 = OrganizationPocs.subscribeOrganizationPoc();
  // Get access to opportunities poc documents.
  const sub4 = OpportunitiesPocs.subscribeOpportunitiesPoc();
  // Determine if the subscription is ready
  const sub5 = OrganizationProfiles.subscribe();
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready();
  // Get the collections related to the organization.
  return {
    username,
    ready,
  };
})(ManageOpportunities);

import React from 'react';
import { Loader, Container, Header, Input, List, Card, Button, Grid, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import ManageOpportunity from '../components/ManageOpportunity';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Opportunities documents. */
const ManageOpportunities = ({ ready }) => {

  const organization = Meteor.user().username;
  const orgOpportunities = Opportunities.find({ owner: organization }).fetch();
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
        {orgOpportunities.map(opportunities => <ManageOpportunity key={opportunities._id} manageOpportunity={opportunities}/>)}
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
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to opportunity documents.
  const sub1 = Opportunities.subscribeOpportunity();
  // Determine if the subscription is ready
  const ready = sub1.ready();
  // Get the collections related to the organization.
  return {
    ready,
  };
})(ManageOpportunities);

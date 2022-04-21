import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Header, Input, List, Card, Dropdown, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import ManageHour from '../components/ManageHour';

const getHours = (data) => {
  const makeOpportunities = data.map(d => Opportunities.find({ owner: d }).fetch());
  return _.flatten(makeOpportunities);
};

const ManageHoursPage = ({ pocEmail, ready }) => {
  let opportunities;
  if (pocEmail && ready) {
    opportunities = getHours(pocEmail);
  }
  return ((ready) ? (
    <Container>
      <Header as="h1" textAlign="center">Organization Hours Page</Header>
      <Input fluid placeholder="Search Profiles..."/>
      <List horizontal style={{ paddingBottom: '20px' }}>
        <List.Item>
          <Header as='h4' style={{ paddingTop: '8px', width: '70px' }}>Filter By: </Header>
        </List.Item>
        <List.Item>
          <Dropdown text='Point Of Contact' pointing className='link item' button>
            <Dropdown.Menu>
              <Dropdown.Item>temp1@foo.com</Dropdown.Item>
              <Dropdown.Item>temp2@foo.com</Dropdown.Item>
              <Dropdown.Item>temp3@foo.com</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </List.Item>
        <List.Item>
          <Dropdown text='Date' pointing className='link item' button>
            <Dropdown.Menu>
              <Dropdown.Item>temp1@foo.com</Dropdown.Item>
              <Dropdown.Item>temp2@foo.com</Dropdown.Item>
              <Dropdown.Item>temp3@foo.com</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </List.Item>
        <List.Item style={{ marginLeft: '480px' }}>
          <Header as='h4' style={{ paddingTop: '8px' }}>Sort By: </Header>
        </List.Item>
        <List.Item>
          <Button compact size='small' style={{ margin: '1em .8em 0em 1em', padding: '.9em 1em .9em' }}>A-Z</Button>
        </List.Item>
        <List.Item>
          <Button compact size='small' style={{ margin: '1em .8em 0em 1m', padding: '.9em 1em .9em' }}>Category</Button>
        </List.Item>
      </List>
      <Card.Group stackable centered itemsPerRow={3}>
        {opportunities.map(opportunity => <ManageHour key={opportunity._id} opportunityHour={opportunity}/>)}
      </Card.Group>
    </Container>
  ) : <Loader active>Loading Data</Loader>);
};

ManageHoursPage.propTypes = {
  pocEmail: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  //
  const userEmail = Meteor.user().username;
  // Get access to Opportunity document
  const sub1 = Opportunities.subscribeOpportunity();
  // Get access to the OrganizationPoc document
  const sub2 = OrganizationPocs.subscribeOrganizationPoc();
  // Get all the pocEmail
  const pocEmail = _.pluck(OrganizationPocs.find({ orgEmail: userEmail }).fetch(), 'pocEmail');
  // Determine if the sub is ready
  const ready = sub1.ready() && sub2.ready();
  return {
    pocEmail,
    ready,
  };
})(ManageHoursPage);

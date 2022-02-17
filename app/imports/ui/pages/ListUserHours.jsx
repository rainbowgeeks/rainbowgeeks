import React from 'react';
import { Container, Table, Header, Icon } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';
import UserHours from '../components/UserHours';

/** Renders a table containing all of the organization, events and, hours associated with the user.
 * Use <UserHours> to render each row. */
const ListUserHours = () => (
  <Container id={PAGE_IDS.LIST_USER_HOURS}>
    <Header as="h2" textAlign="center">List of Volunteer Activity</Header>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            Event Name
            <Icon name='sort'/>
          </Table.HeaderCell>
          <Table.HeaderCell>
            Organization
            <Icon name='sort'/>
          </Table.HeaderCell>
          <Table.HeaderCell>
            Date
            <Icon name='sort'/>
          </Table.HeaderCell>
          <Table.HeaderCell>
            Hours
            <Icon name='sort'/>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <UserHours/>
        <UserHours/>
        <UserHours/>
        <UserHours/>
      </Table.Body>
    </Table>
  </Container>
);

// Require an array of Stuff documents in the props.

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default ListUserHours;

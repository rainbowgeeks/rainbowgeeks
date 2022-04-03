import React from 'react';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the UserTrackingHoursPage table. See pages/UserTrackingHoursPage.jsx. */
const UserHours = () => (
  <Table.Row>
    <Table.Cell>Event id:55762</Table.Cell>
    <Table.Cell>Organization id:77621</Table.Cell>
    <Table.Cell>Date id:88923</Table.Cell>
    <Table.Cell>Pending</Table.Cell>
    <Table.Cell>0</Table.Cell>
  </Table.Row>
);

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(UserHours);

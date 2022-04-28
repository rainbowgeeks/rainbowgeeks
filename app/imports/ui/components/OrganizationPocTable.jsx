import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const OrganizationPocTable = ({ pointOfC }) => (
  <Table.Row>
    <Table.Cell>{pointOfC.firstName} {pointOfC.lastName}</Table.Cell>
    <Table.Cell>{pointOfC.email}</Table.Cell>
    <Table.Cell>{pointOfC.phoneNumber}</Table.Cell>
  </Table.Row>
);
OrganizationPocTable.propTypes = {
  pointOfC: PropTypes.object,
};

export default withRouter(OrganizationPocTable);

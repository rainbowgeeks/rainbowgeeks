import React from 'react';
import { Checkbox, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const HoursPage = ({ opportunityHour }) => (
  <Table.Row>
    <Table.Cell collapsing>
      <Checkbox/>
    </Table.Cell>
    <Table.Cell>{opportunityHour.firstName} {opportunityHour.lastName}</Table.Cell>
    <Table.Cell>{opportunityHour.volunteerEmail}</Table.Cell>
    <Table.Cell>{opportunityHour.numberOfHours} hours</Table.Cell>
  </Table.Row>
);

HoursPage.propTypes = {
  opportunityHour: PropTypes.object.isRequired,
};

export default withRouter(HoursPage);

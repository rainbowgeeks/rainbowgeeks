import React from 'react';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

/** Renders a single row in the UserTrackingHoursPage table. See pages/UserTrackingHoursPage.jsx. */
const UserHours = ({ userHourData }) => (
  <Table.Row>
    <Table.Cell>{userHourData.title}</Table.Cell>
    <Table.Cell>{userHourData.organizationName}</Table.Cell>
    <Table.Cell>{userHourData.date}</Table.Cell>
    <Table.Cell>{userHourData.hours}</Table.Cell>
  </Table.Row>
);

UserHours.propTypes = {
  userHourData: PropTypes.shape({
    title: PropTypes.string,
    organizationName: PropTypes.string,
    date: PropTypes.string,
    hours: PropTypes.number,
  }).isRequired,
};
// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(UserHours);

import React, { useState, useEffect } from 'react';
import { Checkbox, Table } from 'semantic-ui-react';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const temp = [];

const HoursPage = ({ opportunityHour }) => {
  const [checkAll, setCheckAll] = useState(false);
  const [check, setCheck] = useState([]);

  const handleClick = (data) => {
    const { id, checked } = data.target;
    if (temp.indexOf(id) === -1) {
      temp.push(id);
      setCheck(temp);
    }
    if (!checked) {
      setCheck(check.filter(cH => cH !== id));
    }
  };
  console.log(check);
  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox
          id={opportunityHour._id}
          type={'checkbox'}
          value={opportunityHour._id}
          onChange={handleClick}
        />
      </Table.Cell>
      <Table.Cell>{opportunityHour.firstName} {opportunityHour.lastName}</Table.Cell>
      <Table.Cell>{opportunityHour.volunteerEmail}</Table.Cell>
      <Table.Cell>{opportunityHour.numberOfHours} hours</Table.Cell>
    </Table.Row>
  );
};

HoursPage.propTypes = {
  opportunityHour: PropTypes.object,
};

export default withRouter(HoursPage);

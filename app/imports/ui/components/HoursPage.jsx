import React, { useState, useEffect } from 'react';
import { Checkbox, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const HoursPage = ({ opportunityHour }) => {
  const [checkAll, setCheckAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [collection, setCollection] = useState([]);
  useEffect(() => {
    setCollection(opportunityHour);
  }, [collection]);

  const handleClickAll = () => {
    console.log(!checkAll);
    setCheckAll(!checkAll);
    setSelectedUsers(collection.map(c => c._id));
    if (checkAll) {
      setSelectedUsers([]);
    }
  };

  const handleClick = (data) => {
    const { id, checked } = data.target;
    console.log(id);
    setSelectedUsers([...selectedUsers, id]);
    if (!checked) {
      setSelectedUsers(selectedUsers.filter(cH => cH !== id));
    }
  };
  console.log(selectedUsers);
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            <Checkbox
              id="selectAll"
              onChange={handleClickAll}
              checked={checkAll}
            />
          </Table.HeaderCell>
          <Table.HeaderCell>Volunteer Name</Table.HeaderCell>
          <Table.HeaderCell>E-mail Address</Table.HeaderCell>
          <Table.HeaderCell>Number of Hours</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {collection.map(c => (
          <Table.Row key={c._id}>
            <Table.Cell>
              <Checkbox
                id={c._id}
                onChange={handleClick}
                checked={selectedUsers.includes(c._id)}
              />
            </Table.Cell>
            <Table.Cell>{c.firstName} {c.lastName}</Table.Cell>
            <Table.Cell>{c.volunteerEmail}</Table.Cell>
            <Table.Cell>{c.numberOfHours} hours</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

HoursPage.propTypes = {
  opportunityHour: PropTypes.array,
};

export default withRouter(HoursPage);

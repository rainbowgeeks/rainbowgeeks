import React, { useState, useEffect } from 'react';
import { Checkbox, Table, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { _ } from 'meteor/underscore';
import { Redirect, withRouter } from 'react-router-dom';
import { ProfilePageHours } from '../../api/profile/ProfilePageHoursCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';

const onSubmit = (data) => {
  const { volunteerEmail, numberOfHours, oppID } = data;
  const collectionName = ProfilePageHours.getCollectionName();
  const definitionData = { volunteerEmail, numberOfHours, oppID };
  defineMethod.callPromise({ collectionName, definitionData })
    .catch(error => swal('Error', error.message, 'error'))
    .then(() => {
      swal('Success', 'SuccessFully Submitted VolunteerHours', 'success');
    });
  return oppID;
};

const HoursPage = ({ opportunityHour }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
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

  const submit = () => {
    // console.log(collection, selectedUsers);
    const newCollection = collection.filter((c) => {
      if (selectedUsers.includes(c._id)) return true;
      return false;
    });
    const temp = newCollection.map(nC => onSubmit(nC));
    const oppID = _.uniq(temp);
    const collectionName = Opportunities.getCollectionName();
    oppID.forEach((oID) => {
      // console.log(oID);
      const updateData = { id: oID, checked: true };
      updateMethod.callPromise({ collectionName, updateData })
        .catch(error => swal('Error', error.message, 'error'));
      setRedirectToReferer(true);
    });

  };
  const { from } = { from: { pathname: '/org-profile' } };
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }

  const handleClick = (data) => {
    const { id, checked } = data.target;
    // console.log(id);
    setSelectedUsers([...selectedUsers, id]);
    if (!checked) {
      setSelectedUsers(selectedUsers.filter(cH => cH !== id));
    }
  };
  // console.log(selectedUsers);
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing>
            <Checkbox
              id="selectAll"
              onChange={handleClickAll}
              checked={checkAll}
              style={{ marginRight: '20px', paddingTop: '2px' }}
            />
            Check All
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
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell/>
          <Table.HeaderCell colSpan='4'>
            {/* eslint-disable-next-line no-shadow */}
            <Form.Button floated='right' size='small' onClick={submit}>
              Approve
            </Form.Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

HoursPage.propTypes = {
  opportunityHour: PropTypes.array.isRequired,
};

export default withRouter(HoursPage);

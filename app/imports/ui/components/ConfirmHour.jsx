import React, { useRef } from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

const ConfirmHour = ({ opportunityHour }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div ref={componentRef}>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Volunteer Name</Table.HeaderCell>
            <Table.HeaderCell>E-mail Address</Table.HeaderCell>
            <Table.HeaderCell>Number of Hours</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {opportunityHour.map(c => (
            <Table.Row key={c._id}>
              <Table.Cell>{c.firstName} {c.lastName}</Table.Cell>
              <Table.Cell>{c.volunteerEmail}</Table.Cell>
              <Table.Cell>{c.numberOfHours} hours</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan='4'>
              <Button onClick={handlePrint}> Export as PDF </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
};

ConfirmHour.propTypes = {
  opportunityHour: PropTypes.array.isRequired,
};

export default withRouter(ConfirmHour);

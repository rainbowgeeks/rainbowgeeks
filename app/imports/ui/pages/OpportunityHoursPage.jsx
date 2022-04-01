import React from 'react';
import { Table, Checkbox, Button, Grid } from 'semantic-ui-react';

const OrganizationHoursPage = () => (
  <Grid borderless style={{ paddingTop: '150px', paddingRight: '150px', paddingLeft: '150px' }}>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Check All<Checkbox/></Table.HeaderCell>
          <Table.HeaderCell>Volunteer Name</Table.HeaderCell>
          <Table.HeaderCell>Opportunity Date</Table.HeaderCell>
          <Table.HeaderCell>E-mail Address</Table.HeaderCell>
          <Table.HeaderCell>Number of Hours</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell collapsing>
            <Checkbox/>
          </Table.Cell>
          <Table.Cell>John Foo</Table.Cell>
          <Table.Cell>January 1, 2022</Table.Cell>
          <Table.Cell>john@foo.com</Table.Cell>
          <Table.Cell>5 hours</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>
            <Checkbox/>
          </Table.Cell>
          <Table.Cell>John Foo</Table.Cell>
          <Table.Cell>January 1, 2022</Table.Cell>
          <Table.Cell>john@foo.com</Table.Cell>
          <Table.Cell>5 hours</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>
            <Checkbox/>
          </Table.Cell>
          <Table.Cell>John Foo</Table.Cell>
          <Table.Cell>January 1, 2022</Table.Cell>
          <Table.Cell>john@foo.com</Table.Cell>
          <Table.Cell>5 hours</Table.Cell>
        </Table.Row>
      </Table.Body>

      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell/>
          <Table.HeaderCell colSpan='4'>
            <Button floated='right' size='small'>Approve</Button>
            <Button floated='right' size='small'>
              Approve All
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  </Grid>
);

export default (OrganizationHoursPage);

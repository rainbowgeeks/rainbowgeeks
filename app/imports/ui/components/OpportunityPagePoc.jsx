import React from 'react';
import { Header, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const OpportunityPagePoc = ({ poc }) => (
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.Cell style={{ borderStyle: 'none' }}>
          <Header as='h3' icon='address book outline' content='Contact Information'/>
        </Table.Cell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell style={{ borderStyle: 'none' }}>
          <Header
            as='h5' icon='user circle' content={`${poc.firstName} ${poc.lastName}`}/>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell style={{ borderStyle: 'none' }}>
          <Header as='h5' icon='mail' content={`${poc.email}`}/>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell style={{ borderStyle: 'none' }}>
          <Header as='h5' icon='phone' content={`${poc.phoneNumber}`}/>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

OpportunityPagePoc.propTypes = {
  poc: PropTypes.object.isRequired,
};

export default withRouter(OpportunityPagePoc);

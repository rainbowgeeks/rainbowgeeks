import React from 'react';
import { Button, Card, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const ManageOpportunity = ({ opportunity }) => (
  <Card>
    <Card.Content>
      <Card.Header>
        <Header>{opportunity.title}</Header>
      </Card.Header>
      <Card.Meta>
        <Header>{opportunity.date}</Header>
      </Card.Meta>
    </Card.Content>
    <Card.Content extra>
      <Card.Description>
        <Header icon='user' content={opportunity.owner}/>
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Button.Group fluid>
        <Button positive>Edit</Button>
        <Button negative>Delete</Button>
      </Button.Group>
    </Card.Content>
  </Card>
);

ManageOpportunity.propTypes = {
  opportunity: PropTypes.object.isRequired,
};

export default withRouter(ManageOpportunity);

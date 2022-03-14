import React from 'react';
import { Button, Card, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const ManageOpportunity = ({ manageOpportunity }) => {
  return (
    <Card id={COMPONENT_IDS.MANAGE_OPPORTUNITY}>
      <Card.Content>
        <Card.Header>
          <Header>{manageOpportunity.title}</Header>
        </Card.Header>
        <Card.Meta>
          <Header>{manageOpportunity.date}</Header>
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>
          <Header icon='user' content={manageOpportunity.owner}/>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group fluid>
          <Button positive href={`#/edit-opp/${manageOpportunity._id}`}>Edit</Button>
          <Button negative>Delete</Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};
ManageOpportunity.propTypes = {
  manageOpportunity: PropTypes.object.isRequired,
};

export default withRouter(ManageOpportunity);

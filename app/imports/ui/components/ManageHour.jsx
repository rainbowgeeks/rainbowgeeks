import React from 'react';
import { Card, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const ManageHour = ({ opportunityHour }) => (
  <Card href={`#/org-hours/${opportunityHour._id}`}>
    <Card.Content>
      <Card.Header>
        <Header>{opportunityHour.title}</Header>
      </Card.Header>
      <Card.Meta>
        <Header>{opportunityHour.date}</Header>
      </Card.Meta>
    </Card.Content>
    <Card.Content extra>
      <Card.Description>
        <Header icon='user' content={opportunityHour.owner}/>
      </Card.Description>
    </Card.Content>
  </Card>
);

ManageHour.propTypes = {
  opportunityHour: PropTypes.object,
};

export default withRouter(ManageHour);

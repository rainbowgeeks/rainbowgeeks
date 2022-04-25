import React from 'react';
import { Card, GridRow, Label } from 'semantic-ui-react';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const Opportunity = ({ opportunity }) => (
  <Card fluid href={`#/event/${opportunity._id}`}>
    <Card.Content style={{
      backgroundImage: `url("${opportunity.cover}")`,
      backgroundPosition: 'left 40px top -10px',
    }}>
      <Card.Header className={'card-content-spacing'}>Date: {`${opportunity.oppStart.toDateString('en-US')}`}</Card.Header>
      <Card.Header>{opportunity.title}</Card.Header>
      <Card.Description style={{ marginTop: '10px' }}>
        Address: {opportunity.location}
      </Card.Description>
      <Card.Meta>
        <GridRow style={{ marginTop: '10px', marginBottom: '5px' }}>
          Age: {_.map(opportunity.age, (age, index) => <Label key={index} size='tiny' color='teal'>{age}</Label>)}
        </GridRow>
        <GridRow>
          Environment: {_.map(opportunity.environment, (environment, index) => <Label key={index} size='tiny' color='teal'>{environment}</Label>)}
        </GridRow>
      </Card.Meta>
    </Card.Content>
    <Card.Content fluid='true' extra>
      <br/>
      <br/>
    </Card.Content>
  </Card>
);

// Require a document to be passed to this component.
Opportunity.propTypes = {
  opportunity: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Opportunity);

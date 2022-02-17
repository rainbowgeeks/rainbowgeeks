import React from 'react';
import { Card, GridRow } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/BrowseOpportunity.jsx. */
const Opportunity = ({ opportunity }) => (
  <Card fluid href={`#/event/${opportunity._id}`}>
    <Card.Content style={{
      backgroundImage: `url("${opportunity.cover}")`,
    }}>
      <Card.Header className={'card-content-spacing'}>Date: {opportunity.date}</Card.Header>
      <Card.Header>{opportunity.title}</Card.Header>
      <Card.Description className={'card-content-spacing'}>
        Address:  {opportunity.location}
      </Card.Description>
      <Card.Meta>
        <GridRow>
          Age: {opportunity.age}
        </GridRow>
        <GridRow>
          Category: {opportunity.category}
        </GridRow>
        <GridRow>
          Environment: {opportunity.environment}
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

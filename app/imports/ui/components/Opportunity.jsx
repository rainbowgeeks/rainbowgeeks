import React from 'react';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const seetru = { backgroundImage: 'url("https://react.semantic-ui.com/images/avatar/large/daniel.jpg")' };

/** Renders a single row in the List Stuff table. See pages/BrowseOpportunity.jsx. */
const Opportunity = ({ opportunity }) => (
  <Card href='#'>
    <Card.Content style={seetru}>
      <Card.Header>{opportunity.title}</Card.Header>
      <Card.Meta>{opportunity.age}</Card.Meta>
      <Card.Description>{opportunity.location}</Card.Description>
    </Card.Content>
    <Card.Content extra>{opportunity.category}</Card.Content>
    <Card.Content extra>{opportunity.environment}</Card.Content>
  </Card>
);

// Require a document to be passed to this component.
Opportunity.propTypes = {
  opportunity: PropTypes.shape({
    title: PropTypes.string,
    typ: PropTypes.string,
    category: PropTypes.string,
    age: PropTypes.string,
    environment: PropTypes.string,
    location: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Opportunity);

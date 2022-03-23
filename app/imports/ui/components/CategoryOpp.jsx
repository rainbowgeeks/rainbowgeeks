import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const CategoryOpp = ({ category }) => (
  <Card.Group>
    <Card fluid href='#'>
      <Card.Content>
        <Card.Header><Icon name={`${category.icon}`}/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>{category.name}</Card.Description>
        <Card.Meta>{category.total.length} Listings</Card.Meta>
      </Card.Content>
    </Card>
  </Card.Group>
);
CategoryOpp.propTypes = {
  category: PropTypes.object.isRequired,
};
export default withRouter(CategoryOpp);

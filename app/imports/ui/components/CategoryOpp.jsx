import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const CategoryOpp = ({ categories }) => {
  console.log(categories);
  return (
    <Card.Group>
      <Card fluid href='#'>
        <Card.Content>
          <Card.Header><Icon name={`${categories.icon}`}/></Card.Header>
        </Card.Content>
        <Card.Content extra>
          <Card.Description>{categories.name}</Card.Description>
          <Card.Meta>{categories.total.length} Listings</Card.Meta>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

CategoryOpp.propTypes = {
  categories: PropTypes.object.isRequired,
};

export default withRouter(CategoryOpp);

import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const CategoryOpp = ({ category, setKey }) => {
  const submit = (data) => {
    setKey({ category: data });
  };
  return (
    <Card.Group>
      <Card fluid onClick={() => submit(category.category)}>
        <Card.Content>
          <Card.Header><Icon name={`${category.icon}`}/></Card.Header>
        </Card.Content>
        <Card.Content extra>
          <Card.Description>{category.category}</Card.Description>
          <Card.Meta>{category.total.length} Listings</Card.Meta>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};
CategoryOpp.propTypes = {
  setKey: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
};
export default withRouter(CategoryOpp);

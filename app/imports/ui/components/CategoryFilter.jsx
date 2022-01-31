import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const CategoryFilter = () => (
  <Card.Group>
    <Card href='#'>
      <Card.Content>
        <Card.Header><Icon name='first aid'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Crisis/Disaster Relief</Card.Description>
        <Card.Meta>11 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card href='#'>
      <Card.Content>
        <Card.Header><Icon name='first aid'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Crisis/Disaster Relief</Card.Description>
        <Card.Meta>11 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card href='#'>
      <Card.Content>
        <Card.Header><Icon name='first aid'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Crisis/Disaster Relief</Card.Description>
        <Card.Meta>11 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card href='#'>
      <Card.Content>
        <Card.Header><Icon name='first aid'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Crisis/Disaster Relief</Card.Description>
        <Card.Meta>11 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card href='#'>
      <Card.Content>
        <Card.Header><Icon name='first aid'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Crisis/Disaster Relief</Card.Description>
        <Card.Meta>11 Listings</Card.Meta>
      </Card.Content>
    </Card>
  </Card.Group>
);

export default withRouter(CategoryFilter);

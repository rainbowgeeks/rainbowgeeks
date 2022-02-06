import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const CategoryOpp = () => (
  <Card.Group >
    <Card fluid href='#'>
      <Card.Content>
        <Card.Header><Icon name='first aid'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Crisis/Disaster Relief</Card.Description>
        <Card.Meta>11 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card fluid href='#'>
      <Card.Content>
        <Card.Header><Icon name='food'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Food Security</Card.Description>
        <Card.Meta>10 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card fluid href='#'>
      <Card.Content>
        <Card.Header><Icon name='leaf'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Environment</Card.Description>
        <Card.Meta>9 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card fluid href='#'>
      <Card.Content>
        <Card.Header><Icon name='child'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Child/Family-Support</Card.Description>
        <Card.Meta>4 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card fluid href='#'>
      <Card.Content>
        <Card.Header><Icon name='graduation'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Education</Card.Description>
        <Card.Meta>4 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card fluid href='#'>
      <Card.Content>
        <Card.Header><Icon name='check square'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Ongoing Position</Card.Description>
        <Card.Meta>2 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card fluid href='#'>
      <Card.Content>
        <Card.Header><Icon name='paw'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>Animal Welfare/Rescue</Card.Description>
        <Card.Meta>1 Listings</Card.Meta>
      </Card.Content>
    </Card>
    <Card fluid href='#'>
      <Card.Content>
        <Card.Header><Icon name='heartbeat'/></Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Description>COVID-19 Recovery</Card.Description>
        <Card.Meta>1 Listings</Card.Meta>
      </Card.Content>
    </Card>
  </Card.Group>
);

export default withRouter(CategoryOpp);

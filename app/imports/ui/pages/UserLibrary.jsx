import React from 'react';
import { Loader, Container, Header, Input, List, Card, Button, Image, Icon, Divider, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const UserLibrary = ({ ready }) => ((ready) ? (
  <Container id={PAGE_IDS.USER_LIBRARY_PAGE}>
    <Header as="h1" textAlign="center">Profiles Library</Header>
    <Input fluid placeholder="Search Profiles..."/>
    <List horizontal style={{ paddingBottom: '20px' }}>
      <List.Item>
        <Header as='h4' style={{ paddingTop: '8px', width: '70px' }}>Filter By: </Header>
      </List.Item>
      <List.Item>
        <Button compact size='small'>A-Z</Button>
      </List.Item>
      <List.Item>
        <Button compact size='small'>Category</Button>
      </List.Item>
      <List.Item>
        <Button compact size='small'>Newest</Button>
      </List.Item>
      <List.Item>
        <Button compact size='small'>Popular</Button>
      </List.Item>
    </List>
    <Card.Group stackable centered itemsPerRow={3}>
      <Card>
        <Image src='/images/meteor-logo.png' fluid wrapped ui={false} />
        <Card.Content>
          <Card.Header>Person 1</Card.Header>
          <Card.Meta>ICS Major</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='calendar alternate outline' />
              5 Opportunities Completed
          </a>
          <Button.Group floated="right" compact>
            <Button positive>Edit</Button>
            <Button negative>Delete</Button>
          </Button.Group>
        </Card.Content>
      </Card>

      <Card>
        <Image src='/images/meteor-logo.png' fluid wrapped ui={false} />
        <Card.Content>
          <Card.Header>Person 2</Card.Header>
          <Card.Meta>Japanese Major</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='calendar alternate outline' />
              3 Opportunities Completed
          </a>
          <Button.Group floated="right" compact>
            <Button positive>Edit</Button>
            <Button negative>Delete</Button>
          </Button.Group>
        </Card.Content>
      </Card>

      <Card>
        <Image src='/images/meteor-logo.png' fluid wrapped ui={false} />
        <Card.Content>
          <Card.Header>Person 3</Card.Header>
          <Card.Meta>American Studies Major</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='calendar alternate outline' />
              7 Opportunities Completed
          </a>
          <Button.Group floated="right" compact>
            <Button positive>Edit</Button>
            <Button negative>Delete</Button>
          </Button.Group>
        </Card.Content>
      </Card>
    </Card.Group>
    <Divider hidden></Divider>
    <Grid centered columns={1} padded>
      <Button size="big" positive>Add Profile</Button>
    </Grid>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
UserLibrary.propTypes = {
  opportunities: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to opportunity documents.
  const subscription = Opportunities.subscribeOpportunity();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Opportunity documents
  const users = Opportunities.find({}).fetch();
  return {
    users,
    ready,
  };
})(UserLibrary);

import React from 'react';
import { Loader, Container, Header, Input, List, Card, Button, Image, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Stuffs } from '../../api/stuff/StuffCollection';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ManageOrganizations = ({ ready, stuffs }) => ((ready) ? (
  <Container id={PAGE_IDS.ORG_LIBRARY_PAGE}>
    <Header as="h1" textAlign="center">Organization Library</Header>
    <Input fluid placeholder="Search Organizations..."/>
    <List horizontal style={{ paddingBottom: '20px' }}>
      <List.Item>
        <Header inverted as='h4' style={{ paddingTop: '8px', width: '70px', color: 'white' }}>Filter By: </Header>
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
          <Card.Header>Habitat For Humanity</Card.Header>
          <Card.Meta>Housing Assistance</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='calendar alternate outline' />
              10 Opportunities
          </a>
        </Card.Content>
      </Card>

      <Card>
        <Image src='/images/meteor-logo.png' fluid wrapped ui={false} />
        <Card.Content>
          <Card.Header>American Red Cross</Card.Header>
          <Card.Meta>Crisis/Disaster Relief, Family Support</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='calendar alternate outline' />
              15 Opportunities
          </a>
        </Card.Content>
      </Card>

      <Card>
        <Image src='/images/meteor-logo.png' fluid wrapped ui={false} />
        <Card.Content>
          <Card.Header>Salvation Army</Card.Header>
          <Card.Meta>Crisis/Disaster Relief, Family Support</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='calendar alternate outline' />
              20 Opportunities
          </a>
        </Card.Content>
      </Card>
    </Card.Group>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
ManageOrganizations.propTypes = {
  opportunities: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Stuffs.subscribeStuffAdmin();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort by owner then name
  const stuffs = Stuffs.find({}, { sort: { owner: 1, name: 1 } }).fetch();
  // console.log(stuffs, ready);
  return {
    stuffs,
    ready,
  };
})(ManageOrganizations);

import React from 'react';
import { Loader, Container, Header, Input, List, Button, Item, Grid, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { NavLink } from 'react-router-dom';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const OrgEvents = ({ ready }) => ((ready) ? (
  <Container id={PAGE_IDS.ORG_LIBRARY_PAGE}>
    <Header as="h1" textAlign="center">Manage Opportunities</Header>
    <Input fluid placeholder="Search Opportunities..."/>
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
        <Button compact size='small'>Age</Button>
      </List.Item>
      <List.Item>
        <Button compact size='small'>Environment</Button>
      </List.Item>
      <List.Item>
        <Button compact size='small'>Newest</Button>
      </List.Item>
    </List>
    <Item.Group>
      <Item>
        <Item.Image size='tiny' src='/images/meteor-logo.png'/>
        <Item.Content>
          <Item.Header>Title</Item.Header>
          <Item.Meta>
            <span>date</span>
            <span>address</span>
          </Item.Meta>
          <Item.Description>Description</Item.Description>
          <Item.Extra>
            <span>age</span>
            <span>category</span>
            <span>environment</span>
            <Button floated='right' negative>Delete</Button>
            <Button floated='right' positive>Edit</Button>
          </Item.Extra>
        </Item.Content>
      </Item>

      <Item>
        <Item.Image size='tiny' src='/images/meteor-logo.png'/>
        <Item.Content>
          <Item.Header>Title</Item.Header>
          <Item.Meta>
            <span>date</span>
            <span>address</span>
          </Item.Meta>
          <Item.Description>Description</Item.Description>
          <Item.Extra>
            <span>age</span>
            <span>category</span>
            <span>environment</span>
            <Button floated='right' negative>Delete</Button>
            <Button floated='right' positive>Edit</Button>
          </Item.Extra>
        </Item.Content>
      </Item>

      <Item>
        <Item.Image size='tiny' src='/images/meteor-logo.png'/>
        <Item.Content>
          <Item.Header>Title</Item.Header>
          <Item.Meta>
            <span>date</span>
            <span>address</span>
          </Item.Meta>
          <Item.Description>Description</Item.Description>
          <Item.Extra>
            <span>age</span>
            <span>category</span>
            <span>environment</span>
            <Button floated='right' negative>Delete</Button>
            <Button floated='right' positive>Edit</Button>
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
    <Divider hidden/>
    <Grid centered columns={1} padded>
      <Button as={NavLink} exact to={'edit-opp/:_id'} size="big" positive>Add Opportunity</Button>
    </Grid>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
OrgEvents.propTypes = {
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
})(OrgEvents);

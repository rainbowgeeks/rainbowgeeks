import React from 'react';
import { Loader, Image, Label, Grid, Menu, Table, Icon, Divider, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const AdminProfile = ({ ready }) => ((ready) ? (
  <Grid id={PAGE_IDS.ADMIN_PROFILE} columns={3} celled container>
    <Grid.Column textAlign='center' width={5}>
      <Image src='/images/meteor-logo.png' size='medium' circular centered/>
      <Divider hidden/>
      <Label size='big' circular>Administrator</Label>
    </Grid.Column>
    <Grid.Column width={8}>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan='2'>Account</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>Username</Table.Cell>
            <Table.Cell>
              johnd
              <Button compact floated='right'>Edit</Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Password</Table.Cell>
            <Table.Cell>
              ********
              <Button compact floated='right'>Edit</Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>
              John Doe
              <Button compact floated='right'>Edit</Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Email</Table.Cell>
            <Table.Cell>
              johndoe@foo.com
              <Button compact floated='right'>Edit</Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Address</Table.Cell>
            <Table.Cell>
              1234 Dole Street
              <Button compact floated='right'>Edit</Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Icon name='github' /> GitHub
            </Table.Cell>
            <Table.Cell>
              johnd
              <Button compact floated='right'>Edit</Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Icon name='twitter' /> Twitter
            </Table.Cell>
            <Table.Cell>
              johnd
              <Button compact floated='right'>Edit</Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Grid.Column>
    <Grid.Column width={3}>
      <Menu vertical fluid>
        <Menu.Item header>Site Contents</Menu.Item>
        <Menu.Item as={NavLink} exact to="/manage-user">Manage Users</Menu.Item>
        <Menu.Item as={NavLink} exact to="/manage-org">Manage Organizations</Menu.Item>
        <Menu.Item>Manage Opportunities</Menu.Item>
        <Menu.Item>Site Preferences</Menu.Item>
        <Menu.Item>Analytics</Menu.Item>
      </Menu>
    </Grid.Column>
  </Grid>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
AdminProfile.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
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
})(AdminProfile);

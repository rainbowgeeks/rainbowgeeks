import React from 'react';
import { Loader, Image, Label, Grid, Segment, Table, Icon, Divider } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const AdminProfile = ({ stuffs, ready }) => ((ready) ? (
  <Grid id={PAGE_IDS.ADMIN_PROFILE} columns={2} celled container>
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
            <Table.Cell>johnd</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>John Doe</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Email</Table.Cell>
            <Table.Cell>johndoe@foo.com</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Address</Table.Cell>
            <Table.Cell>1234 Dole Street</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Icon name='github' /> GitHub
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Icon name='twitter' /> Twitter
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Grid.Column>
    <Grid.Column>
      <Segment>Content</Segment>
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

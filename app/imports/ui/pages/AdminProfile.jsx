import React from 'react';
import { Loader, Image, Label, Grid, Menu, Divider} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const AdminProfile = ({ ready }) => ((ready) ? (
  <Grid id={PAGE_IDS.ADMIN_PROFILE} columns={3} padded='vertically' container>
    <Grid.Column textAlign='center' width={5}>
      <Image src='/images/meteor-logo.png' size='medium' circular centered/>
      <Divider hidden/>
      <Label size='big' circular>Administrator</Label>
    </Grid.Column>
    <Grid.Column width={3}>
      <Menu vertical fluid>
        <Menu.Item header>Site Contents</Menu.Item>
        <Menu.Item as={NavLink} exact to="/manage-user">Manage Users</Menu.Item>
        <Menu.Item as={NavLink} exact to="/manage-org">Manage Organizations</Menu.Item>
        <Menu.Item as={NavLink} exact to="/manage-opps">Manage Opportunities</Menu.Item>
        <Menu.Item>Site Preferences</Menu.Item>
      </Menu>
      <Menu vertical fluid>
        <Menu.Item header>Admin Tools</Menu.Item>
        <td onClick={() => window.open('https://analytics.google.com/', '_blank')}><Menu.Item>Google Analytics</Menu.Item></td>
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

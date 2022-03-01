import React from 'react';
import { Image, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const styling = { paddingBottom: '10px' };
/** Renders the List of Organizations Associated with the User. See pages/ProfilePage.jsx. */
const ProfilePageAssociatedOrganization = () => (
  <List.Item>
    <Image avatar src='/images/red-cross.jpg'/>
    <List.Content>
      <List.Header as='a'>The American Red Cross of Hawaii</List.Header>
      <List.Description style={styling}>
        Last seen watching{' '}
        <a>
          <b>Arrested Development</b>
        </a>{' '}
        just now.
      </List.Description>
    </List.Content>
  </List.Item>
);

// Require a document to be passed to this component.

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageAssociatedOrganization);

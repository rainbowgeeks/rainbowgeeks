import React from 'react';
import { Feed } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders the List of Recent events associated with the user. See pages/ProfilePage.jsx. */
const ProfilePageRecentEvent = () => (

  <Feed.Event>
    <Feed.Label image='/images/meteor-logo.png'/>
    <Feed.Content>
      <Feed.Date content='1 day ago'/>
      <Feed.Summary>
          You added <a>Jenny Hess</a> to your <a>coworker</a> group.
      </Feed.Summary>
    </Feed.Content>
  </Feed.Event>
);

// Require a document to be passed to this component.

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageRecentEvent);

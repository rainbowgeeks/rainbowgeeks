import React from 'react';
import { Message } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';

const NeedRsvp = () => (
  <Message>
    <Message.Header>Need to log-in to RSVP</Message.Header>
    <Link to={'/signin'}>Log-in</Link>
  </Message>
);

export default withRouter(NeedRsvp);

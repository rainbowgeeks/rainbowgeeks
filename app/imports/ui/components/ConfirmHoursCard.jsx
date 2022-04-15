import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const ConfirmHoursCard = () => (
  <Card>
    <Card.Content>
      <Image
        floated='right'
        size='large'
        src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
      />
      <Card.Header>Steve Sanders</Card.Header>
      <Card.Meta>Friends of Elliot</Card.Meta>
      <Card.Description>
                Steve wants to add you to the group <strong>best friends</strong>
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <div className='ui two buttons'>
        <Button basic color='green'>
                    Approve
        </Button>
        <Button basic color='red'>
                    Decline
        </Button>
      </div>
    </Card.Content>
  </Card>
);

// Require a document to be passed to this component.
ConfirmHoursCard.propTypes = {

};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ConfirmHoursCard);

import React from 'react';
import { Container, Header, Loader, Input, List, Button, Card, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { PAGE_IDS } from '../utilities/PageIDs';
import ConfirmHoursCard from '../components/ConfirmHoursCard';
import Footer2 from '../components/Footer2';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ConfirmHoursPage = () => (
  <Container id={PAGE_IDS.CONFIRM_HOURS}>
    <Header as="h2" textAlign="center">Confirm Hours</Header>
    <Input fluid placeholder="Search for Registered Volunteers..."/>
    <List horizontal style={{ paddingBottom: '20px' }}>
      <List.Item>
        <Header as='h4' style={{ paddingTop: '8px', width: '70px' }}>Filter By: </Header>
      </List.Item>
      <List.Item>
        <Button compact size='small'>A-Z</Button>
      </List.Item>
    </List>
    <Card.Group style={{ marginBottom: '8px' }} stackable itemsPerRow={4}>
      <ConfirmHoursCard/>
      <ConfirmHoursCard/>
      <ConfirmHoursCard/>
      <ConfirmHoursCard/>
      <ConfirmHoursCard/>
      <ConfirmHoursCard/>
      <ConfirmHoursCard/>
    </Card.Group>
    <Button floated={'right'} icon labelPosition='right'>
      <Icon name='right arrow' />
          Confirm Volunteer Registration
    </Button>
    <Footer2/>
  </Container>
);

// Require an array of Stuff documents in the props.
ConfirmHoursPage.propTypes = {

};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.

})(ConfirmHoursPage);

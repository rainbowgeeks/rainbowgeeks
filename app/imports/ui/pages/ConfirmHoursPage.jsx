import React from 'react';
import { Container, Header, Loader, Input, List, Button, Card, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { PAGE_IDS } from '../utilities/PageIDs';
import ConfirmHoursCard from '../components/ConfirmHoursCard';
import Footer2 from '../components/Footer2';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { OpportunityRsvps } from '../../api/opportunity/OpportunitiesRsvpCollection';
import { Opportunities } from "../../api/opportunity/OpportunityCollection";

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ConfirmHoursPage = ({ ready, finalData }) => ((ready) ? (
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
    <Card.Group style={{ marginBottom: '8px' }} stackable itemsPerRow={3}>
      {finalData.map((data) => <ConfirmHoursCard key={data.oppID} linkData={data}/>)}
    </Card.Group>
    <Button floated={'right'} icon labelPosition='right'>
      <Icon name='right arrow' />
          Confirm Volunteer Registration
    </Button>
    <Footer2/>
  </Container>
) : <Loader active>Getting User Data!</Loader>);

// Require an array of Stuff documents in the props.
ConfirmHoursPage.propTypes = {
  finalData: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.

  const volunteers = UserProfileData.subscribeAllUser();
  const rsvp = OpportunityRsvps.subscribeRsvp();
  const opps = Opportunities.subscribeOpportunity();
  const ready = volunteers.ready() && rsvp.ready() && opps.ready();
  const testRsv = OpportunityRsvps.find({}).fetch();
  const testOpps = Opportunities.find({}).fetch();
  const data = [];
  const finalData = [];
  let temp = {};
  const getRsvp = _.pluck(testRsv, 'volunteerID');
  console.log(testOpps);
  getRsvp.forEach(element => data.push(UserProfileData.findDoc(element)));
  for (let x = 0; x < testRsv.length; x++) {
    if (testRsv[x].volunteerID === data[x]._id) {
      console.log(testRsv[x]);
      console.log(data[x]);
      temp = Object.assign(testRsv[x], data[x]);
      finalData.push(temp);
    }
  }

  console.log(finalData);

  return {
    ready,
    finalData,
  };

})(ConfirmHoursPage);

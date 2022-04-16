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
  // Subscribe to the collection we will need
  const volunteers = UserProfileData.subscribeAllUser();
  const rsvp = OpportunityRsvps.subscribeRsvp();
  // Wait for the page subscribe to the collections
  const ready = volunteers.ready() && rsvp.ready();
  // fetch everything in the OpportunityRsvps collection
  const testRsv = OpportunityRsvps.find({}).fetch();
  // a temporary variable to hold OpportunityRsvps plucked volunteer IDs
  const data = [];
  // the data to be passed when this is done
  const finalData = [];
  // A temporary object to store result when combining profileCollection and OpportunityRsvps collection based on matching profile ID and volunteer ID
  let temp = {};
  // pluck the volunteer ID from rsvp, then store into getRsvp
  const getRsvp = _.pluck(testRsv, 'volunteerID');
  // for each element in the getRSVP array, add to the end of data array, the collections that contains the element at i=0 up to i=max
  getRsvp.forEach(element => data.push(UserProfileData.findDoc(element)));
  // for loop to combine the items in data that is containing an array of profileDatas
  for (let x = 0; x < testRsv.length; x++) {
    // if the item at testRsV[x].volunteerID is equal data[x]._id
    if (testRsv[x].volunteerID === data[x]._id) {
      // the logs just checks that They do match the ids
      //console.log(testRsv[x]);
      //console.log(data[x]);
      // merge the two matching objects and store into temp
      temp = Object.assign(testRsv[x], data[x]);
      // add to array finalDAta
      finalData.push(temp);
    }
  }
  // print the final result to pass to the confirmcard component
  //console.log(finalData);
  return {
    ready,
    finalData,
  };

})(ConfirmHoursPage);

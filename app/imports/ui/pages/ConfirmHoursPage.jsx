import React from 'react';
import { Container, Header, Loader, Input, List, Button, Card, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { PAGE_IDS } from '../utilities/PageIDs';
import ConfirmHoursCard from '../components/ConfirmHoursCard';
import Footer2 from '../components/Footer2';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { OpportunityRsvps } from '../../api/opportunity/OpportunitiesRsvpCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';

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
      {finalData.map((element) => <ConfirmHoursCard key={element.index} linkData={element}/>)}
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
  const volunteers = UserProfileData.subscribeAllUser();
  const rsvp = OpportunityRsvps.subscribeRsvp();
  const opps = Opportunities.subscribeOpportunity();
  const ready = volunteers.ready() && rsvp.ready() && opps.ready();
  const testRsv = OpportunityRsvps.find({}).fetch();
  const testVol = UserProfileData.find({}).fetch();
  const testOpps = Opportunities.find({}).fetch();
  const tempData = [];
  const finalData = [];
  let tempDataObj = {};
  let finalDataObj = {};
  let index = 0;
  if (ready) {
    testRsv.forEach(function (element) {
      for (let x = 0; x < testVol.length; x++) {
        if (element.volunteerID === testVol[x]._id) {
          tempDataObj = Object.assign(element, testVol[x]);
          tempData.push(tempDataObj);
        }
      }
    });
    tempData.forEach(function (item) {
      for (let x = 0; x < testOpps.length; x++) {
        if (item.oppID === testOpps[x]._id) {
          finalDataObj = Object.assign(item, testOpps[x]);
          finalData.push(finalDataObj);
        }
      }
    });
    finalData.sort((a, b) => a.lastName - b.lastName);
    console.log(finalData);
    finalData.forEach(function (items) {
      Object.assign(items, { index: index });
      index++;
    });
  }
  return {
    ready,
    finalData,
  };

})(ConfirmHoursPage);

import React from 'react';
import { Container, Header, Loader, Input, List, Button, Card, Icon, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { PAGE_IDS } from '../utilities/PageIDs';
import ConfirmHoursCard from '../components/ConfirmVolunteerCard';
import Footer2 from '../components/Footer2';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { OpportunityRsvps } from '../../api/opportunity/OpportunitiesRsvpCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';

/** Renders a page containing all of the Users reserving for an event. Use <ConfirmVolunteerCard> to render each cards. */
const ConfirmVolunteersPage = ({ ready, finalData }) => ((ready) ? (
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
    <Grid columns={3} stackable>
      {finalData.map((data) => <Grid.Column style={{ marginBottom: '8px' }} key={data.index}>
        <ConfirmHoursCard key={data.index} linkData={data}/>
        <Container style={{ paddingLeft: '89px' }}>
          <Button positive onClick={() => console.log(data)}>
            Approve
          </Button>
          <Button negative onClick={() => console.log(data)}>
            Decline
          </Button>
        </Container>
      </Grid.Column>)}
    </Grid>

    <Button floated={'right'} icon labelPosition='right'>
      <Icon name='right arrow'/>
          Confirm Volunteer Registration
    </Button>
    <Footer2/>
  </Container>
) : <Loader active>Getting User Data!</Loader>);

// Require an array of Stuff documents in the props.
ConfirmVolunteersPage.propTypes = {
  finalData: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const volunteers = UserProfileData.subscribeAllUser();
  const rsvp = OpportunityRsvps.subscribeRsvp();
  const opportunity = Opportunities.subscribeOpportunity();
  const ready = volunteers.ready() && rsvp.ready() && opportunity.ready();
  const getAllRsvpCollection = OpportunityRsvps.find({}).fetch();
  const getAllUserProfileCollection = UserProfileData.find({}).fetch();
  const getAllOpportunitiesCollection = Opportunities.find({}).fetch();
  const tempData = [];
  const finalData = [];
  let tempDataObj = {};
  let finalDataObj = {};
  let index = 0;

  if (ready) {
    getAllRsvpCollection.forEach(function (element) {
      for (let x = 0; x < getAllUserProfileCollection.length; x++) {
        if (element.volunteerID === getAllUserProfileCollection[x]._id) {
          Object.assign(getAllUserProfileCollection[x], { volunteerEmail: getAllUserProfileCollection[x].owner });
          tempDataObj = Object.assign(element, getAllUserProfileCollection[x]);
          tempData.push(tempDataObj);
        }
      }
    });
    tempData.forEach(function (item) {
      for (let x = 0; x < getAllOpportunitiesCollection.length; x++) {
        if (item.oppID === getAllOpportunitiesCollection[x]._id) {
          finalDataObj = Object.assign(item, getAllOpportunitiesCollection[x]);
          finalData.push(finalDataObj);
        }
      }
    });
    finalData.sort(function (a, b) {
      const x = a.title.toLowerCase();
      const y = b.title.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
    finalData.forEach(function (items) {
      delete Object.assign(items, { contactOrganizerEmail: items.owner }).owner;
      Object.assign(items, { index: index });
      index++;
    });
  }
  return {
    ready,
    finalData,
  };

})(ConfirmVolunteersPage);

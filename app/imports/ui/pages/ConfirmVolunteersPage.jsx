import React, { useState } from 'react';
import { Container, Header, Loader, Input, List, Button, Icon, Grid } from 'semantic-ui-react';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';
import ConfirmHoursCard from '../components/ConfirmVolunteerCard';
import Footer2 from '../components/Footer2';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { OpportunityRsvps } from '../../api/opportunity/OpportunitiesRsvpCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import { OpportunityHours } from '../../api/opportunity/OpportunityHoursCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';

/** Renders a page containing all of the Users reserving for an event. Use <ConfirmVolunteerCard> to render each cards. */
const ConfirmVolunteersPage = ({ ready, finalData }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const acceptData = [];

  const confirming = (data) => {
    Object.assign(data, { accepted: true });
    // eslint-disable-next-line no-undef
    document.getElementById(`posButton${data.index}`).disabled = true;
    // eslint-disable-next-line no-undef
    document.getElementById(`negButton${data.index}`).disabled = false;
    acceptData.push(data);
  };

  const declining = (data) => {
    Object.assign(data, { accepted: false });
    // eslint-disable-next-line no-undef
    document.getElementById(`negButton${data.index}`).disabled = true;
    // eslint-disable-next-line no-undef
    document.getElementById(`posButton${data.index}`).disabled = false;
  };

  const finalConfirmation = (data) => {
    const temp = [];
    data.forEach(function (items) {
      if (items.accepted === true) {
        temp.push(items);
      }
    });
    temp.forEach(function (item) {
      const { title, location, volunteerEmail, numberOfHours } = item;
      const definitionData = { title: title, location: location, volunteerEmail: volunteerEmail, numberOfHours: numberOfHours };
      const collectionName = OpportunityHours.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          if (data.indexOf(item) === data.length - 1) {
            swal('Success', 'Successfully Confirmed Volunteers', 'success');
            setRedirectToReferer(true);
          }
        });
    });
  };
  const { from } = { from: { pathname: '/org-profile' } };
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }
  return ((ready) ? (
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
      <Grid columns={3} stackable style={{ marginBottom: '20px' }}>
        {finalData.map((data) => <Grid.Column style={{ marginBottom: '8px' }} key={data.index} textAlign={'center'}>
          <ConfirmHoursCard key={data.index} linkData={data}/>
          <Container>
            <Button id={`posButton${data.index}`} positive icon labelPosition='right' onClick={() => confirming(data)}>
              <Icon name={'check'}/>
            Approve
            </Button>
            <Button id={`negButton${data.index}`} negative icon labelPosition='right' onClick={() => declining(data)}>
              <Icon name={'x'}/>
            Decline
            </Button>
          </Container>
        </Grid.Column>)}
      </Grid>
      <Button floated={'right'} icon labelPosition='right' onClick={() => finalConfirmation(acceptData)}>
        <Icon name='right arrow'/>
          Confirm Volunteer Registration
      </Button>
      <Footer2/>
    </Container>
  ) : <Loader active>Getting User Data!</Loader>);
};

// Require an array of Stuff documents in the props.
ConfirmVolunteersPage.propTypes = {
  finalData: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // get the current logged in user information
  const user = Meteor.user();
  // subscribe to these collections
  const volunteers = UserProfileData.subscribeAllUser();
  const rsvp = OpportunityRsvps.subscribeRsvp();
  const opportunity = Opportunities.subscribeOpportunity();
  const pocOpportunity = OrganizationPocs.subscribeOrganizationPoc();
  // check if all collections are subscribed and ready;
  const ready = volunteers.ready() && rsvp.ready() && opportunity.ready() && pocOpportunity.ready();
  // for each collection get all data
  const getAllRsvpCollection = OpportunityRsvps.find({}).fetch();
  const getAllUserProfileCollection = UserProfileData.find({}).fetch();
  const getAllOpportunitiesCollection = Opportunities.find({}).fetch();
  const getAllPocOpportunitiesCollection = OrganizationPocs.find({}).fetch();
  // temp stuff
  const tempData = [];
  let finalData = [];
  const lastData = [];
  let tempDataObj = {};
  let index = 0;

  // begin when data is ready
  if (ready) {
    // loop through each element of OpportunityRsvps collection
    getAllRsvpCollection.forEach(function (element) {
      // for each element compare with each UserProfileData and find matching volunteerID and UserProfileData ._id
      for (let x = 0; x < getAllUserProfileCollection.length; x++) {
        if (element.volunteerID === getAllUserProfileCollection[x]._id) {
          // change owner key from UserProfileData[x] object to volunteerEmail
          Object.assign(getAllUserProfileCollection[x], { volunteerEmail: getAllUserProfileCollection[x].owner });
          // if match is found combine the current element and UserProfileData[x] into tempDataobj
          tempDataObj = Object.assign(element, getAllUserProfileCollection[x]);
          // push tempDataObj into tempData array
          tempData.push(tempDataObj);
        }
      }
    });
    // loop through each item of tempData
    tempData.forEach(function (item) {
      // for each item compare with each Opportunities collection and find matching oppID and Opportunities _.id
      for (let x = 0; x < getAllOpportunitiesCollection.length; x++) {
        // if match is found
        if (item.oppID === getAllOpportunitiesCollection[x]._id) {
          // combine current item with current Opportunities and store into finalDataObj
          Object.assign(item, getAllOpportunitiesCollection[x]);
          // push finalDataObj into finalData array
          // finalData.push(finalDataObj);
        }
      }
    });
    // Sort the current data stored into finalData by title
    tempData.sort(function (a, b) {
      const x = a.title.toLowerCase();
      const y = b.title.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
    // for each item in the finalData Array
    tempData.forEach(function (items) {
      // add new field called contactOrganizerEmail with owner as its value, then remove owner field
      delete Object.assign(items, { contactOrganizerEmail: items.owner }).owner;
      // assign index field, this field will be the key
      Object.assign(items, { index: index });
      index++;
    });
  }
  // for each item in finalData
  tempData.forEach(function (item) {
    // for each item compare with each OrganizationPocs collection and find matching contactOrganizerEmail and OrganizationPocs pocEmail
    for (let x = 0; x < getAllPocOpportunitiesCollection.length; x++) {
      // if match is found
      if (getAllPocOpportunitiesCollection[x].pocEmail === item.contactOrganizerEmail) {
        // get the orgEmail from the current OrganizationPocs object collection
        const organizationEmail = getAllPocOpportunitiesCollection[x].orgEmail;
        // create a new object called orgEmail and merge into the current item
        Object.assign(item, { orgEmail: organizationEmail });
        Object.assign(item, { disablePos: false });
        Object.assign(item, { disableNeg: false });

      }
    }
  });
  // for each item in finalData look for matching orgEmail and current logged in user email
  tempData.forEach(function (item) {
    // if match is found
    if (item.orgEmail === user.username) {
      // push the item into lastData
      lastData.push(item);
    }
  });

  // overwrite the current data at finaldata with filtered data from lastData
  finalData = lastData;
  // console.log(finalData);
  return {
    ready,
    finalData,
  };

})(ConfirmVolunteersPage);

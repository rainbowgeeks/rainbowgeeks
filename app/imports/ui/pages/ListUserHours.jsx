import React from 'react';
import { Container, Table, Header, Icon, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { PAGE_IDS } from '../utilities/PageIDs';
import UserHours from '../components/UserHours';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { ProfilePageHours } from '../../api/profile/ProfilePageHoursCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { PointOfContacts } from '../../api/point-of-contact/PointOfContactCollection';
import { Hours } from '../../api/hours/HoursCollection';

/** Renders a table containing all of the organization, events and, hours associated with the user.
 * Use <UserHours> to render each row. */
const ListUserHours = ({ ready, userHours }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_USER_HOURS}>
    <Header as="h2" textAlign="center">List of Event Activity</Header>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            Event Name
            <Icon name='sort'/>
          </Table.HeaderCell>
          <Table.HeaderCell>
            Organization
            <Icon name='sort'/>
          </Table.HeaderCell>
          <Table.HeaderCell>
            Date
            <Icon name='sort'/>
          </Table.HeaderCell>
          <Table.HeaderCell>
            Hours
            <Icon name='sort'/>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {userHours.map((data) => <UserHours key={data._id} userHourData={data}/>)}
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting User Data!</Loader>);

// Require an array of Stuff documents in the props.
ListUserHours.propTypes = {
  userHours: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const subscribeUserProfile = UserProfileData.subscribeUserProfile();
  const subscribeProfilePageHour = ProfilePageHours.subscribeProfilePageHour();
  const subscribeOpportunity = Opportunities.subscribeOpportunity();
  const subscribeOrganizationPoc = OrganizationPocs.subscribeOrganizationPoc();
  const subscribeOrganization = Organizations.subscribeOrganization();
  const subscribePointOfContact = PointOfContacts.subscribePointOfContact();
  const hours = Hours.subscribeHour();
  const ready = subscribeProfilePageHour.ready() && subscribeUserProfile.ready() && hours.ready() && subscribeOpportunity.ready()
      && subscribeOrganizationPoc.ready() && subscribeOrganization.ready() && subscribePointOfContact.ready();
  const userData = UserProfileData.find({}, { sort: { lastName: 1 } }).fetch();
  const userHourData = ProfilePageHours.find({}).fetch();
  const hoursData = Hours.find({}).fetch();
  const opportunities = Opportunities.find({}).fetch();
  const organizationPoc = OrganizationPocs.find({}).fetch();
  const organization = Organizations.find({}).fetch();
  const pointOfContact = PointOfContacts.find({}).fetch();
  const userHours = [];

  if (ready) {
    userHourData.forEach(function (items) {
      if (userData[0].owner === items.volunteerEmail) {
        for (let i = 0; i < hoursData.length; i++) {
          if (hoursData[i]._id === items.hourID) {
            Object.assign(items, { hours: hoursData[i].numberOfHours });
          }
        }
        for (let i = 0; i < opportunities.length; i++) {
          if (opportunities[i]._id === items.oppID) {
            Object.assign(items, { title: opportunities[i].title });
            Object.assign(items, { pocEmail: opportunities[i].owner });
            Object.assign(items, { date: opportunities[i].oppStart.toDateString() });
          }
        }
        for (let i = 0; i < pointOfContact.length; i++) {
          if (pointOfContact[i].email === items.pocEmail) {
            Object.assign(items, { orgPocID: pointOfContact[i]._id });
          }
        }
        for (let i = 0; i < organizationPoc.length; i++) {
          if (organizationPoc[i].pocID === items.orgPocID) {
            Object.assign(items, { organizationID: organizationPoc[i].orgID });
            Object.assign(items, { orgEmail: organizationPoc[i].orgEmail });
          }
        }
        for (let i = 0; i < organization.length; i++) {
          if (organization[i]._id === items.organizationID) {
            Object.assign(items, { organizationName: organization[i].organizationName });
          }
        }
        userHours.push(items);
      }
    });
  }
  return {
    userHours,
    ready,
  };
})(ListUserHours);

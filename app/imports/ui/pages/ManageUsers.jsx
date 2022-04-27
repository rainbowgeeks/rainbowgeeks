import React from 'react';
import { Loader, Container, Header, Input, List, Card, Button, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import AdminViewUsersCard from '../components/AdminViewUsersCard';
import Footer2 from '../components/Footer2';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { Hours } from "../../api/hours/HoursCollection";
import { ProfilePageHours } from "../../api/profile/ProfilePageHoursCollection";

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ManageUsers = ({ ready, users }) => {

  const stuff = 0;

  return ((ready) ? (
    <Container id={PAGE_IDS.USER_LIBRARY_PAGE}>
      <Header as="h1" textAlign="center">Manage Profiles</Header>
      <Input fluid placeholder="Search Profiles..."/>
      <List horizontal style={{ paddingBottom: '20px' }}>
        <List.Item>
          <Header as='h4' style={{ paddingTop: '8px', width: '70px' }}>Filter By: </Header>
        </List.Item>
        <List.Item>
          <Button compact size='small'>A-Z</Button>
        </List.Item>
        <List.Item>
          <Button compact size='small'>Category</Button>
        </List.Item>
        <List.Item>
          <Button compact size='small'>Newest</Button>
        </List.Item>
        <List.Item>
          <Button compact size='small'>Popular</Button>
        </List.Item>
      </List>
      <Card.Group stackable itemsPerRow={3}>
        {users.map((data) => <AdminViewUsersCard key={data._id} UserData={data}/>) }
      </Card.Group>
      <Divider/>
      <Footer2/>
    </Container>
  ) : <Loader active>Getting All User data!</Loader>);
};

ManageUsers.propTypes = {
  users: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const subscription = UserProfileData.subscribeAdminProfile();
  const subscribeHours = ProfilePageHours.subscribeProfilePageHourAdmin();
  const ready = subscription.ready() && subscribeHours.ready();
  const users = UserProfileData.find({}).fetch();
  const hours = ProfilePageHours.find({}).fetch();
  if (ready) {
    users.forEach(function (items) {
      let total = 0;
      for (let i = 0; i < hours.length; i++) {
        if (hours[i].volunteerEmail === items.owner) {
          total += 1;
        }
      }
      Object.assign(items, { numberOfOrgs: total });
    });
  }
  console.log(users);
  return {
    users,
    ready,
  };
})(ManageUsers);

import React, { useState } from 'react';
import { Loader, Container, Header, Input, List, Card, Button, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import AdminViewUsersCard from '../components/AdminViewUsersCard';
import Footer2 from '../components/Footer2';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { ProfilePageHours } from '../../api/profile/ProfilePageHoursCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ManageUsers = ({ ready, users }) => {

  const [obj, setObj] = useState([]);
  const sortAlpha = (data) => {
    if (data && ready) {
      data.sort(function (a, b) {
        const x = a.lastName.toLowerCase();
        const y = b.lastName.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
      });
      setObj(data);
    }
  };

  return ((ready) ? (
    <Container id={PAGE_IDS.USER_LIBRARY_PAGE}>
      <Header as="h1" textAlign="center">Manage Profiles</Header>
      <Input fluid placeholder="Search Profiles..."/>
      <List horizontal style={{ paddingBottom: '20px' }}>
        <List.Item>
          <Header as='h4' style={{ paddingTop: '8px', width: '70px' }}>Filter By: </Header>
        </List.Item>
        <List.Item>
          <Button compact size='small' onClick={() => sortAlpha(users)}>Last Names</Button>
        </List.Item>
      </List>
      <Card.Group stackable itemsPerRow={3}>
        {(obj.length === users.length) ? obj.map((data) => <AdminViewUsersCard key={data._id} UserData={data}/>) :
          users.map((data) => <AdminViewUsersCard key={data._id} UserData={data}/>)}
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
  const userAccountSubscribe = UserProfiles.subscribe();
  const ready = subscription.ready() && subscribeHours.ready() && userAccountSubscribe.ready();
  const users = UserProfileData.find({}).fetch();
  const hours = ProfilePageHours.find({}).fetch();
  const userOwner = UserProfiles.find({}).fetch();
  if (ready) {
    users.forEach(function (items) {
      let total = 0;
      Object.assign(items, { address: `${items.homeAddress}, ${items.city}, ${items.state}, ${items.zip}` });
      Object.assign(items, { DOB: items.dateOfBirth.toDateString() });
      for (let i = 0; i < hours.length; i++) {
        if (hours[i].volunteerEmail === items.owner) {
          total += 1;
        }
      }
      for (let i = 0; i < userOwner.length; i++) {
        if (userOwner[i].email === items.owner) {
          Object.assign(items, { getUserID: userOwner[i]._id });
          Object.assign(items, { userID: userOwner[i].userID });
        }
      }
      Object.assign(items, { numberOfOrgs: total });
    });
  }
  console.log(userOwner, users);
  return {
    users,
    ready,
  };
})(ManageUsers);

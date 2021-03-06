import React from 'react';
import { Button, Card, Header, Icon, Image, Modal } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { showValue, sortDate } from './ProfilePageAboutUser';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import EditUserHoursAdmin from './EditUserHoursAdmin';

/** Renders a single Card Item in the ConfirmVolunteerCard, but it just confirms volunteer volunteering to the event. */
const AdminViewUsersCard = ({ UserData }) => {
  const [open, setOpen] = React.useState(false);
  const removeAccount = (user) => {
    swal({
      title: `Are you sure You want to Delete ${user.firstName} ${user.lastName}?`,
      text: 'Once deleted, you will not be able to recover this user',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const { owner, firstName, lastName, phoneNumber, specialInterest, profileImage, aboutUser, acceptTerm, dateOfBirth, homeAddress, city, state, zip, interest, environmentalPref, availability, _id } = user;
        const collectionName = UserProfileData.getCollectionName();
        if (user) {
          const instance = { _id: _id, owner, firstName, lastName, phoneNumber, specialInterest, profileImage, acceptTerm, aboutUser, dateOfBirth, homeAddress, city, state, zip, interest, environmentalPref, availability };
          removeItMethod.callPromise({ collectionName, instance })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => {
              swal(`${user.firstName} ${user.lastName}, had successfully been removed!`, { icon: 'success' });
            });
        }
      }
    });
  };

  return (<Card color={'blue'}>
    <Card.Content>
      <Image
        src={UserData.profileImage}
        floated='right'
        size='small'
      />
      <Card.Header style={{ marginBottom: '20px' }}>
        <u>
          {UserData.firstName} {UserData.lastName}
        </u>
      </Card.Header>
      <Card.Meta as={'h3'}>Email: {UserData.owner}</Card.Meta>
      <Card.Meta as={'h3'}>Primary Phone Number: {UserData.phoneNumber}</Card.Meta>
      <Card.Meta as={'h3'}>Date of Birth: {UserData.DOB}</Card.Meta>
    </Card.Content>
    <Card.Content as={'h4'}>
      <Card.Meta>Address: {UserData.address}</Card.Meta>
    </Card.Content>
    <Card.Content>
      <Card.Meta as={'h4'}>Interest: {showValue(UserData.interest)}</Card.Meta>
    </Card.Content>
    <Card.Content as={'h4'}>
      <Card.Meta>Availability: {sortDate(UserData.availability)}</Card.Meta>
    </Card.Content>
    <Card.Content extra>
      <a>
        <Icon name='building outline'/>
        Number of Volunteers: {UserData.numberOfOrgs}
      </a>
    </Card.Content>
    <Card.Content extra>
      <Button.Group floated="right" fluid>
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          size={'tiny'}
          trigger={<Button positive icon labelPosition={'left'}>
            <Icon name={'write'}/>
              Edit
          </Button>}
        >
          <Modal.Header textalign={'center'}>{UserData.firstName} {UserData.lastName}</Modal.Header>
          <Modal.Content image scrolling>
            <Image
              src={UserData.profileImage}
              size={'medium'}
              wrapped
            />
            <Modal.Description>
              <Header>Hours Log</Header>
              {UserData.userEvents.map((data) => <EditUserHoursAdmin key={data._id} user={data}/>)}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='grey' onClick={() => setOpen(false)}>
              Close
            </Button>
          </Modal.Actions>
        </Modal>

        <Button negative icon labelPosition='right' onClick={() => removeAccount(UserData)}>
          <Icon name={'trash'}/>
                        Remove
        </Button>
      </Button.Group>
    </Card.Content>
  </Card>
  );
};

// Require a document to be passed to this component.
AdminViewUsersCard.propTypes = {
  UserData: PropTypes.shape({
    owner: PropTypes.string,
    numberOfOrgs: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    aboutUser: PropTypes.string,
    profileImage: PropTypes.string,
    availability: PropTypes.array,
    interest: PropTypes.array,
    specialInterest: PropTypes.string,
    address: PropTypes.string,
    environmentalPref: PropTypes.array,
    DOB: PropTypes.string,
    phoneNumber: PropTypes.string,
    userEvents: PropTypes.array,
    hoursData: PropTypes.array,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(AdminViewUsersCard);

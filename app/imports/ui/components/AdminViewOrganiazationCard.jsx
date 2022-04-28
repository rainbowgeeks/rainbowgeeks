import React from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { Organizations } from '../../api/organization/OrganizationCollection';

/** Renders a single Card Item in the ConfirmVolunteerCard, but it just confirms volunteer volunteering to the event. */
const AdminViewOrganiazationCard = ({ orgData }) => {
  const removeAccount = (org) => {
    swal({
      title: `Are you sure You want to Remove, ${org.organizationName}`,
      text: 'Once deleted, you will not be able to recover this Organization',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const { organizationName, missionStatement, description, orgEmail, orgImage, address, city, state, zip, acceptTerm, _id } = org;
        const collectionName = Organizations.getCollectionName();
        if (org) {
          const instance = { _id: _id, organizationName, missionStatement, description, orgEmail, orgImage, address, city, state, zip, acceptTerm };
          removeItMethod.callPromise({ collectionName, instance })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => {
              swal(`${orgData.organizationName}, had successfully been removed!`, { icon: 'success' });
            });
        }

      }
    });
  };

  return (<Card color={'red'}>
    <Card.Content>
      <Image
        src={orgData.orgImage}
        floated='right'
        size='small'
      />
      <Card.Header style={{ marginBottom: '20px' }}>
        <u>
          {orgData.organizationName}
        </u>
      </Card.Header>
      <Card.Meta as={'h3'}>Email: {orgData.orgEmail}</Card.Meta>
      <Card.Meta as={'h3'}>MissionStatement: {orgData.missionStatement}</Card.Meta>
    </Card.Content>
    <Card.Content as={'h4'}>
      <Card.Meta>
        Address: {orgData.address}, {orgData.city}, {orgData.state}, {orgData.zip}
      </Card.Meta>
    </Card.Content>
    <Card.Content extra>

      <a>
        <Icon name='building outline'/>
        {orgData.pocEmails.join(', ')}
      </a>
    </Card.Content>
    <Card.Content extra>
      <Button.Group floated="right" fluid>
        <Button negative icon labelPosition='right' onClick={() => removeAccount(orgData)}>
          <Icon name={'trash'}/>
                        Remove
        </Button>
      </Button.Group>
    </Card.Content>
  </Card>
  );
};

// Require a document to be passed to this component.
AdminViewOrganiazationCard.propTypes = {
  orgData: PropTypes.shape({
    orgEmail: PropTypes.string,
    organizationName: PropTypes.string,
    orgImage: PropTypes.string,
    missionStatement: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
    pocEmails: PropTypes.array,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(AdminViewOrganiazationCard);

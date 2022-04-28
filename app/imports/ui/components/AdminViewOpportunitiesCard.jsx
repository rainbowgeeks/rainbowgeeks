import React from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { OpportunityRsvps } from '../../api/opportunity/OpportunitiesRsvpCollection';
import { OpportunityHours } from '../../api/opportunity/OpportunityHoursCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesPocs } from '../../api/opportunity/OpportunitiesPocCollection';


const removeAccount = (opp) => {
  let instance;
  let collectionName;
  swal({
    title: `Are you sure You want to Delete ${opp.title}?`,
    text: 'Once deleted, you will not be able to recover this user',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      collectionName = OpportunitiesPocs.getCollectionName();
      if (opp) {
        instance = { _id: opp.oppPocID };
        removeItMethod.callPromise({ collectionName, instance })
          .then(() => {
            collectionName = OpportunityHours.getCollectionName();
            instance = { _id: opp.oppHoursID };
            removeItMethod.callPromise({ collectionName, instance });
          })
          .then(() => {
            collectionName = OpportunitiesCats.getCollectionName();
            instance = { _id: opp.oppCatID };
            removeItMethod.callPromise({ collectionName, instance });
          })
          .then(() => {
            collectionName = OpportunitiesAges.getCollectionName();
            instance = { _id: opp.oppAgeID };
            removeItMethod.callPromise({ collectionName, instance });
          })
          .then(() => {
            collectionName = OpportunitiesEnvs.getCollectionName();
            instance = { _id: opp.oppEnvID };
            removeItMethod.callPromise({ collectionName, instance });
          })
          .then(() => {
            collectionName = Opportunities.getCollectionName();
            instance = { _id: opp._id };
            removeItMethod.callPromise({ collectionName, instance });
          })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => {
            swal(`${opp.title}, had successfully been removed!`, { icon: 'success' });
          });
      }
    }
  });
};

const AdminViewOpportunitiesCard = ({ opportunity }) => (
  <Card style={{ width: '30%' }}>
    <Image
      style={{ marginTop: '5px' }}
      src={opportunity.cover}
      size='medium'
      centered
    />
    <br/>
    <Card.Header textAlign={'center'}>
      {opportunity.title}
    </Card.Header>
    <Card.Content style={{ border: 'none', boxShadow: 'none' }}>
      <Card.Description> {opportunity.oppStart.toLocaleString('en-US')} - {opportunity.oppEnd.toLocaleString('en-US')} </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Button negative icon labelPosition='right' onClick={() => removeAccount(opportunity)} fluid>
        <Icon name={'trash'}/>
        Remove
      </Button>
    </Card.Content>
  </Card>
);

AdminViewOpportunitiesCard.propTypes = {
  opportunity: PropTypes.object,
};

export default withRouter(AdminViewOpportunitiesCard);

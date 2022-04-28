import React from 'react';
import { Loader, Container, Header, Input, List, Card, Button, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Organizations } from '../../api/organization/OrganizationCollection';
import Footer2 from '../components/Footer2';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import AdminViewOrganiazationCard from '../components/AdminViewOrganiazationCard';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ManageOrganizations = ({ ready, data }) => {

  // this vairaible is just here to prevent es-lint
  const stuffs = [];

  return ((ready) ? (
    <Container id={PAGE_IDS.ORG_LIBRARY_PAGE}>
      <Header as="h1" textAlign="center">Manage Organizations</Header>
      <Input fluid placeholder="Search Organizations..."/>
      <List horizontal style={{ paddingBottom: '20px' }}>
        <List.Item>
          <Header as='h4' style={{ paddingTop: '8px', width: '70px' }}>Filter By: </Header>
        </List.Item>
        <List.Item>
          <Button compact size='small'>A-Z</Button>
        </List.Item>
      </List>
      <Card.Group stackable centered itemsPerRow={3}>
        {data.map((orgDatas) => <AdminViewOrganiazationCard key={orgDatas._id} orgData={orgDatas}/>)}
      </Card.Group>
      <Divider hidden/>
      <Footer2/>
    </Container>
  ) : <Loader active>Getting data</Loader>);
};

// Require an array of Stuff documents in the props.
ManageOrganizations.propTypes = {
  data: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Organizations.subscribeOrganizationAdmin();
  const pocSubscribe = OrganizationPocs.subscribeOrganizationPocAdmin();
  // Determine if the subscription is ready
  const ready = subscription.ready() && pocSubscribe.ready();
  // Get the Stuff documents and sort by owner then name
  const organizations = Organizations.find({}).fetch();
  const pocOrganizations = OrganizationPocs.find({}).fetch();
  const data = [];
  if (ready) {
    organizations.forEach(function (items) {
      const temp = [];
      for (let x = 0; x < pocOrganizations.length; x++) {
        if (pocOrganizations[x].orgEmail === items.orgEmail) {
          temp.push(pocOrganizations[x].pocEmail);
        }
      }
      Object.assign(items, { pocEmails: [...temp] });
      data.push(items);
    });
  }
  return {
    data,
    ready,
  };
})(ManageOrganizations);

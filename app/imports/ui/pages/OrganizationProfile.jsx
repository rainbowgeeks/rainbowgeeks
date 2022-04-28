import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Container, Image, Grid, Divider, Label, Table, Menu, Segment, Card, Header, Icon, Popup, Loader } from 'semantic-ui-react';
import { _ } from 'meteor/underscore';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import { PointOfContacts } from '../../api/point-of-contact/PointOfContactCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import OrganizationPocTable from '../components/OrganizationPocTable';

const getOrgProfile = (data) => {
  const { orgEmail } = data;
  const pocEmail = _.pluck(OrganizationPocs.find({ orgEmail }).fetch(), 'pocEmail');
  const temp = pocEmail.map(email => PointOfContacts.find({ email }).fetch());
  const poc = _.flatten(temp);
  return _.extend({}, data, { poc });
};

const OrganizationProfile = ({ ready }) => {
  let orgProfile;
  if (ready) {
    const orgEmail = Meteor.user().username;
    const temp = Organizations.findDoc({ orgEmail });
    orgProfile = getOrgProfile(temp);
    console.log(orgProfile.poc);
  }
  return ((ready) ? (
    <Container id={PAGE_IDS.ORGANIZATION_PROFILE}>
      <Grid columns={3} container padded='vertically'>
        <Popup position={'top right'} content='Edit My Profile' trigger={
          <Link to={`/edit-organization/${orgProfile._id}`}>
            <Icon name='setting' size='large'/>
          </Link>}
        />
        <Grid.Row>
          <Grid.Column textAlign='center' width={5}>
            <Image src={`${orgProfile.orgImage}`} size='medium' circular centered/>
            <Divider hidden/>
            <Label size='big' circular>{orgProfile.organizationName}</Label>
          </Grid.Column>
          <Grid.Column width={11} verticalAlign='middle'>
            <Image fluid src={`${orgProfile.orgImage}`}/>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column textAlign='center' width={5}>
            <Segment as='h3'>Gallery</Segment>
            <Image.Group size='small'>
              <Image src={'/images/redcross.png'}/>
              <Image src={'/images/redcross.png'}/>
              <Image src={'/images/redcross.png'}/>
              <Image src={'/images/redcross.png'}/>
              <Image src={'/images/redcross.png'}/>
              <Image src={'/images/redcross.png'}/>
            </Image.Group>
          </Grid.Column>
          <Grid.Column width={8}>
            <Table celled striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan='4' textAlign={'center'}>Points of Contacts</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {orgProfile.poc.map(p => <OrganizationPocTable key={p._id} pointOfC={p}/>)}
              </Table.Body>
            </Table>
            <Card.Group stackable centered itemsPerRow={3}>
              <Card>
                <Card.Content>
                  <Card.Header>
                    <Header>Opp title</Header>
                  </Card.Header>
                  <Card.Meta>
                    <Header>Opp Date</Header>
                  </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <Card.Description>
                    <Header icon='user' content={'Point of Contact'}/>
                  </Card.Description>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <Card.Header>
                    <Header>Opp title</Header>
                  </Card.Header>
                  <Card.Meta>
                    <Header>Opp Date</Header>
                  </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <Card.Description>
                    <Header icon='user' content={'Point of Contact'}/>
                  </Card.Description>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <Card.Header>
                    <Header>Opp title</Header>
                  </Card.Header>
                  <Card.Meta>
                    <Header>Opp Date</Header>
                  </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <Card.Description>
                    <Header icon='user' content={'Point of Contact'}/>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Column>
          <Grid.Column width={3}>
            <Menu vertical fluid>
              <Menu.Item>Analytics</Menu.Item>
              <Menu.Item as={NavLink} activeClassName="active" exact to="/manage-hours" key="manage-hours">
                Manage Hours
              </Menu.Item>
              <Menu.Item as={NavLink} exact to="/manage-opp">Manage Opportunities</Menu.Item>
              <Menu.Item as={NavLink} exact to={'/confirm-volunteer'}>Manage Requests</Menu.Item>
              <Menu.Item as={NavLink} activeClassName="active" exact to="/confirmed-hours" key="confirmed-hours">
                View Volunteer Hours
              </Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid.Row>
      </Grid>

    </Container>
  ) : <Loader active>Getting User Data!</Loader>);
};
OrganizationProfile.propTypes = {
  ready: PropTypes.bool.isRequired,
};

const OrganizationPageContainer = withTracker(() => {
  const sub1 = Organizations.subscribeOrganization();
  const sub2 = OrganizationPocs.subscribeOrganizationPoc();
  const sub3 = PointOfContacts.subscribePointOfContact();
  const ready = sub1.ready() && sub2.ready() && sub3.ready();
  return {
    ready,
  };
})(OrganizationProfile);

export default withRouter(OrganizationPageContainer);

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Grid, Loader, Header, Segment, Table, Label, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { Categories } from '../../api/category/CategoryCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { PointOfContacts } from '../../api/point-of-contact/PointOfContactCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import OpportunityPagePoc from '../components/OpportunityPagePoc';
import OrgReservation from '../components/OrgReservation';
import NeedRsvp from '../components/NeedRsvp';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { OpportunityRsvps } from '../../api/opportunity/OpportunitiesRsvpCollection';
// Checking
const makeOpportunity = (data) => {
  const { _id: oppID, owner: email } = data;
  const age = _.pluck(OpportunitiesAges.find({ oppID }).fetch(), 'age');
  const environment = _.pluck(OpportunitiesEnvs.find({ oppID }).fetch(), 'environment');
  const oppCat = _.pluck(OpportunitiesCats.find({ oppID }).fetch(), 'category');
  const category = oppCat.map(c => Categories.getIcon(c));
  const poc = PointOfContacts.find({ email }).fetch();
  const org = _.pluck(OrganizationPocs.find({ pocEmail: email }).fetch(), 'orgID');
  const [organization] = org.map(o => Organizations.findDoc({ _id: o }).organizationName);
  return _.extend({}, data, { age, environment }, { category }, { poc }, { organization });
};

const getUser = (user, id) => {
  const [name] = UserProfileData.find({ owner: user }).fetch();
  return _.extend({}, name, { oppID: id });
};

const OpportunityPage = ({ ready, opportunity }) => {
  const [opp] = opportunity.map(o => makeOpportunity(o));
  let volunteer;
  if (Meteor.user()) {
    const oppID = opp._id;
    volunteer = getUser(Meteor.user().username, oppID);
  }
  const gridHeight = { paddingTop: '20px', paddingBottom: '50px' };
  return ((ready) ? (
    <Container id={PAGE_IDS.OPPORTUNITY_PAGE} style={{ paddingTop: '20px' }}>
      <Grid style={{
        backgroundImage: `url('${opp.cover}')`,
        backgroundPosition: 'center',
      }}>
        <Grid.Column style={{ paddingTop: '300px' }}>
          <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={`/edit-opp/${opp._id}`}>
            <Icon name='setting' size='large'/>
          </Link>
          <Header as='h2' content={`${opp.organization} : ${opp.title}`}/>
          <Header as='h2' content={`${opp.oppStart.toLocaleString('en-US')} - ${opp.oppEnd.toLocaleString('en-US')}`}/>
        </Grid.Column>
      </Grid>
      <Grid container columns={2} style={gridHeight}>
        <Grid.Row>
          <Grid.Column>
            <Header as='h3' icon='pencil alternate' content='Description' attached='top'/>
            <Segment attached>{opp.description}</Segment>

            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Icon size={'big'} name={'users'}/>
                    {opp.environment.map((e, index) => <Label key={index} style={{ paddingLeft: '5px', paddingTop: '5px' }} size='medium' color='teal'>{e}</Label>)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Segment.Inline>
                      <Icon size={'big'} name={'map pin'}/>
                      {opp.age.map((a, index) => <Label key={index} style={{ paddingLeft: '5px' }} size='medium' color='teal'>{a}</Label>)}
                    </Segment.Inline>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Header icon={{ name: 'tags', size: 'big' }} content={'Categories'}/>
                    {opp.category.map((c, index) => <Label color={'teal'} key={index} size={'medium'} icon={c.icon} content={c.name}/>)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>

          <Grid.Column>
            {opp.poc.map(o => <OpportunityPagePoc key={o._id} poc={o}/>)}
            {volunteer ? <OrgReservation rsvp={volunteer}/> : <NeedRsvp/>}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  ) : <Loader active>Fetching Event</Loader>);
};

OpportunityPage.propTypes = {
  opportunity: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

const OpportunityPageContainer = withTracker(() => {
  //
  const { _id } = useParams();
  // Get access to opportunities documents
  const sub1 = Opportunities.subscribeOpportunity();
  // Get access to oppAge documents.
  const sub2 = OpportunitiesAges.subscribeOpportunitiesAge();
  // Get access to oppEnvironment documents.
  const sub3 = OpportunitiesEnvs.subscribeOpportunitiesEnvironment();
  // Get access to opportunity opp Cat documents.
  const sub4 = OpportunitiesCats.subscribeOpportunitiesCategory();
  // Get access to organization documents.
  const sub5 = PointOfContacts.subscribePointOfContact();
  // Get access to organization documents.
  const sub6 = Organizations.subscribeOrganization();
  // Get access to organization poc documents.
  const sub7 = OrganizationPocs.subscribeOrganizationPoc();
  // Get access to User documents.
  const sub8 = UserProfileData.subscribeAllUser();
  // Get access to User documents.
  const sub9 = OpportunityRsvps.subscribeRsvp();
  // Get the Opportunity that match the _id
  const opportunity = Opportunities.find({ _id }).fetch();
  //
  // Check if collections are ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready() && sub9.ready();
  return {
    opportunity,
    ready,
  };
})(OpportunityPage);

export default withRouter(OpportunityPageContainer);

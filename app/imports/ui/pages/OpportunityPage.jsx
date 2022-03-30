import React from 'react';
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
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';

const OpportunityPage = ({ _id, ready }) => {

  const getEvent = (data) => {
    const opportunity = Opportunities.findOne({ _id: data });
    const pocEmail = opportunity.owner;
    const age = _.pluck(OpportunitiesAges.find({ oppID: data }).fetch(), 'age');
    const environment = _.pluck(OpportunitiesEnvs.find({ oppID: data }).fetch(), 'environment');
    const oppCat = _.pluck(OpportunitiesCats.find({ oppID: data }).fetch(), 'category');
    const category = oppCat.map(c => Categories.getIcon(c));
    const poc = PointOfContacts.findOne({ email: pocEmail });
    const orgEmail = OrganizationPocs.findDoc({ pocEmail }).orgEmail;
    const organization = Organizations.findDoc({ orgEmail });
    const { organizationName } = organization;
    return _.extend({}, opportunity, { age, environment, category }, { poc }, { organizationName });

  };
  const event = getEvent(_id);
  const gridHeigth = { paddingTop: '20px', paddingBottom: '50px' };
  return (ready) ? (
    <Container id={PAGE_IDS.OPPORTUNITY_PAGE} style={{ paddingTop: '20px' }}>
      <Grid style={{
        backgroundImage: `url('${event.cover}')`,
        backgroundPosition: 'center',
      }}>
        <Grid.Column style={{ paddingTop: '300px' }}>
          <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={`/edit-opp/${event._id}`}>
            <Icon name='setting' size='large'/>
          </Link>
          <Header as='h2' content={`${event.organizationName} : ${event.title}`}/>
          <Header as='h2' content={`${event.date}`}/>
        </Grid.Column>
      </Grid>
      <Grid container columns={2} style={gridHeigth}>
        <Grid.Row>
          <Grid.Column>
            <Header as='h3' icon='pencil alternate' content='Description' attached='top'/>
            <Segment attached>{event.description}</Segment>

            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Segment.Inline>
                      <Icon size={'big'} name={'users'}/>
                      {event.environment.map((e, index) => <Label key={index}
                        style={{ paddingLeft: '5px', paddingTop: '5px' }}
                        size='medium' color='teal'>{e}</Label>)}
                    </Segment.Inline>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Segment.Inline>
                      <Icon size={'big'} name={'map pin'}/>
                      {event.age.map((a, index) => <Label key={index}
                        style={{ paddingLeft: '5px' }}
                        size='medium' color='teal'>{a}</Label>)}
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
                    {event.category.map((c, index) => <Label color={'teal'} key={index} size={'medium'} icon={c.icon} content={c.name}/>)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>

          <Grid.Column>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Header as='h3' icon='address book outline' content='Contact Information'/>
                  </Table.Cell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Header
                      as='h5' icon='user circle' content={`${event.poc.firstName} ${event.poc.lastName}`}/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Header as='h5' icon='mail' content={`${event.owner}`}/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Header as='h5' icon='phone' content={`${event.poc.phoneNumber}`}/>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Header as='h3' icon='certificate' content='Opportunity Menu'/>
                  </Table.Cell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Header as='h5' icon='compass' content='Directions'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Header as='h5' icon='mail' content='Send Email'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Header as='h5' icon='bookmark' content='Bookmark'/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Header as='h5' icon='bullhorn' content='Report'/>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  ) : <Loader active>Fetching Event</Loader>;
};

OpportunityPage.propTypes = {
  _id: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
};

const OpportunityPageContainer = withTracker(() => {
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
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready();
  const { _id } = useParams();
  return {
    _id,
    ready,
  };
})(OpportunityPage);

export default withRouter(OpportunityPageContainer);

import React from 'react';
import { Container, Grid, Loader, Header, Segment, Table, Button, Icon } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const OpportunityPage = ({ event, ready }) => {
  const gridHeigth = { paddingTop: '20px', paddingBottom: '50px' };
  return (ready) ? (
    <Container id={PAGE_IDS.OPPORTUNITY_PAGE}>
      <Grid container style={{
        backgroundImage: `url('${event.cover}')`, height: '45vh',
        backgroundPosition: 'center' }}>
        <Grid.Column>
          <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={`/edit-opp/${event._id}`}>
            <Icon name='setting' size='large'/>
          </Link>
          <Header as='h2' content={`${event.title}`} style={{ paddingTop: '300px' }}/>
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
                    <Header as='h5' icon='users' content={`${event.age}`}/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Header as='h5' icon='map pin' content={`${event.environment}`}/>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Header as='h5' icon={`${event.icon}`} content={`${event.category}`}/>
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
                      as='h5' icon='user circle' content={`${event.firstName} ${event.lastName}`}/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Header as='h5' icon='mail' content={`${event.owner}`}/>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell style={{ borderStyle: 'none' }}>
                    <Header as='h5' icon='phone' content={`${event.phoneNumber}`}/>
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
  event: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

const OpportunityPageContainer = withTracker(() => {
  const subscription = Opportunities.subscribeOpportunity();
  const ready = subscription.ready();
  const { _id } = useParams();
  const event = Opportunities.findOne({ _id: _id });
  return {
    event,
    ready,
  };
})(OpportunityPage);

export default withRouter(OpportunityPageContainer);

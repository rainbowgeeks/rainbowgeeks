import React from 'react';
import { Container, Grid, Loader, Item, Image } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';

const OpportunityPage = ({ ready, event }) => {
  console.log(event);
  const gridLenght = { height: '67%' };
  const gridHeigth = { paddingRight: '1px', paddingLeft: '1px' };
  return (ready) ? (
    <Container style={gridHeigth}>
      <Grid container celled>
        <Image src={event.cover}/>
      </Grid>

      <Grid container columns={2} celled>
        <Grid.Row>
          <Grid.Column style={gridLenght}>
            <Item.Description>{event.description}</Item.Description>
          </Grid.Column>
          <Grid.Column>
            <Item.Content>{event.firstName} {event.lastName}</Item.Content>
            <Item.Content>{event.owner}</Item.Content>
            <Item.Content>{event.phoneNumber}</Item.Content>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Item.Content>{event.age}</Item.Content>
            <Item.Content>{event.environment}</Item.Content>
            <Item.Content>{}</Item.Content>
          </Grid.Column>
          <Grid.Column>
            Contact Info
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Item.Content>{event.category}</Item.Content>
          </Grid.Column>
          <Grid.Column>
            Google Map
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            upcoming events
          </Grid.Column>
          <Grid.Column>
            Rsvp
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
  const { owner } = useParams();
  const documentId = owner;
  const subscription = Opportunities.subscribeOpportunity();
  const ready = subscription.ready();
  const event = Opportunities.findOne(documentId);
  console.log(event);
  return {
    event,
    ready,
  };
})(OpportunityPage);

export default withRouter(OpportunityPageContainer);

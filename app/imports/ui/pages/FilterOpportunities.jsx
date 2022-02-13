import React from 'react';
import { Container, Grid, Header, Segment, Card, Loader, Tab } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import GoogleMap from '../components/GoogleMap';
import CategoryFilter from '../components/CategoryFilter';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import Opportunity from '../components/Opportunity';
import MultiSelectField from '../../forms/controllers/MultiSelectField';
import Footer from '../components/Footer';

// Create a Schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: { type: String, optional: true },
  order: {
    type: String,
    allowedValues: ['Upcoming', 'Latest', 'Nearby', 'A-Z'],
    defaultValue: 'Upcoming',
  },
  ageGroup: {
    type: Array, optional: true,
    label: 'Age Group',
  },
  'ageGroup.$': {
    type: String,
    allowedValues: ['Adults', 'Family-Friendly', 'Teens', 'Seniors'],
  },
  surround: {
    type: Array, optional: true,
    label: 'Environment',
  },
  'surround.$': {
    type: String,
    allowedValues: ['Outdoors', 'Indoors', 'Mixed', 'Virtual'],
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);
const gridHeigth = { paddingRight: '50px', paddingLeft: '50px' };

const panes = [
  {
    menuItem: 'Filter',
    // eslint-disable-next-line react/display-name
    render: () => <Tab.Pane attached={false}>
      <AutoForm schema={bridge} onSubmit={console.log}>
        <Segment>
          <TextField name='name'/>
          <SelectField name='order'/>
          <MultiSelectField name='ageGroup'/>
          <MultiSelectField name='surround'/>
        </Segment>
      </AutoForm>
    </Tab.Pane>,
  },
  {
    menuItem: 'Category',
    // eslint-disable-next-line react/display-name
    render: () => <Tab.Pane attached={false}><CategoryFilter/></Tab.Pane>,
  },
];

const FilterOpportunities = ({ ready, opportunities }) => ((ready) ? (
    <div>
      <Container fluid style={gridHeigth}>
        <Header as="h1" textAlign="center">Browse Opportunity</Header>
        <Grid columns={3} centered celled column='equals' >
          <Grid.Column>
            <Header
                as="h2" textAlign="center"
                content="Volunteer Opportunities"
                subheader="Powered by VolunteerAlly"
            />
            <Tab menu={{ secondary: true }} className='filter-tab-position' panes={panes}/>
          </Grid.Column>
          <Grid.Column>
            <Header as="h2" textAlign="center">Result</Header>
            <Card.Group centered>
              {opportunities.map((opportunity) => <Opportunity key={opportunity._id} opportunity={opportunity}/>)}
            </Card.Group>
          </Grid.Column>
          <Grid.Column>
            <Header as="h2" textAlign="center">Result</Header>
            <div><GoogleMap/></div>
          </Grid.Column>
        </Grid>
      </Container>
    <Footer/>
    </div>

) : <Loader active>Getting Data</Loader>);

// Require an array of Stuff documents in the props.
FilterOpportunities.propTypes = {
  opportunities: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to opportunity documents.
  const subscription = Opportunities.subscribeOpportunity();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Opportunity documents
  const opportunities = Opportunities.find({}).fetch();
  return {
    opportunities,
    ready,
  };
})(FilterOpportunities);
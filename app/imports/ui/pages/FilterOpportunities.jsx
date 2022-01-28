import React from 'react';
import { Container, Grid, Header, Segment, Image, Card, Loader, Tab } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import CategoryFilter from '../components/CategoryFilter';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import Opportunity from '../components/Opportunity';
import MultiSelectField from '../../forms/controllers/MultiSelectField';

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
const gridHeigth = { height: '400px' };

const panes = [
  {
    menuItem: 'Filter',
    // eslint-disable-next-line react/display-name
    render: () => <Tab.Pane attached={false}>
      <AutoForm schema={bridge} onSubmit={console.log}>
        <Segment style={gridHeigth}>
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
  <Container fluid>
    <Header as="h1" textAlign="center">Browse Opportunity</Header>
    <Grid columns={3} centered celled column='equals'>
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
        <Image src='images/oahu-map.jpg'/>
      </Grid.Column>
    </Grid>
  </Container>
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

/**
 * <Form>
 <Segment>
 <Form.Field control='input'/>
 </Segment>
 <Segment>
 <Form.Group grouped>
 <label>Age Group</label>
 <Form.Field label='Adults' control='input' type='checkbox'/>
 <Form.Field label='Family-Friendly' control='input' type='checkbox'/>
 <Form.Field label='Teens' control='input' type='checkbox'/>
 <Form.Field label='Seniors' control='input' type='checkbox'/>
 </Form.Group>
 </Segment>
 <Segment>
 <Form.Group grouped>
 <label>Environment</label>
 <Form.Field label='Outdoors' control='input' type='checkbox'/>
 <Form.Field label='Indoors' control='input' type='checkbox'/>
 <Form.Field label='Mixed' control='input' type='checkbox'/>
 <Form.Field label='Virtual' control='input' type='checkbox'/>
 </Form.Group>
 </Segment>
 </Form>
 */

import React, { useState } from 'react';
import { Container, Grid, Header, Segment, Card, Loader, Tab } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, SubmitField } from 'uniforms-semantic';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import GoogleMap from '../components/GoogleMap';
import CategoryOpp from '../components/CategoryOpp';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import Opportunity from '../components/Opportunity';
import MultiSelectField from '../../forms/controllers/MultiSelectField';

export const opportunityOrder = ['Upcoming', 'Latest', 'Nearby', 'A-Z'];

// Create a Schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: { type: String, optional: true },
  order: {
    type: String, optional: true,
    allowedValues: opportunityOrder,
    defaultValue: opportunityOrder[0],
  },
  age: {
    type: Array, optional: true,
    label: 'Age Group',
  },
  'age.$': {
    type: String,
    allowedValues: ['Adults', 'Family-Friendly', 'Teens', 'Seniors'],
  },
  environment: {
    type: Array, optional: true,
    label: 'Environment',
  },
  'environment.$': {
    type: String,
    allowedValues: ['Outdoors', 'Indoors', 'Mixed', 'Virtual'],
  },
});
//
const bridge = new SimpleSchema2Bridge(formSchema);
const gridHeigth = { paddingRight: '50px', paddingLeft: '50px' };
//
const FilterOpportunities = ({ ready }) => {
  //
  const [filterParam, setFilterParam] = useState({
    order: '',
    age: ['Adults'],
    environment: ['Indoors'],
  });
  const { age, environment } = filterParam;
  //
  const newOpportunities = Opportunities.find({ $or: [{ age: { $in: [age] } }, { environment: { $in: [environment] } }] }).fetch();
  console.log(newOpportunities);
  const panes = [
    {
      menuItem: 'Filter',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane attached={false}>
        <AutoForm schema={bridge} onSubmit={data => setFilterParam(data)}>
          <Segment>
            <TextField name='name'/>
            <SelectField name='order'/>
            <MultiSelectField name='age'/>
            <MultiSelectField name='environment'/>
            <SubmitField value='Submit'/>
          </Segment>
        </AutoForm>
      </Tab.Pane>,
    },
    {
      menuItem: 'Category',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane attached={false}><CategoryOpp/></Tab.Pane>,
    },
  ];
  return ((ready) ? (
    <Container fluid style={gridHeigth}>
      <Header as="h1" textAlign="center">Browse Opportunity</Header>
      <Grid columns={3} centered celled column='equals'>
        <Grid.Column width={4}>
          <Header
            as="h2" textAlign="center"
            content="Volunteer Opportunities"
            subheader="Powered by VolunteerAlly"
          />
          <Tab
            menu={{
              secondary: true,
              tabular: true,
              style: {
                display: 'flex',
                justifyContent: 'center',
              },
            }}
            className={'make-scrollable'}
            panes={panes}
          />
        </Grid.Column>
        <Grid.Column width={5}>
          <Header as="h2" textAlign="center">Result</Header>
          <Card.Group className={'make-scrollable'} centered>
            {newOpportunities.map((opportunity) => <Opportunity key={opportunity._id} opportunity={opportunity}/>)}
          </Card.Group>
        </Grid.Column>
        <Grid.Column width={7}>
          <div><GoogleMap/></div>
        </Grid.Column>
      </Grid>
    </Container>
  ) : <Loader active>Getting Data</Loader>);
};

// Require an array of Stuff documents in the props.
FilterOpportunities.propTypes = {
  ready: PropTypes.bool.isRequired,
};

//
export default withTracker(() => {
  // Get access to opportunity documents.
  const subscription = Opportunities.subscribeOpportunity();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  return {
    ready,
  };
})(FilterOpportunities);

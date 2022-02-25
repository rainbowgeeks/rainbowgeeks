import React, { useState } from 'react';
import { Container, Grid, Header, Segment, Card, Loader, Tab } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, SubmitField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import GoogleMap from '../components/GoogleMap';
import CategoryOpp from '../components/CategoryOpp';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { Categories } from '../../api/category/CategoryCollection';
import { Environments } from '../../api/environment/EnvironmentCollection';
import { Ages } from '../../api/age/AgeCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import Opportunity from '../components/Opportunity';
import MultiSelectField from '../../forms/controllers/MultiSelectField';
import Footer from '../components/Footer';

export const opportunityOrder = ['Upcoming', 'Latest', 'Nearby', 'A-Z'];
export const opportunityDay = ['One Term', 'Short Term', 'Long Term'];

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
  time: {
    type: String, optional: true,
    allowedValues: opportunityDay,
    defaultValue: opportunityDay[0],
  },
});
//
const bridge = new SimpleSchema2Bridge(formSchema);
const gridHeigth = { paddingRight: '50px', paddingLeft: '50px' };
//
function getOpportunities(titles) {
  const data = Opportunities.findOne({ title: titles });
  const age = _.pluck(OpportunitiesAges.find({ title: titles }).fetch(), 'age');
  // console.log(age);
  const environment = _.pluck(OpportunitiesEnvs.find({ title: titles }).fetch(), 'environment');
  const category = _.pluck(OpportunitiesCats.find({ title: titles}).fetch(), 'category');
  // const data2 = _.extend({ }, data, { age, environment });
  // console.log(data2);
  return _.extend({ }, data, { age, environment, category });
}
//
const FilterOpportunities = ({ ready }) => {
  // console.log(opportunities);
  const [filterParam, setFilterParam] = useState({
    order: '',
    age: [''],
    environment: [''],
  });
  const { age, environment } = filterParam;
  // console.log(age, environment);
  //
  const getAge = age ? _.flatten(age.map(ages => OpportunitiesAges.find({ age: { $in: [ages] } }).fetch())) : '';
  const getEnvironment = environment ? _.flatten(environment.map(environments => OpportunitiesEnvs.find({ environment: { $in: [environments] } }).fetch())) : '';
  // console.log(getEnvironment);
  // console.log(getAge);
  const getTitle = _.pluck(getAge, 'title').concat(_.pluck(getEnvironment, 'title'));
  // console.log(getEmails);
  const newOpportunities = _.uniq(getTitle).map(titles => getOpportunities(titles));
  // console.log(newOpportunities);
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
            <SelectField name='time'/>
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
      <Footer/>
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
  const sub1 = Opportunities.subscribeOpportunityPublic();
  // Get access to oppAge documents.
  const sub2 = OpportunitiesAges.subscribeOpportunitiesAgePublic();
  // Get access to oppEnvironment documents.
  const sub3 = OpportunitiesEnvs.subscribeOpportunitiesEnvPublic();
  // Get access to oppCategory documents
  const sub4 = OpportunitiesCats.subscribeOpportunitiesCatPublic();
  // Get access to age documents..
  const sub5 = Ages.subscribeAgePublic();
  // Get access to category documents.
  const sub6 = Categories.subscribeCategoryPublic();
  // Get access to environment documents.
  const sub7 = Environments.subscribeEnvironmentPublic();
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready();
  //
  return {
    ready,
  };
})(FilterOpportunities);

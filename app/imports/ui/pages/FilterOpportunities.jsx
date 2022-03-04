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
const makeSchema = (schemaAge, schemaEnv) => new SimpleSchema({
  names: { type: String, optional: true },
  orders: {
    type: String, optional: true,
    allowedValues: opportunityOrder,
    defaultValue: opportunityOrder[0],
  },
  ages: {
    type: Array, optional: true,
    label: 'Age Group',
  },
  'ages.$': {
    type: String,
    allowedValues: _.pluck(schemaAge, 'age'),
  },
  environments: {
    type: Array, optional: true,
    label: 'Environment',
  },
  'environments.$': {
    type: String,
    allowedValues: _.pluck(schemaEnv, 'environment'),
  },
  times: {
    type: String, optional: true,
    allowedValues: opportunityDay,
    defaultValue: opportunityDay[0],
  },
});
//
const gridHeigth = { paddingRight: '50px', paddingLeft: '50px' };
//
function ageIDD(_id) {
  const age = Ages.findOne({ _id: _id });
  return age.age;
}
//
function environmentIDD(_id) {
  const environment = Environments.findOne({ _id: _id });
  return environment.environment;
}
//
function getOpportunities(oppID) {
  const opportunity = Opportunities.findOne({ _id: oppID });
  const age = _.pluck(OpportunitiesAges.find({ oppID: oppID }).fetch(), 'ageID');
  const ageID = age.map(ages => ageIDD(ages));
  const environment = _.pluck(OpportunitiesEnvs.find({ oppID: oppID }).fetch(), 'envID');
  const environmentID = environment.map(environments => environmentIDD(environments));
  // const temp = _.extend({}, opportunity, { ageID, environmentID });
  return _.extend({}, opportunity, { ageID, environmentID });
}
//
const FilterOpportunities = ({ ready }) => {

  const schemaAge = Ages.find({}).fetch();
  const schemaEnv = Environments.find({}).fetch();
  const formSchema = makeSchema(schemaAge, schemaEnv);
  const bridge = new SimpleSchema2Bridge(formSchema);

  const [filterParam, setFilterParam] = useState({
    order: '',
    age: [''],
    environment: [''],
  });

  const { ages, environments } = filterParam;
  const getAge = ages ? _.pluck(ages.map(age => Ages.findDoc({ age })), '_id') : '';
  const getEnv = environments ? _.pluck(environments.map(environment => Environments.findDoc({ environment })), '_id') : '';
  const ageOppIds = getAge ? getAge.map(getAges => OpportunitiesAges.find({ ageID: getAges }).fetch()) : '';
  const envOppIds = getEnv ? getEnv.map(getEnvs => OpportunitiesEnvs.find({ envID: getEnvs }).fetch()) : '';
  const getIds = _.pluck(_.flatten(ageOppIds.concat(envOppIds)), 'oppID');
  const newOpportunities = _.uniq(getIds).map(ids => getOpportunities(ids));

  const panes = [
    {
      menuItem: 'Filter',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane attached={false}>
        <AutoForm schema={bridge} onSubmit={data => setFilterParam(data)}>
          <Segment>
            <TextField name='names'/>
            <SelectField name='orders'/>
            <MultiSelectField name='ages'/>
            <MultiSelectField name='environments'/>
            <SelectField name='times'/>
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
            {newOpportunities.map(opportunities => <Opportunity key={opportunities._id} opportunity={opportunities}/>)}
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
  const sub1 = Opportunities.subscribeOpportunity();
  // Get access to oppAge documents.
  const sub2 = OpportunitiesAges.subscribeOpportunitiesAge();
  // Get access to oppEnvironment documents.
  const sub3 = OpportunitiesEnvs.subscribeOpportunitiesEnvironment();
  // Get access to oppCategory documents
  const sub4 = OpportunitiesCats.subscribeOpportunitiesCategory();
  // Get access to age documents..
  const sub5 = Ages.subscribeAge();
  // Get access to category documents.
  const sub6 = Categories.subscribeCategory();
  // Get access to environment documents.
  const sub7 = Environments.subscribeEnvironment();
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready();
  //
  return {
    ready,
  };
})(FilterOpportunities);

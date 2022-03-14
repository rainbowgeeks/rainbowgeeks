import React, { useState } from 'react';
import { Container, Grid, Header, Segment, Card, Loader, Tab } from 'semantic-ui-react';
import { AutoForm, SubmitField, ErrorsField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import GoogleMap from '../components/GoogleMap';
import CategoryOpportunity from '../components/CategoryOpportunity';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { Categories } from '../../api/category/CategoryCollection';
import { Environments } from '../../api/environment/EnvironmentCollection';
import { Ages } from '../../api/age/AgeCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import Opportunity from '../components/Opportunity';
import MultiSelectField from '../../forms/controllers/MultiSelectField';
import RadioField from '../../forms/controllers/RadioField';
import Footer from '../components/Footer';
import { PAGE_IDS } from '../utilities/PageIDs';

export const opportunityOrder = ['Upcoming', 'Latest', 'Nearby', 'A-Z'];
export const opportunityDay = ['One Term', 'Short Term', 'Long Term'];
export const schemaAge = ['Adults', 'Family-Friendly', 'Teens', 'Seniors'];
export const schemaEnv = ['Indoors', 'Mixed', 'Outdoors', 'Virtual'];
export const schemaCat = {
  crisisDisasterRelief: 'Crisis/Disaster Relief', foodInsecurity: 'Food Insecurity', ENVIRONMENT: 'Environment',
  childFamilySupport: 'Child/Family Support', EDUCATION: 'Education', ongoingPositions: 'Ongoing Position',
  animalWelfareRescue: 'Animal Welfare/ Rescue', covid19Recovery: 'Covid-19 Recovery',
};

// Create a Schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  orders: {
    type: String, optional: true,
    allowedValues: opportunityOrder,
  },
  age: {
    type: Array, optional: true,
    label: 'Age Group',
  },
  'age.$': {
    type: String,
    allowedValues: schemaAge,
  },
  environment: {
    type: Array, optional: true,
    label: 'Environment',
  },
  'environment.$': {
    type: String,
    allowedValues: schemaEnv,
  },
});
//
const FilterOpportunities = ({ ready }) => {

  const makeOpportunities = (_id) => {
    const opportunity = Opportunities.findDoc({ _id });
    const age = _.pluck(OpportunitiesAges.find({ oppID: _id }).fetch(), 'age');
    const environment = _.pluck(OpportunitiesEnvs.find({ oppID: _id }).fetch(), 'environment');
    return _.extend({}, opportunity, { age, environment });
  };

  const getOpportunities = (newOpp) => {
    const { age, environment } = newOpp;
    const ageLength = age ? age.length : 0;
    const envLength = environment ? environment.length : 0;
    let opportunity;
    if (ageLength >= 1 || envLength >= 1) {
      const ageID = age ? age.map(ages => OpportunitiesAges.find({ age: ages }).fetch()) : '';
      const envID = environment ? environment.map(environments => OpportunitiesEnvs.find({ environment: environments }).fetch()) : '';
      const getIDS = _.flatten(ageID.concat(envID));
      const IDS = _.pluck(getIDS, 'oppID').filter(ID => ID !== ('' || undefined));
      opportunity = _.uniq(IDS);
    } else {
      opportunity = _.pluck(Opportunities.find({}).fetch(), '_id');
    }
    return opportunity.map(opportunities => makeOpportunities(opportunities));
  };

  const gridHeigth = { paddingRight: '50px', paddingLeft: '50px' };
  const bridge = new SimpleSchema2Bridge(formSchema);

  const [filterParam, setFilterParam] = useState({
    age: '',
    environment: '',
  });

  const newOpportunities = getOpportunities(filterParam);

  const panes = [
    {
      menuItem: 'Filter',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane attached={false}>
        <AutoForm schema={bridge} onSubmit={data => setFilterParam(data)}>
          <Segment>
            <RadioField name='orders'/>
            <MultiSelectField name='age'/>
            <MultiSelectField name='environment'/>
            <SubmitField value='Submit'/>
            <ErrorsField/>
          </Segment>
        </AutoForm>
      </Tab.Pane>,
    },
    {
      menuItem: 'Category',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane attached={false}><CategoryOpportunity/></Tab.Pane>,
    },
  ];

  return ((ready) ? (
    <Container id={PAGE_IDS.FILTER_OPPORTUNITIES} fluid style={gridHeigth}>
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

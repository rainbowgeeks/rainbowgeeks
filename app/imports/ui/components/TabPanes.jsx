import React, { useState } from 'react';
import { Grid, Header, Tab } from 'semantic-ui-react';
import { AutoForm, SubmitField } from 'uniforms-semantic';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import CategoryOpp from './CategoryOpp';
import SearchOpp from './SearchOpp';
import Opportunity from './Opportunity';
import GoogleMap from './GoogleMap';
import MultiSelectField from '../../forms/controllers/MultiSelectField';

export const schemaAge = ['Adults', 'Family-Friendly', 'Teens', 'Seniors'];
export const schemaEnv = ['Indoors', 'Mixed', 'Outdoors', 'Virtual'];

// Create a Schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
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

/** Renders a Tab for filter opportunities. */
const TabPanes = ({ opportunities, categories }) => {

  const [data, setData] = useState([]);
  const [filterParam, setFilterParam] = useState({
    age: [],
    environment: [],
  });
  const submit = (value, formRef) => {
    console.log(value);
    setFilterParam(value);
    formRef.reset();
  };
  const getCategories = (category) => {
    const cat = category;
    const getOppID = _.pluck(OpportunitiesCats.find({ category: cat.name }).fetch(), 'oppID');
    const getTotal = { total: getOppID };
    return _.extend({}, category, getTotal);
  };
  const makeCategories = categories.map(category => getCategories(category));
  const panes = [
    {
      menuItem: 'Search',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane>
        <SearchOpp opportunities={opportunities} getOpp={setData}/>
      </Tab.Pane>,
    },
    {
      menuItem: 'Category',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane>
        {makeCategories.map(category => <CategoryOpp key={category.index} category={category}/>)}
      </Tab.Pane>,
    },
  ];
  const bridge = new SimpleSchema2Bridge(formSchema);
  let fRef = null;
  return (
    <Grid celled columns={3}>
      <Grid.Column width={4}>
        <Header
          as="h2" textAlign="center"
          content="Volunteer Opportunities"
          subheader="Powered by VolunteerAlly"
        />
        <Tab
          menu={{
            attached: true,
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
        <AutoForm ref={ref => { fRef = ref; }}
          schema={bridge} onSubmit={value => submit(value, fRef)}>
          <MultiSelectField name='age'/>
          <MultiSelectField name='environment'/>
          <SubmitField value='Submit'/>
        </AutoForm>
      </Grid.Column>
      <Grid.Column width={5}>
        {(data.length !== 0) ? <Opportunity opportunity={data} filter={filterParam}/> :
          <Opportunity opportunity={opportunities} filter={filterParam}/>}
      </Grid.Column>
      <Grid.Column width={7}>
        <div>
          <GoogleMap/>
        </div>
      </Grid.Column>
    </Grid>

  );
};

// Require a document to be passed to this component
TabPanes.propTypes = {
  opportunities: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
};

// Wrap this component in withRouter.
export default withRouter(TabPanes);

import React, { useState } from 'react';
import { Grid, Segment, Header, Loader } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import swal from 'sweetalert';
// import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Redirect } from 'react-router-dom';
import { useParams } from 'react-router';
import SimpleSchema from 'simpl-schema';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { Categories } from '../../api/category/CategoryCollection';
import { Ages } from '../../api/age/AgeCollection';
import { Environments } from '../../api/environment/EnvironmentCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
// import { PAGE_IDS } from '../utilities/PageIDs';
import MultiSelectField from '../../forms/controllers/MultiSelectField';

export const schemaAge = ['Adults', 'Family-Friendly', 'Teens', 'Seniors'];
export const schemaEnv = ['Indoors', 'Mixed', 'Outdoors', 'Virtual'];
export const schemaCat = ['Crisis/Disaster Relief', 'Food Insecurity', 'Environment',
  'Child/Family Support', 'Education', 'Ongoing Position',
  'Animal Welfare/ Rescue', 'Covid-19 Recovery',
];

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  owner: { type: String, optional: true },
  title: { type: String, optional: true },
  cover: { type: String, optional: true },
  date: { type: String, optional: true },
  location: { type: String, optional: true },
  description: { type: String, optional: true },
  age: { type: Array, label: 'Age' },
  'age.$': { type: String, allowedValues: schemaAge },
  environment: { type: Array, label: 'Environment' },
  'environment.$': { type: String, allowedValues: schemaEnv },
  category: { type: Array, label: 'Category' },
  'category.$': { type: String, allowedValues: schemaCat },
});

/** Renders the Page for editing a document. */
const EditOpportunity = ({ ready, _id }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const getOpportunities = (oppID) => {
    const [opportunity] = Opportunities.find({ _id: oppID }).fetch();
    const age = _.pluck(OpportunitiesAges.find({ oppID: oppID }).fetch(), 'age');
    const environment = _.pluck(OpportunitiesEnvs.find({ oppID: oppID }).fetch(), 'environment');
    const category = _.pluck(OpportunitiesCats.find({ oppID: oppID }).fetch(), 'category');
    return _.extend({}, opportunity, { age, environment, category });
  };

  // On submit, insert the data.
  const submit = (data) => {
    const { owner, title, cover, date, location, description, age, environment, category } = data;
    let tempCollection = _.pluck(OpportunitiesAges.find({ oppID: _id }).fetch(), 'ageID');
    let oppID;
    let definitionData;
    let collectionName = Opportunities.getCollectionName();
    const updateData = { id: _id, owner, title, cover, date, location, description };
    updateMethod.callPromise({ collectionName, updateData }).then(() => tempCollection.forEach(ageID => {
      collectionName = OpportunitiesAges.getCollectionName();
      oppID = _id;
      const instance = { oppID, ageID };
      removeItMethod.callPromise({ collectionName, instance });
    }))
      .then(() => age.forEach(ages => {
        definitionData = { title: title, location: location, date: date, age: ages };
        defineMethod.callPromise({ collectionName, definitionData });
      }))
      .then(() => {
        tempCollection = _.pluck(OpportunitiesEnvs.find({ oppID: _id }).fetch(), 'envID');
        tempCollection.forEach(envID => {
          oppID = _id;
          collectionName = OpportunitiesEnvs.getCollectionName();
          const instance = { oppID, envID };
          removeItMethod.callPromise({ collectionName, instance });
        });
      })
      .then(() => environment.forEach(environments => {
        definitionData = { title: title, location: location, date: date, environment: environments };
        defineMethod.callPromise({ collectionName, definitionData });
      }))
      .then(() => {
        tempCollection = _.pluck(OpportunitiesCats.find({ oppID: _id }).fetch(), 'catID');
        tempCollection.forEach(catID => {
          oppID = _id;
          collectionName = OpportunitiesCats.getCollectionName();
          const instance = { oppID, catID };
          removeItMethod.callPromise({ collectionName, instance });
        });
      })
      .then(() => category.forEach(categories => {
        definitionData = { title: title, location: location, date: date, category: categories };
        defineMethod.callPromise({ collectionName, definitionData });
      }))
      .then(() => swal('Success', 'Opportunity edited successfully', 'success'))
      .catch(error => swal('Error', error.message, 'error'));
    setRedirectToReferer(true);
  };

  const { from } = { from: { pathname: '/org-profile' } };
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }

  // For creating a form schema.
  const bridge = new SimpleSchema2Bridge(formSchema);
  // For pulling opportunity related to the _id
  const model = getOpportunities(_id);

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  return ((ready) ? (
    <Grid container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Edit Opportunity</Header>
        <AutoForm model={model} schema={bridge} onSubmit={data => submit(data)}>
          <Segment>
            <TextField name='owner'/>
            <TextField name='title'/>
            <TextField name='cover'/>
            <TextField name='date'/>
            <TextField name='location'/>
            <LongTextField name='description'/>
            <MultiSelectField name='age'/>
            <MultiSelectField name='environment'/>
            <MultiSelectField name='category'/>
            <SubmitField value='Submit'/>
            <ErrorsField/>
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting Data</Loader>);
};

EditOpportunity.propTypes = {
  _id: PropTypes.string,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Ge the documentID from the URL field.
  const { _id } = useParams();
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
    _id,
    ready,
  };
})(EditOpportunity);

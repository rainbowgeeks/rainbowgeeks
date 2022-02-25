import React from 'react';
import { Grid, Segment, Header, Loader } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import SimpleSchema from 'simpl-schema';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { Categories } from '../../api/category/CategoryCollection';
import { Ages } from '../../api/age/AgeCollection';
import { Environments } from '../../api/environment/EnvironmentCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
// import { PAGE_IDS } from '../utilities/PageIDs';
import MultiSelectField from '../../forms/controllers/MultiSelectField';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = (getAge, getEnvironment, getCategory) => new SimpleSchema({
  owner: String,
  title: String,
  cover: String,
  date: String,
  location: String,
  description: { type: String, optional: true },
  age: { type: Array, label: 'Age' },
  'age.$': { type: String, allowedValues: getAge },
  environment: { type: Array, label: 'Environment' },
  'environment.$': { type: String, allowedValues: getEnvironment },
  category: { type: Array, label: 'Category' },
  'category.$': { type: String, allowedValues: getCategory },
});

/** Renders the Page for adding a document. */
const AddOpportunity = ({ ready }) => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { owner, title, cover, date, location, description, age, environment, category } = data;
    // const user = Meteor.user().username;
    let collectionName = Opportunities.getCollectionName();
    let definitionData = { owner: owner, title: title, cover: cover, date: date, location: location, description: description };
    defineMethod.callPromise({ collectionName, definitionData }).catch(error => swal('Error', error.message, 'error')).then(() => {
      swal('Success', 'Opportunity added successfully', 'success');
      age.forEach(ages => {
        collectionName = OpportunitiesAges.getCollectionName();
        definitionData = { title: title, owner: owner, age: ages };
        defineMethod.callPromise({ collectionName, definitionData });
      });
      environment.forEach(environments => {
        collectionName = OpportunitiesEnvs.getCollectionName();
        definitionData = { title: title, owner: owner, environment: environments };
        defineMethod.callPromise({ collectionName, definitionData });
      });
      category.forEach(categories => {
        collectionName = OpportunitiesCats.getCollectionName();
        definitionData = { title: title, owner: owner, category: categories };
        defineMethod.callPromise({ collectionName, definitionData });
      });
      formRef.reset();
    });
  };

  const getAge = _.pluck(Ages.find().fetch(), 'age');
  const getEnvironment = _.pluck(Environments.find().fetch(), 'environment');
  const getCategory = _.pluck(Categories.find().fetch(), 'category');
  const makeSchema = formSchema(getAge, getEnvironment, getCategory);
  const bridge = new SimpleSchema2Bridge(makeSchema);

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return ((ready) ? (
    <Grid container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Add ORGANIZATION</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
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

AddOpportunity.propTypes = {
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Ge the documentID from the URL field.
  const { _id } = useParams();
  const documentId = _id;
  console.log(useParams());
  console.log(documentId);
  // Get access to opportunity documents.
  const sub1 = Opportunities.subscribeOpportunityOrganization();
  // Get access to oppAge documents.
  const sub2 = OpportunitiesAges.subscribeOpportunitiesAgeOrganization();
  // Get access to oppEnvironment documents.
  const sub3 = OpportunitiesEnvs.subscribeOpportunitiesEnvOrganization();
  // Get access to oppCategory documents
  const sub4 = OpportunitiesCats.subscribeOpportunitiesCatOrganization();
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
})(AddOpportunity);

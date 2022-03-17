import React, { useState } from 'react';
import { Grid, Segment, Header, Loader } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Redirect } from 'react-router-dom';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { OpportunitiesPocs } from '../../api/opportunity/OpportunitiesPocCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import { PointOfContacts } from '../../api/point-of-contact/PointOfContactCollection';
import { Categories } from '../../api/category/CategoryCollection';
import { Ages } from '../../api/age/AgeCollection';
import { Environments } from '../../api/environment/EnvironmentCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
// import { PAGE_IDS } from '../utilities/PageIDs';
import MultiSelectField from '../../forms/controllers/MultiSelectField';
import RadioField from '../../forms/controllers/RadioField';

export const schemaAge = ['Adults', 'Family-Friendly', 'Teens', 'Seniors'];
export const schemaEnv = ['Indoors', 'Mixed', 'Outdoors', 'Virtual'];
export const schemaCat = ['Crisis/Disaster Relief', 'Food Insecurity', 'Environment',
  'Child/Family Support', 'Education', 'Ongoing Position',
  'Animal Welfare/ Rescue', 'Covid-19 Recovery'];

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = (pocSchema) => new SimpleSchema({
  owner: { type: String, optional: true,
    allowedValues: pocSchema, label: 'Point of Contact',
  },
  title: String,
  cover: String,
  date: String,
  location: String,
  description: { type: String, optional: true },
  age: { type: Array, label: 'Age' },
  'age.$': { type: String, allowedValues: schemaAge },
  environment: { type: Array, label: 'Environment' },
  'environment.$': { type: String, allowedValues: schemaEnv },
  category: { type: Array, label: 'Category' },
  'category.$': { type: String, allowedValues: schemaCat },
});

/** Renders the Page for adding a document. */
const AddOpportunity = ({ ready, username }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { owner, title, cover, date, location, description, age, environment, category } = data;
    let collectionName = Opportunities.getCollectionName();
    let definitionData = { owner: owner, title: title, cover: cover, date: date, location: location, description: description };
    defineMethod.callPromise({ collectionName, definitionData }).then(() => age.forEach(ages => {
      collectionName = OpportunitiesAges.getCollectionName();
      definitionData = { title: title, owner: owner, age: ages };
      defineMethod.callPromise({ collectionName, definitionData });
    })).then(() => environment.forEach(environments => {
      collectionName = OpportunitiesEnvs.getCollectionName();
      definitionData = { title: title, owner: owner, environment: environments };
      defineMethod.callPromise({ collectionName, definitionData });
    })).then(() => category.forEach(categories => {
      collectionName = OpportunitiesCats.getCollectionName();
      definitionData = { title: title, owner: owner, category: categories };
      defineMethod.callPromise({ collectionName, definitionData });
    }))
      .then(() => {
        collectionName = OrganizationPocs.getCollectionName();
        definitionData = { email: owner, orgEmail: username };
        defineMethod.callPromise({ collectionName, definitionData });
      })
      .then(() => {
        collectionName = OpportunitiesPocs.getCollectionName();
        definitionData = { email: owner, title, location, date };
        defineMethod.callPromise({ collectionName, definitionData });
      })
      .then(() => swal('Success', 'Opportunity added successfully', 'success'))
      .catch(error => swal('Error', error.message, 'error'));
    formRef.reset();
    setRedirectToReferer(true);
  };

  const { from } = { from: { pathname: '/org-profile' } };
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }

  const pocSchema = _.pluck(OrganizationPocs.find({ orgEmail: username }).fetch(), 'pocEmail');
  const makeSchema = formSchema(pocSchema, username);
  const bridge = new SimpleSchema2Bridge(makeSchema);

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return ((ready) ? (
    <Grid container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Add Opportunity</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Segment>
            <RadioField name='owner'/>
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
  username: PropTypes.string,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get the username of current user.
  const username = Meteor.user().username;
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
  const sub8 = Organizations.subscribeOrganization();
  const sub9 = OpportunitiesPocs.subscribeOpportunitiesPoc();
  const sub10 = OrganizationPocs.subscribeOrganizationPoc();
  const sub11 = PointOfContacts.subscribePointOfContact();
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready() && sub9.ready() && sub10.ready() && sub11.ready();
  //
  return {
    username,
    ready,
  };
})(AddOpportunity);
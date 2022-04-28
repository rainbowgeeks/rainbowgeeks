import React, { useState } from 'react';
import { Grid, Segment, Header, Loader } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField, DateField, HiddenField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Redirect } from 'react-router-dom';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Geocode from 'react-geocode';
import { useParams } from 'react-router';
import SimpleSchema from 'simpl-schema';
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
import { defineMethod, removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import MultiSelectField from '../../forms/controllers/MultiSelectField';
import RadioField from '../../forms/controllers/RadioField';
import { Locations } from '../../api/location/LocationCollection';

export const schemaAge = ['Adults', 'Family-Friendly', 'Teens', 'Seniors'];
export const schemaEnv = ['Indoors', 'Mixed', 'Outdoors', 'Virtual'];
export const schemaCat = ['Crisis/Disaster Relief', 'Food Insecurity', 'Environment',
  'Child/Family Support', 'Education', 'Ongoing Position',
  'Animal Welfare/ Rescue', 'Covid-19 Recovery',
];

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey('AIzaSyA8P8TFj6VpzBM4dNJWayH6fi5zLU7qmOw');

// set response language. Defaults to english.
Geocode.setLanguage('en');

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = (pocSchema) => new SimpleSchema({
  owner: {
    type: String, optional: true,
    allowedValues: pocSchema, label: 'Point of Contact',
  },
  title: { type: String, optional: true },
  cover: { type: String, optional: true },
  oppStart: { type: Date, optional: true },
  oppEnd: { type: Date, optional: true },
  location: { type: String, optional: true },
  checked: { type: Boolean, optional: true },
  description: { type: String, optional: true },
  age: { type: Array, label: 'Age' },
  'age.$': { type: String, allowedValues: schemaAge },
  environment: { type: Array, label: 'Environment' },
  'environment.$': { type: String, allowedValues: schemaEnv },
  category: { type: Array, label: 'Category' },
  'category.$': { type: String, allowedValues: schemaCat },
});

/** Renders the Page for editing a document. */
const EditOpportunity = ({ ready, _id, username }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const [value, setValue] = useState('');

  const getOpportunities = (oppID) => {
    const [opportunity] = Opportunities.find({ _id: oppID }).fetch();
    const age = _.pluck(OpportunitiesAges.find({ oppID: oppID }).fetch(), 'age');
    const environment = _.pluck(OpportunitiesEnvs.find({ oppID: oppID }).fetch(), 'environment');
    const category = _.pluck(OpportunitiesCats.find({ oppID: oppID }).fetch(), 'category');
    return _.extend({}, opportunity, { age, environment, category });
  };

  // On submit, insert the data.
  const submit = (data) => {
    const { owner, title, cover, oppStart, oppEnd, location, description, age, environment, category } = data;
    let getIDS;
    let definitionData;
    let collectionName = Opportunities.getCollectionName();
    let updateData = { id: _id, owner, title, cover, oppStart, oppEnd, location, description };
    const orgID = Organizations.findDoc({ orgEmail: username })._id;
    const pocID = PointOfContacts.findDoc({ email: owner })._id;
    updateMethod.callPromise({ collectionName, updateData })
      .then(() => {
        getIDS = _.pluck(OpportunitiesAges.find({ oppID: _id }).fetch(), '_id');
        getIDS.forEach(ID => {
          collectionName = OpportunitiesAges.getCollectionName();
          const instance = { _id: ID };
          removeItMethod.callPromise({ collectionName, instance });
        });
      })
      .then(() => age.forEach(ages => {
        definitionData = { title: title, location: location, age: ages };
        defineMethod.callPromise({ collectionName, definitionData });
      }))
      .then(() => {
        getIDS = _.pluck(OpportunitiesEnvs.find({ oppID: _id }).fetch(), '_id');
        getIDS.forEach(ID => {
          collectionName = OpportunitiesEnvs.getCollectionName();
          const instance = { _id: ID };
          removeItMethod.callPromise({ collectionName, instance });
        });
      })
      .then(() => environment.forEach(environments => {
        definitionData = { title: title, location: location, environment: environments };
        defineMethod.callPromise({ collectionName, definitionData });
      }))
      .then(() => {
        getIDS = _.pluck(OpportunitiesCats.find({ oppID: _id }).fetch(), '_id');
        getIDS.forEach(ID => {
          collectionName = OpportunitiesCats.getCollectionName();
          const instance = { _id: ID };
          removeItMethod.callPromise({ collectionName, instance });
        });
      })
      .then(() => category.forEach(categories => {
        definitionData = { title: title, location: location, category: categories };
        defineMethod.callPromise({ collectionName, definitionData });
      }))
      .then(() => {
        getIDS = OrganizationPocs.findDoc({ orgID, pocEmail: owner })._id;
        collectionName = OrganizationPocs.getCollectionName();
        updateData = { id: getIDS, email: owner, pocID };
      })
      .then(() => {
        getIDS = OpportunitiesPocs.findDoc({ oppID: _id });
        collectionName = OpportunitiesPocs.getCollectionName();
        updateData = { id: getIDS._id, pocID, pocEmail: owner };
      })
      .then(() => {
        Geocode.fromAddress(location).then(
          (response) => {
            const { lat, lng } = response.results[0].geometry.location;
            getIDS = Locations.findDoc({ address: location });
            collectionName = Locations.getCollectionName();
            updateData = { id: getIDS._id, address: location, lat, long: lng };
            updateMethod.callPromise({ collectionName, updateData });
          },
        );
      })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Opportunity edited successfully', 'success'));
    setRedirectToReferer(true);
  };

  const { from } = { from: { pathname: '/manage-opp' } };
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }

  // For creating a form schema.
  const pocSchema = _.pluck(OrganizationPocs.find({ orgEmail: username }).fetch(), 'pocEmail');
  const makeSchema = formSchema(pocSchema, username);
  const bridge = new SimpleSchema2Bridge(makeSchema);
  let model;
  // For pulling opportunity related to the _id
  if (ready && _id) {
    model = getOpportunities(_id);
  }
  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  return ((ready) ? (
    <Grid container id={PAGE_IDS.EDIT_OPPORTUNITY} centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Edit Opportunity</Header>
        <AutoForm model={model} schema={bridge} onSubmit={data => submit(data)}>
          <Segment>
            <RadioField name='owner'/>
            <TextField name='title'/>
            <TextField name='cover'/>
            <DateField name="oppStart"/>
            <DateField name="oppEnd"/>
            <GooglePlacesAutocomplete
              apiKey="AIzaSyBDiD5UqNxunHW47TztQ5NlMl5UFsEy4Xc"
              selectProps={{
                value,
                onChange: setValue,
              }}
            />
            <LongTextField name='description'/>
            <MultiSelectField name='age'/>
            <MultiSelectField name='environment'/>
            <MultiSelectField name='category'/>
            <HiddenField name={'location'} value={value !== null && value !== undefined ? value.label : ''}/>
            <HiddenField name={'checked'} value={false}/>
            <SubmitField value='Submit'/>
            <ErrorsField/>
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting Data</Loader>);
};

EditOpportunity.propTypes = {
  username: PropTypes.string,
  _id: PropTypes.string,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get the username of current user.
  const username = Meteor.user().username;
  // Get the documentID from the URL field.
  const { _id } = useParams();
  // Gives access to opportunity documents
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
  // Get access to environments documents.
  const sub8 = Organizations.subscribeOrganization();
  // Get access to Opp point of contacts documents.
  const sub9 = OpportunitiesPocs.subscribeOpportunitiesPoc();
  // Get access to Org point of contacts documents.
  const sub10 = OrganizationPocs.subscribeOrganizationPoc();
  // Get accces to Point of Contact documents.
  const sub11 = PointOfContacts.subscribePointOfContact();
  // Get access to locations documents
  const sub12 = Locations.subscribeLocation();
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready() && sub9.ready() && sub10.ready() && sub11.ready() && sub12.ready();
  //
  return {
    username,
    _id,
    ready,
  };
})(EditOpportunity);

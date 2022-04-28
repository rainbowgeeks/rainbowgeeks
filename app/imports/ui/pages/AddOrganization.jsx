import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Grid, Segment, Header, Form, Loader, Divider, Container } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField, HiddenField, SelectField } from 'uniforms-semantic';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema from 'simpl-schema';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { OrganizationProfiles } from '../../api/user/OrganizationProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  organizationName: { type: String, label: 'Organization Name' },
  missionStatement: { type: String, label: 'Mission Statement' },
  description: { type: String, label: 'About the Organization' },
  orgEmail: { type: String, label: 'Organization Email' },
  orgImage: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  acceptTerm: String,
});

/** Renders the Page for adding a document. */
const AddOrganization = ({ ready, username }) => {
  console.log(username);
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { organizationName, missionStatement, description, orgEmail, orgImage, city, state, zip, acceptTerm } = data;
    const collectionName = Organizations.getCollectionName();
    const definitionData = { organizationName, missionStatement, description, orgEmail, orgImage, city, state, zip, acceptTerm };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Item added successfully', 'success');
        formRef.reset();
        setRedirectToReferer(true);
      });
  };
  const bridge = new SimpleSchema2Bridge(formSchema);

  const { from } = { from: { pathname: '/org-profile' } };
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return ((ready) ? (
    <Grid id={PAGE_IDS.ADD_ORGANIZATION} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Create My Profile</Header>
        <Divider/>
        <Container>
          <AutoForm ref={ref => {
            fRef = ref;
          }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Segment inverted color={'blue'}>
              <Form.Group widths={'equal'}>
                <TextField name={'organizationName'}/>
                <TextField name={'orgEmail'} value={_.pluck(username, 'email').toString()}/>
              </Form.Group>
              <TextField name='address'/>
              <Form.Group width={'equal'}>
                <TextField name='city'/>
                <TextField name='state'/>
                <TextField name='zip'/>
              </Form.Group>
              <LongTextField name={'missionStatement'} placeholder={'Share your Organization\'s values'}/>
              <LongTextField name={'description'} placeholder={'What kind of work does your Organization do?'}/>
              <p>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                By accepting now, you agree to Volunteer Ally's
                <a style={{ fontColor: 'white' }} href="https://volunteerally.org/privacy-policy"> Terms & Conditions</a> and <a href="https://volunteerally.org/privacy-policy"> Privacy Policy.</a>
              </p>
              <SelectField name='acceptTerm' checkboxes allowedValues={['Accept']}/>
              <HiddenField name='orgImage' value='https://react.semantic-ui.com/images/avatar/large/matthew.png'/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Container>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting Data</Loader>);
};

AddOrganization.propTypes = {
  username: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const sub1 = OrganizationProfiles.subscribe();
  const userID = Meteor.userId();
  console.log(userID);
  const username = OrganizationProfiles.find({ userID }).fetch();
  const ready = sub1.ready();
  return {
    username,
    ready,
  };
})(AddOrganization);

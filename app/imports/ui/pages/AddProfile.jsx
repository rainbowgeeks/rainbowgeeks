import React, { useState } from 'react';
import { Grid, Segment, Header, Form, Container } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
  SelectField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Redirect } from 'react-router-dom';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import MultiSelectField from '../../forms/controllers/MultiSelectField';

const bridge = new SimpleSchema2Bridge(UserProfileData._schema);

/** Renders the Page for adding a document. */
const AddProfile = () => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const {
      firstName,
      lastName,
      phoneNumber,
      interest,
      specialInterest,
      environmentalPref,
      availability,
      profileImage,
      aboutUser } = data;
    const owner = Meteor.user().username;
    const collectionName = UserProfileData.getCollectionName();
    const definitionData = {
      owner,
      firstName,
      lastName,
      phoneNumber,
      interest,
      specialInterest,
      environmentalPref,
      availability,
      profileImage,
      aboutUser };
    definitionData.profileImage = 'https://react.semantic-ui.com/images/avatar/large/matthew.png';
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Item added successfully', 'success');
        setRedirectToReferer(true);
        formRef.reset();
      });
  };
  const { from } = { from: { pathname: '/profile' } };
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }
  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Grid id={PAGE_IDS.ADD_PROFILE} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Add Profile</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge}
        onSubmit={data => submit(data, fRef)}>
          <Segment>
            <Header as="h2" textAlign="center">Profile Information</Header>
            <Segment padded>
              <Form.Group widths='equal'>
                <TextField name='firstName' showinline/>
                <TextField name='owner'/>
                <TextField name='lastName' />
                <TextField name='phoneNumber' />
                <TextField name='profileImage' placeholder='https://react.semantic-ui.com/images/avatar/large/matthew.png'/>
              </Form.Group>
              <LongTextField name='aboutUser' placeholder='Edit About Me'/>
            </Segment>
          </Segment>
          <Segment>
            <Header as='h3' textAlign='center'>My Prefrence</Header>
            <Segment>
              <TextField name='specialInterest'/>
              <MultiSelectField name='interest'/>
              <SelectField name='environmentalPref' checkboxes/>
              <SelectField name='availability' checkboxes/>
            </Segment>
          </Segment>
          <Container textAlign='right'>
            <SubmitField value='Submit'/>
            <ErrorsField/>
          </Container>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

export default (AddProfile);

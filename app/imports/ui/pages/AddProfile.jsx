import React, { useState } from 'react';
import { Grid, Segment, Header, Form, Container } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
  SelectField, HiddenField,
} from 'uniforms-semantic';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import MultiSelectField from '../../forms/controllers/MultiSelectField';
import { UserProfiles } from '../../api/user/UserProfileCollection';

const bridge = new SimpleSchema2Bridge(UserProfileData._schema);

/** Renders the Page for adding a document. */
const AddProfile = ({ userData }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const getUser = [...userData];
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const {
      owner,
      firstName,
      lastName,
      phoneNumber,
      interest,
      specialInterest,
      environmentalPref,
      availability,
      profileImage,
      aboutUser } = data;
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
                <TextField name='firstName' showinline placeholder={_.pluck(getUser, 'firstName').toString()} value={_.pluck(getUser, 'firstName').toString()}/>
                <HiddenField name='owner' value={_.pluck(getUser, 'email').toString()}/>
                <TextField name='lastName' value={_.pluck(getUser, 'lastName').toString()}/>
                <TextField name='phoneNumber' />
                <HiddenField name='profileImage' value='https://react.semantic-ui.com/images/avatar/large/matthew.png'/>
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

AddProfile.prototype = {
  userData: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const subscribe = UserProfiles.subscribe();
  const ready = subscribe.ready();
  const userID = Meteor.userId();
  const data = UserProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const temp = [...data];
  const userData = [];
  temp.forEach((value) => {
    if (value.userID === userID) {
      userData.push(value);
    }
  });
  return {
    userData,
    ready,
  };
})(AddProfile);

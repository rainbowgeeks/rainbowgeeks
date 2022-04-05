import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Segment, Header, Form, Container, Divider } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
  SelectField, HiddenField, DateField,
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
// eslint-disable-next-line react/prop-types
const AddProfile = ({ userData }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const getUser = [...userData];
  const submit = (data, formRef) => {
    const {
      owner,
      firstName,
      lastName,
      phoneNumber,
      specialInterest,
      profileImage,
      aboutUser,
      acceptTermsOfCondition,
      dateOfBirth,
      homeAddress,
      city,
      state,
      zip,
      interest,
      environmentalPref,
      availability } = data;
    const collectionName = UserProfileData.getCollectionName();
    const definitionData = {
      owner,
      firstName,
      lastName,
      phoneNumber,
      specialInterest,
      profileImage,
      aboutUser,
      acceptTermsOfCondition,
      dateOfBirth,
      homeAddress,
      city,
      state,
      zip,
      interest,
      environmentalPref,
      availability };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'SuccessFully Created Profile', 'success');
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
    <Container id={PAGE_IDS.ADD_PROFILE}>
      <Segment inverted color={'blue'}>
        <Header as="h1" textAlign="center">Create My Profile</Header>
        <Divider/>
        <Container id='edit-profile-form'>
          <AutoForm ref={ref => {
            fRef = ref;
          }} schema={bridge}
          onSubmit={data => submit(data, fRef)}>
            <Segment>
              <Container>
                <Header as="h3" textAlign="center">Profile Information</Header>
                <Segment padded>
                  <Form.Group widths='equal'>
                    <TextField name='firstName' label='First name' placeholder={_.pluck(getUser, 'firstName').toString()}/>
                    <TextField name='lastName' label='Last name' placeholder={_.pluck(getUser, 'lastName').toString()}/>
                    <HiddenField name='owner' value={_.pluck(getUser, 'email').toString()}/>
                    <HiddenField name='profileImage' value='https://react.semantic-ui.com/images/avatar/large/matthew.png'/>
                  </Form.Group>
                  <TextField name='homeAddress'/>
                  <Form.Group width={3}>
                    <TextField name='city'/>
                    <TextField name='state'/>
                    <TextField name='zip'/>
                  </Form.Group>
                  <Form.Group width={2}>
                    <TextField name='phoneNumber' />
                    <DateField name='dateOfBirth'/>
                  </Form.Group>
                  <LongTextField name='aboutUser' label='About Me' placeholder='Enter a Brief Introduction of yourself'/>
                </Segment>
                <Segment>
                  <Header as="h3" textAlign="center">My Preferences</Header>
                  <TextField name='specialInterest'/>
                  <MultiSelectField name='interest'/>
                  <SelectField name='environmentalPref' checkboxes/>
                  <SelectField name='availability' checkboxes/>
                </Segment>
              </Container>
              <Divider/>
              <Container>
                <p>
                  By accepting now, you agree to VolunteeringAlly&apos;s
                  <a href="https://volunteerally.org/privacy-policy" target="_blank" rel="noreferrer"> Terms & Conditions</a> and <a href="https://volunteerally.org/privacy-policy" target="_blank" rel="noreferrer"> Privacy Policy.</a>
                </p>
                <SelectField name='acceptTermsOfCondition' checkboxes allowedValues={['Accept Terms & Conditions and Privacy Policy']}/>
              </Container>

              <Container textAlign='right'>
                <SubmitField value='Create My Profile'/>
                <ErrorsField/>
              </Container>
            </Segment>

          </AutoForm>
        </Container>
      </Segment>
    </Container>
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

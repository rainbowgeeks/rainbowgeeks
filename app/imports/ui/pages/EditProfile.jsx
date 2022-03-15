import React, { useState } from 'react';
import { Container, Divider, Form, Header, Loader, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import MultiSelectField from '../../forms/controllers/MultiSelectField';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const bridge = new SimpleSchema2Bridge(UserProfileData._schema);

/** Renders the Page for editing a single profile document. */
const EditProfile = ({ doc, ready }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const [uploadFile, setUploadFile] = useState({});
  const submit = (data) => {
    const {
      firstName,
      lastName,
      phoneNumber,
      aboutUser,
      specialInterest,
      interest,
      environmentalPref,
      availability,
      _id } = data;

    const collectionName = UserProfileData.getCollectionName();
    const updateData = {
      id: _id,
      firstName,
      lastName,
      phoneNumber,
      aboutUser,
      specialInterest,
      interest,
      environmentalPref,
      availability,
    };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Profile Page Had Successfully Been Updated', 'success');
        setRedirectToReferer(true);
      });
  };

  // Will be used to upload the image to mongo
  const myImage = () => {
    // this line prints out the file content
    console.log(uploadFile); // curenntly uploadFile value = event.target.files

    // idea when click the submit button, store file into a state, then
    // somehow get this state's value into the main submit
  };

  const { from } = { from: { pathname: '/profile' } };
  if (redirectToReferer) {
    return <Redirect to={from} />;
  }

  return (ready) ? (
    <Container id={PAGE_IDS.EDIT_PROFILE}>
      <Header as='h1' size='Large' textAlign='center'> UPDATE MY PROFILE </Header>
      <Divider/>

      <Form onSubmit={myImage}>
        <label htmlFor="file">Choose file to upload</label>
        <input
          type='file'
          accept='image/*'
          onChange={event => setUploadFile(event.target.files)}
        />
        <input
          type='submit'
        />
      </Form>

      <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
        <Segment>
          <Header as="h3" textAlign="center">Update My Information</Header>
          <Segment padded>
            <Form.Group widths='equal'>
              <TextField name='firstName' showinline/>
              <TextField name='lastName' />
              <TextField name='phoneNumber' />
            </Form.Group>
            <LongTextField name='aboutUser' placeholder='Edit About Me'/>
          </Segment>
        </Segment>
        <Segment>
          <Header as='h3' textAlign='center'>Update My Preferences</Header>
          <Segment>
            <TextField name='specialInterest'/>
            <MultiSelectField name='interest'/>
            <SelectField name='environmentalPref' checkboxes/>
            <SelectField name='availability' checkboxes/>
          </Segment>
        </Segment>
        <Container textAlign='right'>
          <SubmitField id='submit-update-profile' value='Submit' />
        </Container>
        <ErrorsField />
      </AutoForm>
    </Container>
  ) : <Loader active>Getting data</Loader>;
};

EditProfile.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // get docID from the URL
  const { _id } = useParams();
  const documentId = _id;
  const subscription = UserProfileData.subscribeUserProfile();
  const ready = subscription.ready();
  // get the doc
  const doc = UserProfileData.findOne({ _id: documentId }, {});
  return {
    doc,
    ready,
  };
})(EditProfile);

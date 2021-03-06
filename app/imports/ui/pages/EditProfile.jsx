import React, { useState } from 'react';
import { Button, Container, Divider, Form, Header, Loader, Segment } from 'semantic-ui-react';
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
import Footer2 from '../components/Footer2';

const bridge = new SimpleSchema2Bridge(UserProfileData._schema);

/** Renders the Page for editing a single profile document. */
const EditProfile = ({ doc, ready }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const [uploadFile, setUploadFile] = useState({});
  const [currentImage, setNewImage] = useState('');
  // eslint-disable-next-line no-undef
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
      homeAddress,
      city,
      state,
      zip,
      _id } = data;
    const collectionName = UserProfileData.getCollectionName();
    const updateData = {
      id: _id,
      firstName,
      lastName,
      phoneNumber,
      aboutUser,
      homeAddress,
      city,
      state,
      zip,
      specialInterest,
      interest,
      environmentalPref,
      availability,
    };
    if (currentImage !== '') {
      updateData.profileImage = currentImage;
    }
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal({
          title: 'Profile Had Successfully Been Updated',
          icon: 'success',
          timer: 15000,
        });
        setRedirectToReferer(true);
      });

  };

  const myImage = async () => {
    // eslint-disable-next-line no-undef
    if (_.isEmpty(uploadFile)) {
      swal({
        title: 'No Image File Detected',
        icon: 'error',
        timer: 15000,
      });
      return;
    }
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append('file', uploadFile[0]);
    formData.append('upload_preset', 'fjm4awsr');
    formData.append('cload_name', 'dmgtqeajr');
    // eslint-disable-next-line no-undef
    await fetch('https://api.cloudinary.com/v1_1/dmgtqeajr/image/upload', {
      method: 'POST',
      body: formData,
    }).then(respond => respond.json())
      .then(data => {
        setNewImage(data.secure_url);
        swal({
          title: 'Image saved',
          icon: 'success',
          text: 'Click Update Profile to Update your Profile Image!',
          timer: 15000,
        });
      });
  };

  const { from } = { from: { pathname: '/profile' } };
  if (redirectToReferer) {
    return <Redirect to={from} />;
  }

  return (ready) ? (
    <Container id={PAGE_IDS.EDIT_PROFILE}>
      <Segment inverted color={'blue'}>
        <Header as='h1' size='large' textAlign='center'> UPDATE MY PROFILE </Header>
        <Divider/>
        <Container className='edit-profile-form'>
          <Segment>
            <Header as="h3" textAlign="center">Update my Profile Image</Header>
            <Segment>
              <Form onSubmit={myImage} widths={'equal'}>
                <Form.Input
                  size={'small'}
                  label={'Input Image'}
                  fluid
                  type='file'
                  accept='image/*'
                  onChange={event => setUploadFile(event.target.files)}
                />
                <Button type='submit'> Save </Button>
              </Form>
            </Segment>
          </Segment>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Segment>
              <Header as="h3" textAlign="center">Update My Information</Header>
              <Segment>
                <Form.Group widths='equal'>
                  <TextField name='firstName'/>
                  <TextField name='lastName' />
                </Form.Group>
                <TextField name='phoneNumber' />
                <TextField name='homeAddress'/>
                <Form.Group width='3'>
                  <TextField name='city'/>
                  <TextField name='state'/>
                  <TextField name='zip'/>
                </Form.Group>
                <LongTextField name='aboutUser' placeholder='Edit About Me'/>
              </Segment>
            </Segment>
            <Segment >
              <Header as='h3' textAlign='center'>Update My Preferences</Header>
              <Segment>
                <TextField name='specialInterest'/>
                <MultiSelectField name='interest'/>
                <SelectField name='environmentalPref' checkboxes/>
                <SelectField name='availability' checkboxes/>
              </Segment>
              <Container textAlign='right'>
                <SubmitField value='Update Profile' />
              </Container>
              <ErrorsField />
            </Segment>
          </AutoForm>

        </Container>
      </Segment>
      <Footer2/>
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

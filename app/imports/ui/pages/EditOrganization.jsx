import React, { useState } from 'react';
import { Segment, Header, Form, Loader, Divider, Container, Button } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField} from 'uniforms-semantic';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema from 'simpl-schema';
import { useParams } from 'react-router';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
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
const EditOrganization = ({ ready, orgProfile }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const [uploadFile, setUploadFile] = useState({});
  const [currentImage, setNewImage] = useState('');
  // On submit, insert the data.
  const submit = (data) => {
    const { organizationName, missionStatement, description, orgEmail, orgImage, city, state, zip, acceptTerm, _id } = data;
    const collectionName = Organizations.getCollectionName();
    const updateData = { id: _id, organizationName, missionStatement, description, orgEmail, orgImage, city, state, zip, acceptTerm };
    if (currentImage !== '') {
      updateData.orgImage = currentImage;
    }
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal({
          title: 'Organization Profile Had Successfully Updated',
          icon: 'success',
          timer: 15000,
        });
        setRedirectToReferer(true);
      });
  };
  const orgImage = async () => {
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

  const bridge = new SimpleSchema2Bridge(formSchema);

  const { from } = { from: { pathname: '/org-profile' } };
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return ((ready && orgProfile) ? (
    <Container id={PAGE_IDS.ADD_ORGANIZATION} centered>
      <Segment>
        <Header as='h1' size='large' textAlign='center'> UPDATE MY PROFILE </Header>
        <Divider/>
        <Container className='edit-profile-form'>
          <Segment>
            <Header as="h3" textAlign="center">Update my Profile Image</Header>
            <Segment>
              <Form onSubmit={orgImage} widths={'equal'}>
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
          <AutoForm ref={ref => {
            fRef = ref;
          }} schema={bridge} model={orgProfile} onSubmit={data => submit(data)}>
            <Segment>
              <Header as="h3" textAlign="center">Update My Information</Header>
              <Segment>
                <Form.Group widths={'equal'}>
                  <TextField name={'organizationName'}/>
                  <TextField name={'orgEmail'}/>
                </Form.Group>
                <TextField name='address'/>
                <Form.Group width={'equal'}>
                  <TextField name='city'/>
                  <TextField name='state'/>
                  <TextField name='zip'/>
                </Form.Group>
                <LongTextField name={'missionStatement'} placeholder={'Share your Organization\'s values'}/>
                <LongTextField name={'description'} placeholder={'What kind of work does your Organization do?'}/>
              </Segment>
            </Segment>
            <SubmitField value='Submit'/>
            <ErrorsField/>
          </AutoForm>
        </Container>
      </Segment>
    </Container>
  ) : <Loader active>Getting Data</Loader>);
};

EditOrganization.propTypes = {
  orgProfile: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const { _id } = useParams();
  const documentId = _id;
  const sub1 = Organizations.subscribeOrganization();
  const ready = sub1.ready();
  let orgProfile;
  if (ready) {
    orgProfile = Organizations.findDoc({ _id: documentId });
  }
  return {
    orgProfile,
    ready,
  };
})(EditOrganization);

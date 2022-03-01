import React from 'react';
import SimpleSchema from 'simpl-schema';
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
import MultiSelectField from '../../forms/controllers/MultiSelectField';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const bridge = new SimpleSchema2Bridge(UserProfileData._schema);

/** Renders the Page for editing a single profile document. */
const EditProfile = ({ doc, ready }) => {

  const submit = (data) => {
    const {
      firstName,
      lastName,
      phoneNumber,
      aboutUser, _id } = data;
    const collectionName = UserProfileData.getCollectionName();
    const updateData = { id: _id,
      firstName,
      lastName,
      phoneNumber,
      aboutUser };
    console.log(updateData);
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  };
  return (ready) ? (
    <Container id={PAGE_IDS.EDIT_PROFILE}>
      <Header as='h1' size='Large' textAlign='center'> UPDATE MY PROFILE </Header>
      <Divider/>
      <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
        <Segment>
          <Header as="h3" textAlign="center">Update My Information</Header>
          <Segment padded>
            <Form.Group widths='equal'>
              <TextField name='firstName' />
              <TextField name='lastName' />
              <TextField name='phoneNumber' />
            </Form.Group>
            <LongTextField name='aboutUser' placeholder='Edit About Me'/>
          </Segment>
        </Segment>
        <Container textAlign='right'>
          <SubmitField id='submit-update-profile' value='update' />
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
  const doc = UserProfileData.findDoc(documentId);
  return {
    doc,
    ready,
  };
})(EditProfile);

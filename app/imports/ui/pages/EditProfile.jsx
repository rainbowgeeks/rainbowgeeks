import React from 'react';
import SimpleSchema from 'simpl-schema';
import { Container, Divider, Form, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import MultiSelectField from '../../forms/controllers/MultiSelectField';
import { PAGE_IDS } from '../utilities/PageIDs';

const tempSchema = new SimpleSchema({
  firstName: { type: String, optional: true },
  lastName: { type: String, optional: true },
  email: { type: String, optional: true },
  phoneNumber: { type: String, optional: true },
  aboutMe: { type: String, optional: true },
  pictureUrl: { type: String, optional: true },
  interest: {
    type: String,
    optional: true,
    label: 'interest',
    allowedValues: ['INTEREST 1', 'INTEREST 2', 'INTEREST 3', 'INTEREST 4'],
  },
  additionalInterest: { type: String, optional: true },
  environmentalPref: { type: String, optional: true },
  availability: {
    type: String,
    optional: true,
    label: 'availability',
    allowedValues: ['MON', 'TUES', 'WEDS', 'THURS', 'FRI', 'SAT', 'SUN'],
  },
});

const bridge = new SimpleSchema2Bridge(tempSchema);

/** Renders the Page for editing a single profile document. */
const EditProfile = () => (
  <Container id={PAGE_IDS.EDIT_PROFILE}>
    <Header as='h1' size='Large' textAlign='center'> UPDATE MY PROFILE </Header>
    <Divider/>
    <AutoForm schema={bridge} >
      <Segment>
        <Header as="h3" textAlign="center">Update My Information</Header>
        <Segment padded>
          <Form.Group widths='equal'>
            <TextField name='firstName' />
            <TextField name='lastName' />
            <TextField name='phoneNumber' />
          </Form.Group>
          <TextField name='email' />
          <LongTextField name='aboutMe' placeholder='Edit About Me'/>
        </Segment>
        <Divider section />
        <Segment>
          <Header as="h3" textAlign="center">Update My Prefrences</Header>
          <MultiSelectField name='interest' label='interest'/>
          <TextField name='additionalInterest' />
          <SelectField name= 'environmentalPref' allowedValues={ ['In-person', 'At-Home'] } placeholder='any'/>
          <MultiSelectField name='availability' label='availability'/>
        </Segment>
      </Segment>
      <Container textAlign='right'>
        <SubmitField id='submit-update-profile' value='update' />
      </Container>
      <ErrorsField />
    </AutoForm>
  </Container>
);

export default (EditProfile);

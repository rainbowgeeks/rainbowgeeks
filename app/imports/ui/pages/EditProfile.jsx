import React from 'react';
import SimpleSchema from 'simpl-schema';
import { Container, Divider, Form, Grid, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { PAGE_IDS } from '../utilities/PageIDs';

const tempSchema = new SimpleSchema({
  firstName: { type: String, optional: true },
  lastName: { type: String, optional: true },
  email: { type: String, optional: true },
  aboutMe: { type: String, optional: true },
  pictureUrl: { type: String, optional: true },
  oldPassword: { type: String, optional: true },
  newPassword: { type: String, optional: true },
  confirmPassword: { type: String, optional: true },
  interest: { type: String, optional: true },
  specialInterest: { type: String, optional: true },
  environmentalPref: { type: String, optional: true },
  availability: { type: String, optional: true },
});

const bridge = new SimpleSchema2Bridge(tempSchema);

/** Renders the Page for editing a single profile document. */
const EditProfile = () => (
  <Container id={PAGE_IDS.EDIT_PROFILE}>
    <Container textAlign='center' text>
      <Header as='h2' size='medium'> UPDATE MY PROFILE </Header>
    </Container>
    <Grid centered>
      <Grid.Column>
        <AutoForm schema={bridge} >
          <Segment>
            <Grid columns='two' divided stackable padded >
              <Grid.Row>
                <Grid.Column>
                  <Header as="h3" textAlign="center">Edit Profile</Header>
                  <Segment padded>
                    <Form.Group widths='equal'>
                      <TextField name='firstName' />
                      <TextField name='lastName' />
                    </Form.Group>
                    <TextField name='email' />
                    <LongTextField name='aboutMe' placeholder='Edit About Me'/>
                    <Divider section />
                    <TextField name='interest' />
                    <TextField name='specialInterest' />
                    <SelectField name= 'environmentalPref' allowedValues={ ['In-person', 'At-Home'] } placeholder='any'/>
                    <SelectField name= 'availability'
                      allowedValues={ ['mon', 'tues', 'weds', 'thurs', 'fir', 'sat', 'sun'] } placeholder='any'/>

                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h3" textAlign="center">Change Password</Header>
                  <Segment textAlign='center' padded>
                    <TextField name='oldPassword' type='password'/>
                    <TextField name='newPassword' type='password'/>
                    <TextField name='confirmPassword' type='password'/>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Container textAlign='right'>
              <SubmitField id='submit-update-profile' value='update' />
            </Container>
            <ErrorsField />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  </Container>

);

export default (EditProfile);

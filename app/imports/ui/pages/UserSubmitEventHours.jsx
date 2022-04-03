import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SubmitField, TextField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { PAGE_IDS } from '../utilities/PageIDs';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  'First Name': String,
  'Last Name': String,
  Hours: Number,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
const UserSubmitEventHours = () => {

  // On submit, insert the data.
  const submit = (data, dataForm) => {
    console.log(data);
    dataForm.reset();
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Grid id={PAGE_IDS.USER_SUBMIT_EVENT_HOURS} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Submit Hours for Event</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Segment>
            <TextField name='First Name' />
            <TextField name='Last Name' />
            <NumField name='Hours' decimal={false} min={1}/>
            <SubmitField value='Submit' />
            <ErrorsField />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

export default UserSubmitEventHours;

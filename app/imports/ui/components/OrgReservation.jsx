import React from 'react';
import { Segment, Form } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { withRouter } from 'react-router-dom';

const formSchema = new SimpleSchema({
  firstName: { type: String, label: 'First' },
  lastName: { type: String, label: 'Last' },
  phoneNumber: { type: String, label: 'Phone' },
  userEmail: { type: String, label: 'Email' },
  userQuestion: { type: String, label: 'Comments/Questions', optional: true },
});
const bridge = new SimpleSchema2Bridge(formSchema);

const OrgReservation = () => {

  const submit = (data, formRef) => {
    console.log(data, formRef);
  };

  let fRef = null;
  return (
    <AutoForm ref={ref => {
      fRef = ref;
    }} schema={bridge} onSubmit={data => submit(data, fRef)}>
      <Segment>
        <Form.Group>
          <TextField name={'firstName'} showInlineError={true}/>
          <TextField name={'lastName'} showInlineError={true}/>
        </Form.Group>
        <TextField name={'phoneNumber'} showInlineError={true}/>
        <TextField name={'userEmail'} showInlineError={true}/>
        <LongTextField name={'userQuestion'} placeholder={'Any Questions for the coordinator'} showInlineError={true}/>
        <SubmitField name={'Submit'}/>
        <ErrorsField/>
      </Segment>
    </AutoForm>
  );
};

// OrgReservationPage.propTypes = {
// };

export default withRouter(OrgReservation);

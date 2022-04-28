import React from 'react';
import { Segment, Form } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField, SelectField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OpportunityRsvps } from '../../api/opportunity/OpportunitiesRsvpCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';

const formSchema = (first, last, owner, total, oppID) => new SimpleSchema({
  firstName: { type: String, defaultValue: first, label: 'First' },
  lastName: { type: String, defaultValue: last, label: 'Last' },
  numberOfHours: { type: Number, defaultValue: 1, allowedValues: total, label: 'How many hours would you like to volunteer?' },
  phoneNumber: { type: String, label: 'Phone' },
  userEmail: { type: String, defaultValue: owner, label: 'Email' },
  userQuestion: { type: String, label: 'Comments/Questions', optional: true },
  id: { type: String, defaultValue: oppID },
});

const getHours = (data) => {
  const temp = [];
  for (let i = 1; i <= data; i++) {
    temp.push(i);
  }
  console.log(temp);
  return temp;
};

const OrgReservation = ({ rsvp }) => {
  const { firstName, lastName, owner, oppID } = rsvp;
  const { oppStart, oppEnd } = Opportunities.findDoc({ _id: oppID });
  const matchStart = oppStart.toString().slice(16, 18);
  const matchEnd = oppEnd.toString().slice(16, 18);
  // const matchStart = start.slice(17, 24);
  // const matchEnd = end.slice(17, 24);
  // const matchEnd = oppEnd.match(regex);
  const total = matchEnd - matchStart;
  const hours = getHours(total);
  const submit = (data, formRef, op) => {
    const { firstName: first, lastName: last, phoneNumber, userEmail, numberOfHours, userQuestion } = data;
    const collectionName = OpportunityRsvps.getCollectionName();
    const definitionData = { oppID: op, firstName: first, lastName: last, phoneNumber, numberOfHours: numberOfHours, owner: userEmail, shortDesc: userQuestion };
    console.log(definitionData);

    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'You\'ve RSVP to this opportunity.\n\n Waiting on your Confirmation', 'success');
        formRef.reset();
      });
  };

  const bridge = new SimpleSchema2Bridge(formSchema(firstName, lastName, owner, hours, oppID));
  let fRef = null;
  return (
    <AutoForm ref={ref => {
      fRef = ref;
    }} schema={bridge} onSubmit={data => submit(data, fRef, oppID)}>
      <Segment>
        <Form.Group widths={'equal'}>
          <TextField name={'firstName'} showInlineError={true} disabled/>
          <TextField name={'lastName'} showInlineError={true} disabled/>
        </Form.Group>
        <SelectField name={'numberOfHours'}/>
        <TextField name={'phoneNumber'} showInlineError={true}/>
        <TextField name={'userEmail'} showInlineError={true} disabled/>
        <LongTextField name={'userQuestion'} placeholder={'Any questions for the coordinator'} showInlineError={true}/>
        <SubmitField name={'Submit'}/>
        <ErrorsField/>
      </Segment>
    </AutoForm>
  );
};

OrgReservation.propTypes = {
  rsvp: PropTypes.object.isRequired,
};

export default withRouter(OrgReservation);

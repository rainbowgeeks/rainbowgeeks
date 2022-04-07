import React, { useState } from 'react';
import { Segment, Form } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/named
import { OpportunityRsvps } from '../../api/opportunity/OpportunitiesRsvpCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';

const formSchema = (first, last, owner, oppID) => new SimpleSchema({
  firstName: { type: String, defaultValue: first, label: 'First' },
  lastName: { type: String, defaultValue: last, label: 'Last' },
  phoneNumber: { type: String, label: 'Phone' },
  userEmail: { type: String, defaultValue: owner, label: 'Email' },
  userQuestion: { type: String, label: 'Comments/Questions', optional: true },
  id: { type: String, defaultValue: oppID },
});

const OrgReservation = ({ rsvp }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const { firstName, lastName, owner, oppID } = rsvp;
  const submit = (data, formRef, op) => {
    const { first, last, phoneNumber, userEmail, userQuestion } = data;
    const collectionName = OpportunityRsvps.getCollectionName();
    const definitionData = { oppID: op, firstName: first, lastName: last, phoneNumber, email: userEmail, shortDesc: userQuestion };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'You\'ve RSVP to this opportunity.\n\n Waiting on your Confirmation', 'success');
        formRef.reset();
        setRedirectToReferer(true);
      });
  };

  const { from } = { from: { pathname: '/profile' } };
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }

  const bridge = new SimpleSchema2Bridge(formSchema(firstName, lastName, owner, oppID));
  let fRef = null;
  return (
    <AutoForm ref={ref => {
      fRef = ref;
    }} schema={bridge} onSubmit={data => submit(data, fRef, oppID)}>
      <Segment>
        <Form.Group>
          <TextField name={'firstName'} showInlineError={true}/>
          <TextField name={'lastName'} showInlineError={true}/>
        </Form.Group>
        <TextField name={'phoneNumber'} showInlineError={true}/>
        <TextField name={'userEmail'} showInlineError={true}/>
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

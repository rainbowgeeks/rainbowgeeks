import React, { useState } from 'react';
import { Container, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import { AutoForm, SubmitField, TextField, ErrorsField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { Redirect } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { PointOfContacts } from '../../api/point-of-contact/PointOfContactCollection';
import { OpportunitiesPocs } from '../../api/opportunity/OpportunitiesPocCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
});

const AddPoc = ({ ready }) => {
  const [redirectToReferer, setRedirectToRefere] = useState(false);

  const submit = (data) => {
    console.log(data);
  };

  const bridge = new SimpleSchema2Bridge(formSchema);
  let fRef = null;
  return ((ready) ? (
    <Container>
      <AutoForm ref={ref => {
        fRef = ref;
      }} bridge={bridge} onSubmit={data => submit(data, fRef)}
      >
        <TextField name='firstName'/>
        <TextField name='lastName'/>
        <TextField name='email'/>
        <TextField name='phoneNumber'/>
        <SubmitField value='Submit'/>
        <ErrorsField/>
      </AutoForm>
    </Container>
  ) : <Loader active>Loading</Loader>);
};

AddPoc.propTypes = {
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const sub1 = PointOfContacts.subscribePointOfContact();
  const sub2 = OpportunitiesPocs.subscribeOpportunitiesPoc();
  const sub3 = OrganizationPocs.subscribeOrganizationPoc();
  const sub4 = Organizations.subscribeOrganization();
  const sub5 = Opportunities.subscribeOpportunity();
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready();
  return {
    ready,
  };
})(AddPoc);

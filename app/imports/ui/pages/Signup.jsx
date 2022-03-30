import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Container, Grid, Header, Message, Segment } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { signUpNewUserMethod } from '../../api/user/UserProfileCollection.methods';
import Footer2 from '../components/Footer2';

const formSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
const Signup = ({ location }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  /* Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (data, formRef) => {
    signUpNewUserMethod.callPromise(data).catch(() => {
      formRef.reset();
      swal({
        title: 'Account Already Exists!',
        icon: 'error',
        timer: 15000,
      });
      setRedirectToReferer(false);
    })
      .then(() => {
        formRef.reset();
        Meteor.loginWithPassword(data.email, data.password, (err) => {
          if (!err) {
            swal({
              title: 'Successfully Created Account!',
              text: 'You now have an account. Next you need to create your profile.',
              icon: 'success',
              timer: 15000,
            });
            setRedirectToReferer(true);
          } else {
            swal({
              title: 'Account Already Exists!',
              icon: 'error',
              timer: 1500,
            });
          }
        });
      });
  };

  /* Display the signup form. Redirect to add page after successful registration and login. */
  const { from } = location.state || { from: { pathname: '/add' } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Redirect to={from}/>;
  }
  let fRef = null;
  return (
    <Container id={PAGE_IDS.SIGN_UP}>
      <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
        <Grid.Column>
          <Header as="h2" textAlign="center">
              Register your account
          </Header>

          <AutoForm ref={ref => {
            fRef = ref;
          }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Segment>
              <TextField name='firstName' id={COMPONENT_IDS.SIGN_UP_FORM_FIRST_NAME}/>
              <TextField name='lastName' id={COMPONENT_IDS.SIGN_UP_FORM_LAST_NAME}/>
              <TextField name='email' id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL}/>
              <TextField name='password' type='password' id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD}/>
              <SubmitField value='Sign up' id={COMPONENT_IDS.SIGN_UP_FORM_SUBMIT}/>
              <ErrorsField />
            </Segment>
          </AutoForm>
          <Message>
              Already have an account? Login <Link to="/signin">here</Link>
          </Message>
        </Grid.Column>
      </Grid>
      <Footer2/>
    </Container>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;

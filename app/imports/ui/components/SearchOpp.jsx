import React from 'react';
import { Segment, Input, Header } from 'semantic-ui-react';
import { AutoForm, SubmitField } from 'uniforms-semantic';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import MultiSelectField from '../../forms/controllers/MultiSelectField';

export const schemaAge = ['Adults', 'Family-Friendly', 'Teens', 'Seniors'];
export const schemaEnv = ['Indoors', 'Mixed', 'Outdoors', 'Virtual'];

// Create a Schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  age: {
    type: Array, optional: true,
    label: 'Age Group',
  },
  'age.$': {
    type: String,
    allowedValues: schemaAge,
  },
  environment: {
    type: Array, optional: true,
    label: 'Environment',
  },
  'environment.$': {
    type: String,
    allowedValues: schemaEnv,
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the search bar for TabPanes.jsx. */
const SearchOpp = ({ setKey, setAge, setEnv }) => {
  const onSearch = (data) => {
    setKey(data);
  };
  const submit = (value, formRef) => {
    const { age, environment } = value;
    if (age) {
      setAge(age);
    } else {
      setAge(setter);
    }
    if (environment) {
      setEnv(environment);
    } else {
      setEnv(setter);
    }
    formRef.reset();
  };
  let fRef = null;
  return (
    <Segment>
      <Input fluid icon={'search'}
        onChange={(data) => onSearch(data.target.value)}/>
      <Header content={'Filter By'}/>
      <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={value => submit(value, fRef)}>
        <MultiSelectField name='age'/>
        <MultiSelectField name='environment'/>
        <SubmitField value='Submit'/>
      </AutoForm>
    </Segment>
  );
};
SearchOpp.propTypes = {
  setKey: PropTypes.func.isRequired,
  setAge: PropTypes.func.isRequired,
  setEnv: PropTypes.func.isRequired,
};

// Wrap the component in withRouter.
export default withRouter(SearchOpp);

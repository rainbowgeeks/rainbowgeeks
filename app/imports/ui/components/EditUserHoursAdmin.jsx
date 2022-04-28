import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import {
  AutoForm,
  SubmitField,
  ErrorsField,
  SelectField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { Hours } from '../../api/hours/HoursCollection';
import { ProfilePageHours } from '../../api/profile/ProfilePageHoursCollection';

const formSchema = (numberOfHours) => new SimpleSchema({
  numberOfHours: { type: Number, defaultValue: numberOfHours, label: 'Number of Hours', allowedValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
});

const EditUserHoursAdmin = ({ user }) => {
  const { hourID, hoursData } = user;
  const testing = Hours.find({}).fetch();
  if (user) {
    hoursData.forEach(function (numHours) {
      if (numHours._id === hourID) {
        Object.assign(user, { numberOfHours: numHours.numberOfHours });
      }
    });
  }
  const submit = (numberOfHoursData, userData) => {
    const { _id } = userData;

    let newHourID;
    testing.forEach(function (hours) {
      if (hours.numberOfHours === parseInt(numberOfHoursData.numberOfHours, 10)) {
        newHourID = hours._id;
      }
    });
    const collectionName = ProfilePageHours.getCollectionName();
    const updateData = { id: _id, hourID: newHourID };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal({
          title: 'Profile Had Successfully Been Updated',
          icon: 'success',
          timer: 15000,
        });
      });
  };
  const bridge = new SimpleSchema2Bridge(formSchema(user.numberOfHours));
  return (
    <AutoForm schema={bridge} onSubmit={(data) => submit(data, user)}>
      <Segment.Group>
        <Segment compact>
          <Header>{user.eventName}</Header>
        </Segment>
        <Segment size='tiny'>
          <SelectField name={'numberOfHours'}/>
        </Segment>
        <Segment>
          <SubmitField name={'Submit'}/>
        </Segment>
        <ErrorsField/>
      </Segment.Group>
    </AutoForm>
  );
};

EditUserHoursAdmin.propTypes = {
  user: PropTypes.object.isRequired,
};

export default withRouter(EditUserHoursAdmin);

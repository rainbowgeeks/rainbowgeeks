import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { OrganizationProfiles } from './OrganizationProfileCollection';

export const signUpNewOrganizationMethod = new ValidatedMethod({
  name: 'OrganizationProfiles.SignupNewOrganization',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ email, firstName, lastName, password }) {
    if (Meteor.isServer) {
      OrganizationProfiles.define({ email, firstName, lastName, password });
    }
  },
});

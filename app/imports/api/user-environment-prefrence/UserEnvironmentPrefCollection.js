import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const userEnvironmentPrefPublication = {
  environmentPref: 'environmentPref',
  environmentAdmin: 'evironmentPrefAdmin',
};

class UserEnvironmentPrefCollection extends BaseCollection {
  constructor() {
    super('EnvironmentalPref', new SimpleSchema({
      environmentPreference: { type: String, index: true, unique: true },
    }));
  }

  define({ environmentPreference }) {
    const docID = this.findOne({ environmentPreference });
    if (docID) {
      return docID._id;
    }
    return this._collection.insert({
      environmentPreference: environmentPreference,
    });
  }

  update(docID, { environmentPreference }) {
    const updateData = {};
    if (environmentPreference) {
      updateData.environmentPreference = environmentPreference;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A Stricter form of remove that throws an error if the document or docID could not be found in the collection.
   * @param { String | Object } name A document or docID in the collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;

      /**
       * Publication for the any users age collection.
       */
      Meteor.publish(userEnvironmentPrefPublication.environmentPref, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * Publications for the admin age collection.
       */
      Meteor.publish(userEnvironmentPrefPublication.environmentAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  subscribeEnvironmentPref() {
    if (Meteor.isClient) {
      return Meteor.subscribe(userEnvironmentPrefPublication.environmentPref);
    }
    return null;
  }

  subscribeEnvironmentPrefAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(userEnvironmentPrefPublication.environmentAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or Organization.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Organization.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.USER, ROLE.ADMIN]);
  }

  /**
   * Returns an object representing the definition of docID  in a format appropriate to the restoreOne or define function.
   * @param docID.
   * @return {{ age }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const environmentPref = doc.environmentPref;

    return { environmentPref };
  }

}
export const EnvironmentalPref = new UserEnvironmentPrefCollection();

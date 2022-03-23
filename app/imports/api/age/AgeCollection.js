import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const agePublications = {
  age: 'Age',
  ageAdmin: 'AgeAdmin',
};

class AgeCollection extends BaseCollection {
  constructor() {
    super('Ages', new SimpleSchema({
      age: { type: String, index: true, unique: true },
      icon: String,
    }));
  }

  /**
   * Defines a new age for a opportunity.
   * @param age the age restriction of the opportunity.
   * @return {String} the docID of the new document.
   */
  define({ age }) {
    const docID = this.findOne({ age });
    if (docID) {
      return docID._id;
    }
    return this._collection.insert({
      age: age,
      icon: docID.icon,
    });
  }

  /**
   * Updates the give document.
   * @param docId the id of the document to update.
   * @param age the new age.
   */
  update(docID, { age }) {
    const updateData = {};
    if (age) {
      updateData.age = age;
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
      Meteor.publish(agePublications.age, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * Publications for the admin age collection.
       */
      Meteor.publish(agePublications.ageAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for age owned by the current user.
   */
  subscribeAge() {
    if (Meteor.isClient) {
      return Meteor.subscribe(agePublications.age);
    }
    return null;
  }

  /**
   * Subscriptions method for admin.
   */
  subscribeAgeAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(agePublications.ageAdmin);
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
    this.assertRole(userId, [ROLE.ORGANIZATION, ROLE.ADMIN]);
  }

  /**
   * Returns an object representing the definition of docID  in a format appropriate to the restoreOne or define function.
   * @param docID.
   * @return {{ age }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const age = doc.age;

    return { age };
  }
}

export const Ages = new AgeCollection();

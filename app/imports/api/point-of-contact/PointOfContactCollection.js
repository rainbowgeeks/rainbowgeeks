import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const pointOfContactPublications = {
  pointOfContact: 'PointOfContact',
  pointOfContactAdmin: 'PointOfContactAdmin',
};

class PointOfContactCollection extends BaseCollection {
  constructor() {
    super('PointOfContacts', new SimpleSchema({
      email: { type: String, index: true, unique: true },
      firstName: String,
      lastName: String,
      phoneNumber: String,
    }));
  }

  /**
   * Defines a new query collection.
   * @param firstName the first name of the user.
   * @param lastName the last name of the user.
   * @param phoneNumber the phone number of the user.
   * @param email the email of the poc in the user.
   * @return {String} the docID of the new document.
   */
  define({ firstName, lastName, phoneNumber, email }) {
    const docID = this.findOne({ email });
    if (docID) {
      return docID._id;
    }
    return this._collection.insert({
      firstName,
      lastName,
      phoneNumber,
      email,
    });
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param firstName the new first name.
   * @param lastName the new last name.
   * @param phoneNumber the new phone number.
   */
  update(docID, { firstName, lastName, phoneNumber }) {
    const updateData = {};
    if (firstName) {
      updateData.firstName = firstName;
    }
    if (lastName) {
      updateData.lastName = lastName;
    }
    if (phoneNumber) {
      updateData.phoneNumber = phoneNumber;
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
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(pointOfContactPublications.pointOfContact, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(pointOfContactPublications.pointOfContactAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for all documents.
   */
  subscribePointOfContact() {
    if (Meteor.isClient) {
      return Meteor.subscribe(pointOfContactPublications.pointOfContact);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribePointOfContactAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(pointOfContactPublications.pointOfContactAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleMethod. Asserts that userId is logged in as an Organization or Admin.
   * This is used in the define, update, and removeIt.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in organization or Admin.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ORGANIZATION, ROLE.ADMIN]);
  }

  /**
   * Returns an object representing the definition of docID  in a format appropriate to the restoreOne or define function.
   * @param docID.
   * @return {{ firstName, lastName, phoneNumber, email }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const phoneNumber = doc.phoneNumber;
    const email = doc.email;

    return { firstName, lastName, phoneNumber, email };
  }
}

export const PointOfContacts = new PointOfContactCollection();

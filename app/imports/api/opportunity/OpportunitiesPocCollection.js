import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { Opportunities } from './OpportunityCollection';
import { PointOfContacts } from '../point-of-contact/PointOfContactCollection';
import { ROLE } from '../role/Role';

export const opportunitiesPocPublications = {
  opportunitiesPoc: 'OpportunitiesPoc',
  opportunitiesPocAdmin: 'OpportunitiesPocAdmin',
};

class OpportunitiesPocCollection extends BaseCollection {
  constructor() {
    super('OpportunitiesPocs', new SimpleSchema({
      oppID: String,
      pocID: String,
      pocEmail: String,
    }));
  }

  /**
   * Defines a new query collection.
   * @param oppID the oppID of the item.
   * @param pocID the pocID of the item.
   * @param pocEmail the email of the poc in the item.
   * @return {String} the docID of the new document.
   */
  define({ email, title, location, date }) {
    const opp = Opportunities.findDoc({ title, location, date });
    const poc = PointOfContacts.findDoc({ email });
    const oppID = opp._id;
    const pocID = poc._id;

    const docID = this._collection.insert({
      oppID,
      pocID,
      pocEmail: email,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param pocID the new pocID.
   * @param email the new email.
   */
  update(docID, { pocID, email }) {
    const updateData = {};
    if (pocID) {
      updateData.pocID = pocID;
    }
    if (email) {
      updateData.email = email;
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
      Meteor.publish(opportunitiesPocPublications.opportunitiesPoc, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(opportunitiesPocPublications.opportunitiesPocAdmin, function publish() {
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
  subscribeOpportunitiesPoc() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesPocPublications.opportunitiesPoc);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeOpportunitiesPocAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesPocPublications.opportunitiesPocAdmin);
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
   * @return {{ pocID, email }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const oppID = doc.oppID;
    const pocID = doc.pocID;
    const email = doc.email;

    return { oppID, pocID, email };
  }
}

export const OpportunitiesPocs = new OpportunitiesPocCollection();

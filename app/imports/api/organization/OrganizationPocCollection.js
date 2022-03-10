import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { Organizations } from './OrganizationCollection';
import { PointOfContacts } from '../point-of-contact/PointOfContactCollection';
import { ROLE } from '../role/Role';

export const organizationsPocPublications = {
  organizationPoc: 'OrganizationPoc',
  organizationPocAdmin: 'OrganizationPocAdmin',
};

class OrganizationPocCollection extends BaseCollection {
  constructor() {
    super('OrganizationPocs', new SimpleSchema({
      orgID: String,
      pocID: String,
      orgEmail: String,
      pocEmail: String,
    }));
  }

  /**
   * Defines a new query collection.
   * @param orgID the orgID of the item.
   * @param pocID the pocID of the item.
   * @param pocEmail the email of the poc in the item.
   * @return {String} the docID of the new document.
   */
  define({ email, orgEmail }) {
    const org = Organizations.findDoc({ orgEmail });
    const poc = PointOfContacts.findDoc({ email });
    const orgID = org._id;
    const pocID = poc._id;
    const docID = this.findOne({ pocEmail: email, orgEmail });
    if (docID) {
      return docID._id;
    }
    return this._collection.insert({
      orgID,
      pocID,
      pocEmail: email,
      orgEmail: orgEmail,
    });
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param pocID the new pocID.
   * @param oppID the new oppID
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
      Meteor.publish(organizationsPocPublications.organizationPoc, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(organizationsPocPublications.organizationPocAdmin, function publish() {
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
  subscribeOrganizationPoc() {
    if (Meteor.isClient) {
      return Meteor.subscribe(organizationsPocPublications.organizationPoc);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeOrganizationPocAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(organizationsPocPublications.organizationPocAdmin);
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
   * @return {{ orgID, pocID, email }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const orgID = doc.orgID;
    const pocID = doc.pocID;
    const email = doc.email;

    return { orgID, pocID, email };
  }
}

export const OrganizationPocs = new OrganizationPocCollection();

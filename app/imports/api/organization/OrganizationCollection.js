import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const organizationPublications = {
  organization: 'Organization',
  organizationAdmin: 'OrganizationAdmin',
};

class OrganizationCollection extends BaseCollection {
  constructor() {
    super('Organizations', new SimpleSchema({
      organizationName: { type: String, index: true, unique: true },
      missionStatement: String,
      description: String,
      orgEmail: String,
    }));
  }

  /**
   * Defines a new organization.
   * @param organizationName the organization name.
   * @param missionStatement the motto of the organization.
   * @param description the description of the organization.
   * @return {String} the docID of the new opportunity.
   */
  define({ organizationName, missionStatement, description, orgEmail }) {
    const docID = this._collection.insert({
      organizationName,
      missionStatement,
      description,
      orgEmail,
    });
    return docID;
  }

  /**
   * Updates the document with matching docID.
   * @param missionStatement the new mission statement(optional).
   * @param description the new description (optional).
   */
  update(docID, { missionStatement, description }) {
    const updateData = {};
    if (missionStatement) {
      updateData.missionStatement = missionStatement;
    }
    if (description) {
      updateData.description = description;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A Stricter form of remove that throws an error if the document or docID could not be found in the collection.
   * @param { String | Object } name A document or docID in the collection.
   * @return true.
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
       * Publication for any users.
       */
      Meteor.publish(organizationPublications.organization, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * Publications for admin.
       */
      Meteor.publish(organizationPublications.organizationAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for organization collection (users and organzation role).
   */
  subscribeOrganization() {
    if (Meteor.isClient) {
      return Meteor.subscribe(organizationPublications.organization);
    }
    return null;
  }

  /**
   * Subscription method for organization collection admin.
   */
  subscribeOrganizationAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(organizationPublications.organizationAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that useId is logged in as an Admin or Organization.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no looged in user, or the user is not an Admin or Organization.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ORGANIZATION, ROLE.ADMIN]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID.
   * @return {{ Object }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const organizationName = doc.organizationName;
    const missionStatement = doc.missionStatement;
    const description = doc.description;

    return { organizationName, missionStatement, description };
  }
}

export const Organizations = new OrganizationCollection();

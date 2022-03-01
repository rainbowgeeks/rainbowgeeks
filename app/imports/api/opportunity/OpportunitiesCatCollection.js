import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const opportunitiesCatPublications = {
  opportunitiesCatPublic: 'OpportunitiesCatPublic',
  opportunitiesCatUser: 'OpportunitiesCatUser',
  opportunitiesCatOrganization: 'OpportunitiesCatOrganization',
  opportunitiesCatAdmin: 'OpportunitiesCatAdmin',
};

class OpportunitiesCatCollection extends BaseCollection {
  constructor() {
    super('OpportunitiesCats', new SimpleSchema({
      title: String,
      owner: String,
      category: String,
    }));
  }

  /**
   * Defines a new query collection.
   * @param title the email address.
   * @param age the age related to the opportunity.
   */
  define({ title, owner, category }) {
    const docID = this._collection.insert({
      title,
      owner,
      category,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param title the new title (optional).
   * @param category the new category (optional).
   */
  update(docID, { title, owner, category }) {
    const updateData = {};
    if (title) {
      updateData.title = title;
    }
    if (owner) {
      updateData.owner = owner;
    }
    if (category) {
      updateData.category = category;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Default publication method for entities.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      /**
       * This subscription publishes all documents regarding Roles.
       */
      Meteor.publish(opportunitiesCatPublications.opportunitiesCatPublic, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });
      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(opportunitiesCatPublications.opportunitiesCatUser, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.User)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });
      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(opportunitiesCatPublications.opportunitiesCatOrganization, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ORGANIZATION)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(opportunitiesCatPublications.opportunitiesCatAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for the documents.
   */
  subscribeOpportunitiesCatPublic() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesCatPublications.opportunitiesCatPublic);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeOpportunitiesCatUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesCatPublications.opportunitiesCatUser);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeOpportunitiesCatOrganization() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesCatPublications.opportunitiesCatOrganization);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeOpportunitiesCatAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesCatPublications.opportunitiesCatAdmin);
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
}

export const OpportunitiesCats = new OpportunitiesCatCollection();

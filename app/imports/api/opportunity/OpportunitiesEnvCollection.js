import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const opportunitiesEnvPublications = {
  opportunitiesEnvAll: 'OpportunitiesEnvAll',
  opportunitiesEnvOrg: 'OpportunitiesEnvOrg',
  opportunitiesEnvUser: 'OpportunitiesEnvUser',
};

class OpportunitiesEnvCollection extends BaseCollection {
  constructor() {
    super('OpportunitiesEnvs', new SimpleSchema({
      owner: String,
      environment: String,
    }));
  }

  /**
   * Defines a new item.
   * @param owner the email of the item.
   * @param environment the chosen environment.
   * @return {String} the docID of the new document.
   */
  define({ owner, environment }) {
    const docID = this._collection.insert({
      owner,
      environment,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param owner the new email (optional).
   * @param environment the new environment (optional).
   */
  update(docID, { owner, environment }) {
    const updateData = {};
    if (owner) {
      updateData.owner = owner;
    }
    if (environment) {
      updateData.environment = environment;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Default publication method for entities.
   * it publishes the collection depending on the roles.
   */
  publish() {
    if (Meteor.isServer) {
      // get the collection instance.
      const instance = this;
      /**
       * This subscription publishes entire collection associated with all users/public.
       */
      Meteor.publish(opportunitiesEnvPublications.opportunitiesEnvAll, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });
      /**
       * This subscription publishes only the documents associated with the logged in organization.
       */
      Meteor.publish(opportunitiesEnvPublications.opportunitiesEnvOrg, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ORGANIZATION)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });
      /**
       * This subscription publishes only the documents associated with the logged in organization.
       */
      Meteor.publish(opportunitiesEnvPublications.opportunitiesEnvUser, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.USER)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for documents owned by the current organization.
   */
  subscribeOpportunitiesEnvAll() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesEnvPublications.opportunitiesEnvAll);
    }
    return null;
  }

  /**
   * Subscription method for entire documents to be displayed for users.
   */
  subscribeOpportunitiesEnvOrg() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesEnvPublications.opportunitiesEnvOrg);
    }
    return null;
  }

  /**
   * Subscription method for entire documents to be displayed for users.
   */
  subscribeOpportunitiesEnvUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesEnvPublications.opportunitiesEnvUser);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.USER, ROLE.ADMIN, ROLE.ORGANIZATION]);
  }
}

export const OpportunitiesEnvs = new OpportunitiesEnvCollection();

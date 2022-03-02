import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const environmentPublications = {
  environmentPublic: 'EnvironmentPublic',
  environmentUser: 'EnvironmentUser',
  environmentOrganization: 'EnvironmentOrganization',
  environmentAdmin: 'EnvironmentAdmin',
};

class EnvironmentCollection extends BaseCollection {
  constructor() {
    super('Environments', new SimpleSchema({
      environment: { type: String, index: true, unique: true },
    }));
  }

  /**
   * Defines a new document to insert.
   * @param environment the new environment.
   * @return {String} the docID of the new document.
   */
  define({ environment }) {
    const docID = this.findOne({ environment });
    if (docID) {
      return docID._id;
    }
    return this._collection.insert({
      environment: environment,
    });
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @pram environment the new environment.
   */
  update(docID, { environment }) {
    const updateData = {};
    if (environment) {
      updateData.environment = environment;
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
   * Default publication method for the environment entities.
   * It publishes the collection which are specific to each ROLE.
   */
  publish() {
    if (Meteor.isServer) {
      // get the collection instance.
      const instance = this;

      /**
       * This subscription publishes for the public users to view.
       */
      Meteor.publish(environmentPublications.environmentPublic, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes for the user that it logged in.
       */
      Meteor.publish(environmentPublications.environmentUser, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.USER)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /**
       * This subscription publishes for the user that it logged in.
       */
      Meteor.publish(environmentPublications.environmentOrganization, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ORGANIZATION)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /**
       * This subscription publishes for the user that it logged in.
       */
      Meteor.publish(environmentPublications.environmentAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeEnvironmentPublic() {
    if (Meteor.isClient) {
      return Meteor.subscribe(environmentPublications.environmentPublic);
    }
    return null;
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeEnvironmentUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(environmentPublications.environmentUser);
    }
    return null;
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeEnvironmentOrganization() {
    if (Meteor.isClient) {
      return Meteor.subscribe(environmentPublications.environmentOrganization);
    }
    return null;
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeEnvironmentAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(environmentPublications.environmentAdmin);
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ORGANIZATION]);
  }

  /**
   * Returns an object representing the definition of docID  in a format appropriate to the restoreOne or define function.
   * @param docID.
   * @return {{ environment }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const environment = doc.environment;

    return { environment };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Environments = new EnvironmentCollection();

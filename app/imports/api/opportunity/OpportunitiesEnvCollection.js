import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { Opportunities } from './OpportunityCollection';
import { Environments } from '../environment/EnvironmentCollection';
import { ROLE } from '../role/Role';

export const opportunitiesEnvironmentPublications = {
  opportunitiesEnvironment: 'OpportunitiesEnvironment',
  opportunitiesEnvironmentAdmin: 'OpportunitiesEnvironmentAdmin',
};

class OpportunitiesEnvCollection extends BaseCollection {
  constructor() {
    super('OpportunitiesEnvs', new SimpleSchema({
      oppID: String,
      envID: String,
    }));
  }

  /**
   * Defines a new item.
   * @param oppID the oppID of the item.
   * @param envID the envID of the item.
   * @return {String} the docID of the new document.
   */
  define({ title, location, date, environment }) {
    const opp = Opportunities.findDoc({ title, location, date });
    const env = Environments.findDoc({ environment });
    const oppID = opp._id;
    const envID = env._id;

    const docID = this._collection.insert({
      oppID,
      envID,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param envID the new envID (optional).
   */
  update(docID, { envID }) {
    const updateData = {};
    if (envID) {
      updateData.envID = envID;
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
   * It publishes the collection depending on the roles.
   */
  publish() {
    if (Meteor.isServer) {
      // get the collection instance.
      const instance = this;

      /**
       * This subscription publishes entire collection associated with all users/public.
       */
      Meteor.publish(opportunitiesEnvironmentPublications.opportunitiesEnvironment, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes entire collection associated with all users/public.
       */
      Meteor.publish(opportunitiesEnvironmentPublications.opportunitiesEnvironmentAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for documents owned by the current user.
   */
  subscribeOpportunitiesEnvironment() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesEnvironmentPublications.opportunitiesEnvironment);
    }
    return null;
  }

  /**
   * Subscription method for entire documents to be displayed for users.
   */
  subscribeOpportunitiesEnvironmentAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesEnvironmentPublications.opportunitiesEnvironmentAdmin);
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
    this.assertRole(userId, [ROLE.ORGANIZATION, ROLE.ADMIN]);
  }

  /**
   * Returns an object representing the definition of docID  in a format appropriate to the restoreOne or define function.
   * @param docID.
   * @return {{title, owner, cover, environment }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const title = doc.title;
    const owner = doc.owner;
    const environment = doc.environment;

    return { title, owner, environment };
  }
}

export const OpportunitiesEnvs = new OpportunitiesEnvCollection();

import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const opportunitiesAgePublications = {
  opportunitiesAgePublic: 'OpportunitiesAgePublic',
  opportunitiesAgeUser: 'OpportunityAgeUser',
  opportunitiesAgeOrganization: 'OpportunityAgeOrganization',
  opportunitiesAgeAdmin: 'OpportunityAgeAdmin',
};

class OpportunitiesAgeCollection extends BaseCollection {
  constructor() {
    super('OpportunitiesAges', new SimpleSchema({
      owner: String,
      age: String,
    }));
  }

  /**
   * Defines a new query collection.
   * @param owner the email address.
   * @param age the age related to the opportunity.
   */
  define({ owner, age }) {
    const docID = this._collection.insert({
      owner,
      age,
    });
    return docID;
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
      Meteor.publish(opportunitiesAgePublications.opportunitiesAgePublic, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });
      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(opportunitiesAgePublications.opportunitiesAgeUser, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.User)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });
      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(opportunitiesAgePublications.opportunitiesAgeOrganization, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ORGANIZATION)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(opportunitiesAgePublications.opportunitiesAgeAdmin, function publish() {
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
  subscribeOpportunitiesAgeAll() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesAgePublications.opportunitiesAgeAll);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeOpportunitiesAgeOrg() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesAgePublications.opportunitiesAgeOrg);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeOpportunitiesAgeUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesAgePublications.opportunitiesAgeUser);
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
    this.assertRole(userId, [ROLE.USER, ROLE.ORGANIZATION, ROLE.ADMIN]);
  }
}

export const OpportunitiesAges = new OpportunitiesAgeCollection();

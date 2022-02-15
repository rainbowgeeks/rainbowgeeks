import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const opportunityPublications = {
  opportunity: 'Opportunity',
  opportunityAdmin: 'OpportunityAdmin',
};

class OpportunityCollection extends BaseCollection {
  constructor() {
    super('Opportunities', new SimpleSchema({
      title: String,
      category: Array,
      'category.$': String,
      age: Array,
      'age.$': String,
      environment: Array,
      'environment.$': String,
      cover: String,
      location: String,
      date: String,
      owner: String,
    }));
  }

  /**
   * Defines a new opportunity.
   * @param title the name of the opportunity.
   * @param category the category of the opportunity.
   * @param age the age group of the opportunity.
   * @param environment the domain of the opportunity.
   * @param cover the cover image of the opportunity.
   * @param location the address of the opportunity.
   * @param date the start date of the opportunity.
   * @param owner the owner of the opportunity.
   */
  define({ title, category, age, environment, cover, location, date, owner }) {
    const docID = this._collection.insert({
      title,
      category,
      age,
      environment,
      cover,
      location,
      date,
      owner,
    });
    return docID;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the collection associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the OpportunityCollection instance.
      const instance = this;
      /**
       * This subscription publishes only the documents associated with the logged in users.
       */
      Meteor.publish(opportunityPublications.opportunity, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.USER)) {
          return instance._collection.find();
        }
        return this.ready();
      });
      /**
       * This subscription publishes all documents of user, but only if the logged in user is the Admin.
       */
      Meteor.publish(opportunityPublications.opportunityAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.USER)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for the opportunity owned by the current user.
   */
  subscribeOpportunity() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunity);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * Subscribes to the entire collection.
   */
  subscribeOpportunityAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunityAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleMethod. Asserts the userId is logged in as an Admin or User.
   * Used in define Meteor methods associated with each class.
   * @param userId the userId of the logged in user. Can be null or undefined.
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Opportunities = new OpportunityCollection();

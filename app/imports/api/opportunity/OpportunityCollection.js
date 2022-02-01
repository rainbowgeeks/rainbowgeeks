import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

// export const opportunityTyp = ['Event', 'Ongoing'];
// export const opportunityCategory = ['Animal Welfare/Rescue', 'Child/Family Support', 'COVID-19 Recovery',
//   'Crisis/Disaster Relief', 'Education', 'Elderly/Senior Care', 'Environment', 'Food Insecurity'];
// export const opportunityAge = ['Family-Friendly', 'Teens', 'Adults', 'Seniors'];
// export const opportunityEnvironment = ['Indoors', 'Outdoors', 'Mixed', 'Virtual'];
export const opportunityPublications = {
  opportunity: 'Opportunity',
  opportunityAdmin: 'OpportunityAdmin',
};

class OpportunityCollection extends BaseCollection {
  constructor() {
    super('Opportunities', new SimpleSchema({
      title: String,
      typ: String,
      category: String,
      age: String,
      environment: String,
      cover: String,
      location: String,
      owner: String,
    }));
  }

  /**
   * Defines a new opportunity.
   * @param title the name of the opportunity.
   * @param typ the type of opportunity.
   * @param category the category of the opportunity.
   * @param age the age group of the opportunity.
   * @param environment the domain of the opportunity.
   * @param cover the cover image of the opportunity.
   * @param location the address of the opportunity.
   * @param owner the owner of the opportunity.
   */
  define({ title, typ, category, age, environment, cover, location, owner }) {
    const docID = this._collection.insert({
      title,
      typ,
      category,
      age,
      environment,
      cover,
      location,
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
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });
      /**
       * This subscription publishes all documents of user, but only if the logged in user is the Admin.
       */
      Meteor.publish(opportunityPublications.opportunityAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
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
   * Default implementation of assertValidRoleMethod. Asserts the userId is looged in as an Admin or User.
   * Used in define Meteor methods associated with each class.
   * @param userId the userId of the looged in user. Can be null or undefined.
   * @throws { Meteor.Error } If thereis no looged in user, or the user is not an Admin or User.
   */
  assertValidRoleMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Opportunities = new OpportunityCollection();

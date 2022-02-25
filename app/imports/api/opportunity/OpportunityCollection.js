import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const opportunityPublications = {
  opportunityPublic: 'OpportunityPublic',
  opportunityUser: 'OpportunityUser',
  opportunityOrganization: 'OpportunityOrganization',
  opportunityAdmin: 'OpportunityAdmin',
};

class OpportunityCollection extends BaseCollection {
  constructor() {
    super('Opportunities', new SimpleSchema({
      title: { type: String, index: true, unique: true },
      owner: String,
      cover: String,
      location: String,
      date: String,
      description: String,
    }));
  }

  /**
   * Defines a new opportunitiy.
   * @param title the title of the opportunitiy.
   * @param owner the point of contact for the opportunity.
   * @param description the summary of the opportunitiy.
   * @return {String} the docID of the new opportunity.
   */
  define({ title, owner, cover, location, date, description }) {
    const docID = this._collection.insert({
      title,
      owner,
      cover,
      location,
      date,
      description,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param organizerEmail the new point of contact for the opportunity.
   * @param title the new title of the opportunity.
   * @param description the new summary of the opportunity.
   */
  update(docID, { title, owner, description }) {
    const updateData = {};
    if (title) {
      updateData.title = title;
    }
    if (owner) {
      updateData.owner = owner;
    }
    if (description) {
      updateData.description = description;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the opportunity with matching docID.
   */

  /**
   * Default publication method for entities.
   * It publishes the entire collection for public, users, organizations, and admin.
   * Admin and Organization have more authority to the collection.
   */
  publish() {
    if (Meteor.isServer) {
      // get the OpportunityCollection instance.
      const instance = this;

      /**
       * This subscription publishes all documents regardless of Roles.
       */
      Meteor.publish(opportunityPublications.opportunityPublic, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents associated with the user logged in.
       */
      Meteor.publish(opportunityPublications.opportunityUser, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.USER)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ organizerEmail: username });
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents associated with the organization logged in.
       */
      Meteor.publish(opportunityPublications.opportunityOrganization, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ORGANIZATION)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents associated with the admin.
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
   * Subscription method for the opportunity available for public.
   */
  subscribeOpportunityPublic() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunityPublic);
    }
    return null;
  }

  /**
   * Subscription method for the opportunity available for Current Users.
   */
  subscribeOpportunityUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunityUser);
    }
    return null;
  }

  /**
   * Subscription method for the opportunity available for Current Organization.
   */
  subscribeOpportunityOrganization() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunityOrganization);
    }
    return null;
  }

  /**
   * Subscription method for the opportunity available for Admin.
   */
  subscribeOpportunityAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunityAdmin);
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

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Opportunities = new OpportunityCollection();

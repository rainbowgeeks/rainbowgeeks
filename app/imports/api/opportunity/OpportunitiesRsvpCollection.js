import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const opportunityRsvpPublications = {
  opportunityRsvp: 'OpportunityRsvp',
  opportunityRsvpAdmin: 'OpportunityRsvpAdmin',
};

class OpportunityRsvpCollection extends BaseCollection {
  constructor() {
    super('OpportunityRsvps', new SimpleSchema({
      oppID: String,
      volunteerID: String,
      phoneNumber: String,
      shortDesc: String,
    }));
  }

  /**
   * Defines a new users Rsvp input
   * @param oppID the new opportunity ID.
   * @param volunteerEmail the new user ID.
   * @param phoneNumber the volunteer phone number.
   * @param shortDesc the question of the volunteer.
   * @return {String} the docID of the new Rsvp.
   */
  define({ oppID, volunteerID, phoneNumber, shortDesc }) {
    const docID = this._collection.insert({
      oppID,
      volunteerID,
      phoneNumber,
      shortDesc,
    });
    return docID;
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
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
   * It publishes the entire collection.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;

      /**
       * This subscription publishes for all users.
       */
      Meteor.publish(opportunityRsvpPublications.opportunityRsvp, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes for admin.
       */
      Meteor.publish(opportunityRsvpPublications.opportunityRsvpAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for Rsvp collection.
   */
  subscribeRsvp() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityRsvpPublications.opportunityRsvp);
    }
    return null;
  }

  /**
   * This subscription publishes for admin.
   */
  subscribeRsvpAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityRsvpPublications.opportunityRsvpAdmin);
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

export const OpportunityRsvps = new OpportunityRsvpCollection();

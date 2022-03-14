import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const opportunityHoursPublications = {
  opportunityHour: 'OpportunityHour',
  opportunityHourAdmin: 'OpportunityHourAdmin',
};

class OpportunityHoursCollection extends BaseCollection {
  constructor() {
    super('OpportunityHours', new SimpleSchema({
      pocEmail: String,
      volunteerEmail: String,
      hourID: String,
    }));
  }

  /**
   * Defines a new user hours input
   * @param pocEmail the new opportunity ID that relates to volunteer.
   * @param volunteerEmail the new volunteer ID.
   * @param hourID the new total hour for a opportunity.
   */
  define({ pocEmail, volunteerEmail, hourID }) {
    const docID = this._.collection.insert({
      pocEmail,
      volunteerEmail,
      hourID,
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
   * It publishes the entire collection for all users.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      /**
       * This subscription publishes for all users.
       */
      Meteor.publish(opportunityHoursPublications.opportunityHour, function publish() {
        if (Meteor.isServer) {
          return instance._collectin.find();
        }
        return this.ready();
      });
      /**
       * This subscription publishes for admin.
       */
      Meteor.publish(opportunityHoursPublications.opportunityHourAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for hour collection.
   */
  subscribeProfilePageHour() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityHoursPublications.opportunityHour);
    }
    return null;
  }

  /**
   * Subscription method for admin hour collection.
   */
  subscribeProfilePageHourAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityHoursPublications.opportunityHourAdmin);
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
}

export const OpportunityHours = new OpportunityHoursCollection();

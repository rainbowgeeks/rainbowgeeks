import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const hoursPublications = {
  hour: 'Hour',
  hourAdmin: 'HourAdmin',
};

class HoursCollection extends BaseCollection {
  constructor() {
    super('Hours', new SimpleSchema({
      numberOfHours: { type: Number, unique: true, index: true },
    }));
  }

  /**
   * Defines a new user hours input
   * @param numberOfHours the new total hour for a opportunity.
   * @return {String} the docID of the new document.
   */
  define({ numberOfHours }) {
    const docID = this.findOne({ numberOfHours });
    if (docID) {
      return docID._id;
    }
    return this._collection.insert({
      numberOfHours,
    });
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
      // get the collection instance.
      const instance = this;
      /**
       * This subscription publishes for all users.
       */
      Meteor.publish(hoursPublications.hour, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });
      /**
       * This subscription publishes for admin.
       */
      Meteor.publish(hoursPublications.hourAdmin, function publish() {
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
  subscribeHour() {
    if (Meteor.isClient) {
      return Meteor.subscribe(hoursPublications.hour);
    }
    return null;
  }

  /**
   * Subscription method for admin hour collection.
   */
  subscribeHourAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(hoursPublications.hourAdmin);
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

export const Hours = new HoursCollection();

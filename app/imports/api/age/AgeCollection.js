import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const agePublications = {
  agePublic: 'AgePublic',
  ageUser: 'AgeUser',
  ageOrganization: 'AgeOrganization',
  ageAdmin: 'AgeAdmin',
};

class AgeCollection extends BaseCollection {
  constructor() {
    super('Ages', new SimpleSchema({
      age: { type: String, index: true, unique: true },
    }));
  }

  /**
   * Defines a new age for a opportunity.
   * @param age the age restriction of the opportunity.
   * @return {String} the docID of the new document.
   */
  define({ age }) {
    const docID = this.findOne({ age });
    if (docID) {
      return docID._id;
    }
    return this._collection.insert({
      age: age,
    });
  }

  /**
   * Updates the give document.
   * @param docId the id of the document to update.
   * @param age the new age.
   */
  update(docID, { age }) {
    const updateData = {};
    if (age) {
      updateData.age = age;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Default publication method for entities.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;

      Meteor.publish(agePublications.agePublic, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });

      Meteor.publish(agePublications.ageUser, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.USER)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ age: username });
        }
        return this.ready();
      });

      Meteor.publish(agePublications.ageUser, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ORGANIZATION)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ age: username });
        }
        return this.ready();
      });

      Meteor.publish(agePublications.ageUser, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for age owned by the current organization.
   */
  subscribeAgePublic() {
    if (Meteor.isClient) {
      return Meteor.subscribe(agePublications.agePublic);
    }
    return null;
  }

  /**
   * Subscriptions
   */
  subscribeAgeUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(agePublications.ageUser);
    }
    return null;
  }

  /**
   * Subscriptions
   */
  subscribeAgeOrganization() {
    if (Meteor.isClient) {
      return Meteor.subscribe(agePublications.ageOrganization);
    }
    return null;
  }

  /**
   * Subscriptions
   */
  subscribeAgeAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(agePublications.ageAdmin);
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
    this.assertRole(userId, [ROLE.USER, ROLE.ORGANIZATION, ROLE.ADMIN]);
  }
}

export const Ages = new AgeCollection();

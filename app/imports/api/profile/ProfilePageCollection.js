import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const ProfilePagePublication = {
  profile: 'Profile',
  ProfileAdmin: 'ProfileAdmin',
};

class ProfilePageCollection extends BaseCollection {
  constructor() {
    super('ProfilePage', new SimpleSchema({
      firstName: String,
      lastName: String,
      phoneNumber: String,
      interest: String,
      environmentalPref: String,
      availability: Date,
    }));
  }

  define({ firstName, lastName, phoneNumber, interest, environmentalPref, availability }) {
    const docID = this._collection.insert({
      firstName,
      lastName,
      phoneNumber,
      interest,
      environmentalPref,
      availability,
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
      Meteor.publish(ProfilePagePublication.profile, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });
      /**
       * This subscription publishes all documents of user, but only if the logged in user is the Admin.
       */
      Meteor.publish(ProfilePagePublication.ProfileAdmin, function publish() {
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
      return Meteor.subscribe(ProfilePagePublication.profile);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * Subscribes to the entire collection.
   */
  subscribeOpportunityAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(ProfilePagePublication.ProfileAdmin);
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

export const ProfilePage = new ProfilePageCollection();

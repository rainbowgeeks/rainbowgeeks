import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const profilePageAvailability = ['mon', 'tues', 'weds', 'thurs', 'fri', 'sat', 'sun', 'week-days', 'weekends', 'no-pref'];
export const profilePageEnvironmentalPref = ['on-campus', 'at-home', 'no-pref'];
export const profilePageInterest = ['Int-1', 'Int-2', 'Int-3', 'Int-3', 'mis'];
export const ProfilePagePublication = {
  profile: 'Profile',
  profileAll: 'ProfileAll',
  ProfileAdmin: 'ProfileAdmin',
};

class ProfilePageCollection extends BaseCollection {
  constructor() {
    super('ProfilePage', new SimpleSchema({
      owner: String,
      firstName: String,
      lastName: String,
      phoneNumber: String,
      interest: {
        type: String,
        allowedValues: profilePageInterest,
        defaultValue: 'mis',
      },
      specialInterest: String,
      environmentalPref: {
        type: String,
        allowedValues: profilePageEnvironmentalPref,
        defaultValue: 'no-pref',
      },
      availability: {
        type: String,
        allowedValues: profilePageAvailability,
        defaultValue: 'no-pref',
      },
      aboutUser: String,
    }));
  }

  define({ owner,firstName, lastName, phoneNumber, interest, specialInterest, environmentalPref, availability,
    aboutUser }) {
    const docID = this._collection.insert({
      owner,
      firstName,
      lastName,
      phoneNumber,
      interest,
      specialInterest,
      environmentalPref,
      availability,
      aboutUser,
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
  subscribeUserProfile() {
    if (Meteor.isClient) {
      return Meteor.subscribe(ProfilePagePublication.profile);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * Subscribes to the entire collection.
   */
  subscribeAdminProfile() {
    if (Meteor.isClient) {
      return Meteor.subscribe(ProfilePagePublication.ProfileAdmin);
    }
    return null;
  }

  /**
   * Subscription method for all users.
   * Subscribes to the entire collection.
   */
  subscribeAllUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(ProfilePagePublication.profileAll);
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

export const UserProfileData = new ProfilePageCollection();

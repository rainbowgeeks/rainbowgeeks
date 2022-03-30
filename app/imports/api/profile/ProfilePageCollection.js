import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const profilePageAvailability = ['mon', 'tues', 'weds', 'thurs', 'fri', 'sat', 'sun', 'week-days', 'weekends',
  'no-pref'];
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
        type: Array,
        defaultValue: 'mis',
      },
      'interest.$': {
        type: String,
        allowedValues: profilePageInterest,
      },
      specialInterest: String,
      environmentalPref: {
        type: Array,
        defaultValue: 'no-pref',
      },
      'environmentalPref.$': {
        type: String,
        allowedValues: profilePageEnvironmentalPref,
      },
      availability: {
        type: Array,
        defaultValue: 'no-pref',
      },
      'availability.$': {
        type: String,
        allowedValues: profilePageAvailability,
      },
      profileImage: String,
      aboutUser: String,
    }));
  }

  /**
   * Defines a new profile data
   * @param owner the owner of the profile data
   * @param firstName the first name of the user
   * @param lastName the last name of the user
   * @param phoneNumber the phone number of the user
   * @param interest the interest of the user
   * @param specialInterest the additional interest of the user
   * @param environmentalPref the environmental preference of the user
   * @param availability the availability of the user
   * @param profileImage the profile-image of the user
   * @param aboutUser the information of the user
   * @returns the docID of the defined collection
   */
  define({ owner, firstName, lastName, phoneNumber, interest, specialInterest, environmentalPref, availability, profileImage, aboutUser }) {
    const docID = this._collection.insert({
      owner,
      firstName,
      lastName,
      phoneNumber,
      interest,
      specialInterest,
      environmentalPref,
      availability,
      profileImage,
      aboutUser,
    });
    return docID;
  }

  update(docID, { firstName, lastName, phoneNumber, aboutUser, specialInterest, environmentalPref, availability, interest, profileImage }) {
    const updateUserData = {};

    if (firstName) {
      updateUserData.firstName = firstName;
    }
    if (lastName) {
      updateUserData.lastName = lastName;
    }
    if (phoneNumber) {
      updateUserData.phoneNumber = phoneNumber;
    }
    if (aboutUser) {
      updateUserData.aboutUser = aboutUser;
    }
    if (specialInterest) {
      updateUserData.specialInterest = specialInterest;
    }
    if (environmentalPref) {
      updateUserData.environmentalPref = environmentalPref;
    }
    if (availability) {
      updateUserData.availability = availability;
    }
    if (interest) {
      updateUserData.interest = interest;
    }
    if (profileImage) {
      updateUserData.profileImage = profileImage;
    }
    this._collection.update(docID, { $set: updateUserData });
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the collection associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the UserProfile Collection instance.
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
   * Subscription method for the user-profile data owned by the current user.
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
   * Default implementation of assertValidRoleMethod. Asserts the userId is logged in as an Admin or User.
   * Used in define Meteor methods associated with each class.
   * @param userId the userId of the logged in user. Can be null or undefined.
   * @throws { Meteor.Error } If thereis no looged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.USER, '']);
  }
}

export const UserProfileData = new ProfilePageCollection();

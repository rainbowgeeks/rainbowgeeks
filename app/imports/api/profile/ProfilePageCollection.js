import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const profilePageAvailability = ['mon', 'tues', 'weds', 'thurs', 'fri', 'sat', 'sun', 'week-days', 'weekends',
  'no-pref'];
export const profilePageEnvironmentalPref = ['Outdoors', 'Virtual', 'Mixed', 'no-pref', 'Indoors'];
export const profilePageInterest = ['Education', 'Animal Welfare/Rescue', 'Covid-19 Recovery', 'Child/Family Support', 'Environment', 'Food Insecurity', 'Ongoing Position', 'Crisis/Disaster Relief', 'no-pref'];
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
      specialInterest: String,
      profileImage: String,
      aboutUser: String,
      acceptTerm: String,
      dateOfBirth: Date,
      homeAddress: String,
      city: String,
      state: String,
      zip: String,
      interest: {
        type: Array,
        defaultValue: 'no-pref',
      },
      'interest.$': {
        type: String,
        allowedValues: profilePageInterest,
      },
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
    }));
  }

  /**
   *
   * @param owner Contains the email of the owner of this profile account.
   * @param firstName The first name of the owner.
   * @param lastName The last name of the owner.
   * @param phoneNumber The phone number of the owner
   * @param specialInterest The owner's special interest
   * @param profileImage The owner's profile image URL
   * @param aboutUser The about the user
   * @param acceptTerm The owner must accept the terms of conditions
   * @param dateOfBirth The date of birth of the owner
   * @param homeAddress The physical/mailing address of the owner
   * @param city The city.
   * @param state The state.
   * @param zip The zip code-area
   * @param interest The owner's interest of volunteering
   * @param environmentalPref The owner's environmental preference
   * @param availability The owner's availability
   * @returns the doc ID of this user's collection
   */
  define({ owner, firstName, lastName, phoneNumber, specialInterest, profileImage, aboutUser, acceptTerm, dateOfBirth, homeAddress, city, state, zip, interest, environmentalPref, availability }) {
    const docID = this._collection.insert({
      owner,
      firstName,
      lastName,
      phoneNumber,
      specialInterest,
      profileImage,
      aboutUser,
      acceptTerm,
      dateOfBirth,
      homeAddress,
      city,
      state,
      zip,
      interest,
      environmentalPref,
      availability,
    });
    return docID;
  }

  update(docID, { firstName, lastName, phoneNumber, specialInterest, profileImage, aboutUser, acceptTerm, dateOfBirth, homeAddress, city, state, zip, interest, environmentalPref, availability }) {
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
    if (acceptTerm) {
      updateUserData.acceptTerm = acceptTerm;
    }
    if (dateOfBirth) {
      updateUserData.dateOfBirth = dateOfBirth;
    }
    if (homeAddress) {
      updateUserData.homeAddress = homeAddress;
    }
    if (city) {
      updateUserData.city = city;
    }
    if (state) {
      updateUserData.state = state;
    }
    if (zip) {
      updateUserData.zip = zip;
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
       * This subscription publishes for all the user documents.
       */
      Meteor.publish(ProfilePagePublication.profileAll, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });

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
    this.assertRole(userId, [ROLE.USER, ROLE.ADMIN, ROLE.ORGANIZATION]);
  }
}

export const UserProfileData = new ProfilePageCollection();

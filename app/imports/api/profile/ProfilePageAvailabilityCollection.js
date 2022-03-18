import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { UserProfileData } from './ProfilePageCollection';
import { ROLE } from '../role/Role';
import { Availability } from '../user-availability/UserAvailabilityCollection';

export const profilePageAvailabilityPublication = {
  profilePageAvailability: 'profilePageAvailability',
  profilePageAvailabilityAdmin: 'profilePageAvailabilityAdmin',
};

class ProfilePageAvailabilityCollection extends BaseCollection {
  constructor() {
    super('ProfilePageAvailability', new SimpleSchema({
      profileID: String,
      availabilityID: String,
      availability: String,
    }));
  }

  define({ owner, firstName, lastName, availability }) {
    const profile = UserProfileData.findDoc({ owner, firstName, lastName });
    const userAvailability = Availability.findDoc({ availability });
    const profileID = profile._id;
    const availabilityID = userAvailability._id;
    const docId = this._collection.insert({
      profileID,
      availabilityID,
      availability,
    });
    return docId;
  }

  update(docID, { availabilityID, availability }) {
    const updateData = {};
    if (availabilityID) {
      updateData.availabilityID = availabilityID;
    }
    if (availability) {
      updateData.availability = availability;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Subscription method for all documents.
   */
  subscribeProfilePageEnvironmentPref() {
    if (Meteor.isClient) {
      return Meteor.subscribe(profilePageAvailabilityPublication.profilePageAvailability);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeProfilePageEnvironmentPrefAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(profilePageAvailabilityPublication.profilePageAvailabilityAdmin);
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
    this.assertRole(userId, [ROLE.USER, ROLE.ADMIN]);
  }

  /**
   * Returns an object representing the definition of docID  in a format appropriate to the restoreOne or define function.
   * @param docID.
   * @return {{title, owner, cover, age }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const owner = doc.owner;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const environmentPrefrence = doc.environmentPrefrence;

    return { owner, firstName, lastName, environmentPrefrence };
  }

  /**
   * Default publication method for entities.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(profilePageAvailabilityPublication.profilePageAvailability, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(profilePageAvailabilityPublication.profilePageAvailabilityAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }
}
export const ProfilePageAvailability = new ProfilePageAvailabilityCollection();

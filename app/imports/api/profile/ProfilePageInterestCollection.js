import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { Interest } from '../user-interest/UserInterestCollection';
import { UserProfileData } from './ProfilePageCollection';
import { ROLE } from '../role/Role';

export const profilePageInterestPublication = {
  profilePageInterest: 'profilePageInterest',
  profilePageInterestAdmin: 'profilePageInterestAdmin',
};

class ProfilePageInterestCollection extends BaseCollection {
  constructor() {
    super('ProfilePageInterest', new SimpleSchema({
      profileID: String,
      interestID: String,
      interest: String,
    }));
  }

  define({ owner, firstName, lastName, interest }) {
    const profile = UserProfileData.findDoc({ owner, firstName, lastName });
    const userInterest = Interest.findDoc({ interest });
    const profileID = profile._id;
    const interestID = userInterest._id;
    const docId = this._collection.insert({
      profileID,
      interestID,
      interest,
    });
    return docId;
  }

  update(docID, { interestID, interest }) {
    const updateData = {};
    if (interestID) {
      updateData.interestID = interestID;
    }
    if (interest) {
      updateData.interest = interest;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Subscription method for all documents.
   */
  subscribeProfileInterest() {
    if (Meteor.isClient) {
      return Meteor.subscribe(profilePageInterestPublication.profilePageInterest);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeProfileInterestAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(profilePageInterestPublication.profilePageInterestAdmin);
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
    const interest = doc.interest;

    return { owner, firstName, lastName, interest };
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
      Meteor.publish(profilePageInterestPublication.profilePageInterest, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(profilePageInterestPublication.profilePageInterestAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }
}
export const ProfilePageInterest = new ProfilePageInterestCollection();

import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const locationPublications = {
  location: 'Location',
  locationAdmin: 'locationAdmin',
};

class LocationCollection extends BaseCollection {
  constructor() {
    super('Locations', new SimpleSchema({
      address: String,
      lat: Number,
      long: Number,
    }));
  }

  /**
   * Defines a new Location.
   * @param Address the address of the opportunity.
   * @param Lat the lattitude of the opportunity.
   * @param long the longtitude of the opportunity.
   * @return {String} the docID of the opportunity location.
   */
  define({ address, lat, long }) {
    const docID = this._collection.insert({
      address,
      lat,
      long,
    });
    return docID;
  }

  /**
   * Update the give document.
   * @param Address the new address.
   * @param lat the new lattitude.
   * @param long the new longtitude.
   */
  update(docID, { address, lat, long }) {
    const updateData = {};
    if (address) {
      updateData.address = address;
    }
    if (lat) {
      updateData.lat = lat;
    }
    if (long) {
      updateData.long = long;
    }
    this._collection.update(docID, { set: updateData });
  }

  /**
   * A Stricter form of remove that throws an error if the document or docID could not be found in the collection.
   * @param { String | Object } name A document or docID in the collection.
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
   * It publishes the entire collection for public, users, organizations, and admin.
   * Admin and Organization have more authority to the collection.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;

      /**
       * This subscription publishes all documents regardless of Roles.
       */
      Meteor.publish(locationPublications.location, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents associated with the admin.
       */
      Meteor.publish(locationPublications.locationAdmin, function publish() {
        if (this.userID && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for the location.
   */
  subscribeLocation() {
    if (Meteor.isClient) {
      return Meteor.subscribe(locationPublications.location);
    }
    return null;
  }

  /**
   * Subscription method for the opportunity available for admin.
   */
  subscribeLocationAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(locationPublications.locationAdmin);
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
    this.assertRole(userId, [ROLE.ORGANIZATION, ROLE.ADMIN]);
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Locations = new LocationCollection();

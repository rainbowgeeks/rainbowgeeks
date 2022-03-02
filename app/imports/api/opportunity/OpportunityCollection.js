import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const opportunityPublications = {
  opportunityPublic: 'OpportunityPublic',
  opportunityUser: 'OpportunityUser',
  opportunityOrganization: 'OpportunityOrganization',
  opportunityAdmin: 'OpportunityAdmin',
};

class OpportunityCollection extends BaseCollection {
  constructor() {
    super('Opportunities', new SimpleSchema({
      title: { type: String, index: true, unique: true },
      owner: String,
      cover: String,
      location: String,
      date: String,
      description: String,
    }));
  }

  /**
   * Defines a new opportunitiy.
   * @param title the title of the opportunitiy.
   * @param owner the point of contact for the opportunity.
   * @param description the summary of the opportunitiy.
   * @return {String} the docID of the new opportunity.
   */
  define({ title, owner, cover, location, date, description }) {
    const docID = this._collection.insert({
      title,
      owner,
      cover,
      location,
      date,
      description,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param owner the new point of contact for the opportunity.
   * @param title the new title of the opportunity.
   * @param cover the new cover photo of the opportunity.
   * @param location the new location of the opportunity.
   * @param date the new date of the opportunity.
   * @param description the new summary of the opportunity.
   */
  update(docID, { title, owner, cover, location, date, description }) {
    const updateData = {};
    if (title) {
      updateData.title = title;
    }
    if (owner) {
      updateData.owner = owner;
    }
    if (cover) {
      updateData.cover = cover;
    }
    if (location) {
      updateData.location = location;
    }
    if (date) {
      updateData.date = date;
    }
    if (description) {
      updateData.description = description;
    }
    this._collection.update(docID, { $set: updateData });
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
      // get the OpportunityCollection instance.
      const instance = this;

      /**
       * This subscription publishes all documents regardless of Roles.
       */
      Meteor.publish(opportunityPublications.opportunityPublic, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents associated with the user logged in.
       */
      Meteor.publish(opportunityPublications.opportunityUser, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.USER)) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents associated with the organization logged in.
       */
      Meteor.publish(opportunityPublications.opportunityOrganization, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents associated with the admin.
       */
      Meteor.publish(opportunityPublications.opportunityAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for the opportunity available for public.
   */
  subscribeOpportunityPublic() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunityPublic);
    }
    return null;
  }

  /**
   * Subscription method for the opportunity available for Current Users.
   */
  subscribeOpportunityUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunityUser);
    }
    return null;
  }

  /**
   * Subscription method for the opportunity available for Current Organization.
   */
  subscribeOpportunityOrganization() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunityOrganization);
    }
    return null;
  }

  /**
   * Subscription method for the opportunity available for Admin.
   */
  subscribeOpportunityAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunityAdmin);
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

  /**
   * Returns an object representing the definition of docID  in a format appropriate to the restoreOne or define function.
   * @param docID.
   * @return {{title, owner, cover, location, date, description }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const title = doc.title;
    const owner = doc.owner;
    const cover = doc.cover;
    const location = doc.location;
    const date = doc.date;
    const description = doc.description;
    return { title, owner, cover, location, date, description };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Opportunities = new OpportunityCollection();

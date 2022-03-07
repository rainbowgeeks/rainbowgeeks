import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { Opportunities } from './OpportunityCollection';
import { Ages } from '../age/AgeCollection';
import { ROLE } from '../role/Role';

export const opportunitiesAgePublications = {
  opportunitiesAge: 'OpportunityAge',
  opportunitiesAgeAdmin: 'OpportunityAgeAdmin',
};

class OpportunitiesAgeCollection extends BaseCollection {
  constructor() {
    super('OpportunitiesAges', new SimpleSchema({
      oppID: String,
      ageID: String,
      age: String,
    }));
  }

  /**
   * Defines a new query collection.
   * @param oppID the oppID of the item.
   * @param ageID the ageID of the item.
   * @param age the ageID of the item.
   * @return {String} the docID of the new document.
   */
  define({ title, location, date, age }) {
    const opp = Opportunities.findDoc({ title, location, date });
    const ages = Ages.findDoc({ age });
    const oppID = opp._id;
    const ageID = ages._id;

    const docID = this._collection.insert({
      oppID,
      ageID,
      age,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param ageOD the new ageID (optional).
   */
  update(docID, { ageID, age }) {
    const updateData = {};
    if (ageID) {
      updateData.ageID = ageID;
    }
    if (age) {
      updateData.age = age;
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
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(opportunitiesAgePublications.opportunitiesAge, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(opportunitiesAgePublications.opportunitiesAgeAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for all documents.
   */
  subscribeOpportunitiesAge() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesAgePublications.opportunitiesAge);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeOpportunitiesAgeAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesAgePublications.opportunitiesAgeAdmin);
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
   * @return {{title, owner, cover, age }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const title = doc.title;
    const owner = doc.owner;
    const age = doc.age;

    return { title, owner, age };
  }
}

export const OpportunitiesAges = new OpportunitiesAgeCollection();

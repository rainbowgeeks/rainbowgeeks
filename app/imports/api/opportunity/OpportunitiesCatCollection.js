import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { Opportunities } from './OpportunityCollection';
import { Categories } from '../category/CategoryCollection';
import { ROLE } from '../role/Role';

export const opportunitiesCategoryPublications = {
  opportunitiesCategory: 'OpportunitiesCategory',
  opportunitiesCategoryAdmin: 'OpportunitiesCategoryAdmin',
};

class OpportunitiesCatCollection extends BaseCollection {
  constructor() {
    super('OpportunitiesCats', new SimpleSchema({
      oppID: String,
      catID: String,
      category: String,
    }));
  }

  /**
   * Defines a new query collection.
   * @param oppID the oppID of the item.
   * @param catID the catID of the item.
   * @param category the category of the item.
   * @return {String} the docID of the document.
   */
  define({ title, location, date, category }) {
    const opp = Opportunities.findDoc({ title, location, date });
    const cat = Categories.findDoc({ category });
    const oppID = opp._id;
    const catID = cat._id;

    const docID = this._collection.insert({
      oppID,
      catID,
      category,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param catID the new catID (optional).
   * @param category the new category (optional).
   */
  update(docID, { catID, category }) {
    const updateData = {};
    if (catID) {
      updateData.catID = catID;
    }
    if (category) {
      updateData.category = category;
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
       * This subscription publishes all documents regarding Roles.
       */
      Meteor.publish(opportunitiesCategoryPublications.opportunitiesCategory, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
      /**
       * This subscription publishes documents regarding the organization.
       */
      Meteor.publish(opportunitiesCategoryPublications.opportunitiesCatAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for the documents.
   */
  subscribeOpportunitiesCategory() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesCategoryPublications.opportunitiesCategory);
    }
    return null;
  }

  /**
   * Subscription method for all documents.
   */
  subscribeOpportunitiesCategoryAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunitiesCategoryPublications.opportunitiesCategoryAdmin);
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
   * @return {{ oppID, catID, category }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const oppID = doc.oppID;
    const catID = doc.catID;
    const category = doc.category;

    return { oppID, catID, category };
  }
}

export const OpportunitiesCats = new OpportunitiesCatCollection();

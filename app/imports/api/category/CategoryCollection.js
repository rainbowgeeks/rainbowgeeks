import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const categoryPublications = {
  category: 'Category',
  categoryAdmin: 'CategoryAdmin',
};

class CategoryCollection extends BaseCollection {
  constructor() {
    super('Categories', new SimpleSchema({
      category: { type: String, index: true, unique: true },
    }));
  }

  /**
   * Defines a new category document.
   * @param category the new category document.
   * @return {String} the docID of the new document.
   */
  define({ category }) {
    const docID = this.findOne({ category });
    if (docID) {
      return docID._id;
    }
    return this._collection.insert({
      category: category,
    });
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param category the new category.
   */
  update(docID, { category }) {
    const updateData = {};
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
       * Publications for the entire collection for users.
       */
      Meteor.publish(categoryPublications.category, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      Meteor.publish(categoryPublications.categoryAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription for user collection.
   */
  subscribeCategory() {
    if (Meteor.isClient) {
      return Meteor.subscribe(categoryPublications.category);
    }
    return null;
  }

  /**
   * Subscription for admin.
   */
  subscribeCategoryAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(categoryPublications.categoryAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ORGANIZATION, ROLE.ADMIN]);
  }

  /**
   * Returns an object representing the definition of docID  in a format appropriate to the restoreOne or define function.
   * @param docID.
   * @return {{ environment }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const environment = doc.environment;

    return { environment };
  }
}

export const Categories = new CategoryCollection();

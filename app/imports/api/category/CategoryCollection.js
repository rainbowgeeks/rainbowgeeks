import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const categoryPublications = {
  categoryPublic: 'CategoryPublic',
  categoryUser: 'CategoryUser',
  categoryOrganization: 'CategoryOrganization',
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
   * Default publication method for entities.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;

      Meteor.publish(categoryPublications.categoryPublic, function publish() {
        if (Meteor.isServer) {
          return instance._collection.find();
        }
        return this.ready();
      });

      Meteor.publish(categoryPublications.categoryUser, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.USER)) {
          const _id = Meteor.users.findOne(this.userId)._id;
          return instance._collection.find({ _id: _id });
        }
        return this.ready();
      });

      Meteor.publish(categoryPublications.categoryOrganization, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ORGANIZATION)) {
          const _id = Meteor.users.findOne(this.userId)._id;
          return instance._collection.find({ _id: _id });
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
   * Subscription
   */
  subscribeCategoryPublic() {
    if (Meteor.isClient) {
      return Meteor.subscribe(categoryPublications.categoryPublic);
    }
    return null;
  }

  /**
   * Subscription
   */
  subscribeCategoryUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(categoryPublications.categoryUser);
    }
    return null;
  }

  /**
   * Subscription
   */
  subscribeCategoryOrganization() {
    if (Meteor.isClient) {
      return Meteor.subscribe(categoryPublications.categoryOrganization);
    }
    return null;
  }

  /**
   * Subscription
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
}

export const Categories = new CategoryCollection();

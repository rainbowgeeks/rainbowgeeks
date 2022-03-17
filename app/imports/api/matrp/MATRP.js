import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../stuff/StuffCollection';
import { Organizations } from '../organization/OrganizationCollection';
import { OrganizationPocs } from '../organization/OrganizationPocCollection';
import { OpportunitiesPocs } from '../opportunity/OpportunitiesPocCollection';
import { PointOfContacts } from '../point-of-contact/PointOfContactCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Categories } from '../category/CategoryCollection';
import { Ages } from '../age/AgeCollection';
import { Environments } from '../environment/EnvironmentCollection';
import { OpportunitiesCats } from '../opportunity/OpportunitiesCatCollection';
import { OpportunitiesAges } from '../opportunity/OpportunitiesAgeCollection';
import { OpportunitiesEnvs } from '../opportunity/OpportunitiesEnvCollection';
import { AdminProfiles } from '../user/AdminProfileCollection';
import { UserProfiles } from '../user/UserProfileCollection';
import { OrganizationProfiles } from '../user/OrganizationProfileCollection';
import { UserProfileData } from '../profile/ProfilePageCollection';
import { Interest } from '../user-interest/UserInterestCollection';
import { ProfilePageInterest } from '../profile/ProfilePageInterestCollection';

class MATRPClass {
  collections;

  collectionLoadSequence;

  collectionAssociation;

  constructor() {
    // list of all the MATRP collections
    this.collections = [
      AdminProfiles,
      Ages,
      Categories,
      Environments,
      Interest,
      Stuffs,
      Organizations,
      OrganizationPocs,
      Opportunities,
      OpportunitiesPocs,
      OpportunitiesCats,
      OpportunitiesAges,
      OpportunitiesEnvs,
      OrganizationProfiles,
      PointOfContacts,
      UserProfileData,
      UserProfiles,
      ProfilePageInterest,
    ];
    /*
     * A list of collection class instances in the order required for them to be sequentially loaded from a file.
     */
    this.collectionLoadSequence = [
      AdminProfiles,
      Ages,
      Categories,
      Environments,
      Interest,
      Stuffs,
      Organizations,
      OrganizationPocs,
      Opportunities,
      OpportunitiesPocs,
      OpportunitiesCats,
      OpportunitiesAges,
      OpportunitiesEnvs,
      OrganizationProfiles,
      PointOfContacts,
      UserProfileData,
      UserProfiles,
      ProfilePageInterest,
    ];

    /*
     * An object with keys equal to the collection name and values the associated collection instance.
     */
    this.collectionAssociation = {};
    this.collections.forEach((collection) => {
      this.collectionAssociation[collection.getCollectionName()] = collection;
    });

  }

  /**
   * Return the collection class instance given its name.
   * @param collectionName The name of the collection.
   * @returns The collection class instance.
   * @throws { Meteor.Error } If collectionName does not name a collection.
   */
  getCollection(collectionName) {
    // console.log('MATRP', collectionName, this.collectionAssociation);
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called MARTP.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;
  }
}

export const MATRP = new MATRPClass();

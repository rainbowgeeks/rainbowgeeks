import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OpportunitiesPocs } from '../../api/opportunity/OpportunitiesPocCollection';
import { PointOfContacts } from '../../api/point-of-contact/PointOfContactCollection';
import { Categories } from '../../api/category/CategoryCollection';
import { Ages } from '../../api/age/AgeCollection';
import { Environments } from '../../api/environment/EnvironmentCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import { UserProfileData } from '../../api/profile/ProfilePageCollection';
/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}

function addAges(ages) {
  Ages.define({ age: ages });
}

function addEnvironments(environments) {
  Environments.define({ environment: environments });
}

function addCategories(categories) {
  Categories.define({ category: categories });
}

function addPointOfContact(pointOfContact, organizationName) {
  const { firstName, lastName, phoneNumber, email } = pointOfContact;
  PointOfContacts.define({ firstName, lastName, phoneNumber, email });
  OrganizationPocs.define({ email: email, organizationName });
}

function addOpportunity({ owner, title, cover, location, date, description, age, environment, category }) {
  age.map(ages => addAges(ages));
  environment.map(environments => addEnvironments(environments));
  category.map(categories => addCategories(categories));
  console.log(` Adding: ${title} (${owner})`);
  Opportunities.define({ title: title, owner, cover, location, date, description });
  OpportunitiesPocs.define({ email: owner, title, location, date });
  age.map(ages => OpportunitiesAges.define({ title: title, location: location, date: date, age: ages }));
  environment.map(environments => OpportunitiesEnvs.define({ title: title, location: location, date: date, environment: environments }));
  category.map(categories => OpportunitiesCats.define({ title: title, location: location, date: date, category: categories }));
}

function addOrganization({ organizationName, missionStatement, organizationDescription, orgEmail, pointOfContacts }) {
  console.log(` Adding Organization: ${organizationName}`);
  Organizations.define({ organizationName: organizationName, missionStatement, description: organizationDescription, orgEmail });
  pointOfContacts.map(pointOfContact => addPointOfContact(pointOfContact, organizationName));
}

if (Organizations.count() === 0) {
  if (Meteor.settings.defaultOrganizations && Meteor.settings.defaultOpportunities) {
    console.log('Creating default Organization.');
    Meteor.settings.defaultOrganizations.map(data2 => addOrganization(data2));
    console.log('Creating default Opportunities.');
    Meteor.settings.defaultOpportunities.map(opportunity => addOpportunity(opportunity));
  }
}

function addProfileData(profileData) {
  console.log(` Adding: ${profileData.firstName} (${profileData.owner})`);
  UserProfileData.define(profileData);
}

if (UserProfileData.count() === 0) {
  if (Meteor.settings.defaultProfileData) {
    console.log('Creating default profile-users.');
    Meteor.settings.defaultProfileData.map(profileData => addProfileData(profileData));
  }
}

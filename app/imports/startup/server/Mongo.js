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
import { Hours } from '../../api/hours/HoursCollection';
import { OpportunityHours } from '../../api/opportunity/OpportunityHoursCollection';
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
// Add new age to the collection if it already exist return docID.
function addAges(ages) {
  Ages.define({ age: ages });
}
// Add new environment to the collection if it exist return docID.
function addEnvironments(environments) {
  Environments.define({ environment: environments });
}
// Add new category to the collection return docID if it exist.
function addCategories(categories) {
  Categories.define({ category: categories });
}
// Add new point of contact to POC collection and also add new point of contact related to.
// an organization to the org poc collection.
function addPointOfContact({ firstName, lastName, phoneNumber, email }, orgEmail) {
  PointOfContacts.define({ firstName, lastName, phoneNumber, email });
  OrganizationPocs.define({ email: email, orgEmail });
}
function addHours({ volunteerEmail, numberOfHours }, title, location) {
  Hours.define({ numberOfHours });
  OpportunityHours.define({ title, location, volunteerEmail, numberOfHours });
}

// add new opportunity to the collection
// add point of contacts to related opportunities to the opp poc collection.
// add age, category, environments related to an opportunity to the age, cat, envOPP collections.
function addOpportunity({ owner, title, cover, location, oppStart, oppEnd, description, age, environment, category, opportunityVolunteerHours }) {
  age.map(ages => addAges(ages));
  environment.map(environments => addEnvironments(environments));
  category.map(categories => addCategories(categories));
  console.log(` Adding: ${title} (${owner})`);
  Opportunities.define({ title: title, owner, cover, location, oppStart, oppEnd, description });
  OpportunitiesPocs.define({ email: owner, title, location });
  age.map(ages => OpportunitiesAges.define({ title: title, location: location, age: ages }));
  environment.map(environments => OpportunitiesEnvs.define({ title: title, location: location, environment: environments }));
  category.map(categories => OpportunitiesCats.define({ title: title, location: location, category: categories }));
  opportunityVolunteerHours.map(opportunityVolunteerHour => addHours(opportunityVolunteerHour, title, location));
}
// Add a organization to the org collection.
function addOrganization({ organizationName, missionStatement, organizationDescription, orgEmail, pointOfContacts }) {
  console.log(` Adding Organization: ${organizationName}`);
  Organizations.define({ organizationName: organizationName, missionStatement, description: organizationDescription, orgEmail });
  pointOfContacts.map(pointOfContact => addPointOfContact(pointOfContact, orgEmail));
}
// Add new Organization and Opportunities if count is 0.
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

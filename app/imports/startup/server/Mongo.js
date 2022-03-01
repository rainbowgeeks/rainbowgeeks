import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
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

function addOpportunity({ owner, title, cover, location, date, description, age, environment, category }) {
  console.log(` Adding: ${title} (${owner})`);
  Opportunities.define({ title: title, owner, cover, location, date, description });
  age.map(ages => OpportunitiesAges.define({ title: title, owner: owner, age: ages }));
  environment.map(environments => OpportunitiesEnvs.define({ title: title, owner: owner, environment: environments }));
  category.map(categories => OpportunitiesCats.define({ title: title, owner: owner, category: categories }));
  age.map(ages => addAges(ages));
  environment.map(environments => addEnvironments(environments));
  category.map(categories => addCategories(categories));
}

if (Opportunities.count() === 0) {
  if (Meteor.settings.defaultOpp) {
    console.log('Creating default opportunity.');
    Meteor.settings.defaultOpp.map(data2 => addOpportunity(data2));
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

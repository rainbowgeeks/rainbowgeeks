import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
// import { Ages } from '../../api/age/AgeCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
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

// function addAges(ages) {
//   console.log(`${ages}`);
//   const collectionName = Ages.getCollectionName();
//   const updateData = { id: }
//    Ages.define({ age: ages });
// }

function addOpportunity({ owner, title, cover, location, date, description, age, environment }) {
  console.log(` Adding: ${title} (${owner})`);
  Opportunities.define({ organizerEmail: owner, title, cover, location, date, description });
  age.map(ages => OpportunitiesAges.define({ owner: owner, age: ages }));
  environment.map(environments => OpportunitiesEnvs.define({ owner: owner, environment: environments }));
  // age.map(ages => addAges(ages));
}

if (Opportunities.count() === 0) {
  if (Meteor.settings.defaultOpp) {
    console.log('Creating default opportunity.');
    Meteor.settings.defaultOpp.map(data2 => addOpportunity(data2));
    // console.log('Creating Age Collection');
    // Meteor.settings.defaultOpp.map(data2 => addAges(data2));
  }
}

function addProfileData(profileData) {
  console.log(` Adding: ${profileData.firstName} (${profileData.owner})`);
  UserProfileData.define(profileData);
}

if (UserProfileData.count() === 0) {
  if (Meteor.settings.defaultProfileData) {
    Meteor.settings.defaultProfileData.map(profileData => addProfileData(profileData));
  }
}

import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
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

function addOpportunity(data2) {
  console.log(` Adding: ${data2.title} (${data2.owner})`);
  Opportunities.define(data2);
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
    Meteor.settings.defaultProfileData.map(profileData => addProfileData(profileData));
  }
}

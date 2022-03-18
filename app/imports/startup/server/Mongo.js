import { Meteor } from 'meteor/meteor';
import { func } from 'fast-check';
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
import { Interest } from '../../api/user-interest/UserInterestCollection';
import { ProfilePageInterest } from '../../api/profile/ProfilePageInterestCollection';
import { EnvironmentalPref } from '../../api/user-environment-prefrence/UserEnvironmentPrefCollection';
import { ProfilePageEnvironmentPref } from '../../api/profile/ProfilePageEnvironementPrefCollection';
import { Availability } from '../../api/user-availability/UserAvailabilityCollection';
import { ProfilePageAvailability } from '../../api/profile/ProfilePageAvailabilityCollection';
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

function addAvailability(availability) {
  Availability.define({ availability });
}

function addEnvironmentPref(environmentPrefs) {
  EnvironmentalPref.define({ environmentPreference: environmentPrefs });

}

function addEnvironments(environments) {
  Environments.define({ environment: environments });
}

function addInterest(interest) {
  Interest.define({ interest: interest });
}

function addCategories(categories) {
  Categories.define({ category: categories });
}

function addPointOfContact({ firstName, lastName, phoneNumber, email }, orgEmail) {
  PointOfContacts.define({ firstName, lastName, phoneNumber, email });
  OrganizationPocs.define({ email: email, orgEmail });
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
  pointOfContacts.map(pointOfContact => addPointOfContact(pointOfContact, orgEmail));
}

if (Organizations.count() === 0) {
  if (Meteor.settings.defaultOrganizations && Meteor.settings.defaultOpportunities) {
    console.log('Creating default Organization.');
    Meteor.settings.defaultOrganizations.map(data2 => addOrganization(data2));
    console.log('Creating default Opportunities.');
    Meteor.settings.defaultOpportunities.map(opportunity => addOpportunity(opportunity));
  }
}

function addProfileData({ owner, firstName, lastName, phoneNumber, interest, specialInterest, environmentPreference, availability, profileImage, aboutUser }) {

  interest.map(interests => addInterest(interests));

  environmentPreference.map(environmentPreferences => addEnvironmentPref(environmentPreferences));

  availability.map(availabilities => addAvailability(availabilities));

  console.log(` Adding: ${firstName} ${lastName} (${owner})`);

  UserProfileData.define({ owner: owner, firstName, lastName, phoneNumber, specialInterest, profileImage, aboutUser });

  interest.map(interests => ProfilePageInterest.define({ owner: owner, firstName: firstName, lastName: lastName, interest: interests }));
  environmentPreference.map(environmentPreferences => ProfilePageEnvironmentPref.define({ owner: owner, firstName: firstName, lastName: lastName, environmentPreference: environmentPreferences,
  }));
  availability.map(availabilities => ProfilePageAvailability.define({ owner: owner, firstName: firstName, lastName: lastName, availability: availabilities }));
}

if (UserProfileData.count() === 0) {
  if (Meteor.settings.defaultProfileData) {
    console.log('Creating default Users.');
    Meteor.settings.defaultProfileData.map(userData => addProfileData(userData));
  }
}

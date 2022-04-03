import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Landing from '../pages/Landing';
import FilterOpportunities from '../pages/FilterOpportunities';
import AdminProfile from '../pages/AdminProfile';
import OrganizationLibrary from '../pages/OrganizationLibrary';
import ManageOrganizations from '../pages/ManageOrganizations';
import ManageOpportunities from '../pages/ManageOpportunities';
import AdminAnalytics from '../pages/AdminAnalytics';
import ManageUsers from '../pages/ManageUsers';
import AddProfile from '../pages/AddProfile';
import EditStuff from '../pages/EditStuff';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import ManageDatabase from '../pages/ManageDatabase';
import { ROLE } from '../../api/role/Role';
import ProfilePage from '../pages/ProfilePage';
import EditProfile from '../pages/EditProfile';
import OrganizationProfile from '../pages/OrganizationProfile';
import OpportunityPage from '../pages/OpportunityPage';
import UserTrackingHoursPage from '../pages/UserTrackingHoursPage';
import AboutUs from '../pages/AboutUs';
import AddOpportunity from '../pages/AddOpportunity';
import EditOpportunity from '../pages/EditOpportunity';
import ManageHoursPage from '../pages/ManageHoursPage';
import OrganizationHoursPage from '../pages/OrganizationHoursPage';
import UserSubmitEventHours from '../pages/UserSubmitEventHours';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar/>
          <Switch>
            <Route exact path="/" component={Landing}/>
            <Route path="/filter" component={FilterOpportunities}/>
            <Route path="/event/:_id" component={OpportunityPage}/>
            <Route path="/signin" component={Signin}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/signout" component={Signout}/>
            <Route path="/about" component={AboutUs}/>
            <ProtectedRoute path="/profile" component={ProfilePage}/>
            <ProtectedRoute path="/add" component={AddProfile}/>
            <ProtectedRoute path="/track-hours" component={UserTrackingHoursPage}/>
            <ProtectedRoute path="/org-profile" component={OrganizationProfile}/>
            <ProtectedRoute path="/edit-profile/:_id" component={EditProfile}/>
            <ProtectedRoute path="/edit" component={EditProfile}/>
            <ProtectedRoute path="/add2" component={AddProfile}/>
            <ProtectedRoute path='/submit-hours' component={UserSubmitEventHours}/>
            <ProtectedRoute path="/org-library" component={OrganizationLibrary}/>
            <ProtectedRoute path="/edit/:_id" component={EditStuff}/>
            <OrganizationProtectedRoute path="/add-opp" component={AddOpportunity}/>
            <OrganizationProtectedRoute path="/manage-opp" component={ManageOpportunities}/>
            <OrganizationProtectedRoute path="/edit-opp/:_id" component={EditOpportunity}/>
            <OrganizationProtectedRoute path="/manage-hours" component={ManageHoursPage}/>
            <OrganizationProtectedRoute path="/org-hours/:_id" component={OrganizationHoursPage}/>
            <AdminProtectedRoute path="/admin" component={AdminProfile}/>
            <AdminProtectedRoute path="/manage-org" component={ManageOrganizations}/>
            <AdminProtectedRoute path="/manage-user" component={ManageUsers}/>
            <AdminProtectedRoute path="/manage-opps" component={ManageOpportunities}/>
            <AdminProtectedRoute path="/manage-database" component={ManageDatabase}/>
            <AdminProtectedRoute path="/admin-analytics" component={AdminAnalytics}/>
            <Route component={NotFound}/>
          </Switch>

        </div>
      </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
      return (isLogged && isAdmin) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * OrganizationProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const OrganizationProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isOrganization = Roles.userIsInRole(Meteor.userId(), ROLE.ORGANIZATION);
      return (isLogged && isOrganization) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

// Require a component and location to be passed to each OrganizationProtectedRoute.
OrganizationProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

export default App;

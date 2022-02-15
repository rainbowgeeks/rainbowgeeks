import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBarV from '../components/NavBarV';
import Landing from '../pages/Landing';
import FilterOpportunities from '../pages/FilterOpportunities';
import ListStuff from '../pages/ListStuff';
import AdminProfile from '../pages/AdminProfile';
import OrganizationLibrary from '../pages/OrganizationLibrary';
import ManageOrganizations from '../pages/ManageOrganizations';
import AddStuff from '../pages/AddStuff';
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

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <NavBarV/>
          <Switch>
            <Route exact path="/" component={Landing}/>
            <Route exact path="/filter" component={FilterOpportunities}/>
            <Route exact path="/event/:_id" component={OpportunityPage}/>
            <Route path="/signin" component={Signin}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/signout" component={Signout}/>
            <ProtectedRoute path="/list" component={ListStuff}/>
            <ProtectedRoute path="/profile" component={ProfilePage}/>
            <ProtectedRoute path="/organizationProfile" component={OrganizationProfile}/>
            <ProtectedRoute path="/edit-profile" component={EditProfile}/>
            <ProtectedRoute path="/edit" component={EditProfile}/>
            <ProtectedRoute path="/add" component={AddStuff}/>
            <ProtectedRoute path="/add2" component={AddProfile}/>
            <ProtectedRoute path="/org-library" component={OrganizationLibrary}/>
            <ProtectedRoute path="/edit/:_id" component={EditStuff}/>
            <AdminProtectedRoute path="/admin" component={AdminProfile}/>
            <AdminProtectedRoute path="/manage-org" component={ManageOrganizations}/>
            <AdminProtectedRoute path="/manage-database" component={ManageDatabase}/>
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

export default App;

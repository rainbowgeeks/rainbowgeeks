import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Header, Dropdown, Input } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** The Navbar appears at the top of every page. Rendered by the App Layout component.
 * Certain Navbar Components will only appear when appropriate authentication is inserted.
 */
const NewNavBar = ({ currentUser }) => (
  <Menu className={'navbar-menu-orientation'} borderless stackable size={'large'}>
    <Menu.Item id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} activeClassName="" exact to="/" key="home1">
      <Header as='h1'>VA</Header>
    </Menu.Item>
    <Menu.Item key="search">
      <Input action={{ icon: 'search' }} placeholder='Search...' />
    </Menu.Item>
    <Menu.Item key="home2" position={'right'} id={COMPONENT_IDS.NAVBAR_ADD_STUFF} as={NavLink} activeClassName="active" exact to="/">
      Home
    </Menu.Item>
    <Menu.Item as={NavLink} activeClassName="active" exact to="/filter" key="filter">
      Browse Opportunities
    </Menu.Item>
    <Menu.Item as={NavLink} activeClassName="active" exact to="/org-library" key="org-library">
      Organization Library
    </Menu.Item>
    <Menu.Item key='about' as={NavLink} activeClassName="active" exact to="/about">
      About Us
    </Menu.Item>
    <Menu.Menu position="right">
      {/* eslint-disable-next-line no-nested-ternary */}
      {Roles.userIsInRole(Meteor.userId(), [ROLE.USER]) ? (
        [
          <Menu.Item key="volunteer">
            {(currentUser !== '') && (currentUser) ? (
              <Dropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} className={'volunteer-color'} text={currentUser} pointing="top right" icon={'user'}>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} text="My Profile" exact to="/profile" key="profile"/>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} icon="sign out" text="Sign out" as={NavLink} exact to="/signout"/>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Dropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} text="Login" icon={'user'} simple item>
                <Dropdown.Menu>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} icon="user" text="Sign In" as={NavLink} exact to="/signin"/>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} icon="add user" text="Sign Up" as={NavLink} exact to="/signup"/>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Menu.Item>,
        ]) : Roles.userIsInRole(Meteor.userId(), [ROLE.ORGANIZATION]) ? (
        [
          <Menu.Item key="organization">
            {(currentUser !== '') && (currentUser) ? (
              <Dropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} className={'organization-color'} text={currentUser} pointing="top right" icon={'user'}>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} text="My Profile" exact to="/org-profile" key="org-profile"/>
                  <Dropdown.Item as={NavLink} text="Manage Hours" exact to="/manage-hours" key="manage-hours"/>
                  <Dropdown.Item as={NavLink} text="Manage Opportunities" exact to="/manage-opp" key="manage-opp"/>
                  <Dropdown.Item as={NavLink} text="View Volunteer Hours" exact to="/confirmed-hours" key="confirmed-hours"/>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} icon="sign out" text="Sign out" as={NavLink} exact to="/signout"/>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Dropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} text="Login" icon={'user'} simple item>
                <Dropdown.Menu>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} icon="user" text="Sign In" as={NavLink} exact to="/signin"/>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} icon="add user" text="Sign Up" as={NavLink} exact to="/signup"/>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Menu.Item>,
        ]) :
        [
          <Menu.Item key="admin">
            {(currentUser !== '') && (currentUser) ? (
              <Dropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} text={currentUser} pointing="top right" icon={'user'}>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} text="My Profile" exact to="/admin" key="admin-profile"/>
                  <Dropdown.Item as={NavLink} text="Manage Users" exact to="/manage-user" key="manage-user"/>
                  <Dropdown.Item as={NavLink} text="Manage Organizations" exact to="/manage-org" key="manage-org"/>
                  <Dropdown.Item as={NavLink} text="Manage Opportunities" exact to="/manage-opps" key="manage-opps"/>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} icon="sign out" text="Sign out" as={NavLink} exact to="/signout"/>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Dropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} text="Login" icon={'user'} simple item>
                <Dropdown.Menu>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} icon="user" text="Sign In" as={NavLink} exact to="/signin"/>
                  <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} icon="add user" text="Sign Up" as={NavLink} exact to="/signup"/>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Menu.Item>,
        ]}
    </Menu.Menu>
  </Menu>
);

NewNavBar.propTypes = {
  currentUser: PropTypes.string,
};

// withTracker connects Meteor data to React components.
const NewNavBarContainer = withTracker(() => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  return {
    currentUser,
  };
})(NewNavBar);

// Enable ReactRouter for this component.
export default withRouter(NewNavBarContainer);

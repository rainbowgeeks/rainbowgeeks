import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Header, Dropdown } from 'semantic-ui-react';
// import { Roles } from 'meteor/alanning:roles';
// import { Role } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** The Navbar appears at the top of every page. Rendered by the App Layout component.
 * Certain Navbar Components will only appear when appropraite aunthentication is inserted.
 */
const NavBarV = ({ currentUser }) => {
  const menuStyle = { marginBottom: '10px', backgroundColor: '#0695fa' };
  return (
    <Menu style={menuStyle} attached="top" borderless inverted>
      <Menu.Item id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} activeClassName="" exact to="/">
        <Header inverted as='h1'>VA</Header>
      </Menu.Item>
      <Menu.Item id={COMPONENT_IDS.NAVBAR_ADD_STUFF} position="right" as={NavLink} activeClassName="active" exact to="/add">
        Home
      </Menu.Item>
      <Menu.Item as={NavLink} activeClassName="active" exact to="/filter">
        Browse Opportunities
      </Menu.Item>
      <Menu.Item>
        Organization Library
      </Menu.Item>
      <Menu.Item as={NavLink} activeClassName="active" exact to="/org-library">
        About Us
      </Menu.Item>
      <Menu.Item position="right">
        {(currentUser !== '') && (currentUser) ? (
          <Dropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} text={currentUser} pointing="top right" icon={'user'}>
            <Dropdown.Menu>
              <Dropdown.Item text="Add Opportunity"/>
              <Dropdown.Item text="My Opportunity"/>
              <Dropdown.Item as={NavLink} text="My Profile" exact to="/profile"/>
              <Dropdown.Item text="My Organization Profile"/>
              <Dropdown.Item text="Account Settings"/>
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
      </Menu.Item>
    </Menu>
  );
};

NavBarV.propTypes = {
  currentUser: PropTypes.string,
};

// withTracker connects Meteor data to React components.
const NavBarContainer = withTracker(() => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  return {
    currentUser,
  };
})(NavBarV);

// Enable ReactRouter for this component.
export default withRouter(NavBarContainer);

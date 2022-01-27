import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Header, Dropdown } from 'semantic-ui-react';

/** The Navbar appears at the top of every page. Rendered by the App Layout component.
 * Certain Navbar Components will only appear when appropraite aunthentication is inserted.
 */
const NavBarV = ({ currentUser }) => {
  const menuStyle = { marginBottom: '10px', backgroundColor: '#0695fa' };
  console.log(currentUser);
  return (
    <Menu style={menuStyle} attached="top" borderless inverted>
      <Menu.Item as={NavLink} activeClassName="" exact to="/">
        <Header inverted as='h1'>VA</Header>
      </Menu.Item>
      <Menu.Item position="right" as={NavLink} activeClassName="active" exact to="/add">
        Home
      </Menu.Item>
      <Menu.Item as={NavLink} activeClassName="active" exact to="/list">
        Browse Opportunities
      </Menu.Item>
      <Menu.Item as={NavLink} activeClassName="active" exact to="/add">
        Organization Library
      </Menu.Item>
      <Menu.Item as={NavLink} activeClassName="active" exact to="/list">
        About Us
      </Menu.Item>
      <Menu.Menu position="right">
        {(currentUser !== '') && (currentUser) ? (
          <Menu.Item>
            <Dropdown text={currentUser} simple item>
              <Dropdown.Menu>
                <Dropdown.Item text="Add Opportunity"/>
                <Dropdown.Item text="My Opportunity"/>
                <Dropdown.Item text="My Profile"/>
                <Dropdown.Item text="My Organization Profile"/>
                <Dropdown.Item text="Account Settings"/>
                <Dropdown.Item as={NavLink} text="Sign out" exact to="/signout"/>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        ) : (
          <Menu.Item>
            <Dropdown text="Login" icon={'user'} simple item>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact to="/signin"/>
                <Dropdown.Item icon="add user" text="Sign Up" as={NavLink} exact to="/signup"/>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Menu.Menu>
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

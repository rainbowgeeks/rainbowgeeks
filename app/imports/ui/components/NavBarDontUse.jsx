import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Header, Input } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** The Navbar appears at the top of every page. Rendered by the App Layout component.
 * Certain Navbar Components will only appear when appropriate authentication is inserted.
 */
const NavBar = ({ currentUser }) => {
  const menuStyle = { paddingBottom: '50px' };
  return (
    <Menu className={'navbar-menu-orrientation'} size={'tiny'} style={menuStyle} attached='top' borderless stackable>
      <Menu.Item className={'large-font'} id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} activeClassName="" exact to="/" key="home1">
        <Header as='h1'>VA</Header>
      </Menu.Item>
      <Menu.Item key="search">
        <Input action={{ icon: 'search' }} placeholder='Search...'/>
      </Menu.Item>
      <Menu.Item key="home2" position={'right'} className={'large-font'} id={COMPONENT_IDS.NAVBAR_ADD_STUFF} as={NavLink} activeClassName="active" exact to="/">
        Home
      </Menu.Item>
      <Menu.Item className={'large-font'} as={NavLink} activeClassName="active" exact to="/org-profile" key='org-profile'>
        My Profile
      </Menu.Item>
      <Menu.Item className={'large-font'} as={NavLink} activeClassName="active" exact to="/manage-opp" key='manage-opp'>
        Manage Opportunities
      </Menu.Item>
      <Menu.Item className={'large-font'} as={NavLink} activeClassName="active" exact to="/filter" key="filter">
        Browse Opportunities</Menu.Item>,
      <Menu.Item className={'large-font'} as={NavLink} activeClassName="active" exact to="/org-library" key="org-library">
        Organization Library </Menu.Item>,
      <Menu.Item key='about' className={'large-font'} as={NavLink} activeClassName="active" exact to="/about">
        About Us
      </Menu.Item>
    </Menu>
  );
};

NavBar.propTypes = {
  currentUser: PropTypes.string,
};

// withTracker connects Meteor data to React components.
const NavBarContainer = withTracker(() => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  return {
    currentUser,
  };
})(NavBar);

// Enable ReactRouter for this component.
export default withRouter(NavBarContainer);

import React from 'react';
import { Card, CardHeader, Container, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const gridLenght = { width: '100%' };
const cardHeaders = { paddingBottom: '20px' };
const cardMeta = { paddingBottom: '5px' };

/** Renders the column to display user Information. See pages/ProfilePage.jsx. */
const ProfilePageUserInformation = ({ aboutUser }) => (
  <Container>
    <Card color='blue' style={gridLenght}>
      <img src={aboutUser.profileImage} height='380px'/>
      <Card.Content>
        <Card.Header style={cardHeaders}>
          {aboutUser.firstName} {aboutUser.lastName}
        </Card.Header>
        <Card.Meta style={cardMeta}>
          <Icon name='mail'/>
          <span>
            {aboutUser.owner}
          </span>
        </Card.Meta>
        <Card.Meta style={cardMeta}>
          <Icon name='building'/>
                Volunteered {aboutUser.numberOfOrgs} Organizations
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <CardHeader>About Me</CardHeader>
        {aboutUser.aboutUser}
      </Card.Content>
    </Card>
  </Container>
);

// Require a document to be passed to this component.
ProfilePageUserInformation.propTypes = {
  aboutUser: PropTypes.shape({
    owner: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    aboutUser: PropTypes.string,
    profileImage: PropTypes.string,
    numberOfOrgs: PropTypes.number,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageUserInformation);

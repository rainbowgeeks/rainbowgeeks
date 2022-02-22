import React from 'react';
import { Card, CardHeader, Container, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const gridLenght = { width: '100%' };
const paddBottom = { paddingBottom: '5px' };
const cardHeaders = { paddingBottom: '20px' };
const cardMeta = { paddingBottom: '5px' };

/** Renders the column to display user Information. See pages/ProfilePage.jsx. */
const ProfilePageUserInformation = ({ aboutUser }) => (
  <Container>
    <Card color='blue' style={gridLenght}>
      <img src={aboutUser.profileImage} alt="imges/volunteerally.jpg" width='357px' height='350px'/>
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
          <Icon name='calendar'/>
          <span className='date'>Joined in 2022</span>
        </Card.Meta>
        <Card.Meta style={cardMeta}>
          <a>
            <Icon name='building'/>
                Joined 6 Organizations
          </a>
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <CardHeader style={paddBottom}>About Me</CardHeader>
        <Card.Description>
          <Container textAlign='justified'>
              {aboutUser.aboutUser}
          </Container>
        </Card.Description>


      </Card.Content>
    </Card>
  </Container>
);

// Require a document to be passed to this component.
ProfilePageUserInformation.propTypes = {
  aboutUser: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    profileImage: PropTypes.string,
    owner: PropTypes.string,
    aboutUser: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageUserInformation);

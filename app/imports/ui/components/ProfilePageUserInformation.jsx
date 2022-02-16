import React from 'react';
import { Card, CardHeader, Container, Icon, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const gridLenght = { width: '100%' };
const cardHeaders = { paddingBottom: '20px' };
const cardMeta = { paddingBottom: '5px' };

/** Renders the column to display user Information. See pages/ProfilePage.jsx. */
const ProfilePageUserInformation = () => (
  <Container>
    <Card color='blue' style={gridLenght}>
      <Image src='/images/meteor-logo.png' wrapped ui={false} as='a' href='#/profile'/>
      <Card.Content>
        <Card.Header style={cardHeaders}>
            User-102211
        </Card.Header>
        <Card.Meta style={cardMeta}>
          <Icon name='mail'/>
          <span>
              john@foo.com
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
        <CardHeader>About Me</CardHeader>
            User-102211 is a musician and a computer
            Engineer living in Nashville.
      </Card.Content>
    </Card>
  </Container>
);

// Require a document to be passed to this component.

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageUserInformation);

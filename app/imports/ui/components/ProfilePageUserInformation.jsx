import React from 'react';
import { Card, Container, Grid, Icon, Image} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders the column to display user Information. See pages/ProfilePage.jsx. */
const ProfilePageUserInformation = () => (
  <Grid.Column>
    <Container>
      <Card color='blue'>
        <Image src='/images/meteor-logo.png' wrapped ui={false} as='a' href='#/profile'/>
        <Card.Content>
          <Card.Header>User-102211</Card.Header>
          <Card.Meta>
            <Icon name='mail'/>
            <span>
              john@foo.com
            </span>
          </Card.Meta>
          <Card.Meta>
            <Icon name='calendar'/>
            <span className='date'>Joined in 2022</span>
          </Card.Meta>
          <Card.Meta>
            <a>
              <Icon name='building'/>
                Joined 6 Organizations
            </a>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
            User-102211 is a musician and a computer
            Engineer living in Nashville.
        </Card.Content>
      </Card>
    </Container>
  </Grid.Column>
);

// Require a document to be passed to this component.

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfilePageUserInformation);

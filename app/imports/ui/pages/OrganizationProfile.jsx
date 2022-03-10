import React from 'react';
import { Container, Image, Grid, Divider, Label, Table, Button, Menu, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import NavBarDontUse from '../components/NavBarDontUse';
import { PAGE_IDS } from '../utilities/PageIDs';

const OrganizationProfile = () => (
  <Container id={PAGE_IDS.ORGANIZATION_PROFILE}>
    <NavBarDontUse/>
    <Grid columns={3} container padded='vertically'>
      <Grid.Row>
        <Grid.Column textAlign='center' width={5}>
          <Image src='/images/meteor-logo.png' size='medium' circular centered/>
          <Divider hidden/>
          <Label size='big' circular>Organization</Label>
        </Grid.Column>
        <Grid.Column width={11} verticalAlign='middle'>
          <Image fluid src={'/images/charityheader.png'}/>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column textAlign='center' width={5}>
          <Segment as='h3'>Gallery</Segment>
          <Image.Group size='small'>
            <Image src={'/images/redcross.png'}/>
            <Image src={'/images/redcross.png'}/>
            <Image src={'/images/redcross.png'}/>
            <Image src={'/images/redcross.png'}/>
            <Image src={'/images/redcross.png'}/>
            <Image src={'/images/redcross.png'}/>
          </Image.Group>
        </Grid.Column>
        <Grid.Column width={8}>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='2'>User Account</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>Username</Table.Cell>
                <Table.Cell>
                  johnd
                  <Button compact floated='right'>Edit</Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Password</Table.Cell>
                <Table.Cell>
                  ********
                  <Button compact floated='right'>Edit</Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Name</Table.Cell>
                <Table.Cell>
                  John Doe
                  <Button compact floated='right'>Edit</Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Email</Table.Cell>
                <Table.Cell>
                  johndoe@foo.com
                  <Button compact floated='right'>Edit</Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Address</Table.Cell>
                <Table.Cell>
                  1234 Dole Street
                  <Button compact floated='right'>Edit</Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='2'>Organization</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Username</Table.Cell>
                <Table.Cell>
                  volunteerally
                  <Button compact floated='right'>Edit</Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Password</Table.Cell>
                <Table.Cell>
                  ********
                  <Button compact floated='right'>Edit</Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Name</Table.Cell>
                <Table.Cell>
                  Volunteer Ally
                  <Button compact floated='right'>Edit</Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Email</Table.Cell>
                <Table.Cell>
                  org@foo.com
                  <Button compact floated='right'>Edit</Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Address</Table.Cell>
                <Table.Cell>
                  1234 Dole Street
                  <Button compact floated='right'>Edit</Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Column width={3}>
          <Menu vertical fluid>
            <Menu.Item header>Preferences</Menu.Item>
            <Menu.Item as={NavLink} exact to="/manage-opp">Manage Opportunities</Menu.Item>
            <Menu.Item>Manage Requests</Menu.Item>
            <Menu.Item>Analytics</Menu.Item>
          </Menu>
        </Grid.Column>
      </Grid.Row>
    </Grid>

  </Container>
);

export default (OrganizationProfile);

import React from 'react';
import { Container, Image, Grid, Divider, Label, Table, Button, Icon, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';

const OrganizationProfile = () => (
  <Container id={PAGE_IDS.ORGANIZATION_PROFILE}>
    <Image src={'https://volunteerally.org/wp-content/uploads/2021/08/va-default-header.png'}/>

    <Grid columns={3} celled container padded='vertically'>
      <Grid.Column textAlign='center' width={5}>
        <Image src='/images/meteor-logo.png' size='medium' circular centered/>
        <Divider hidden/>
        <Label size='big' circular>Administrator</Label>
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
      </Grid.Column>
      <Grid.Column width={3}>
        <Menu vertical fluid>
          <Menu.Item header>Site Contents</Menu.Item>
          <Menu.Item as={NavLink} exact to="/manage-user">Manage Users</Menu.Item>
          <Menu.Item as={NavLink} exact to="/manage-org">Manage Organizations</Menu.Item>
          <Menu.Item as={NavLink} exact to="/manage-opps">Manage Opportunities</Menu.Item>
          <Menu.Item>Site Preferences</Menu.Item>
          <Menu.Item>Analytics</Menu.Item>
        </Menu>
      </Grid.Column>
    </Grid>

  </Container>
);

export default (OrganizationProfile);

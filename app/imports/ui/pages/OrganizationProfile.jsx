import React from 'react';
import { Container, Image, Grid, Divider, Label, Table, Menu, Segment, Card, Header } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';

const OrganizationProfile = () => (
  <Container id={PAGE_IDS.ORGANIZATION_PROFILE}>
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
                <Table.HeaderCell colSpan='4' textAlign={'center'}>Points of Contacts</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>John Foo</Table.Cell>
                <Table.Cell>john@foo.com</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>John Foo</Table.Cell>
                <Table.Cell>john@foo.com</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>John Foo</Table.Cell>
                <Table.Cell>john@foo.com</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>John Foo</Table.Cell>
                <Table.Cell>john@foo.com</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Card.Group stackable centered itemsPerRow={3}>
            <Card>
              <Card.Content>
                <Card.Header>
                  <Header>Opp title</Header>
                </Card.Header>
                <Card.Meta>
                  <Header>Opp Date</Header>
                </Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <Card.Description>
                  <Header icon='user' content={'Point of Contact'}/>
                </Card.Description>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content>
                <Card.Header>
                  <Header>Opp title</Header>
                </Card.Header>
                <Card.Meta>
                  <Header>Opp Date</Header>
                </Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <Card.Description>
                  <Header icon='user' content={'Point of Contact'}/>
                </Card.Description>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content>
                <Card.Header>
                  <Header>Opp title</Header>
                </Card.Header>
                <Card.Meta>
                  <Header>Opp Date</Header>
                </Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <Card.Description>
                  <Header icon='user' content={'Point of Contact'}/>
                </Card.Description>
              </Card.Content>
            </Card>
          </Card.Group>
        </Grid.Column>
        <Grid.Column width={3}>
          <Menu vertical fluid>
            <Menu.Item as={NavLink} activeClassName="active" exact to="/manage-hours" key="manage-hours">
              Manage Hours
            </Menu.Item>
            <Menu.Item as={NavLink} exact to="/manage-opp">Manage Opportunities</Menu.Item>
            <Menu.Item as={NavLink} exact to={'/confirm-volunteer'}>Manage Requests</Menu.Item>
            <Menu.Item>Analytics</Menu.Item>
          </Menu>
        </Grid.Column>
      </Grid.Row>
    </Grid>

  </Container>
);

export default (OrganizationProfile);

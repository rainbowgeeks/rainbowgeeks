import React from 'react';
import { Button, Container, Header, Input, List, Card, Dropdown } from 'semantic-ui-react';

const OrganizationHoursPage = () => (
  <Container>
    <Header as="h1" textAlign="center">Organization Hours Page</Header>
    <Input fluid placeholder="Search Profiles..."/>
    <List horizontal style={{ paddingBottom: '20px' }}>
      <List.Item>
        <Header as='h4' style={{ paddingTop: '8px', width: '70px' }}>Filter By: </Header>
      </List.Item>
      <List.Item>
        <Dropdown text='Point Of Contact' pointing className='link item' button>
          <Dropdown.Menu>
            <Dropdown.Item>temp1@foo.com</Dropdown.Item>
            <Dropdown.Item>temp2@foo.com</Dropdown.Item>
            <Dropdown.Item>temp3@foo.com</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </List.Item>
      <List.Item>
        <Dropdown text='Date' pointing className='link item' button>
          <Dropdown.Menu>
            <Dropdown.Item>temp1@foo.com</Dropdown.Item>
            <Dropdown.Item>temp2@foo.com</Dropdown.Item>
            <Dropdown.Item>temp3@foo.com</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </List.Item>
      <List.Item style={{ marginLeft: '480px' }}>
        <Header as='h4' style={{ paddingTop: '8px' }}>Sort By: </Header>
      </List.Item>
      <List.Item>
        <Button compact size='small' style={{ margin: '1em .8em 0em 1em', padding: '.9em 1em .9em' }}>A-Z</Button>
      </List.Item>
      <List.Item>
        <Button compact size='small' style={{ margin: '1em .8em 0em 1m', padding: '.9em 1em .9em' }}>Category</Button>
      </List.Item>
    </List>
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
  </Container>
);

export default (OrganizationHoursPage);

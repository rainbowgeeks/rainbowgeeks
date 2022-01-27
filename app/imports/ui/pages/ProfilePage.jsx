import React from 'react';
import {
  Container,
  Header,
  Loader,
  Card,
  Image,
  Icon,
  Feed,
  Grid,
  Segment,
  List,
  Divider,
  Button,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/StuffCollection';
import StuffItem from '../components/StuffItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ProfilePage = ({ ready, stuffs }) => ((ready) ? (
  <Container id={PAGE_IDS.PROFILE_PAGE}>
    <Grid columns={'two'}>
      <Grid.Row>
        <Grid.Column>
          <Header as="h2" textAlign="right">PROFILE PAGE</Header>
        </Grid.Column>
        <Grid.Column>
          <Container textAlign='right'>
            <Button icon>
              <Icon name='setting'/>
            </Button>

          </Container>
        </Grid.Column>
      </Grid.Row>

    </Grid>

    <Container>
      <Divider/>
      <Grid columns={'three'} divided>
        <Grid.Row>
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
                      <Icon name='building' />
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

          <Grid.Column>
            <Segment>
              <Header as="h4">
                <Container textAlign='center'>
                  Interest
                </Container>
              </Header>
              <Divider section/>
                Interest 1, Interest 2, Interest 3, Interest 4, Interest 5
            </Segment>
            <Segment>
              <Header as="h4">
                <Container textAlign='center'>
                  Special Interest
                </Container>
              </Header>
              <Divider section/>
              Special Interest 1, Special Interest 2, Special Interest 3, Special Interest 4, Special Interest 5
            </Segment>
            <Segment>
              <Header as="h4">
                <Container textAlign='center'>
                  Environmental Preference
                </Container>
              </Header>
              <Divider section/>
              Environmental Preference 1, Environmental Preference 2
            </Segment>
            <Segment>
              <Header as="h4">
                <Container textAlign={'center'}>
                  Availability
                </Container>
              </Header>
              <Divider section/>
               Monday Noon, Tuesday noon , Saturday
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment padded='very'>
              <Container textAlign={'center'}>
                <Header as='h2'>
                  Total Hours 20
                </Header>
              </Container>
            </Segment>
            <Divider section/>
            <Header as='h3'> List of Organizations</Header>
            <List>
              <List.Item>
                <Image avatar src='/images/meteor-logo.png' />
                <List.Content>
                  <List.Header as='a'>Organization 1</List.Header>
                  <List.Description>
                    Last seen watching{' '}
                    <a>
                      <b>Arrested Development</b>
                    </a>{' '}
                    just now.
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <Image avatar src='/images/meteor-logo.png' />
                <List.Content>
                  <List.Header as='a'>Organization 2</List.Header>
                  <List.Description>
                    Last seen watching{' '}
                    <a>
                      <b>Bob's Burgers</b>
                    </a>{' '}
                    10 hours ago.
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <Image avatar src='/images/meteor-logo.png' />
                <List.Content>
                  <List.Header as='a'>Organization 3</List.Header>
                  <List.Description>
                    Last seen watching{' '}
                    <a>
                      <b>The Godfather Part 2</b>
                    </a>{' '}
                    yesterday.
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <Image avatar src='/images/meteor-logo.png' />
                <List.Content>
                  <List.Header as='a'>Organization 5</List.Header>
                  <List.Description>
                    Last seen watching{' '}
                    <a>
                      <b>Twin Peaks</b>
                    </a>{' '}
                    3 days ago.
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <Image avatar src='/images/meteor-logo.png' />
                <List.Content>
                  <List.Header as='a'>Organization 6</List.Header>
                  <List.Description>Has not watched anything recently</List.Description>
                </List.Content>
              </List.Item>
            </List>
            <Divider section/>
            <Container>
              <Card>
                <Card.Content>
                  <Card.Header>Recent Activity</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Feed>
                    <Feed.Event>
                      <Feed.Label image='/images/meteor-logo.png' />
                      <Feed.Content>
                        <Feed.Date content='1 day ago' />
                        <Feed.Summary>
                          You added <a>Jenny Hess</a> to your <a>coworker</a> group.
                        </Feed.Summary>
                      </Feed.Content>
                    </Feed.Event>

                    <Feed.Event>
                      <Feed.Label image='/images/meteor-logo.png' />
                      <Feed.Content>
                        <Feed.Date content='3 days ago' />
                        <Feed.Summary>
                          You added <a>Molly Malone</a> as a friend.
                        </Feed.Summary>
                      </Feed.Content>
                    </Feed.Event>

                    <Feed.Event>
                      <Feed.Label image='/images/meteor-logo.png' />
                      <Feed.Content>
                        <Feed.Date content='4 days ago' />
                        <Feed.Summary>
                          You added <a>Elliot Baker</a> to your <a>musicians</a> group.
                        </Feed.Summary>
                      </Feed.Content>
                    </Feed.Event>
                  </Feed>
                </Card.Content>
              </Card>
            </Container>
          </Grid.Column>

        </Grid.Row>
      </Grid>
    </Container>
  </Container>
) : <Loader active>Loading Profile</Loader>);

// Require an array of Stuff documents in the props.
ProfilePage.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Stuffs.subscribeStuff();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const stuffs = Stuffs.find({}, { sort: { name: 1 } }).fetch();
  return {
    stuffs,
    ready,
  };
})(ProfilePage);

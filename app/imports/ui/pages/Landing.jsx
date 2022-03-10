import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Image } from 'semantic-ui-react';
import Footer from '../components/Footer';
import { PAGE_IDS } from '../utilities/PageIDs';

/** A simple static component to render some text for the landing page. */
const Landing = () => (
  <div id={PAGE_IDS.LANDING}>
    <div className="grad-background" fluid>
      <Container>
        <Image className="logo-center" src='https://cdn.discordapp.com/attachments/441780757967405067/943848010306183208/VAlogo.png'></Image>
        <h1 className="h1">
          A better way to volunteer.
          <h2 className="h2">
            We connect passionate volunteers with charitable organizations in order to build community.
            Let us help you easily find service opportunities for organizations in your area of interest.
          </h2>
        </h1>
      </Container>
    </div>
    <Grid className="landingBot" columns="2">
      <h1 className="h1Bot">Dozens of Opportunities for Organizations and Volunteers</h1>
      <Grid.Column>
        <Container fluid>
          <h2 className="h2Bot">
            Take a look at the various organizations Volunteer Ally works with, each with unique volunteer opportunities offering various dates, times, and locations.
          </h2>
          <p className="desc">
            Volunteer Ally is a non-profit organization match system designed to pair organizations with volunteers. We partner with various organizations in need of passionate volunteers.
          </p>
          <p className="desc">
            Becoming a user is required to ensure committed reliable volunteers for our organizations.
          </p>
          <Link to="/signup">
            <Button className={'ui footer button bot'} size={'massive'}>Join Now!</Button>
          </Link>
        </Container>
      </Grid.Column>
      <Grid.Column>
        <Image src='https://cdn.discordapp.com/attachments/441780757967405067/943854340714676284/unknown.png'></Image>
      </Grid.Column>
    </Grid>
    <Container textAlign="center" fluid>
      <Link to="/org-library">
        <Button className={'ui footer button'} size={'massive'}>Check Out Our Latest Opportunities</Button>
      </Link>
    </Container>
    <Footer/>
  </div>
);

export default Landing;

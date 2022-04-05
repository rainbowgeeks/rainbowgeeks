import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Image } from 'semantic-ui-react';
import Footer from '../components/Footer';
import { PAGE_IDS } from '../utilities/PageIDs';

/** A simple static component to render some text for the landing page. */
const Landing = () => (
  <div id={PAGE_IDS.LANDING}>
    <div className="grad-background" fluid="true">
      <Container>
        <Image className="logo-center" src='https://cdn.discordapp.com/attachments/441780757967405067/943848010306183208/VAlogo.png'></Image>
        <h1 className="h1">
          A better way to volunteer.
        </h1>
        <h2 className="h2">
            We connect passionate volunteers with charitable organizations in order to build community.
            Let us help you easily find service opportunities for organizations in your area of interest.
        </h2>
      </Container>
    </div>
    <Container fluid>
      <Grid container spacing={2} >
        <Grid item="true" xs={12}>
          <h1 className="h1Bot" >Dozens of Opportunities for Organizations and Volunteers</h1>
        </Grid>
        <Grid item="true" sm={6}>
          <Container fluid>
            <h2 className="h2Bot">
              <p>Take a look at the various<br/>
            organizations Volunteer Ally<br/>
            works with, each with unique<br/>
            volunteer opportunities offering<br/>
              various dates, times, and<br/>
              locations.
              </p>
            </h2>
            <p className="desc">
            Volunteer Ally is a non-profit organization <br/>
            match system designed to pair <br/>
            organizations with volunteers. We partner <br/>
            with various organizations in need of <br/>
            passionate volunteers.
            </p>
            <p className="desc">
            Becoming a user is required to ensure <br/>
            committed reliable volunteers for our <br/>
            organizations.
            </p>
            <Link to="/signup">
              <Button className={'ui footer button bot'} size={'massive'}>Join Now!</Button>
            </Link>
          </Container>
        </Grid>
        <Grid item="true" sm={1}>
          <Image src='https://cdn.discordapp.com/attachments/441780757967405067/943854340714676284/unknown.png'></Image>
        </Grid>
      </Grid>
    </Container>
    <Container textAlign="center" fluid>
      <Link to="/org-library">
        <Button className={'ui footer button bot'} size={'massive'}>Check Out Our Latest Opportunities</Button>
      </Link>
    </Container>
    <Footer/>
  </div>
);

export default Landing;

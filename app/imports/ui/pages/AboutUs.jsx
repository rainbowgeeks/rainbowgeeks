import React from 'react';
import { Container } from 'semantic-ui-react';
import Footer from '../components/Footer';

import { PAGE_IDS } from '../utilities/PageIDs';

/** A simple static component to render some text for the landing page. */
const Landing = () => (
  <div id={PAGE_IDS.ABOUT_US}>
    <div className="about">
      <Container textAlign="center">
        <h1 className="h1About" >About VolunteerAlly</h1>
      </Container>
    </div>
    <Footer/>
  </div>
);

export default Landing;

import React from 'react';
import { Container, Item } from 'semantic-ui-react';
import Footer from '../components/Footer';

/** A simple static component to render some text for the landing page. */
const Landing = () => (
  <div>
    <div className="grad-background">
      <Container>
        <Item className="h1">
          A better way to volunteer.
          <Item className="h2">
            We connect passionate volunteers with charitable organizations in order to build community. Let us help you easily find service opportunities for organizations in your area of interest.
          </Item>
        </Item>
      </Container>
    </div>
    <Footer/>
  </div>
);

export default Landing;

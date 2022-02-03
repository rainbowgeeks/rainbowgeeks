import React from 'react';
import { Image, Container, Header, Item } from 'semantic-ui-react';
import Footer from '../components/Footer';

/** A simple static component to render some text for the landing page. */
const Landing = () => (
  <div>
    <div className="grad-background">
      <Container>
        <Image src='https://volunteerally.org/wp-content/uploads/elementor/thumbs/VA-logo-v5-web-white@2x-pbjpxctj7h8ni6m613deejchpwnvgwi3t9onxij5ts.png' className="logo-center"/>
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

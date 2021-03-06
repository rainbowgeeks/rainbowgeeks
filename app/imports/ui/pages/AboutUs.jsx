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
    <div>
      <Container>
        <h1 className="h2About">
        An Easier Way To Volunteer.
        </h1>
        <h2 className="h3About">
          <p>
          VolunteerAlly is a non-profit organization designed to help pair volunteers with organizations in need of service. On our site you can find numerous organizations and their volunteer<br/>
        opportunities all in one place. Once a user, you will have access to sign up for the various volunteer opportunities, from one-time opportunities to flexible/reoccurring opportunities.<br/>
          VolunteerAlly is designed to make volunteering easy.
          </p>
        </h2>
        <h1 className="h2About">
        Why VolunteerAlly?
        </h1>
        <h2 className="h3About">
          <p>
          Volunteer opportunities are vitally important to the wellbeing of a community. VolunteerAlly makes it easy for volunteers to find organizations in need, and for organizations to find<br/>
        qualified volunteers.
          </p>
          <p>VolunteerAlly makes it simple to give back.</p>
        </h2>
        <h1 className="h2About">
        VolunteerAlly Team
        </h1>
        <h2 className="h3About">

        Board Chair: Leslie Kobayashi<br/>
        Board Vice-Chair: Ronald Sakamoto<br/>
        President: C. Scott Wo<br/>
        Director: Malindi Brand<br/><br/>

        Executive Director: Nancy Wo<br/>
        Webmaster: Chase Conching<br/>
        Secretary: Patricia McCarthy<br/>
        Treasurer: Jodi Ching<br/><br/>

        Founder: Allyson Wo<br/>

        </h2>
      </Container>
    </div>
    <Footer/>
  </div>
);

export default Landing;

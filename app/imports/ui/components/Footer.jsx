import React from 'react';
import { Button } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: '15px' };
  return (
    <footer>
      <div class={'footer'}>
        <div id={'footerPic'}>
          <h1>Ready to Get Started?</h1>
          <Button>Get Started</Button>
        </div>
      </div>

      <div style={divStyle} className="ui center aligned container">
        <p>
        ©2021-2022 VolunteerAlly. All rights reserved.
          <a href="https://volunteerally.org/privacy-policy"> Privacy Policy.</a>
          <a href="https://volunteerally.org/privacy-policy"> Terms & Conditions</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

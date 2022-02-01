import React from 'react';
import { Button } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: '15px' };
  return (
    <footer>
      <div className={'footer'}>
        <div id={'footerPic'}>
          <div className={'ui equal width grid'}>
            <div className="column"/>
            <div className="column">
              <h1 id={'footerTxt'}>Ready to Get Started?</h1>
              <Button>Get Started</Button>
            </div>
            <div className="column"/>
          </div>
        </div>
      </div>
      <div style={divStyle} className="ui equal width grid">
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

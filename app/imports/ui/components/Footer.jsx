import React from 'react';
import { Button, Grid } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { marginTop: '50px', textAlign: 'center'};
  return (
    <footer>
      <div className={'footer'}>
        <div id={'footerPic'}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}/>
              <Grid.Column width={10}>
                <h1 id={'footerTxt1'}>Ready to Get Started?</h1>
                <p id={'footerTxt2'}>Sign up now as a volunteer or organization</p>

              </Grid.Column>
              <Grid.Column width={3}/>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Button size={'huge'}>Get Started</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
      <div style={divStyle} >
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

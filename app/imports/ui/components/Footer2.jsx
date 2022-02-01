import React from 'react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer2 = () => {
  const divStyle = { marginTop: '50px', textAlign: 'center', paddingBottom: '30px' };
  return (
    <div style={divStyle} >
      <p>
            ©2021-2022 VolunteerAlly. All rights reserved.
        <a href="https://volunteerally.org/privacy-policy"> Privacy Policy.</a>
        <a href="https://volunteerally.org/privacy-policy"> Terms & Conditions</a>
      </p>
    </div>
  );
};

export default Footer2;

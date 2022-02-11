import React from 'react';
import { Container } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

const picStyle = { width: '100%', height: '100%' };

const OrganizationProfile = () => (
  <Container id={PAGE_IDS.PROFILE_PAGE}>
    <div>
      <img style={picStyle} src={'https://volunteerally.org/wp-content/uploads/2021/08/va-default-header.png'}/>
    </div>
  </Container>
);

export default (OrganizationProfile);

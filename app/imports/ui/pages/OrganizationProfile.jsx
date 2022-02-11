import React from 'react';
import { Container } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

const picStyle = { width: '100%', height: '100%' };

const OrganizationProfile = () => (
  <Container id={PAGE_IDS.ORGANIZATION_PROFILE}>
    <div style={{ position: 'absolute', zIndex: '2', display: 'flex' }} className={'ui container'}>
      <img style={picStyle} src={'https://volunteerally.org/wp-content/uploads/2021/08/va-default-header.png'}/>
    </div>
    <div>
      <img style={{ position: 'absolute', zIndex: '3' }} id={'orgLogo'} src={'https://volunteerally.org/wp-content/uploads/2021/08/VA-logo-circle-v5.svg'} width='15%'/>
    </div>
    <div style={{ zIndex: '1', position: 'absolute', backgroundColor: '#eee' }} className={'ui container'} id={'greyBack'}/>
  </Container>
);

export default (OrganizationProfile);

import React from 'react';
import { Container, Image, Grid } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

const OrganizationProfile = () => (
  <Container id={PAGE_IDS.ORGANIZATION_PROFILE}>
    <Image src={'https://volunteerally.org/wp-content/uploads/2021/08/va-default-header.png'}/>

    <Grid columns={3} celled container>

    </Grid>

  </Container>
);

export default (OrganizationProfile);

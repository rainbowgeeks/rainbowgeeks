import React from 'react';
import { Card, GridRow, Label } from 'semantic-ui-react';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';

const MakeCard = ({ listOpportunities }) => (
  <Card fluid href={`#/event/${listOpportunities._id}`}>
    <Card.Content style={{
      backgroundImage: `url("${listOpportunities.cover}")`,
    }}>
      <Card.Header className={'card-content-spacing'}>Date: {listOpportunities.date}</Card.Header>
      <Card.Header>{listOpportunities.title}</Card.Header>
      <Card.Description className={'card-content-spacing'}>
        Address: {listOpportunities.location}
      </Card.Description>
      <Card.Meta>
        <GridRow>
          Age: {_.map(listOpportunities.age, (age, index) => <Label key={index} size='tiny' color='teal'>{age}</Label>)}
        </GridRow>
        <GridRow>
          Environment: {_.map(listOpportunities.environment, (environment, index) => <Label key={index} size='tiny' color='teal'>{environment}</Label>)}
        </GridRow>
      </Card.Meta>
    </Card.Content>
    <Card.Content fluid='true' extra>
      <br/>
      <br/>
    </Card.Content>
  </Card>
);

MakeCard.propTypes = {
  listOpportunities: PropTypes.object.isRequired,
};
function getOpp(id, opp) {
  return opp.filter(o => o._id === id);
}

function filterOpp(opp, age, env) {
  const ageID = age ? age.map(a => OpportunitiesAges.find({ age: a }).fetch()) : {};
  const envID = env ? env.map(e => OpportunitiesEnvs.find({ environment: e }).fetch()) : {};
  const getIDS = _.flatten(ageID.concat(envID));
  const IDS = _.pluck(getIDS, 'oppID').filter(ID => ID !== ('' || undefined));
  const opportunity = _.uniq(IDS);
  const makeOpportunities = opportunity.map(o => getOpp(o, opp));
  return _.flatten(makeOpportunities);
}

/** Renders a single row in the List Stuff table. See pages/BrowseOpportunity.jsx. */
const Opportunity = ({ opportunity, filter }) => {
  const { age, environment } = filter;
  const ageLength = age ? age.length : 0;
  const envLength = environment ? environment.length : 0;
  const makeOpportunities = (ageLength >= 1 || envLength >= 1) ? filterOpp(opportunity, age, environment) : opportunity;

  return (
    <Card.Group className={'make-scrollable'} centered>
      {makeOpportunities.map(o => <MakeCard key={o._id} listOpportunities={o}/>)}
    </Card.Group>
  );
};

// Require a document to be passed to this component.
Opportunity.propTypes = {
  filter: PropTypes.object.isRequired,
  opportunity: PropTypes.array.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Opportunity);

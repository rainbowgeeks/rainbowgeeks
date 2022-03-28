import React, { useState } from 'react';
import { Container, Grid, Header, Loader, Tab, Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { Categories } from '../../api/category/CategoryCollection';
import { OpportunitiesAges } from '../../api/opportunity/OpportunitiesAgeCollection';
import { OpportunitiesEnvs } from '../../api/opportunity/OpportunitiesEnvCollection';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import { OrganizationPocs } from '../../api/organization/OrganizationPocCollection';
import Footer from '../components/Footer';
import CategoryOpp from '../components/CategoryOpp';
import SearchOpp from '../components/SearchOpp';
import Opportunity from '../components/Opportunity';
import GoogleMap from '../components/GoogleMap';

//
function getOpportunities(o) {
  const { _id: oppID } = o;
  const age = _.pluck(OpportunitiesAges.find({ oppID }).fetch(), 'age');
  const environment = _.pluck(OpportunitiesEnvs.find({ oppID }).fetch(), 'environment');
  const category = _.pluck(OpportunitiesCats.find({ oppID }).fetch(), 'category');
  return _.extend({}, o, { age, environment, category });
}

//
function getCategories(c) {
  const getOppID = _.pluck(OpportunitiesCats.find({ category: c.category }).fetch(), 'oppID');
  const icon = Categories.getIcon(c.category);
  const getTotal = { total: getOppID };
  return _.extend({}, c, icon, getTotal);
}
//
function filterByAge(data, keyword) {
  const temp = data.filter((da) => {
    if (da.age.some(d => keyword.includes(d))) return true;
    return false;
  });
  return temp;
}
//
function filterByEnv(data, keyword) {
  const temp = data.filter((da) => {
    if (da.environment.some(d => keyword.includes(d))) return true;
    return false;
  });
  return temp;
}
//
//
function searchByTorO(data, keyword) {
  const temp = (keyword === '') ? data : data.filter((d) => {
    if (d.title.toLowerCase().includes(keyword.toLowerCase())) return true;
    return false;
  });
  return temp;
}
//
const FilterOpportunities = ({ ready, opportunities, categories }) => {
  //
  const makeOpportunities = opportunities.map(o => getOpportunities(o));
  const makeCategories = categories.map(c => getCategories(c));
  //
  // const [condition, setCondition] = useState(false);
  const [key, setKey] = useState('');
  const [filterAge, setFilterAge] = useState([]);
  const [filterEnv, setFilterEnv] = useState([]);
  const [filterCat, setFilterCat] = useState([]);
  //
  const panes = [
    {
      menuItem: 'Search',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane>
        <SearchOpp setKey={setKey} setAge={setFilterAge} setEnv={setFilterEnv}/>
      </Tab.Pane>,
    },
    {
      menuItem: 'Category',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane>
        {makeCategories.map(mC => <CategoryOpp key={mC._id} category={mC} setCat={setFilterCat}/>)}
      </Tab.Pane>,
    },
  ];
  //
  const gridHeigth = { paddingRight: '50px', paddingLeft: '50px' };
  const data = (setKey.length > 0) ? searchByTorO(makeOpportunities, key) : makeOpportunities;
  const dataByAge = (filterAge.length <= 0) ? data : filterByAge(data, filterAge);
  const dataByEnv = (filterEnv.length <= 0) ? dataByAge : filterByEnv(dataByAge, filterAge);
  console.log(dataByEnv);
  //
  return ((ready) ? (
    <Container fluid style={gridHeigth}>
      <Header as={'h1'} textAlign={'center'} content={'Browse Opportunities'}/>
      <Grid celled columns={3}>
        <Grid.Column width={4}>
          <Header
            as="h2" textAlign="center"
            content="Volunteer Opportunities"
            subheader="Powered by VolunteerAlly"
          />
          <Tab
            menu={{
              pointing: true, secondary: true, tabular: true,
              style: { display: 'flex', justifyContent: 'center' },
            }}
            className={'make-scrollable'} panes={panes}
          />
        </Grid.Column>
        <Grid.Column width={5}>
          <Card.Group className={'make-scrollable'}>
            {dataByEnv.map(opportunity => <Opportunity key={opportunity._id} opportunity={opportunity}/>)}
          </Card.Group>
        </Grid.Column>
        <Grid.Column width={7}>
          <div>
            <GoogleMap/>
          </div>
        </Grid.Column>
      </Grid>
      <Footer/>
    </Container>
  ) : <Loader active>Getting Data</Loader>);
};
// Require an array of Stuff documents in the props.
FilterOpportunities.propTypes = {
  categories: PropTypes.array.isRequired,
  opportunities: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};
//
export default withTracker(() => {
  // Get access to organization poc documents.
  const sub7 = OrganizationPocs.subscribeOrganizationPoc();
  // Get access to opportunity documents.
  const sub1 = Opportunities.subscribeOpportunity();
  // Get access to oppAge documents.
  const sub2 = OpportunitiesAges.subscribeOpportunitiesAge();
  // Get access to oppEnvironment documents.
  const sub3 = OpportunitiesEnvs.subscribeOpportunitiesEnvironment();
  // Get access to opportunity opp Cat documents.
  const sub4 = OpportunitiesCats.subscribeOpportunitiesCategory();
  // Get access to organization documents.
  const sub5 = Organizations.subscribeOrganization();
  // Get access to category documents.
  const sub8 = Categories.subscribeCategory();
  // Get all the categories
  const categories = Categories.find({}).fetch();
  // Get all the opportunities
  const opportunities = Opportunities.find({}).fetch();
  // Determine if the subscription is ready
  const ready = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub7.ready() && sub8.ready();
  return {
    categories,
    opportunities,
    ready,
  };
})(FilterOpportunities);

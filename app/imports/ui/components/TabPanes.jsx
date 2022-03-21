import React, { useState } from 'react';
import { Grid, Header, Tab, Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import CategoryOpp from './CategoryOpp';
import SearchOpp from './SearchOpp';
import Opportunity from './Opportunity';
import GoogleMap from './GoogleMap';

/** Renders a Tab for filter opportunities. */
const TabPanes = ({ opportunities, categories }) => {

  const [data, setData] = useState([]);
  const getCategories = (category) => {
    const cat = category;
    const getOppID = _.pluck(OpportunitiesCats.find({ category: cat.name }).fetch(), 'oppID');
    const getTotal = { total: getOppID };
    return _.extend({}, category, getTotal);
  };
  const makeCategories = categories.map(category => getCategories(category));
  const panes = [
    {
      menuItem: 'Search',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane>
        <SearchOpp opportunities={opportunities} getOpp={setData}/>
      </Tab.Pane>,
    },
    {
      menuItem: 'Category',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane>
        {makeCategories.map(category => <CategoryOpp key={category.index} category={category}/>)}
      </Tab.Pane>,
    },
  ];

  return (
    <Grid celled columns={3}>
      <Grid.Column width={4}>
        <Header
          as="h2" textAlign="center"
          content="Volunteer Opportunities"
          subheader="Powered by VolunteerAlly"
        />
        <Tab
          menu={{
            secondary: true,
            tabular: true,
            attached: false,
            style: {
              display: 'flex',
              justifyContent: 'center',
            },
          }}
          className={'make-scrollable'}
          panes={panes}
        />
      </Grid.Column>
      <Grid.Column width={5}>
        <Card.Group className={'make-scrollable'} centered>
          {(data.length > 0) ? data.map(d => <Opportunity key={d._id} opportunity={d}/>) :
            opportunities.map(o => <Opportunity key={o._id} opportunity={o}/>)}
        </Card.Group>
      </Grid.Column>
      <Grid.Column width={7}>
        <div>
          <GoogleMap/>
        </div>
      </Grid.Column>
    </Grid>

  );
};

// Require a document to be passed to this component
TabPanes.propTypes = {
  opportunities: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
};

// Wrap this component in withRouter.
export default withRouter(TabPanes);

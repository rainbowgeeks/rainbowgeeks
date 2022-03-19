import React from 'react';
import { Container, Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import { OpportunitiesCats } from '../../api/opportunity/OpportunitiesCatCollection';
import CategoryOpp from './CategoryOpp';
import SearchOpp from './SearchOpp';

/** Renders a Tab for filter opportunities. */
const TabPanes = ({ opportunities, categories }) => {

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
        <SearchOpp opportunities={opportunities}/>
      </Tab.Pane>,
    },
    {
      menuItem: 'Category',
      // eslint-disable-next-line react/display-name
      render: () => <Tab.Pane>
        {makeCategories.map(category => <CategoryOpp key={category.index} categories={category}/>)}
      </Tab.Pane>,
    },
  ];

  return (
    <Container>
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
    </Container>
  );
};

// Require a document to be passed to this component
TabPanes.propTypes = {
  opportunities: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
};

// Wrap this component in withRouter.
export default withRouter(TabPanes);

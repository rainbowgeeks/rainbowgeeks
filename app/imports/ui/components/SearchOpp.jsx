import React, { useEffect, useRef, useReducer, useCallback } from 'react';
import { Search, Label, Segment, Header, Container } from 'semantic-ui-react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const initialState = {
  loading: false,
  results: [],
  value: '',
};

function reducer(state, action) {
  switch (action.type) {
  case 'CLEAN_QUERY':
    return initialState;
  case 'START_SEARCH':
    console.log(action.query);
    return { ...state, loading: true, value: action.query };
  case 'FINISH_SEARCH':
    console.log(action.results);
    return { ...state, loading: false, results: action.results };
  case 'UPDATE_SELECTION':
    console.log(action.selection);
    return { ...state, value: action.selection };

  default:
    throw new Error();
  }
}

const resultRenderer = ({ title }) => <Label content={title}/>;
/** Renders the search bar for TabPanes.jsx. */
const SearchOpp = ({ opportunities }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, results, value } = state;

  const timeoutRef = useRef();
  const handleSearchChange = useCallback((e, data) => {
    clearTimeout(timeoutRef.current);
    dispatch({ type: 'START_SEARCH', query: data.value });

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' });
        return;
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i');
      const isMatch = (result) => re.test(result.title);

      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(opportunities, isMatch),
      });
    }, 300);
  }, []);
  useEffect(() => () => {
    clearTimeout(timeoutRef.current);
  }, []);
  return (
    <Container>
      <Search
        input={{ fluid: true }}
        loading={loading}
        onResultSelect={(e, data) => dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })}
        onSearchChange={handleSearchChange}
        resultRenderer={resultRenderer}
        results={console.log(results)}
        value={value}
      />
    </Container>
  );
};

SearchOpp.propTypes = {
  opportunities: PropTypes.array.isRequired,
};

// Wrap the component in withRouter.
export default withRouter(SearchOpp);

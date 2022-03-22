import React, { useEffect, useRef, useReducer, useCallback } from 'react';
import { Input } from 'semantic-ui-react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import TabPanes from './TabPanes';

/** Renders the search bar for TabPanes.jsx. */
const SearchOpp = ({ opportunities, getOpp }) => {
  const initialState = {
    loading: false,
    results: [opportunities],
    value: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
    case 'CLEAN_QUERY':
      getOpp(opportunities);
      return initialState;
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query };
    case 'FINISH_SEARCH':
      getOpp(action.results);
      return { ...state, loading: false, results: action.results };
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection };

    default:
      throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, value } = state;

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
    <Input fluid icon='search'
      loading={loading}
      onChange={handleSearchChange}
      value={value}
    />
  );
};

SearchOpp.propTypes = {
  getOpp: PropTypes.func,
  opportunities: PropTypes.array.isRequired,
};

// Wrap the component in withRouter.
export default withRouter(SearchOpp);

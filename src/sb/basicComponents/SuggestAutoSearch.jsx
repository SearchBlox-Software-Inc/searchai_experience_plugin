import PropTypes from 'prop-types';
import queryString from 'query-string';

import useSearchStore from '../../stores/searchStore';
import { getInitialUrlParameters, getResults } from '../common/SbCore';


// ==========================================================================================


function SuggestAutoSearch() {

   const setSuggestSearch = useSearchStore(state => state.setSuggestSearch);
   const resultQuery = useSearchStore(state => state.response?.resultInfo?.query || '');
   const actualQuery = useSearchStore(state => state.suggestSearch?.actualQuery || '');

   const safeResultQuery = resultQuery?.replace(/\\/g, '') || '';
   const safeActualQuery = actualQuery?.replace(/\\/g, '') || '';


   // ------------------------------


   function suggestionClick(e) {
      e.preventDefault();

      setSuggestSearch({ actualQuery: '', suggestedQuery: '' });

      const urlParameters = { ...queryString.parse(window.location.search) };
      urlParameters.query = resultQuery;

      const initialParams = getInitialUrlParameters(urlParameters.query);

      initialParams.page = 1;
      getResults(initialParams);
   }


   // ------------------------------


   return (
      <p style={{ color: '#a30300' }}>
         Showing results for <a href={`?${queryString.stringify(urlParameters)}`} style={{ color: '#7639e2' }} onClick={suggestionClick} title="Suggested query" dangerouslySetInnerHTML={{ __html: safeResultQuery }} /> instead of <span style={{ color: '#a30300' }}>{safeActualQuery}</span>.
      </p>
   );
}


export default SuggestAutoSearch;


SuggestAutoSearch.propTypes = {
   resultQuery: PropTypes.string,
   actualQuery: PropTypes.string,
   setSuggestSearch: PropTypes.func
};
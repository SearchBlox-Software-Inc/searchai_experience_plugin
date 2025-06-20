import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { pluginDomain, topQueryFields } from '../common/Defaults';

import useSmartFAQsStore from '../../stores/smartFAQsStore';
import useSearchStore from '../../stores/searchStore';


import styles from './topQueries.module.scss';


// ------------------------------


function TopQuerySuggestions() {

   const [topQueries, setTopQueries] = useState([]);


   const triggerSearch = useSearchStore(state => state.triggerSearch);
   const setSelectedSmartFAQ = useSmartFAQsStore(state => state.setSelectedFAQ);


   // ------------------------------


   useEffect(() => {
      axios({
         method: 'post',
         url: pluginDomain + '/rest/v2/api/query/topquery',
         data: {
            'apikey': topQueryFields.apikey,
            'col': topQueryFields.col,
            'limit': topQueryFields.limit
         },
         headers: { 'Content-Type': 'application/json' }
      })
         .then(response => {
            if (response.data && Object.keys(response.data).length) {
               setTopQueries(Object.keys(response.data));
            }
         })
         .catch(error => {
            console.error('Error fetching top queries:', error);
         });
   }, []);


   // ------------------------------


   function searchForTopQuery(topQuery) {
      setSelectedSmartFAQ({});
      triggerSearch(topQuery);
   }


   // ------------------------------


   if (!topQueries || !topQueries.length) {
      return null;
   }


   return (
      <ul className={styles.topQueries}>
         {
            topQueries.map((topQuery, i) => (
               <li key={`top-query-${i}`}>
                  <button onClick={() => searchForTopQuery(topQuery)}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                     {topQuery}
                  </button>
               </li>
            ))
         }
      </ul>
   );
}


export default TopQuerySuggestions;


TopQuerySuggestions.propTypes = {
   triggerSearch: PropTypes.func,
   resetSelectedSmartFAQ: PropTypes.func,
};
import { useEffect, useState } from 'react';

import useSearchStore from '../../stores/searchStore';
import { getSuggestClickCount, getTrendingData } from '../common/SbCore';
import useSmartFAQsStore from './../../stores/smartFAQsStore';


// ==========================================================================================


function TrendingQueries() {
   
   const [trendingQueries, setTrendingQueries] = useState([]);


   // ------------------------------


   const setSelectedSmartFAQ = useSmartFAQsStore(state => state.setSelectedFAQ);
   const triggerSearch = useSearchStore(state => state.triggerSearch);


   // ------------------------------


   useEffect(() => {
      const fetchTrendingData = async () => {
         try {
            const response = await getTrendingData();
            
            if (!(response?.data?.result)) {
               throw new Error('Invalid trending data format');
            }

            const suggestions = response.data.result.map(result => result.title);
            setTrendingQueries(suggestions);
         } catch (error) {
            console.error('Failed to fetch trending data: ', error);
            setTrendingQueries([]);
         }
      };

      fetchTrendingData();
   }, []);


   // ------------------------------


   function handleClick(query) {
      setSelectedSmartFAQ({});
      triggerSearch(query);
      getSuggestClickCount({ suggest: query, query: '' });
   }


   // ------------------------------


   if (!trendingQueries.length) {
      return null;
   }


   return (
      <ul>
         {
            trendingQueries.map((query, i) => (
               <li key={`trending-${i}`}>
                  <button onClick={() => handleClick(query)}>
                     {formatQuery(query)}
                  </button>
               </li>
            ))
         }
      </ul>
   );
};


export default TrendingQueries;


// ==========================================================================================


function formatQuery(query) {
   return query
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/\\/g, '');
}
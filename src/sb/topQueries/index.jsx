import useSearchStore from '../../stores/searchStore';
import useTopQueriesStore from '../../stores/topQueriesStore';
import { getInitialUrlParameters, getResults } from '../common/SbCore';

import styles from './topQueries.module.scss';


// ==========================================================================================


function TopQueries() {
   
   const topQueries = useTopQueriesStore(state => state.topQueries);

   const setInputQuery = useSearchStore(state => state.setInputQuery);

   
   // ------------------------------


   function searchForTopQuery(topQuery) {
      const params = getInitialUrlParameters(topQuery); 
      
      params.page = 1;
      setInputQuery(topQuery);
      getResults(params);
   }


   // ------------------------------


   if (!topQueries || topQueries.length === 0) {
      return null;
   }

   
   return (
      <ul className={styles.topQueries}>
         {
            topQueries.map((topQuery, i) => (
               <li key={`top-query-${i}`}>
                     <button onClick={() => searchForTopQuery(topQuery)}>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                        {topQuery}
                     </button>
               </li>
            ))
         }
      </ul>
   );
};
   
export default TopQueries;
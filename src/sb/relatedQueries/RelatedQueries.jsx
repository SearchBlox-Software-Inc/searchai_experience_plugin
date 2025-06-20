import { useEffect, useState } from 'react';
import axios from 'axios';

import { relatedQueryFields, pluginDomain } from '../common/Defaults';
import { getInitialUrlParameters, getResults } from '../common/SbCore';

import styles from './relatedQueries.module.scss';


// ==========================================================================================


const RelatedQueries = (props) => {

   const [relatedQueries, setRelatedQueries] = useState([]);


   // ------------------------------


   useEffect(() => {
      triggerRelatedSearch(props);
   }, [props]);


   // ------------------------------


   function triggerRelatedSearch(propsdata) {
      const { apikey, field, col, type, operator, limit, terms } = relatedQueryFields;

      axios({
         method: 'post',
         url: `${pluginDomain}/rest/v2/api/related/related`,
         data: {
            apikey,
            field,
            col,
            type,
            operator,
            limit,
            terms,
            query: propsdata.results,
         },
         headers: {
            'Content-Type': 'application/json',
            'SB-PKEY': relatedQueryFields['SB-PKEY'],
         },
      })
         .then(response => {
            if (!response?.data) {
               setRelatedQueries([]);
               return;
            }

            if (response.data.message === 'Invalid Request') {
               setRelatedQueries([]);
               return;
            }

            const queries = Array.isArray(response.data) ? response.data : [];
            setRelatedQueries(queries);
         })
         .catch(error => {
            console.error('Failed to fetch related queries: ', error.message || 'Unknown error');
            setRelatedQueries([]);
         });
   }


   function handleRelatedQueryClick(query) {
      const params = getInitialUrlParameters(query);
      params.page = 1;
      getResults(params);
   }


   // ------------------------------


   if (!relatedQueries.length)
      return null;



   return (
      <div className={styles.relatedQueriesContainer}>
         <h3 className={styles.heading}>
            Related Queries
         </h3>
         <ul className={styles.relatedQueries}>
            {
               relatedQueries.map((relatedQuery, index) => (
                  <li key={`related-query-${index}`}>
                     <button onClick={() => { handleRelatedQueryClick(relatedQuery); }}>
                        {relatedQuery.replace(/&amp;/g, "&")}
                     </button>
                  </li>
               ))
            }
         </ul>
      </div>
   );
};

export default RelatedQueries;
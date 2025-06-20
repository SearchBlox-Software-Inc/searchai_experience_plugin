import queryString from 'query-string';
import PropTypes from 'prop-types';

import * as defaults from './../common/Defaults';
import useTopQueriesStore from '../../stores/topQueriesStore';

import TopQueries from '../topQueries';

import styles from './styles/noResults.module.scss';


// ==========================================================================================


function NoResults({ noPublicCol, errorMessage }) {


   const topQueries = useTopQueriesStore(state => state.topQueries);


   // --------------------------------


   const currentParameters = { ...queryString.parse(window.location.search) };


   return (
      <div className={styles.noResults}>
         <svg className={styles.noResultsIcon} xmlns="http://www.w3.org/2000/svg" width="80px" height="80px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /><path d="M10 13v.01" /><path d="M10 7v3" /></svg>

         <div className={styles.noResultsText}>

            {
               errorMessage ?
                  <>
                     <h2>
                        Something went wrong while searching.
                     </h2>
                     <p>
                        {errorMessage}
                     </p>
                  </>
                  :
                  noPublicCol ?
                     <>
                        <h2>
                           There is no public collection available to search.
                        </h2>
                        <p>
                           Ensure you have at least one public collection or enable security to search private collections.
                        </p>
                     </>
                     :
                     <>
                        <h2>
                           No matches found for <em><strong style={{ color: '#37135b' }} dangerouslySetInnerHTML={{ __html: (currentParameters.query.replace(/\\/g, '')) }} /></em>.
                        </h2>
                        <p>
                           Check spelling, verify collection access, try synonyms, or use broader keywords.
                        </p>
                     </>
            }
         </div>

         {
            !noPublicCol &&
            topQueries.length > 0 &&
            currentParameters.page === '1' &&
            (currentParameters.topQuery === 'true' || defaults.topQuery) && (
               <div>
                  <h3>Or search for:</h3>

                  <TopQueries />
               </div>
            )
         }
      </div>
   );
}



NoResults.propTypes = {
   noPublicCol: PropTypes.bool,
   errorMessage: PropTypes.string,
};


export default NoResults;
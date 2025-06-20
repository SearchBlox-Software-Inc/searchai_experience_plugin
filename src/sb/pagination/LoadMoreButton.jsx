import PropTypes from 'prop-types';
import queryString from 'query-string';

import { getResults } from '../common/SbCore';

import commonStyles from '../css/common.module.scss';
import styles from './pagination.module.scss';



// ==========================================================================================


function LoadMoreButton({ loadMoreActive, setLoadMoreActive, lastPage }) {
   
   function loadMoreResults() {
      setLoadMoreActive(true);

      const urlParameters = Object.assign({}, queryString.parse(window.location.search));
      const pagesize = (urlParameters.pagesize ? parseInt(urlParameters.pagesize, 10) : 10) + 10;

      urlParameters.pagesize = pagesize;
      urlParameters.query = decodeURIComponent(urlParameters.query);

      getResults(urlParameters);
   }


   // ---------------------------------


   if (lastPage == 1) {
      return null;
   }


   return (
      <button className={styles.loadMoreButton}
         onClick={loadMoreResults}
         disabled={loadMoreActive}
      >
         {
            loadMoreActive ? 
               <svg className={commonStyles.searchSpinner} xmlns="http://www.w3.org/2000/svg"  width="16px"  height="16px"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a9 9 0 1 0 9 9" /></svg> 
               : 
               'Load more'
         }
      </button>
   );
}


LoadMoreButton.propTypes = {
   loadMoreActive: PropTypes.bool,
   setLoadMoreActive: PropTypes.func,
   lastPage: PropTypes.number
};


export default LoadMoreButton;
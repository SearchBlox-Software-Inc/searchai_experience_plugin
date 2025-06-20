import PropTypes from 'prop-types';
import queryString from 'query-string';

import { sortButtons } from '../common/Defaults';
import { getResults } from '../common/SbCore';

import styles from './sort.module.scss';


// ==========================================================================================


function SortOptions({ showSort }) {
   
   function doSort(sort) {
      let urlParameters = { ...queryString.parse(window.location.search) };
      
      if (sort.sort && !sort.sort1) {
         sortButtons.map(option => {
            if (option.sort) {
               urlParameters.sort = option.field;
               urlParameters.sortdir = option.sortDir ? option.sortDir : 'desc';
            }
            
            if (option.sort1) {
               urlParameters.sort1 = option.field;
               urlParameters.sortdir1 = option.sortDir ? option.sortDir : 'desc';
            }
         });
      } else if (sort.sort && sort.sort1) {
         // this else if condition is because we have removed sort:relevance from sortBtns in facet.js 
         sortButtons.map(option => {
            if (option.sort) {
               urlParameters.sort = option.field;
               urlParameters.sortdir = option.sortDir ? option.sortDir : 'desc';
            }
            
            if (option.sort1) {
               urlParameters.sort1 = "relevance";
               urlParameters.sortdir1 = "desc";
            }
         });
      } else {
         delete urlParameters.sort1;
         delete urlParameters.sortdir1;
         
         urlParameters.sort = sort.field;
         urlParameters.sortdir = sort.sortDir ? sort.sortDir : 'desc';
      }

      urlParameters.page = 1;
      
      getResults(urlParameters);
      showSort(false);
   }
   
   
   // ------------------------------


   const urlParameters = { ...queryString.parse(window.location.search) };


   return (
      <ul className={styles.sortOptions} aria-label="Sort options">
         {
            sortButtons.map((option, i) => {
               return (
                  <li key={`sort-option-${i}}`}>
                     <button onClick={() => doSort(option)} className={`${urlParameters.sort === option.field ? styles.active : ""}`}>
                        {option.display.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                     </button>
                  </li>
               );
            })
         }
      </ul>
   );
}


export default SortOptions;


SortOptions.propTypes = {
   showSort: PropTypes.func,
};
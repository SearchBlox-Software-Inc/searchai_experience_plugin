import PropTypes from 'prop-types';

import styles from './styles/filterSearch.module.scss';


// ==========================================================================================


function FilterSearchInput({
   facetField,
   filtersSearch,
   handleFiltersSearch,
   handleFiltersSearchClear
}) {

   return (
      <div className={styles.filterSearchWrapper}>
         <input
            className={styles.filterSearch}
            type={'text'}
            onChange={e => handleFiltersSearch(e, facetField)}
            value={filtersSearch[facetField] || ''}
            placeholder="Search"
         />

         {
            filtersSearch[facetField]?.length > 0 && (
               <button
                  className={styles.filterSearchClear}
                  onClick={() => handleFiltersSearchClear(facetField)}
               >
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
               </button>
            )
         }
      </div>
   );
}


FilterSearchInput.propTypes = {
   facetField: PropTypes.string.isRequired,
   filtersSearch: PropTypes.object.isRequired,
   handleFiltersSearch: PropTypes.func.isRequired,
   handleFiltersSearchClear: PropTypes.func.isRequired
};


export default FilterSearchInput; 
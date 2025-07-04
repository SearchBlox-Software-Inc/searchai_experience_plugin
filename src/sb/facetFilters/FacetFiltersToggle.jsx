import PropTypes from 'prop-types';

import styles from './styles/facetsToggle.module.scss';


// ==========================================================================================


function FacetFiltersToggle({ filtersShown, showFilters }) {

   return (
      <button className={`${styles.facetsToggle} ${filtersShown ? styles.shown : ''}`} title={`${filtersShown ? 'Hide' : 'Show'} facet filters`} onClick={() => showFilters(shown => !shown)}>
         {
            filtersShown ? 
               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-filter-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 20l-3 1v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v3" /><path d="M16 19h6" /></svg>
               :
               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-filter-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 20l-3 1v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v3" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
         }
      </button>
   );
}


export default FacetFiltersToggle;


FacetFiltersToggle.propTypes = {
   filtersShown: PropTypes.bool.isRequired,
   showFilters: PropTypes.func.isRequired,
};
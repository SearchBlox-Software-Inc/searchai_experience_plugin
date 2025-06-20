import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { facetFiltersOrder, facets } from '../common/Defaults';
import * as parser from '../common/SbCore';
import useSearchStore from '../../stores/searchStore';
import { checkForAppliedFilters, customizeOrderOfFacets, toggleFilter, clearAll } from './utils/facetFilterUtils';

import styles from './styles/selectedFilters.module.scss';


// ==========================================================================================


dayjs.extend(utc);


// ------------------------------------------------------------------------------------------


function SelectedFilters() {

   const response = useSearchStore(state => state.response);
   
   const [orderedFacets, setOrderedFacets] = useState([]);


   // ------------------------------


   useEffect(() => {
      const facetsList = customizeOrderOfFacets(response.facets);
      setOrderedFacets(facetsList);
   }, [response.facets]);


   // ------------------------------


   const hasAppliedFilters = checkForAppliedFilters();


   if (!hasAppliedFilters) {
      return null;
   }


   return (
      <div className={styles.selectedFilters}>
         <button className={styles.clearAll}
            aria-label="Clear all applied filters"
            onClick={clearAll}
         >
            <span>Clear All</span>
         </button>
            

         {
            orderedFacets.map((facet, index) => {

               let field = Object.keys(facet)[0];
               const variable = facet[field].map((filter, index) => {
                  

                  if (filter.rangeField) {
                     let tempdate = filter.filterName.split(" TO ");
                     let startDate = dayjs(tempdate[1]).utc().format("YYYY-MM-DD");
                     let endDate = dayjs(tempdate[0]).utc().format("YYYY-MM-DD");

                     return filter.filterSelect ? (
                        <button
                           key={index}
                           onClick={(e) => toggleFilter(field, filter.fromValue)}
                           title={startDate + " To " + endDate}
                        >
                           <span>{startDate} To {endDate}</span>
                           <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path></svg>
                        </button>
                     ) : null;
                  } else {
                     return filter.filterSelect ? (
                        <button
                           key={index}
                           onClick={(e) => toggleFilter(field, filter.filterName)}
                        >
                           <span>{filter.filterName.replace(/&quot;/g, '"').replace(/&amp;/g, "&")}</span>
                           <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path></svg>
                        </button>
                     ) : null;
                  }
               });
               return variable;
            })}
      </div>
   );
};

SelectedFilters.propTypes = {
   facets: PropTypes.array,
};

export default SelectedFilters;

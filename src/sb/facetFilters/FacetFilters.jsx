import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

import { checkboxFacets, customDateSettings, facetFiltersOrder, checkboxesInFacet, facets, filtersSearchInput, pageSize } from '../common/Defaults';
import useSearchStore from '../../stores/searchStore';

import CustomDateFilter from './CustomDateFilter';
import FilterSearchInput from './FilterSearchInput';

import styles from './styles/facetFilters.module.scss';

import {
   checkForAppliedFilters,
   customizeOrderOfFacets,
   toggleFilter,
   clearAll,
   clearFiltersOfFacet,
} from './utils/facetFilterUtils';


// ==========================================================================================


const MOBILE_BREAKPOINT = 768;

const CHECKBOX_FIELDS = checkboxFacets;

const INITIAL_DISPLAY_COUNT = 5;
const COUNT_CHANGE = 5;


// ------------------------------------------------------------------------------------------



// Handles the number of filters displayed under each facet at a time.
function handleFacetKeyDown(e, facetField) {
   const currentKey = e.key;

   // Only process arrow keys
   if (currentKey !== 'ArrowDown' && currentKey !== 'ArrowUp') {
      return;
   }

   e.preventDefault();

   // Get all filter options in the current facet
   const currentFacetOptions = document.querySelectorAll(`#${facetField}Filters .${styles.filter}`);
   if (!currentFacetOptions.length) return;

   // Get the index of the currently focused option
   const currentOptionIndex = parseInt(e.target.id.split('-')[1], 10);
   if (isNaN(currentOptionIndex)) return;

   // Calculate the new index based on arrow direction
   let newOptionIndex;
   if (currentKey === 'ArrowDown') {
      newOptionIndex = (currentOptionIndex + 1) % currentFacetOptions.length;
   } else { // ArrowUp
      newOptionIndex = (currentOptionIndex - 1 + currentFacetOptions.length) % currentFacetOptions.length;
   }

   // Focus the new option
   const newOption = currentFacetOptions[newOptionIndex];
   if (newOption) {
      newOption.focus();
   }
}


// ------------------------------------------------------------------------------------------


function FacetFilters({ filtersShown, isKeywordSearch }) {

   const [filtersCollapsed, collapseFilters] = useState(window.innerWidth >= MOBILE_BREAKPOINT);
   const [availableFacets, setAvailableFacets] = useState([]);
   const [displayCount, setDisplayCount] = useState({});
   const [filtersSearch, setFiltersSearch] = useState({});
   const [filtersApplied, setFiltersApplied] = useState(false);
   const [dateFiltersShown, setDateFiltersVisibility] = useState(false);


   // ------------------------------


   const response = useSearchStore(state => state.response);
   const { facets: facetsFromResponse } = response;


   // ------------------------------


   useEffect(() => {
      function handleResize() {
         collapseFilters(window.innerWidth >= MOBILE_BREAKPOINT);
      }

      const debouncedHandleResize = debounce(handleResize, 500);

      window.addEventListener('resize', debouncedHandleResize);

      return () => {
         window.removeEventListener('resize', debouncedHandleResize);
      };
   });


   useEffect(() => {
      setAvailableFacets([...customizeOrderOfFacets(facetsFromResponse)]);
   }, [facetsFromResponse]);


   useEffect(() => {
      const counts = {};

      availableFacets.forEach(facet => {
         counts[facet.facetField] = INITIAL_DISPLAY_COUNT;
      });

      setDisplayCount({ ...counts });
      setFiltersApplied(checkForAppliedFilters());
   }, [availableFacets]);


   // ------------------------------


   function handleCountChange(facet, change) {
      const newCount = change === 'more' ? displayCount[facet] + COUNT_CHANGE : displayCount[facet] - COUNT_CHANGE;
      setDisplayCount({ ...displayCount, [facet]: newCount });
   }


   function handleFiltersSearch(e, facet) {
      const currentValue = e.target.value;
      setFiltersSearch(filtersSearch => ({ ...filtersSearch, [facet]: currentValue }));
   }


   function handleFiltersSearchClear(facet) {
      setFiltersSearch(filtersSearch => ({ ...filtersSearch, [facet]: '' }));

      const counts = {};

      availableFacets.forEach(facet => {
         counts[facet.facetField] = INITIAL_DISPLAY_COUNT;
      });

      setDisplayCount({ ...counts });
   }


   // ------------------------------


   const urlParameters = { ...queryString.parse(window.location.search) };


   if (!availableFacets.length)
      return null;


   if (window.innerWidth >= MOBILE_BREAKPOINT && !filtersShown)
      return null;


   return (
      <div className={styles.facetsContainer}>

         <div className={styles.facetsContainerHead}>  {/* can be disabled in css if not required */}
            <div className={styles.filtersHeadingContainer}>
               <button className={styles.filtersToggle} onClick={() => collapseFilters(!filtersCollapsed)} aria-label={`${filtersCollapsed ? 'Close' : 'Open'} filters`}>
                  {
                     filtersCollapsed ?
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                        :
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg"><path d="M32 96v64h448V96H32zm0 128v64h448v-64H32zm0 128v64h448v-64H32z" /></svg>
                  }
                  <span className={styles.filtersHeading}>Filters</span>
               </button>
            </div>

            {
               filtersApplied ?
                  <button className={styles.filtersClear} onClick={clearAll}>
                     Clear All
                  </button>
                  :
                  null
            }
         </div>

         {
            filtersCollapsed ?
               <div className={styles.facetsContainerBody}>
                  {
                     availableFacets.map((facet, i) => {
                        const { facetField } = facet;

                        if (facetField.toLowerCase() === 'lastmodified')
                           return;

                        const allFiltersActive = !urlParameters[`f.${facetField}.filter`];

                        const filterSearchEnabled = filtersSearchInput.enabled && facet[facetField].length > filtersSearchInput.minFilters;

                        const filteredFilters = filtersSearch[facetField] && filtersSearch[facetField].length && facet[facetField].filter(filter => filter.filterName.toLowerCase().includes(filtersSearch[facetField].trim().toLowerCase()));


                        const filtersToBeShown = filteredFilters && filteredFilters.length ?
                           filteredFilters
                           :
                           (filtersSearch[facetField] && filtersSearch[facetField].length) ? [] : facet[facetField];

                        const isCheckBoxField = checkboxesInFacet && CHECKBOX_FIELDS.includes(facetField.toLowerCase());


                        return (
                           <details key={`facet-${i}`} className={styles.facet} open>
                              <summary>
                                 <h2 className={styles.facetHeading} id={`${facetField}Heading`}>
                                    {facet.display}
                                 </h2>
                                 <svg className={styles.caretIcon} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11.998 17L18.998 9 4.998 9z" /></svg>
                              </summary>

                              {
                                 filterSearchEnabled &&
                                 <FilterSearchInput
                                    facetField={facetField}
                                    filtersSearch={filtersSearch}
                                    handleFiltersSearch={handleFiltersSearch}
                                    handleFiltersSearchClear={handleFiltersSearchClear}
                                 />
                              }


                              <ul id={`${facetField}Filters`}
                                 role="menu"
                                 aria-labelledby={`${facetField}Heading`}
                                 onKeyDown={(e) => handleFacetKeyDown(e, facetField)}
                              >
                                 {
                                    isCheckBoxField ?
                                       null
                                       :
                                       <li role="presentation" >
                                          <button className={`${styles.filter} ${styles.filterAll} ${allFiltersActive ? styles.active : ''}`}
                                             id={`${facetField}-0`}
                                             role="menuitemradio"
                                             tabIndex={allFiltersActive ? 0 : -1}
                                             aria-checked={allFiltersActive}
                                             onClick={() => clearFiltersOfFacet(facetField)}
                                          >
                                             <span className={styles.filterRadioButton} />
                                             <span className={styles.filterName}>All</span>
                                          </button>
                                       </li>
                                 }

                                 {
                                    filtersToBeShown.length > 0 ?
                                       filtersToBeShown.slice(0, displayCount[facetField]).map((filter, j) => {
                                          const { filterName, count, filterSelect } = filter;

                                          return (
                                             <li key={`${facetField}-${j}`} role="presentation">
                                                <button className={`${styles.filter} ${filterSelect ? styles.active : ''} ${isCheckBoxField ? styles.isCheckbox : styles.isRadioButton}`}
                                                   id={`${facetField}-${j + 1}`}
                                                   role={isCheckBoxField ? 'menuitemcheckbox' : 'menuitemradio'}
                                                   tabIndex={isCheckBoxField ? 0 : (filterSelect ? 0 : -1)}
                                                   aria-checked={filterSelect}
                                                   onClick={() => toggleFilter(facetField, filterName)}
                                                >
                                                   <span className={styles.filterNameWrapper}>
                                                      <span className={isCheckBoxField ? styles.filterCheckbox : styles.filterRadioButton} />
                                                      <span className={styles.filterName}>{filterName}</span>
                                                   </span>
                                                   {
                                                      isKeywordSearch &&
                                                         <span className={styles.filterCount}>{count.toLocaleString()}</span>
                                                   }
                                                </button>
                                             </li>
                                          );
                                       })
                                       :
                                       <li>
                                          <span className={styles.filter}>No filters found.</span>
                                       </li>
                                 }
                              </ul>

                              {
                                 displayCount[facetField] < filtersToBeShown.length || displayCount[facetField] > INITIAL_DISPLAY_COUNT ?
                                    <div className={styles.facetDisplayButtons}>
                                       {
                                          displayCount[facetField] < filtersToBeShown.length ?
                                             <button onClick={() => handleCountChange(facetField, 'more')}>More</button>
                                             :
                                             null
                                       }
                                       {
                                          filtersToBeShown.length > INITIAL_DISPLAY_COUNT && displayCount[facetField] > INITIAL_DISPLAY_COUNT ?
                                             <button onClick={() => handleCountChange(facetField, 'less')}>Less</button>
                                             :
                                             null
                                       }
                                    </div>
                                    :
                                    null
                              }
                           </details>
                        );
                     })
                  }

                  {
                     customDateSettings.enabled ?
                        <div className={styles.filterDateRangeContainer}>
                           <button className={`${styles.filterDateRangeToggle} ${styles.facet} ${dateFiltersShown ? styles.open : ''}`} onClick={() => setDateFiltersVisibility(!dateFiltersShown)}>
                              <span className={styles.filterDateRangeToggleWrapper}>
                                 {/* <svg className='calendar-icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M16 3l0 4"></path><path d="M8 3l0 4"></path><path d="M4 11l16 0"></path><path d="M8 15h2v2h-2z"></path></svg> */}
                                 <span className={styles.facetHeading}>{customDateSettings.customDateDisplayText ? customDateSettings.customDateDisplayText : "Date"}</span>
                              </span>

                              <svg className={styles.caretIcon} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11.998 17L18.998 9 4.998 9z" /></svg>
                           </button>

                           {
                              dateFiltersShown ?
                                 <CustomDateFilter
                                    facets={facetsFromResponse}
                                    setDateFiltersVisibility={setDateFiltersVisibility}
                                 />
                                 :
                                 null
                           }
                        </div>
                        :
                        null
                  }
               </div>
               :
               null
         }
      </div>
   );
}


FacetFilters.propTypes = {
   facets: PropTypes.array,
   filtersShown: PropTypes.bool
};


export default FacetFilters;


// ------------------------------------------------------------------------------------------


// helper function to improve performance on resize event
function debounce(fn, ms) {
   let timer;

   return () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
         timer = null;
         fn.apply(this, arguments);
      }, ms);
   };
}
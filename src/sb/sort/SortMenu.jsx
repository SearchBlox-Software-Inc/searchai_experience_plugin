import { useState, useRef } from 'react';
import queryString from 'query-string';

import useClickOutside from '../common/hooks/useClickOutside';
import { getResults } from '../common/SbCore';
import SortOptions from './SortOptions';


import commonStyles from '../css/common.module.scss';
import styles from './sort.module.scss';

// ==========================================================================================


function SortMenu() {

   const [sortShown, showSort] = useState(false);

   const sortDropdownRef = useRef(null);


   //  ------------------------------
   
   
   useClickOutside(sortDropdownRef, handleClickOutsideSortDropdown);
   

   function handleClickOutsideSortDropdown() {
      showSort(currentSortShown => {
         if (currentSortShown)
            return false;
      });
   }
   

   function getSortDisplayText() {
      const parameters = { ...queryString.parse(window.location.search) };
      const text = parameters.sort === ('mrank' ? 'relevance' : parameters.sort) || 'relevance';
      return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
   }

   
   // function getSortDirectionText(currentDirection) {
   //    const { sort: currentSort, sortdir, sortdir1 } = { ...queryString.parse(window.location.search) };  
   // }


   function toggleSortDirection() {
      const parameters = { ...queryString.parse(window.location.search) };

      if (parameters.sort == 'mrank') {
         parameters.sortdir1 = parameters.sortdir1 === 'desc' ? 'asc' : 'desc';
      } else {
         parameters.sortdir = parameters.sortdir === 'desc' ? 'asc' : 'desc';
      }

      getResults(parameters);
   }


   //  ------------------------------


   const parameters = { ...queryString.parse(window.location.search) };

   const currentlyDescending = parameters.sort === 'mrank' ? parameters.sortdir1 === 'desc' : parameters.sortdir === 'desc';


   return (
      <div className={styles.sortMenu} ref={sortDropdownRef}>
         
         <div className={styles.sortMenuWrapper}>
            <h4 className={styles.sortMenuLabel}>
               SORT BY:
            </h4>

            <button className={`${styles.sortMenuToggle}  ${sortShown ? styles.active : ''}`}
               title="Sort by"
               aria-label="Sort options toggle"
               aria-expanded={sortShown}
               {...(sortShown ? { "aria-controls": "sortDropdown" } : {})}
               onClick={() => showSort(sortShown => !sortShown)}
            >
               {getSortDisplayText()}
            </button>
         
            {
               sortShown &&
                  <div className={`${commonStyles.popover}`} id="sortDropdown">
                     <SortOptions showSort={showSort} />
                  </div>
            }
         </div>

         {/* Sort direction toggle group */}
         <div className={styles.sortDirToggleGroup} role="group" aria-label="Sort direction">
            <button 
               className={`${styles.sortDirToggle} ${currentlyDescending ? styles.active : ''}`}
               title="Decreasing"
               aria-pressed={currentlyDescending}
               onClick={() => currentlyDescending || toggleSortDirection()}
            >
               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-sort-descending"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l9 0" /><path d="M4 12l7 0" /><path d="M4 18l7 0" /><path d="M15 15l3 3l3 -3" /><path d="M18 6l0 12" /></svg>
            </button>
            <button 
               className={`${styles.sortDirToggle} ${!currentlyDescending ? styles.active : ''}`}
               title="Increasing"
               aria-pressed={!currentlyDescending}
               onClick={() => !currentlyDescending || toggleSortDirection()}
            >
               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-sort-ascending"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l7 0" /><path d="M4 12l7 0" /><path d="M4 18l9 0" /><path d="M15 9l3 -3l3 3" /><path d="M18 6l0 12" /></svg>
            </button>
         </div>
      </div>   
   );
}

export default SortMenu;
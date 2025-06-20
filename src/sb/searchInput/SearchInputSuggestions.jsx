import { showAutoSuggest, suggestSmartFAQs, trendingSearch } from './../common/Defaults';
import useSearchStore from '../../stores/searchStore';
import useAutoSuggestStore from './../../stores/autoSuggestStore';
import useSmartFAQsStore from './../../stores/smartFAQsStore';

import AutoSuggestComponent from '../autoSuggest/AutoSuggestComponent';
import TrendingComponent from '../autoSuggest/TrendingComponent';
import SuggestedSmartFAQs from '../smartFAQs/SuggestedSmartFAQs';

import styles from './styles/inputDropdown.module.scss';


// ==========================================================================================


function SearchInputSuggestions({ dropdownRef, dropdownVisibility, setDropdownVisibility }) {

   const inputQuery = useSearchStore(state => state.inputQuery);
   const triggerSearch = useSearchStore(state => state.triggerSearch);
   const suggestedQueries = useAutoSuggestStore(state => state.suggestedQueries);

   const suggestedFAQs = useSmartFAQsStore(state => state.suggestedFAQs);
   const setSelectedSmartFAQ = useSmartFAQsStore(state => state.setSelectedFAQ);


   const handleDropdownKeyDown = e => {
      const key = e.key;
      const dropdownItems = document.querySelectorAll(`.${styles.inputDropdown} li button`);
      const currentIndex = Array.from(dropdownItems).indexOf(e.target);


      if (key === 'ArrowDown' || key === 'ArrowUp') {
         // Down and up arrow keys
         e.preventDefault();
         let newIndex = currentIndex;

         if (key === 'ArrowDown')
            newIndex = currentIndex + 1 >= dropdownItems.length ? 0 : currentIndex + 1;
         else
            newIndex = currentIndex - 1 < 0 ? dropdownItems.length - 1 : currentIndex - 1;

         dropdownItems[newIndex].focus();

      } else if (key === 'Escape') {
         // Escape key
         setDropdownVisibility(false);
      }
   };


   return (
      <div
         className={styles.inputDropdown}
         ref={dropdownRef}
         onKeyDown={handleDropdownKeyDown}
      >
         {
            trendingSearch.enabled && !inputQuery.length && (
               <div className={styles.inputDropdownItem}>
                  <TrendingComponent />
               </div>
            )
         }

         {
            inputQuery.length >= 3 &&
            <>
               {
                  (showAutoSuggest || parameters.autoSuggestDisplay) && suggestedQueries.length > 0 &&
                  <div className={styles.inputDropdownItem}>
                     <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                        Suggestions
                     </h3>
                     <AutoSuggestComponent 
                        setDropdownVisibility={setDropdownVisibility}
                     />
                  </div>
               }

               {
                  suggestSmartFAQs.enabled && suggestedFAQs.length > 0 &&
                  <div className={styles.inputDropdownItem}>
                     <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-progress-help"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 16v.01"></path><path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path><path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969"></path><path d="M14 3.223a9.003 9.003 0 0 1 0 17.554"></path><path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592"></path><path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305"></path><path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356"></path></svg>
                        SmartFAQs
                     </h3>
                     <SuggestedSmartFAQs 
                        setDropdownVisibility={setDropdownVisibility}
                     />
                  </div>
               }

               {/* {
                  parameters.query && topQuery &&
                     <div className={styles.inputDropdownItem}>
                        <h3>Top Queries</h3>
                        <TopQuerySuggestions triggerSearch={triggerSearch} />
                     </div>
               } */}
            </>
         }
      </div>
   );
}


export default SearchInputSuggestions;
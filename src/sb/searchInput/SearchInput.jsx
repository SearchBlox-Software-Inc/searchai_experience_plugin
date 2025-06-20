import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useRef, useState } from 'react';

import { showAutoSuggest, suggestSmartFAQs, trendingSearch } from './../common/Defaults';

import useSearchStore from '../../stores/searchStore';
import useAutoSuggestStore from './../../stores/autoSuggestStore';
import useSmartFAQsStore from './../../stores/smartFAQsStore';

import useClickOutside from './../common/hooks/useClickOutside';
// import useDebounce from './../common/hooks/useDebounce';
import useThrottle from './../common/hooks/useThrottle';

import SearchInputSuggestions from './SearchInputSuggestions';
import SearchSettings from './SearchSettings';
import VoiceSearch from './VoiceSearchInput';

import dropdownStyles from './styles/inputDropdown.module.scss';
import styles from './styles/searchInput.module.scss';


// ==========================================================================================


function SearchInput({ isHero = false }) {
   
   const parameters = Object.assign({}, queryString.parse(window.location.search));

   // const [query, setInputQuery] = useState('');
   const [dropdownShown, setDropdownVisibility] = useState(false);
   const [voiceRecording, setVoiceRecording] = useState(false);
   
   const dropdownRef = useRef(null);
   const inputWrapperRef = useRef(null);

   
   // ------------------------------
   
   
   const inputQuery = useSearchStore(state => state.inputQuery);
   const setInputQuery = useSearchStore(state => state.setInputQuery);
   const voiceSearchEnabled = useSearchStore(state => state.voiceSearchEnabled);
   const triggerSearch = useSearchStore(state => state.triggerSearch);
   
   const fetchSuggestions = useAutoSuggestStore(state => state.fetchSuggestions);
   
   const fetchFAQs = useSmartFAQsStore(state => state.fetchFAQs);
   const setSelectedSmartFAQ = useSmartFAQsStore(state => state.setSelectedFAQ);
   
   const throttledInputQuery = useThrottle(inputQuery, 300);
   // const debouncedInputQuery = useDebounce(inputQuery, 300);
   
   
   // ------------------------------
   
   
   // Query for auto suggestions
   const { isLoading: isSuggestionsLoading } = useQuery({
      queryKey: ['suggestions', throttledInputQuery],
      queryFn: async () => {
         const result = await fetchSuggestions(throttledInputQuery);
         return result || [];
      },
      enabled: showAutoSuggest && dropdownShown && throttledInputQuery?.length >= 3,
      // staleTime: 60000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
   });


   // Query for FAQs
   const { isLoading: isFAQsLoading } = useQuery({
      queryKey: ['faqs', throttledInputQuery],
      queryFn: async () => {
         const result = await fetchFAQs(throttledInputQuery, suggestSmartFAQs.limit, true);
         return result || [];
      },
      enabled: suggestSmartFAQs.enabled && dropdownShown && throttledInputQuery?.length >= 3,
      // staleTime: 60000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
   });
   
   
   // ------------------------------
   
   
   function handleClickOutsideDropdown(e) {
      const { type, target, key } = e;

      const clickedOutsideSearchInput = type == 'click' && target.id !== 'searchInput';
      const tabbedWithinInputWrapper = type == 'keyup' && key === 'Tab' && (inputWrapperRef && !inputWrapperRef.current.contains(target));
      
      if (clickedOutsideSearchInput || tabbedWithinInputWrapper) {
         setDropdownVisibility(false);
      }
   }
   

   useClickOutside(dropdownRef, handleClickOutsideDropdown);


   // ------------------------------


   function clearSearchInput() {
      document.location.href = window.location.pathname;
   }


   function handleInputFocus() {
      const shouldShowTrendingSearches = trendingSearch.enabled && !inputQuery?.length && !dropdownShown;

      if (shouldShowTrendingSearches) {
         setDropdownVisibility(true);
      }
   }


   function handleInputKeyDown(e) {
      const { key } = e;

      switch (key) {
         case 'ArrowDown':
            if (dropdownShown) {
               e.preventDefault();
               const firstSuggestion = document.querySelector(`.${dropdownStyles.inputDropdown} li button`);
               firstSuggestion?.focus();
            }
            break;

         case 'Enter':
            setSelectedSmartFAQ({});
            triggerSearch(e.target.value);
            setDropdownVisibility(false);
            break;

         case 'Escape':
            setDropdownVisibility(false);
            break;
      }
   }


   function handleInputChange({ target }) {
      const currentInput = target.value;
      
      const shouldShowDropdown = (
         (currentInput.length === 0 && trendingSearch.enabled) || 
         currentInput.length >= 3
      );
      
      setDropdownVisibility(shouldShowDropdown);
      setInputQuery(currentInput);
   }
   

   // ------------------------------


   const voiceSearchEnabledPlaceholder = voiceRecording ? 'Listening...' : 'Type or use your voice to search';
   

   return (
      <div className={styles.inputWrapper} ref={inputWrapperRef}>
         {
            voiceSearchEnabled && <VoiceSearch setVoiceRecording={setVoiceRecording} />
         }

         <input 
            id="searchInput"
            className={`${styles.searchInput} ${voiceSearchEnabled ? styles.voiceSearchEnabled : ''}`}
            aria-label="Search input"
            autoComplete="off"
            placeholder={voiceSearchEnabled ? voiceSearchEnabledPlaceholder : 'Enter a search term...'}
            value={inputQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleInputKeyDown}
         />

         <div className={styles.inputButtons}>
            {
               inputQuery.length > 0 &&
                  <button 
                     title="Clear search" 
                     className={styles.clearSearchBtn} 
                     onClick={clearSearchInput} 
                  >
                     <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                  </button>
            }

            <SearchSettings parameters={parameters} />

            <button
               title="Search" 
               className={styles.searchBtn} 
               onClick={() => triggerSearch(inputQuery)}
            >
               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
            </button>
         </div>


         {
            !isHero && dropdownShown && 
               <SearchInputSuggestions 
                  dropdownRef={dropdownRef} 
                  dropdownVisibility={dropdownShown}
                  setDropdownVisibility={setDropdownVisibility}
               />
         }
      </div>
   );
}


export default SearchInput;


SearchInput.propTypes = {
   isHero: PropTypes.bool,
};
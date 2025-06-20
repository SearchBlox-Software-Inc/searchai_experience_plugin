import PropTypes from 'prop-types';

import { getSuggestClickCount } from '../common/SbCore';
import { highlightFunc as HIGHLIGHT } from '../common/suggestionsUtils';

import useAutoSuggestStore from './../../stores/autoSuggestStore';
import useSmartFAQsStore from './../../stores/smartFAQsStore';
import useSearchStore from './../../stores/searchStore';


// ==========================================================================================


function AutoSuggest({ setDropdownVisibility }) {

   const suggestedQueries = useAutoSuggestStore(state => state.suggestedQueries);
   
   const triggerSearch = useSearchStore(state => state.triggerSearch);
   const query = useSearchStore(state => state.inputQuery);

   const setSelectedSmartFAQ = useSmartFAQsStore(state => state.setSelectedFAQ);


   // ------------------------------


   function handleClick(suggestedQuery) {
      triggerSearch(suggestedQuery);
      getSuggestClickCount({ suggest: suggestedQuery, query });

      setSelectedSmartFAQ({});
      setDropdownVisibility(false);
   };


   // ------------------------------

   
   if (!suggestedQueries || suggestedQueries.length === 0) {
      return null;
   }


   return (
      <ul>
         {
            suggestedQueries.map((suggestedQuery, i) => (
               <li key={`suggested-suggestedQuery-${i}`}>
                  <button 
                     dangerouslySetInnerHTML={{ __html: HIGHLIGHT(suggestedQuery.replace(/\\/g, ''), query) }}
                     onClick={() => handleClick(suggestedQuery)}
                  />
               </li>
            ))
         }
      </ul>
   );
};


export default AutoSuggest;


AutoSuggest.propTypes = {
   highlight: PropTypes.bool
};
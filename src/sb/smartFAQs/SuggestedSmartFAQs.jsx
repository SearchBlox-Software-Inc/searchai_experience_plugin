import PropTypes from 'prop-types';

import { highlightFunc as HIGHLIGHT } from '../common/suggestionsUtils';

import useSearchStore from '../../stores/searchStore';
import useSmartFAQsStore from '../../stores/smartFAQsStore';


// ==========================================================================================


function SuggestedSmartFAQs({ setDropdownVisibility }) {
   
   const suggestedFAQs = useSmartFAQsStore(state => state.suggestedFAQs);
   const fetchSelectedFAQ = useSmartFAQsStore(state => state.fetchSelectedFAQ);

   const triggerSearch = useSearchStore(state => state.triggerSearch);
   const query = useSearchStore(state => state.inputQuery);

   // ------------------------------


   function getFAQDetails(faq) {
      fetchSelectedFAQ(faq.uid);
      triggerSearch(faq.question, 'OR');
      setDropdownVisibility(false);
   }


   // ------------------------------


   if(!suggestedFAQs || !suggestedFAQs.length)
      return null;


   return (
      <ul className="suggested-FAQs">
         {
            suggestedFAQs.map((faq, i) => (
               <li key={`suggested-faq-${i}`}>
                  <button dangerouslySetInnerHTML={{__html: HIGHLIGHT(faq.question.replace(/\\/g, ''), query)}}
                     onClick={() => getFAQDetails(faq)}
                  />
               </li>
            ))
         }
      </ul>
   );
};


SuggestedSmartFAQs.propTypes = {
   setDropdownVisibility: PropTypes.func
};


export default SuggestedSmartFAQs;
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { suggestSmartFAQs } from '../../common/Defaults';
import { highlightFunc as HIGHLIGHT } from '../../common/suggestionsUtils';
import { getSmartFAQS } from '../../common/SbCore';

import useClickOutside from '../../common/hooks/useClickOutside';

import styles from '../styles/chatPrompts.module.scss';


// ==========================================================================================


function PromptSuggestions({ query, setDropdownShown, handleSubmit }) {
   
   
   const [faqs, setFAQs] = useState([]);
   const [selectedIndex, setSelectedIndex] = useState(-1);
   const dropdownRef = useRef(null);
   const itemRefs = useRef([]);


   // ------------------------------


   useEffect(() => {
      getSmartFAQS(query, suggestSmartFAQs.limit)
         .then(response => setFAQs(response.data.smartFaq));
   }, [query]);


   // ------------------------------
   

   useClickOutside(dropdownRef, handleClickOutsideDropdown);


   function handleClickOutsideDropdown(e) {
      if (e.target.id !== 'searchInput') {
         setDropdownShown(false);
      }
   }


   // ------------------------------


   function handleDropdownKeyDown(e) {
      const key = e.key;
      // const itemsLength = faqs.length;
      
      // if (key === 'ArrowDown' || key === 'ArrowUp') {
      //    e.preventDefault();
         
      //    const nextIndex = key === 'ArrowDown'
      //       ? (selectedIndex + 1) % itemsLength
      //       : (selectedIndex - 1 + itemsLength) % itemsLength;
         
      //    setSelectedIndex(nextIndex);
      //    itemRefs.current[nextIndex]?.focus();

      // } else 
      
      if (key === 'Escape') { 
         setDropdownShown(false);
      }
   }


   // ------------------------------


   if (!faqs.length)
      return null;


   return (
      <ul className={styles.chatPrompts} ref={dropdownRef} onKeyDown={handleDropdownKeyDown}>
         {
            faqs.map((faq, i) => (
               <li key={`suggested-prompt-${i}`}>
                  <button
                     ref={el => itemRefs.current[i] = el}
                     dangerouslySetInnerHTML={{__html: HIGHLIGHT(faq.question.replace(/\\/g, ''), query)}}
                     onClick={() => handleSubmit(faq.question)}
                  />
               </li>
            ))
         }
      </ul>
   );
}


PromptSuggestions.propTypes = {
   query: PropTypes.string,
   handleSubmit: PropTypes.func,
   setDropdownShown: PropTypes.func,
};


export default PromptSuggestions;
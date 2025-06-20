import { useState , useRef } from 'react';
import PropTypes from 'prop-types';

import { callSmartFAQAction } from '../common/SbCore';
import VotingButtons from '../basicComponents/votingButtons';

import styles from './styles/faqItem.module.scss';


// ==========================================================================================


const FAQ_ANSWER_CHAR_COUNT = 150;


// ------------------------------------------------------------------------------------------


const FAQItem = ({ index, faq, active, toggleActive }) => {
   const [voted, setVoted] = useState(0);
   const [showFullAnswer, setShowFullAnswer] = useState(false);
   
   const detailsRef = useRef(null);

   
   // ------------------------------


   const handleVoting = action => {
      if (action === 'upvote') {
         setVoted(voted === 1 ? 0 : 1);
      } else {
         setVoted(voted === -1 ? 0 : -1);
      }
   };
 
   const handleClick = action => {
      const actionParameter = { uid: faq.uid, action };

      if (action !== '') {
         callSmartFAQAction(actionParameter);
      }

      if (action === 'open' || action === '') {
         toggleActive();
         detailsRef.current.open = false;
      } else if(action === 'upvote' || action === 'downvote') {
         handleVoting(action);
      }
   };


   // ------------------------------


   faq.description = new DOMParser().parseFromString(faq.description, 'text/html').body.textContent;

   const truncatedAnswer = faq.answer.length > FAQ_ANSWER_CHAR_COUNT ? `${faq.answer.slice(0, FAQ_ANSWER_CHAR_COUNT)}...` : faq.answer; 

   
   return (
      <details 
         key={`FAQ_${index}`} 
         ref={detailsRef} 
         className={`${styles.faq} ${active ? styles.open : ''}`}
      >
            <summary className={styles.faqHeader}
               onClick={() => handleClick(active ? '' : 'open')}
               aria-expanded={active}
               aria-controls={`faq${index}`}
            >
               <span className={styles.question} dangerouslySetInnerHTML={{ __html: faq.question }} />

               {
                  active ?
                     <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5 11H19V13H5z"></path></svg>
                     :
                     <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 11L13 11 13 5 11 5 11 11 5 11 5 13 11 13 11 19 13 19 13 13 19 13z"></path></svg>
               }
            </summary>

            {
               active &&
                  <div id={`FAQ_${index}`} className={styles.content}>
                        <div className={styles.faqBody}>
                           <p className={styles.answer}>
                              <span dangerouslySetInnerHTML={{ __html: showFullAnswer ? faq.answer : truncatedAnswer }} />&nbsp;
                              {
                                 faq.answer.length > FAQ_ANSWER_CHAR_COUNT && (
                                    <button className={styles.viewMore} onClick={() => setShowFullAnswer(!showFullAnswer)}>
                                       Show {showFullAnswer ? 'less' : 'more'}
                                    </button>
                                 )
                              }
                           </p>
                           <a className={styles.url} href={faq.url} target="_blank" onClick={() => handleClick('click')} rel="noreferrer">{faq.url}</a>
                        </div>

                        <div className={styles.feedback}>
                           <VotingButtons 
                              voted={voted}
                              onVote={action => handleClick(action)}
                              loading={false}
                              className={styles.buttonWrapper}
                           />
                        </div>
                  </div>
            }
      </details>
   );
};

export default FAQItem;

FAQItem.propTypes = {
   index: PropTypes.number,
   faq: PropTypes.object,
   active: PropTypes.bool,
   toggleActive: PropTypes.func
};
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useEffect, useState } from 'react';


import { smartFAQSettings, suggestSmartFAQs } from '../common/Defaults';
import { callSmartFAQAction, smartFaqDisplayCount } from '../common/SbCore';

import useSmartFAQsStore from '../../stores/smartFAQsStore';

import FAQItem from './FAQItem';

import faqItemStyles from './styles/faqItem.module.scss';
import styles from './styles/smartFAQs.module.scss';


// ==========================================================================================


function SmartFAQs() {

   const [availableFAQs, setFAQs] = useState([]);
   const [fAQsCount, setFAQsCount] = useState(smartFAQSettings.count);
   const [currentActive, setCurrentActive] = useState(undefined);
   const [showAll, setShowAll] = useState(false);


   // ------------------------------


   const fetchSmartFAQs = useSmartFAQsStore(state => state.fetchFAQs);
   const faqs = useSmartFAQsStore(state => state.faqs);
   const selectedSmartFAQ = useSmartFAQsStore(state => state.selectedFAQ);


   // ------------------------------


   useEffect(() => {
      const parameters = Object.assign({}, queryString.parse(window.location.search));

      if (smartFAQSettings.enabled && parameters.query) {
         fetchSmartFAQs(parameters.query, smartFAQSettings.count);
      }
   }, []);


   useEffect(() => {
      if (selectedSmartFAQ && Object.keys(selectedSmartFAQ).length > 0) {
         const uid = selectedSmartFAQ.uid;
         let matchingIndex = '';

         const checkUID = obj => {
            if (obj.uid === uid)
               matchingIndex = faqs.indexOf(obj);

            return obj.uid === uid;
         };

         if (faqs.some(checkUID)) {
            const faqsList = [...faqs];
            faqsList.splice(matchingIndex, 1);
            setFAQs(faqsList);
         }

      } else {
         setFAQs(faqs);
      }

   }, [faqs, selectedSmartFAQ]);


   useEffect(() => {
      if (availableFAQs?.length > 0) {
         let faqArr = [];
         availableFAQs.map((faq, i) => {
            if (i + 1 <= smartFAQSettings.count) {
               faqArr.push({ uid: faq.uid, collection: faq.collections });
            }
         });
         smartFaqDisplayCount(faqArr);
      }
   }, [availableFAQs]);


   useEffect(() => {
      if (showAll) {
         const newlyLoadedFAQs = availableFAQs
            .slice(fAQsCount)
            .map(({ uid, collections }) => ({ uid, collection: collections }));

         smartFaqDisplayCount(newlyLoadedFAQs);
         setFAQsCount(availableFAQs.length);
      }
   }, [showAll]);


   // ------------------------------


   const toggleActive = index => {
      if (index === currentActive) {
         setCurrentActive(undefined);
         return;
      }

      setCurrentActive(index);
   };



   // ------------------------------

   const selectedFAQExists = suggestSmartFAQs.enabled && selectedSmartFAQ && Object.keys(selectedSmartFAQ).length > 0;
   const smartFAQsExist = smartFAQSettings.enabled && availableFAQs.length > 0;

   const someFAQExists = selectedFAQExists || smartFAQsExist;

   if (!someFAQExists)
      return null;


   return (
      <div className={styles.faqsWrapper}>
         {
            someFAQExists &&
            <h3 className={styles.smartFAQsHeading}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-progress-help"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 16v.01" /><path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" /><path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" /><path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" /><path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" /><path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" /><path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" /></svg>
               SmartFAQs
            </h3>
         }

         {/* Selected FAQ suggestion*/}
         {
            selectedFAQExists &&
            <SelectedSmartFAQ faq={selectedSmartFAQ} />
         }

         {/* Other FAQs */}
         {
            smartFAQsExist &&
            <>
               <ul className={styles.faqsList} aria-label="SmartFAQs">
                  {
                     availableFAQs.map((faq, i) => {
                        if (i + 1 <= fAQsCount && faq.uid !== selectedSmartFAQ.uid) {
                           return (
                              <li key={`faq-${i}`}>
                                 <FAQItem index={i} faq={faq} currentActive={currentActive} active={i === currentActive} toggleActive={() => toggleActive(i)} />
                              </li>
                           );
                        }
                     })
                  }
               </ul>
               {
                  fAQsCount < availableFAQs.length &&
                  <div className={styles.faqsFooter} onClick={() => setShowAll(true)}>
                     <button className={styles.showAllBtn}>Show All</button>
                  </div>
               }
            </>
         }
      </div>
   );
};


// ------------------------------


function SelectedSmartFAQ({ faq }) {
   const [voted, setVoted] = useState(0);

   const handleVoting = (action) => {
      if (action === 'upvote')
         setVoted(voted === 1 ? 0 : 1);
      else
         setVoted(voted === -1 ? 0 : -1);

      callSmartFAQAction({ uid: faq.uid, action });
   };

   const handleClick = action => {
      const actionParameter = { uid: faq.uid, action };

      if (action !== '')
         callSmartFAQAction(actionParameter);

      if (action === 'upvote' || action === 'downvote') {
         handleVoting(action);
      }
   };

   useEffect(() => {
      callSmartFAQAction({ uid: faq.uid, action: "open" });
      let faqArr = [{ uid: faq.uid, collection: faq.collections }];
      smartFaqDisplayCount(faqArr);
   }, []);

   // ------------------------------

   return (
      <div className={`${faqItemStyles.selectedFAQ} ${faqItemStyles.faq}`}>
         <p className={faqItemStyles.question}>
            {faq.question}
         </p>

         <p className={faqItemStyles.answer}>
            {faq.answer}
         </p>

         <a className={faqItemStyles.url}
            href={faq.url}
            target="_blank"
            onClick={() => callSmartFAQAction({ uid: faq.uid, action: 'click' })} rel="noreferrer"
         >
            {faq.url}
         </a>

         <div className={faqItemStyles.feedback}>
            <div className={faqItemStyles.buttonWrapper}>
               <button className={`upvote-btn ${voted === 1 ? 'active' : ''}`} onClick={() => handleClick('upvote')} title="Upvote">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-thumb-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>
               </button>
               {/* <span className={faqItemStyles.voteCount}>{faq.upvote}</span> */}
            </div>

            <div className={faqItemStyles.buttonWrapper}>
               <button className={`${faqItemStyles.downvoteBtn} ${voted === -1 ? 'active' : ''}`} onClick={() => handleClick('downvote')} title="Downvote">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-thumb-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" /></svg>
               </button>
               {/* <span className={faqItemStyles.voteCount}>{faq.downvote}</span> */}
            </div>
         </div>
      </div>
   );
}

export default SmartFAQs;

SmartFAQs.propTypes = {
   query: PropTypes.string,
   selectedSmartFAQ: PropTypes.object,
};

SelectedSmartFAQ.propTypes = {
   faq: PropTypes.object,
};

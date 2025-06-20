import { useState } from 'react';

import useAssistStore from '../../stores/assistStore';
import useSearchStore from '../../stores/searchStore';

import styles from './styles/assistCart.module.scss';


// ==========================================================================================


function AssistCart() {
      
   const [isDragging, setIsDragging] = useState(false);

   const selectedResults = useAssistStore(state => state.selectedResults);
   const setSelectedResults = useAssistStore(state => state.setSelectedResults);
   const toggleSelectedResult = useAssistStore(state => state.toggleSelectedResult);
   
   const assistCartShown = useAssistStore(state => state.assistCartShown);
   const setAssistCartShown = useAssistStore(state => state.setAssistCartShown);

   const setAssistModalShown = useAssistStore(state => state.setAssistModalShown);

   const response = useSearchStore(state => state.response);
   const results = response.results;


   // ------------------------------


   const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
   };

   const handleDragLeave = () => {
      setIsDragging(false);
   };

   const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedText = e.dataTransfer.getData('text');

      try {
         new URL(droppedText);
         // Only add if it's not already in the list
         if (!selectedResults.some(result => result.url === droppedText)) {
            toggleSelectedResult(results.find(result => result.url === droppedText));
         }
      } catch (e) {
         console.log(e);
         console.log('Invalid URL dropped');
      }
   };


   // ------------------------------


   const urls = selectedResults.map(result => result);


   return (
      <div className={`${styles.assistCart} ${assistCartShown ? styles.shown : ''}`}>

         <div className={styles.assistCartHeader}>
            <h3>
               <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 8H17.8174M21 12H18M21 16H17.8174M6.18257 8H3M8 6.18257V3M8 21L8 17.8174M12 6V3M12 21V18M16 6.18257V3M16 21V17.8174M6 12H3M6.18257 16H3M10.8 18H13.2C14.8802 18 15.7202 18 16.362 17.673C16.9265 17.3854 17.3854 16.9265 17.673 16.362C18 15.7202 18 14.8802 18 13.2V10.8C18 9.11984 18 8.27976 17.673 7.63803C17.3854 7.07354 16.9265 6.6146 16.362 6.32698C15.7202 6 14.8802 6 13.2 6H10.8C9.11984 6 8.27976 6 7.63803 6.32698C7.07354 6.6146 6.6146 7.07354 6.32698 7.63803C6 8.27976 6 9.11984 6 10.8V13.2C6 14.8802 6 15.7202 6.32698 16.362C6.6146 16.9265 7.07354 17.3854 7.63803 17.673C8.27976 18 9.11984 18 10.8 18ZM10 10H14V14H10V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
               <span>SearchAI Assist</span>
            </h3>

            <button
               className={styles.assistCartHeaderClose}
               aria-label="Close"
               onClick={() => {
                  setSelectedResults([]);
                  setAssistCartShown(false);
               }}
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
            </button>
         </div>

         <div className={styles.assistCartBody}>
            <div
               className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
            >
               {
                  urls.length === 0 ?
                     <div className={styles.emptyMessage}>
                        Drag and drop URLs here
                     </div>
                     :
                     <ul className={styles.urlList}>
                        {
                           urls.map((item, index) => (
                              <li key={index} className={styles.urlItem}>
                                 <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.urlLink}
                                 >
                                    {item.title ? item.title.replace(/<[^>]*>/g, '') : item.url ? item.url.split('/').pop() : item.url}
                                 </a>

                                 <button
                                    onClick={() => toggleSelectedResult(item)}
                                    className={styles.removeUrlBtn}
                                 >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                 </button>
                              </li>
                           ))
                        }
                     </ul>
               }
            </div>

            <p className={styles.assistCartCount}>
               {urls.length} {selectedResults.length !== 1 ? 'files/URLs' : 'file/URL'} selected
            </p>
         </div>

         <div className={styles.assistCartFooter}>
            <button
               className={styles.assistCartClose}
               onClick={() => {
                  setSelectedResults([]);
                  setAssistCartShown(false);
               }}
            >
               Cancel
            </button>

            <button
               className={styles.assistCartCompare}
               onClick={() => {
                  setAssistModalShown(true);
                  setAssistCartShown(false);
               }}
            >
               Proceed
            </button>

         </div>

      </div>
   )
}

export default AssistCart;
import queryString from 'query-string';

import { chatBotConfiguration } from './../common/Defaults';
import useChatStore from './../../stores/chatStore';

import styles from './styles/chatHeader.module.scss';


// ==========================================================================================


const { name: BOT_NAME, enabled: CHATBOT_ENABLED } = chatBotConfiguration;
const CHATBOT_CONFIG_VALID = CHATBOT_ENABLED && BOT_NAME;


// ------------------------------------------------------------------------------------------


function ChatHeader() {

   const refreshChatBot = useChatStore(state => state.refreshChatBot);
   const setChatShown = useChatStore(state => state.setChatShown);


   // ------------------------------


   const urlParameters = queryString.parse(window.location.search);
   const collectionName = urlParameters.cname;


   return (
      <div className={styles.chatHeader}>
         <h3 className={styles.chatHeaderTitle}>
            <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 8H17.8174M21 12H18M21 16H17.8174M6.18257 8H3M8 6.18257V3M8 21L8 17.8174M12 6V3M12 21V18M16 6.18257V3M16 21V17.8174M6 12H3M6.18257 16H3M10.8 18H13.2C14.8802 18 15.7202 18 16.362 17.673C16.9265 17.3854 17.3854 16.9265 17.673 16.362C18 15.7202 18 14.8802 18 13.2V10.8C18 9.11984 18 8.27976 17.673 7.63803C17.3854 7.07354 16.9265 6.6146 16.362 6.32698C15.7202 6 14.8802 6 13.2 6H10.8C9.11984 6 8.27976 6 7.63803 6.32698C7.07354 6.6146 6.6146 7.07354 6.32698 7.63803C6 8.27976 6 9.11984 6 10.8V13.2C6 14.8802 6 15.7202 6.32698 16.362C6.6146 16.9265 7.07354 17.3854 7.63803 17.673C8.27976 18 9.11984 18 10.8 18ZM10 10H14V14H10V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            {
               CHATBOT_CONFIG_VALID ? 
                  <>
                     ChatBot <em className={styles.chatHeaderName}>{BOT_NAME}</em>
                  </>
                  :
                  collectionName ?
                     <>
                        Chatting with collection <em className={styles.chatHeaderName}>{collectionName}</em>
                     </>
                     :
                     'SearchAI Chat'
            }
         </h3>

         <div className={styles.chatHeaderBtns}>
            <button className={styles.chatReset} onClick={refreshChatBot}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-reload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" /><path d="M20 4v5h-5" /></svg>
            </button>

            <button className={styles.chatCloseBtn} onClick={() => setChatShown(false)}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
            </button>
         </div>
      </div>
   );
} 


export default ChatHeader;
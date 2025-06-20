import { useEffect, useRef, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

import { chatBotConfiguration } from '../common/Defaults';
import useChatStore from '../../stores/chatStore';

import ChatHeader from './ChatHeader';
import ChatLine, { LoadingChatLine } from './ChatLine';
import ChatInput from './chatInput/ChatInput';

import chatStyles from './styles/chat.module.scss';


// ==========================================================================================


const { idleTimeOut: IDLE_TIMEOUT, } = chatBotConfiguration;


// ------------------------------------------------------------------------------------------


export default function Chat() {
   
   const [idlePrompted, setIdlePrompted] = useState(false);
   
   
   const chatContainerRef = useRef(null);
   const chatMessagesRef = useRef(null);

   
   // ------------------------------

   
   const chatShown = useChatStore(state => state.chatShown); 
   const setChatShown = useChatStore(state => state.setChatShown);
   const toggleChatShown = useChatStore(state => state.toggleChatShown);

   const settingsLoading = useChatStore(state => state.settingsLoading);
   const chatBotSettings = useChatStore(state => state.chatBotSettings);
   const refreshChatBot = useChatStore(state => state.refreshChatBot);
   const initializeChatBot = useChatStore(state => state.initializeChatBot);

   const messageLoading = useChatStore(state => state.messageLoading);
   const messages = useChatStore(state => state.messages);
   const setMessages = useChatStore(state => state.setMessages);

   
   // ------------------------------
   

   useIdleTimer({
      element: chatContainerRef.current,
      onIdle: () => setIdlePrompted(true),
      timeout: IDLE_TIMEOUT * 60 * 1000,
      throttle: 500
   });


   // ------------------------------


   useEffect(() => {
      initializeChatBot();
   }, []);


   useEffect(() => {
      const closeOnEscape = ({ key }) => {
         if (chatShown && key === 'Escape') {
            setChatShown(false);
         }
      }

      document.addEventListener('keydown', closeOnEscape);
      
      return () => {
         document.removeEventListener('keydown', closeOnEscape);
      };
   }, [chatShown]);


   useEffect(() => {
      if (chatShown && messages.length && chatMessagesRef.current) {
         chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
   }, [chatShown, messages, messageLoading]);
   
   
   useEffect(() => {
      if (idlePrompted) {
         const promptMessage = `Is there anything ${messages.length > 2 ? 'else': ''} I can help you find?`;

         setMessages(messages => [
            ...messages, 
            { 
               message: promptMessage, 
               role: 'system', 
               created: Date.now() 
            }
         ]);
      }
   }, [idlePrompted]);


   // ------------------------------


   return (
      <div id="sbChat" className={chatStyles.sbChatContainer}>
         {
            chatShown &&
               <div className={chatStyles.chat} ref={chatContainerRef}>

                  <ChatHeader />
                  
                  <ul className={chatStyles.chatMessagesList} ref={chatMessagesRef}>
                     {
                        !settingsLoading && messages.length > 0 && 
                           messages.map(({ message, role, id, created, duration, voted, sources, actions }, index) => (
                              <ChatLine 
                                 key={`chat-message-${index}`} 
                                 index={index.toString()} 
                                 role={role} 
                                 message={message} 
                                 created={created}
                                 duration={duration}
                                 id={id}
                                 voted={voted || 0}
                                 settings={chatBotSettings}
                                 sources={sources}
                                 actions={actions}
                              />
                           ))                                
                     }
                     
                     {
                        (settingsLoading || messageLoading) && <LoadingChatLine />
                     }
                  </ul>
                     
                  <ChatInput  />
               </div>
         }

         <button 
            title={chatShown ? 'Close' : 'SearchAI ChatBot'}
            className={chatStyles.chatToggle} 
            onClick={toggleChatShown} 
         >
            {
               chatShown ?
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                  :
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-message"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9h8" /><path d="M8 13h6" /><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" /></svg>
            }
         </button>
      </div>
   );
}


// ==========================================================================================
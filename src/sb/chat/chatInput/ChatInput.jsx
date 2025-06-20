import { Filter } from 'bad-words';
import { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';

import { chatBotConfiguration } from '../../common/Defaults';
import { sendChatMessage, sendChatTestMessage } from '../../common/SbCore';
import useChatStore from './../../../stores/chatStore';

import {
   formatDuration as FORMAT_DURATION,
   httpsRegex as HTTP_REGEX,
   maskSensitiveInfo as MASK_SENSITIVE_INFO,
   sourcesRegex as SOURCES_REGEX
} from '../chatUtilities';
import ChatVoiceInput from './ChatVoiceInput';
import PromptSuggestions from './PromptSuggestions';

import styles from '../styles/chatInput.module.scss';


// ==========================================================================================


const { enabled: CHATBOT_ENABLED, suggestions: SUGGESTIONS_ENABLED, name: BOT_NAME } = chatBotConfiguration;
const CHATBOT_CONFIG_VALID = CHATBOT_ENABLED && BOT_NAME;


const PROFANITY_FILTER_DEFAULTS = { replaceRegex: /\w+/g, placeHolder: '#%*!' };


// ------------------------------------------------------------------------------------------


export default function ChatInput() {
   
   
   const [input, setInput] = useState('');
   const [recording, setRecording] = useState(false);
   const [profanityFilter, setProfanityFilter] = useState(new Filter({ ...PROFANITY_FILTER_DEFAULTS }));
   const [dropdownShown, setDropdownShown] = useState(false);
   
   
   const { chatBotSettings, 
      addMessage, setMessageLoading, 
      conversationID, setConversationID,
      abortController, cancelPendingRequest
    } = useChatStore();

   const chatInputRef = useRef(null);


   // ------------------------------


   useEffect(() => {

      chatInputRef.current.focus();
      
      return () => {
         abortController.abort();
      };
   }, []);


   useEffect(() => {
      if (!chatBotSettings) {
         return; 
      }

      const { profanitySettings } = chatBotSettings;
      
      if (profanitySettings?.maskProfanity) {
         const { useDefaultDataset } = profanitySettings;
         const newProfanityFilter = new Filter({ ...PROFANITY_FILTER_DEFAULTS, ...(useDefaultDataset ? {} : { emptyList: true }) });

         if (!useDefaultDataset) {
            newProfanityFilter.removeWords(...profanitySettings.whitelistedWords);
         }
         
         newProfanityFilter.addWords(...profanitySettings.blacklistedWords);
         setProfanityFilter(newProfanityFilter);
      }
   }, [chatBotSettings]);


   useEffect(() => {
      if (SUGGESTIONS_ENABLED) {
         setDropdownShown(input.length > 2);
      }
   }, [input]);

   

   // ------------------------------


   function handleInputKeyDown(e) {
      const key = e.key;

      // if (dropdownShown && ['ArrowUp', 'ArrowDown'].includes(key)) {
      //    e.preventDefault();
      // }

      if (key === 'Enter' && input.length) {
         handleSubmit();
      }
   }


   function handleSubmit(message = input) {
      setMessageLoading(true);
      setInput('');

      let maskedMessage = message;

      if (chatBotSettings?.profanitySettings?.maskProfanity) {
         maskedMessage = profanityFilter.clean(message);
      }

      if (chatBotSettings?.sensitiveDataInformation?.maskSensitiveData) {
         maskedMessage = MASK_SENSITIVE_INFO(maskedMessage, { ...chatBotSettings?.sensitiveDataInformation });
      }
      
      addMessage({
         message: maskedMessage, 
            role: 'user', 
         created: Date.now() 
      });

      const requestStartTime = performance.now();

      const signal = cancelPendingRequest();

      // Use sendChatTestMessage if chatbot is not configured, otherwise use sendChatMessage
      const sendMessage = CHATBOT_CONFIG_VALID ? sendChatMessage : sendChatTestMessage;

      const urlParameters = queryString.parse(window.location.search);
      const collectionName = urlParameters.cname;
      
      sendMessage({ 
         ...(CHATBOT_CONFIG_VALID ? { chatbotname: BOT_NAME } : { collectionname: collectionName }),
         question: maskedMessage, 
         ...(conversationID.length > 0 && { conversation_id: conversationID }) }, signal)
         .then(response => {
            const { role } = response.data.choices[0].message;
            const { conversation_id, id, actions } = response.data;
            const created = response.data.created;
            const sources = [];

            let content = response.data.choices[0].message.content;
            let sourceLinks = content.match(SOURCES_REGEX) ? content.match(SOURCES_REGEX) : content.match(HTTP_REGEX);

            if (sourceLinks) {
               sourceLinks.forEach(item => {
                  const sourceTagContent = item.replace(/<\/?source>/g, '').trim();
                  
                  content = content.replace(item, '');
                  sources.push(sourceTagContent);
               });
            }

            const requestEndTime = performance.now();
            const requestDuration = requestEndTime - requestStartTime;
            const duration = FORMAT_DURATION(requestDuration);

            setConversationID(conversation_id);
            addMessage({
               message: content, 
               role, 
               created,
               id,
                  duration,
                  voted: 0,
                  sources,
                  actions
            });
         })
         .catch(error => {
            console.error(error);
            
            if (error.name !== 'CanceledError') {
               addMessage({
                  message: 'Oops! That went wrong. Please try again or ask something else.', 
                  role: 'system', 
                  created: Date.now(), 
                  id: '',
                  voted: 0
               });
            }
         })
         .finally(() => {
            setMessageLoading(false);
         });
   }


   // ------------------------------


   return (
      <div className={styles.chatInputContainer}>
         
         <ChatVoiceInput 
            recording={recording} 
            setRecording={setRecording} 
            handleSubmit={handleSubmit} 
         />

         <div className={styles.chatInputWrapper}>
            <input
               ref={chatInputRef}
               type="text" aria-label="chat input" required
               value={input}
               id="chatInput"
               placeholder={recording ? 'Listening ...' : 'Ask a question ...'}
               onKeyDown={handleInputKeyDown} 
               onChange={(e) => setInput(e.target.value)}
               autoComplete="off"
            />

         </div>
         
         
         {
            SUGGESTIONS_ENABLED && dropdownShown && 
               <PromptSuggestions 
                  query={input} 
                  handleSubmit={handleSubmit} 
                  setDropdownShown={setDropdownShown} 
               />
         }

         <div className={styles.chatInputBtns}>

            <button 
               className={styles.chatInputBtn} 
               onClick={() => handleSubmit(input)}
               disabled={recording || input.length === 0}
            >
               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-send"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg>
            </button>
         </div>
      </div>
   );
}
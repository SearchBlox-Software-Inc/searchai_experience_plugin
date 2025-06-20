import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { chatBotConfiguration } from '../common/Defaults';
import useChatStore from '../../stores/chatStore';
import { voteChatMessage } from '../common/SbCore';
import { shortTimeFormat as SHORTIME_FORMAT } from './chatUtilities';

import VotingButtons from '../basicComponents/votingButtons';
import ChatAction from './ChatAction';
import CitationLinks from './CitationLinks';

import chatStyles from './styles/chat.module.scss';


// ==========================================================================================


const { enabled: CHATBOT_ENABLED, suggestions: SUGGESTIONS_ENABLED, name: BOT_NAME } = chatBotConfiguration;
const CHATBOT_CONFIG_VALID = CHATBOT_ENABLED && BOT_NAME;

dayjs.extend(relativeTime);


const TIMESTAMP_UPDATE_INTERVAL = 20; //in seconds


// ---------------------------------


export default function ChatLine({ 
      role = 'assistant', message, created, 
      duration, id, index, 
      voted, sources, actions,
      settings = { userLabel: 'You', botLabel: 'SearchAI' }
   }) {

   const [_, setTime] = useState(Date.now());


   const setMessages = useChatStore(state => state.setMessages);
   const messages = useChatStore(state => state.messages);

   
   // ---------------------------------
   

   useEffect(() => {
      const interval = setInterval(() => setTime(Date.now()), (TIMESTAMP_UPDATE_INTERVAL * 1000));
      
      return () => {
         clearInterval(interval);
      };
   }, []);


   // ---------------------------------


   const voteMutation = useMutation({
      mutationFn: ({ message_id, action }) => voteChatMessage({ message_id, action }),
      onSuccess: (response, variables) => {
         
         if (response.data?.success) {
            const votedValue = variables.action === 'upvote' ? 1 : -1;
            
            setMessages(messages.map(message => 
               message.id === variables.message_id ? 
                  { ...message, voted: votedValue }
                  : 
                  message
            ));
         }
      }
   });
   
   
   // ---------------------------------

   
   function handleVoteAction(action) {
      if (voted !== 0) return;
      
      voteMutation.mutate({ message_id: id, action });
   }


   // ---------------------------------


   if (!message || message.trim() == '') {
      return null;
   }

   
   const roleIsUser = role == 'user';
   const currentLabel = roleIsUser ? settings.userLabel : settings.botLabel;

   const timestamp = SHORTIME_FORMAT.format(created);
   const isJustNow = dayjs(created).isAfter(dayjs().subtract(TIMESTAMP_UPDATE_INTERVAL, 'seconds'));
   
   const formattedTimestamp = Number(index) === 0 ? timestamp : (isJustNow ? 'just now' : dayjs(created).fromNow());
   

   return (
      <li className={`${roleIsUser ? chatStyles.user : chatStyles.bot}`}>
         <div className={chatStyles.chatMessageWrapper}>
            <div className={chatStyles.chatMessage}>
               <p className={chatStyles.chatSpeaker}>
                  {currentLabel}
               </p>

               <div>
                  <span>{message}</span>
                  <CitationLinks sources={sources} />
               </div>

               <div className={chatStyles.chatDetails}>
                  <div className={chatStyles.timeDetails}>
                     <span className={chatStyles.chatTimestamp} {...(index > 0 ? { title: `${roleIsUser ? 'Sent' : 'Received'} at ${timestamp}` } : {})}>{formattedTimestamp}</span>

                     { 
                        duration && duration.length > 0 ? 
                           <span className={chatStyles.chatDuration}>
                              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12,5c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S16.411,5,12,5z M12,19c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6 S15.309,19,12,19z" /><path d="M11 9H13V14H11zM9 2H15V4H9z" /><path transform="rotate(-134.999 19 6)" d="M17.586 5H20.413999999999998V7H17.586z" /></svg>
                              {duration}
                           </span> 
                        : null
                     }
                  </div>

                  {
                     CHATBOT_CONFIG_VALID && role == 'assistant' &&
                        <VotingButtons
                           voted={voted}
                           onVote={handleVoteAction}
                           loading={voteMutation.isPending}
                        />
                  }
               </div>
            </div>
            
            {
               role == 'assistant' && actions?.length > 0 &&
                  <ChatAction actionData={actions} />
            }
         </div>
      </li>
   );
}


ChatLine.propTypes = {
   role: PropTypes.string,
   index: PropTypes.number,
   message: PropTypes.string,
   created: PropTypes.number,
   duration: PropTypes.string,
   id: PropTypes.string,
   voted: PropTypes.number,
   settings: PropTypes.object,
   sources: PropTypes.array,
   actions: PropTypes.array
};


// ==========================================================================================


export function LoadingChatLine() {
   return (
      <li className={chatStyles.loading}>
         <div className={chatStyles.chatMessageWrapper}>
            <div className={chatStyles.chatMessage}>
               <span className={chatStyles.dots}/>
            </div>
         </div>
      </li>
   );
}
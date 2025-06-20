import { create } from 'zustand';
import queryString from 'query-string';

import { chatBotConfiguration } from '../sb/common/Defaults';
import { getChatBotSettings } from '../sb/common/SbCore';


// ==========================================================================================


const { enabled: CHATBOT_ENABLED, name: BOT_NAME } = chatBotConfiguration;
const CHATBOT_CONFIG_VALID = CHATBOT_ENABLED && BOT_NAME;


const DEFAULT_CHATBOT_SETTINGS = { userLabel: 'You', botLabel: 'SearchAI' };


const INITIAL_MESSAGE = {
   role: 'system',
   message: 'Hello! What can I help you find?',
   created: Date.now(),
   id: '',
   voted: 0
};


// ------------------------------------------------------------------------------------------   


const useChatStore = create((set, get) => ({

   chatShown: false,
   settingsLoading: false,
   chatBotSettings: DEFAULT_CHATBOT_SETTINGS,

   messageLoading: false,
   messages: [INITIAL_MESSAGE],
   conversationID: '',

   generatedAnswer: '',
   
   abortController: typeof AbortController !== 'undefined' ? new AbortController() : null,


   // --------------------------------------------


   setChatShown: (chatShown) => set({ chatShown }),
   setSettingsLoading: (settingsLoading) => set({ settingsLoading }),
   setChatBotSettings: (chatBotSettings) => set({ chatBotSettings }),

   setMessageLoading: (messageLoading) => set({ messageLoading }),
   setMessages: (messages) => set({ 
      messages: Array.isArray(messages) ? [...messages] : [messages].filter(Boolean)
   }),
   setConversationID: (conversationID) => set({ conversationID }),
   
   setGeneratedAnswer: (generatedAnswer) => set({ generatedAnswer }),


   // --------------------------------------------


   initializeChatBot: () => {
      const urlParameters = queryString.parse(window.location.search);

      if (!CHATBOT_CONFIG_VALID && !(urlParameters.chatEligible && urlParameters.cname)) {
         return;
      }

      set({ settingsLoading: true });

      setTimeout(() => {
         getChatBotSettings(BOT_NAME)
            .then(receivedSettings => {
               set({ chatBotSettings: receivedSettings });
               set({ messages: [{ ...INITIAL_MESSAGE, message: receivedSettings.initialMessage }] });
            })
            .finally(() => set({ settingsLoading: false }));
      }, 300);
   },


   cancelPendingRequest: () => {
      const currentController = get().abortController;
      if (currentController) {
         currentController.abort();
      }

      const newController = new AbortController();
      set({ abortController: newController });

      return newController.signal;
   },


   refreshChatBot: () => {
      set({ conversationID: '' });
      get().cancelPendingRequest();
      get().initializeChatBot();
   },


   addMessage: (message) => {
      set((state) => ({
         messages: [...state.messages, message]
      }));
   },

   
   toggleChatShown: () => {
      set((state) => ({
         chatShown: !state.chatShown
      }));
   }
}));


export default useChatStore;
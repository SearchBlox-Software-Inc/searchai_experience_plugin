import { create } from 'zustand';


// ==========================================================================================


const useAssistStore = create((set, get) => ({
   
   selectedResults: [],

   assistCartShown: false,
   assistModalShown: false,
   
   isLoading: false,
   loadingMessage: '',
   controller: null,
   messages: [],
   selectedPrompt: '',
   customPrompt: '',
   showInput: false,


   // --------------------------------------------
   
   
   setSelectedResults: (results) => set({ selectedResults: results }),
   toggleSelectedResult: (result) => set((state) => {
     const exists = state.selectedResults.some(r => r.uid === result.uid && r.url === result.url && r.title === result.title);
     if (exists) {
       return { selectedResults: state.selectedResults.filter(r => r.uid !== result.uid && r.url !== result.url && r.title !== result.title) };
     } else {
       return { selectedResults: [...state.selectedResults, result] };
     }
   }),

   setAssistCartShown: (value) => set({ assistCartShown: value }),
   setAssistModalShown: (value) => set({ assistModalShown: value }),

   setIsLoading: (value) => set({ isLoading: value }),
   setLoadingMessage: (message) => set({ loadingMessage: message }),
   setController: (controller) => set({ controller }),
   setMessages: (messages) => set({ messages }),
   addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
   setSelectedPrompt: (prompt) => set({ selectedPrompt: prompt }),
   setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
   setShowInput: (value) => set({ showInput: value }),
   

   // --------------------------------------------

   

}));


export default useAssistStore;
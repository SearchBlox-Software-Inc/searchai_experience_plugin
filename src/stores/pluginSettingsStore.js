import { create } from 'zustand';


// ==========================================================================================


const usePluginSettingsStore = create((set) => ({
   
   aiOverviewEnabled: false,
   recommendationsEnabled: false,
   assistEnabled: false,
   llmFieldsShown: false,
   llmFieldsMode: 'both', // 'replace' or 'both'
   chatBotEnabled: false,


   // --------------------------------------------


   setAiOverviewEnabled: (value) => set({ aiOverviewEnabled: value }),
   setRecommendationsEnabled: (value) => set({ recommendationsEnabled: value }),
   setAssistEnabled: (value) => set({ assistEnabled: value }),
   setLLMFieldsShown: (value) => set({ llmFieldsShown: value }),
   setLLMFieldsMode: (value) => set({ llmFieldsMode: value }),
   setChatBotEnabled: (value) => set({ chatBotEnabled: value }),
   
}));


export default usePluginSettingsStore;
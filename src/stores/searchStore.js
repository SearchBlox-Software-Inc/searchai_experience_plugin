import { create } from 'zustand';

import useRecommendationsStore from './recommendationsStore';
import * as parser from '../sb/common/SbCore';
import { defaultType, defaultCollections, pageSize } from '../sb/common/Defaults';


// ==========================================================================================


const useSearchStore = create((set, get) => ({
   
   inputQuery: '',
   dropdownVisible: false,
   response: {},
   suggestSearch: { actualQuery: '', suggestedQuery: '' },
   voiceSearchEnabled: false,

   

   // --------------------------------------------


   setInputQuery: (query) => set({ 
      inputQuery: query
         .replace(/&quot;/g, '"')
         .replace(/&amp;/g, '&') 
         .replace(/\\/g, '')
   }),
   setDropdownVisibility: (visible) => set({ dropdownVisible: visible }),
   setResponse: (response) => set({ response: response }),
   setSuggestSearch: (suggest) => set({ suggestSearch: suggest }),
   setVoiceSearchEnabled: (enabled) => set({ voiceSearchEnabled: enabled }),
   

   // --------------------------------------------


   triggerSearch: (query, searchType = defaultType) => {
      const { response } = get();

      const clearRecommendations = useRecommendationsStore.getState().clearRecommendations;

      set({
         suggestSearch: { actualQuery: '', suggestedQuery: '' },
         inputQuery: query,
         dropdownVisible: false,
      });

      clearRecommendations();

      let initialParams = parser.getInitialUrlParameters(query);
      initialParams.page = 1;

      if (initialParams.default !== searchType) {
         initialParams.default = searchType;
      }

      delete initialParams.mlt_id;
      delete initialParams.mlt_col;
      delete initialParams.XPC;

      if (defaultCollections.length) {
         initialParams.col = [...defaultCollections];
      }

      if (response?.resultInfo?.hits <= 0) {
         initialParams = parser.clearAllFilters(initialParams);
      }

      if (initialParams.pagesize) {
         initialParams.pagesize = pageSize;
      }

      parser.getResults(initialParams);
   }

}));


export default useSearchStore;
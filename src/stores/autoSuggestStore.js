import { create } from 'zustand';
import { getAutoSuggest } from '../sb/common/SbCore';


// ==========================================================================================

const QUERY_REGEX = /^[a-z\d\-_&\s]+$/i; // Only allow alphanumeric, dash, underscore, and space

// ------------------------------------------------------------------------------------------

const useAutoSuggestStore = create((set) => ({

   suggestedQueries: [],

   setSuggestedQueries: (queries) => set({ suggestedQueries: queries }),

   fetchSuggestions: async (query) => {
      try {
         if (!QUERY_REGEX.test(query)) {
            set({ suggestedQueries: [] });
            return [];
         }

         const response = await getAutoSuggest(query);
         let suggestions = [];

         if (response.data === undefined) {
            throw new Error("Autosuggest error");
         } else if (response.data[0]?.constructor.name === 'Object') {
            // smartsuggest
            const keys = Object.keys(response.data[0]);
            suggestions = keys.map(key => response.data[0][key]);
         } else {
            // autocomplete
            suggestions = response.data.length ? [...response.data] : [];
         }

         set({ suggestedQueries: suggestions });
      } catch (error) {
         console.error(error);
         set({ suggestedQueries: [] });
      }
   }
}));

export default useAutoSuggestStore;

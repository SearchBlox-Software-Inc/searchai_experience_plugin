import { create } from 'zustand';
import { getSmartFAQS, getSelectedSmartFAQ } from '../sb/common/SbCore';


// ==========================================================================================


const useSmartFAQsStore = create((set) => ({
   
   faqs: [],
   suggestedFAQs: [],
   selectedFAQ: {},

   // --------------------------------------------

   setFaqs: (faqs) => set({ faqs }),
   setSelectedFAQ: (faq) => set({ selectedFAQ: faq }),
   setSuggestedFAQs: (faqs) => set({ suggestedFAQs: faqs }),

   // --------------------------------------------

   fetchFAQs: async (query, limit, suggest = false) => {
      try {
         const response = await getSmartFAQS(query, limit);
         
         if (response?.data?.smartFaq !== null) {
            if (suggest) {
               set({ suggestedFAQs: response.data.smartFaq || [] });
            } else {
               set({ faqs: response.data.smartFaq || [] });
            }
         } else {
            if (suggest) {
               set({ suggestedFAQs: [] });
            } else {
               set({ faqs: [] });
            }
            console.error('No FAQs data available or unexpected response format');
         }
      } catch (error) {
         console.error('Error fetching FAQs:', error);
         if (suggest) {
            set({ suggestedFAQs: [] });
         } else {
            set({ faqs: [] });
         }
      }
   },
   
   fetchSelectedFAQ: async (uid) => {
      const response = await getSelectedSmartFAQ(uid);

      if (response.status === 200 && response.data) {
         set({ selectedFAQ: response.data });
      }
   },
}));


export default useSmartFAQsStore; 
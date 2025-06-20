import { create } from 'zustand';


// ==========================================================================================


const useRecommendationsStore = create((set, get) => ({
   
   recentResultClicks: [],
   recommendations: [],
   userInitiatedClick: false,

   
   // --------------------------------------------
   

   setRecentResultClicks: (clicks) => set({ recentResultClicks: clicks }),
   setRecommendations: (recommendations) => set({ recommendations: recommendations }),
   setUserInitiatedClick: (value) => set({ userInitiatedClick: value }),
   

   // --------------------------------------------


   updateRecentResultClicks: (resultTitle) => {
      set({ userInitiatedClick: true });
      
      const { recentResultClicks } = get();
      const filteredTitles = recentResultClicks.filter(item => item !== resultTitle);
      const updatedTitles = [...filteredTitles, resultTitle];
      
      set({ recentResultClicks: updatedTitles.slice(-3) });

      setTimeout(() => {
         set({ userInitiatedClick: false });
      }, 100);
   },


   clearRecommendations: () => {
      set({
         recentResultClicks: [],
         recommendations: [],
         userInitiatedClick: false,
      });

      sessionStorage.setItem('recentlyClickedTitles', JSON.stringify([]));
   },

}));


export default useRecommendationsStore;
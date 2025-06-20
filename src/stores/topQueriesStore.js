import { create } from 'zustand';
import axios from 'axios';

import { topQueryFields, pluginDomain } from '../sb/common/Defaults';


// ==========================================================================================


const useTopQueriesStore = create((set) => ({
   
   topQueries: [],

   // ------------------------------

   fetchTopQueries: async () => {
      try {
         const response = await axios({
            method: 'post',
            url: pluginDomain + '/rest/v2/api/query/topquery',
            data: {
               'apikey': topQueryFields.apikey,
               'col': topQueryFields.col,
               'limit': topQueryFields.limit
            },
            headers: { 'Content-Type': 'application/json' }
         });

         if (response.data && Object.keys(response.data).length) {
            set({ topQueries: Object.keys(response.data) });
         }
      } catch (error) {
         console.error('Error fetching top queries:', error);
      }
   }
}));


export default useTopQueriesStore; 
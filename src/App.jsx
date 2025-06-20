import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import { pluginDomain } from './sb/common/Defaults';
import useSearchStore from './stores/searchStore';
import useSecurityStore from './stores/securityStore';

import Footer from './sb/basicComponents/footer';
import LogIn from './sb/login/';
import SearchUI from './sb/SearchUI';

import styles from './app.module.scss';
import SBLogoSRC from './assets/images/sb-logomain.png';


// ==========================================================================================


function App() {

   const [_, setLoggedIn] = useState(false);


   // ------------------------------


   const setSecurityResponse = useSecurityStore(state => state.setSecurityResponse);
   const setVoiceSearchEnabled = useSearchStore(state => state.setVoiceSearchEnabled);


   // ------------------------------


   const {
      data: securityResponse = {},
      isLoading: isLoadingSecurity,
      error: securityError,
   } = useQuery({
      queryKey: ['security'],
      queryFn: async () => {
         const { data } = await axios.get(`${pluginDomain}/rest/v2/api/secured/enabled`);
         if (data?.type?.toLowerCase() !== 'none') {
            localStorage.setItem('securityMethod', data.type);
         }

         setSecurityResponse(data);
         return data;
      },
      retry: '2',
      refetchOnWindowFocus: false
   });


   const {
      data: settingsResponse= {},
      isLoading: isLoadingSettings,
      error: settingsError
   } = useQuery({
      queryKey: ['settings'],
      queryFn: async () => {
         const { data } = await axios.get(`${pluginDomain}/ui/v1/search/settings`);
         setVoiceSearchEnabled(data['voice-enabled']);

         // TODO: check if smartsuggest from setting is used anywhere
         window.smartSuggest = data;
         return data;
      },
      retry: '2',
      refetchOnWindowFocus: false
   });


   // ------------------------------


   const securityExists = !(securityResponse && securityResponse.type === 'none');

   const searchTokenExists = localStorage.searchToken && localStorage.getItem("searchToken") !== null;

   const isLoading = isLoadingSecurity || isLoadingSettings;

   const error = securityError || settingsError;


   return (
      <>

         {
            isLoading && !localStorage.searchToken && (
               <div className={styles.appSettingsLoader}>
                  <img height="50px" src={SBLogoSRC} alt="SearchBlox" />
                  <code className={styles.barLoader} />

                  {
                     error && (
                        <span>
                           <code style={styles.errorCode}>{error.code || 'Error'}</code>: {error.message || 'Unknown error'}
                        </span>
                     )
                  }
               </div>
            )
         }

         {
            !isLoading && securityResponse?.type && (
               !securityExists || (securityExists && searchTokenExists && securityResponse.type == localStorage.getItem('securityMethod')) ?
                  <div className={styles.appContainer}>
                     <SearchUI />
                     <Footer />
                  </div>
                  :
                  <LogIn setLoggedIn={setLoggedIn} />
            )
         }

      </>
   );
}


export default App;    
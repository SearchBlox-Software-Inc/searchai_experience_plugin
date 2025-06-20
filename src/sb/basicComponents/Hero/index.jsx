import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import queryString from 'query-string';
import * as defaults from '../../common/Defaults';
import { logoutUser } from '../../common/AuthUtils';

import useSecurityStore from '../../../stores/securityStore';
import useAutoSuggestStore from '../../../stores/autoSuggestStore';
import useSmartFAQsStore from '../../../stores/smartFAQsStore';
import useTopQueriesStore from '../../../stores/topQueriesStore';

import SearchInput from '../../searchInput/SearchInput';
import SuggestedSmartFAQs from '../../smartFAQs/SuggestedSmartFAQs';
import AutoSuggestComponent from '../../autoSuggest/AutoSuggestComponent';
import TopQueries from '../../topQueries';

import useSearchStore from '../../../stores/searchStore';

import commonStyles from './../../css/common.module.scss';
import styles from './hero.module.scss';

import SBLogoSRC from './../../../assets/images/sb-logomain.png';


// ==========================================================================================


function Hero() {

   const heroRef = useRef(null);


   const securityResponse = useSecurityStore(state => state.securityResponse);
   
   const suggestedQueries = useAutoSuggestStore(state => state.suggestedQueries);

   const suggestedFAQs = useSmartFAQsStore(state => state.suggestedFAQs);

   const topQueries = useTopQueriesStore(state => state.topQueries);
   const fetchTopQueries = useTopQueriesStore(state => state.fetchTopQueries);

   const inputQuery = useSearchStore(state => state.inputQuery);


   // ------------------------------
   

   useEffect(() => {
      fetchTopQueries();
   }, []);


   // ------------------------------

   
   const currentParameters = { ...queryString.parse(window.location.search) };

   const autoSuggestEnabled = defaults.showAutoSuggest || currentParameters.autoSuggestDisplay;
   const shouldShowAutoSuggest = autoSuggestEnabled && suggestedQueries.length > 0;

   const shouldShowSmartFAQs = defaults.suggestSmartFAQs.enabled && suggestedFAQs.length > 0;

   const shouldShowTopQueries = !currentParameters.query && !currentParameters.col && !currentParameters.cname && !inputQuery &&
      ((currentParameters.topQuery && currentParameters.topQuery === 'true') || defaults.topQuery) &&
      topQueries.length > 0;


   return (
      <section className={styles.hero} ref={heroRef}>
         <div className={commonStyles.contentWrapper}>

            <div className={`${styles.heroContent} ${currentParameters.query ? styles.searched : ''}`}>

               <img className={styles.heroLogo} alt="SearchBlox Home" src={SBLogoSRC} />

               <SearchInput isHero={true} />

               {
                  !currentParameters.query && inputQuery?.length > 2 &&
                  (suggestedQueries.length > 0 || suggestedFAQs.length > 0) &&
                     <div className={styles.heroSuggestions}>
                        {
                           shouldShowAutoSuggest &&
                              <div className={styles.heroSuggestionsAutoSuggest}>
                                 <h3 className={styles.suggestionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                                    Suggestions
                                 </h3>

                                 <AutoSuggestComponent />
                              </div>
                        }


                        {
                           shouldShowSmartFAQs &&
                              <div className={styles.heroSuggestionsSmartFAQs}>
                                 <h3 className={styles.suggestionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-progress-help"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 16v.01" /><path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" /><path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" /><path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" /><path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" /><path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" /><path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" /></svg>
                                    SmartFAQs
                                 </h3>

                                 <SuggestedSmartFAQs />
                              </div>
                        }
                     </div>
               }

               {
                  shouldShowTopQueries &&
                     <div className={styles.heroTopQueries}>
                        <h3 className={styles.suggestionTitle}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart-search"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 20l-.975 -.966l-6.525 -6.462a5 5 0 1 1 7.5 -6.566a5 5 0 0 1 8.37 5.428" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
                           Most Searched
                        </h3>

                        <TopQueries />
                     </div>
               }

               {
                  securityResponse?.type !== 'none' &&
                     <button className={`${commonStyles.userLogout} ${styles.heroLogout}`} onClick={logoutUser}>
                        {/* Sign Out */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-logout"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg>
                     </button>
               }

            </div>
         </div>
      </section>
   );
}


Hero.propTypes = {
   currentParameters: PropTypes.object.isRequired,
   parameters: PropTypes.object.isRequired,
   SBLogoSRC: PropTypes.string.isRequired,
   logoutUser: PropTypes.func.isRequired
};


export default Hero; 
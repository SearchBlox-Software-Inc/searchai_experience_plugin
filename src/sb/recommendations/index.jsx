import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

import { defaultCollections as COLLECTIONS, recommendations as RECOMMENDATIONS_DEFAULTS } from '../common/Defaults';

import useRecommendationsStore from '../../stores/recommendationsStore';
import useSecurityStore from '../../stores/securityStore';
import { getDocumentClickCount, getRecommendations } from '../common/SbCore';

import RecommendationNotification from './RecommendationNotification';

import commonStyles from '../css/common.module.scss';
import styles from './styles/recommendations.module.scss';


// ==============================================================================================


function Recommendations() {

   const [previousRecommendations, setPreviousRecommendations] = useState([]);
   const [showNotification, setShowNotification] = useState(false);

   const securityResponse = useSecurityStore(state => state.securityResponse);

   const recentResultClicks = useRecommendationsStore(state => state.recentResultClicks);
   const setRecentResultClicks = useRecommendationsStore(state => state.setRecentResultClicks); 
   const updateRecentResultClicks = useRecommendationsStore(state => state.updateRecentResultClicks);
   const recommendations = useRecommendationsStore(state => state.recommendations);
   const setRecommendations = useRecommendationsStore(state => state.setRecommendations);
   const userInitiatedClick = useRecommendationsStore(state => state.userInitiatedClick);


   // ------------------------------


   useEffect(() => {
      const storedTitles = sessionStorage.getItem('recentlyClickedTitles');

      if (storedTitles) {
         setRecentResultClicks(JSON.parse(storedTitles));
      }
   }, []);


   useEffect(() => {
      
      sessionStorage.setItem('recentlyClickedTitles', JSON.stringify(recentResultClicks));

      // Only trigger recommendationsMutation if there are 3+ titles AND it's a user-initiated change 
      // TODO: find a better way to avoid rerendering
      if (recentResultClicks.length >= 3 && userInitiatedClick) {
         recommendationsMutation.mutate({
            titles: recentResultClicks,
         });
      }
   }, [recentResultClicks, userInitiatedClick]);


   // ------------------------------


   const recommendationsMutation = useMutation({
      mutationFn: async ({ titles }) => {
         const urlParameters = queryString.parse(window.location.search);
         const { cname } = urlParameters;

         const securityEnabled = !(securityResponse && securityResponse.type === 'none');

         const response = await getRecommendations({
            data: {  
               viewedPageTitles: titles,
               numberOfRecommendations: RECOMMENDATIONS_DEFAULTS.limit,
               ...(cname ? { cname: [cname] } : { col: COLLECTIONS })
            },
            securityEnabled
         });
         
         return response.data;
      },
      onSuccess: (data) => {
         if (data.recommendations.length) {
            setPreviousRecommendations(recommendations);
            setRecommendations(data.recommendations);
            setShowNotification(true);

         setTimeout(() => {
               setShowNotification(false);
            }, 5000);
         }
      },
      onError: (error) => {
         console.error('Error generating new title for recommendations: ', error);
      }
   });


   // ------------------------------


   function handleClick(e, result) {
      e.preventDefault();
      getDocumentClickCount(result);
      updateRecentResultClicks(result.title);
   }

   
   // ------------------------------


   if (recommendations.length === 0 && !recommendationsMutation.isPending) {
      return null;
   }


   return (
      <div className={styles.recommendationsContainer}>
         {
            recommendationsMutation.isPending &&
               <span className={styles.ollamaLoading}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="10" height="10" x="1" y="1" fill="currentColor" rx="1"><animate id="svgSpinnersBlocksShuffle30" fill="freeze" attributeName="x" begin="0;svgSpinnersBlocksShuffle3b.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle31" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle38.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle32" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle39.end" dur="0.2s" values="13;1" /><animate id="svgSpinnersBlocksShuffle33" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle3a.end" dur="0.2s" values="13;1" /></rect><rect width="10" height="10" x="1" y="13" fill="currentColor" rx="1"><animate id="svgSpinnersBlocksShuffle34" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle30.end" dur="0.2s" values="13;1" /><animate id="svgSpinnersBlocksShuffle35" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle31.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle36" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle32.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle37" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle33.end" dur="0.2s" values="13;1" /></rect><rect width="10" height="10" x="13" y="13" fill="currentColor" rx="1"><animate id="svgSpinnersBlocksShuffle38" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle34.end" dur="0.2s" values="13;1" /><animate id="svgSpinnersBlocksShuffle39" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle35.end" dur="0.2s" values="13;1" /><animate id="svgSpinnersBlocksShuffle3a" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle36.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle3b" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle37.end" dur="0.2s" values="1;13" /></rect></svg>
               </span>
         }

         <RecommendationNotification show={showNotification} />

         {
            recommendations.length > 0 &&
               <div className={commonStyles.contentWrapper}>
                  <h3>
                     {
                        recommendationsMutation.isPending ?
                           <svg className={commonStyles.searchSpinner} xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3a9 9 0 1 0 9 9" /></svg>
                           :
                           <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 8H17.8174M21 12H18M21 16H17.8174M6.18257 8H3M8 6.18257V3M8 21L8 17.8174M12 6V3M12 21V18M16 6.18257V3M16 21V17.8174M6 12H3M6.18257 16H3M10.8 18H13.2C14.8802 18 15.7202 18 16.362 17.673C16.9265 17.3854 17.3854 16.9265 17.673 16.362C18 15.7202 18 14.8802 18 13.2V10.8C18 9.11984 18 8.27976 17.673 7.63803C17.3854 7.07354 16.9265 6.6146 16.362 6.32698C15.7202 6 14.8802 6 13.2 6H10.8C9.11984 6 8.27976 6 7.63803 6.32698C7.07354 6.6146 6.6146 7.07354 6.32698 7.63803C6 8.27976 6 9.11984 6 10.8V13.2C6 14.8802 6 15.7202 6.32698 16.362C6.6146 16.9265 7.07354 17.3854 7.63803 17.673C8.27976 18 9.11984 18 10.8 18ZM10 10H14V14H10V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        }
                     Personalized AI-Recommended Results
                  </h3>

                  <ul className={styles.recommendationsList} style={{ listStyleType: 'none', padding: 0 }}>
                     {
                        recommendations.map((result, index) => {
                           const isNew = previousRecommendations.length > 0 && !previousRecommendations.some(prev => prev.uid === result.uid);

                           return (
                              <li key={result.uid} className={`${isNew ? styles.newRecommendation : ''} `}>
                                 <div className={styles.recommendationItem}>
                                    <div className={styles.recommendationContent}>
                                       <div className={styles.titleContainer}>
                                          <a
                                             className={styles.title}
                                             href={result.url}
                                             target="_blank"
                                             rel="noreferrer"
                                             dangerouslySetInnerHTML={{ __html: result.title }}
                                             onClick={(e) => handleClick(e, result)}
                                          />
                                          {
                                             isNew && 
                                             <span className={styles.newItemLabel}>
                                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>
                                                   New
                                                </span>
                                          }
                                       </div>
                                       <p className={styles.description} dangerouslySetInnerHTML={{ __html: result.description }} />
                                       <p className={styles.url}>{result.url}</p>
                                    </div>

                                    <div className={styles.recommendationDetails}>
                                       {
                                          result.lastmodified ?
                                             <div className={styles.detail} title="Last modified">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-event"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M16 3l0 4" /><path d="M8 3l0 4" /><path d="M4 11l16 0" /><path d="M8 15h2v2h-2z" /></svg>
                                                <span className={styles.detailText}>{dayjs(new Date(result.lastmodified)).utc().format('MMM DD, YYYY')}</span>
                                             </div>
                                             :
                                             null
                                       }

                                       {
                                          result.contenttype.length ?
                                             <div className={styles.detail} title="Content type">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-file"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></svg>
                                                <span className={styles.detailText}>{result.contenttype}</span>
                                             </div>
                                             :
                                             null
                                       }

                                       {
                                          result.colname ?
                                             <div className={styles.detail} title="Collection">
                                                <svg className={styles.collectionIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 4l-8 4l8 4l8 -4l-8 -4" /><path d="M4 12l8 4l8 -4" /><path d="M4 16l8 4l8 -4" /></svg>
                                                <span className={styles.detailText}>{result.colname}</span>
                                             </div>
                                             :
                                             null
                                       }
                                    </div>
                                 </div>
                              </li>
                           );
                        })
                     }
                  </ul>
               </div>
         }
      </div>
   );
}


export default Recommendations;
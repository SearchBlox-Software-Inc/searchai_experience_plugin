import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

import usePluginSettingsStore from '../../stores/pluginSettingsStore';
import useRecommendationsStore from '../../stores/recommendationsStore';
import useAssistStore from '../../stores/assistStore';
import * as defaults from '../common/Defaults';
import { getDocumentClickCount, getEmailViewer, getResults } from '../common/SbCore';
import { toggleFilter } from '../facetFilters/utils/facetFilterUtils';

import styles from './styles/resultItem.module.scss';
import assistButtonStyles from '../aiAssist/styles/assistButton.module.scss';


// ==============================================================================================


dayjs.extend(utc);
dayjs.extend(LocalizedFormat);


// ----------------------------------------------------------------------------------------------


function ResultItem({ result, highlight, setOverlayResult, setOverlayShown }) {

   const [thumbnailError, setThumbnailError] = useState(false);
   const [apiImagePath, setApiImagePath] = useState('');
   
   const updateRecentResultClicks = useRecommendationsStore(state => state.updateRecentResultClicks);
   
   const recommendationsEnabled = usePluginSettingsStore(state => state.recommendationsEnabled);
   const assistEnabled = usePluginSettingsStore(state => state.assistEnabled);
   const llmFieldsShown = usePluginSettingsStore(state => state.llmFieldsShown);
   const llmFieldsMode = usePluginSettingsStore(state => state.llmFieldsMode);

   const selectedResults = useAssistStore(state => state.selectedResults);
   const toggleResultForAssist = useAssistStore(state => state.toggleSelectedResult);


   // ------------------------------


   const urlParameters = { ...queryString.parse(window.location.search) };

   const {
      colname,
      contenttype,
      lastmodified,
      title,
      description,
      context,
      url,
      displayURL,
      contentURL,
      thumbnail,
      isStructured
   } = formatResultFields(result);

   // size = size ? formatSize(size) : '';    

   const isDB = ['db', 'csv', 'mongodb', 'product_discovery'].includes(contenttype);
   const isEmail = contenttype == 'email';
   const isPDF = defaults.pdfOverlay && contenttype == 'pdf' && url[0] !== '/' && url[1] !== ':' && url[0] !== '\\' && url.substring(0, 2) !== 'db';
   const isVideo = ['mpeg', 'mp4', 'flv', 'mpg'].includes(contenttype);
   const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(contenttype);
   const assistHidden = ["mp3","gif", "wav", "ogg", "m4a", "aac", "flac", "wma", "m4b", "m4p", "m4b", "m4p", "aiff", "aif", "aiffc", "aifc", "mid"].includes(contenttype) || isVideo || !defaults.assist.enabled || !assistEnabled;


   // ------------------------------


   useEffect(() => {
      if ((result.contenttype && result.contenttype.toLowerCase() == 'ex_image') && result.uid && result.col) {
         const configuredDomain = defaults.pluginDomain;
         
         fetch(`${configuredDomain}/ui/v1/view-extracted-image/click/${result.uid}?colId=${result.col}`)
            .then(response => response.json())
            .then(data => {
               if (data && data.imagedata) {
                  setApiImagePath(data.imagedata);
               }
            })
            .catch(error => {
               console.error('Error fetching image path:', error);
               setThumbnailError(true);
            });
      }
   }, [result.contenttype, result.uid, result.col]);


   function handleClick(e, title) {
      if (isEmail) {
         e.preventDefault();
         const emailObj = { url: uid, col: col };

         getEmailViewer(emailObj)
            .then(response => {
               if (!response.data)
                  throw new Error('email viewer error');
               else if (Object.keys(response.data).length) {
                  setOverlayResult({ ...response.data, contenttype: 'email' });
                  setOverlayShown(true);
               }
            });
      } else if (isPDF || isDB || isStructured) {
         e.preventDefault();
         setOverlayResult(result);
         setOverlayShown(true);
         
         if (isPDF)
            getDocumentClickCount(result);

      } else {
         getDocumentClickCount(result);
      }
      

      if (recommendationsEnabled) {
         updateRecentResultClicks(title);
      }
   }


   function handleMoreLikeThis(e, uid, col) {
      e.preventDefault();

      const urlParameters = {...queryString.parse(window.location.search)};

      urlParameters.mlt_id = uid;
      urlParameters.mlt_col = col;
      urlParameters.page = 1;
      urlParameters.XPC = 1;

      if (defaults.defaultCollections.length) {
         urlParameters.col = [...defaults.defaultCollections];
      }

      getResults(urlParameters);
   }


   // ------------------------------


   const isSelectedForAssist = selectedResults?.some(selectedResult => selectedResult.uid === result.uid && selectedResult.url === result.url && selectedResult.title === result.title);
   const assistDisabled = !isSelectedForAssist && selectedResults?.length >= defaults.assist.limit;

   
   const generatedTitleExists = result['original_title'];
   const generatedDescriptionExists = result['original_description'];
   const generatedTopicsExists = result['original_topics'];

   const anyGeneratedFieldsExists = generatedTitleExists || generatedDescriptionExists || generatedTopicsExists;


   const titleToDisplay = generatedTitleExists ? 
      (
         llmFieldsShown ? 
            (llmFieldsMode === 'replace' ? title : `${result['original_title']}`) 
            : 
            result['original_title']
      ) 
      : 
      title;

   const descriptionToDisplay = generatedDescriptionExists ?
      (
         llmFieldsShown ? 
            (llmFieldsMode === 'replace' ? description : result['original_description']) 
            : 
            result['original_description']
      ) 
      : 
      description;

   return (
      <div className={`${styles.result} ${highlight ? '' : styles.noHighlight}`}>
         <div className={styles.resultContent}>
            <div className={styles.resultFields}>

               <span>
                  <a 
                     href={!(isDB || isEmail || isPDF || isStructured) ? contentURL : ''} 
                     className={styles.resultTitle}
                     target="_blank" 
                     dangerouslySetInnerHTML={{ __html: titleToDisplay }} 
                     onClick={(e) => handleClick(e, titleToDisplay)} 
                     rel="noreferrer"
                  />

                  {
                     !assistHidden && 
                        <button 
                           className={`${assistButtonStyles.assistBtn} ${isSelectedForAssist ? assistButtonStyles.active : (assistDisabled ? assistButtonStyles.disabled : '')}`} 
                           onClick={() => toggleResultForAssist(result)} 
                           disabled={assistDisabled}
                           title={assistDisabled ? 'Assist disabled' : (isSelectedForAssist ? 'Remove from Assist' : 'Add to Assist')}
                        >
                           {
                              isSelectedForAssist ? 
                                 <svg  xmlns="http://www.w3.org/2000/svg"  width="20"  height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
                                 :
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cpu"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" /><path d="M9 9h6v6h-6z" /><path d="M3 10h2" /><path d="M3 14h2" /><path d="M10 3v2" /><path d="M14 3v2" /><path d="M21 10h-2" /><path d="M21 14h-2" /><path d="M14 21v-2" /><path d="M10 21v-2" /></svg>
                           }
                           SearchAI Assist
                        </button>
                  }

                  {
                     (contenttype == 'html' && urlParameters.query !== '*') ? 
                        <button className={styles.moreLikeThis} title="More like this"
                           onClick={(e) => handleMoreLikeThis(e, result.uid, result.col)}
                        >
                           <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-circles-relation"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9.183 6.117a6 6 0 1 0 4.511 3.986" /><path d="M14.813 17.883a6 6 0 1 0 -4.496 -3.954" /></svg>
                        </button>
                        :
                        null
                  }
               </span>


               {
                  isImage ? 
                     <a href={contentURL} target="_blank" className={styles.resultImage} rel="noreferrer">
                        <img src={contentURL} alt={title} loading="lazy" />
                     </a>
                     :
                     null
               }

               {
                  isVideo ? 
                     <video className={styles.resultVideo} controls>
                        <source src={contentURL} type={`video/${contenttype}`} />
                     </video>
                     :
                     null
               }

               <div className={styles.descriptionContainer}>
                  <p className={styles.resultDescription} dangerouslySetInnerHTML={{ __html: descriptionToDisplay}}/>
                  <div className={styles.resultImageContainer}>
                     {
                        apiImagePath &&
                           <div className={styles.resultImageSvg}>
                              <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7583 0.750097C16.4689 0.745795 17.1729 0.884287 17.8293 1.15715C18.4858 1.42999 19.0812 1.83157 19.5815 2.33783C20.0817 2.84407 20.4769 3.44493 20.7449 4.10519C21.0129 4.76543 21.1485 5.47241 21.1443 6.1853C21.1401 6.89819 20.9961 7.60349 20.7203 8.26045C20.4455 8.9151 20.045 9.50922 19.5412 10.0082L11.4822 18.1524L11.4754 18.159C10.8671 18.7555 10.0857 19.2189 9.15886 19.2373C8.21636 19.2561 7.39193 18.8102 6.72174 18.1381C5.91136 17.3254 5.68571 16.3423 5.80354 15.4664C5.91409 14.6445 6.31945 13.93 6.76671 13.4628L6.77354 13.4557L13.2747 6.87675C13.5658 6.58212 14.0407 6.5793 14.3353 6.87044L15.0466 7.57333C15.3413 7.86448 15.3441 8.33934 15.0529 8.63397L8.56738 15.1971C8.44404 15.3286 8.3128 15.5649 8.28123 15.7997C8.26687 15.9064 8.27488 15.9977 8.29992 16.0775C8.32376 16.1535 8.37372 16.2542 8.49207 16.3729C8.83879 16.7206 9.04311 16.7391 9.10912 16.7378C9.19021 16.7362 9.39502 16.6956 9.71903 16.3799L17.7739 8.23989L17.779 8.23486C18.0499 7.96733 18.2664 7.64724 18.4152 7.29271C18.5641 6.93816 18.6421 6.55669 18.6444 6.17052C18.6467 5.78436 18.5731 5.40188 18.4285 5.0454C18.2838 4.68895 18.071 4.36605 17.8032 4.09506C17.5355 3.8241 17.2181 3.61043 16.8698 3.46567C16.5216 3.32093 16.149 3.24778 15.7735 3.25005C15.398 3.25232 15.0263 3.32999 14.6798 3.47893C14.3334 3.62789 14.0186 3.84538 13.7542 4.11955L13.7489 4.12501L5.63139 12.3396L5.62494 12.346C5.19479 12.7689 4.8512 13.2749 4.61488 13.835C4.37855 14.3952 4.25443 14.9979 4.25012 15.608C4.24581 16.2181 4.3614 16.8226 4.58984 17.3864C4.7994 17.9036 5.31873 18.6255 5.78425 19.0965C6.26632 19.5844 7.0868 20.2047 7.57895 20.409C8.13199 20.6385 8.72402 20.7542 9.32077 20.7499C9.91752 20.7456 10.5078 20.6213 11.0575 20.3838C11.6072 20.1463 12.1057 19.8002 12.5237 19.3648L12.5299 19.3583L20.4623 11.331C20.7535 11.0363 21.2283 11.0335 21.523 11.3247L22.2343 12.0276C22.5289 12.3187 22.5317 12.7936 22.2406 13.0882L14.3206 21.103C13.6745 21.7742 12.9026 22.31 12.049 22.6788C11.1924 23.0488 10.2712 23.2431 9.33887 23.2498C8.40657 23.2566 7.48259 23.0757 6.62078 22.7181C5.69809 22.3352 4.60526 21.4602 4.00601 20.8538C3.39021 20.2306 2.64342 19.2398 2.27283 18.3252C1.9211 17.4572 1.74356 16.5276 1.75018 15.5903C1.7568 14.6531 1.94746 13.7261 2.31147 12.8633C2.67425 12.0034 3.20221 11.2237 3.86555 10.5699L11.9603 2.37823C12.4533 1.86865 13.0418 1.46191 13.6924 1.1822C14.3455 0.901404 15.0478 0.754399 15.7583 0.750097Z" fill="#000000"></path> </g></svg>
                           </div>
                     }
                        {
                           contenttype == 'html' && thumbnail && !thumbnailError ?
                              <a className={styles.resultThumbnail} href={contentURL} target="_blank" rel="noreferrer">
                                 <img src={thumbnail} alt={result['og:title'] ? result['og:title'] : title} loading="lazy" onError={() => setThumbnailError(true)} />
                              </a>
                              :
                              null
                        }
                        {
                           contenttype == 'ex_image' && apiImagePath && !thumbnailError ?
                              <a className={styles.resultThumbnail} href={contentURL} target="_blank" rel="noreferrer">
                                 <img src={`data:image/jpeg;base64,${apiImagePath}`} alt={title} loading="lazy" onError={() => setThumbnailError(true)} />
                              </a>
                              :
                              null
                        }
                     </div>
               </div>

               {
                  defaults.urlDisplay ? <p className={styles.resultUrl}>{displayURL}</p> : null
               }
               
               {
                  llmFieldsShown && llmFieldsMode !== 'both' && result.topics &&
                     <ResultTopics topics={result.topics} />
               }
      
            </div>
               <div className={styles.resultImageContainer}>
               {
                  apiImagePath &&
                     <div className={styles.resultImageSvg}>
                        <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7583 0.750097C16.4689 0.745795 17.1729 0.884287 17.8293 1.15715C18.4858 1.42999 19.0812 1.83157 19.5815 2.33783C20.0817 2.84407 20.4769 3.44493 20.7449 4.10519C21.0129 4.76543 21.1485 5.47241 21.1443 6.1853C21.1401 6.89819 20.9961 7.60349 20.7203 8.26045C20.4455 8.9151 20.045 9.50922 19.5412 10.0082L11.4822 18.1524L11.4754 18.159C10.8671 18.7555 10.0857 19.2189 9.15886 19.2373C8.21636 19.2561 7.39193 18.8102 6.72174 18.1381C5.91136 17.3254 5.68571 16.3423 5.80354 15.4664C5.91409 14.6445 6.31945 13.93 6.76671 13.4628L6.77354 13.4557L13.2747 6.87675C13.5658 6.58212 14.0407 6.5793 14.3353 6.87044L15.0466 7.57333C15.3413 7.86448 15.3441 8.33934 15.0529 8.63397L8.56738 15.1971C8.44404 15.3286 8.3128 15.5649 8.28123 15.7997C8.26687 15.9064 8.27488 15.9977 8.29992 16.0775C8.32376 16.1535 8.37372 16.2542 8.49207 16.3729C8.83879 16.7206 9.04311 16.7391 9.10912 16.7378C9.19021 16.7362 9.39502 16.6956 9.71903 16.3799L17.7739 8.23989L17.779 8.23486C18.0499 7.96733 18.2664 7.64724 18.4152 7.29271C18.5641 6.93816 18.6421 6.55669 18.6444 6.17052C18.6467 5.78436 18.5731 5.40188 18.4285 5.0454C18.2838 4.68895 18.071 4.36605 17.8032 4.09506C17.5355 3.8241 17.2181 3.61043 16.8698 3.46567C16.5216 3.32093 16.149 3.24778 15.7735 3.25005C15.398 3.25232 15.0263 3.32999 14.6798 3.47893C14.3334 3.62789 14.0186 3.84538 13.7542 4.11955L13.7489 4.12501L5.63139 12.3396L5.62494 12.346C5.19479 12.7689 4.8512 13.2749 4.61488 13.835C4.37855 14.3952 4.25443 14.9979 4.25012 15.608C4.24581 16.2181 4.3614 16.8226 4.58984 17.3864C4.7994 17.9036 5.31873 18.6255 5.78425 19.0965C6.26632 19.5844 7.0868 20.2047 7.57895 20.409C8.13199 20.6385 8.72402 20.7542 9.32077 20.7499C9.91752 20.7456 10.5078 20.6213 11.0575 20.3838C11.6072 20.1463 12.1057 19.8002 12.5237 19.3648L12.5299 19.3583L20.4623 11.331C20.7535 11.0363 21.2283 11.0335 21.523 11.3247L22.2343 12.0276C22.5289 12.3187 22.5317 12.7936 22.2406 13.0882L14.3206 21.103C13.6745 21.7742 12.9026 22.31 12.049 22.6788C11.1924 23.0488 10.2712 23.2431 9.33887 23.2498C8.40657 23.2566 7.48259 23.0757 6.62078 22.7181C5.69809 22.3352 4.60526 21.4602 4.00601 20.8538C3.39021 20.2306 2.64342 19.2398 2.27283 18.3252C1.9211 17.4572 1.74356 16.5276 1.75018 15.5903C1.7568 14.6531 1.94746 13.7261 2.31147 12.8633C2.67425 12.0034 3.20221 11.2237 3.86555 10.5699L11.9603 2.37823C12.4533 1.86865 13.0418 1.46191 13.6924 1.1822C14.3455 0.901404 15.0478 0.754399 15.7583 0.750097Z" fill="#000000"></path> </g></svg>
                     </div>
               }
               {/* thumbnail shown in desktop sizes */}
               {
                  contenttype == 'html' && thumbnail && !thumbnailError ?
                     <a className={styles.resultThumbnail} href={contentURL} target="_blank" rel="noreferrer">
                        <img src={thumbnail} alt={result['og:title'] ? result['og:title'] : title} loading="lazy" onError={() => setThumbnailError(true)} />
                     </a>
                     :
                     null
               }
               {
                  contenttype == 'ex_image' && apiImagePath && !thumbnailError ?
                     <a className={styles.resultThumbnail} href={contentURL} target="_blank" rel="noreferrer">
                        <img src={`data:image/jpeg;base64,${apiImagePath}`} alt={title} loading="lazy" onError={() => setThumbnailError(true)} />
                     </a>
                     :
                     null
               }
            </div>
         </div>

         {
            llmFieldsShown && llmFieldsMode === 'both' && anyGeneratedFieldsExists &&
               <div className={styles.llmFields}>
                  {
                     generatedTitleExists &&
                        <a href={contentURL} target="_blank" rel="noreferrer" className={styles.resultTitle} dangerouslySetInnerHTML={{ __html: title }}/>
                  }

                  {
                     generatedDescriptionExists &&
                        <p className={styles.resultDescription} dangerouslySetInnerHTML={{ __html: description }}/>
                  }

                  {
                     result.topics &&
                        <ResultTopics topics={result.topics} />
                  }
               </div>
         }

         <div className={styles.resultDetails}>
               {
                  lastmodified ? 
                     <div className={styles.detail} title="Last modified">
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-event"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M16 3l0 4" /><path d="M8 3l0 4" /><path d="M4 11l16 0" /><path d="M8 15h2v2h-2z" /></svg>
                        <span className={styles.detailText}>{lastmodified}</span>
                     </div>
                     :
                     null
               }

               {
                  contenttype.length ? 
                     <div className={styles.detail} title="Content type">
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-file"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></svg>
                        <span className={styles.detailText}>{contenttype}</span> 
                     </div>
                     : 
                     null
               }
               
               {
                  colname ?
                     <div className={styles.detail} title="Collection">
                        <svg className={styles.collectionIcon} xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-8 4l8 4l8 -4l-8 -4" /><path d="M4 12l8 4l8 -4" /><path d="M4 16l8 4l8 -4" /></svg>
                        <span className={styles.detailText}>{colname}</span>
                     </div>
                     :
                     null
               }
               
         </div>
      </div>
   );
}


export default ResultItem;


ResultItem.propTypes = {
   result: PropTypes.object,
   highlight: PropTypes.bool,
   setOverlayResult: PropTypes.func,
   setOverlayShown: PropTypes.func
};


// ------------------------------


function ResultTopics({ topics }) {
   
   const [showAllTopics, setShowAllTopics] = useState(false);


   return (
      <ul className={styles.resultTopics}>
         {
            topics.split(',').slice(0, showAllTopics ? undefined : 5).map((topic, index) => (
               <li key={index} className={styles.topic}>
                  <button 
                     className={styles.topicBtn} 
                     onClick={() => toggleFilter('topics', topic.toLowerCase())}
                     aria-label={`Filter by topic: ${topic.trim()}`}
                  >
                     {topic.trim()}
                  </button>
               </li>
            ))
         }

         <li>
            {
               topics.split(',').length > 5 && (
                  <button
                     className={styles.toggleTopicsBtn}
                     onClick={() => setShowAllTopics(!showAllTopics)}
                     aria-label={`Show ${showAllTopics ? 'less' : 'all'} topics`}
                  >
                     Show&nbsp;{showAllTopics ? 'Less' : 'All'}
                  </button>
               )
            }
         </li>
      </ul>
   );
}


// function formatSize(size, decimal) {
//    if (!+size)
//       return '0 Bytes';
   
//    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//    const k = 1024;
   
//    const factor = Math.floor(Math.log(size)/Math.log(k));
   
//    return `${parseFloat(size / Math.pow(k, factor)).toFixed(decimal)} ${sizes[factor]}`;
// }


function formatContentURL({url, col, uid}) {
   if (url) {
      const configuredDomain = document.getElementById('sb_plugin_domain');
      const pluginDomain = configuredDomain && configuredDomain.value.length ? configuredDomain : defaults.pluginDomain;
      let contentURL = '';
      
      if ((['/', ':', '\\'].includes(url[0])) || ([':'].includes(url[1]))) {
         contentURL = `${pluginDomain}/ui/v1/file/download?url=${encodeURIComponent(url)}&col=${col}`;
      } else if (url.startsWith('db')) {
         contentURL = `${pluginDomain}/ui/v1/db-viewer/get/?col=${col}&uid=${uid}`;
      } else {
         contentURL = url;
      }
      
      contentURL = contentURL.replace(/&amp;/g, '&');
      
      return contentURL;
   }
}


function formatTitle({title, contenttype, uid}) {
   let formattedTitle = '';
   
   if (title && title.length) {
      formattedTitle = decodeURIComponent(title.replace(/%([^\d].)/g, '%25$1')
         .replace(/&#0;/g,'')
         .replace(/&amp;/g, '&'));
   } else if (contenttype == 'db' || contenttype == 'mongodb') {
      formattedTitle = uid;
   } else {
      formattedTitle = 'Untitled';
   }
   
   return formattedTitle;
}


function formatContext(context) {
   return context ? context.replace(/(&amp;amp;)|(amp;)|(&amp;nbsp;)|(&amp;)/g, "&").replace(/&amp;amp;amp;/g, "&").replace(/&quot;/g, "\"").replace(/&nbsp;/g,"") : '';
}


function formatResultFields(result) {
   let {
      colname,
      contenttype,
      lastmodified,
      title,
      description,
      context,
      url,
      displayURL,
      contentURL,
      thumbnail,
      isStructured
   } = { ...result };

   title = formatTitle(result);

   description = description ? description : formatContext(context);

   description = description.replace(
      /\b(?:skip to main content|skip to content|skip to navigation|skip to main navigation)\b/gi,
      ''
   );

   if (defaults.descriptionCharLimit.enabled && description.length > defaults.descriptionCharLimit.limit) {
      description =
         description
            .substring(0, defaults.descriptionCharLimit.limit)
            .split(' ')
            .slice(0, -1)
            .join(' ') + '...';
   }

   contentURL = formatContentURL(result);

   displayURL = new DOMParser().parseFromString(url, 'text/html').body.textContent;

   lastmodified = lastmodified
      ? dayjs(new Date(lastmodified)).utc().format('MMM DD, YYYY')
      : '';

   contenttype = contenttype && contenttype.length ? contenttype.toLowerCase() : '';
   thumbnail = result['og:image'] ? result['og:image'] : '';

   return {
      colname,
      contenttype,
      lastmodified,
      title,
      description,
      context,
      url,
      displayURL,
      contentURL,
      thumbnail,
      isStructured
   };
}
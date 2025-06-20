import { useState } from 'react';
import PropTypes from 'prop-types';

import { loadMoreButton } from '../common/Defaults';
import useSearchStore from '../../stores/searchStore';

import ResultItem from './ResultItem';
import LoadMoreButton from '../pagination/LoadMoreButton';
import PaginationWithPageNumbers from '../pagination/PaginationWithNumbers';

import DbOverlay from '../basicComponents/overlay/DBOverlay';
import EmailOverlay from '../basicComponents/overlay/EmailOverlay';
import PDFViewer from '../basicComponents/overlay/PDFViewer';
import Overlay from '../basicComponents/overlay/index';

import resultsStyles from './styles/results.module.scss';


//  ------------------------------


function DefaultResults({ loadMoreActive, setLoadMoreActive }) {

   const [overlayShown, setOverlayShown] = useState(false);
   const [overlayResult, setOverlayResult] = useState({});


   //  ------------------------------


   const response = useSearchStore(state => state.response);
   const { results, resultInfo } = response;


   //  ------------------------------
   

   function handleClose() {
      setOverlayShown(false);
      setOverlayResult({});
   }


   function getDBOverlayTitle() {
      const { title, uid } = overlayResult;

      return title?.trim().length ? title : uid;
   }


   function getPDFOverlayTitle() {
      const { url, filename } = overlayResult;

      return (
         <a href={url} target='_blank' rel="noreferrer">
            { filename || url }
            &nbsp; <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M13 3L16.293 6.293 9.293 13.293 10.707 14.707 17.707 7.707 21 11 21 3z"></path><path d="M19,19H5V5h7l-2-2H5C3.897,3,3,3.897,3,5v14c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2v-5l-2-2V19z"></path></svg>
         </a>
      );
   }


   //  ------------------------------


   const currentContentType = overlayResult.contenttype ? overlayResult.contenttype.toLowerCase() : undefined;
   
   const contentTypeIsDB = ['db', 'csv', 'mongodb'].includes(currentContentType) || overlayResult.isStructured;
   const contentTypeIsPDF = currentContentType == 'pdf';
   const contentTypeIsEmail = currentContentType == 'email';
   
   const overlayTitle = contentTypeIsDB ? 
      getDBOverlayTitle() 
      :
      contentTypeIsPDF ? 
         getPDFOverlayTitle() 
         : 
         contentTypeIsEmail ? 
            overlayResult.subject 
            : 
            '';

            
   const overlayContent = contentTypeIsDB ? 
      <DbOverlay overlayResult={overlayResult} /> 
      :
      contentTypeIsPDF ? 
         <PDFViewer overlayResult={overlayResult} /> 
         : 
         contentTypeIsEmail ? 
            <EmailOverlay overlayResult={overlayResult} /> 
            : 
            null;
   

   return (
      <>
         <ul className={resultsStyles.resultsList}>
            {
               results.map((result, i) => (
                  <li key={`result-${i}`}>
                     <ResultItem
                        result={result}
                        highlight={resultInfo.highlight}
                        setOverlayShown={setOverlayShown}
                        setOverlayResult={setOverlayResult}
                     />
                  </li>
               ))
            }
         </ul>


         {
            resultInfo.hits && parseInt(resultInfo.hits, 10) > 0 ?
               loadMoreButton ?
                  <LoadMoreButton loadMoreActive={loadMoreActive}
                     setLoadMoreActive={setLoadMoreActive}
                     lastPage={resultInfo.lastPage ? parseInt(resultInfo.lastPage, 10) : Math.ceil(parseInt(resultInfo.hits, 10) / 10)}
                  />
                  :
                  <PaginationWithPageNumbers
                     currentPage={parseInt(resultInfo.currentPage, 10)}
                     lastPage={resultInfo.lastPage ? parseInt(resultInfo.lastPage, 10) : Math.ceil(parseInt(resultInfo.hits, 10) / 10)}
                  />
               :
               null
         }


         <Overlay open={overlayShown}>
            <Overlay.Title onClose={handleClose}>
               {overlayTitle}
            </Overlay.Title>
            
            <Overlay.Content>
               {overlayContent}
            </Overlay.Content>
         </Overlay>
      </>
   );
}


DefaultResults.propTypes = {
   loadMoreActive: PropTypes.bool,
   setLoadMoreActive: PropTypes.func
};


export default DefaultResults;
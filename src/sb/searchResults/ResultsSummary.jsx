import useSearchStore from '../../stores/searchStore';

import resultsStyles from './styles/results.module.scss';



// ==========================================================================================


function ResultsSummary() {
   
   const response = useSearchStore(state => state.response);
   const { query, hits } = response.resultInfo;


   // ------------------------------


   return (
      <p className={resultsStyles.resultsSummary}>
         <strong>{hits.toLocaleString()}</strong> result{hits != 1 ? 's' : null} found

         {
            query &&
               <span> for <strong dangerouslySetInnerHTML={{ __html: decodeURIComponent(query.replace(/\\/g, '')) }} /></span>
         }
      </p>
   );
}


export default ResultsSummary;
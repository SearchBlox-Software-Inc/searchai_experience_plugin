import PropTypes from 'prop-types';

import { getFeaturedResultClickCount } from '../common/SbCore';

import useSearchStore from '../../stores/searchStore';

import styles from './featuredResults.module.scss';


// ==========================================================================================


function FeaturedResults() {

   const response = useSearchStore(state => state.response);
   const { featuredResults: propFeaturedResults } = response;
   const featuredResults = Array.isArray(propFeaturedResults) ? [...propFeaturedResults] : [propFeaturedResults];


   // ------------------------------


   if (!featuredResults.length) {
      return null;
   }


   return (
      <ul className={styles.featuredResultsContainer}>
         {
            featuredResults.map(({ title, url, imageURL, description, uid }, i) => (
               <li key={`featured-result__${i}`} className={`${styles.result}`}>
                  <span className={styles.label}>FEATURED</span>

                  <div className={styles.resultContent}>
                     {
                        imageURL?.length > 0 &&
                           <a className={styles.thumbnail} href={url.replace(/&/g, "&")} target="_blank" rel="noreferrer">
                              <img 
                                 src={imageURL.replace(/&/g, "&")}
                                 alt={title.replace(/&/g, "&") + "_image"}
                                 loading="lazy"
                              />
                           </a>
                     }

                     <div className={styles.resultFields}>
                        {
                           title ?
                              <a href={url.replace(/&/g, "&")}
                                 target="_blank"
                                 className={styles.title}
                                 onClick={() => getFeaturedResultClickCount({ title, url, imageURL, description, uid })}
                                 rel="noreferrer"
                              >
                                 {title.replace(/&/g, "&")}
                              </a>
                              :
                              null
                        }

                        <div className={styles.descriptionContainer}>
                           {
                              imageURL?.length > 0 &&
                                 <a className={styles.thumbnail} href={url.replace(/&/g, "&")} target="_blank" rel="noreferrer">
                                    <img 
                                       src={imageURL.replace(/&/g, "&")}
                                       width="100px"
                                       alt={title.replace(/&/g, "&") + "_image"}
                                       loading="lazy"
                                    />
                                 </a>
                           }

                           <p className={styles.description}>
                              {description.replace(/&/g, "&")}
                           </p>
                        </div>

                        <p className={styles.url}>
                           {url.replace(/&amp;/g, "&")}
                        </p>
                     </div>
                  </div>
               </li>
            ))
         }
      </ul>
   );
}


export default FeaturedResults;


FeaturedResults.propTypes = {
   featuredResults: PropTypes.array
};
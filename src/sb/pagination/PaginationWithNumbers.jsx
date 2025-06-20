import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

import { getResults } from '../common/SbCore.js';

import styles from './pagination.module.scss';


// ==========================================================================================


function PaginationWithPageNumbers({ currentPage, lastPage }) {

   const [pagesArray, setPagesArray] = useState([]);


   // ---------------------------------


   useEffect(() => {
      setPagesArray(generatePagesArray(currentPage, lastPage));
   }, [currentPage, lastPage]);


   // ---------------------------------

   function handlePageClick(page) {
      const urlParameters = { ...queryString.parse(window.location.search) };

      if (page == urlParameters.page) {
         return;
      }

      if (urlParameters.mlt_id) {
         urlParameters.XPC = page;
      }

      urlParameters.page = page;
      getResults(urlParameters);
   }


   // ---------------------------------

   
   if (lastPage == 1) {
      return null;
   }


   const urlParameters = { ...queryString.parse(window.location.search) };


   return (
      <nav className={styles.pagination} role="navigation" aria-label="Page navigation">
         <ul>
            {
               currentPage == 1 ?
                  null
                  :
                  <>
                     {/* <li>
                <button title="Go to the first page" onClick={() => handlePageClick(1)}>
                  First
                </button>
              </li> */}
                     <li>
                        <button className={styles.paginationPrevious} title="Go to the previous page" onClick={() => handlePageClick(currentPage - 1)}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
                        </button>
                     </li>
                  </>
            }
            {
               pagesArray.map((page, i) => (
                  <li key={`page-${i}`}>
                     <button className={(urlParameters.page == page || !urlParameters.page && page == 1) ? styles.active : ''}
                        tabIndex={urlParameters.page == page ? '-1' : '0'}
                        aria-label={`Go to page ${page}`}
                        aria-current={(urlParameters.page == page || !urlParameters.page && page == 1)}
                        onClick={() => handlePageClick(page)}
                     >
                        {page}
                     </button>
                  </li>
               ))
            }
            {
               currentPage == lastPage ?
                  null
                  :
                  <>
                     <li>
                        <button className={styles.paginationNext} title="Go to the next page" onClick={() => handlePageClick(currentPage + 1)}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg>
                        </button>
                     </li>
                     {/* <li>
                <button title="Go to the last page" onClick={() => handlePageClick(lastPage)}>
                  Last
                </button>
              </li> */}
                  </>
            }
         </ul>
      </nav>
   );
}


PaginationWithPageNumbers.propTypes = {
   currentPage: PropTypes.number,
   lastPage: PropTypes.number,
};


export default PaginationWithPageNumbers;


// ==========================================================================================


function generatePagesArray(currentPage, lastPage) {
   const pages = [];

      if (currentPage <= 3) {
         let i = 1;
         const max = lastPage > 5 ? 5 : lastPage;

         while (i <= max) {
            pages.push(i);
            i++;
         }
      } else if (currentPage >= lastPage - 2) {
         let i = currentPage - 2;
         while (i <= lastPage) {
            pages.push(i);
            i++;
         }
      } else {
         let i = currentPage - 2;
         while (i < currentPage + 3) {
         pages.push(i);
         i++;
      }
   }

   return pages;
}
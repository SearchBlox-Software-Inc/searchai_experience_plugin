import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import styles from './styles/overlayTable.module.scss';


// ==========================================================================================


const DOM_PARSER = new DOMParser();
const FIELDS_TO_PARSE = ['headers', 'content', 'sdate', 'from', 'to', 'cc', 'bcc', 'subject', 'attachments'];


// ------------------------------------------------------------------------------------------


function EmailOverlay({ overlayResult }) {
   const [actualFields, setActualFields] = useState([]);
   const [showing, setShowing] = useState(false);


   // ------------------------------


   useEffect(() => {
      setActualFields(overlayResult);
   }, [overlayResult]);


   // ------------------------------
   
   const parsedFields = {};
   
   FIELDS_TO_PARSE.forEach(field => {
      parsedFields[field] = parseAndGetTextContent(actualFields[field]);
   });
   
   const { headers, content, sdate, from, to, cc, bcc, subject, attachments } = parsedFields;
   
   
   // ------------------------------


   return (
      <>
         <button className={styles.headersToggle} onClick={() => setShowing(!showing)}>
            { showing ? 'Show' : 'Hide'} Headers
         </button>
         
         <table className={styles.sbDbFields}>
            <thead>
               <tr>
                  <th scope="row">Sent date</th>
                  <td dangerouslySetInnerHTML={{ __html: sdate }} />
               </tr>

               <tr>
                  <th scope="row">From</th>
                  <td dangerouslySetInnerHTML={{ __html: from }} />
               </tr>

               <tr>
                  <th scope="row">To</th>
                  <td dangerouslySetInnerHTML={{ __html: to }} />
               </tr>

               <tr>
                  <th scope="row">CC</th>
                  <td dangerouslySetInnerHTML={{ __html: cc }} />
               </tr>

               <tr>
                  <th scope="row">BCC</th>
                  <td dangerouslySetInnerHTML={{ __html: bcc }} />
               </tr>

               <tr>
                  <th scope="row">Subject</th>
                  <td dangerouslySetInnerHTML={{ __html: subject }} />
               </tr>

               {
                  !showing ?
                     <tr>
                        <th scope="row">Headers</th>
                        <td>
                           {
                              headers.split('\n').map((item, index) => {
                                 return (
                                    <p key={index}>
                                       {item}
                                    </p>
                                 );
                              })
                           }
                        </td>
                  </tr>
                  : 
                  null
               
               }

               <tr>
                  <th scope="row">Attachments</th>
                  <td dangerouslySetInnerHTML={{ __html: attachments }} />
               </tr>

               <tr>
                  <th scope="row">Contents</th>
                  <td>
                     {
                        content.split('\n').map((item, index) => {
                           return (
                              <p key={index}>
                                 {item}
                              </p>
                           );
                        })
                     }
                  </td>
               </tr>
            </thead>
         </table>
      </>
   );
}


EmailOverlay.propTypes = {
   overlayResult: PropTypes.object
};


export default EmailOverlay;


// ------------------------------


function parseAndGetTextContent(field) {
   return DOM_PARSER.parseFromString(field, 'text/html').body.textContent;
}
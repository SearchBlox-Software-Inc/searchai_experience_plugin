import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { dataToBeDisplayed } from '../../common/Defaults';

import styles from './styles/overlayTable.module.scss';


// ==========================================================================================


const DOM_PARSER = new DOMParser();


// ------------------------------------------------------------------------------------------


function DbOverlay({ overlayResult }) {
   
   const [displayFields, setDisplayFields] = useState([]);

   // ------------------------------

   useEffect(() => {
      const actualFields = [...Object.keys(overlayResult)];
      let displayFields = [];

      const { col } = overlayResult;
      const fieldsObject = dataToBeDisplayed[col] || dataToBeDisplayed.other;

      displayFields = Object.keys(fieldsObject).map(field => ({
         field,
         display: fieldsObject[field],
      }));

      if (dataToBeDisplayed.displayAll) {
         for (const actualField of actualFields) {
            if (actualField !== 'source' && !displayFields.some(displayField => displayField.field === actualField)) {
               displayFields.push({
                  field: actualField,
                  display: actualField,
               });
            }
         }
      }

      setDisplayFields(displayFields);
   }, [overlayResult]);
   

   // ------------------------------
   

   return (
      <table className={styles.sbDbFields}>
         <tbody>
            {
               displayFields.map(row => {
                  if (row.field === 'isStructured') return null;
                  
                  const parsedContent = overlayResult[row.field] === 'db?url=' ? '' : overlayResult[row.field];
                  const sanitizedHTML = DOM_PARSER.parseFromString(parsedContent, 'text/html').body.textContent;

                  return (
                     <tr key={row.field}>
                        <th scope="row">{row.display}</th>
                        <td dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
                     </tr>
                  );
               })
            }
         </tbody>
      </table>
   );
}

// ------------------------------

DbOverlay.propTypes = {
   overlayResult: PropTypes.object,
};

// ------------------------------

export default DbOverlay;

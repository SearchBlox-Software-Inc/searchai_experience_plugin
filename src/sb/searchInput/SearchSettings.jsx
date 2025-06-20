import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import useSearchStore from '../../stores/searchStore'
import { getResults, getInitialUrlParameters } from '../common/SbCore';
import { assist, hybridSearchDefaults } from '../common/Defaults';
import useClickOutside from '../common/hooks/useClickOutside';

import commonStyles from '../css/common.module.scss';
import styles from './styles/searchSettings.module.scss';


// ==========================================================================================


const CUSTOM_MUI_STYLES = {
   color: '#382169',
   minWidth: '280px',
   marginBottom: '0',
   width: '100%',
   
   '& .MuiSlider-track': {
      backgroundColor: '#382169',
      borderColor: '#382169',
   },
   '& .MuiSlider-mark': {
      backgroundColor: '#5c38a1',
      // borderRadius: '50%',
      height: '8px',
      width: '2px',
   },
   '& .MuiSlider-rail': {
      backgroundColor: '#382169',
      opacity: '1',
   },
   '& .MuiSlider-valueLabel': {
      backgroundColor: '#382169',
      fontSize: '12px',
      padding: '0.25rem 0.5rem',
   },
   '& .MuiSlider-thumb': {
      backgroundColor: '#5c38a1',
   }
};

const CUSTOM_MUI_STYLES_2 = {
   ...CUSTOM_MUI_STYLES,
   '& .MuiSlider-rail': {
      backgroundColor: '#9c8ac2',
      opacity: '1',
   },
};


// ------------------------------------------------------------------------------------------


function SearchSettings({ parameters }) {

   const [settingsShown, setSettingsShown] = useState(false);
   const [vectorWeight, setVectorWeight] = useState(hybridSearchDefaults.vectorWeight || 0.2);
   const [vectorThreshold, setVectorThreshold] = useState(hybridSearchDefaults.vectorThreshold || 0.6);

   const searchSettingsDropdownRef = useRef(null);

   
   // ------------------------------


   useClickOutside(searchSettingsDropdownRef, handleClickOutsideSearchSettingsDropdown);


   useEffect(() => {
      if (parameters['v.weight']){
         setVectorWeight(parameters['v.weight']);
      }
   }, [parameters['v.weight']]);


   useEffect(() => {
      if (parameters['v.threshold']){
         setVectorThreshold(parameters['v.threshold']);
      }
   }, [parameters['v.threshold']]);


   
   // ------------------------------


   function handleClickOutsideSearchSettingsDropdown() {
      setSettingsShown(currentVal => {
         if (currentVal)
            return false;
      });
   }


   function applySettings() {
      const urlParameters = Object.keys(parameters).length > 0 ? parameters : getInitialUrlParameters('*');

      const { 'v.threshold': _, ...baseParams } = urlParameters;

      const updatedParameters = {
         ...baseParams,
         'v.weight': vectorWeight,
         query: urlParameters.query || '*'
      };

      if (vectorWeight !== 0) {
         updatedParameters['v.threshold'] = vectorThreshold;
      }

      getResults(updatedParameters);
      setSettingsShown(false);
   }


   // ------------------------------


   return (
      <div className={styles.searchSettings} ref={searchSettingsDropdownRef}>
         <button className={styles.toggle} onClick={() => setSettingsShown(shown => !shown)} title={`${settingsShown ? 'Hide' : 'Show'} Settings`}>
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-horizontal"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 6l8 0" /><path d="M16 6l4 0" /><path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 12l2 0" /><path d="M10 12l10 0" /><path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 18l11 0" /><path d="M19 18l1 0" /></svg>
         </button>

         {
            settingsShown ?
               <div className={`${commonStyles.popover} ${styles.dropdown}`}>
                  <h2>Search Settings</h2>

                  <div>
                     {/* Search Ratio */}
                     <div className={styles.settingRow}>
                        <div className={styles.settingLabel}>
                           Search Ratio
                        </div>

                        <div className={styles.settingValue}>
                           

                           <div>
                              <Slider
                                 aria-label="Vector Weight"
                                 value={vectorWeight}
                                 onChange={(e, value) => setVectorWeight(value)}
                                 step={0.1}
                                 min={0}
                                 max={1}
                                 marks={[
                                    { value: 0.5 }
                                 ]}
                                 sx={{
                                    ...CUSTOM_MUI_STYLES,
                                 }}
                              />
                           </div>

                           <div className={styles.searchRatioDisplay}>
                              <div className={styles.searchRatioDisplayItem}>
                                 <p className={`${styles.searchRatioDisplayLabel} ${vectorWeight == 1 ? styles.disabled : ''}`}>
                                    Keyword
                                 </p>
                                 <p className={`${styles.searchRatioDisplayValue} ${vectorWeight == 1 ? styles.disabled : ''}`}>
                                    <strong>{((1 - vectorWeight) * 100).toFixed(0)}<span style={{ fontSize: '12px'}}>%</span></strong>
                                 </p>
                              </div>

                              <div className={styles.searchRatioDisplayItem}>
                                 <p className={`${styles.searchRatioDisplayLabel} ${vectorWeight == 0 ? styles.disabled : ''}`}>
                                    Vector
                                 </p>
                                 <p className={`${styles.searchRatioDisplayValue} ${vectorWeight == 0 ? styles.disabled : ''}`}>
                                    <strong>{(vectorWeight * 100).toFixed(0)}<span style={{ fontSize: '12px'}}>%</span></strong>
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Vector Threshold */}
                     <div className={`${styles.settingRow} ${vectorWeight == 0 ? styles.disabled : ''}`}>
                        <div className={styles.settingLabel}>
                           Vector Threshold
                        </div>

                        <div className={styles.settingValue}>
                           <Slider
                              aria-label="Vector Threshold"
                              value={vectorThreshold}
                              onChange={(e, value) => setVectorThreshold(value)}
                              step={0.1}
                              min={0}
                              max={1}
                              marks={[
                                 { value: 0.5 },
                              ]}
                              valueLabelDisplay="auto"

                              disabled={vectorWeight == 0}
                              sx={{
                                 ...CUSTOM_MUI_STYLES_2,
                              }}
                           />

                           <div className={styles.searchRatioDisplay}>
                              <div className={styles.searchRatioDisplayItem}>
                                 <p className={styles.searchRatioDisplayValue}>
                                    <strong>{vectorThreshold}</strong>
                                 </p>
                              </div>

                           </div>
                        </div>
                        
                     </div>
                  
                  </div>

                  
                  {/* Actions */}
                  <div className={styles.actions}>
                     <button className={styles.cancelBtn} onClick={() => setSettingsShown(false)}>Cancel</button>
                     <button className={styles.applyBtn} onClick={applySettings}>Apply</button>
                  </div>
               </div>
               :
               null
         }
      </div>
   );
}

SearchSettings.propTypes = {
   parameters: PropTypes.object
};


export default SearchSettings;
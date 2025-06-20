import Switch from '@mui/material/Switch';
import queryString from 'query-string';
import { useRef, useState } from 'react';

import useClickOutside from '../../common/hooks/useClickOutside';
import useChatStore from './../../../stores/chatStore';
import usePluginSettingsStore from './../../../stores/pluginSettingsStore';
import useRecommendationsStore from './../../../stores/recommendationsStore';
import { chatBotConfiguration } from './../../common/Defaults';

import commonStyles from './../../css/common.module.scss';
import styles from './pluginSettings.module.scss';


// ==========================================================================================


const { enabled: CHATBOT_ENABLED, name: BOT_NAME } = chatBotConfiguration;
const CHATBOT_CONFIG_VALID = CHATBOT_ENABLED && BOT_NAME;


const MUI_SWITCH_STYLES = {
   '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#7639e2',
   },
   '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#7639e2',
   },
}


// ------------------------------------------------------------------------------------------


function PluginSettings() {

   const [pluginSettingsShown, setPluginSettingsShown] = useState(false);

   const pluginSettingsDropdownRef = useRef(null);


   // --------------------------------

   const aiOverviewEnabled = usePluginSettingsStore(state => state.aiOverviewEnabled);
   const setAiOverviewEnabled = usePluginSettingsStore(state => state.setAiOverviewEnabled);

   const recommendationsEnabled = usePluginSettingsStore(state => state.recommendationsEnabled);
   const setRecommendationsEnabled = usePluginSettingsStore(state => state.setRecommendationsEnabled);
  
   
   const assistEnabled = usePluginSettingsStore(state => state.assistEnabled);
   const setAssistEnabled = usePluginSettingsStore(state => state.setAssistEnabled);
   
   const llmFieldsShown = usePluginSettingsStore(state => state.llmFieldsShown);
   const setLLMFieldsShown = usePluginSettingsStore(state => state.setLLMFieldsShown);
   const llmFieldsMode = usePluginSettingsStore(state => state.llmFieldsMode);
   const setLLMFieldsMode = usePluginSettingsStore(state => state.setLLMFieldsMode);
   
   const chatBotEnabled = usePluginSettingsStore(state => state.chatBotEnabled);
   const setChatBotEnabled = usePluginSettingsStore(state => state.setChatBotEnabled);
   
   const clearRecommendations = useRecommendationsStore(state => state.clearRecommendations);

   const chatShown = useChatStore(state => state.chatShown);
   const toggleChatShown = useChatStore(state => state.toggleChatShown);


   // ------------------------------


   useClickOutside(pluginSettingsDropdownRef, handleClickOutsidePluginSettingsDropdown);


   // ------------------------------


   function handleClickOutsidePluginSettingsDropdown() {
      setPluginSettingsShown(false);
   }


   // ------------------------------


   const currentParameters = Object.assign({}, queryString.parse(window.location.search));
   const chatAvailable = CHATBOT_CONFIG_VALID || (currentParameters.chatEligible && currentParameters.cname);


   return (
      <div className={`${styles.pluginSettings}`} ref={pluginSettingsDropdownRef}>

         <button className={styles.toggle} onClick={() => setPluginSettingsShown(shown => !shown)} title={`${pluginSettingsShown ? 'Hide' : 'Show'} Settings`}>
            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
         </button>

         {
            pluginSettingsShown && (
               <div className={`${commonStyles.popover} ${styles.dropdown}`}>
                  <h2>Plugin Settings</h2>
                  
                  <ul className={styles.settingsList}>
                     <li>
                        <div className={`${styles.setting} ${!chatAvailable ? styles.disabled : ''}`}>
                           <span className={styles.settingLabel}>AI Overview</span>
                           <span className={styles.switchContainer}>
                              <Switch
                                 checked={aiOverviewEnabled}
                                 onChange={(e) => {
                                    setAiOverviewEnabled(e.target.checked);
                                 }}
                                 sx={MUI_SWITCH_STYLES}
                              />
                           </span>
                        </div>
                     </li>
                     <li>
                        <div className={styles.setting}>
                           <span className={styles.settingLabel}>AI Recommendations</span>
                           <span className={styles.switchContainer}>
                              <Switch
                                 checked={recommendationsEnabled}
                                 onChange={(e) => {
                                    setRecommendationsEnabled(e.target.checked);

                                    if (!e.target.checked) {
                                       clearRecommendations();
                                    }
                                 }}
                                 sx={MUI_SWITCH_STYLES}
                              />
                           </span>
                        </div>
                     </li>
                     <li>
                        <div className={styles.setting}>
                           <span className={styles.settingLabel}>LLM-generated Fields</span>
                           <span className={styles.switchContainer}>
                              <Switch
                                 checked={llmFieldsShown}
                                 onChange={(e) => {
                                    setLLMFieldsShown(e.target.checked);
                                 }}
                                 sx={MUI_SWITCH_STYLES}
                              />
                           </span>
                        </div>
                        {
                           llmFieldsShown && 
                              <ul className={styles.subSettings}>
                                 <li>
                                    <div className={styles.radioGroup}>
                                       <label>
                                          <input 
                                             type="radio"
                                             name="displayMode" 
                                             value="replace"
                                             checked={llmFieldsMode === 'replace'}
                                             onChange={(e) => {
                                                setLLMFieldsMode(e.target.value);
                                             }}
                                          />
                                          <span className={styles.subSettingLabel}>Replace</span>
                                       </label>
                                       <label>
                                          <input 
                                             type="radio" 
                                             name="displayMode"
                                             value="both"
                                             checked={llmFieldsMode === 'both'}
                                             onChange={(e) => {
                                                setLLMFieldsMode(e.target.value);
                                             }}
                                          />
                                          <span className={styles.subSettingLabel}>Show Both</span>
                                       </label>
                                    </div>
                                 </li>
                              </ul>
                        }
                     </li>
                     <li>
                        <div className={styles.setting}>
                           <span className={styles.settingLabel}>AI Assist</span>
                           <span className={styles.switchContainer}>
                              <Switch
                                 checked={assistEnabled}
                                 onChange={(e) => {
                                    setAssistEnabled(e.target.checked);
                                 }}
                                 sx={MUI_SWITCH_STYLES}
                              />
                           </span>
                        </div>
                     </li>
                     <li>
                        <div className={`${styles.setting} ${!chatAvailable ? styles.disabled : ''}`}>
                           <span className={styles.settingLabel}>ChatBot</span>
                           <span className={styles.switchContainer}>
                              <Switch
                                 checked={chatBotEnabled}
                                 onChange={(e) => {
                                    setChatBotEnabled(e.target.checked);

                                    if (e.target.checked) {
                                       // setPluginSettingsShown(false);
                                       
                                       if (!chatShown) {
                                          toggleChatShown();
                                       }
                                    }
                                    
                                 }}
                                 sx={MUI_SWITCH_STYLES}
                              />
                           </span>
                        </div>
                     </li>
                  </ul>
               </div>
            )
         }
      </div>
   );
}


export default PluginSettings;


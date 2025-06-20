import queryString from 'query-string';

import useSecurityStore from './../../../stores/securityStore';
import { logoutUser } from './../../../sb/common/AuthUtils';

import SearchInput from './../../searchInput/SearchInput';
import PluginSettings from './../pluginSettings';

import commonStyles from './../../css/common.module.scss';
import styles from './header.module.scss';

import SBLogoSRC from './../../../assets/images/sb-logomain.png';


// ==========================================================================================


function Header() {

   const securityResponse = useSecurityStore(state => state.securityResponse);
   
   
   // ------------------------------
   
   
   const currentParameters = Object.assign({}, queryString.parse(window.location.search));


   return (
      <header className={`${styles.sbHeader} ${currentParameters.query ? styles.visible : ''}`}>
         <div className={commonStyles.contentWrapper}>
            <div className={styles.sbHeaderContent}>

               <a href="https://www.searchblox.com" title="SearchBlox Home" target="_blank" rel="noreferrer">
                  <img className={styles.sbLogo} alt="SearchBlox Home" src={SBLogoSRC} />
               </a>

               <SearchInput />

               <div className={styles.headerMenus}>

                  <PluginSettings />

                  {
                     securityResponse?.type !== 'none' && (
                        <button className={commonStyles.userLogout} onClick={logoutUser}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-logout"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg>
                        </button>
                     )
                  }
               </div>

            </div>
         </div>
      </header>
   );
}


export default Header;

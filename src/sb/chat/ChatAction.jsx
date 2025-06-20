import PropTypes from 'prop-types';

import { updateActionClickCount } from '../common/SbCore';

import styles from './styles/chatAction.module.scss';


// ==========================================================================================


const ACTION_TYPE_ICON = {
   phone: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>,
   download: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg>,
   email: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z"></path></g></svg>,
   url: <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>,
};


const ACTION_URL_PREFIXES = {
   phone: 'tel:',
   email: 'mailto:',
};


// ------------------------------------------------------------------------------------------


export default function ChatAction({ actionData }) {
   
   return (
      <>
         {
            // show only the first action from the list
            actionData.slice(0, 1).map((action, i) => { 
               const { actionType: type, description, buttonDisplay: btnDisplay, uid } = action;
               const currentIcon = ACTION_TYPE_ICON[type];
            
               const actionURL = ['download', 'url'].includes(type) ? action.actionResource : `${ACTION_URL_PREFIXES[type]}${action.actionResource}`;

               return (
                  <div key={`action-${i}`} className={styles.chatAction}>
                     {
                        description?.length > 0 &&
                           <p>{description}</p>
                     }
                     
                     <a href={actionURL} {...(type == 'download' ? { download: true }: {})} target="_blank" rel="noreferrer" onClick={() => updateActionClickCount(uid)}>
                        <span>{btnDisplay}</span>
                        {currentIcon}
                     </a>
                  </div>
               );
            })
         }
      </>
   );
}


ChatAction.propTypes = {
   actionData: PropTypes.array
};


// ==========================================================================================
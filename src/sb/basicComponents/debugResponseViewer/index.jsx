
import { JsonView } from 'react-json-view-lite';

import commonStyles from './../../css/common.module.scss';
import styles from './debugResponseViewer.module.scss';


// ================================================================================================


function DebugResponseViewer({ debugResponse }) {
   return (
      <div className={commonStyles.contentWrapper}>
         <div className={styles.debugResponse}>
            <JsonView
               data={debugResponse}
               style={{
                  label: styles.jsonLabel,
                  nullValue: styles.jsonNull,
                  undefinedValue: styles.jsonUndefined,
               }}
            />
         </div>
      </div>
   );
}


export default DebugResponseViewer;
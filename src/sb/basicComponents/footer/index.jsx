
import commonStyles from './../../css/common.module.scss';
import styles from './footer.module.scss';

// ==========================================================================================


function Footer() {
   return (
      <footer className={styles.sbFooter}>
         <div className={commonStyles.contentWrapper}>
            <p className={styles.copyright}>
               &copy;&nbsp;{new Date().getFullYear()} SearchBlox&nbsp;Software,&nbsp;Inc. All rights reserved.
            </p>
         </div>
      </footer>
   );
}


export default Footer;
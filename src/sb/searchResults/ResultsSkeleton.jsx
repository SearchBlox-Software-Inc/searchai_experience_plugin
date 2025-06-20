import SkeletonItem from '../basicComponents/skeletonItem/';

import styles from './styles/resultsSkeleton.module.scss'


// ==========================================================================================


function ResultsSkeleton() {
   return (
      <div className={styles.resultSkeleton}>
         <div className={styles.skeletonContent}>
            <SkeletonItem className={styles.skeletonTitle} />
            <SkeletonItem className={styles.skeletonDescription} />
            <SkeletonItem className={styles.skeletonDescription} />
            <SkeletonItem className={styles.skeletonUrl} />
         </div>
         <SkeletonItem className={styles.skeletonImage} />
      </div>
   );
}


export default ResultsSkeleton;
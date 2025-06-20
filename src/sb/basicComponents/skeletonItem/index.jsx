import styles from './skeletonItem.module.scss';


// ==========================================================================================


function SkeletonItem( { className, width, height } ) {

   return (
      <code 
         className={`${className} ${styles.skeletonItem}`} 
         style={{ width, height }} 
      />
   );
}


export default SkeletonItem;
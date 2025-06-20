import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import styles from './styles/overlay.module.scss';


// ==============================


function Overlay({ open, children }) {
   
   const modalRef = useRef(null);
   

   // ---------------------------------------------


   useEffect(() => {
      const modal = modalRef.current;
      
      if (modal) {
         if (open && !modal.open) {
            modal.showModal();
         } else if (!open && modal.open) {
            modal.close();
         }
      }

      if (open) {
         document.body.style.overflow = 'hidden';
      }
      
      return () => {
         document.body.style.overflow = 'initial';
      };
   }, [open]);

   
   // ---------------------------------------------


   return (
      <dialog className={styles.sbModal} ref={modalRef}>
         { children }
      </dialog>
   );
}


Overlay.Title = OverlayTitle;
Overlay.Content = OverlayContent;


export default Overlay;


Overlay.propTypes = {
   open: PropTypes.bool,
   children: PropTypes.array,
};


// ==========================================================================================
// ---------------- Overlay Title ------------------


function OverlayTitle({ onClose, children }) {
   
   useEffect(() => {
      function handleEscapeKey(e) {
         if (e.code === 'Escape') {
            onClose();
         }
      }
   
      document.addEventListener('keydown', handleEscapeKey);

      return () => document.removeEventListener('keydown', handleEscapeKey);
   }, []);


   // ---------------------------------------------


   return (
      <div className={styles.modalHeader}>
         <div className={styles.title}>
            { children }
         </div>

         <button title="Close" className={styles.closeBtn} onClick={onClose}>
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
         </button>
      </div>
   );
}


OverlayTitle.propTypes = {
   onClose: PropTypes.func,
   children: PropTypes.any,
};


// ==========================================================================================
// ---------------- Overlay Content ----------------


function OverlayContent({ children }) {
   return (
      <div className={styles.modalBody} tabIndex="0">
         { children }
      </div>
   );
}


OverlayContent.propTypes = {
   children: PropTypes.element,
};
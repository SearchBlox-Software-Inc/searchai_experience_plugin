import { useRef, useEffect } from 'react';

import { chatBotConfiguration } from '../../common/Defaults';

import styles from './backToTop.module.scss';


// ==========================================================================================

function BackToTop() {

   const toTopButtonRef = useRef();


   // ------------------------------


   useEffect(() => {

      const checkButtonVisibility = () => {
         if (toTopButtonRef.current) {
            const position = window.scrollY;
            toTopButtonRef.current.classList.toggle(styles.shown, position > 50);
         }
      };

      checkButtonVisibility();
      window.addEventListener('scroll', checkButtonVisibility, { passive: true });

      return () => window.removeEventListener('scroll', checkButtonVisibility);
   }, []);


   // ------------------------------


   const chatBotEnabled = chatBotConfiguration.enabled;

   
   return (
      <button ref={toTopButtonRef}
         className={`${styles.backToTop} ${!chatBotEnabled && styles.fixtobottom}`}
         aria-label="Back to top"
         onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
      >
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 15l6 -6l6 6" /></svg>
      </button>
   );
}


BackToTop.propTypes = {};


export default BackToTop;
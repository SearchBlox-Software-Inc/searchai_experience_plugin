import { useEffect } from 'react';


function useClickOutside(elementRef, onClickOutside) {
   
   useEffect(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keyup', handleClickOutside);

      return () => {
         document.removeEventListener('click', handleClickOutside);
         document.removeEventListener('keyup', handleClickOutside);
      };
   }, [elementRef, onClickOutside]);
   

   function handleClickOutside(e) {
      if(elementRef.current && !elementRef.current.contains(e.target)) {
         onClickOutside(e);
      }
   }
   
}


export default useClickOutside;

import dayjs from 'dayjs';
import * as defaults from './Defaults';


// ==========================================================================================


export function logoutUser() {
   const toRemove = ['inactiveTime', 'securityMethod', 'searchToken', 'loginTime', 'loginUserName'];

   toRemove.forEach(item => {
      if (localStorage.getItem(item))
         localStorage.removeItem(item);
   });

   window.location = window.location.href.split('?')[0];
}


export function checkAutoLogout() {
   if (defaults.autologout) {
      setInterval(function () {
         const temp = dayjs(new Date());
         const inactiveTime = localStorage.getItem('inactiveTime');

         document.addEventListener('click', function () {
            localStorage.setItem('inactiveTime', temp);
         });

         if (temp.diff(inactiveTime, 'minutes') >= 30) {
            logoutUser();
         }
      }, 5000);
   }

   setInterval(function () {
      const nowTime = dayjs(new Date());
      const loginTime = dayjs(localStorage.getItem('loginTime'));

      if (nowTime.diff(loginTime, 'days') > 0) {
         logoutUser();
      }
   }, 5000);
}
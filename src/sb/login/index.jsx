import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Slide, toast, ToastContainer } from 'react-toastify';

import { autologout, pluginDomain } from '../common/Defaults';

import SBLogoSmallSRC from './../../assets/images/sb-logo-small.png';

import 'react-toastify/dist/ReactToastify.css';
import styles from './login.module.scss';


// ==========================================================================================


function LogIn({ setLoggedIn }) {


   const [userInputErrors, setUserInputErrors] = useState({ usernameErr: false, passwordErr: false });
   const [showPassword, setShowPassword] = useState(false);

   const usernameRef = useRef();
   const passwordRef = useRef();


   // ------------------------------


   const loginMutation = useMutation({
      mutationFn: (userObj) => {
         return axios.post(pluginDomain + '/rest/v2/api/secured/authenticate', userObj);
      },
      onSuccess: (response) => {
         if (response.data !== '') {
            if (response.data.message) {
               toast.error(response.data.message, { toastId: 'errorToast' });
            } else {
               localStorage.setItem("searchToken", response.data.token);
               localStorage.setItem("loginTime", dayjs(new Date()));

               setLoggedIn(true);

               if (autologout) {
                  localStorage.setItem("inactiveTime", dayjs(new Date()));
               }
            }
         }
      },
      onError: (error) => {
         console.error(error);
         if (error.response) {
            toast.error(error.response.data.message, { toastId: 'errorToast' });
         }
      }
   });


   // ------------------------------

   

   function login() {
      const currentUsername = usernameRef.current.value.trim();
      const currentPassword = passwordRef.current.value;

      let userInputErrors = {};

      if (!currentUsername.length) {
         userInputErrors.usernameErr = true;
      }

      if (!currentPassword.length) {
         userInputErrors.passwordErr = true;
      }

      if (Object.keys(userInputErrors).every(field => !userInputErrors[field])) {
         window.scrollTo(0, 0);

         // Extract username from different formats (domain\username, email@domain.com, or plain username)
         const userName = currentUsername.split(/[\\@]/).pop() || currentUsername;
         
         localStorage.setItem("loginUserName", userName);

         loginMutation.mutate({
            username: currentUsername,
            password: currentPassword,
         });
      } else {
         setUserInputErrors(userInputErrors);
      }
   }


   function handleInputChange(e) {
      const currentField = e.target.id;

      if (currentField === 'password' && userInputErrors.passwordErr) {
         setUserInputErrors(prev => ({ ...prev, passwordErr: false }));
      } else if (currentField === 'username' && userInputErrors.usernameErr) {
         setUserInputErrors(prev => ({ ...prev, usernameErr: false }));
      }
   }


   function keyPress(e) {
      if (e.key === 'Enter') {
         login();
      }
   }


   // ------------------------------


   return (
      <>
         <div className={styles.sbLogin}>
            
            <div className={styles.sbLoginContainer} role="main">
               <form className={styles.loginForm} onSubmit={(e) => {
                  e.preventDefault();
                  login();
               }}>
                  
                  <div className={styles.sbLoginContainerHead}>
                     <img width="40px" height="40px" src={SBLogoSmallSRC} alt="SearchBlox Home" />
                     
                     <h1>
                        SearchBlox <span style={{ color: "#69717c" }}>Secure&nbsp;Search</span>
                     </h1>
                  </div>
                  
                  <fieldset>
                     {/* <legend>Log In</legend> */}

                     {/* Username */}
                     <div className={styles.sbFormGroup}>
                        <label htmlFor="username" className={styles.loginLabel}>Username</label>
                     
                        <div className={styles.sbInputGroup}>

                           <input 
                              className={styles.loginInput}
                              ref={usernameRef}
                              autoComplete="off"
                              id="username"
                              onChange={handleInputChange}
                           />
                           
                           <span className={styles.inputIcon}>
                              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-user"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
                           </span>

                        </div>

                        {
                           userInputErrors.usernameErr && (
                           <p className={styles.loginError}>
                              Please enter a valid username
                           </p>
                        )}
                     </div>
                     
                     {/* Password */}
                     <div className={styles.sbFormGroup}>
                        <label htmlFor="password" className={styles.loginLabel}>Password</label>

                        <div className={styles.sbInputGroup}>

                           <input 
                              className={styles.loginInput}
                              ref={passwordRef}
                              type={showPassword ? "text" : "password"}
                              id="password"
                              onChange={handleInputChange}
                              onKeyDown={keyPress}
                              autoComplete="off"
                           />

                           <span className={styles.inputIcon}>
                              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-lock-password"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" /><path d="M15 16h.01" /><path d="M12.01 16h.01" /><path d="M9.02 16h.01" /></svg>
                           </span>

                           <button 
                              type="button" 
                              className={styles.passwordToggle} 
                              title={`${showPassword ? 'Hide' : 'View'} password`} 
                              onClick={() => setShowPassword(showPasswordPrev => !showPasswordPrev)}
                           >
                              {
                                 showPassword ?
                                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                                    :
                                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>
                              }
                           </button>
                        </div>

                        {
                           userInputErrors.passwordErr && 
                              <p className={styles.loginError}>
                                 Please enter a valid password.
                              </p>
                        }
                     </div>

                     <button 
                        className={styles.sbLoginButton}
                        type="submit"
                        disabled={loginMutation.isPending}
                     >
                        {
                           loginMutation.isPending &&
                              <svg className={styles.loginButtonLoader} xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a9 9 0 1 0 9 9" /></svg>
                        }
                        <span>Sign In</span>
                     </button>

                  </fieldset>
                  
                  <p className={styles.helpText}>
                     Need help getting started? <a href="https://developer.searchblox.com/" target="_blank" rel="noreferrer">Visit&nbsp;the&nbsp;documentation</a>.
                  </p>
                  
               </form>
            </div>

            <p className={styles.copyrightText}>
               &copy; {new Date().getFullYear()} SearchBlox Software, Inc. All rights reserved.
            </p>
            
         </div>

         <ToastContainer position="top-right"
            autoClose={3000}
            // hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            transition={Slide}
            draggable
            pauseOnHover
            theme="colored"
         />
         
      </>
   );
}


LogIn.propTypes = {
   setLoggedIn: PropTypes.func.isRequired,
};


export default LogIn;
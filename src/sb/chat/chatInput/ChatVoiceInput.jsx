import PropTypes from 'prop-types';
import { useEffect } from 'react';

import useSpeechToText from '../../searchInput/hooks';

import styles from './../styles/chatInput.module.scss';


// ==========================================================================================


export default function ChatVoiceInput({ recording, setRecording, handleSubmit }) {
   
   const {
      isRecording,
      results,
      startSpeechToText,
      stopSpeechToText
   } = useSpeechToText({
      continuous: false,
      crossBrowser: true,
      speechRecognitionProperties: { interimResults: true },
      timeout: 5000
   });


   // ---------------------------------


   useEffect(() => {
      setRecording(isRecording);
   }, [isRecording]);

   
   useEffect(() => {
      if(results.length) {
         const newQuery = results[results.length - 1];
         
         handleSubmit(newQuery);
      }
   }, [results]);


   // ---------------------------------


   function handleVoiceSearchClick() {
      if(isRecording) {
         stopSpeechToText();
      } else {
         startSpeechToText();
      }

      setRecording(prevRecording => !prevRecording);
   }


   // ---------------------------------


   return (
      <button className={`${styles.chatVoiceInput} ${recording ? styles.recording : ''}`} onClick={handleVoiceSearchClick} title="Voice search">
         {
            recording ?
               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-microphone"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4" /></svg>
               :
               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-microphone"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" /><path d="M5 10a7 7 0 0 0 14 0" /><path d="M8 21l8 0" /><path d="M12 17l0 4" /></svg>
         }
      </button>
   );
}


ChatVoiceInput.propTypes = {
   recording: PropTypes.bool,
   setRecording: PropTypes.func,
   handleSubmit: PropTypes.func
};
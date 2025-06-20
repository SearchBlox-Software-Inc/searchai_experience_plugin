"use strict";

import { useState, useEffect, useRef } from "react";
import hark from "hark";
import { startRecording, stopRecording } from "./recorderHelpers";
import { pluginDomain } from "../../common/Defaults";



const isEdgeChromium = navigator.userAgent.indexOf('Edg/') !== -1;
const AudioContext = window.AudioContext || window.webkitAudioContext;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition; // Set recognition back to null for brave browser due to promise resolving
// after the conditional on line 31

if (navigator.brave) {
  navigator.brave.isBrave().then(bool => {
    if (bool) recognition = null;
  });
} // Chromium browsers will have the SpeechRecognition method
// but do not implement the functionality due to google wanting 💰
// this covers new Edge and line 22 covers Brave, the two most popular non-chrome chromium browsers


if (!isEdgeChromium && SpeechRecognition) {
  recognition = new SpeechRecognition();
}

export default function useSpeechToText({
    continuous,
    crossBrowser,
    googleCloudRecognitionConfig,
    onStartSpeaking,
    onStoppedSpeaking,
    speechRecognitionProperties,
    timeout,
    useOnlyGoogleCloud = false,
  })  {

  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef();
  const [results, setResults] = useState([]);
  const [interimResult, setInterimResult] = useState();
  const [error, setError] = useState('');
  const timeoutId = useRef();
  const mediaStream = useRef();
  useEffect(() => {
    let _navigator, _navigator$mediaDevic;

    if (!crossBrowser && !recognition) {
      setError('Speech Recognition API is only available on Chrome');
    }

    if (!((_navigator = navigator) !== null && _navigator !== void 0 && (_navigator$mediaDevic = _navigator.mediaDevices) !== null && _navigator$mediaDevic !== void 0 && _navigator$mediaDevic.getUserMedia)) {
      setError('getUserMedia is not supported on this device/browser :(');
    }

    // if ((crossBrowser || useOnlyGoogleCloud) && !googleApiKey) {
    //   console.error('No google cloud API key was passed, google API will not be able to process speech');
    // }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
  }, []); // Chrome Speech Recognition API:
  // Only supported on Chrome browsers

  const chromeSpeechRecognition = () => {
    if (recognition) {
      // Continuous recording after stopped speaking event
      if (continuous) recognition.continuous = true;
      const {
        grammars,
        interimResults,
        lang,
        maxAlternatives
      } = speechRecognitionProperties || {};
      if (grammars) recognition.grammars = grammars;
      if (lang) recognition.lang = lang;
      recognition.interimResults = interimResults || false;
      recognition.maxAlternatives = maxAlternatives || 1; // start recognition

      recognition.start(); // speech successfully translated into text

      recognition.onresult = e => {
        const result = e.results[e.results.length - 1];
        const {
          transcript
        } = result[0]; // Allows for realtime speech result UI feedback

        if (interimResults) {
          if (result.isFinal) {
            setInterimResult(undefined);
            setResults(prevResults => [...prevResults, transcript]);
          } else {
            let concatTranscripts = ''; // If continuous: e.results will include previous speech results: need to start loop at the current event resultIndex for proper concatenation

            for (let i = e.resultIndex; i < e.results.length; i++) {
              concatTranscripts += e.results[i][0].transcript;
            }

            setInterimResult(concatTranscripts);
          }
        } else {
          setResults(prevResults => [...prevResults, transcript]);
        }
      };


      recognition.onaudiostart = () =>{
        setIsRecording(true);
      }; // Audio stopped recording or timed out.
      // Chrome speech auto times-out if no speech after a while
      recognition.onaudioend = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  };

  const startSpeechToText = async () => {
    let _audioContextRef$curr;

    if (!useOnlyGoogleCloud && recognition) {
      chromeSpeechRecognition();
      return;
    }

    if (!crossBrowser && !useOnlyGoogleCloud) {
      return;
    } // Resume audio context due to google auto play policy
    // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio


    if (((_audioContextRef$curr = audioContextRef.current) === null || _audioContextRef$curr === void 0 ? void 0 : _audioContextRef$curr.state) === 'suspended') {
      let _audioContextRef$curr2;

      (_audioContextRef$curr2 = audioContextRef.current) === null || _audioContextRef$curr2 === void 0 ? void 0 : _audioContextRef$curr2.resume();
    }

    const stream = await startRecording({
      errHandler: () => setError('Microphone permission was denied'),
      audioContext: audioContextRef.current
    }); // Stop recording if timeout

    if (timeout) {
      handleRecordingTimeout();
    } // stop previous mediaStream track if exists

    if (mediaStream.current) {
      mediaStream.current.getAudioTracks()[0].stop();
    } // Clones stream to fix hark bug on Safari


    mediaStream.current = stream.clone();
    const speechEvents = hark(mediaStream.current, {
      audioContext: audioContextRef.current
    });
    speechEvents.on('speaking', () => {
      if (onStartSpeaking) onStartSpeaking(); // Clear previous recording timeout on every speech event

      clearTimeout(timeoutId.current);
    });
    speechEvents.on('stopped_speaking', () => {
      let _mediaStream$current;

      if (onStoppedSpeaking) onStoppedSpeaking();
      setIsRecording(false);
      (_mediaStream$current = mediaStream.current) === null || _mediaStream$current === void 0 ? void 0 : _mediaStream$current.getAudioTracks()[0].stop(); // Stops current recording and sends audio string to google cloud.
      // recording will start again after google cloud api
      // call if `continuous` prop is true. Until the api result
      // returns, technically the microphone is not being captured again

      stopRecording({
        exportWAV: true,
        wavCallback: blob => handleBlobToBase64({
          blob,
          continuous: continuous || false
        })
      });
    });
    setIsRecording(true);
  };

  const stopSpeechToText = () => {
    if (recognition && !useOnlyGoogleCloud) {
      recognition.stop();
    } else {
      let _mediaStream$current2;

      setIsRecording(false);
      (_mediaStream$current2 = mediaStream.current) === null || _mediaStream$current2 === void 0 ? void 0 : _mediaStream$current2.getAudioTracks()[0].stop();
      stopRecording({
        exportWAV: true,
        wavCallback: blob => handleBlobToBase64({
          blob,
          continuous: false
        })
      });
    }
  };

  const handleRecordingTimeout = () => {
    timeoutId.current = window.setTimeout(() => {
      let _mediaStream$current3;

      setIsRecording(false);
      (_mediaStream$current3 = mediaStream.current) === null || _mediaStream$current3 === void 0 ? void 0 : _mediaStream$current3.getAudioTracks()[0].stop();
      stopRecording({
        exportWAV: false
      });
    }, timeout);
  };

  const handleBlobToBase64 = ({
    blob,
    continuous
  }) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onloadend = async () => {
      let _audioContextRef$curr3, _googleCloudJson$resu;

      const base64data = reader.result;
      let sampleRate = (_audioContextRef$curr3 = audioContextRef.current) === null || _audioContextRef$curr3 === void 0 ? void 0 : _audioContextRef$curr3.sampleRate; // Google only accepts max 48000 sample rate: if
      // greater recorder js will down-sample to 48000

      if (sampleRate && sampleRate > 48000) {
        sampleRate = 48000;
      }

      const audio = {
        content: ''
      };
      const config = {
        encoding: 'LINEAR16',
        languageCode: 'en-US',
        sampleRateHertz: sampleRate,
        ...googleCloudRecognitionConfig
      };
      const data = {
        config,
        audio
      }; // Gets raw base 64 string data

      audio.content = base64data.substr(base64data.indexOf(',') + 1);
      const googleCloudRes = await fetch(pluginDomain+"/rest/v2/api/speech/text", {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      const googleCloudJson = await googleCloudRes.json(); // Update results state with transcribed text

      if (((_googleCloudJson$resu = googleCloudJson.results) === null || _googleCloudJson$resu === void 0 ? void 0 : _googleCloudJson$resu.length) > 0) {
        setResults(prevResults => [...prevResults, googleCloudJson.results[0].alternatives[0].transcript]);
      }

      if (continuous) {
        startSpeechToText();
      }
    };
  };

  return {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText
  };
}

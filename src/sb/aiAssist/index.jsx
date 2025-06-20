import { useEffect, useState, useRef } from 'react';
import { marked } from 'marked';

import { sendAssistMessage } from '../common/SbCore';
import useAssistStore from '../../stores/assistStore';

import AssistCart from './AssistCart';
import styles from './styles/aiAssist.module.scss';


// ==========================================================================================


const INITIAL_PROMPT_MESSAGE = 'Please choose a prompt from the options below or feel free to write your own prompt.'


const GET_INITIAL_PROMPT_SUGGESTIONS = function(numberOfResults) {
   return {
      role: 'user',
      prompts: true,
      content: [
         { 
            title: 'summarize',
            content: `Summarize the provided document${numberOfResults > 1 ? 's' : ''}`,
            icon: <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-list-numbers"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 6h9" /><path d="M11 12h9" /><path d="M12 18h8" /><path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" /><path d="M6 10v-6l-2 2" /></svg>,
         },
         {
            title: numberOfResults > 1 ? 'compare' : 'analyze',
            content: `${numberOfResults > 1 ? 'Compare' : 'Analyze'} the provided document${numberOfResults > 1 ? 's' : ''}`,
            icon: numberOfResults > 1 ?
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-switch-horizontal"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 3l4 4l-4 4" /><path d="M10 7l10 0" /><path d="M8 13l-4 4l4 4" /><path d="M4 17l9 0" /></svg>
               // <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-right-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 7l-18 0" /><path d="M18 10l3 -3l-3 -3" /><path d="M6 20l-3 -3l3 -3" /><path d="M3 17l18 0" /></svg>
               :
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bulb"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /><path d="M9.7 17l4.6 0" /></svg>
         },
         {  
            title: 'custom', 
            content: '',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
         }
      ]
   }
}


// ------------------------------------------------------------------------------------------


function AiAssist() {

   const selectedResults = useAssistStore(state => state.selectedResults);
   const isLoading = useAssistStore(state => state.isLoading);
   const loadingMessage = useAssistStore(state => state.loadingMessage);
   const controller = useAssistStore(state => state.controller);
   const messages = useAssistStore(state => state.messages);
   const selectedPrompt = useAssistStore(state => state.selectedPrompt);
   const customPrompt = useAssistStore(state => state.customPrompt);
   const showInput = useAssistStore(state => state.showInput);

   const setAssistCartShown = useAssistStore(state => state.setAssistCartShown);

   const assistModalShown = useAssistStore(state => state.assistModalShown);
   const setAssistModalShown = useAssistStore(state => state.setAssistModalShown);

   const setSelectedResults = useAssistStore(state => state.setSelectedResults);
   const toggleSelectedResult = useAssistStore(state => state.toggleSelectedResult);
   const setIsLoading = useAssistStore(state => state.setIsLoading);
   const setLoadingMessage = useAssistStore(state => state.setLoadingMessage);
   const setController = useAssistStore(state => state.setController);
   const setMessages = useAssistStore(state => state.setMessages);
   const addMessage = useAssistStore(state => state.addMessage);
   const setSelectedPrompt = useAssistStore(state => state.setSelectedPrompt);
   const setCustomPrompt = useAssistStore(state => state.setCustomPrompt);
   const setShowInput = useAssistStore(state => state.setShowInput);


   const messagesListRef = useRef(null);
   const InputRef = useRef(null);


   // ------------------------------


   // useEffect(() => {
   //    setDefaultMessages();
   // }, [])
   
   
   useEffect(() => {
      const shouldShowCart = selectedResults.length > 0 && !assistModalShown;
      setAssistCartShown(shouldShowCart);
   }, [selectedResults, assistModalShown]);
   
   
   useEffect(() => {
      if (assistModalShown) {
         setDefaultMessages();
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = 'initial';
      }
   }, [assistModalShown]);


   useEffect(() => {
      if (messagesListRef.current) {
         const messageElements = messagesListRef.current.getElementsByClassName(styles.messageItem);

         if (messageElements.length > 0) {
            const lastMessage = messageElements[messageElements.length - 1];
            lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
         }
      }
   }, [messages]);


   // ------------------------------


   function setDefaultMessages() {

      setMessages([
         { role: 'system', content: INITIAL_PROMPT_MESSAGE },
         ...[GET_INITIAL_PROMPT_SUGGESTIONS(selectedResults.length)]
      ])
   }


   function handlePromptSuggestion(prompt) {
      const newSelectedPrompt = prompt.title || "summarize";
      setSelectedPrompt(newSelectedPrompt);

      if (prompt.title === "custom") {
         setTimeout(() => {
            InputRef.current?.focus();
         }, 100);
      }
      else {
         handleGenerateContent(selectedResults, newSelectedPrompt);
      }
   }


   // handle assist API for generate content
   function handleGenerateContent(item, category) {
      if (item && item.length > 0) {
         setIsLoading(true);

         setLoadingMessage("Fetching files...");
         setTimeout(() => {
            setLoadingMessage("Analyzing...");
         }, 2000);

         // Create new AbortController for this request
         const newController = new AbortController();
         setController(newController);

         let data = item.map((content) => ({
            id: content.uid,
            collectionId: content.col
         }))

         let payload = {}

         payload = {
            "operation": category === "custom" ? "summarize" : category,
            "documents": data,
            "customPrompt": customPrompt // Optional
         }

         sendAssistMessage(payload, { signal: newController.signal })
            .then(data => {
               const response = data.data
               setIsLoading(false);
               if (response && response.result) {
                  addMessage({ role: 'assistant', content: response.result || "No results found" });
               }
               else if (response && response.documents) {
                  addMessage({ role: 'assistant', content: response.documents || "No results found" });
               }
               else {
                  addMessage({ role: 'assistant', content: "Something went wrong. Please try again later." });
               }
            })
            .catch(error => {
               if (error.name === 'AbortError') {
                  // console.log('Request was aborted');
                  return;
               }
               setIsLoading(false)
               addMessage({ role: 'assistant', content: "Service is currently unavailable. Please try again later." });
            });
         setCustomPrompt("");
         setShowInput(true)
      }
   }


   function handlePromptChange(value) {
      setCustomPrompt(value);
   }


   // ------------------------------



   return (
      <>
         <AssistCart />

         {
            assistModalShown &&
            <>
               <div className={styles.aiAssist}>

                  {/* Header */}
                  <div className={styles.assistHeader}>
                     <div className={styles.titleContainer}>
                        <h3 className={styles.title}>
                           <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 8H17.8174M21 12H18M21 16H17.8174M6.18257 8H3M8 6.18257V3M8 21L8 17.8174M12 6V3M12 21V18M16 6.18257V3M16 21V17.8174M6 12H3M6.18257 16H3M10.8 18H13.2C14.8802 18 15.7202 18 16.362 17.673C16.9265 17.3854 17.3854 16.9265 17.673 16.362C18 15.7202 18 14.8802 18 13.2V10.8C18 9.11984 18 8.27976 17.673 7.63803C17.3854 7.07354 16.9265 6.6146 16.362 6.32698C15.7202 6 14.8802 6 13.2 6H10.8C9.11984 6 8.27976 6 7.63803 6.32698C7.07354 6.6146 6.6146 7.07354 6.32698 7.63803C6 8.27976 6 9.11984 6 10.8V13.2C6 14.8802 6 15.7202 6.32698 16.362C6.6146 16.9265 7.07354 17.3854 7.63803 17.673C8.27976 18 9.11984 18 10.8 18ZM10 10H14V14H10V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                           <span>SearchAI Assist</span>
                        </h3>
                        <span className={styles.resultsCount}>({selectedResults.length} {selectedResults.length !== 1 ? 'files/URLs' : 'file/URL'} selected)</span>
                     </div>

                     <div className={styles.headerButtons}>
                        <button
                           className={styles.resetButton}
                           aria-label="Reset"
                           onClick={() => {
                              if (controller) {
                                 controller.abort();
                                 setController(null);
                              }
                              // Reset all state
                              setIsLoading(false);
                              setController(null);
                              setShowInput(false);
                              setSelectedPrompt('');
                              setCustomPrompt('');
                              setMessages([]);
                              setDefaultMessages();
                           }}
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-reload"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"></path><path d="M20 4v5h-5"></path></svg>
                        </button>

                        <button
                           className={styles.closeButton}
                           aria-label="Close SearchAI Assist"
                           onClick={() => {
                              setAssistModalShown(false);
                              setSelectedResults([]);
                              setShowInput(false);
                              setSelectedPrompt('');
                              setCustomPrompt('');
                              setMessages([]);
                              setDefaultMessages();
                           }}
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                        </button>
                     </div>
                  </div>

                  {/* Body */}
                  <div className={styles.analyzerBody}>

                     <ul className={styles.messagesList} ref={messagesListRef}>
                        {
                           messages.map((message, index) => {
                              const messageType = message.role === 'user' ? styles.userMessage : (message.role === 'assistant' ? styles.assistantMessage : '');

                              return (
                                 message.prompts ?
                                    <li key={index} className={selectedPrompt !== "custom" ? styles.prompt_suggestion : styles.promptsHidden}>
                                       {message.content.map((item, index) => (
                                          <button 
                                             key={index} 
                                             className={`${styles.prompt} ${item.title === selectedPrompt ? styles.active : selectedPrompt !== "" ? styles.inactive : ""} ${styles.prompt_suggestion_button}`} 
                                             onClick={() => { handlePromptSuggestion(item) }} 
                                             disabled={isLoading}
                                          >
                                             {item.icon}
                                             <span>{item.title}</span>
                                          </button>
                                       ))}
                                    </li>
                                    :
                                    <li key={index} className={`${styles.messageItem} ${messageType}${styles.messageItem} ${messageType}`}>

                                       <div className={styles.messageContent} dangerouslySetInnerHTML={{ __html: convertToHtml(message.content, selectedResults) }} />

                                       {
                                          message.role === 'assistant' &&
                                          <div className={styles.messageActions}>
                                             <button aria-label="Like">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-thumb-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>
                                             </button>

                                             <button aria-label="Dislike">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-thumb-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" /></svg>
                                             </button>
                                          </div>
                                       }
                                    </li>
                              )
                           })
                        }

                        {
                           isLoading &&
                           <li className={styles.loadingContainer}>
                              <span className={styles.loader} />
                              <span className={styles.loadingMessage}>{loadingMessage}</span>
                           </li>
                        }
                     </ul>
                  </div>

                  {/* Footer */}
                  <div className={styles.assistFooter}>


                     <div className={styles.promptContainer}>

                        <div style={{ width: '100%' }}>
                           {
                              showInput || selectedPrompt === "custom" ?
                                 <textarea
                                    ref={InputRef}
                                    rows={2}
                                    placeholder="Enter your prompt here..."
                                    value={customPrompt}
                                    onChange={(e) => {
                                       handlePromptChange(e.target.value)
                                    }}
                                    disabled={isLoading}
                                    onKeyDown={(e) => {
                                       if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          if (customPrompt.trim()) {
                                             handleGenerateContent(selectedResults, selectedPrompt);
                                             addMessage({ role: 'user', content: customPrompt });
                                          }
                                       }
                                    }}
                                 />
                                 :
                                 ""
                           }

                           {
                              selectedResults.length > 0 &&
                              <ul className={styles.resultsList}>
                                 {
                                    selectedResults.map((result, index) => (
                                       <li key={index} className={styles.resultItem}>
                                          <div className={styles.resultItemContent}>
                                             <a
                                                href={result.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.selectedResult}
                                             >
                                                {
                                                   result.title.replace(/<[^>]*>/g, '') || result.url || (result.contenttype?.toLowerCase() !== 'http' && result.filename)
                                                }
                                             </a>
                                          </div>

                                          <button
                                             className={styles.deleteButton}
                                             aria-label="Delete"
                                             onClick={() => {
                                                if (selectedResults.length > 1) {
                                                   toggleSelectedResult(result);
                                                }
                                                else {
                                                   setAssistModalShown(false);
                                                   setSelectedResults([]);
                                                   setShowInput(false);
                                                   setSelectedPrompt('');
                                                   setCustomPrompt('');
                                                }
                                             }}
                                          >
                                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                          </button>
                                       </li>
                                    ))
                                 }
                              </ul>
                           }
                        </div>

                        {showInput || selectedPrompt === "custom" ? <button
                           className={styles.sendButton}
                           aria-label="Send"
                           onClick={() => {
                              setIsLoading(true);
                              handleGenerateContent(selectedResults, selectedPrompt);
                              addMessage({ role: 'user', content: customPrompt });
                           }}
                           disabled={isLoading || !customPrompt}
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-send"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg>
                        </button>
                           : ""}
                     </div>

                  </div>
               </div>

               <div className={styles.assistOverlay} />
            </>
         }
      </>
   );
}


export default AiAssist;


// ==========================================================================================


function convertToHtml(markdownText, selectedResults) {
   if (!markdownText) return '';

   let content = '';

   // Handle different response formats
   if (typeof markdownText === 'string') {
      content = markdownText;
   } else if (markdownText && Array.isArray(markdownText)) {
      content = markdownText
         .map((doc, index) => {
            const selectedDoc = selectedResults.find(result => result.uid === doc.documentId);
            if (!selectedDoc) return '';
            return selectedResults.length > 1 ? `**URL ${index + 1}: [${selectedDoc.url}](${selectedDoc.url})${selectedDoc.title && !selectedDoc.title.includes("https://") ? ` (${selectedDoc.title})` : ''}**\n\n\n${doc.summary || doc.analysis || ''}` : doc.summary || doc.analysis || ""
         })
         .filter(summary => summary)
         .join('\n\n---\n\n')
   }

   // Convert to HTML using marked
   try {
      return content ? marked(content) : 'No results found';
   } catch (error) {
      console.error('Error converting markdown to HTML: ', error);
      return content || 'No results found';
   }
}

# Project Structure

```markdown
. 📂 searchai_experience
├── 📄 README.md
├── 📄 eslint.config.mjs
├── 📄 index.html                                                   # Entry HTML file for the React application
├── 📄 package.json
├── 📄 pnpm-lock.yaml
├── 📄 pnpm-workspace.yaml
└── 📂 public/
│  ├── 📄 facet.js                                                  # File to enable/disable and configure features and API payloads
│  ├── 📄 favicon.ico
│  ├── 📄 favicon.png
└── 📂 src/
│  ├── 📄 App.jsx                                                   # Main React application component
│  ├── 📄 app.module.scss
│  └── 📂 assets/
│    └── 📂 fonts/
│      └── 📂 Inter/
│        ├── 📄 Inter-Regular.ttf
│    └── 📂 images/
│      ├── 📄 sb-logo-small.png
│      ├── 📄 sb-logomain.png
│  ├── 📄 index.scss
│  ├── 📄 init.js                                                   # File to setup global object for voice search functionality
│  ├── 📄 main.jsx                                                  # React application entry point and DOM rendering
│  └── 📂 sb/
│    ├── 📄 SearchUI.jsx                                            # Main search interface component that orchestrates all search features
│    └── 📂 aiAssist/
│      ├── 📄 AssistButton.jsx                                      # Button component to trigger AI Assist functionality
│      ├── 📄 AssistCart.jsx                                        # Component to add results for use with Assist
│      ├── 📄 index.jsx                                             # Main AI Assist component combining button and cart
│      └── 📂 styles/
│        ├── 📄 aiAssist.module.scss
│        ├── 📄 assistButton.module.scss
│        ├── 📄 assistCart.module.scss
│        └── 📂 partials/
│          ├── 📄 _body.scss
│          ├── 📄 _footer.scss
│          ├── 📄 _header.scss
│          ├── 📄 _loader.scss
│    └── 📂 autoSuggest/
│      ├── 📄 AutoSuggestComponent.jsx                              # Auto-complete suggestions for search input
│      ├── 📄 TrendingComponent.jsx                                 # Display trending search queries
│    └── 📂 basicComponents/
│      └── 📂 Hero/
│        ├── 📄 hero.module.scss
│        ├── 📄 index.jsx                                           # Hero section component for landing page
│      ├── 📄 SuggestAutoSearch.jsx                                 # Component for suggesting automatic search queries
│      └── 📂 backToTop/
│        ├── 📄 backToTop.module.scss
│        ├── 📄 index.jsx                                           # Scroll-to-top button component
│      └── 📂 debugResponseViewer/
│        ├── 📄 debugResponseViewer.module.scss
│        ├── 📄 index.jsx                                           # To view API response debugging info
│      └── 📂 footer/
│        ├── 📄 footer.module.scss
│        ├── 📄 index.jsx                                           # Application footer component
│      └── 📂 header/
│        ├── 📄 header.module.scss
│        ├── 📄 index.jsx                                           # Application header component that includes search input, plugin settings button and logout button
│      └── 📂 llmFieldsToggle/
│        ├── 📄 index.jsx                                           # Toggle component for showing/hiding LLM-generated fields
│        ├── 📄 llmFieldsToggle.module.scss
│      └── 📂 overlay/
│        ├── 📄 DBOverlay.jsx                                       # Modal overlay for database result fields
│        ├── 📄 EmailOverlay.jsx                                    # Modal overlay for email result fields
│        ├── 📄 PDFViewer.jsx                                       # Component for viewing PDF documents in overlay
│        ├── 📄 index.jsx                                           # Main overlay component managing different overlay types
│        └── 📂 styles/
│          ├── 📄 overlay.module.scss
│          ├── 📄 overlayTable.module.scss
│      └── 📂 pluginSettings/
│        ├── 📄 index.jsx                                           # Settings dropdown for plugin configuration to toggle AI features
│        ├── 📄 pluginSettings.module.scss
│      └── 📂 skeletonItem/
│        ├── 📄 index.jsx                                           # Loading placeholder component for search results
│        ├── 📄 skeletonItem.module.scss
│      └── 📂 viewToggle/
│        ├── 📄 index.jsx                                           # Component to switch between different view modes (list/grid)
│        ├── 📄 viewToggle.module.scss
│      └── 📂 votingButtons/
│        ├── 📄 index.jsx                                           # Common Thumbs up/down voting component used in chat and FAQs
│        ├── 📄 votingButtons.module.scss
│    └── 📂 chat/
│      ├── 📄 Chat.jsx                                              # Main chat interface component
│      ├── 📄 ChatAction.jsx                                        # Chat Action interface within chat messages
│      ├── 📄 ChatHeader.jsx                                        # Header section of the chat component
│      ├── 📄 ChatLine.jsx                                          # Individual chat message/line component
│      ├── 📄 CitationLinks.jsx                                     # Component for displaying citation links in chat responses
│      └── 📂 chatInput/
│        ├── 📄 ChatInput.jsx                                       # Text input component for chat messages
│        ├── 📄 ChatVoiceInput.jsx                                  # Voice input component for chat
│        ├── 📄 PromptSuggestions.jsx                               # Pre-defined prompt suggestions for chat
│      ├── 📄 chatUtilities.js                                      # Utility functions for chat functionality
│      └── 📂 styles/
│        ├── 📄 chat.module.scss
│        ├── 📄 chatAction.module.scss
│        ├── 📄 chatHeader.module.scss
│        ├── 📄 chatInput.module.scss
│        ├── 📄 chatPrompts.module.scss
│        ├── 📄 citationLinks.module.scss
│        └── 📂 partials/
│          ├── 📄 _loading.scss
│          ├── 📄 _message-details.scss
│          ├── 📄 _messages.scss
│          ├── 📄 _toggle.scss
│    └── 📂 common/
│      ├── 📄 AuthUtils.js                                          # Authentication utility functions
│      ├── 📄 CustomHistory.js                                      # Custom browser history management
│      ├── 📄 Defaults.js                                           # File that exports fields from facet.js individually
│      ├── 📄 SbCore.js                                             # Core SearchBlox functionality with API integrations and refactoring
│      └── 📂 hooks/
│        ├── 📄 useClickOutside.jsx                                 # React hook for detecting clicks outside components
│        ├── 📄 useDebounce.jsx                                     # React hook for debouncing user input
│        ├── 📄 useThrottle.jsx                                     # React hook for throttling function calls
│      ├── 📄 suggestionsUtils.js                                   # Utility functions for search suggestions
│    └── 📂 css/
│      ├── 📄 common.module.scss
│      ├── 📄 compare-drawer.scss
│      ├── 📄 variables.scss
│    └── 📂 facetFilters/
│      ├── 📄 CustomDateFilter.jsx                                  # Date range filter component for search results
│      ├── 📄 FacetFilters.jsx                                      # Main facet filtering component
│      ├── 📄 FacetFiltersToggle.jsx                                # Toggle button for showing/hiding facet filters
│      ├── 📄 FilterSearchInput.jsx                                 # Search input for finding specific filters
│      ├── 📄 SelectedFilters.jsx                                   # Component displaying currently applied filters
│      └── 📂 styles/
│        ├── 📄 facetFilters.module.scss
│        ├── 📄 facetsToggle.module.scss
│        ├── 📄 filterSearch.module.scss
│        ├── 📄 selectedFilters.module.scss
│      └── 📂 utils/
│        ├── 📄 facetFilterUtils.js                                 # Utility functions for facet filter operations
│    └── 📂 featuredResults/
│      ├── 📄 FeaturedResults.jsx                                   # Component for displaying featured/promoted search results
│      ├── 📄 featuredResults.module.scss
│    └── 📂 login/
│      ├── 📄 index.jsx                                             # User login and authentication component
│      ├── 📄 login.module.scss
│    └── 📂 pagination/
│      ├── 📄 LoadMoreButton.jsx                                    # Button component for loading additional search results
│      ├── 📄 PaginationWithNumbers.jsx                             # Numbered pagination component for search results
│      ├── 📄 pagination.module.scss
│    └── 📂 recommendations/
│      ├── 📄 RecommendationNotification.jsx                        # Notification component for recommendation updates
│      ├── 📄 index.jsx                                             # Main recommendations component displaying suggested content
│      └── 📂 styles/
│        ├── 📄 recommendationNotification.module.scss
│        ├── 📄 recommendations.module.scss
│    └── 📂 relatedQueries/
│      ├── 📄 RelatedQueries.jsx                                    # Component showing related search queries
│      ├── 📄 relatedQueries.module.scss
│    └── 📂 searchInput/
│      ├── 📄 SearchInput.jsx                                       # Main search input component
│      ├── 📄 SearchInputSuggestions.jsx                            # Auto-complete suggestions dropdown for search input
│      ├── 📄 SearchSettings.jsx                                    # Settings panel for search configuration (keyword/vector search ratio and vector threshold)
│      ├── 📄 VoiceSearchInput.jsx                                  # Voice recognition search input component
│      └── 📂 hooks/
│        ├── 📄 GoogleCloudRecognitionConfig.js                     # Configuration for Google Cloud Speech Recognition
│        ├── 📄 index.js                                            # Main export file for voice recognition hooks
│        ├── 📄 recorder.js                                         # Audio recording functionality for voice search
│        ├── 📄 recorderHelpers.js                                  # Helper functions for audio recording operations
│      └── 📂 styles/
│        ├── 📄 inputDropdown.module.scss
│        ├── 📄 searchInput.module.scss
│        ├── 📄 searchSettings.module.scss
│    └── 📂 searchResults/
│      ├── 📄 DefaultResults.jsx                                    # Default search results layout component
│      ├── 📄 GeneratedAnswer.jsx                                   # AI-overview component for search queries
│      ├── 📄 NoResults.jsx                                         # Component displayed when no search results are found
│      ├── 📄 ResultItem.jsx                                        # Individual search result item component
│      ├── 📄 ResultsSkeleton.jsx                                   # Loading skeleton for search results
│      ├── 📄 ResultsSummary.jsx                                    # Summary information about search results (count, time, etc.)
│      └── 📂 styles/
│        ├── 📄 generatedAnswer.module.scss
│        ├── 📄 noResults.module.scss
│        ├── 📄 resultItem.module.scss
│        ├── 📄 resultListHeader.module.scss
│        ├── 📄 results.module.scss
│        ├── 📄 resultsSkeleton.module.scss
│    ├── 📄 searchUI.module.scss
│    └── 📂 smartFAQs/
│      ├── 📄 FAQItem.jsx                                           # Individual FAQ item component
│      ├── 📄 SmartFAQs.jsx                                         # Main smart FAQs component in accordion format
│      ├── 📄 SuggestedSmartFAQs.jsx                                # Component showing suggested FAQ questions based on search
│      └── 📂 styles/
│        ├── 📄 faqItem.module.scss
│        ├── 📄 smartFAQs.module.scss
│    └── 📂 sort/
│      ├── 📄 SortMenu.jsx                                          # Dropdown menu component for sorting options
│      ├── 📄 SortOptions.jsx                                       # Sort options configuration and logic
│      ├── 📄 sort.module.scss
│    └── 📂 topQueries/
│      ├── 📄 TopQuerySuggestions.jsx                               # Component showing most searched queries in search input dropdown
│      ├── 📄 index.jsx                                             # Main top queries component
│      ├── 📄 topQueries.module.scss
│  └── 📂 stores/
│    ├── 📄 assistStore.js                                          # State management for AI Assist functionality
│    ├── 📄 autoSuggestStore.js                                     # State management for auto-suggest features
│    ├── 📄 chatStore.js                                            # State management for chat functionality
│    ├── 📄 pluginSettingsStore.js                                  # State management for plugin settings dropdown
│    ├── 📄 recommendationsStore.js                                 # State management for Recommendations
│    ├── 📄 searchStore.js                                          # Main state management for search functionality
│    ├── 📄 securityStore.js                                        # State management for security and authentication
│    ├── 📄 smartFAQsStore.js                                       # State management for SmartFAQs functionality
│    ├── 📄 topQueriesStore.js                                      # State management for top queries
└── 📄 vite.config.js                                               # Vite configuration with necessary plugins and build setup
```
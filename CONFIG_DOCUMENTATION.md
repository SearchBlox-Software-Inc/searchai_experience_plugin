# Facet Configuration Documentation

This document explains all the configuration properties available in the `facet.js` file for customizing the search interface.

| Property                 | Description                                                                                                         | Default Values |
|--------------------------|---------------------------------------------------------------------------------------------------------------------|----------------|
| facets                   | Array of facet configurations for filtering search results. Includes field name, display name, and size/date range settings | colname, contenttype, keywords, topics, lastmodified |
| customDateSettings       | Configuration for custom date range filtering with enabled state, field, and display text                          | enabled: true, customDateField: "lastmodified", customDateDisplayText: "Date" |
| collection              | Array configuration for collection IDs to search across.                                                               | [] (search across all) |
| sortBtns                | Array of sort button configurations with field, display name, sort state, and direction                           | Date (desc), Relevance (asc, default active) |
| facetFiltersOrder       | Order in which facet filters should be displayed in the UI                                                         | ["colname", "contenttype", "topics", "keywords"] |
| checkboxesInFacet       | Whether to display checkboxes within facet filters                                                                 | true |
| checkboxFacets          | Array of facet fields that should display as checkboxes                                                           | ["topics", "keywords"] |
| facetsFiltersDisplay    | Whether to show the facet filters section in the UI                                                               | true |
| facetFiltersType        | Logic operator for combining multiple facet filters                                                                | "AND" |
| filtersSearchInput      | Configuration for search input within filters, including enable state and minimum filter threshold                | enabled: true, minFilters: 5 |
| loadMoreButton          | Whether to show a "Load More" button instead of standard pagination                                                                | true |
| pageSize                | Number of search results to display per page                                                                       | "10" |
| showAutoSuggest         | Whether to enable auto-suggest functionality                                                                       | true |
| autoSuggestLimit        | Maximum number of auto-suggest results to display                                                                  | "5" |
| suggestSearch           | Whether to enable search query suggestion                                                                           | false |
| defaultCname            | Default collection name to use for searches                                                                        | "" (empty string) |
| adsDisplay              | Whether to display featured results in search results                                                                | true |
| featuredResultsCount    | Number of featured results to display at the top                                                                   | "3" |
| urlDisplay              | Whether to display URLs in search results                                                                          | true |
| pdfOverlay              | Whether to enable PDF overlay functionality for PDF documents                                                      | false |
| relatedQuery            | Whether to enable related query suggestions                                                                        | false |
| relatedQueryFields      | Configuration object for related query functionality including API key, field, operator, limits, and collection  | apikey: "", field: "content", operator: "and", limit: "5", terms: "10", type: "phrase", col: "" |
| smartFAQSettings        | Configuration for Smart FAQ functionality including enable state, count, load more count, and limit              | enabled: false, count: 3, loadMoreCount: 0, limit: 10 |
| suggestSmartFAQs        | Configuration for suggested Smart FAQs with enable state and limit                                                | enabled: false, limit: 3 |
| smartSuggest            | Configuration for smart suggestions including domain, SearchBlox domain flag, collection name, limit, and language | enable: false, domain: "", isSBDomain: true, cname: "", limit: "5", language: "en" |
| trendingSearch          | Configuration for trending search functionality with enable state, collection name, and limit                     | enabled: false, cname: "", limit: "5" |
| topQuery                | Whether to enable top query functionality                                                                          | true |
| topQueryFields          | Configuration for top queries including API key, collection, and limit                                            | apikey: "", col: "", limit: "5" |
| dataToBeDisplayed       | Configuration for which data fields to display in search results for different result types                       | "1": {title: "Title", description: "Description"}, "other": {description: "Description"}, displayAll: true |
| descriptionCharLimit    | Configuration for limiting description text length with enable state and character limit                          | enabled: true, limit: 260 |
| chatBot                 | Configuration for chatbot functionality including enable state, domain, name, idle timeout, and suggestions       | enabled: false, domain: "", name: "", idleTimeOut: 30, suggestions: false |
| assist                  | Configuration for AI assist functionality with enable state and result limit                                      | enabled: true, limit: 4 |
| tuneTemplate            | Template type for relevance tuning                                                                                    | "WEB" |
| voiceSearch             | Whether to enable voice search functionality                                                                       | false |
| debug                   | Whether to enable debug mode for troubleshooting                                                                   | false |
| defaultType             | Default search operator type                                                                                       | "AND" |
| apikey                  | API key for SearchBlox authentication                                                                              | "" (empty string) |
| autologout              | Whether to enable automatic logout functionality                                                                   | true |
| recommendations         | Configuration for search result recommendations including enable state, domain, and limit                                | enabled: true, domain: "", limit: 4 |
| hybridSearchDefaults    | Configuration for hybrid search including controls, vector weight, and threshold                                   | controlsEnabled: true, vectorWeight: 0.2, vectorThreshold: 0.6 |
| pluginDomain            | SB-installed domain URL                                                                                    | "" |


## Usage

Modify the values in `public/facet.js` to customize the search interface behavior according to your requirements. Configuration can also be adjusted and updated in the `facet.js` file within the build directory once generated. 
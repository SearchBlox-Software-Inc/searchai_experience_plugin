let facetsJSON = window.facets;
let userFacets = window.inputFacets;
let autoSuggestDisplay = facetsJSON.showAutoSuggest;
let smartFAQSettingsInput = document.getElementById("smartFAQSettings"),smartFAQSettingsObj;
if(smartFAQSettingsInput !== null && smartFAQSettingsInput !== undefined && smartFAQSettingsInput.getAttribute("enabled") !== "") {
  smartFAQSettingsObj = {
    "enabled": smartFAQSettingsInput.getAttribute("enabled") === "true" ? true : false,
    "count": parseInt(smartFAQSettingsInput.getAttribute("count")),
    "loadMoreCount": parseInt(smartFAQSettingsInput.getAttribute("loadMoreCount")),
    "limit": parseInt(smartFAQSettingsInput.getAttribute("limit"))
  };
}
let suggestSmartFAQsInput = document.getElementById("suggestSmartFAQs"),suggestSmartFAQsObj;
if(suggestSmartFAQsInput !== null && suggestSmartFAQsInput !== undefined &&  suggestSmartFAQsInput.getAttribute("enabled") !== "") {
  suggestSmartFAQsObj = {
    "enabled": suggestSmartFAQsInput.getAttribute("enabled") === "true" ? true : false,
    "limit": parseInt(suggestSmartFAQsInput.getAttribute("limit"))
  };
}

if(Object.keys(window.autoSuggestObject).length > 0) {
  if(window.autoSuggestObject.showAutoSuggest==="false"){
    autoSuggestDisplay = false;
  }
  if(window.autoSuggestObject.showAutoSuggest==="true"){
    autoSuggestDisplay = true;
  }
}

let inputPluginDomain = document.getElementById("sb_plugin_domain");

export const facets = userFacets && userFacets.length > 0 ?userFacets:facetsJSON.facets;
export const facetFiltersOrder = facetsJSON.facetFiltersOrder;
export const facetFiltersType = facetsJSON.facetFiltersType;
export const sortButtons = facetsJSON.sortBtns;
export const tuneTemplate = facetsJSON.tuneTemplate;
export const defaultCollections = Object.assign([], facetsJSON.collection);
export const sortDirection = facetsJSON.sortDir;
export const loadMoreButton = facetsJSON.loadMoreButton;
export const pageSize = facetsJSON.pageSize;
export const customDateSettings = facetsJSON.customDateSettings;
export const defaultCname = facetsJSON.defaultCname;
export const defaultType = facetsJSON.defaultType;
export const featuredResultsCount = facetsJSON.featuredResultsCount;
export const adsDisplay = facetsJSON.adsDisplay;
export const urlDisplay = facetsJSON.urlDisplay;
export const facet = facetsJSON.facet;
export const apikey= facetsJSON.apikey;
export const smartSuggest = facetsJSON.smartSuggest;
export const trendingSearch = facetsJSON.trendingSearch;
export const pdfOverlay = facetsJSON.pdfOverlay;
export const relatedQueryFields = facetsJSON.relatedQueryFields;
export const relatedQuery = facetsJSON.relatedQuery;
export const smartFAQSettings = (smartFAQSettingsObj !== undefined) ? smartFAQSettingsObj: facetsJSON.smartFAQSettings;
export const suggestSmartFAQs = (suggestSmartFAQsObj !== undefined)? suggestSmartFAQsObj : facetsJSON.suggestSmartFAQs;
export const showAutoSuggest = autoSuggestDisplay;
export const suggestSearch = facetsJSON.suggestSearch;
export const autoSuggestLimit = facetsJSON.autoSuggestLimit;
export const topQueryFields = facetsJSON.topQueryFields;
export const topQuery = facetsJSON.topQuery;
export const facetsFiltersDisplay = facetsJSON.facetsFiltersDisplay;
export const dataToBeDisplayed = facetsJSON.dataToBeDisplayed;
export const advancedFilters = facetsJSON.advancedFilters;
export const debug = facetsJSON.debug;
export const autologout = facetsJSON.autologout;
export const pluginDomain = (inputPluginDomain !== "" && inputPluginDomain !== null) ? inputPluginDomain.value:facetsJSON.pluginDomain;
export const voiceSearchAPI = facetsJSON.voiceSearchAPI;
export const voiceSearch = facetsJSON.voiceSearch;
export const descriptionCharLimit = facetsJSON.descriptionCharLimit;
export const chatBotConfiguration = facetsJSON.chatBot;
export const checkboxesInFacet = facetsJSON.checkboxesInFacet;
export const checkboxFacets = facetsJSON.checkboxFacets;
export const filtersSearchInput = facetsJSON.filtersSearchInput;
export const hybridSearchDefaults = facetsJSON.hybridSearchDefaults;
export const recommendations = facetsJSON.recommendations;
export const assist = facetsJSON.assist;

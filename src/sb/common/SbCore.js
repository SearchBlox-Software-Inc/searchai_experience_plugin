import axios from 'axios';
import queryString from 'query-string';
import * as defaults from './Defaults';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { history } from './CustomHistory';


// ------------------------------

dayjs.extend(utc);

// ------------------------------


// Checks for URL parameters and sends a request to the SearchBlox server, returning its response.
export const getSBResponse = (parameters) => {
  if(Object.keys(parameters).length !== 0){
   //  parameters.query = encodeURIComponent(parameters.query);
    let pluginDomain = defaults.pluginDomain;
    
    let pd = document.getElementById("sb_plugin_domain");
    if(pd !== undefined && pd !== null && pd !== ""){
      pluginDomain = pd.value;
    }
    if(localStorage.getItem("pcode") !== null && localStorage.getItem("pcode") !== "" && localStorage.getItem("pcode") !== undefined) {
      parameters.pcode = localStorage.getItem("pcode");
    }
    parameters.smartfaqdisable = true;

    if (parameters['v.weight'] > 0 && parameters['v.threshold'] > 0) {
      parameters.default = "OR";
      parameters.pagesize = 50;
    } else {
      parameters.query = encodeURIComponent(parameters.query);
    }

    
    const searchEndpoint = !parameters['v.weight'] || parameters['v.weight'] == 0  ? 'search' : 'hybrid-search';

    
    return axios.get(pluginDomain + `/rest/v2/api/${searchEndpoint}?` + queryString.stringify(parameters),{headers:{"Authorization": "Bearer " + localStorage.getItem("searchToken")}})
    .then((response)=>{
      if(response.data && response.data.pcode) {
        localStorage.setItem("pcode",response.data.pcode);
      }
      let uidArray = [];
      if(response.data && response.data.ads && response.data.ads.length > 0) {
        let adsResponse = response.data.ads;
          for(let i = 0, len = adsResponse.length; i< len; i++){
            uidArray.push(adsResponse[i].uid);
          }
          let adsObj = {
            uids: uidArray
          };
          axios.post(pluginDomain + "/ui/v1/featured-result/display-count",adsObj);
      }
      return response;
    })
    .catch((error) => {
      console.error('Search error:', error);
      if(error.response && error.response.data) {
        return error.response.data;
      }
      else {
        return error;
      }
    });
  }
};

// Sends a request to SearchBloxServer for suggestion list and returns its response.
export const getAutoSuggest = (query) => {
  let autosuggestId = "";
  let urlParameters = Object.assign({}, queryString.parse(window.location.search));
  let colArray = [];
  let colString = "";
  if(defaults.defaultCollections.length > 0){
    colArray = defaults.defaultCollections.slice();
  }
  else if(urlParameters.col && urlParameters.col.constructor === Array) {
    colArray = urlParameters.col.slice();
  }
  else if(urlParameters.col && urlParameters.col.constructor === String) {
    colArray.push(urlParameters.col);
  }
  if(colArray !== null && colArray !== undefined && colArray !== "" && colArray.length > 0) {
    colArray.map((value,key) => {
      colString = colString + "&col=" + value;
    });
  }

  if(window.smartSuggest.SmartSuggest.length > 0) {
    let smartArray = [];
    for(let i=0;i<window.smartSuggest.SmartSuggest.length;i++) {
      if(window.smartSuggest.SmartSuggest[i].collectionID === parseInt(urlParameters.col)) {
        return axios.get(window.smartSuggest.SmartSuggest[i].endpoint+query)
        .then((response)=>{
          return response;
        })
        .catch((error)=>{
          return error;
        });
      }
      else if(window.smartSuggest.SmartSuggest[i].collection === urlParameters.cname) {
        return axios.get(window.smartSuggest.SmartSuggest[i].endpoint+query)
        .then((response)=>{
          return response;
        })
        .catch((error)=>{
          return error;
        });
      }
    }
  }

  if(defaults.smartSuggest.enable !== "" && defaults.smartSuggest.enable && window.smartSuggest.SmartSuggest.length === 0){
      const { domain, isSBDomain, cname, limit, language } = defaults.smartSuggest;
      const endpointPath = isSBDomain ? `/rest/v2/api/smartsuggest` : `/SmartSuggest`;

    return axios.get(domain + endpointPath + "?q=" + query + "&cname=" + cname + "&limit=" + limit + "&lang=" + language)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
  else {
    return axios.get(defaults.pluginDomain + "/rest/v2/api/autocomplete?limit="+defaults.autoSuggestLimit+"&query=" + query+colString)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

// Retrieves trending search data based on cname configured in facet.js.
export const getTrendingData = () => {
  const cname = defaults.trendingSearch.cname;

  let pluginDomain = defaults.pluginDomain;
  const pd = document.getElementById("sb_plugin_domain");
  if (pd !== undefined && pd !== null && pd !== "") {
    pluginDomain = pd.value;
  }
  return axios.get(pluginDomain + "/rest/v2/api/search?query=*&xsl=json&sort=alpha&sortdir=asc&pagesize=" + defaults.trendingSearch.limit + "&cname=" + cname, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("searchToken")
      }
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return error;
      }
    });
};

// Tracks which suggestions are clicked on. (for analytics)
export const getSuggestClickCount = (parameters) => {
  let urlParameters = Object.assign({}, queryString.parse(window.location.search));
  if(Object.keys(parameters).length !== 0){
    if(parameters.query.indexOf('"') >= 0) {
      parameters.query = parameters.query.replace(/['"]+/g, '');
    }
    let clickObj = {
        query: decodeURIComponent(parameters.query),
        suggestion:parameters.suggest
    };

    return axios.post(defaults.pluginDomain + "/ui/v1/analytics/suggest",clickObj)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

// Tracks which featured results are clicked on. (for analytics)
export const getFeaturedResultClickCount = (parameters) => {
  let urlParameters = Object.assign({}, queryString.parse(window.location.search));
  if(Object.keys(parameters).length !== 0){
    parameters.query = urlParameters.query;

    let clickObj = {
        uid: parameters.uid,
        query: parameters.query,
    };
      return axios.post(defaults.pluginDomain + "/ui/v1/analytics/fr",clickObj)
      .then((response)=>{
        return response;
      })
      .catch((error)=>{
        return error;
      });
    }
};

// Tracks impressions of a particular set of FAQs. (for analytics)
export const smartFaqDisplayCount = (faqArr) => {
  if(faqArr.length > 0){
    let urlParameters = Object.assign({}, queryString.parse(window.location.search));
    let clickObj = {
        smartfaq: faqArr,
        query: urlParameters.query,
        pcode:localStorage.getItem("pcode"),
        action:"show"
    };
     return axios.post(defaults.pluginDomain + "/rest/v2/api/smart-faq/impression",clickObj)
       .then(response => response)
       .catch(error => error);
    }
};

// Parses facets in facet.js and sets initial URL parameters such as page, pagesize, sortdir, sort, col on page load.
export const getInitialUrlParameters = (query) => {
  let urlParameters = Object.assign({}, queryString.parse(window.location.search));
  let col = document.getElementById("sb_col");
  let cname = document.getElementById("sb_cname");
  let filter = document.getElementById("sb_filter");
  let sb_query = document.getElementById("sb_query");
  let sb_page = document.getElementById("sb_page");
  let sb_sort = document.getElementById("sb_sort");
  let sb_default = document.getElementById("sb_default");
  let sb_tunetemplate = document.getElementById("sb_tunetemplate");
  let sb_autosuggest = document.getElementById("sb_autosuggest");
  // let sb_security = document.getElementById("sb_security");

  // Function to parse the facets in facet.json
  let parseFacetsForSearch = ()=>{ // ----------parseFacetsForSearch start ----------------------
    let facets = defaults.facets;
    let advancedFilters = (defaults.advancedFilters)?defaults.advancedFilters:{};
    if(facets.length >= 1){
      urlParameters['facet.field'] = [];
      for(let i in facets){
        urlParameters['facet.field'].push(facets[i].field);
        if(facets[i].dateRange === undefined){
          urlParameters[`f.${facets[i].field}.size`] = facets[i].size;
        }else{
          urlParameters[`f.${facets[i].field}.range`] = [];
          urlParameters[`f.${facets[i].field}.range`] = facets[i].dateRange.map((range)=>{
            return "[" + dayjs().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
          });
        }
      }
    }
    if(advancedFilters.select){
      for(let i in advancedFilters.select){
        if(urlParameters['facet.field'].indexOf(advancedFilters.select[i].field) === -1){
          urlParameters['facet.field'].push(advancedFilters.select[i].field);
          urlParameters[`f.${advancedFilters.select[i].field}.size`] = advancedFilters.select[i].size;
        }
      }
    }
    if(advancedFilters.input){
      for(let i in advancedFilters.input){
        if(urlParameters['facet.field'].indexOf(advancedFilters.input[i].field) === -1){
          urlParameters['facet.field'].push(advancedFilters.input[i].field);
          urlParameters[`f.${advancedFilters.input[i].field}.size`] = advancedFilters.input[i].size;
        }
      }
    }
    if(advancedFilters.date){
      for(let i in advancedFilters.date){
        if(urlParameters['facet.field'].indexOf(advancedFilters.date[i].field) === -1){
          urlParameters['facet.field'].push(advancedFilters.date[i].field);
        }
      }
    }
  }; //------------------------parseFacetsForSearch end --------------------

  const allowedParams = ['cname', 'v.weight', 'v.threshold', 'public'];
  
  if(Object.keys(urlParameters).length <= 4){
    // CONDITION FOR DEFAULT FACETS ON INITIAL PAGE LOAD

    
    parseFacetsForSearch();
    (query === undefined || query === '' || query === null)?(urlParameters.query = '*'):(urlParameters.query = query);
    urlParameters.page = 1;
    urlParameters.pagesize = defaults.pageSize;
    if(!urlParameters.cname && defaults.defaultCname !== "") {
      urlParameters.cname = defaults.defaultCname;
    }
    urlParameters.adsDisplay = defaults.adsDisplay;
    // urlParameters.adsCount = defaults.featuredResultsCount;
    defaults.sortButtons.map((sortVal,key) => {
      if(sortVal.sort) {
        urlParameters.sort = sortVal.field;
        urlParameters.sortdir = sortVal.sortDir ? sortVal.sortDir : "desc";
      }
      if(sortVal.sort1) {
        urlParameters.sort1 = "relevance";
        urlParameters.sortdir1 = "desc";
      }
    });
    urlParameters.relatedQuery = defaults.relatedQuery;
    // urlParameters.security = defaults.security;
    urlParameters.topQuery = defaults.topQuery;
    urlParameters.tunetemplate = defaults.tuneTemplate;
    urlParameters.autoSuggestDisplay = defaults.showAutoSuggest;
    urlParameters.col = defaults.defaultCollections.slice();
    if(defaults.defaultType !== ""){
      urlParameters.default = defaults.defaultType;
    }
    if(localStorage.getItem("searchToken")===null || localStorage.getItem("searchToken")===undefined || localStorage.getItem("searchToken")===""){
      urlParameters.public = true;
    }
    else if(localStorage.getItem("searchToken")!==null && localStorage.getItem("searchToken")!==undefined && localStorage.getItem("searchToken")!==""){
      if(urlParameters.public){
        delete urlParameters.public;
      }
    }
  }else{
    if(sb_query !== undefined && sb_query !== null && sb_query !== ""){
      urlParameters.query = sb_query.value;
    }
    else {
      urlParameters.query = query;

    }
  }
  urlParameters.query = encodeURIComponent(urlParameters.query);
  if(cname !== undefined && cname !== null && cname !== "" && cname.value !== ""){
    urlParameters.cname = [];
    let cnames = cname.value.split(",");
    for(let i = 0, len = cnames.length; i< len; i++){
      urlParameters.cname.push(cnames[i].trim());
    }
  }
  if(col !== undefined && col !== null && col !== "" && col.value !== ""){
    urlParameters.col = [];
    let cols = col.value.split(",");
    for(let i = 0, len = cols.length; i< len; i++){
      urlParameters.col.push(cols[i].trim());
    }
  }
  if(filter !== undefined && filter !== null && filter !== ""){
    urlParameters.filter = filter.value;
  }
  if(sb_page !== undefined && sb_page !== null && sb_page !== ""){
    let pageValues = sb_page.value.split("|");
    urlParameters.page = pageValues[0];
    urlParameters.pagesize = pageValues[1];
  }
  if(sb_default !== undefined && sb_default !== null && sb_default !== ""){
    urlParameters.default = sb_default.value;
  }
  if(sb_tunetemplate !== undefined && sb_tunetemplate !== null && sb_tunetemplate !== ""){
    if(sb_tunetemplate.value.trim()!==""){
      urlParameters.tunetemplate = sb_tunetemplate.value;
    }
  }
  if(sb_autosuggest  !== undefined && sb_autosuggest !== null && sb_autosuggest !== ""){
    urlParameters.autoSuggestDisplay = sb_autosuggest.value;
  }
  // if(sb_security  !== undefined && sb_security !== null && sb_security !== ""){
  //   urlParameters.autoSuggestDisplay = sb_security.value;
  // }
  if(sb_sort !== undefined && sb_sort !== null && sb_sort !== ""){
    let sortValues = sb_sort.value.split("|");
    urlParameters.sort1 = sortValues[0];
    urlParameters.sortdir1 = sortValues[1];
  }

   // Hybrid search
   if (!urlParameters['v.weight']) {
      urlParameters['v.weight'] = defaults.hybridSearchDefaults.vectorWeight;
      urlParameters['v.threshold'] = defaults.hybridSearchDefaults.vectorThreshold;
   }
   
   // if (!urlParameters.keywordWeight) {
   //    urlParameters.vectorWeight = defaults.hybridSearchDefaults.vectorWeight;
   //    urlParameters.keywordWeight = (1 - defaults.hybridSearchDefaults.vectorWeight).toFixed(1);
   // }

   return urlParameters;
};

// Clears applied filters whenever the search term is changed.
export const clearAllFilters = (urlParameters) => {
    let facetFields = [];
    facetFields = Object.assign([], defaults.facets);
    let customDateField = "";
    customDateField = defaults.customDateSettings.customDateField;
    delete urlParameters['facet.field'];
    urlParameters['facet.field'] = [];
    for(let i=0, len = facetFields.length; i<len; i++){
      urlParameters['facet.field'].push(facetFields[i].field);
      if(`${facetFields[i]['field']}` !== "Lang" && `${facetFields[i]['field']}` !== "language") {
        delete urlParameters[`f.${facetFields[i]['field']}.filter`];
      }
      if(urlParameters[`f.${customDateField}.filter`]){
        delete urlParameters[`f.${customDateField}.filter`];
        delete urlParameters[`f.${customDateField}.range`];
      }
      if(facetFields[i].dateRange){
        urlParameters[`f.${facetFields[i].field}.range`] = [];
        urlParameters[`f.${facetFields[i].field}.range`] = facetFields[i].dateRange.map((range)=>{
          return "[" + dayjs().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
        });
      }
    }

    if(urlParameters.customDate){
      delete urlParameters.customDate;
    }
    urlParameters.page=1;
    return urlParameters;
};

// Tracks which search results are clicked on. (for analytics)
export const getDocumentClickCount = (parameters) => {
  let urlParameters = Object.assign({}, queryString.parse(window.location.search));
  if(Object.keys(parameters).length !== 0){
    parameters.query = urlParameters.query;
    parameters.title = new DOMParser().parseFromString(parameters.title, 'text/html').body.textContent;
    if(localStorage.getItem("pcode") !== null && localStorage.getItem("pcode") !== "" && localStorage.getItem("pcode") !== undefined) {
      parameters.pcode = localStorage.getItem("pcode");
    }
    if(urlParameters.pagesize){
      parameters.pagesize = urlParameters.pagesize;
    }
    else{
      parameters.pagesize = 10;
    }
    let clickObj = {
        collection: parameters.col,
        query: parameters.query,
        title:parameters.title,
        uid:parameters.uid,
        url:parameters.url,
        pcode:parameters.pcode,
        pos:parameters.no,
        page:urlParameters.page,
        pageSize:parameters.pagesize
    };
    return axios.post(defaults.pluginDomain + "/ui/v1/analytics/click",clickObj)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

// Retrieves email search data based on the query.
export const getEmailViewer = (parameters) => {
  if(Object.keys(parameters).length !== 0){
    return axios.get(defaults.pluginDomain+"/ui/v1/email/view?url="+parameters.url+"&col="+parameters.col)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

// Formats the URL parameters and loads the page for every search.
export const getResults = (urlParameters) => {
  if(urlParameters.query !== "") {
    let keyRegex = /^f\.[A-z]+\.filter$/g;
    let dateRegex = /^\[[0-9]{4}/g;
  Object.keys(urlParameters).map(key => {
    if(keyRegex.test(key) && !dateRegex.test(urlParameters[key])){
      if(urlParameters[key].constructor === Array){
          urlParameters[key] = urlParameters[key].map(val => {
            return encodeURIComponent(decodeURIComponent(decodeURIComponent(val)));
          });
        }else{
          urlParameters[key] = encodeURIComponent(decodeURIComponent(decodeURIComponent(urlParameters[key])));
        }
    }
  });
  let paramsOrder = ['query', 'page', 'pagesize', 'sort', 'sortdir','language'];
  let firstString = {}, secondString = {};
  for(let param in urlParameters){
    (paramsOrder.indexOf(param) > -1)?(firstString[param] = urlParameters[param]):(secondString[param] = urlParameters[param]);
  }
  let params = queryString.stringify(firstString, {sort: (m, n)=>paramsOrder.indexOf(m) >= paramsOrder.indexOf(n)}) + '&' + queryString.stringify(secondString);
  let decodedPramsString = decodeURIComponent(params).replace(/\+/g, '%2B');
   history.push(`?${decodedPramsString}`);
 }
};

// Performs an advanced search based on applied filters.
export const doAdvancedSearch = (appliedFilterObj) => {
  let urlParameters = Object.assign({}, queryString.parse(window.location.search));
  let advancedString = "(";
  let advancedStringObject = {};
  delete urlParameters['filter'];
  for(let field in appliedFilterObj){
    if(appliedFilterObj[field].constructor === String && appliedFilterObj[field] !== ""){
      advancedString += "(" + field + ":" + encodeURIComponent(appliedFilterObj[field]) + ") AND ";
    }else if(appliedFilterObj[field].constructor === Array && appliedFilterObj[field].length !== 0){
      let len = appliedFilterObj[field].length;
      advancedString += "(" + field + ":(";
      for(let i = 0; i < len; i++){
        advancedString += "\"" + encodeURIComponent(appliedFilterObj[field][i]) + "\"";
        if(i !== len - 1){
          advancedString += " OR ";
        }else{
          advancedString += ")) AND ";
        }
      }
    }else if(appliedFilterObj[field].constructor === Object){
      if(appliedFilterObj[field].from !== "" && appliedFilterObj[field].to !== ""){
        advancedStringObject[`f.${field}.filter`] = "[" + appliedFilterObj[field].from + "T00:00:00TO" + appliedFilterObj[field].to + "T23:59:59]";
      }else if(urlParameters[`f.${field}.filter`]){
        delete urlParameters[`f.${field}.filter`];
      }
    }
  }
  advancedString = advancedString.replace(/( AND )$/, "") + ")";
  if(advancedString !== "()"){
    advancedStringObject['filter'] = advancedString;
  }
  urlParameters = Object.assign({}, urlParameters, advancedStringObject);
  getResults(urlParameters);
};

// Reads the URL and collects all applied filters into a single format for displaying.
export const parseAppliedFiltersFromUrl = () => {
  let urlParameters = Object.assign({}, queryString.parse(window.location.search));
  let stateObj = {
    filters: {},
    checkAdvancedFilters: false
  };
  let dateFiltersLength = defaults.advancedFilters.date.length;
  let dateFiltersArray = Object.assign([], defaults.advancedFilters.date);
  if(urlParameters.filter !== undefined){
    stateObj.checkAdvancedFilters = true;
    let filtersArray = urlParameters.filter.replace(/^(\()/, "").replace(/(\))$/, "").split(" AND ");
    for(let i = 0, len = filtersArray.length; i < len; i++){
      let keyAndVal = filtersArray[i].replace(/^(\()/, "").replace(/(\))$/, "").split(":");
      if(keyAndVal[1].startsWith("(") && keyAndVal[1].startsWith(")", keyAndVal[1].length-1)){
        stateObj.filters[keyAndVal[0]] = JSON.parse(keyAndVal[1].replace(/^(\()/, "[").replace(/(\))$/, "]").replace(/\sOR\s/g, ","));
      }else{
        stateObj.filters[keyAndVal[0]] = keyAndVal[1];
      }
    }
  }
  if(dateFiltersLength > 0){
    for(let i = 0; i < dateFiltersLength; i++){
      if(urlParameters[`f.${dateFiltersArray[i].field}.filter`]){
        stateObj.checkAdvancedFilters = true;
        let filterField = dateFiltersArray[i].field;
        let filterValue = urlParameters[`f.${dateFiltersArray[i].field}.filter`];
        if(filterValue.length === 42){ //HARDCODED VALUE SINCE FORMAT [2018-12-12T00:00:00TO2018-12-12T00:00:00] HAVE 42 CHARACTERS
          stateObj.filters[filterField] = {
            from: filterValue.substr(1, 10),
            to: filterValue.substr(22, 10)
          };
        }
      }
    }
  }
  return stateObj;
};

// Formats the received response for further use.
export function parseSBResponse(response){
  try{
    if(response.status === 200 && response.data){
      let sbResponse = response.data;
      let facets = [];
      let results = [];
      let resultInfo = {};
      let featuredResults = [];
      let smartFAQs = [];

      // REFACTORING FACETS START
      if(sbResponse.facets){ // CHECKING IF FACETS ARE AVAILABLE FOR RESPONSE
        if(sbResponse.facets.constructor === Array){ // CHECKING IF FACET IS AN ARRAY(MORE THAN ONE FACET)
          for(let i = 0, len = sbResponse.facets.length; i < len; i++){
            let sbFacet1 = sbResponse.facets[i]; // PICKING SINGLE FACET TO RESTRUCTURE
            for(let j = 0, len1 = sbFacet1.facet.length; j < len1; j++){
              let sbFacet = sbFacet1.facet[j];
            let facet = {};
            facet[sbFacet["name"]] = [];
            facet["display"] = "";
            let facetHeading = "";
            let facetField = "";

            if(sbFacet["int"]){ // CHECKING IF FACET HAS FILTERS
              let filters = [];
              if(sbFacet["int"].constructor === Array){ //CHECKING IF THERE ARE MORE THAN ON FILTER
                if(sbFacet["int"].length > 0) {
                  for(let k = 0, len1 = defaults.facets.length; k < len1; k++){
                    let defaultFacets = defaults.facets[k];
                      if(sbFacet['name'] === defaultFacets['field']){
                        facetHeading = defaultFacets['display'];
                        facetField = defaultFacets['field'];
                      }
                    }
                  if(facetHeading === "") {
                    facetHeading = sbFacet['name'];
                    facetField = sbFacet['name'];
                  }
                }
                for(let fc = 0, lenfc = sbFacet["int"].length; fc < lenfc; fc++){
                  let sbFilter = sbFacet["int"][fc]; // PICKING SINGLE SB FILTER VALUE TO RESTRUCTURE
                  let rangeFacetValues = "";
                  let rangeFormat = "";
                  let urlParameters = "";
                  let filterValue = "";
                  if(sbFilter["from"] || sbFilter["to"]){  // IF FILTER IS DATE TYPE
                    if(sbFilter["to"]!==null){
                      rangeFacetValues = dayjs(sbFilter["to"]).format('YYYY-MM-DDTHH:mm:ss') + " TO " +dayjs(sbFilter["from"]).format('YYYY-MM-DDTHH:mm:ss');
                      rangeFormat = "[" + dayjs(sbFilter["from"]).utc().format('YYYY-MM-DDTHH:mm:ss') + "TO" +dayjs(sbFilter["to"]).utc().format('YYYY-MM-DDTHH:mm:ss') +"]";
                    }
                    else{
                      rangeFacetValues = dayjs(sbFilter["from"].replace(/.000Z/g, ""), "YYYY-MM-DDTHH:mm:ss").fromNow();
                      rangeFormat = "[" + dayjs(sbFilter["from"].replace(/.000Z/g, "")).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
                  }
                  urlParameters = Object.assign({}, queryString.parse(window.location.search));
                  if(urlParameters['f.'+sbFacet['name']+'.filter']) {
                    if(urlParameters['f.'+sbFacet['name']+'.filter'].constructor === Array) {
                      for(let i = 0, len = urlParameters['f.'+sbFacet['name']+'.filter'].length; i < len; i++){
                        if(rangeFormat === urlParameters['f.'+sbFacet['name']+'.filter'][i]) {
                          sbFilter["filter"] = "true";
                        }
                      }
                    }
                    else {
                      if(rangeFormat === urlParameters['f.'+sbFacet['name']+'.filter']) {
                        sbFilter["filter"] = "true";
                      }
                    }
                  }
                  filters.push({
                    filterName: rangeFacetValues,
                    count: sbFilter["count"],
                    filterSelect: sbFilter["filter"],
                    fromValue:rangeFormat,
                    rangeField:sbFacet['name']
                  });
                  }
                  if(sbFilter["name"]){ // IF FILTER IS STRING TYPE AND NOT DATE
                    filters.push({
                      filterName: sbFilter["name"],
                      count: sbFilter["count"],
                      filterSelect: sbFilter["filter"]
                    });
                  }
                }
              }else if(sbFacet["int"].constructor === Object){
                if(sbFacet["int"]["name"]){ // IF FILTER IS STRING TYPE AND NOT DATE
                  filters.push({
                    filterName: sbFacet["int"]["name"],
                    count: sbFacet["int"]["count"],
                    filterSelect: sbFacet["int"]["filter"]
                  });
                }
              }
              filters = filters.slice(0).sort((a, b) => {
               // First, sort by filterSelect (true/1 on top)
               if (a.filterSelect !== b.filterSelect) {
                 return b.filterSelect - a.filterSelect;
               }

               const urlParams = queryString.parse(window.location.search);
               const isVectorSearch = urlParams['v.weight'] != 0;

               if (isVectorSearch) {
                  return a.filterName.localeCompare(b.filterName);
               }

               return b.count - a.count;
             });
              facet[sbFacet["name"]] = filters; // ASSIGNING FILTERS TO FACET NAME NODE OF OBJECT
              facet["display"] = facetHeading;
              facet['facetField'] = facetField;
              }
              facets.push(facet); // APPENDING SINGLE FACET DATA TO ARRAY OF FACETS
          }
          }
        }
      } // REFACTORING FACETS END

      // REFACTORING RESULTS START
      if(sbResponse){
        if(sbResponse.result){
          results = refactorToArray(sbResponse.result);
        }

        if(sbResponse.ads){
          featuredResults = refactorToArray(sbResponse.ads);
        }

        if(sbResponse.smartFaq){
          smartFAQs = refactorToArray(sbResponse.smartFaq);
        }

        if(sbResponse["currentPage"] !== undefined && sbResponse["currentPage"] !== null)resultInfo.currentPage = parseInt(sbResponse["currentPage"]);
        if(sbResponse["filter"] !== undefined && sbResponse["filter"] !== null) resultInfo.filter = sbResponse["filter"];
        if(sbResponse["hits"] !== undefined && sbResponse["hits"] !== null) resultInfo.hits = parseInt(sbResponse["hits"]);
        if(sbResponse["lastPage"] !== undefined && sbResponse["lastPage"] !== null) resultInfo.lastPage = parseInt(sbResponse["lastPage"]);
        if(sbResponse["query"] !== undefined && sbResponse["query"] !== null) resultInfo.query = sbResponse["query"];
        if(sbResponse["sort"] !== undefined && sbResponse["sort"] !== null) resultInfo.sort = sbResponse["sort"];
        if(sbResponse["sortDir"] !== undefined && sbResponse["sortDir"] !== null) resultInfo.sortDirection = sbResponse["sortDir"];
        if(sbResponse["sort1"] !== undefined && sbResponse["sort1"] !== null) resultInfo.sort1 = sbResponse["sort1"];
        if(sbResponse["sortDir1"] !== undefined && sbResponse["sortDir1"] !== null) resultInfo.sortDirection1 = sbResponse["sortDir1"];
        if(sbResponse["suggest"] !== undefined && sbResponse["suggest"] !== null) resultInfo.suggest = sbResponse["suggest"];
        if(sbResponse["time"] !== undefined && sbResponse["time"] !== null) resultInfo.time = sbResponse["time"];
        if(sbResponse["start"] !== undefined && sbResponse["start"] !== null) resultInfo.start = sbResponse["start"];
        if(sbResponse["end"] !== undefined && sbResponse["end"] !== null) resultInfo.end = sbResponse["end"];
        if(sbResponse["highlight"] !== undefined && sbResponse["highlight"] !== null) resultInfo.highlight = sbResponse["highlight"];
      }
      // REFACTORING RESULTS START

      return {
        facets,
        results,
        featuredResults,
        smartFAQs,
        resultInfo
      };
    }
  }catch(e){
    return {
      facets: [],
      results: [],
      featuredResults:[],
      smartFAQs: [],
      resultInfo: {}
    };
  }
}

// Common function to refactor received data into an array.
export const refactorToArray = data => {
  if(data.constructor === Array) {
    return data;
  } else if(data.constructor === Object) {
    const array = [];
    return array.concat(data);
  }
};

// Calls and tracks actions on a particular FAQ, such as - show, open, upvote, and downvote. (for analytics)
export const callSmartFAQAction = payload => {
  const urlParameters = Object.assign({}, queryString.parse(window.location.search));

  if(Object.keys(payload).length !== 0) {
    payload.query = urlParameters.query;

    const pcode = localStorage.getItem('pcode');

    if(pcode) {
      payload.pcode = pcode;
    }

    return axios.post(`${defaults.pluginDomain}/rest/v2/api/smart-faq/action`, payload)
      .then(response => response)
      .catch(error => error);
  }
};

// Retrieves a list of FAQs for a particular query.
export const getSmartFAQS = (query, limit) => {
  const { pluginDomain, defaultCollections } = defaults;
  const collectionParameter = defaultCollections.length ? `&col=${[...defaultCollections]}` : '';

  return axios.get(`${pluginDomain}/rest/v2/api/smart-faq/list?status=active&query=${query}${collectionParameter}&size=${limit}`)
    .then(response => response)
    .catch(error => error);
};

// Retrieves details of a particular FAQ based on uid.
export const getSelectedSmartFAQ = uid => {
  return axios.get(`${defaults.pluginDomain}/rest/v2/api/smart-faq/get/${uid}`)
    .then(response => response)
    .catch(error => error);
};


// ==========================================================================================
// ChatBot Requests
// ==========================================================================================


const { domain: CHATBOT_DOMAIN } = defaults.chatBotConfiguration;
const { pluginDomain: PLUGIN_DOMAIN } = defaults;


export async function getChatBotSettings(botName) {
   const defaultSettings = {
      userLabel: 'You',
      botLabel: 'AI',
      initialMessage: 'Hello! What can I help you with?'
   };

   try {
      const response = await axios.get(`${CHATBOT_DOMAIN}/ui/v1/chatbot/settings/${botName}`);
      
      if (response.status === 200 && response.data) {
         const receivedSettings = response.data.chatBotSettings || {};
         
         return { ...defaultSettings, ...receivedSettings };
      }
   } catch (error) {
      console.error(error);
      
      const errorMessage = `Unable to fetch settings. ${
         !botName.length ? 'Please check if ChatBot name is configured correctly.' : ''
      }`;
      
      return { ...defaultSettings, initialMessage: errorMessage };
   }

   return defaultSettings;
}


// ------------------------------------------------------------------------------------------


// send each chat input
export async function sendChatMessage(data, signal) {
   return axios.post(`${CHATBOT_DOMAIN}/ui/v1/chatbot/chat`, data, { signal });
}


// chat-test endpoint that does not store the chat history. Used in AI Overview and in ChatBot when it is not configured.
export async function sendChatTestMessage(data, signal) {
   return axios.post(`${PLUGIN_DOMAIN}/ui/v1/chatbot/chat-test`, data, { signal });
}


// vote actions on the received  chat response
export async function voteChatMessage(data) {
   return axios.post(`${CHATBOT_DOMAIN}/ui/v1/chatbot/action`, data);
}


// ------------------------------------------------------------------------------------------

// update click count on clicking of action button
export async function updateActionClickCount(uid) {
   return axios.post(`${CHATBOT_DOMAIN}/ui/v1/analytics/ca`, { uid });
}


// ==========================================================================================
// Assist
// ==========================================================================================

export async function sendAssistMessage(data, options = {}) {
   return axios.post(`${defaults.pluginDomain}/ui/v1/searchai-assist`, data, options);
}


// ==========================================================================================
// Recommendations
// ==========================================================================================

export async function getRecommendations({ data, securityEnabled = false }) {
   return axios.post(`${PLUGIN_DOMAIN}/rest/v2/api/recommendations`, data, securityEnabled ? { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("searchToken") } } : { });
}


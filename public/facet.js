let facetSettings = document.getElementById("sb_facet_settings");
window.autoSuggestObject = {};
let autoSuggestSettings = document.getElementById("sb_autosuggest");
if(autoSuggestSettings){
   window.autoSuggestObject.showAutoSuggest = autoSuggestSettings.value;
}
window.inputFacets = [];
if (facetSettings) {
   let requiredFacetsFields = Object.keys(facetSettings.dataset);
   let facetFilters = [];
   let filterDisplay = {};
   for (let i = 0, len = requiredFacetsFields.length; i < len; i++) {
      let facetFilter = {};
      let fieldValue = facetSettings.dataset[requiredFacetsFields[i]];
      let field = requiredFacetsFields[i];
      let fieldValuesArray = fieldValue.split("|");
      facetFilter["field"] = field;
      if (fieldValuesArray[0]) {
         facetFilter["display"] = fieldValuesArray[0];
         filterDisplay[field] = fieldValuesArray[0];
      } else {
         facetFilter["display"] = "";
         filterDisplay[field] = "";
      }
      if (fieldValuesArray[1]) {
         if (parseInt(fieldValuesArray[1]) > 0) {
            facetFilter["size"] = fieldValuesArray[1];
         } else {
            facetFilter["dateRange"] = [{
               "name": "Last 24 hours",
               "calendar": "days",
               "value": "1"
            },
            {
               "name": "Past Week",
               "calendar": "days",
               "value": "7"
            },
            {
               "name": "Past Month",
               "calendar": "months",
               "value": "1"
            },
            {
               "name": "Past Year",
               "calendar": "years",
               "value": "1"
            }
         ];
      }
   }
   facetFilters.push(facetFilter);
}
window.inputFacets = facetFilters;
}

window.facets = {
   "facets": [
      {
         "field": "colname",
         "display": "Collection Name",
         "size": "100"
      },
      {
         "field": "contenttype",
         "display": "File Type",
         "size": "100"
      },
      {
         "field": "keywords",
         "display": "keywords",
         "size": "100"
      },
      {
         "field": "topics",
         "display": "Topics",
         "size": "10000"
      },
      {
         "field": "lastmodified",
         "display": "Last Modified",
         "dateRange": [
            {
               "name": "Last 24 hours",
               "calendar": "days",
               "value": "1"
            },
            {
               "name": "Past Week",
               "calendar": "days",
               "value": "7"
            },
            {
               "name": "Past Month",
               "calendar": "months",
               "value": "1"
            },
            {
               "name": "Past Year",
               "calendar": "years",
               "value": "1"
            }
         ]
      }
   ],
   "customDateSettings": {
      "enabled": true,
      "customDateField": "lastmodified",
      "customDateDisplayText": "Date"
   },
   "collection": [],
   "sortBtns": [
      {
         "field": "date",
         "display": "Date",
         "sort": false,
         "sort1": false,
         "sortDir": "desc"
      },
      {
         "field": "mrank",
         "display": "Relevance",
         "sort": true,
         "sort1": true,
         "sortDir": "asc"
      },
   ],
   "facetFiltersOrder": [
      "colname", "contenttype", "topics", "keywords"
   ],
   "checkboxesInFacet": true,
   "checkboxFacets": ["topics", "keywords"],
   "facetsFiltersDisplay": true,
   "facetFiltersType": "AND",
   "filtersSearchInput": {
      "enabled": true,
      "minFilters": 5
   },
   "loadMoreButton": true,
   "matchAny": "off",
   "pageSize": "10",
   "showAutoSuggest": true,
   "autoSuggestLimit": "5",
   "suggestSearch": false,
   "defaultCname": "",
   "adsDisplay": true,
   "featuredResultsCount": "3",
   "urlDisplay": true,
   "pdfOverlay": false,
   "relatedQuery": false,
   "relatedQueryFields": {
      "apikey": "",
      "field": "content",
      "operator": "and",
      "limit": "5",
      "terms": "10",
      "type": "phrase",
      "col": "",
   },
   "smartFAQSettings": {
      "enabled": true,
      "count": 3,
      "loadMoreCount": 0,
      "limit": 10
   },
   "suggestSmartFAQs": {
      "enabled": true,
      "limit": 3
   },
   "smartSuggest": {
      "enable": false,
      "domain": "",
      "isSBDomain": true,
      "cname": "",
      "limit": "5",
      "language": "en"
   },
   "trendingSearch": {
      "enabled": false,
      "cname":"",
      "limit": "5"
   },
   "topQuery": true,
   "topQueryFields": {
      "apikey": "",
      "col": "",
      "limit": "5",
   },
   "dataToBeDisplayed": {
      "1": {
         "title": "Title",
         "description": "Description"
      },
      "other": {
         "description": "Description"
      },
      "displayAll": true
   },
   "descriptionCharLimit": {
      "enabled": true,
      "limit": 260
   },
   "chatBot": {
      "enabled": false,
      "domain": "",
      "name": "",
      "idleTimeOut": 30, //in minutes
      "suggestions": false,
   },
   "assist":{
      "enabled": true,
      "limit": 4,
   },
   "tuneTemplate": "WEB",
   "voiceSearch": false,
   "voiceSearchAPI": "",
   "debug": false,
   "defaultType": "AND",
   "apikey": "",
   "autologout": true,
   "recommendations": {
      "enabled": true,
      "domain": "",
      "limit": 3,
   },
   "hybridSearchDefaults": {
      "controlsEnabled": true,
      "vectorWeight": 0.2,
      "vectorThreshold": 0.6
   },
   "pluginDomain": "",
};

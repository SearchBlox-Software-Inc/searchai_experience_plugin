import dayjs from 'dayjs';
import queryString from 'query-string';
import { customDateSettings, facetFiltersOrder, facets, pageSize } from '../../common/Defaults';
import { getResults } from '../../common/SbCore';


// ==========================================================================================

// Checks if any filters are currently applied
export function checkForAppliedFilters() {
   const urlParameters = { ...queryString.parse(window.location.search) };
   const filterRegex = /^f+\.[A-Za-z]+\.filter+$/g;

   return Object.keys(urlParameters).some(parameter => (filterRegex.test(parameter)));
}


// Reorders facets based on configuration
export function customizeOrderOfFacets(facetsList) {
   const requiredOrder = [...facetFiltersOrder];
   const ordered = [];
   const unordered = [];
   
   // reorders available facets based on order configured in facet.js
   if (Array.isArray(facetsList)) {
      facetsList.forEach(facetItem => {
         const index = requiredOrder.indexOf(facetItem.facetField);

         if (index !== -1) {
            ordered[index] = facetItem;
         } else {
            unordered.push(facetItem);
         }
      });

      ordered.push(...unordered);
   } else {
      ordered.push(facetsList.facet);
   }
   
   // filters out ordered available facets based on facets configured in facet.js
   const reorderedFacets = ordered.filter(item => {
      return facets.some(facet => facet.field === item.facetField);
   });
   
   return reorderedFacets;
}


// Checks if a filter already exists and toggles it accordingly
export function toggleFilter(facetField, filterName) {
   const urlParameters = { ...queryString.parse(window.location.search) };

   const parser = new DOMParser();
   const dateRegex = /^\[[0-9-]+T[0-9:]+TO([0-9-]+T[0-9:]+|\*)\]$/g;
   const facetsList = [...facets];

   const currentFacetKey = `f.${facetField}.filter`;
   const existingFilter = urlParameters[currentFacetKey];
   const encodedFilterName = encodeURIComponent(parser.parseFromString(filterName, 'text/html').body.textContent);

   if (existingFilter) {
      if ((dateRegex.test(existingFilter)) || facetField == customDateSettings.customDateField) {
         if (existingFilter === filterName) {
            delete urlParameters[currentFacetKey];

            if (urlParameters.customDate) {
               delete urlParameters.customDate;
            }

            delete urlParameters['facet.field'];
            delete urlParameters[`f.${customDateSettings.customDateField}.range`];

            const initialFacetFields = [];
            for (let i = 0, len = facetsList.length; i < len; i++) {
               initialFacetFields.push(facetsList[i].field);

               if (facetsList[i].dateRange) {
                  const dateRanges = facetsList[i].dateRange.map(range => ("[" + dayjs().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]"));
                  urlParameters[`f.${facetsList[i].field}.range`] = [...dateRanges];
               }
            }

            urlParameters['facet.field'] = [...initialFacetFields];
         } else {
            urlParameters[currentFacetKey] = filterName;

            if (urlParameters.customDate) {
               delete urlParameters.customDate;
            }
         }
      } else if (urlParameters[currentFacetKey].constructor === Array) {
         let indexOfFilter = -1;

         for (let i = 0, len = existingFilter.length; i < len; i++) {
            if (encodeURIComponent(parser.parseFromString(existingFilter[i], 'text/html').body.textContent) === encodedFilterName) {
               indexOfFilter = i;
            }
         }

         const existingFiltersArray = [...existingFilter];

         if (indexOfFilter === -1) {
            existingFiltersArray.push(encodedFilterName);
            urlParameters[currentFacetKey] = existingFiltersArray;
         } else {
            existingFiltersArray.splice(indexOfFilter, 1);
            urlParameters[currentFacetKey] = existingFiltersArray;

            if (existingFiltersArray.length === 0)
               delete urlParameters[currentFacetKey];
         }
      } else {
         if (encodeURIComponent(parser.parseFromString(existingFilter, 'text/html').body.textContent) === encodedFilterName) {
            delete urlParameters[currentFacetKey];
         } else {
            const existingFiltersArray = [existingFilter];
            existingFiltersArray.push(encodedFilterName);

            urlParameters[currentFacetKey] = existingFiltersArray;
         }
      }
   } else {
      const newFilterParameter = dateRegex.test(filterName) ? filterName : parser.parseFromString(filterName, 'text/html').body.textContent;
      urlParameters[currentFacetKey] = newFilterParameter;
   }

   urlParameters.page = 1;

   if (urlParameters.pagesize) {
      urlParameters.pagesize = pageSize;
   }

   getResults((urlParameters));

   window.scrollTo(0, 0);
}


// Handles keyboard navigation for facet filters
export function handleFacetKeyDown(e, facetField) {
   const currentKey = e.key;

   const currentFacetOptions = document.querySelectorAll(`#${facetField}Filters .filter`);
   const currentOptionIndex = parseInt(e.target.id.split('-')[1], 10);

   let newOptionIndex, newOption;

   if (currentKey === 'ArrowDown' || currentKey === 'ArrowUp') {
      e.preventDefault();

      if (currentKey === 'ArrowDown') {
         newOptionIndex = currentOptionIndex === currentFacetOptions.length - 1 ? 0 : currentOptionIndex + 1;
      } else {
         newOptionIndex = currentOptionIndex === 0 ? currentFacetOptions.length - 1 : currentOptionIndex - 1;
      }

      if (newOptionIndex !== undefined) {
         newOption = currentFacetOptions[newOptionIndex];
         newOption.focus();
      }
   }
}


// Clears all applied filters
export function clearAll() {
   const urlParameters = { ...queryString.parse(window.location.search) };

   const facetFields = [...facets];
   const { customDateField } = customDateSettings;

   urlParameters['facet.field'] = [];

   for (const facetField of facetFields) {
      urlParameters['facet.field'].push(facetField.field);
      delete urlParameters[`f.${facetField.field}.filter`];

      if (urlParameters[`f.${customDateField}.filter`]) {
         delete urlParameters[`f.${customDateField}.filter`];
         delete urlParameters[`f.${customDateField}.range`];
      }
   }

   if (urlParameters.customDate) {
      delete urlParameters.customDate;
   }

   urlParameters.page = 1;

   if (urlParameters.pagesize) {
      urlParameters.pagesize = pageSize;
   }

   getResults(urlParameters);
   window.scrollTo(0, 0);
}


// Clears filters for a specific facet
export function clearFiltersOfFacet(facetField) {
   const urlParameters = { ...queryString.parse(window.location.search) };
   const currentFilterKey = `f.${facetField}.filter`;

   if (urlParameters[currentFilterKey]) {
      delete urlParameters[currentFilterKey];
   }

   if (urlParameters.pagesize) {
      urlParameters.pagesize = pageSize;
   }

   getResults(urlParameters);
   window.scrollTo(0, 0);
}


// Helper function to improve performance on resize event
export function debounce(fn, ms) {
   let timer;

   return () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
         timer = null;
         fn.apply(this, arguments);
      }, ms);
   };
} 
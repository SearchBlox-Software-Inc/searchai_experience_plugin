import { parseISO } from 'date-fns';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useRef, useState } from 'react';
import { DateRangePicker } from 'react-date-range';

import * as defaults from '../common/Defaults';
import * as parser from '../common/SbCore';

import useClickOutside from '../common/hooks/useClickOutside';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import commonStyles from '../css/common.module.scss';
import styles from './styles/facetFilters.module.scss';


// ==========================================================================================


const CustomDateFilter = ({ setDateFiltersVisibility }) => {
   const [startDate, setStartDate] = useState(parseISO(dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')));
   const [endDate, setEndDate] = useState(parseISO(dayjs(new Date()).format('YYYY-MM-DD')));

   const dateDropdownRef = useRef(null);


   // ------------------------------


   useClickOutside(dateDropdownRef, handleClickOutsideDropdown);
   

   function handleClickOutsideDropdown(e) {
      const { target } = e;
      const toggleButton  = target.classList.contains('filter__dateRange-toggle') || document.querySelector('.filter__dateRange-toggle').contains(target);
      
      if (!toggleButton) {
         setDateFiltersVisibility(false);
      }
   }


   // ------------------------------


   function handleSelect(dates) {
      setStartDate(dates.selection.startDate);
      setEndDate(dates.selection.endDate);
   }


   function triggerOnEnter(e) {
      if (e.key === 'Enter') {
         customDateSearch();
      }
   }


   function removeOnEnter(e) {
      if (e.key === 'Enter') {
         removeCustomDate();
      }
   }


   function customDateSearch() {
      setDateFiltersVisibility(false);
      let urlParameters = Object.assign({}, queryString.parse(window.location.search));
      urlParameters[
         "f." + defaults.customDateSettings.customDateField + ".filter"
      ] =
         "[" +
         dayjs(startDate).format("YYYY-MM-DDTHH:mm:ss") +
         "TO" +
         dayjs(endDate).format("YYYY-MM-DD") +
         "T23:59:59]";
      urlParameters.customDate = true;
      let facetFields = [];
      facetFields = Object.assign([], defaults.facets);
      let customDateField = "";
      customDateField = defaults.customDateSettings.customDateField;
      urlParameters["facet.field"] = [];
      for (let i = 0, len = facetFields.length; i < len; i++) {
         urlParameters["facet.field"].push(facetFields[i].field);
         if (facetFields[i].dateRange) {
         urlParameters[`f.${facetFields[i].field}.range`] = [];
         urlParameters[`f.${facetFields[i].field}.range`] = facetFields[
            i
         ].dateRange.map((range) => {
            return (
               "[" +
               dayjs()
               .subtract(range.value, range.calendar)
               .format("YYYY-MM-DDTHH:mm:ss") +
               "TO*]"
            );
         });
         if (
            facetFields[i]["field"] == customDateField &&
            urlParameters[`f.${customDateField}.filter`]
         ) {
            urlParameters[`f.${facetFields[i].field}.range`].push(
               "[" +
               dayjs(startDate).format("YYYY-MM-DDTHH:mm:ss") +
               "TO" +
               dayjs(endDate).format("YYYY-MM-DD") +
               "T23:59:59]"
            );
         } else {
            urlParameters[
               "f." + defaults.customDateSettings.customDateField + ".range"
            ] =
               "[" +
               dayjs(startDate).format("YYYY-MM-DDTHH:mm:ss") +
               "TO" +
               dayjs(endDate).format("YYYY-MM-DD") +
               "T23:59:59]";
         }
         }
      }
      if (
         !urlParameters["facet.field"].includes(
         defaults.customDateSettings.customDateField
         )
      ) {
         urlParameters["facet.field"].push(
         defaults.customDateSettings.customDateField
         );
      }
      urlParameters.page = 1;
      parser.getResults(urlParameters);
   }


   function removeCustomDate() {
      
      setDateFiltersVisibility(false);
      let urlParameters = Object.assign({}, queryString.parse(window.location.search));
      let facetFields = [];
      facetFields = Object.assign([], defaults.facets);
      let customDateField = "";
      customDateField = defaults.customDateSettings.customDateField;
      delete urlParameters["facet.field"];
      urlParameters["facet.field"] = [];
      for (let i = 0, len = facetFields.length; i < len; i++) {
         urlParameters["facet.field"].push(facetFields[i].field);
         if (urlParameters[`f.${customDateField}.filter`]) {
         delete urlParameters[`f.${customDateField}.filter`];
         delete urlParameters[`f.${customDateField}.range`];
         }
         if (facetFields[i].dateRange) {
         urlParameters[`f.${facetFields[i].field}.range`] = [];
         urlParameters[`f.${facetFields[i].field}.range`] = facetFields[
            i
         ].dateRange.map((range) => {
            return (
               "[" +
               dayjs()
               .subtract(range.value, range.calendar)
               .format("YYYY-MM-DDTHH:mm:ss") +
               "TO*]"
            );
         });
         }
      }
      delete urlParameters.customDate;
      urlParameters.page = 1;
      parser.getResults(urlParameters);
   }


   // ------------------------------


   const urlParameters = Object.assign({}, queryString.parse(window.location.search));


   return (
      <div className={`${commonStyles.popover} ${styles.filterDateRange}`} ref={dateDropdownRef}>
         <div className={styles.daterangeCalender}>
            <DateRangePicker
               onChange={handleSelect}
               showSelectionPreview
               moveRangeOnFirstSelection={false}
               months={1}
               maxDate={parseISO(dayjs(new Date()).format("YYYY-MM-DD"))}
               ranges={[
                  {
                  startDate: startDate,
                  endDate: endDate,
                  key: "selection",
                  },
               ]}
               rangeColors={['#7639e2', '#7639e2', '#7639e2']}
               direction={window.innerWidth >= 768 ? "horizontal" : "vertical"}
               showMonthAndYearPickers={window.innerWidth >= 768}
            />
         </div>

         <div className={styles.filterDateRangeButtons}>
            <button className={styles.clear} onClick={() => setDateFiltersVisibility(false)}>
               Close
            </button>
            
            {
               urlParameters.customDate && 
                  <button className={styles.clear} onClick={removeCustomDate} onKeyDown={(e) => removeOnEnter(e)}>
                     Clear Filter
                  </button>
            }

            <button className={styles.go} onClick={customDateSearch} onKeyDown={(e) => triggerOnEnter(e)}>
               Apply
            </button>
         </div>
      </div>
   );
};


CustomDateFilter.propTypes = {
   setDateFiltersVisibility: PropTypes.func,
};


export default CustomDateFilter;
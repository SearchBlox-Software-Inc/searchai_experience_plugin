export function escapeRegExpChars(input) {
   return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


export function highlightFunc(text, search) {
   const escapedSearch = escapeRegExpChars(search);
   const regex = new RegExp("(" + escapedSearch + ")", "gi");
   return "<span>" + text.replace(regex, "<strong>$1</strong>") + "</span>";
}
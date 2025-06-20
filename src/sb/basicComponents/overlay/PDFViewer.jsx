import PropTypes from 'prop-types';


const PDFViewer = ({ overlayResult }) => {
   const { url } = overlayResult;

   return (
      <iframe
         src={`https://docs.google.com/viewerng/viewer?url=${url}&embedded=true`} // Viewing pdf through google docs
         width="100%"
         height="580"
         title="Embedded PDF Viewer"
         type="application/pdf"
      />
   );
};


export default PDFViewer;

PDFViewer.propTypes = {
   overlayResult: PropTypes.object
};
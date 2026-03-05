const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The section to remove starts with <!-- Service Highlights Grid --> 
// and ends before <!-- Footer -->
const startMarker = '    <!-- Service Highlights Grid -->';
const endMarker = '    <!-- Footer -->';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newHtml = html.substring(0, startIndex) + html.substring(endIndex);
    fs.writeFileSync('index.html', newHtml);
    console.log("Section removed successfully");
} else {
    console.error("Could not find markers", startIndex, endIndex);
}

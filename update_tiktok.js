const fs = require('fs');
let html = fs.readFileSync('gallery.html', 'utf8');

const regex = /<blockquote class="tiktok-embed"[\s\S]*?<\/script>/g;

const iframeCode = `<iframe src="https://www.tiktok.com/embed/v2/7611424623900511519" style="width: 100%; height: 720px; max-width: 605px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

html = html.replace(regex, iframeCode);
fs.writeFileSync('gallery.html', html);
console.log("Replaced with iframe.");

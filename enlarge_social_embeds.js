const fs = require('fs');
let html = fs.readFileSync('gallery.html', 'utf8');

html = html.replace(
    'style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; align-items: start;"',
    'style="display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 4rem; align-items: start;"'
);

html = html.replace(
    'style="width: 100%; height: 720px; max-width: 605px;',
    'style="width: 100%; height: 900px; max-width: 100%;'
);

html = html.replace(
    /width="400" height="480"\s*frameborder="0" scrolling="no" allowtransparency="true"\s*style="max-width: 100%;/g,
    'width="100%" height="900"\n                            frameborder="0" scrolling="no" allowtransparency="true"\n                            style="max-width: 100%;'
);

fs.writeFileSync('gallery.html', html);
console.log("Enlarged social embeds");

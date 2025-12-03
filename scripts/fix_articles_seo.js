const fs = require('fs');
const path = require('path');
const articlesDir = path.join(__dirname, '..', 'articles');
const ogImage = 'https://calculatorsolution.com/assets/og-image.svg';

function updateFile(file){
  const filePath = path.join(articlesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Ensure og:image and twitter:image meta tags exist
  if(!/meta\s+property="og:image"/i.test(html)){
    html = html.replace(/(<link rel="canonical"[^>]*>)/i, `$1\n  <meta property="og:image" content="${ogImage}">\n  <meta name="twitter:image" content="${ogImage}">`);
  }

  // Find JSON-LD block
  const ldMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>\n([\s\S]*?)\n\s*<\/script>/i);
  if(ldMatch){
    try{
      const jsonText = ldMatch[1];
      const data = JSON.parse(jsonText);
      // If it's an array (@graph) or an object
      if(Array.isArray(data)){
        // try to find BlogPosting
        let changed = false;
        data.forEach(obj=>{
          if(obj['@type'] === 'BlogPosting'){
            if(!obj.image){ obj.image = ogImage; changed = true; }
            if(!obj.mainEntityOfPage){ obj.mainEntityOfPage = {"@type":"WebPage","@id": `https://calculatorsolution.com/articles/${file}`}; changed = true; }
          }
        });
        if(changed){
          const newJson = JSON.stringify(data, null, 2);
          html = html.replace(ldMatch[0], `<script type="application/ld+json">\n${newJson}\n  </script>`);
        }
      } else if(typeof data === 'object'){
        if(data['@type'] === 'BlogPosting'){
          let changed = false;
          if(!data.image){ data.image = ogImage; changed = true; }
          if(!data.mainEntityOfPage){ data.mainEntityOfPage = {"@type":"WebPage","@id": `https://calculatorsolution.com/articles/${file}`}; changed = true; }
          if(changed){
            const newJson = JSON.stringify(data, null, 2);
            html = html.replace(ldMatch[0], `<script type="application/ld+json">\n${newJson}\n  </script>`);
          }
        }
      }
    }catch(e){
      console.error('Failed to parse JSON-LD in', file, e.message);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

const files = fs.readdirSync(articlesDir).filter(f=>f.endsWith('.html'));
files.forEach(f=>{
  try{ updateFile(f); console.log('Updated', f); }catch(e){ console.error('Error', f, e.message); }
});
console.log('Done.');

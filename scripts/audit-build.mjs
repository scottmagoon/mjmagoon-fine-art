import {readFile, access} from 'node:fs/promises';
import {join} from 'node:path';
const inventory=JSON.parse(await readFile('content/artwork-manifest.json','utf8'));
for(const slug of ['landscape','still-life','people','animals']){
 const page=await readFile(`dist/${slug}/index.html`,'utf8');
 const actual=(page.match(/data-lightbox-index=/g)||[]).length;
 const expected=inventory.filter(x=>x.category===slug).length;
 if(actual!==expected)throw new Error(`${slug}: expected ${expected} paintings, found ${actual}`);
 if(!page.includes('MJ Magoon Fine Art'))throw new Error(`Site name missing: ${slug}`);
 for(const match of page.matchAll(/(?:src|href)="(\/_astro\/[^"?#]+)"/g))await access(join('dist',decodeURIComponent(match[1])));
 console.log(`${slug}: verified ${actual} paintings`);
}
await access('dist/sitemap-index.xml');
console.log('Build audit passed.');

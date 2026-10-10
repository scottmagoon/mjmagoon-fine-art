import { readdir, mkdir, rename, writeFile, readFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const source = process.env.ARTWORK_SOURCE || '/Users/Shared/Artwork';
const categories = { Landscape: 'landscape', 'Still-Life': 'still-life', People: 'people', Animals: 'animals' };
const covers = { landscape: 'Great Hollow Barn.jpg', 'still-life': 'The Hat Collection.jpg', people: 'The Chief.jpg', animals: 'Daddy Robin.jpg' };
const stamp = Date.now().toString();
const stage = resolve('.artwork-staging', stamp);
const inventory = [];
for (const [folder, slug] of Object.entries(categories)) {
  const names = (await readdir(join(source, folder))).filter(n => /\.jpg$/i.test(n)).sort();
  if (!names.length) throw new Error(`No JPG artwork in ${folder}; stopped before changing website content.`);
  if (!names.includes(covers[slug])) throw new Error(`Cover missing in ${folder}: ${covers[slug]}`);
  await mkdir(join(stage, slug), { recursive: true });
  for (const name of names) {
    const input = await readFile(join(source, folder, name));
    const output = join(stage, slug, name);
    await sharp(input).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).toColourspace('srgb').jpeg({ quality: 90, mozjpeg: true }).toFile(output);
    const meta = await sharp(output).metadata();
    if (!meta.width || !meta.height || meta.format !== 'jpeg' || meta.exif) throw new Error(`Invalid website image: ${name}`);
    inventory.push({ category: slug, filename: name, sourceHash: createHash('sha256').update(input).digest('hex'), width: meta.width, height: meta.height });
    console.log(`Prepared ${slug}/${name}`);
  }
  await sharp(join(stage, slug, covers[slug])).toFile(join(stage, slug, 'cover.jpg'));
}
// Confirm no source file changed during preparation.
for (const item of inventory) {
  const folder = Object.keys(categories).find(k => categories[k] === item.category);
  const hash = createHash('sha256').update(await readFile(join(source, folder, item.filename))).digest('hex');
  if (hash !== item.sourceHash) throw new Error('Artwork changed while preparing. Run preparation again.');
}
for (const [folder, slug] of Object.entries(categories)) {
  const names = (await readdir(join(source, folder))).filter(n => /\.jpg$/i.test(n)).sort();
  if (JSON.stringify(names) !== JSON.stringify(inventory.filter(x => x.category === slug).map(x => x.filename))) throw new Error('Artwork inventory changed while preparing.');
}
await writeFile(join(stage, 'artwork-manifest.json'), JSON.stringify(inventory, null, 2)+'\n');
await mkdir('.artwork-backups', { recursive: true });
let hadContent = false;
try { await access('content'); hadContent = true; } catch {}
const backup = resolve('.artwork-backups', stamp);
if (hadContent) await rename('content', backup);
try { await rename(stage, 'content'); }
catch (error) { if (hadContent) await rename(backup, 'content'); throw error; }
console.log(`Prepared ${inventory.length} paintings. Previous website content is backed up locally.`);

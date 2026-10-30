import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const refs=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(p=>!p.includes('://')&&!p.startsWith('mailto:'));
const photos=['Nerva.jpg','Trajan.jpg','Hadrian.jpg','Antoninus_Pius.jpg','Marcus_Aurelius.jpg','pantheon-interior.jpg','trajan-obverse.jpg','trajan-reverse.jpg','nerva-aureus.png'];
const files=[...new Set([...refs,...photos.map(p=>'assets/'+p)])];
const missing=files.filter(p=>!fs.existsSync(p));
console.log(JSON.stringify({filesChecked:files.length,missing}));
if(missing.length)process.exitCode=1;

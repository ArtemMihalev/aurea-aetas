import fs from 'node:fs';
const geo=JSON.parse(fs.readFileSync('research/land.geojson','utf8'));
const project=([lon,lat])=>[(lon+15)/65*1000,(59-lat)/36*550];
let output='';
for(const f of geo.features){const polygons=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;for(const polygon of polygons){for(const ring of polygon){output+=ring.map((point,index)=>{const [x,y]=project(point);return(index?'L':'M')+x.toFixed(1)+','+y.toFixed(1)}).join('')+'Z'}}}
fs.writeFileSync('assets/map-geometry.js','window.ROMAN_LAND_PATH='+JSON.stringify(output)+';\n');
console.log('Geographical base prepared: '+output.length+' path characters.');

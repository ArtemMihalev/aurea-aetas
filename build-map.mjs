import fs from 'node:fs';
const xy=([lon,lat])=>[(lon+15)/65*1000,(59-lat)/36*550];
function simplify(points,t=.18){if(points.length<4)return points;let a=[points[0]],prev=points[0];for(const p of points.slice(1)){if(Math.hypot(p[0]-prev[0],p[1]-prev[1])>t){a.push(p);prev=p}}a.push(points.at(-1));return a}
function crop(points){for(const [axis,bound,sign] of [[0,-15,1],[0,50,-1],[1,23,1],[1,59,-1]]){const out=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],ia=(a[axis]-bound)*sign>=0,ib=(b[axis]-bound)*sign>=0;if(ia)out.push(a);if(ia!==ib){const t=(bound-a[axis])/(b[axis]-a[axis]);out.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])])}}points=out;if(!points.length)break}return points}
function ring(points,close=true){points=close?crop(points):points;if(!points.length)return '';return simplify(points.map(xy),.28).map((p,i)=>(i?'L':'M')+p.map(n=>n.toFixed(2)).join(',')).join('')+(close?'Z':'')}
function geometry(file){const geo=JSON.parse(fs.readFileSync(file,'utf8'));return geo.features.map(f=>(f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates).map(poly=>poly.map(r=>ring(r)).join('')).join('')).join('')}
// Polygon Shapefile records: use the original AWMC physical layer, not a different coastline.
const b=fs.readFileSync('research/awmc-water.shp');let water='';
for(let o=100;o<b.length;){const n=b.readInt32BE(o+4)*2,s=o+8,type=b.readInt32LE(s);if(type===5){const parts=b.readInt32LE(s+36),count=b.readInt32LE(s+40),start=s+44+parts*4;const indices=Array.from({length:parts},(_,i)=>b.readInt32LE(s+44+i*4));indices.push(count);for(let k=0;k<parts;k++){const points=[];for(let i=indices[k];i<indices[k+1];i++)points.push([b.readDoubleLE(start+i*16),b.readDoubleLE(start+i*16+8)]);water+=ring(points)}}o=s+n}
const rivers=JSON.parse(fs.readFileSync('research/rivers.geojson','utf8')).features.map(f=>({name:f.properties.name,path:(f.geometry.type==='LineString'?[f.geometry.coordinates]:f.geometry.coordinates).map(r=>ring(r,false)).join('')}));
const land='M0,0H1000V550H0Z'+water;
fs.writeFileSync('assets/map-geometry.js',`window.ROMAN_LAND_PATH=${JSON.stringify(land)};\nwindow.ROMAN_EMPIRE_PATH=${JSON.stringify(geometry('research/empire-117.geojson'))};\nwindow.ROMAN_RIVERS=${JSON.stringify(rivers)};\n`);
console.log('AWMC coast and empire; river features:',rivers.length,'; bundled bytes:',fs.statSync('assets/map-geometry.js').size);

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||4175),url=`http://127.0.0.1:${port}`;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.json':'application/json'};
const server=http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,url).pathname)}catch{res.writeHead(400).end();return}
 const relative=pathname==='/'?'index.html':pathname.slice(1);
 const file=path.resolve(root,relative);
 if(!file.startsWith(root+path.sep)||!types[path.extname(file)]||relative.includes('..')){res.writeHead(404).end();return}
 fs.stat(file,(error,stat)=>{
  if(error||!stat.isFile()){res.writeHead(404).end();return}
  const headers={'Content-Type':types[path.extname(file)],'Accept-Ranges':'bytes','Cache-Control':'no-cache'};
  let start=0,end=stat.size-1,status=200;
  if(req.headers.range){const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!match){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return}if(match[1]){start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),end)}else if(match[2])start=Math.max(0,stat.size-Number(match[2]));if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return}status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`}
  headers['Content-Length']=end-start+1;res.writeHead(status,headers);if(req.method==='HEAD'){res.end();return}const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
 });
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is busy. Close the previous Aurea Aetas server.`:error.message);process.exitCode=1});
server.listen(port,'127.0.0.1',()=>{console.log(`Aurea Aetas: ${url}\nPress Ctrl+C to stop.`);if(process.platform==='win32'&&!process.argv.includes('--no-open')){const browser=spawn('explorer.exe',[url],{windowsHide:true,stdio:'ignore'});browser.on('error',()=>console.log(`Open ${url}`));browser.unref()}});


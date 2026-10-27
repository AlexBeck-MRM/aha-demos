/* Public v2 contract checks; no internal functions are exported for tests. */
const assert = require('node:assert/strict');
const test = require('node:test');
const G = require('./gradient-colour.js');
const contrast = rgb => 1.05 / (rgb.reduce((sum,c,i) => {const v=c/255;return sum+[.2126,.7152,.0722][i]*(v<=.04045?v/12.92:((v+.055)/1.055)**2.4);},0)+.05);
function reference(rgb,target) {
  const edges=[0,1,...rgb.flatMap(c=>Array.from({length:c},(_,n)=>(n+.5)/c))].sort((a,b)=>a-b);
  const candidates=edges.slice(1).map((e,i)=>rgb.map(c=>Math.round(c*(e+edges[i])/2)));
  candidates.push(rgb);
  return candidates.filter(c=>contrast(c)>=target+.02).at(-1);
}
function fakeImage(pixel=[255,255,255,255]) {
  return {complete:true,naturalWidth:100,naturalHeight:100,currentSrc:'fixture',pixel};
}
global.document={createElement(){let image;return {width:0,height:0,getContext(){return {drawImage(i,...args){image=i;i.draws?.push(args);},setTransform(){},getImageData(x,y,w,h){if(image.denied){const e=new Error('denied');e.name='SecurityError';throw e;}const data=new Uint8ClampedArray(w*h*4);for(let i=0;i<data.length;i+=4)data.set(typeof image.pixel==='function'?image.pixel(i/4):image.pixel,i);return {data};}};}};}};
const inputs=(extra={})=>({revision:1,image:fakeImage(),imageRect:{left:0,top:0,width:100,height:100},textRects:[{left:5,top:80,right:95,bottom:95}],gradient:{coverage:1,opacity:1},density:1,...extra});
test('two-call API, exact lightest quantised solid shades',()=>{
 assert.deepEqual(Object.keys(G).sort(),['prepare','version']);
 let cases=0;let seed=7919;const next=()=>{seed=(seed*16807)%2147483647;return seed;};
 for(let n=0;n<100;n++){const rgb=[next()%256,next()%256,next()%256];const prepared=G.prepare({revision:n,mode:'solid',colour:rgb});for(const target of [4.5,5.8,7,7.1]){const r=prepared.solve({targetContrast:target});assert.deepEqual(r.rgb,reference(rgb,target));assert.ok(r.contrast>=target+.02);cases++;}}
 console.log(`${cases} independently enumerated shade comparisons`);
});
test('malformed inputs cannot return a passing result',()=>{
 for(const colour of [[-1,0,0],[256,0,0],[1.5,2,3],[NaN,1,2],[],null])assert.throws(()=>G.prepare({revision:1,mode:'solid',colour}),TypeError);
 assert.throws(()=>G.prepare({revision:1}),TypeError);
 assert.throws(()=>G.prepare(inputs({textRects:[]})),TypeError);
 assert.throws(()=>G.prepare(inputs({textRects:[{left:0,top:0,right:NaN,bottom:10}]})),TypeError);
 assert.equal(G.prepare(inputs({textRects:[{left:-1,top:1,right:5,bottom:5}]})).reason,'unsupported-text-area');
 const p=G.prepare({revision:1,mode:'solid',colour:[255,0,0]});for(const targetContrast of [4.49,7.11,NaN])assert.throws(()=>p.solve({targetContrast}),RangeError);
});
test('readiness, transparency and denied pixel access are explicit',()=>{
 assert.equal(G.prepare(inputs({image:{complete:false}})).reason,'image-not-ready');
 assert.equal(G.prepare(inputs({image:{complete:true,naturalWidth:0}})).reason,'image-load-failed');
 assert.equal(G.prepare(inputs({image:fakeImage([0,0,0,0])})).reason,'unsupported-transparency');
 assert.equal(G.prepare(inputs({image:{...fakeImage(),denied:true}})).reason,'pixel-access-denied');
});
test('overlap union, cached sample, target-only solve uses no readback',()=>{
 const image=fakeImage();const rect={left:10,top:85,right:30,bottom:95};
 const p=G.prepare(inputs({image,textRects:[rect,rect]}));assert.equal(p.metrics.checkedPixels,200);assert.equal(p.metrics.sampleReads,1);assert.equal(p.metrics.pixelReads,1);
 for(const targetContrast of [4.5,7,7.1])assert.ok(p.solve({targetContrast}).ok);
 const again=G.prepare(inputs({image,revision:2,imageRevision:1,textRects:[rect]}));assert.equal(again.metrics.sampleReads,0);
 const changed=G.prepare(inputs({image,revision:3,imageRevision:2,textRects:[rect]}));assert.equal(changed.metrics.sampleReads,1);
});
test('full failed scan reports the true worst contrast and no usable colour',()=>{
 const p=G.prepare(inputs({image:fakeImage(n=>n===0?[150,150,150,255]:[255,255,255,255]),gradient:{coverage:1,opacity:0}}));
 const r=p.solve();assert.equal(r.ok,false);assert.equal(r.contrast,1);assert.equal(r.reason,'insufficient-contrast');assert.equal(r.rgb,undefined);
 const margin=G.prepare(inputs({image:fakeImage([109,119,125,255]),gradient:{coverage:1,opacity:0}})).solve();assert.equal(margin.reason,'insufficient-safety-margin');assert.ok(margin.contrast>=4.5);
});
test('stacked gradient stop order matches CSS clamping',()=>{
 const p=G.prepare(inputs({gradient:{coverage:.1,opacity:.8,stacked:true}}));
 const positions=[...p.gradientCss.matchAll(/\) ([\d.]+)px/g)].map(m=>+m[1]);assert.equal(positions.length,6);assert.ok(positions.every((v,i)=>i===0||v>=positions[i-1]));
});
test('inverse-luminance rounding cannot turn an incomplete scan into a pass',()=>{
 const p=G.prepare(inputs({image:fakeImage(n=>n===0?[0,53,253,255]:[255,255,255,255]),imageRect:{left:0,top:0,width:2,height:2},textRects:[{left:0,top:0,right:2,bottom:1}],gradient:{coverage:.5,opacity:.9}}));
 const r=p.solve({targetContrast:7.074334013226107});assert.equal(r.ok,false);assert.equal(r.contrast,1);assert.equal(r.rgb,undefined);
});


test('grey source images keep neutral sample and result channels', () => {
  const prepared = G.prepare(inputs({image: fakeImage([100, 100, 100, 255])}));
  assert.deepEqual(prepared.sample, [100, 100, 100]);
  const result = prepared.solve();
  assert.equal(result.ok, true);
  assert.equal(result.rgb[0], result.rgb[1]);
  assert.equal(result.rgb[1], result.rgb[2]);
});

test('current public preparation reproduces the actual cover crop and focal position', () => {
  const cases = [
    {natural: [1000, 500], size: [200, 400], position: [1, .5], draw: [-600, 0, 800, 400]},
    {natural: [500, 1000], size: [400, 200], position: [.5, 1], draw: [0, -600, 400, 800]},
  ];
  for (const item of cases) {
    const image = {...fakeImage(), naturalWidth: item.natural[0], naturalHeight: item.natural[1], draws: []};
    const [width, height] = item.size;
    const prepared = G.prepare(inputs({image, imageRect: {left: 0, top: 0, width, height},
      objectPosition: item.position, textRects: [{left: 20, top: height - 40, right: width - 20, bottom: height - 10}]}));
    assert.equal(prepared.ok, true);
    assert.deepEqual(image.draws.at(-1), item.draw);
  }
});

test('every slider step passes and increasing the target never lightens the source', () => {
  for (const sample of [[255, 255, 255], [210, 80, 40], [60, 180, 140], [10, 10, 10]]) {
    const prepared = G.prepare({revision: 1, mode: 'solid', colour: sample});
    let previous = sample;
    for (let tenth = 45; tenth <= 71; tenth++) {
      const result = prepared.solve({targetContrast: tenth / 10});
      assert.equal(result.ok, true);
      assert.ok(contrast(result.rgb) >= tenth / 10);
      result.rgb.forEach((channel, index) => assert.ok(channel <= previous[index]));
      previous = result.rgb;
    }
  }
});


test('automatic image colour gains saturation before contrast checking; manual values stay explicit', () => {
  const sample = [80, 100, 120];
  const prepared = G.prepare(inputs({image: fakeImage([...sample, 255])}));
  assert.deepEqual(prepared.sample, sample);
  assert.deepEqual(prepared.solve().rgb, [75, 98, 120]);
  assert.deepEqual(prepared.solve({startingColour: sample}).rgb, sample);
  assert.deepEqual(G.prepare({revision: 1, mode: 'solid', colour: sample}).solve().rgb, sample);
  for (const rgb of [[100, 100, 100], [0, 30, 60]]) {
    assert.deepEqual(G.prepare(inputs({image: fakeImage([...rgb, 255])})).solve().rgb, rgb);
  }
  assert.equal(prepared.solve({targetContrast: 7.1}).ok, true);
});

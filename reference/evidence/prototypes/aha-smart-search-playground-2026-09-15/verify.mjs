// Run: node prototypes/smart-search/verify.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script); // Parse every handler, including code outside the pure-function checks.
const context = vm.createContext({
  URLSearchParams,
  document: { querySelector: () => ({ innerHTML: '', focus() {} }) },
  clearTimeout() {},
  location: {
    get hash() { return '#home'; },
    set hash(value) { throw new Error(`Query submission tried to navigate to ${value}`); }
  }
});
vm.runInContext(script.slice(0, script.indexOf("$('#search-form').addEventListener")), context);
const read = code => vm.runInContext(code, context);
let passed = 0;
function check(name, fn) { fn(); passed++; console.log(`PASS ${name}`); }

for (const query of ['high blood pressure', 'CPR', 'CPR training']) {
  check(`${query}: at least 12 total, 10 unique preview results, four categories`, () => {
    read(`state.results=rank(${JSON.stringify(query)});state.filter='All'`);
    assert.ok(read('state.results.length') >= 12);
    assert.equal(read('previewRows().length'), 10);
    assert.equal(read('new Set(previewRows().map(d=>d.id)).size'), 10);
    assert.equal(read('new Set(previewRows().map(d=>d.type)).size'), 4);
  });
}
check('Exact topic promotes its guide', () => assert.equal(read("rank('high blood pressure')[0].id"), 'bp-guide'));
check('Specific training query promotes a relevant tool', () => assert.equal(read("rank('CPR training')[0].type"), 'Tools'));
check('Unknown queries do not receive irrelevant fallback matches', () => assert.equal(read("rank('moonwalking').length"), 0));
check('Known spelling error recovers the same catalogue', () => assert.equal(read("JSON.stringify(rank('blood presure').map(d=>d.id))"), read("JSON.stringify(rank('blood pressure').map(d=>d.id))")));
check('Filtering returns only the requested category', () => {
  read("state.results=rank('blood pressure');state.filter='Videos'");
  assert.equal(read('previewRows().length'), 2);
  assert.equal(read("previewRows().every(d=>d.type==='Videos')"), true);
});
check('Autocomplete is limited and does not change query text', () => {
  read("state.q='high';state.hiddenSuggestions=false");
  assert.ok(read("suggest('high').length") <= 3);
  assert.equal(read('state.q'), 'high');
  assert.equal(read("suggest('high')[0]"), 'High blood pressure');
});
check('Questions and topics receive separate intent', () => {
  assert.equal(read("question('How can I manage high blood pressure?')"), true);
  assert.equal(read("question('High blood pressure')"), false);
  assert.equal(read("question('What')"), false);
});
check('Follow-up about food retains blood-pressure context', () => assert.ok(read("sampleAnswer('What about food?', 'bp', true).text.includes('blood pressure')")));
check('Unsupported questions do not fabricate an answer', () => {
  assert.equal(read("sampleAnswer('Why is the sky blue?', null, false)"), null);
  assert.equal(read("sampleAnswer('Can blood pressure make my ears feel odd?', 'bp', false)"), null);
});
check('Unavailable health answer retains related topic results', () => assert.equal(read("searchResults('Can blood pressure make my ears feel odd?').length"), 12));
check('Queries are escaped before HTML rendering', () => assert.equal(read("esc('<img src=x onerror=alert(1)>')"), '&lt;img src=x onerror=alert(1)&gt;'));
check('Portable file has no remote script, font or style dependencies', () => {
  assert.equal(/<script[^>]+src=|<link[^>]+rel=["']stylesheet|@import/.test(html), false);
});
// The full catalogue and URL model are independent of the quick-result cap.
check('Full catalogue scales each curated topic into hundreds of unique records', () => {
  assert.equal(read('FULL_DATA.length'), read('DATA.length*21'));
  assert.equal(read('new Set(FULL_DATA.map(d=>d.id)).size'), read('FULL_DATA.length'));
  for (const q of ['high blood pressure','CPR','CPR training']) {
    assert.equal(read(`searchResults(${JSON.stringify(q)},FULL_DATA).length`), read(`rank(${JSON.stringify(q)}).length*21`));
  }
});
check('Full-page pagination is bounded and does not repeat page-one records', () => {
  read("let pageOptions=parseResultsOptions('#results?q=CPR');let fullRows=searchResults('CPR',FULL_DATA);let firstPage=fullResultsModel(fullRows,pageOptions);let nextPage=fullResultsModel(fullRows,{...pageOptions,page:2})");
  assert.equal(read('firstPage.total'), read('fullRows.length'));
  assert.equal(read('firstPage.items.length'), 20);
  assert.equal(read('firstPage.pages'), read('Math.ceil(fullRows.length/20)'));
  assert.equal(read('nextPage.items.some(d=>firstPage.items.some(p=>p.id===d.id))'), false);
  assert.equal(read('fullResultsModel(fullRows,{...pageOptions,page:1000}).items.length'), read('fullRows.length%20||20'));
  assert.equal(read('fullResultsModel(fullRows,{...pageOptions,page:1000}).page'), read('firstPage.pages'));
});
check('Content-type filters combine with OR; audience and date narrow that set', () => {
  read("let combined={...pageOptions,types:['Videos','Tools'],audience:'Healthcare professionals',updated:'year'};let narrowed=fullResultsModel(fullRows,combined)");
  assert.ok(read('narrowed.total')>0);
  assert.equal(read("narrowed.items.every(d=>['Videos','Tools'].includes(d.type)&&d.audience==='Healthcare professionals'&&Date.parse(d.updated)>=SAMPLE_TODAY-365*86400000)"), true);
  assert.equal(read("narrowed.total===fullRows.filter(d=>['Videos','Tools'].includes(d.type)&&d.audience==='Healthcare professionals'&&Date.parse(d.updated)>=SAMPLE_TODAY-365*86400000).length"), true);
});
check('Facet counts respect the other filters without excluding unselected types', () => {
  read("let facets=fullResultsModel(fullRows,{...pageOptions,types:['Tools'],audience:'Educators'})");
  assert.ok(read('facets.typeCounts.Videos')>0);
  assert.equal(read('facets.total'), read('facets.typeCounts.Tools'));
});
check('Newest and alphabetical sorts change real result order', () => {
  read("let newest=fullResultsModel(fullRows,{...pageOptions,sort:'newest'}).items;let alphabetic=fullResultsModel(fullRows,{...pageOptions,sort:'title'}).items");
  assert.equal(read('newest.every((d,i)=>!i||newest[i-1].updated>=d.updated)'), true);
  assert.equal(read('alphabetic.every((d,i)=>!i||alphabetic[i-1].title.localeCompare(d.title)<=0)'), true);
  assert.notEqual(read('newest[0].id'), read('firstPage.items[0].id'));
});
check('Full-results URLs round-trip query, combined filters, sort and page', () => {
  read("let savedOptions={q:'CPR & first aid?',types:['Videos','Tools'],audience:'Healthcare professionals',updated:'year',sort:'newest',page:3}");
  assert.equal(read('JSON.stringify(parseResultsOptions(fullResultsHash(savedOptions)))'), read('JSON.stringify(savedOptions)'));
  assert.equal(read("parseResultsOptions('#results?q=CPR&filter=Videos').types[0]"), 'Videos');
});
check('Malformed page options are normalised safely', () => {
  read("let badOptions=parseResultsOptions('#results?q=CPR&types=Videos,unknown,Videos&audience=x&updated=x&sort=__proto__&page=-7')");
  assert.equal(read('JSON.stringify(badOptions.types)'), '["Videos"]');
  assert.equal(read('badOptions.audience'), 'All');
  assert.equal(read('badOptions.sort'), 'relevance');
  assert.equal(read('badOptions.updated'), 'any');
  assert.equal(read('badOptions.page'), 1);
});
check('Unknown queries offer explicitly labelled starting points', () => {
  assert.equal(read("searchResults('moonwalking',FULL_DATA).length"), 10);
  assert.equal(read("searchResults('moonwalking',FULL_DATA).every(d=>d.fallback)"),true);
  assert.equal(read("fullResultsModel([],pageOptions).page"), 1);
  assert.equal(read("paginationMarkup(fullResultsModel([],pageOptions))"), '');
});
check('Modal footer counts the full catalogue without expanding its preview', () => {
  read("state.q='CPR';state.conversation=[];state.filter='Videos';state.results=rank('CPR')");
  assert.equal(read('fullResultCount()'), 42);
  assert.equal(read('previewRows().length'), 2);
});
check('Generated result markup escapes titles and resolves its destination record', () => {
  assert.equal(read("FULL_DATA.some(d=>d.id==='cpr-guide-resource-1')"), true);
  assert.ok(read("fullResultMarkup({...FULL_DATA[0],title:'<script>alert(1)</script>'},'CPR')").includes('&lt;script&gt;'));
});

for (const [query,area] of [['CPR','cpr'],['Heart attack','attack'],['Volunteering','volunteer'],['High blood pressure','bp'],['CPR certification','cpr'],['local events','events'],['Healthy eating','diet'],['Stroke content','stroke'],['news','news']]) {
  check(`${query} finds a relevant area`,()=>assert.equal(read(`rank(${JSON.stringify(query)})[0].area`),area));
}
for (const [query,id] of [['presure blod high','bp-guide'],['certifcation cpr','cpr-cert'],['volunter oportunites','volunteer-local'],['stroke symtoms','stroke-signs'],['Heart Walk','events-walk'],['BLS','cpr-bls'],['CPR card','cpr-card']]) {
  check(`${query} ranks its intended destination first`,()=>assert.equal(read(`rank(${JSON.stringify(query)})[0].id`),id));
}
check('Mixed query preview retains each requested area',()=>{
  read("state.q='CPR volunteering local events';state.results=rank(state.q);state.filter='All'");
  assert.equal(read("['cpr','volunteer','events'].every(a=>previewRows().some(d=>d.area===a))"),true);
});
check('Near me spans local classes, events and volunteering without assumed location',()=>{
  assert.equal(read("['cpr','events','volunteer'].every(a=>rank('near me').some(d=>d.area===a))"),true);
});
check('Unknown words are not silently corrected to medical topics',()=>{
  assert.equal(read("corrected('moonwalking')"),'moonwalking');
  assert.equal(read("searchResults('moonwalking').every(d=>d.fallback)"),true);
});
check('Destination questions bypass AI; informational questions keep it',()=>{
  for(const q of ['Where can I find a CPR class?','Where can I track my blood pressure?','How do I download my CPR eCard?'])assert.equal(read(`answerIntent(${JSON.stringify(q)})`),false);
  assert.equal(read("answerIntent('How can I manage high blood pressure?')"),true);
});

check('Practical destinations remain in the result list after shortcut removal',()=>{
  read("state.q='high blood pressure';state.results=rank(state.q);state.filter='All';state.searchStatus='ready'");
  assert.equal(read('previewRows().length'),10);
  assert.equal(read("['bp-log','bp-monitor'].every(id=>previewRows().some(d=>d.id===id))"),true);
  assert.equal(read('new Set(previewRows().map(d=>d.id)).size'),10);
  assert.equal(read('new Set(previewRows().map(d=>d.type)).size'),4);
});
check('Specific destination question promotes its task rather than a generic guide',()=>{
  assert.equal(read("rank('Where can I track my blood pressure?')[0].id"),'bp-log');
  assert.equal(read("rank('Where can I find a CPR class?')[0].id"),'cpr-local');
});
// Exercise the actual submit dispatcher and confirmation state, with rendering and AI I/O stubbed.
read("render=()=>{};announce=()=>{};runSearch=()=>{};let asked=[];ask=(q=state.q)=>{asked.push(q);state.aiStatus='loading'}");
check('Topic Enter confirms in place and preserves the selected category', () => {
  read("state.q='CPR';state.filter='Videos';state.results=rank('CPR');state.suggestions=['CPR training'];state.active=-1;state.aiStatus='idle';state.searchStatus='ready';submitQuery()");
  assert.equal(read('location.hash'), '#home');
  assert.equal(read('state.filter'), 'Videos');
  assert.equal(read('state.suggestions.length'), 0);
  assert.equal(read('state.hiddenSuggestions'), true);
  assert.equal(read('asked.length'), 0);
});
check('Selected suggestion Enter accepts the query without leaving the panel', () => {
  read("state.q='high';state.suggestions=['High blood pressure'];state.active=0;state.aiStatus='idle';submitQuery()");
  assert.equal(read('state.q'), 'High blood pressure');
  assert.equal(read('state.active'), -1);
  assert.equal(read('location.hash'), '#home');
});
check('Question Enter requests an answer once and ignores repeated submission during loading', () => {
  read("state.q='What is CPR?';state.aiStatus='idle';state.active=-1;submitQuery();submitQuery()");
  assert.equal(read('asked.length'), 1);
  assert.equal(read('asked[0]'), 'What is CPR?');
  assert.equal(read('location.hash'), '#home');
});
check('Enter on an answered question preserves its answer and follow-up context', () => {
  read("state.q='What is CPR?';state.aiStatus='ready';state.conversation=[{q:'What is CPR?'}];submitQuery()");
  assert.equal(read('asked.length'), 1);
  assert.equal(read('state.conversation.length'), 1);
  assert.equal(read('location.hash'), '#home');
});
check('Navigation question Enter keeps results and never asks AI',()=>{
  read("state.q='Where can I find a CPR class?';state.aiStatus='idle';state.active=-1;submitQuery()");
  assert.equal(read('asked.length'),1);
  assert.equal(read('location.hash'),'#home');
});
check('Dismissing suggestions preserves the query and results',()=>{
  read("state.q='high';state.results=rank('high');state.suggestions=['High blood pressure'];state.active=0;let resultIds=state.results.map(d=>d.id).join();dismissSuggestions()");
  assert.equal(read('state.q'),'high');
  assert.equal(read('state.suggestions.length'),0);
  assert.equal(read('state.results.map(d=>d.id).join()'),read('resultIds'));
});
console.log(`\n${passed} checks passed.`);

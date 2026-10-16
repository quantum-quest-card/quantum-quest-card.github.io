import {MISSIONS} from './event-data.js';
import {CARDS,CATEGORIES,DOMINATION_CARDS} from './game-data.js';

export const textColors={blue:'#74b5ff',red:'#ff8c92',green:'#75dfb6',yellow:'#f2ce7b',wild:'#d4b2ff'};
export const colorNames={blue:'青',red:'赤',green:'緑',yellow:'黄',wild:'紫'};
export const escapeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const terms=new Map();
for(const [cat,name] of Object.entries(colorNames))terms.set(name+'色',cat);
for(const m of MISSIONS)for(const title of [m.title,...(m.legacyTitles||[])])terms.set(title,m.color);
for(const c of DOMINATION_CARDS)terms.set(c.title,c.cat);
for(const c of CATEGORIES)for(const name of [c.name,c.short,c.name+'カテゴリ'])terms.set(name,c.id);
for(const c of CARDS){
 terms.set(c.name,c.cat);const short=c.name.replace(/（.*）$/,'');
 // Shared names such as 論理量子ビット must not inherit an arbitrary category.
 if(CARDS.filter(other=>other.name.replace(/（.*）$/,'')===short).every(other=>other.cat===c.cat))terms.set(short,c.cat);
}
for(const [cat,names] of Object.entries({blue:['量子エンジニア','量子エンジニアリング','量子コンピュータ','量子コンピューティング','FTQC','NISQ'],red:['量子セキュリティ専門家','PQC','QKD'],green:['量子官僚','QGC'],yellow:['量子医師'],wild:['量子タレント','オルマイティ・トークン','オルマイティトークン','万能トークン','万能']}))for(const name of names)terms.set(name,cat);
const escaped=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp([...terms.keys()].sort((a,b)=>b.length-a.length).map(escaped).join('|')+'|(?<![一-龯ぁ-んァ-ヶ])(?:青|赤|緑|黄|紫)(?![一-龯ぁ-んァ-ヶ])','g');
const catFor=word=>terms.get(word)||Object.keys(colorNames).find(k=>colorNames[k]===word);
export function coloredLabel(cat,label){return `<span class="category-text category-${cat}" title="${colorNames[cat]}のカテゴリ">${escapeText(label)}</span>`;}
export function colorText(text){
 let at=0,out='';const input=String(text??'');
 for(const m of input.matchAll(pattern)){out+=escapeText(input.slice(at,m.index))+coloredLabel(catFor(m[0]),m[0]);at=m.index+m[0].length;}
 return out+escapeText(input.slice(at));
}
// Native option controls cannot reliably color separate words; retain explicit color names.
export function optionText(text){return String(text).replace(pattern,word=>'【'+colorNames[catFor(word)]+'】'+word);}
export function choiceColor(option){
 const d=option.data,colors=new Set([d.give,d.get].filter(Boolean).map(id=>CARDS.find(c=>c.id===id)?.cat));
 for(const [k,n] of Object.entries(d.tokens||{}))if(n)colors.add(k);
 return colors.size===1?[...colors][0]:null;
}
export function syncSelectColors(root){
 root.querySelectorAll?.('select[data-colored-select]').forEach(select=>{
  const cat=select.selectedOptions?.[0]?.dataset.color;
  if(select.style)select.style.color=textColors[cat]||'';
 });
}

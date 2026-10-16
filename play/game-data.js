import {CARDS} from './card-data.js';
export {CARDS,DOMINATION_CARDS} from './card-data.js';
export const CATEGORIES=[
 {id:'blue',name:'量子エンジニアリング',short:'エンジニアリング',symbol:'◇',color:'#74b5ff'},
 {id:'red',name:'量子セキュリティ',short:'セキュリティ',symbol:'⬡',color:'#ff8c92'},
 {id:'green',name:'量子ガバナンス',short:'ガバナンス',symbol:'◎',color:'#75dfb6'},
 {id:'yellow',name:'量子医療',short:'医療',symbol:'✳',color:'#f2ce7b'}
];
export const ROLES=[
 {id:0,name:'Eagle Eye',ja:'イーグル・アイ',cat:'blue',mark:'E',desc:'量子エンジニアリングから、技術開発を広げる。',initial:'algorithm'},
 {id:1,name:"Dragon’s Spirit",ja:'龍魂',cat:'red',mark:'D',desc:'量子セキュリティから、開発競争に挑む。',initial:'diplomacy'},
 {id:2,name:'Unity in Diversity',ja:'UD',cat:'green',mark:'U',desc:'量子ガバナンスから、未来のルールを考える。',initial:'qgc'},
 {id:3,name:'Rising Phoenix',ja:'復活の不死鳥',cat:'yellow',mark:'R',desc:'万能トークン3個から、自分の道を選ぶ。',initial:null}
];
export const cardById=id=>CARDS.find(c=>c.id===id);
export const catById=id=>CATEGORIES.find(c=>c.id===id);
export const emptyTokens=()=>({blue:0,red:0,green:0,yellow:0,wild:0});

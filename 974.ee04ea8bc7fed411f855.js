(self.webpackChunk_tstibbs_geo_bagging_ui=self.webpackChunk_tstibbs_geo_bagging_ui||[]).push([[974,166],{9974:(a,e,t)=>{"use strict";t.r(e),t.d(e,{default:()=>r});var s=t(3166),n=["Lifeboat Types","Launch Methods"],i={Atlantic85:["Atlantic 85","b-class-lifeboat"],Atlantic75:["Atlantic 75","b-class-lifeboat"],D:["D class","d-class-lifeboat"],H:["H class","rescue-hovercraft"],E:["E class","e-class-lifeboat"],Mersey:["Mersey","mersey-class-lifeboat"],Tyne:["Tyne","tyne-class-lifeboat"],Trent:["Trent","trent-class-lifeboat"],Tamar:["Tamar","tamar-class-lifeboat"],Severn:["Severn","severn-class-lifeboat"],Shannon:["Shannon","shannon-class-lifeboat"]};Object.keys(i).forEach((function(a){var e=i[a];i[a]=[e[0],"https://rnli.org/what-we-do/lifeboats-and-stations/our-lifeboat-fleet/"+e[1]]}));var o={};Object.keys(i).forEach((function(a){var e=i[a];o[a]='<a href="'+e[1]+'">'+e[0]+"</a>"}));var l={};l[n[0]]=o,l[n[1]]={MooredAfloat:"Moored Afloat",FloatingHouse:"Floating House",FloatingCradle:"Floating Cradle"};const r={aspectLabel:"RNLI",dimensionNames:n,dimensionValueLabels:l,dataToLoad:"data.json",parser:s.default,attribution:'Contains <a href="https://hub.arcgis.com/datasets/7dad2e58254345c08dfde737ec348166_0">Open Data</a> licensed under the GIS Open Data Licence &copy; RNLI and data from <a href="https://en.wikipedia.org/wiki/List_of_RNLI_stations">Wikipedia</a>',typeData:i}},3166:(a,e,t)=>{"use strict";t.r(e),t.d(e,{default:()=>s});const s=t(7085).default.extend({parse:function(a){var e=a[0],t=a[1],s=a[2],n=a[3],i=a[4],o=a[5],l=this._bundleConfig.typeData,r=this._bundleConfig.dimensionValueLabels[this._bundleConfig.dimensionNames[1]],c=[["Types",this.split(i,l)],["Launch Methods",this.split(o,r)]];this.addMarker(s,t,e,n,s,c,null,[i,o])}})}}]);
//# sourceMappingURL=974.ee04ea8bc7fed411f855.js.map
(self.webpackChunk_tstibbs_geo_bagging_ui=self.webpackChunk_tstibbs_geo_bagging_ui||[]).push([[29,154,589],{2341:(t,n,e)=>{"use strict";t.exports=e.p+"ad2f9c148c8f35cb2996.png"},3866:(t,n,e)=>{"use strict";t.exports=e.p+"d6a3c2969cb19fe70846.png"},7154:(t,n,e)=>{"use strict";e.r(n),e.d(n,{default:()=>c});e(8492);var i=e(4589),o=e(3510),r=e(3866),a=["Type","Condition"],s={},l={};function c(t){return{aspectLabel:"Trig Points",icons:{Pillar:new o.Z(t,r,{iconUrl:r,iconAnchor:[10,40],popupAnchor:[1,-38]})},dimensionNames:a,dimensionValueLabels:s,parser:i.default,attribution:'&copy; <a href="http://trigpointing.uk">trigpointing.uk</a> and licenced by Ordnance Survey under the <a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Open Government Licence</a>.'}}s[a[0]]=l,["Pillar","Bolt","Surface Block","Rivet","Buried Block","Cut","Other","Berntsen","FBM","Intersected Station","Disc","Brass Plate","Active station","Block","Concrete Ring","Curry Stool","Fenomark","Platform Bolt","Cannon","Spider","Pipe"].forEach((function(t){l[t]='<a href="http://trigpointing.uk/wiki/'+t+'">'+t+"</a>"}))},4029:(t,n,e)=>{"use strict";e.r(n),e.d(n,{default:()=>c});var i=e(9755),o=e(942),r=e(3510),a=e(7154),s=e(4589),l=e(2341);function c(t){return i.extend(!0,{},(0,a.default)(t),{icons:{searchResult:new r.Z(t,l,{iconUrl:l})},parser:s.default.extend({initialize:function(t,n,e,i){s.default.prototype.initialize.call(this,t,n,e,i);for(var r=this._config.pointsToLoad.generalPoints,a=0;a<r.length;a++){var l=r[a],c=o.Z.osgbToLngLat(l.eastings,l.northings);this.addWithoutDimensions(c,l.url,l.name)}var u=this._config.pointsToLoad.significantPoint;if(null!=u){c=o.Z.osgbToLngLat(u.eastings,u.northings);this.addWithoutDimensions(c,u.url,u.name,"searchResult")}},fetchData:function(){return i.Deferred().resolve().promise()},fetchMeta:function(){return i.Deferred().resolve().promise()}})})}},4589:(t,n,e)=>{"use strict";e.r(n),e.d(n,{default:()=>i});const i=e(7085).default.extend({parse:function(t){var n=t[0],e=t[1],i=t[2],o=t[3],r=t[4],a=t[5],s=/TP0*(\d+)/,l=null;s.test(i)&&(l="http://trigpointing.uk/trig/"+s.exec(i)[1]);var c=[["Physical Type",r],["Condition",a]];this.addMarker(i,e,n,l,o,c,r,[r,a])},add:function(t,n,e,i,o,r){this.addMarker(null,t[1],t[0],n,e,i,o,[o,r])},addWithoutDimensions:function(t,n,e,i){this.addMarker(null,t[1],t[0],n,e,null,i,[null],i)}})},3510:(t,n,e)=>{"use strict";e.d(n,{Z:()=>o});var i=e(5243);const o=i.Icon.Default.extend({initialize:function(t,n,e){n=t.baseUrl+n,this._customIconPath=n,null!=e.iconUrl&&(e.iconUrl=t.baseUrl+e.iconUrl,null==e.iconRetinaUrl&&(e.iconRetinaUrl=e.iconUrl)),null!=e.iconRetinaUrl&&(e.iconRetinaUrl=t.baseUrl+e.iconRetinaUrl),i.Icon.Default.prototype.initialize.call(this,e)},_getIconUrl:function(t){var n=i.Icon.prototype._getIconUrl.call(this,t);return n==this._customIconPath?n:i.Icon.Default.prototype._getIconUrl.call(this,t)}})}}]);
//# sourceMappingURL=29.51406e952f7f216d29b6.js.map
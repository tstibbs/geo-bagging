(self.webpackChunk_tstibbs_geo_bagging_ui=self.webpackChunk_tstibbs_geo_bagging_ui||[]).push([[494,154,589],{3866:(t,n,e)=>{"use strict";t.exports=e.p+"d6a3c2969cb19fe70846.png"},8494:(t,n,e)=>{"use strict";e.r(n),e.d(n,{default:()=>r});var i=e(9755),o=e(7154);function r(t){return i.extend({},(0,o.default)(t),{dataToLoad:"data_all.json"})}},7154:(t,n,e)=>{"use strict";e.r(n),e.d(n,{default:()=>s});e(8492);var i=e(4589),o=e(3510),r=e(3866),a=["Type","Condition"],l={},c={};function s(t){return{aspectLabel:"Trig Points",icons:{Pillar:new o.Z(t,r,{iconUrl:r,iconAnchor:[10,40],popupAnchor:[1,-38]})},dimensionNames:a,dimensionValueLabels:l,parser:i.default,attribution:'&copy; <a href="http://trigpointing.uk">trigpointing.uk</a> and licenced by Ordnance Survey under the <a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Open Government Licence</a>.'}}l[a[0]]=c,["Pillar","Bolt","Surface Block","Rivet","Buried Block","Cut","Other","Berntsen","FBM","Intersected Station","Disc","Brass Plate","Active station","Block","Concrete Ring","Curry Stool","Fenomark","Platform Bolt","Cannon","Spider","Pipe"].forEach((function(t){c[t]='<a href="http://trigpointing.uk/wiki/'+t+'">'+t+"</a>"}))},4589:(t,n,e)=>{"use strict";e.r(n),e.d(n,{default:()=>i});const i=e(7085).default.extend({parse:function(t){var n=t[0],e=t[1],i=t[2],o=t[3],r=t[4],a=t[5],l=/TP0*(\d+)/,c=null;l.test(i)&&(c="http://trigpointing.uk/trig/"+l.exec(i)[1]);var s=[["Physical Type",r],["Condition",a]];this.addMarker(i,e,n,c,o,s,r,[r,a])},add:function(t,n,e,i,o,r){this.addMarker(null,t[1],t[0],n,e,i,o,[o,r])},addWithoutDimensions:function(t,n,e,i){this.addMarker(null,t[1],t[0],n,e,null,i,[null],i)}})},3510:(t,n,e)=>{"use strict";e.d(n,{Z:()=>o});var i=e(5243);const o=i.Icon.Default.extend({initialize:function(t,n,e){n=t.baseUrl+n,this._customIconPath=n,null!=e.iconUrl&&(e.iconUrl=t.baseUrl+e.iconUrl,null==e.iconRetinaUrl&&(e.iconRetinaUrl=e.iconUrl)),null!=e.iconRetinaUrl&&(e.iconRetinaUrl=t.baseUrl+e.iconRetinaUrl),i.Icon.Default.prototype.initialize.call(this,e)},_getIconUrl:function(t){var n=i.Icon.prototype._getIconUrl.call(this,t);return n==this._customIconPath?n:i.Icon.Default.prototype._getIconUrl.call(this,t)}})}}]);
//# sourceMappingURL=494.5e0e2037e757ad53a296.js.map
(self.webpackChunk_tstibbs_geo_bagging_ui=self.webpackChunk_tstibbs_geo_bagging_ui||[]).push([[494,154,589],{3866:(t,n,e)=>{"use strict";t.exports=e.p+"d6a3c2969cb19fe70846.png"},8494:(t,n,e)=>{"use strict";e.r(n),e.d(n,{default:()=>o});var i=e(9755),a=e(7154);function o(t){return i.extend({},(0,a.default)(t),{dataToLoad:"data_all.json"})}},7154:(t,n,e)=>{"use strict";e.r(n),e.d(n,{default:()=>s});var i=e(4589),a=e(3510),o=e(3866),r=e(975),c=["Type","Condition"],l={},u={};function s(t){return{aspectLabel:"Trig Points",icons:{Pillar:new a.Z(o,{iconUrl:o,iconAnchor:[10,40],popupAnchor:[1,-38]})},dimensionNames:c,dimensionValueLabels:l,parser:i.default,attribution:'&copy; <a href="http://trigpointing.uk">trigpointing.uk</a> and licenced by Ordnance Survey under the <a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Open Government Licence</a>.',dataLocationUrlPrefix:r.Z.dataBackendBaseUrl}}l[c[0]]=u,["Pillar","Bolt","Surface Block","Rivet","Buried Block","Cut","Other","Berntsen","FBM","Intersected Station","Disc","Brass Plate","Active station","Block","Concrete Ring","Curry Stool","Fenomark","Platform Bolt","Cannon","Spider","Pipe"].forEach((function(t){u[t]='<a href="http://trigpointing.uk/wiki/'+t+'">'+t+"</a>"}))},4589:(t,n,e)=>{"use strict";e.r(n),e.d(n,{default:()=>i});const i=e(7085).default.extend({parse:function(t){var n=t[0],e=t[1],i=t[2],a=t[3],o=t[4],r=t[5],c=/TP0*(\d+)/,l=null;c.test(i)&&(l="http://trigpointing.uk/trig/"+c.exec(i)[1]);var u=[["Physical Type",o],["Condition",r]];this.addMarker(i,e,n,l,a,u,o,[o,r])},add:function(t,n,e,i,a,o){this.addMarker(null,t[1],t[0],n,e,i,a,[a,o])},addWithoutDimensions:function(t,n,e,i){this.addMarker(null,t[1],t[0],n,e,null,i,[null],i)}})},3510:(t,n,e)=>{"use strict";e.d(n,{Z:()=>a});var i=e(5243);const a=i.Icon.Default.extend({initialize:function(t,n){this._customIconPath=t,null!=n.iconUrl&&null==n.iconRetinaUrl&&(n.iconRetinaUrl=n.iconUrl),i.Icon.Default.prototype.initialize.call(this,n)},_getIconUrl:function(t){var n=i.Icon.prototype._getIconUrl.call(this,t);return n==this._customIconPath?n:i.Icon.Default.prototype._getIconUrl.call(this,t)}})}}]);
//# sourceMappingURL=494.3682b9601218007a0777.js.map
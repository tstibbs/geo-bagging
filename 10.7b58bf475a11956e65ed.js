(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"3Yo5":function(n,e,i){"use strict";i.r(e);var t=i("EVdn"),o=i.n(t),s=i("Iaci"),l=i("DIoK");describe("fullscreen_link",(function(){it("should display if container exists",(function(){var n=o()('<div class="full-screen-link"></div>');o()("#test-fixture").append(n),Object(l.a)(null),s.assert.equal(o()("a",n).length,1)})),it("should not error if container does not exist",(function(){Object(l.a)(null)}))}))},DIoK:function(n,e,i){"use strict";var t=i("EVdn"),o=i.n(t);e.a=function(n,e){if(o()("div.full-screen-link").length>0){var i=o()('<a href="#">Open in full screen</a>');i.click((function(){var i=e.getZoom(),t=e.getCenter(),o=n.baseUrl+"index.html?datasources=trigs&startPosition="+t.lat+","+t.lng+"&startZoom="+i;window.location.href=o})),o()("div.full-screen-link").append(i)}}}}]);
//# sourceMappingURL=10.7b58bf475a11956e65ed.js.map
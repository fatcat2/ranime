(this["webpackJsonpranime-client"]=this["webpackJsonpranime-client"]||[]).push([[0],{154:function(e,t,a){e.exports=a(298)},159:function(e,t,a){},160:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},161:function(e,t,a){},298:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),r=a(35),o=a.n(r),i=(a(159),a(27)),l=a(28),m=a(29),s=a(30),u=a(31),h=(a(160),a(161),a(308)),p=a(305),d=a(309),b=a(306),f=a(90),E=a(32),v=a(133),j=a.n(v),O=function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(m.a)(this,Object(s.a)(t).call(this))).state={progress:0,name:"",anime:"",tags:[]},e}return Object(u.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;j.a.get("/data/anime").then((function(t){var a=t.data;e.setState({anime:a})}))}},{key:"render",value:function(){return c.a.createElement(h.a,{centered:!0,columns:1},c.a.createElement(h.a.Column,null,c.a.createElement("div",{class:"App-header"},c.a.createElement(p.a,null,c.a.createElement(d.a,{as:"h1"},this.state.anime)))))}}]),t}(c.a.Component),g=function(e){function t(){return Object(i.a)(this,t),Object(m.a)(this,Object(s.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return c.a.createElement(h.a,{centered:!0,columns:1},c.a.createElement(h.a.Column,null,c.a.createElement("div",{class:"App-header"},c.a.createElement(p.a,null,c.a.createElement(d.a,{as:"h1",color:"black"},"random anime"),c.a.createElement(f.b,{to:"/anime"},c.a.createElement(b.a,{color:"blue"},"Give me a show!"))))))}}]),t}(c.a.Component),k=function(e){function t(){return Object(i.a)(this,t),Object(m.a)(this,Object(s.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return c.a.createElement(f.a,null,c.a.createElement("div",{className:"App"}),c.a.createElement(E.a,{path:"/",exact:!0,component:g}),c.a.createElement(E.a,{path:"/anime",exact:!0,component:O}))}}]),t}(c.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(c.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[154,1,2]]]);
//# sourceMappingURL=main.2b6f6073.chunk.js.map
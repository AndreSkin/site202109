(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{486:function(e,t){},487:function(e,t){},492:function(e,t){},493:function(e,t){},498:function(e,t){},499:function(e,t){},501:function(e,t){},505:function(e,t){},507:function(e,t){},510:function(e,t){},515:function(e,t){},517:function(e,t){},581:function(e,t,n){var content=n(714);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(29).default)("1b7833da",content,!0,{sourceMap:!1})},713:function(e,t,n){"use strict";n(581)},714:function(e,t,n){var r=n(28)(!1);r.push([e.i,".log{margin-bottom:20px}",""]),e.exports=r},727:function(e,t,n){"use strict";n.r(t);var r=n(36),o=(n(107),n(35),n(484)),l={layout:"empty",data:function(){return{UserName:"",password:"",queryRules:[function(e){return!!e}],valid:!1,show:!1,alert:{message:"",show:!1,type:""}}},beforeMount:function(){sessionStorage.clear()},computed:{width:function(){switch(this.$vuetify.breakpoint.name){case"xs":case"sm":return"100%";case"md":return"50%";case"lg":case"xl":return"30%"}}},methods:{submit:function(){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.$axios.$get("https://site202109.tw.cs.unibo.it/mongo/people?nome="+e.UserName).then((function(t){o.compare(e.password,t.val.psw,(function(n,r){if(n)throw n;r?(sessionStorage.setItem("user",JSON.stringify({nome:t.val.nome,img:t.val.img})),sessionStorage.setItem("permesso",t.permesso),window.location.href="/Home"):(e.alert.message="Password errata",e.alert.type="warning",e.alert.show=!0,e.password="")}))}));case 3:t.next=10;break;case 5:t.prev=5,t.t0=t.catch(0),e.alert.message="Utente non esistente",e.alert.type="warning",e.alert.show=!0;case 10:case"end":return t.stop()}}),t,null,[[0,5]])})))()},guest:function(){sessionStorage.setItem("user",JSON.stringify({nome:"",img:""})),sessionStorage.setItem("permesso",0),window.location.href="/Home"},register:function(){window.location.href="/Register"}}},c=(n(713),n(88)),d=n(89),m=n.n(d),f=n(730),v=n(442),w=n(417),h=n(408),x=n(520),y=n(720),_=n(402),k=n(593),V=n(411),N=n(518),component=Object(c.a)(l,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-container",{attrs:{"fill-height":""}},[n("v-row",[n("v-col",{attrs:{align:"center"}},[n("v-card",{staticStyle:{padding:"50px 50px 50px 50px"},attrs:{heigt:"100%",width:e.width}},[n("v-form",{on:{submit:function(t){return t.preventDefault(),e.submit.apply(null,arguments)}},model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[n("v-text-field",{staticClass:"expanding-search rounded-pill log",attrs:{"aria-label":"cancella contenuto",clearable:"",dense:"","persistent-placeholder":"",placeholder:"UserName",required:"","hide-details":"",rules:e.queryRules},model:{value:e.UserName,callback:function(t){e.UserName=t},expression:"UserName"}}),e._v(" "),n("v-text-field",{staticClass:"log",attrs:{rules:e.queryRules,type:e.show?"text":"password",clearable:"",dense:"","persistent-placeholder":"",placeholder:"Password",required:"","hide-details":"","append-icon":e.show?"mdi-eye":"mdi-eye-off"},on:{"click:append":function(t){e.show=!e.show}},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}}),e._v(" "),n("v-btn",{attrs:{color:"primary",small:"",text:"",type:"submit",disabled:!e.valid}},[e._v("\n\t\t\t\t\t\tLogin\n\t\t\t\t\t")])],1),e._v(" "),n("v-divider"),e._v(" "),n("v-btn",{attrs:{color:"primary",small:"",text:"",type:"submit"},on:{click:e.register}},[e._v("\n\t\t\t\t\tRegister\n\t\t\t\t")]),e._v(" "),n("div",{staticClass:"text--disabled"},[n("small",[e._v("or")])]),e._v(" "),n("v-btn",{attrs:{color:"primary",small:"",text:"",type:"submit"},on:{click:e.guest}},[e._v("\n\t\t\t\t\tGuest Login\n\t\t\t\t")]),e._v(" "),n("v-dialog",{attrs:{transition:"dialog-top-transition",width:"auto"},model:{value:e.alert.show,callback:function(t){e.$set(e.alert,"show",t)},expression:"alert.show"}},[n("v-alert",{staticClass:"ma-0",attrs:{type:e.alert.type}},[e._v(e._s(e.alert.message))])],1)],1)],1)],1)],1)}),[],!1,null,null,null);t.default=component.exports;m()(component,{VAlert:f.a,VBtn:v.a,VCard:w.a,VCol:h.a,VContainer:x.a,VDialog:y.a,VDivider:_.a,VForm:k.a,VRow:V.a,VTextField:N.a})}}]);
(function(){var e={90485:function(e,t,o){"use strict";o(66992),o(88674),o(19601),o(17727),o(57327),o(41539);var n=o(28935),i=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticStyle:{height:"100%"},attrs:{id:"app"}},[o("router-view")],1)},r=[],a=o(1001),s={},l=(0,a.Z)(s,i,r,!1,null,null,null),c=l.exports,u=o(12809),f=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"home",staticStyle:{height:"100%",display:"flex"}},[o("div",{staticClass:"left",staticStyle:{height:"100%","max-width":"300px",width:"30%",flex:"1"}},[o("RoomList",{on:{select:e.onSelect,roomList:e.onRoomList}})],1),o("div",{staticClass:"right",staticStyle:{height:"100%",flex:"1"}},[o("Room",{ref:"room",attrs:{room:e.room,othersInfo:e.othersInfo},on:{filesChange:function(t){return e.onFilesChange(t,e.room)}}})],1),o("div",{staticClass:"bottom",staticStyle:{position:"absolute",bottom:"0",left:"0",right:"0",height:"20px"}},[o("div",{staticStyle:{position:"absolute",right:"5px"}},[e._v(e._s(e.id.slice(0,15)))])])])},m=[],d=o(13571),p=o(16198),h=o(93019),v=(o(78975),o(38862),o(54747),o(74916),o(23123),o(69826),o(33948),o(47042),o(21249),o(68309),function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticStyle:{"background-color":"rgb(84, 92, 100)",height:"100%",position:"relative"}},[e._m(0),o("main",[o("el-menu",{staticClass:"el-menu-vertical-demo",attrs:{"default-active":"0","background-color":"#545c64","text-color":"#fff","active-text-color":"#ffd04b"},on:{select:e.onSelect}},e._l(e.roomList,(function(t,n){return o("el-menu-item",{key:t.roomName,staticClass:"clickable room-title",attrs:{index:String(n)}},[o("i",{staticClass:"el-icon-menu"}),o("span",[e._v(e._s(t.roomName))])])})),1)],1),o("footer",{staticStyle:{position:"absolute",left:"0",right:"0",bottom:"0"}},[o("el-button",{attrs:{type:"primary"},on:{click:e.addRoom}},[e._v("Add")])],1),o("el-dialog",{attrs:{title:"Add Room",visible:e.dialogVisible,width:"30%","before-close":e.handleClose},on:{"update:visible":function(t){e.dialogVisible=t}}},[o("span",[e._v("Room Name")]),o("el-input",{attrs:{placeholder:"Please input"},model:{value:e.roomName,callback:function(t){e.roomName=t},expression:"roomName"}}),o("span",[e._v("Room Password")]),o("el-input",{attrs:{placeholder:"Please input"},model:{value:e.roomPassword,callback:function(t){e.roomPassword=t},expression:"roomPassword"}}),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("Cancel")]),o("el-button",{attrs:{type:"primary"},on:{click:e.onConfirmAddRoom}},[e._v("Confirm")])],1)],1)],1)}),g=[function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("header",[o("section",{staticClass:"room-tab"})])}],w=(o(39714),o(82472),o(48675),o(92990),o(18927),o(33105),o(35035),o(74345),o(7174),o(32846),o(44731),o(77209),o(96319),o(58867),o(37789),o(33739),o(29368),o(14483),o(12056),o(3462),o(30678),o(27462),o(33824),o(55021),o(12974),o(15016),o(84944),o(33792),o(10311)),b=o.n(w),y={};function x(e,t){var o=b().AES.encrypt(e,t);return o.toString()}function S(e,t){return b().AES.decrypt(e,t).toString(b().enc.Utf8)}function P(e,t){if(!y[e]){var o=b().SHA512(e+"-"+t).toString();y[e]=o}return y[e]}function k(e,t){return _.apply(this,arguments)}function _(){return _=(0,p.Z)(regeneratorRuntime.mark((function e(t,o){var n,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.t0=b().lib.WordArray,e.next=3,t.arrayBuffer();case 3:return e.t1=e.sent,n=e.t0.create.call(e.t0,e.t1),i=b().AES.encrypt(n,o),e.abrupt("return",new Blob([i.toString()]));case 7:case"end":return e.stop()}}),e)}))),_.apply(this,arguments)}function I(e,t){return C.apply(this,arguments)}function C(){return C=(0,p.Z)(regeneratorRuntime.mark((function e(t,o){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.t0=b().AES,e.next=3,t.text();case 3:return e.t1=e.sent,e.t2=o,n=e.t0.decrypt.call(e.t0,e.t1,e.t2),e.abrupt("return",new Blob([N(n)]));case 7:case"end":return e.stop()}}),e)}))),C.apply(this,arguments)}function R(e,t){var o=[],n=255;return t>0&&o.push(e>>>24),t>1&&o.push(e>>>16&n),t>2&&o.push(e>>>8&n),t>3&&o.push(e&n),o}function N(e){var t,o=e.words,n=e.sigBytes,i=[],r=0;while(n>0)t=R(o[r],Math.min(4,n)),n-=t.length,i.push(t),r++;return new Uint8Array(i.flat())}var T={pubicKey:"-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBFhecdO3oC9+IsVDkqvDtMqN7\np/4FP0ywusbfa0iBmNh15iljIonXyJSX0v3OagvZ0m49g7pdSvaQixblWkGedKY9\n7T399fnRG7clqi6X7NCJpvQVGaBtq6ez5VNffB9xIUn+efZyjMFNnro0tdVeXCA8\nxfmGtJe6UoazG2b8QwIDAQAB\n-----END PUBLIC KEY-----\n    ",port:43820,roomSalt:"woklsdg290323kjbg",fileSalt:"2303,,g;w2;23o5",aesSalt:"203kmg02l;3;t",server:"192.168.50.210"},A={name:"RoomList",data:function(){return{configKey:"b2b-exchange-config",roomList:[],roomName:"",roomPassword:"",dialogVisible:!1,selected:null}},created:function(){this.initConfig()},mounted:function(){this.onSelect(0)},methods:{onSelect:function(e){this.selected=this.roomList[e];var t=P(this.selected.roomPassword,T.roomSalt);this.$emit("select",(0,h.Z)((0,h.Z)({},this.selected),{},{hash:t}))},onConfirmAddRoom:function(){this.roomName&&this.roomPassword?this.roomPassword.length<6?this.$alert("pass word too short"):(this.roomList.push({roomName:this.roomName,roomPassword:this.roomPassword}),this.syncConfig(),this.dialogVisible=!1,this.$emit("roomList",this.roomList)):this.$alert("no name or no pwd")},initConfig:function(){try{var e=localStorage.getItem(this.configKey);this.roomList=JSON.parse(e)||[]}catch(t){this.roomList=[]}this.$emit("roomList",this.roomList)},syncConfig:function(){localStorage.setItem(this.configKey,JSON.stringify(this.roomList))},addRoom:function(){this.dialogVisible=!0},handleClose:function(e){this.$confirm("Are you sure to close this dialog?").then((function(){e()})).catch((function(){}))}},components:{}},E=A,B=(0,a.Z)(E,v,g,!1,null,null,null),M=B.exports,K=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"room",staticStyle:{height:"100%",padding:"20px","box-sizing":"border-box",overflow:"auto"}},[o("div",{staticStyle:{position:"relative"}},[e.room?o("span",{staticStyle:{"font-size":"30px","font-weight":"bold"},attrs:{title:e.roomHash}},[e._v(e._s(e.room.roomName))]):e._e(),o("el-button",{staticStyle:{position:"absolute",right:"0",top:"0"},attrs:{type:"danger"},on:{click:e.showPassword}},[e._v("Show Password")])],1),o("file-upload",{ref:"uspload",staticClass:"btn btn-primary",attrs:{"post-action":"/upload/post",multiple:!0,drop:!0,"drop-directory":!0,value:e.files},on:{input:e.onFiles}},[o("el-button",{attrs:{type:"primary"}},[o("i",{staticClass:"el-icon-upload"}),e._v(" Upload")])],1),o("div",[o("el-table",{staticStyle:{width:"100%"},attrs:{data:e.files}},[o("el-table-column",{attrs:{prop:"name",label:"Name",width:"280"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row,i=n.name,r=n.hash;return[o("div",[o("div",{attrs:{title:r}},[e._v(e._s(i))]),e.imageBlobMap[i]?o("img",{attrs:{src:e.imageBlobMap[i],alt:""}}):e._e()])]}}])}),o("el-table-column",{attrs:{prop:"size",label:"Size",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row.size;return[o("span",[e._v(e._s(e.filesize(n)))])]}}])})],1),o("el-table",{staticStyle:{width:"100%"},attrs:{data:e.othersTable}},[o("el-table-column",{attrs:{prop:"name",label:"Name",width:"280"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row,i=n.name,r=n.hash;return[o("div",[o("div",{attrs:{title:r}},[e._v(e._s(i))]),e.imageBlobMap[i]?o("img",{staticStyle:{"max-width":"100%","max-height":"200px"},attrs:{src:e.imageBlobMap[i],alt:""}}):e._e()])]}}])}),o("el-table-column",{attrs:{prop:"size",label:"Size",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row.size;return[o("span",[e._v(e._s(e.filesize(n)))])]}}])}),o("el-table-column",{attrs:{prop:"id",label:"From",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row.id;return[o("span",{attrs:{title:n}},[e._v(e._s(n.slice(0,10)))])]}}])}),o("el-table-column",{attrs:{label:"Action",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[o("div",[e.progressMap[n.name]?e._e():o("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.startDownload(n)}}},[o("i",{staticClass:"el-icon-download"}),e._v(" Download")]),!e.progressMap[n.name]&&e.isText(n.name)?o("el-button",{staticStyle:{"margin-top":"10px"},attrs:{type:"warning"},on:{click:function(t){return e.startPreview(n)}}},[o("i",{staticClass:"el-icon-download"}),e._v(" Preview")]):e._e(),e.progressMap[n.name]?o("el-button",[e._v(e._s(e._f("percentage")(e.progressMap[n.name])))]):e._e()],1)]}}])})],1)],1),o("el-dialog",{attrs:{title:"Tips",visible:e.showPasswordDialogVisible,width:"30%"},on:{"update:visible":function(t){e.showPasswordDialogVisible=t}}},[e.room?o("span",[e._v(e._s(e.room.roomPassword))]):e._e(),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(t){e.showPasswordDialogVisible=!1}}},[e._v("Cancel")]),o("el-button",{attrs:{type:"primary"},on:{click:e.copyPassword}},[e._v("Copy")])],1)]),o("el-dialog",{attrs:{title:"Paste Image",visible:e.showPasteImageVisible,width:"30%","close-on-click-modal":!1},on:{"update:visible":function(t){e.showPasteImageVisible=t}}},[o("span",{staticStyle:{display:"inline-block","margin-bottom":"15px"}},[e._v("Input the file name of your Image")]),o("el-input",{staticStyle:{"margin-bottom":"15px"},attrs:{placeholder:"Please input file name"},model:{value:e.pastedItemName,callback:function(t){e.pastedItemName=t},expression:"pastedItemName"}}),o("el-button",{attrs:{type:"success"},on:{click:e.generateFileName}},[e._v("Generate")]),o("img",{staticStyle:{"max-width":"100%","max-height":"100%",display:"block",margin:"auto"},attrs:{src:e.pastedItem}}),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:e.cancelPaste}},[e._v("Cancel")]),o("el-button",{attrs:{type:"primary",disabled:!Boolean(e.pastedItemName)},on:{click:e.confirmPaste}},[e._v("Confirm")])],1)],1),o("el-dialog",{attrs:{title:"Paste Text",visible:e.showPasteTextVisible,width:"30%","close-on-click-modal":!1},on:{"update:visible":function(t){e.showPasteTextVisible=t},close:e.cancelPaste}},[o("span",{staticStyle:{display:"inline-block","margin-bottom":"15px"}},[e._v("Input the file name of your text")]),o("el-input",{staticStyle:{"margin-bottom":"15px"},attrs:{placeholder:"Please input file name"},model:{value:e.pastedItemName,callback:function(t){e.pastedItemName=t},expression:"pastedItemName"}}),o("el-button",{attrs:{type:"success"},on:{click:e.generateFileName}},[e._v("Generate")]),o("div",[e._v(" "+e._s(e.pastedItem)+" ")]),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:e.cancelPaste}},[e._v("Cancel")]),o("el-button",{attrs:{type:"primary",disabled:!Boolean(e.pastedItemName)},on:{click:e.confirmPaste}},[e._v("Confirm")])],1)],1),o("el-dialog",{attrs:{title:"Preview "+e.previewingTextFileName,visible:e.showTextPreview,width:"30%"},on:{"update:visible":function(t){e.showTextPreview=t},close:e.closeTextPreview}},[o("div",[o("textarea",{attrs:{cols:"30",rows:"10",readonly:""},domProps:{value:e.previewingText}})]),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{attrs:{type:"primary"},on:{click:e.copyPreviewingText}},[e._v("Copy")]),o("el-button",{attrs:{type:"default"},on:{click:function(t){e.showTextPreview=!1}}},[e._v("Confirm")])],1)])],1)},O=[],L=(o(4723),o(92222),o(78783),o(60285),o(41637),o(75322)),V=o.n(L),Z=o(86414),F=o.n(Z),D=o(34665),H=(o(26699),o(32023),{jpg:!0,jpeg:!0,webp:!0,png:!0,gif:!0}),$={txt:!0};function z(e){return e.includes(".")?e.split(".").pop():""}function j(e){var t=z(e);return!(!t||!H[t])}function J(e){var t=z(e);return!(!t||!$[t])}function U(e){var t,o=null===e||void 0===e||null===(t=e.split("."))||void 0===t?void 0:t[1];if(!o)return"";var n="";return"jpg"===o&&(n="jpeg"),"png"!==o&&"gif"!==o&&"jpeg"!==o||(n=o),n}var G=n["default"].extend({name:"RoomComp",props:{room:Object,othersInfo:Array},data:function(){return{previewingTextFileName:"",showTextPreview:!1,previewingText:"",showPasteTextVisible:!1,pastedBlob:null,pastedItem:"",showPasteImageVisible:!1,imageBlobMap:{},othersTable:[],files:[],showPasswordDialogVisible:!1,progressMap:{},pastedItemName:"",imageSuffixMap:{jpg:!0,jpeg:!0,webp:!0,png:!0,gif:!0}}},mounted:function(){var e=this;document.onpaste=function(t){var o=t.clipboardData.items,n=t.clipboardData.getData("Text");if(n)return e.pastedItem=n,e.showPasteTextVisible=!0,void(e.pastedBlob=new Blob([n]));if(o.length)for(var i in o){var r=o[i];if("file"===r.kind){var a=r.getAsFile();e.pastedBlob=a;var s=new FileReader;s.onload=function(t){e.pastedItem=t.target.result,e.showPasteImageVisible=!0},s.readAsDataURL(a)}}}},computed:{roomHash:function(){return this.room?P(this.room.roomPassword,T.roomSalt):""}},methods:(0,h.Z)((0,h.Z)({isImage:j,isText:J},(0,D.nv)(["safeRequest","download"])),{},{closeTextPreview:function(){this.previewingTextFileName=""},copyPreviewingText:function(){navigator.clipboard.writeText(this.previewingText)},generateFileName:function(){var e=Math.floor(1e6*Math.random());this.pastedItemName=String(e)},cancelPaste:function(){this.pastedItem="",this.pastedItemName="",this.showPasteTextVisible=!1,this.showPasteImageVisible=!1},confirmPaste:function(){if(this.showPasteImageVisible){var e,t=this.pastedItem,o=(null===(e=t.slice(0,20).match(/\/(\w+)/))||void 0===e?void 0:e[1])||"",n=new File([this.pastedBlob],"".concat(this.pastedItemName,".").concat(o),{type:"image/".concat(U("a.".concat(o))),lastModified:Date.now()});this.$refs.uspload.add(n),this.cancelPaste()}else if(this.showPasteTextVisible){var i=new File([this.pastedBlob],"".concat(this.pastedItemName,".txt"),{type:"text/plain",lastModified:Date.now()});this.$refs.uspload.add(i),this.cancelPaste()}},startPreview:function(e){var t=this;return(0,p.Z)(regeneratorRuntime.mark((function o(){var n,i;return regeneratorRuntime.wrap((function(o){while(1)switch(o.prev=o.next){case 0:if(!t.previewingTextFileName){o.next=2;break}return o.abrupt("return");case 2:return t.previewingTextFileName=e.name,o.next=5,t.fetchBlob(e);case 5:if(n=o.sent,!t.isText(e.name)){o.next=12;break}return o.next=9,n.text();case 9:i=o.sent,t.previewingText=i,t.showTextPreview=!0;case 12:case"end":return o.stop()}}),o)})))()},fetchBlob:function(e){var t=this;return(0,p.Z)(regeneratorRuntime.mark((function o(){var n;return regeneratorRuntime.wrap((function(o){while(1)switch(o.prev=o.next){case 0:return t.$set(t.progressMap,e.name,1e-6),o.next=3,t.download({roomHash:t.roomHash,roomPassword:t.room.roomPassword,fileName:e.name,fileSize:e.size,from:e.id,onProgress:function(o){t.$set(t.progressMap,e.name,o),console.log("on",o)}});case 3:return n=o.sent,t.$delete(t.progressMap,e.name),o.abrupt("return",n);case 6:case"end":return o.stop()}}),o)})))()},startDownload:function(e){var t=this;return(0,p.Z)(regeneratorRuntime.mark((function o(){var n,i;return regeneratorRuntime.wrap((function(o){while(1)switch(o.prev=o.next){case 0:return o.next=2,t.fetchBlob(e);case 2:n=o.sent,t.isImage(e.name)?(i=new FileReader,i.addEventListener("loadend",(function(){var o=i.result;t.$set(t.imageBlobMap,e.name,o)})),n instanceof Blob&&i.readAsDataURL(n)):t.downloadBlob(n,e.name);case 4:case"end":return o.stop()}}),o)})))()},downloadBlob:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"file.txt",o=window.URL.createObjectURL(e),n=document.createElement("a");n.href=o,n.download=t,n.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})),setTimeout((function(){window.URL.revokeObjectURL(o),n.remove()}),100)},setFiles:function(e){this.files=e},onFiles:function(e){var t=this,o={};this.files=e.map((function(e){return e.hash||(e.hash=P(e.name,T.fileSalt)),e})).filter((function(e){var n=e.name;return o[n]?(t.$message.error("found duplicated file name "+n),!1):(o[n]=!0,!0)})),this.$emit("filesChange",this.files)},showPassword:function(){this.showPasswordDialogVisible=!0},copyPassword:function(){navigator.clipboard.writeText(this.room.roomPassword),this.showPasswordDialogVisible=!1},filesize:V()}),watch:{othersInfo:{immediate:!0,handler:function(e){var t=this;e||(this.othersTable=[]),this.othersTable=e.reduce((function(e,o){if(o.room.files){var n=JSON.parse(S(o.room.files,t.room.roomPassword));n.forEach((function(t){e.push(Object.assign({progress:0},t,{id:o.id}))}))}return e}),[])}}},components:{FileUpload:F()}}),q=G,Q=(0,a.Z)(q,K,O,!1,null,null,null),W=Q.exports,X=o(54102),Y=o(26166),ee=o.n(Y);function te(e){var t=e.method,o=e.data,n=e.headers,i=e.responseType,r="http://".concat(T.server,":").concat(T.port);return ee()({method:"POST",url:"".concat(r,"/").concat(t),headers:n,data:o,responseType:i}).then((function(e){return e.data}))}var oe={name:"HomeView",data:function(){return{processingChunk:!1,intervalList:[],id:"HomeView",room:null,othersInfo:[],AESKey:""}},created:function(){var e=this;this.roomsInfo={};var t=new X.Z;t.setPublicKey(T.pubicKey),this.encrypt=t,this.AESKey=this.generateAESKey(),this.$store.commit("setAESKey",this.AESKey),this.id=P(this.AESKey,T.aesSalt),this.$store.commit("setID",this.id),this.encryptedBasic=this.encrypt.encrypt(JSON.stringify({AESKey:this.AESKey})),window.onbeforeunload=function(){e.exit()}},destroyed:function(){console.log(1),this.exit(),this.intervalList.forEach((function(e){clearInterval(e)})),this.intervalList=[]},mounted:function(){var e=this;this.ping();var t=setInterval((function(){e.ping()}),9e3);setTimeout((function(){e.getRoomInfo()}),500);var o=setInterval((function(){e.getRoomInfo()}),3e3);this.intervalList.push(t),this.intervalList.push(o)},methods:(0,h.Z)((0,h.Z)((0,h.Z)({},(0,D.OI)(["getAESKey"])),(0,D.nv)(["safeRequest"])),{},{exit:function(){te({method:"exit",data:{id:this.id,d:x(JSON.stringify({}),this.AESKey)}})},generateAESKey:function(){return String(Math.random())+String(Date.now())},onWaitChunkMap:function(e){var t=this;return(0,p.Z)(regeneratorRuntime.mark((function o(){var n,i,r,a,s,l,c,u;return regeneratorRuntime.wrap((function(o){while(1)switch(o.prev=o.next){case 0:if(!t.processingChunk){o.next=2;break}return o.abrupt("return");case 2:t.processingChunk=!0,o.prev=3,i={roomHash:"",fileHash:""},r=function(e){var o=e.split("-"),r=(0,d.Z)(o,2),a=r[0],s=r[1];return t.roomsInfo[a]?(n=t.roomsInfo[a].files.find((function(e){return e.hash===s})),n?(i={roomHash:a,fileHash:s},"break"):void 0):"continue"},o.t0=regeneratorRuntime.keys(e);case 7:if((o.t1=o.t0()).done){o.next=16;break}if(a=o.t1.value,s=r(a),"continue"!==s){o.next=12;break}return o.abrupt("continue",7);case 12:if("break"!==s){o.next=14;break}return o.abrupt("break",16);case 14:o.next=7;break;case 16:if(l=i.roomHash+"-"+i.fileHash,!n){o.next=23;break}return c=e[l],o.next=21,t.pushChunk({position:c[0].position,size:c[0].size,file:n.file,roomHash:i.roomHash,fileHash:i.fileHash});case 21:u=o.sent,u.waitChunkMap&&setTimeout((function(){t.onWaitChunkMap(u.waitChunkMap)}));case 23:return o.prev=23,t.processingChunk=!1,o.finish(23);case 26:case"end":return o.stop()}}),o,null,[[3,,23,26]])})))()},pushChunk:function(e){var t=this;return(0,p.Z)(regeneratorRuntime.mark((function o(){var n,i,r,a,s,l,c,u,f,m,d;return regeneratorRuntime.wrap((function(o){while(1)switch(o.prev=o.next){case 0:return n=e.position,i=e.size,r=e.file,a=e.roomHash,s=e.fileHash,l=t.roomsInfo[a].roomPassword,c=new FormData,u=r.slice(n,n+i),o.next=6,k(u,l);case 6:return f=o.sent,console.log("encryptedBlob",f),c.append("blob",f),c.append("id",t.id),c.append("d",x(JSON.stringify({position:n,size:i,roomHash:a,fileHash:s}),t.AESKey)),o.next=13,te({method:"push",headers:{"Content-Type":"multipart/form-data"},data:c});case 13:return m=o.sent,d=t.decryptRet(m),o.abrupt("return",d);case 16:case"end":return o.stop()}}),o)})))()},decryptRet:function(e){return"OK"===e?{}:JSON.parse(S(e,this.$store.getters.AESKey))},getRoomInfo:function(){var e=this;return(0,p.Z)(regeneratorRuntime.mark((function t(){var o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.safeRequest({method:"getRoomInfo",data:{roomHash:e.room.hash}});case 2:o=t.sent,o=JSON.parse(o),o.waitChunkMap&&e.onWaitChunkMap(o.waitChunkMap),e.othersInfo=o.others;case 6:case"end":return t.stop()}}),t)})))()},ping:function(){var e={};for(var t in this.roomsInfo)e[t]={},e[t].files=this.roomsInfo[t].encryptedFiles;te({method:"ping",data:{e:this.encryptedBasic,i:x(JSON.stringify(e),this.AESKey)}})},onRoomList:function(e){var t=this;null===e||void 0===e||e.forEach((function(e){var o=P(e.roomPassword,T.roomSalt);t.roomsInfo[o]||(t.roomsInfo[o]={})})),this.ping()},onFilesChange:function(e,t){var o=null===e||void 0===e?void 0:e.map((function(e){return{size:e.size,name:e.name}}));this.roomsInfo[t.hash].files=e,this.roomsInfo[t.hash].roomPassword=t.roomPassword,this.roomsInfo[t.hash].encryptedFiles=x(JSON.stringify(o),t.roomPassword),this.ping()},onSelect:function(e){this.room=e,this.$refs.room.setFiles(this.roomsInfo[e.hash].files),this.othersInfo=[],this.getRoomInfo()}}),components:{RoomList:M,Room:W}},ne=oe,ie=(0,a.Z)(ne,f,m,!1,null,null,null),re=ie.exports;n["default"].use(u.Z);var ae=[{path:"/",name:"home",component:re}],se=new u.Z({routes:ae}),le=se,ce=o(74549),ue=o.n(ce);function fe(e,t,o){var n=0,i={},r=0;return new Promise((function(a,s){var l=[];function c(){if(!t(n)&&!(r>o)){var u=e(n),f=n;i[f]=!0,n++,r++,u.then((function(e){l[f]=e,delete i[f],r--,c(),0===r&&a(l)})).catch((function(e){console.log(e),s(e)})),c()}}c()}))}n["default"].use(D.ZP);var me=new D.ZP.Store({state:{AESKey:"",id:""},mutations:{setID:function(e,t){e.id=t},setAESKey:function(e,t){e.AESKey=t},getAESKey:function(e){return e.AESKey}},getters:{AESKey:function(e){return e.AESKey}},actions:{incrementAsync:function(e){var t=e.commit;setTimeout((function(){t("increment")}),1e3)},safeRequest:function(e,t){return(0,p.Z)(regeneratorRuntime.mark((function o(){var n,i,r,a;return regeneratorRuntime.wrap((function(o){while(1)switch(o.prev=o.next){case 0:return n=e.state,i=t.method,r=t.data,o.next=4,te({method:i,data:{id:n.id,d:r?x(JSON.stringify(r),n.AESKey):void 0}});case 4:return a=o.sent,o.abrupt("return",S(a,n.AESKey));case 6:case"end":return o.stop()}}),o)})))()},download:function(e,t){return(0,p.Z)(regeneratorRuntime.mark((function o(){var n,i,r,a,s,l,c,u,f,m,d,h,v;return regeneratorRuntime.wrap((function(o){while(1)switch(o.prev=o.next){case 0:return n=e.state,i=t.roomHash,r=t.roomPassword,a=t.fileName,s=t.fileSize,l=t.from,c=t.onProgress,u=3e6,f=s%u,m=Math.floor(s/u)+(f?1:0),console.log(s,m,f),d=[],c(0),h=0,o.next=11,fe(function(){var e=(0,p.Z)(regeneratorRuntime.mark((function e(t){var o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,te({responseType:"blob",method:"chunk",data:{id:n.id,d:x(JSON.stringify({roomHash:i,id:l,position:t*u,size:f&&t===m-1?f:u,fileHash:P(a,T.fileSalt)}),n.AESKey)}});case 2:return o=e.sent,e.next=5,I(o,r);case 5:d[t]=e.sent,h++,c(h/m);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),(function(e){return e>=m}),5);case 11:return v=j(a)?new Blob(d,{type:"image/"+U(a)}):new Blob(d),o.abrupt("return",v);case 13:case"end":return o.stop()}}),o)})))()}}}),de=me;n["default"].use(ue()),n["default"].config.productionTip=!1,n["default"].filter("percentage",(function(e){return e||(e=0),Math.floor(100*e)+"%"})),new n["default"]({router:le,store:de,render:function(e){return e(c)}}).$mount("#app")},42480:function(){}},t={};function o(n){var i=t[n];if(void 0!==i)return i.exports;var r=t[n]={id:n,loaded:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.loaded=!0,r.exports}o.m=e,function(){var e=[];o.O=function(t,n,i,r){if(!n){var a=1/0;for(u=0;u<e.length;u++){n=e[u][0],i=e[u][1],r=e[u][2];for(var s=!0,l=0;l<n.length;l++)(!1&r||a>=r)&&Object.keys(o.O).every((function(e){return o.O[e](n[l])}))?n.splice(l--,1):(s=!1,r<a&&(a=r));if(s){e.splice(u--,1);var c=i();void 0!==c&&(t=c)}}return t}r=r||0;for(var u=e.length;u>0&&e[u-1][2]>r;u--)e[u]=e[u-1];e[u]=[n,i,r]}}(),function(){o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,{a:t}),t}}(),function(){o.d=function(e,t){for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}}(),function(){o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){o.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){var e={143:0};o.O.j=function(t){return 0===e[t]};var t=function(t,n){var i,r,a=n[0],s=n[1],l=n[2],c=0;if(a.some((function(t){return 0!==e[t]}))){for(i in s)o.o(s,i)&&(o.m[i]=s[i]);if(l)var u=l(o)}for(t&&t(n);c<a.length;c++)r=a[c],o.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return o.O(u)},n=self["webpackChunkb2b_exchange"]=self["webpackChunkb2b_exchange"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var n=o.O(void 0,[998],(function(){return o(90485)}));n=o.O(n)})();
//# sourceMappingURL=app-legacy.da474f45.js.map
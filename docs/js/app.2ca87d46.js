(function(){var t={2436:function(t,e,o){"use strict";var s=o(8935),i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticStyle:{height:"100%"},attrs:{id:"app"}},[o("router-view")],1)},n=[],a=o(1001),r={},l=(0,a.Z)(r,i,n,!1,null,null,null),c=l.exports,h=o(2809),m=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"home",staticStyle:{height:"100%",display:"flex"}},[o("div",{staticClass:"left",staticStyle:{height:"100%","max-width":"250px",width:"30%",flex:"1"}},[o("RoomList",{on:{select:t.onSelect,roomList:t.onRoomList,settings:t.onSettings}})],1),o("div",{staticClass:"right",staticStyle:{height:"100%",flex:"1"}},[t.room&&"room"===t.showingTab?o("Room",{ref:"room",attrs:{room:t.room,othersInfo:t.othersInfo},on:{filesChange:function(e){return t.onFilesChange(e,t.room)}}}):t._e(),"guide"===t.showingTab?o("Guide"):t._e(),"settings"===t.showingTab?o("Settings"):t._e()],1),o("div",{staticClass:"bottom",staticStyle:{position:"absolute",bottom:"0",left:"0",right:"0",height:"20px","pointer-events":"none"}},[o("div",{staticStyle:{position:"absolute",right:"5px"}},[t._v(t._s(t.id.slice(0,15)))])])])},d=[],u=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"room-list",staticStyle:{"background-color":"rgb(84, 92, 100)",height:"100%",position:"relative"}},[t._m(0),o("main",[o("ul",{staticStyle:{margin:"0",color:"white",padding:"0"}},t._l(t.roomList,(function(e,s){return o("li",{key:s,class:{active:!!t.selected&&e.roomName===t.selected.roomName,"menu-li":!0},on:{click:function(e){return t.onSelect(s)}}},[o("i",{staticClass:"el-icon-menu"}),t._v(" "+t._s(e.roomName)+" ")])})),0)]),o("footer",{staticStyle:{position:"absolute",left:"0",right:"0",bottom:"0"}},[o("i",{staticClass:"el-icon-setting",staticStyle:{position:"absolute",left:"5px",bottom:"45px",color:"white","font-size":"45px",cursor:"pointer"},on:{click:t.onSettings}}),o("el-button",{staticStyle:{width:"50%",position:"absolute",left:"0",bottom:"0"},attrs:{type:"primary"},on:{click:t.addRoom}},[t._v("Add")]),o("el-button",{staticStyle:{width:"50%",position:"absolute",right:"0",bottom:"0"},attrs:{type:"danger"},on:{click:t.deleteRoom}},[t._v("Delete")])],1),o("el-dialog",{attrs:{title:"Add Room",visible:t.dialogVisible,width:"30%","before-close":t.handleClose},on:{"update:visible":function(e){t.dialogVisible=e}}},[o("span",[t._v("Room Name")]),o("el-input",{attrs:{placeholder:"Please input"},model:{value:t.roomName,callback:function(e){t.roomName=e},expression:"roomName"}}),o("span",[t._v("Room Password")]),o("el-input",{attrs:{placeholder:"Please input"},model:{value:t.roomPassword,callback:function(e){t.roomPassword=e},expression:"roomPassword"}}),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(e){t.dialogVisible=!1}}},[t._v("Cancel")]),o("el-button",{attrs:{type:"primary"},on:{click:t.onConfirmAddRoom}},[t._v("Confirm")])],1)],1)],1)},p=[function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("header",[o("section",{staticClass:"room-tab"})])}],f=(o(8675),o(3462),o(311)),g=o.n(f);const w={};function b(t,e){const o=g().AES.encrypt(t,e);return o.toString()}function y(t,e){return g().AES.decrypt(t,e).toString(g().enc.Utf8)}function v(t,e){if(!w[t]){const o=g().SHA512(t+"-"+e).toString();w[t]=o}return w[t]}async function S(t,e){const o=g().lib.WordArray.create(await t.arrayBuffer()),s=g().AES.encrypt(o,e);return new Blob([s.toString()])}async function x(t,e){const o=g().AES.decrypt(await t.text(),e);return new Blob([P(o)])}function _(t,e){const o=[],s=255;return e>0&&o.push(t>>>24),e>1&&o.push(t>>>16&s),e>2&&o.push(t>>>8&s),e>3&&o.push(t&s),o}function P({words:t,sigBytes:e}){const o=[];let s,i=0;while(e>0)s=_(t[i],Math.min(4,e)),e-=s.length,o.push(s),i++;return new Uint8Array(o.flat())}var I={pubicKey:"-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBFhecdO3oC9+IsVDkqvDtMqN7\np/4FP0ywusbfa0iBmNh15iljIonXyJSX0v3OagvZ0m49g7pdSvaQixblWkGedKY9\n7T399fnRG7clqi6X7NCJpvQVGaBtq6ez5VNffB9xIUn+efZyjMFNnro0tdVeXCA8\nxfmGtJe6UoazG2b8QwIDAQAB\n-----END PUBLIC KEY-----\n    ",roomSalt:"woklsdg290323kjbg",fileSalt:"2303,,g;w2;23o5",aesSalt:"203kmg02l;3;t",origin:""};const k=I,C="b2b-exchange-config";try{const t=localStorage.getItem(C);Object.assign(k,JSON.parse(t))}catch(It){console.log("no saved config")}function N(t){Object.assign(k,t),localStorage.setItem(C,JSON.stringify(k))}var T=k,A={name:"RoomList",data(){return{configKey:"b2b-exchange-room-list",roomList:[],roomName:"",roomPassword:"",dialogVisible:!1,selected:null}},created(){this.initConfig()},mounted(){this.roomList.length&&this.onSelect(0)},methods:{onSettings(){this.onSelect(null),this.$emit("settings")},onSelect(t){if(null===t||void 0===t)this.selected=null,this.$emit("select",null);else{this.selected=this.roomList[t];const e=v(this.selected.roomPassword,T.roomSalt);this.$emit("select",{...this.selected,hash:e})}console.log("on select",t)},onConfirmAddRoom(){this.roomName&&this.roomPassword?this.roomPassword.length<6?this.$alert("pass word too short"):(this.roomList.push({roomName:this.roomName,roomPassword:this.roomPassword}),this.syncConfig(),this.dialogVisible=!1,this.$emit("roomList",this.roomList),this.selected||this.onSelect(0),console.log("on confirm",this.selected),this.roomName="",this.roomPassword=""):this.$alert("no name or no pwd")},initConfig(){try{const t=localStorage.getItem(this.configKey);this.roomList=JSON.parse(t)||[]}catch(It){this.roomList=[]}this.$emit("roomList",this.roomList)},syncConfig(){localStorage.setItem(this.configKey,JSON.stringify(this.roomList))},addRoom(){this.dialogVisible=!0},deleteRoom(){this.$confirm(`Are you sure to delete room "${this.selected.roomName}"?`).then((()=>{this.roomList=this.roomList.filter((({roomName:t})=>this.selected.roomName!==t)),this.syncConfig(),this.roomList.length?s["default"].nextTick((()=>{document.querySelector(".room-list li[role='menuitem']")?.click()})):this.onSelect(null)})).catch((()=>{}))},handleClose(t){this.$confirm("Are you sure to close this dialog?").then((()=>{t()})).catch((()=>{}))}}},E=A,O=(0,a.Z)(E,u,p,!1,null,null,null),B=O.exports,$=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"room",staticStyle:{height:"100%",padding:"20px","box-sizing":"border-box",overflow:"auto"}},[o("div",{staticStyle:{position:"relative"}},[t.room?o("span",{staticStyle:{"font-size":"30px","font-weight":"bold"},attrs:{title:t.roomHash}},[t._v(t._s(t.room.roomName))]):t._e(),o("el-button",{staticStyle:{position:"absolute",right:"0",top:"0"},attrs:{type:"danger"},on:{click:t.showPassword}},[t._v("Show Password")])],1),o("file-upload",{ref:"uspload",staticClass:"btn btn-primary",attrs:{"post-action":"/upload/post",multiple:!0,drop:!0,"drop-directory":!0,value:t.files},on:{input:t.onFiles}},[o("el-button",{attrs:{type:"primary"}},[o("i",{staticClass:"el-icon-upload"}),t._v(" Upload")])],1),o("div",[o("el-table",{staticStyle:{width:"100%"},attrs:{data:t.files}},[o("el-table-column",{attrs:{prop:"name",label:"Name",width:"280"},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.row,i=s.name,n=s.hash;return[o("div",[o("div",{attrs:{title:n}},[t._v(t._s(i))]),t.imageBlobMap[i]?o("img",{attrs:{src:t.imageBlobMap[i],alt:""}}):t._e()])]}}])}),o("el-table-column",{attrs:{prop:"size",label:"Size",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.row.size;return[o("span",[t._v(t._s(t.filesize(s)))])]}}])})],1),o("el-table",{staticStyle:{width:"100%"},attrs:{data:t.othersTable}},[o("el-table-column",{attrs:{prop:"name",label:"Name",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.row,i=s.name,n=s.hash;return[o("div",[o("div",{attrs:{title:n}},[t._v(t._s(i))]),t.imageBlobMap[i]?o("img",{staticStyle:{"max-width":"100%","max-height":"200px"},attrs:{src:t.imageBlobMap[i],alt:""}}):t._e()])]}}])}),o("el-table-column",{attrs:{prop:"size",label:"Size",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.row.size;return[o("span",[t._v(t._s(t.filesize(s)))])]}}])}),o("el-table-column",{attrs:{prop:"id",label:"From",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.row.id;return[o("span",{attrs:{title:s}},[t._v(t._s(s.slice(0,10)))])]}}])}),o("el-table-column",{attrs:{label:"Action",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.row;return[o("div",[t.progressMap[s.name]?t._e():o("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.startDownload(s)}}},[o("i",{staticClass:"el-icon-download"}),t._v(" Download")]),!t.progressMap[s.name]&&t.isText(s.name)?o("el-button",{staticStyle:{"margin-top":"10px"},attrs:{type:"warning"},on:{click:function(e){return t.startPreview(s)}}},[o("i",{staticClass:"el-icon-download"}),t._v(" Preview")]):t._e(),t.progressMap[s.name]?o("el-button",[t._v(t._s(t._f("percentage")(t.progressMap[s.name])))]):t._e()],1)]}}])})],1)],1),o("el-dialog",{attrs:{title:"Tips",visible:t.showPasswordDialogVisible,width:"30%"},on:{"update:visible":function(e){t.showPasswordDialogVisible=e}}},[t.room?o("span",[t._v(t._s(t.room.roomPassword))]):t._e(),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(e){t.showPasswordDialogVisible=!1}}},[t._v("Cancel")]),o("el-button",{attrs:{type:"primary"},on:{click:t.copyPassword}},[t._v("Copy")])],1)]),o("el-dialog",{attrs:{title:"Paste Image",visible:t.showPasteImageVisible,width:"30%","close-on-click-modal":!1},on:{"update:visible":function(e){t.showPasteImageVisible=e}}},[o("span",{staticStyle:{display:"inline-block","margin-bottom":"15px"}},[t._v("Input the file name of your Image")]),o("el-input",{staticStyle:{"margin-bottom":"15px"},attrs:{placeholder:"Please input file name"},model:{value:t.pastedItemName,callback:function(e){t.pastedItemName=e},expression:"pastedItemName"}}),o("el-button",{attrs:{type:"success"},on:{click:t.generateFileName}},[t._v("Generate")]),o("img",{staticStyle:{"max-width":"100%","max-height":"100%",display:"block",margin:"auto"},attrs:{src:t.pastedItem}}),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:t.cancelPaste}},[t._v("Cancel")]),o("el-button",{attrs:{type:"primary",disabled:!Boolean(t.pastedItemName)},on:{click:t.confirmPaste}},[t._v("Confirm")])],1)],1),o("el-dialog",{attrs:{title:"Paste Text",visible:t.showPasteTextVisible,width:"30%","close-on-click-modal":!1},on:{"update:visible":function(e){t.showPasteTextVisible=e},close:t.cancelPaste}},[o("span",{staticStyle:{display:"inline-block","margin-bottom":"15px"}},[t._v("Input the file name of your text")]),o("el-input",{staticStyle:{"margin-bottom":"15px"},attrs:{placeholder:"Please input file name"},model:{value:t.pastedItemName,callback:function(e){t.pastedItemName=e},expression:"pastedItemName"}}),o("el-button",{attrs:{type:"success"},on:{click:t.generateFileName}},[t._v("Generate")]),o("div",[t._v(" "+t._s(t.pastedItem)+" ")]),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:t.cancelPaste}},[t._v("Cancel")]),o("el-button",{attrs:{type:"primary",disabled:!Boolean(t.pastedItemName)},on:{click:t.confirmPaste}},[t._v("Confirm")])],1)],1),o("el-dialog",{attrs:{title:"Preview "+t.previewingTextFileName,visible:t.showTextPreview,width:"30%"},on:{"update:visible":function(e){t.showTextPreview=e},close:t.closeTextPreview}},[o("div",[o("textarea",{attrs:{cols:"30",rows:"10",readonly:""},domProps:{value:t.previewingText}})]),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{attrs:{type:"primary"},on:{click:t.copyPreviewingText}},[t._v("Copy")]),o("el-button",{attrs:{type:"default"},on:{click:function(e){t.showTextPreview=!1}}},[t._v("Confirm")])],1)])],1)},M=[],R=o(5322),K=o.n(R),L=o(6414),D=o.n(L),V=o(4665);const F={jpg:!0,jpeg:!0,webp:!0,png:!0,gif:!0},H={txt:!0};function j(t){return t.includes(".")?t.split(".").pop():""}function z(t){const e=j(t);return!(!e||!F[e])}function J(t){const e=j(t);return!(!e||!H[e])}function G(t){const e=t?.split(".")?.[1];if(!e)return"";let o="";return"jpg"===e&&(o="jpeg"),"png"!==e&&"gif"!==e&&"jpeg"!==e||(o=e),o}var U=s["default"].extend({name:"RoomComp",props:{room:Object,othersInfo:Array},data(){return{previewingTextFileName:"",showTextPreview:!1,previewingText:"",showPasteTextVisible:!1,pastedBlob:null,pastedItem:"",showPasteImageVisible:!1,imageBlobMap:{},othersTable:[],files:[],showPasswordDialogVisible:!1,progressMap:{},pastedItemName:"",imageSuffixMap:{jpg:!0,jpeg:!0,webp:!0,png:!0,gif:!0}}},mounted(){document.onpaste=t=>{const e=this.checkDialogExist();if(e)return;const o=t.clipboardData.items,s=t.clipboardData.getData("Text");if(s)return this.pastedItem=s,this.showPasteTextVisible=!0,void(this.pastedBlob=new Blob([s]));if(o.length)for(const i in o){const t=o[i];if("file"===t.kind){const e=t.getAsFile();this.pastedBlob=e;const o=new FileReader;o.onload=t=>{this.pastedItem=t.target.result,this.showPasteImageVisible=!0},o.readAsDataURL(e)}}}},computed:{roomHash(){return this.room?v(this.room.roomPassword,T.roomSalt):""}},methods:{isImage:z,isText:J,...(0,V.nv)(["safeRequest","download"]),checkDialogExist(){let t=!1;return document.querySelectorAll(".el-dialog__wrapper").forEach((e=>{"none"!==e?.style.display&&(t=!0)})),t},closeTextPreview(){this.previewingTextFileName=""},copyPreviewingText(){navigator.clipboard.writeText(this.previewingText)},generateFileName(){const t=Math.floor(1e6*Math.random());this.pastedItemName=String(t)},cancelPaste(){this.pastedItem="",this.pastedItemName="",this.showPasteTextVisible=!1,this.showPasteImageVisible=!1},confirmPaste(){if(this.showPasteImageVisible){const t=this.pastedItem,e=t.slice(0,20).match(/\/(\w+)/)?.[1]||"",o=new File([this.pastedBlob],`${this.pastedItemName}.${e}`,{type:`image/${G(`a.${e}`)}`,lastModified:Date.now()});this.$refs.uspload.add(o),this.cancelPaste()}else if(this.showPasteTextVisible){const t=new File([this.pastedBlob],`${this.pastedItemName}.txt`,{type:"text/plain",lastModified:Date.now()});this.$refs.uspload.add(t),this.cancelPaste()}},async startPreview(t){if(this.previewingTextFileName)return;this.previewingTextFileName=t.name;const e=await this.fetchBlob(t);if(this.isText(t.name)){const t=await e.text();this.previewingText=t,this.showTextPreview=!0}},async fetchBlob(t){this.$set(this.progressMap,t.name,1e-6);const e=await this.download({roomHash:this.roomHash,roomPassword:this.room.roomPassword,fileName:t.name,fileSize:t.size,from:t.id,onProgress:e=>{this.$set(this.progressMap,t.name,e),console.log("on",e)}});return this.$delete(this.progressMap,t.name),e},async startDownload(t){const e=await this.fetchBlob(t);if(this.isImage(t.name)){const o=new FileReader;o.addEventListener("loadend",(()=>{const e=o.result;this.$set(this.imageBlobMap,t.name,e)})),e instanceof Blob&&o.readAsDataURL(e)}else this.downloadBlob(e,t.name)},downloadBlob(t,e="file.txt"){const o=window.URL.createObjectURL(t),s=document.createElement("a");s.href=o,s.download=e,s.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})),setTimeout((()=>{window.URL.revokeObjectURL(o),s.remove()}),100)},setFiles(t){this.files=t},onFiles(t){const e={};this.files=t.map((t=>(t.hash||(t.hash=v(t.name,T.fileSalt)),t))).filter((({name:t})=>e[t]?(this.$message.error("found duplicated file name "+t),!1):(e[t]=!0,!0))),this.$emit("filesChange",this.files)},showPassword(){this.showPasswordDialogVisible=!0},copyPassword(){navigator.clipboard.writeText(this.room.roomPassword),this.showPasswordDialogVisible=!1},filesize:K()},watch:{othersInfo:{immediate:!0,handler(t){t||(this.othersTable=[]),this.othersTable=t.reduce(((t,e)=>{if(e.room.files){const o=JSON.parse(y(e.room.files,this.room.roomPassword));o.forEach((o=>{t.push(Object.assign({progress:0},o,{id:e.id}))}))}return t}),[])}}},components:{FileUpload:D()}}),Z=U,q=(0,a.Z)(Z,$,M,!1,null,null,null),Q=q.exports,W=o(4102),X=o(6166),Y=o.n(X);function tt({method:t,data:e,headers:o,responseType:s}){const i=T.origin;return Y()({method:"POST",url:`${i}/${t}`,headers:o,data:e,responseType:s}).then((t=>t.data))}var et=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},ot=[function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("h2",[t._v("Click Add button to start")])])}],st=s["default"].extend({name:"HomeGuide",components:{}}),it=st,nt=(0,a.Z)(it,et,ot,!1,null,null,null),at=nt.exports,rt=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticStyle:{padding:"20px"}},[o("el-form",{ref:"form",attrs:{model:t.form,"label-width":"120px"}},[o("el-form-item",{attrs:{label:"Server Origin"}},[o("el-input",{model:{value:t.form.origin,callback:function(e){t.$set(t.form,"origin",e)},expression:"form.origin"}})],1)],1),o("el-button",{attrs:{type:"primary"},on:{click:t.onSubmit}},[t._v("Save")])],1)},lt=[],ct=s["default"].extend({name:"HomeSettings",mounted(){this.form=JSON.parse(JSON.stringify(T))},methods:{onSubmit(){console.log(this.form),N(this.form)}},data(){return{form:{origin:""}}},components:{}}),ht=ct,mt=(0,a.Z)(ht,rt,lt,!1,null,null,null),dt=mt.exports,ut={name:"HomeView",data(){return{showingTab:"guide",processingChunk:!1,intervalList:[],id:"HomeView",room:null,othersInfo:[],AESKey:""}},created(){this.roomsInfo={};const t=new W.Z;t.setPublicKey(T.pubicKey),this.encrypt=t,this.AESKey=this.generateAESKey(),this.$store.commit("setAESKey",this.AESKey),this.id=v(this.AESKey,T.aesSalt),this.$store.commit("setID",this.id),this.encryptedBasic=this.encrypt.encrypt(JSON.stringify({AESKey:this.AESKey})),window.onbeforeunload=()=>{this.exit()}},destroyed(){console.log(1),this.exit(),this.intervalList.forEach((t=>{clearInterval(t)})),this.intervalList=[]},mounted(){this.ping();const t=setInterval((()=>{this.ping()}),9e3);setTimeout((()=>{this.getRoomInfo()}),500);const e=setInterval((()=>{this.getRoomInfo()}),3e3);this.intervalList.push(t),this.intervalList.push(e)},methods:{...(0,V.OI)(["getAESKey"]),...(0,V.nv)(["safeRequest"]),onSettings(){this.showingTab="settings"},exit(){tt({method:"exit",data:{id:this.id,d:b(JSON.stringify({}),this.AESKey)}})},generateAESKey(){return String(Math.random())+String(Date.now())},async onWaitChunkMap(t){if(!this.processingChunk){this.processingChunk=!0;try{let e,o={roomHash:"",fileHash:""};for(const i in t){const[t,s]=i.split("-");if(this.roomsInfo[t]&&(e=this.roomsInfo[t].files.find((t=>t.hash===s)),e)){o={roomHash:t,fileHash:s};break}}const s=o.roomHash+"-"+o.fileHash;if(e){const i=t[s],n=await this.pushChunk({position:i[0].position,size:i[0].size,file:e.file,roomHash:o.roomHash,fileHash:o.fileHash});n.waitChunkMap&&setTimeout((()=>{this.onWaitChunkMap(n.waitChunkMap)}))}}finally{this.processingChunk=!1}}},async pushChunk({position:t,size:e,file:o,roomHash:s,fileHash:i}){const n=this.roomsInfo[s].roomPassword,a=new FormData,r=o.slice(t,t+e),l=await S(r,n);console.log("encryptedBlob",l),a.append("blob",l),a.append("id",this.id),a.append("d",b(JSON.stringify({position:t,size:e,roomHash:s,fileHash:i}),this.AESKey));const c=await tt({method:"push",headers:{"Content-Type":"multipart/form-data"},data:a}),h=this.decryptRet(c);return h},decryptRet(t){return"OK"===t?{}:JSON.parse(y(t,this.$store.getters.AESKey))},async getRoomInfo(){if(!this.room)return;let t=await this.safeRequest({method:"getRoomInfo",data:{roomHash:this.room.hash}});t=JSON.parse(t),t.waitChunkMap&&this.onWaitChunkMap(t.waitChunkMap),this.othersInfo=t.others},ping(){const t={};for(const e in this.roomsInfo)t[e]={},t[e].files=this.roomsInfo[e].encryptedFiles;tt({method:"ping",data:{e:this.encryptedBasic,i:b(JSON.stringify(t),this.AESKey)}})},onRoomList(t){t?.forEach((t=>{const e=v(t.roomPassword,T.roomSalt);this.roomsInfo[e]||(this.roomsInfo[e]={})})),this.ping()},onFilesChange(t,e){const o=t?.map((t=>({size:t.size,name:t.name})));this.roomsInfo[e.hash].files=t,this.roomsInfo[e.hash].roomPassword=e.roomPassword,this.roomsInfo[e.hash].encryptedFiles=b(JSON.stringify(o),e.roomPassword),this.ping()},onSelect(t){t||"settings"===this.showingTab||(this.showingTab="guide"),t&&(this.showingTab="room"),console.log("room",t),this.room=t,s["default"].nextTick((()=>{this.room&&this.$refs.room.setFiles(this.roomsInfo[t.hash].files),this.othersInfo=[],this.room&&this.getRoomInfo()}))}},components:{RoomList:B,Room:Q,Guide:at,Settings:dt}},pt=ut,ft=(0,a.Z)(pt,m,d,!1,null,null,null),gt=ft.exports;s["default"].use(h.Z);const wt=[{path:"/",name:"home",component:gt}],bt=new h.Z({routes:wt});var yt=bt,vt=o(4549),St=o.n(vt);function xt(t,e,o){let s=0;const i={};let n=0;return new Promise(((a,r)=>{const l=[];function c(){if(e(s))return;if(n>o)return;const h=t(s),m=s;i[m]=!0,s++,n++,h.then((t=>{l[m]=t,delete i[m],n--,c(),0===n&&a(l)})).catch((function(t){console.log(t),r(t)})),c()}c()}))}s["default"].use(V.ZP);const _t=new V.ZP.Store({state:{AESKey:"",id:""},mutations:{setID(t,e){t.id=e},setAESKey(t,e){t.AESKey=e},getAESKey(t){return t.AESKey}},getters:{AESKey(t){return t.AESKey}},actions:{incrementAsync({commit:t}){setTimeout((()=>{t("increment")}),1e3)},async safeRequest({state:t},{method:e,data:o}){const s=await tt({method:e,data:{id:t.id,d:o?b(JSON.stringify(o),t.AESKey):void 0}});return y(s,t.AESKey)},async download({state:t},{roomHash:e,roomPassword:o,fileName:s,fileSize:i,from:n,onProgress:a}){const r=7e5,l=i%r,c=Math.floor(i/r)+(l?1:0);console.log(i,c,l);const h=[];a(0);let m,d=0;return await xt((async i=>{const m=await tt({responseType:"blob",method:"chunk",data:{id:t.id,d:b(JSON.stringify({roomHash:e,id:n,position:i*r,size:l&&i===c-1?l:r,fileHash:v(s,T.fileSalt)}),t.AESKey)}});h[i]=await x(m,o),d++,a(d/c)}),(t=>t>=c),5),m=z(s)?new Blob(h,{type:"image/"+G(s)}):new Blob(h),m}}});var Pt=_t;s["default"].use(St()),s["default"].config.productionTip=!1,s["default"].filter("percentage",(function(t){return t||(t=0),Math.floor(100*t)+"%"})),new s["default"]({router:yt,store:Pt,render:t=>t(c)}).$mount("#app")},2480:function(){}},e={};function o(s){var i=e[s];if(void 0!==i)return i.exports;var n=e[s]={exports:{}};return t[s].call(n.exports,n,n.exports,o),n.exports}o.m=t,function(){var t=[];o.O=function(e,s,i,n){if(!s){var a=1/0;for(h=0;h<t.length;h++){s=t[h][0],i=t[h][1],n=t[h][2];for(var r=!0,l=0;l<s.length;l++)(!1&n||a>=n)&&Object.keys(o.O).every((function(t){return o.O[t](s[l])}))?s.splice(l--,1):(r=!1,n<a&&(a=n));if(r){t.splice(h--,1);var c=i();void 0!==c&&(e=c)}}return e}n=n||0;for(var h=t.length;h>0&&t[h-1][2]>n;h--)t[h]=t[h-1];t[h]=[s,i,n]}}(),function(){o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,{a:e}),e}}(),function(){o.d=function(t,e){for(var s in e)o.o(e,s)&&!o.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})}}(),function(){o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){var t={143:0};o.O.j=function(e){return 0===t[e]};var e=function(e,s){var i,n,a=s[0],r=s[1],l=s[2],c=0;if(a.some((function(e){return 0!==t[e]}))){for(i in r)o.o(r,i)&&(o.m[i]=r[i]);if(l)var h=l(o)}for(e&&e(s);c<a.length;c++)n=a[c],o.o(t,n)&&t[n]&&t[n][0](),t[n]=0;return o.O(h)},s=self["webpackChunkb2b_exchange"]=self["webpackChunkb2b_exchange"]||[];s.forEach(e.bind(null,0)),s.push=e.bind(null,s.push.bind(s))}();var s=o.O(void 0,[998],(function(){return o(2436)}));s=o.O(s)})();
//# sourceMappingURL=app.2ca87d46.js.map
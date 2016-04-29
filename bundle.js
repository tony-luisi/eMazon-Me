(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";function Accepts(t){return this instanceof Accepts?(this.headers=t.headers,void(this.negotiator=new Negotiator(t))):new Accepts(t)}function extToMime(t){return-1===t.indexOf("/")?mime.lookup(t):t}function validMime(t){return"string"==typeof t}var Negotiator=require("negotiator"),mime=require("mime-types");module.exports=Accepts,Accepts.prototype.type=Accepts.prototype.types=function(t){var e=t;if(e&&!Array.isArray(e)){e=new Array(arguments.length);for(var r=0;r<e.length;r++)e[r]=arguments[r]}if(!e||0===e.length)return this.negotiator.mediaTypes();if(!this.headers.accept)return e[0];var n=e.map(extToMime),o=this.negotiator.mediaTypes(n.filter(validMime)),i=o[0];return i?e[n.indexOf(i)]:!1},Accepts.prototype.encoding=Accepts.prototype.encodings=function(t){var e=t;if(e&&!Array.isArray(e)){e=new Array(arguments.length);for(var r=0;r<e.length;r++)e[r]=arguments[r]}return e&&0!==e.length?this.negotiator.encodings(e)[0]||!1:this.negotiator.encodings()},Accepts.prototype.charset=Accepts.prototype.charsets=function(t){var e=t;if(e&&!Array.isArray(e)){e=new Array(arguments.length);for(var r=0;r<e.length;r++)e[r]=arguments[r]}return e&&0!==e.length?this.negotiator.charsets(e)[0]||!1:this.negotiator.charsets()},Accepts.prototype.lang=Accepts.prototype.langs=Accepts.prototype.language=Accepts.prototype.languages=function(t){var e=t;if(e&&!Array.isArray(e)){e=new Array(arguments.length);for(var r=0;r<e.length;r++)e[r]=arguments[r]}return e&&0!==e.length?this.negotiator.languages(e)[0]||!1:this.negotiator.languages()};

},{"mime-types":170,"negotiator":175}],2:[function(require,module,exports){
"use strict";function flattenWithDepth(t,r,e){for(var a=0;a<t.length;a++){var n=t[a];e>0&&Array.isArray(n)?flattenWithDepth(n,r,e-1):r.push(n)}return r}function flattenForever(t,r){for(var e=0;e<t.length;e++){var a=t[e];Array.isArray(a)?flattenForever(a,r):r.push(a)}return r}function arrayFlatten(t,r){return null==r?flattenForever(t,[]):flattenWithDepth(t,[],r)}module.exports=arrayFlatten;

},{}],3:[function(require,module,exports){
var asn1=exports;asn1.bignum=require("bn.js"),asn1.define=require("./asn1/api").define,asn1.base=require("./asn1/base"),asn1.constants=require("./asn1/constants"),asn1.decoders=require("./asn1/decoders"),asn1.encoders=require("./asn1/encoders");

},{"./asn1/api":4,"./asn1/base":6,"./asn1/constants":10,"./asn1/decoders":12,"./asn1/encoders":15,"bn.js":19}],4:[function(require,module,exports){
function Entity(e,t){this.name=e,this.body=t,this.decoders={},this.encoders={}}var asn1=require("../asn1"),inherits=require("inherits"),api=exports;api.define=function(e,t){return new Entity(e,t)},Entity.prototype._createNamed=function(e){var t;try{t=require("vm").runInThisContext("(function "+this.name+"(entity) {\n  this._initNamed(entity);\n})")}catch(n){t=function(e){this._initNamed(e)}}return inherits(t,e),t.prototype._initNamed=function(t){e.call(this,t)},new t(this)},Entity.prototype._getDecoder=function(e){return e=e||"der",this.decoders.hasOwnProperty(e)||(this.decoders[e]=this._createNamed(asn1.decoders[e])),this.decoders[e]},Entity.prototype.decode=function(e,t,n){return this._getDecoder(t).decode(e,n)},Entity.prototype._getEncoder=function(e){return e=e||"der",this.encoders.hasOwnProperty(e)||(this.encoders[e]=this._createNamed(asn1.encoders[e])),this.encoders[e]},Entity.prototype.encode=function(e,t,n){return this._getEncoder(t).encode(e,n)};

},{"../asn1":3,"inherits":161,"vm":257}],5:[function(require,module,exports){
function DecoderBuffer(e,t){return Reporter.call(this,t),Buffer.isBuffer(e)?(this.base=e,this.offset=0,void(this.length=e.length)):void this.error("Input not Buffer")}function EncoderBuffer(e,t){if(Array.isArray(e))this.length=0,this.value=e.map(function(e){return e instanceof EncoderBuffer||(e=new EncoderBuffer(e,t)),this.length+=e.length,e},this);else if("number"==typeof e){if(!(e>=0&&255>=e))return t.error("non-byte EncoderBuffer value");this.value=e,this.length=1}else if("string"==typeof e)this.value=e,this.length=Buffer.byteLength(e);else{if(!Buffer.isBuffer(e))return t.error("Unsupported type: "+typeof e);this.value=e,this.length=e.length}}var inherits=require("inherits"),Reporter=require("../base").Reporter,Buffer=require("buffer").Buffer;inherits(DecoderBuffer,Reporter),exports.DecoderBuffer=DecoderBuffer,DecoderBuffer.prototype.save=function(){return{offset:this.offset,reporter:Reporter.prototype.save.call(this)}},DecoderBuffer.prototype.restore=function(e){var t=new DecoderBuffer(this.base);return t.offset=e.offset,t.length=this.offset,this.offset=e.offset,Reporter.prototype.restore.call(this,e.reporter),t},DecoderBuffer.prototype.isEmpty=function(){return this.offset===this.length},DecoderBuffer.prototype.readUInt8=function(e){return this.offset+1<=this.length?this.base.readUInt8(this.offset++,!0):this.error(e||"DecoderBuffer overrun")},DecoderBuffer.prototype.skip=function(e,t){if(!(this.offset+e<=this.length))return this.error(t||"DecoderBuffer overrun");var r=new DecoderBuffer(this.base);return r._reporterState=this._reporterState,r.offset=this.offset,r.length=this.offset+e,this.offset+=e,r},DecoderBuffer.prototype.raw=function(e){return this.base.slice(e?e.offset:this.offset,this.length)},exports.EncoderBuffer=EncoderBuffer,EncoderBuffer.prototype.join=function(e,t){return e||(e=new Buffer(this.length)),t||(t=0),0===this.length?e:(Array.isArray(this.value)?this.value.forEach(function(r){r.join(e,t),t+=r.length}):("number"==typeof this.value?e[t]=this.value:"string"==typeof this.value?e.write(this.value,t):Buffer.isBuffer(this.value)&&this.value.copy(e,t),t+=this.length),e)};

},{"../base":6,"buffer":60,"inherits":161}],6:[function(require,module,exports){
var base=exports;base.Reporter=require("./reporter").Reporter,base.DecoderBuffer=require("./buffer").DecoderBuffer,base.EncoderBuffer=require("./buffer").EncoderBuffer,base.Node=require("./node");

},{"./buffer":5,"./node":7,"./reporter":8}],7:[function(require,module,exports){
function Node(e,t){var r={};this._baseState=r,r.enc=e,r.parent=t||null,r.children=null,r.tag=null,r.args=null,r.reverseArgs=null,r.choice=null,r.optional=!1,r.any=!1,r.obj=!1,r.use=null,r.useDecoder=null,r.key=null,r["default"]=null,r.explicit=null,r.implicit=null,r.contains=null,r.parent||(r.children=[],this._wrap())}var Reporter=require("../base").Reporter,EncoderBuffer=require("../base").EncoderBuffer,DecoderBuffer=require("../base").DecoderBuffer,assert=require("minimalistic-assert"),tags=["seq","seqof","set","setof","objid","bool","gentime","utctime","null_","enum","int","bitstr","bmpstr","charstr","genstr","graphstr","ia5str","iso646str","numstr","octstr","printstr","t61str","unistr","utf8str","videostr"],methods=["key","obj","use","optional","explicit","implicit","def","choice","any","contains"].concat(tags),overrided=["_peekTag","_decodeTag","_use","_decodeStr","_decodeObjid","_decodeTime","_decodeNull","_decodeInt","_decodeBool","_decodeList","_encodeComposite","_encodeStr","_encodeObjid","_encodeTime","_encodeNull","_encodeInt","_encodeBool"];module.exports=Node;var stateProps=["enc","parent","children","tag","args","reverseArgs","choice","optional","any","obj","use","alteredUse","key","default","explicit","implicit"];Node.prototype.clone=function(){var e=this._baseState,t={};stateProps.forEach(function(r){t[r]=e[r]});var r=new this.constructor(t.parent);return r._baseState=t,r},Node.prototype._wrap=function(){var e=this._baseState;methods.forEach(function(t){this[t]=function(){var r=new this.constructor(this);return e.children.push(r),r[t].apply(r,arguments)}},this)},Node.prototype._init=function(e){var t=this._baseState;assert(null===t.parent),e.call(this),t.children=t.children.filter(function(e){return e._baseState.parent===this},this),assert.equal(t.children.length,1,"Root node can have only one child")},Node.prototype._useArgs=function(e){var t=this._baseState,r=e.filter(function(e){return e instanceof this.constructor},this);e=e.filter(function(e){return!(e instanceof this.constructor)},this),0!==r.length&&(assert(null===t.children),t.children=r,r.forEach(function(e){e._baseState.parent=this},this)),0!==e.length&&(assert(null===t.args),t.args=e,t.reverseArgs=e.map(function(e){if("object"!=typeof e||e.constructor!==Object)return e;var t={};return Object.keys(e).forEach(function(r){r==(0|r)&&(r|=0);var i=e[r];t[i]=r}),t}))},overrided.forEach(function(e){Node.prototype[e]=function(){var t=this._baseState;throw new Error(e+" not implemented for encoding: "+t.enc)}}),tags.forEach(function(e){Node.prototype[e]=function(){var t=this._baseState,r=Array.prototype.slice.call(arguments);return assert(null===t.tag),t.tag=e,this._useArgs(r),this}}),Node.prototype.use=function(e){var t=this._baseState;return assert(null===t.use),t.use=e,this},Node.prototype.optional=function(){var e=this._baseState;return e.optional=!0,this},Node.prototype.def=function(e){var t=this._baseState;return assert(null===t["default"]),t["default"]=e,t.optional=!0,this},Node.prototype.explicit=function(e){var t=this._baseState;return assert(null===t.explicit&&null===t.implicit),t.explicit=e,this},Node.prototype.implicit=function(e){var t=this._baseState;return assert(null===t.explicit&&null===t.implicit),t.implicit=e,this},Node.prototype.obj=function(){var e=this._baseState,t=Array.prototype.slice.call(arguments);return e.obj=!0,0!==t.length&&this._useArgs(t),this},Node.prototype.key=function(e){var t=this._baseState;return assert(null===t.key),t.key=e,this},Node.prototype.any=function(){var e=this._baseState;return e.any=!0,this},Node.prototype.choice=function(e){var t=this._baseState;return assert(null===t.choice),t.choice=e,this._useArgs(Object.keys(e).map(function(t){return e[t]})),this},Node.prototype.contains=function(e){var t=this._baseState;return assert(null===t.use),t.contains=e,this},Node.prototype._decode=function(e){var t=this._baseState;if(null===t.parent)return e.wrapResult(t.children[0]._decode(e));var r,i=t["default"],n=!0;if(null!==t.key&&(r=e.enterKey(t.key)),t.optional){var o=null;if(null!==t.explicit?o=t.explicit:null!==t.implicit?o=t.implicit:null!==t.tag&&(o=t.tag),null!==o||t.any){if(n=this._peekTag(e,o,t.any),e.isError(n))return n}else{var s=e.save();try{null===t.choice?this._decodeGeneric(t.tag,e):this._decodeChoice(e),n=!0}catch(a){n=!1}e.restore(s)}}var c;if(t.obj&&n&&(c=e.enterObject()),n){if(null!==t.explicit){var l=this._decodeTag(e,t.explicit);if(e.isError(l))return l;e=l}if(null===t.use&&null===t.choice){if(t.any)var s=e.save();var u=this._decodeTag(e,null!==t.implicit?t.implicit:t.tag,t.any);if(e.isError(u))return u;t.any?i=e.raw(s):e=u}if(i=t.any?i:null===t.choice?this._decodeGeneric(t.tag,e):this._decodeChoice(e),e.isError(i))return i;if(t.any||null!==t.choice||null===t.children||t.children.forEach(function(t){t._decode(e)}),t.contains&&("octstr"===t.tag||"bitstr"===t.tag)){var d=new DecoderBuffer(i);i=this._getUse(t.contains,e._reporterState.obj)._decode(d)}}return t.obj&&n&&(i=e.leaveObject(c)),null===t.key||null===i&&n!==!0||e.leaveKey(r,t.key,i),i},Node.prototype._decodeGeneric=function(e,t){var r=this._baseState;return"seq"===e||"set"===e?null:"seqof"===e||"setof"===e?this._decodeList(t,e,r.args[0]):/str$/.test(e)?this._decodeStr(t,e):"objid"===e&&r.args?this._decodeObjid(t,r.args[0],r.args[1]):"objid"===e?this._decodeObjid(t,null,null):"gentime"===e||"utctime"===e?this._decodeTime(t,e):"null_"===e?this._decodeNull(t):"bool"===e?this._decodeBool(t):"int"===e||"enum"===e?this._decodeInt(t,r.args&&r.args[0]):null!==r.use?this._getUse(r.use,t._reporterState.obj)._decode(t):t.error("unknown tag: "+e)},Node.prototype._getUse=function(e,t){var r=this._baseState;return r.useDecoder=this._use(e,t),assert(null===r.useDecoder._baseState.parent),r.useDecoder=r.useDecoder._baseState.children[0],r.implicit!==r.useDecoder._baseState.implicit&&(r.useDecoder=r.useDecoder.clone(),r.useDecoder._baseState.implicit=r.implicit),r.useDecoder},Node.prototype._decodeChoice=function(e){var t=this._baseState,r=null,i=!1;return Object.keys(t.choice).some(function(n){var o=e.save(),s=t.choice[n];try{var a=s._decode(e);if(e.isError(a))return!1;r={type:n,value:a},i=!0}catch(c){return e.restore(o),!1}return!0},this),i?r:e.error("Choice not matched")},Node.prototype._createEncoderBuffer=function(e){return new EncoderBuffer(e,this.reporter)},Node.prototype._encode=function(e,t,r){var i=this._baseState;if(null===i["default"]||i["default"]!==e){var n=this._encodeValue(e,t,r);if(void 0!==n&&!this._skipDefault(n,t,r))return n}},Node.prototype._encodeValue=function(e,t,r){var i=this._baseState;if(null===i.parent)return i.children[0]._encode(e,t||new Reporter);var n=null;if(this.reporter=t,i.optional&&void 0===e){if(null===i["default"])return;e=i["default"]}var o=null,s=!1;if(i.any)n=this._createEncoderBuffer(e);else if(i.choice)n=this._encodeChoice(e,t);else if(i.contains)o=this._getUse(i.contains,r)._encode(e,t),s=!0;else if(i.children)o=i.children.map(function(r){if("null_"===r._baseState.tag)return r._encode(null,t,e);if(null===r._baseState.key)return t.error("Child should have a key");var i=t.enterKey(r._baseState.key);if("object"!=typeof e)return t.error("Child expected, but input is not object");var n=r._encode(e[r._baseState.key],t,e);return t.leaveKey(i),n},this).filter(function(e){return e}),o=this._createEncoderBuffer(o);else if("seqof"===i.tag||"setof"===i.tag){if(!i.args||1!==i.args.length)return t.error("Too many args for : "+i.tag);if(!Array.isArray(e))return t.error("seqof/setof, but data is not Array");var a=this.clone();a._baseState.implicit=null,o=this._createEncoderBuffer(e.map(function(r){var i=this._baseState;return this._getUse(i.args[0],e)._encode(r,t)},a))}else null!==i.use?n=this._getUse(i.use,r)._encode(e,t):(o=this._encodePrimitive(i.tag,e),s=!0);var n;if(!i.any&&null===i.choice){var c=null!==i.implicit?i.implicit:i.tag,l=null===i.implicit?"universal":"context";null===c?null===i.use&&t.error("Tag could be ommited only for .use()"):null===i.use&&(n=this._encodeComposite(c,s,l,o))}return null!==i.explicit&&(n=this._encodeComposite(i.explicit,!1,"context",n)),n},Node.prototype._encodeChoice=function(e,t){var r=this._baseState,i=r.choice[e.type];return i||assert(!1,e.type+" not found in "+JSON.stringify(Object.keys(r.choice))),i._encode(e.value,t)},Node.prototype._encodePrimitive=function(e,t){var r=this._baseState;if(/str$/.test(e))return this._encodeStr(t,e);if("objid"===e&&r.args)return this._encodeObjid(t,r.reverseArgs[0],r.args[1]);if("objid"===e)return this._encodeObjid(t,null,null);if("gentime"===e||"utctime"===e)return this._encodeTime(t,e);if("null_"===e)return this._encodeNull();if("int"===e||"enum"===e)return this._encodeInt(t,r.args&&r.reverseArgs[0]);if("bool"===e)return this._encodeBool(t);throw new Error("Unsupported tag: "+e)},Node.prototype._isNumstr=function(e){return/^[0-9 ]*$/.test(e)},Node.prototype._isPrintstr=function(e){return/^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e)};

},{"../base":6,"minimalistic-assert":173}],8:[function(require,module,exports){
function Reporter(r){this._reporterState={obj:null,path:[],options:r||{},errors:[]}}function ReporterError(r,t){this.path=r,this.rethrow(t)}var inherits=require("inherits");exports.Reporter=Reporter,Reporter.prototype.isError=function(r){return r instanceof ReporterError},Reporter.prototype.save=function(){var r=this._reporterState;return{obj:r.obj,pathLen:r.path.length}},Reporter.prototype.restore=function(r){var t=this._reporterState;t.obj=r.obj,t.path=t.path.slice(0,r.pathLen)},Reporter.prototype.enterKey=function(r){return this._reporterState.path.push(r)},Reporter.prototype.leaveKey=function(r,t,e){var o=this._reporterState;o.path=o.path.slice(0,r-1),null!==o.obj&&(o.obj[t]=e)},Reporter.prototype.enterObject=function(){var r=this._reporterState,t=r.obj;return r.obj={},t},Reporter.prototype.leaveObject=function(r){var t=this._reporterState,e=t.obj;return t.obj=r,e},Reporter.prototype.error=function(r){var t,e=this._reporterState,o=r instanceof ReporterError;if(t=o?r:new ReporterError(e.path.map(function(r){return"["+JSON.stringify(r)+"]"}).join(""),r.message||r,r.stack),!e.options.partial)throw t;return o||e.errors.push(t),t},Reporter.prototype.wrapResult=function(r){var t=this._reporterState;return t.options.partial?{result:this.isError(r)?null:r,errors:t.errors}:r},inherits(ReporterError,Error),ReporterError.prototype.rethrow=function(r){return this.message=r+" at: "+(this.path||"(shallow)"),Error.captureStackTrace(this,ReporterError),this};

},{"inherits":161}],9:[function(require,module,exports){
var constants=require("../constants");exports.tagClass={0:"universal",1:"application",2:"context",3:"private"},exports.tagClassByName=constants._reverse(exports.tagClass),exports.tag={0:"end",1:"bool",2:"int",3:"bitstr",4:"octstr",5:"null_",6:"objid",7:"objDesc",8:"external",9:"real",10:"enum",11:"embed",12:"utf8str",13:"relativeOid",16:"seq",17:"set",18:"numstr",19:"printstr",20:"t61str",21:"videostr",22:"ia5str",23:"utctime",24:"gentime",25:"graphstr",26:"iso646str",27:"genstr",28:"unistr",29:"charstr",30:"bmpstr"},exports.tagByName=constants._reverse(exports.tag);

},{"../constants":10}],10:[function(require,module,exports){
var constants=exports;constants._reverse=function(r){var e={};return Object.keys(r).forEach(function(n){(0|n)==n&&(n=0|n);var t=r[n];e[t]=n}),e},constants.der=require("./der");

},{"./der":9}],11:[function(require,module,exports){
function DERDecoder(r){this.enc="der",this.name=r.name,this.entity=r,this.tree=new DERNode,this.tree._init(r.body)}function DERNode(r){base.Node.call(this,"der",r)}function derDecodeTag(r,e){var t=r.readUInt8(e);if(r.isError(t))return t;var i=der.tagClass[t>>6],o=0===(32&t);if(31===(31&t)){var n=t;for(t=0;128===(128&n);){if(n=r.readUInt8(e),r.isError(n))return n;t<<=7,t|=127&n}}else t&=31;var s=der.tag[t];return{cls:i,primitive:o,tag:t,tagStr:s}}function derDecodeLen(r,e,t){var i=r.readUInt8(t);if(r.isError(i))return i;if(!e&&128===i)return null;if(0===(128&i))return i;var o=127&i;if(o>=4)return r.error("length octect is too long");i=0;for(var n=0;o>n;n++){i<<=8;var s=r.readUInt8(t);if(r.isError(s))return s;i|=s}return i}var inherits=require("inherits"),asn1=require("../../asn1"),base=asn1.base,bignum=asn1.bignum,der=asn1.constants.der;module.exports=DERDecoder,DERDecoder.prototype.decode=function(r,e){return r instanceof base.DecoderBuffer||(r=new base.DecoderBuffer(r,e)),this.tree._decode(r,e)},inherits(DERNode,base.Node),DERNode.prototype._peekTag=function(r,e,t){if(r.isEmpty())return!1;var i=r.save(),o=derDecodeTag(r,'Failed to peek tag: "'+e+'"');return r.isError(o)?o:(r.restore(i),o.tag===e||o.tagStr===e||o.tagStr+"of"===e||t)},DERNode.prototype._decodeTag=function(r,e,t){var i=derDecodeTag(r,'Failed to decode tag of "'+e+'"');if(r.isError(i))return i;var o=derDecodeLen(r,i.primitive,'Failed to get length of "'+e+'"');if(r.isError(o))return o;if(!t&&i.tag!==e&&i.tagStr!==e&&i.tagStr+"of"!==e)return r.error('Failed to match tag: "'+e+'"');if(i.primitive||null!==o)return r.skip(o,'Failed to match body of: "'+e+'"');var n=r.save(),s=this._skipUntilEnd(r,'Failed to skip indefinite length body: "'+this.tag+'"');return r.isError(s)?s:(o=r.offset-n.offset,r.restore(n),r.skip(o,'Failed to match body of: "'+e+'"'))},DERNode.prototype._skipUntilEnd=function(r,e){for(;;){var t=derDecodeTag(r,e);if(r.isError(t))return t;var i=derDecodeLen(r,t.primitive,e);if(r.isError(i))return i;var o;if(o=t.primitive||null!==i?r.skip(i):this._skipUntilEnd(r,e),r.isError(o))return o;if("end"===t.tagStr)break}},DERNode.prototype._decodeList=function(r,e,t){for(var i=[];!r.isEmpty();){var o=this._peekTag(r,"end");if(r.isError(o))return o;var n=t.decode(r,"der");if(r.isError(n)&&o)break;i.push(n)}return i},DERNode.prototype._decodeStr=function(r,e){if("bitstr"===e){var t=r.readUInt8();return r.isError(t)?t:{unused:t,data:r.raw()}}if("bmpstr"===e){var i=r.raw();if(i.length%2===1)return r.error("Decoding of string type: bmpstr length mismatch");for(var o="",n=0;n<i.length/2;n++)o+=String.fromCharCode(i.readUInt16BE(2*n));return o}if("numstr"===e){var s=r.raw().toString("ascii");return this._isNumstr(s)?s:r.error("Decoding of string type: numstr unsupported characters")}if("octstr"===e)return r.raw();if("printstr"===e){var a=r.raw().toString("ascii");return this._isPrintstr(a)?a:r.error("Decoding of string type: printstr unsupported characters")}return/str$/.test(e)?r.raw().toString():r.error("Decoding of string type: "+e+" unsupported")},DERNode.prototype._decodeObjid=function(r,e,t){for(var i,o=[],n=0;!r.isEmpty();){var s=r.readUInt8();n<<=7,n|=127&s,0===(128&s)&&(o.push(n),n=0)}128&s&&o.push(n);var a=o[0]/40|0,d=o[0]%40;if(i=t?o:[a,d].concat(o.slice(1)),e){var u=e[i.join(" ")];void 0===u&&(u=e[i.join(".")]),void 0!==u&&(i=u)}return i},DERNode.prototype._decodeTime=function(r,e){var t=r.raw().toString();if("gentime"===e)var i=0|t.slice(0,4),o=0|t.slice(4,6),n=0|t.slice(6,8),s=0|t.slice(8,10),a=0|t.slice(10,12),d=0|t.slice(12,14);else{if("utctime"!==e)return r.error("Decoding "+e+" time is not supported yet");var i=0|t.slice(0,2),o=0|t.slice(2,4),n=0|t.slice(4,6),s=0|t.slice(6,8),a=0|t.slice(8,10),d=0|t.slice(10,12);i=70>i?2e3+i:1900+i}return Date.UTC(i,o-1,n,s,a,d,0)},DERNode.prototype._decodeNull=function(r){return null},DERNode.prototype._decodeBool=function(r){var e=r.readUInt8();return r.isError(e)?e:0!==e},DERNode.prototype._decodeInt=function(r,e){var t=r.raw(),i=new bignum(t);return e&&(i=e[i.toString(10)]||i),i},DERNode.prototype._use=function(r,e){return"function"==typeof r&&(r=r(e)),r._getDecoder("der").tree};

},{"../../asn1":3,"inherits":161}],12:[function(require,module,exports){
var decoders=exports;decoders.der=require("./der"),decoders.pem=require("./pem");

},{"./der":11,"./pem":13}],13:[function(require,module,exports){
function PEMDecoder(e){DERDecoder.call(this,e),this.enc="pem"}var inherits=require("inherits"),Buffer=require("buffer").Buffer,DERDecoder=require("./der");inherits(PEMDecoder,DERDecoder),module.exports=PEMDecoder,PEMDecoder.prototype.decode=function(e,r){for(var o=e.toString().split(/[\r\n]+/g),i=r.label.toUpperCase(),t=/^-----(BEGIN|END) ([^-]+)-----$/,c=-1,n=-1,f=0;f<o.length;f++){var a=o[f].match(t);if(null!==a&&a[2]===i){if(-1!==c){if("END"!==a[1])break;n=f;break}if("BEGIN"!==a[1])break;c=f}}if(-1===c||-1===n)throw new Error("PEM section not found for: "+i);var d=o.slice(c+1,n).join("");d.replace(/[^a-z0-9\+\/=]+/gi,"");var D=new Buffer(d,"base64");return DERDecoder.prototype.decode.call(this,D,r)};

},{"./der":11,"buffer":60,"inherits":161}],14:[function(require,module,exports){
function DEREncoder(e){this.enc="der",this.name=e.name,this.entity=e,this.tree=new DERNode,this.tree._init(e.body)}function DERNode(e){base.Node.call(this,"der",e)}function two(e){return 10>e?"0"+e:e}function encodeTag(e,r,t,n){var o;if("seqof"===e?e="seq":"setof"===e&&(e="set"),der.tagByName.hasOwnProperty(e))o=der.tagByName[e];else{if("number"!=typeof e||(0|e)!==e)return n.error("Unknown tag: "+e);o=e}return o>=31?n.error("Multi-octet tag encoding unsupported"):(r||(o|=32),o|=der.tagClassByName[t||"universal"]<<6)}var inherits=require("inherits"),Buffer=require("buffer").Buffer,asn1=require("../../asn1"),base=asn1.base,der=asn1.constants.der;module.exports=DEREncoder,DEREncoder.prototype.encode=function(e,r){return this.tree._encode(e,r).join()},inherits(DERNode,base.Node),DERNode.prototype._encodeComposite=function(e,r,t,n){var o=encodeTag(e,r,t,this.reporter);if(n.length<128){var i=new Buffer(2);return i[0]=o,i[1]=n.length,this._createEncoderBuffer([i,n])}for(var f=1,s=n.length;s>=256;s>>=8)f++;var i=new Buffer(2+f);i[0]=o,i[1]=128|f;for(var s=1+f,u=n.length;u>0;s--,u>>=8)i[s]=255&u;return this._createEncoderBuffer([i,n])},DERNode.prototype._encodeStr=function(e,r){if("bitstr"===r)return this._createEncoderBuffer([0|e.unused,e.data]);if("bmpstr"===r){for(var t=new Buffer(2*e.length),n=0;n<e.length;n++)t.writeUInt16BE(e.charCodeAt(n),2*n);return this._createEncoderBuffer(t)}return"numstr"===r?this._isNumstr(e)?this._createEncoderBuffer(e):this.reporter.error("Encoding of string type: numstr supports only digits and space"):"printstr"===r?this._isPrintstr(e)?this._createEncoderBuffer(e):this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark"):/str$/.test(r)?this._createEncoderBuffer(e):this.reporter.error("Encoding of string type: "+r+" unsupported")},DERNode.prototype._encodeObjid=function(e,r,t){if("string"==typeof e){if(!r)return this.reporter.error("string objid given, but no values map found");if(!r.hasOwnProperty(e))return this.reporter.error("objid not found in values map");e=r[e].split(/[\s\.]+/g);for(var n=0;n<e.length;n++)e[n]|=0}else if(Array.isArray(e)){e=e.slice();for(var n=0;n<e.length;n++)e[n]|=0}if(!Array.isArray(e))return this.reporter.error("objid() should be either array or string, got: "+JSON.stringify(e));if(!t){if(e[1]>=40)return this.reporter.error("Second objid identifier OOB");e.splice(0,2,40*e[0]+e[1])}for(var o=0,n=0;n<e.length;n++){var i=e[n];for(o++;i>=128;i>>=7)o++}for(var f=new Buffer(o),s=f.length-1,n=e.length-1;n>=0;n--){var i=e[n];for(f[s--]=127&i;(i>>=7)>0;)f[s--]=128|127&i}return this._createEncoderBuffer(f)},DERNode.prototype._encodeTime=function(e,r){var t,n=new Date(e);return"gentime"===r?t=[two(n.getFullYear()),two(n.getUTCMonth()+1),two(n.getUTCDate()),two(n.getUTCHours()),two(n.getUTCMinutes()),two(n.getUTCSeconds()),"Z"].join(""):"utctime"===r?t=[two(n.getFullYear()%100),two(n.getUTCMonth()+1),two(n.getUTCDate()),two(n.getUTCHours()),two(n.getUTCMinutes()),two(n.getUTCSeconds()),"Z"].join(""):this.reporter.error("Encoding "+r+" time is not supported yet"),this._encodeStr(t,"octstr")},DERNode.prototype._encodeNull=function(){return this._createEncoderBuffer("")},DERNode.prototype._encodeInt=function(e,r){if("string"==typeof e){if(!r)return this.reporter.error("String int or enum given, but no values map");if(!r.hasOwnProperty(e))return this.reporter.error("Values map doesn't contain: "+JSON.stringify(e));e=r[e]}if("number"!=typeof e&&!Buffer.isBuffer(e)){var t=e.toArray();!e.sign&&128&t[0]&&t.unshift(0),e=new Buffer(t)}if(Buffer.isBuffer(e)){var n=e.length;0===e.length&&n++;var o=new Buffer(n);return e.copy(o),0===e.length&&(o[0]=0),this._createEncoderBuffer(o)}if(128>e)return this._createEncoderBuffer(e);if(256>e)return this._createEncoderBuffer([0,e]);for(var n=1,i=e;i>=256;i>>=8)n++;for(var o=new Array(n),i=o.length-1;i>=0;i--)o[i]=255&e,e>>=8;return 128&o[0]&&o.unshift(0),this._createEncoderBuffer(new Buffer(o))},DERNode.prototype._encodeBool=function(e){return this._createEncoderBuffer(e?255:0)},DERNode.prototype._use=function(e,r){return"function"==typeof e&&(e=e(r)),e._getEncoder("der").tree},DERNode.prototype._skipDefault=function(e,r,t){var n,o=this._baseState;if(null===o["default"])return!1;var i=e.join();if(void 0===o.defaultBuffer&&(o.defaultBuffer=this._encodeValue(o["default"],r,t).join()),i.length!==o.defaultBuffer.length)return!1;for(n=0;n<i.length;n++)if(i[n]!==o.defaultBuffer[n])return!1;return!0};

},{"../../asn1":3,"buffer":60,"inherits":161}],15:[function(require,module,exports){
var encoders=exports;encoders.der=require("./der"),encoders.pem=require("./pem");

},{"./der":14,"./pem":16}],16:[function(require,module,exports){
function PEMEncoder(e){DEREncoder.call(this,e),this.enc="pem"}var inherits=require("inherits"),DEREncoder=require("./der");inherits(PEMEncoder,DEREncoder),module.exports=PEMEncoder,PEMEncoder.prototype.encode=function(e,r){for(var n=DEREncoder.prototype.encode.call(this,e),o=n.toString("base64"),E=["-----BEGIN "+r.label+"-----"],t=0;t<o.length;t+=64)E.push(o.slice(t,t+64));return E.push("-----END "+r.label+"-----"),E.join("\n")};

},{"./der":14,"inherits":161}],17:[function(require,module,exports){
function replacer(t,e){return util.isUndefined(e)?""+e:util.isNumber(e)&&!isFinite(e)?e.toString():util.isFunction(e)||util.isRegExp(e)?e.toString():e}function truncate(t,e){return util.isString(t)?t.length<e?t:t.slice(0,e):t}function getMessage(t){return truncate(JSON.stringify(t.actual,replacer),128)+" "+t.operator+" "+truncate(JSON.stringify(t.expected,replacer),128)}function fail(t,e,r,i,s){throw new assert.AssertionError({message:r,actual:t,expected:e,operator:i,stackStartFunction:s})}function ok(t,e){t||fail(t,!0,e,"==",assert.ok)}function _deepEqual(t,e){if(t===e)return!0;if(util.isBuffer(t)&&util.isBuffer(e)){if(t.length!=e.length)return!1;for(var r=0;r<t.length;r++)if(t[r]!==e[r])return!1;return!0}return util.isDate(t)&&util.isDate(e)?t.getTime()===e.getTime():util.isRegExp(t)&&util.isRegExp(e)?t.source===e.source&&t.global===e.global&&t.multiline===e.multiline&&t.lastIndex===e.lastIndex&&t.ignoreCase===e.ignoreCase:util.isObject(t)||util.isObject(e)?objEquiv(t,e):t==e}function isArguments(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function objEquiv(t,e){if(util.isNullOrUndefined(t)||util.isNullOrUndefined(e))return!1;if(t.prototype!==e.prototype)return!1;if(util.isPrimitive(t)||util.isPrimitive(e))return t===e;var r=isArguments(t),i=isArguments(e);if(r&&!i||!r&&i)return!1;if(r)return t=pSlice.call(t),e=pSlice.call(e),_deepEqual(t,e);var s,n,a=objectKeys(t),o=objectKeys(e);if(a.length!=o.length)return!1;for(a.sort(),o.sort(),n=a.length-1;n>=0;n--)if(a[n]!=o[n])return!1;for(n=a.length-1;n>=0;n--)if(s=a[n],!_deepEqual(t[s],e[s]))return!1;return!0}function expectedException(t,e){return t&&e?"[object RegExp]"==Object.prototype.toString.call(e)?e.test(t):t instanceof e?!0:e.call({},t)===!0:!1}function _throws(t,e,r,i){var s;util.isString(r)&&(i=r,r=null);try{e()}catch(n){s=n}if(i=(r&&r.name?" ("+r.name+").":".")+(i?" "+i:"."),t&&!s&&fail(s,r,"Missing expected exception"+i),!t&&expectedException(s,r)&&fail(s,r,"Got unwanted exception"+i),t&&s&&r&&!expectedException(s,r)||!t&&s)throw s}var util=require("util/"),pSlice=Array.prototype.slice,hasOwn=Object.prototype.hasOwnProperty,assert=module.exports=ok;assert.AssertionError=function(t){this.name="AssertionError",this.actual=t.actual,this.expected=t.expected,this.operator=t.operator,t.message?(this.message=t.message,this.generatedMessage=!1):(this.message=getMessage(this),this.generatedMessage=!0);var e=t.stackStartFunction||fail;if(Error.captureStackTrace)Error.captureStackTrace(this,e);else{var r=new Error;if(r.stack){var i=r.stack,s=e.name,n=i.indexOf("\n"+s);if(n>=0){var a=i.indexOf("\n",n+1);i=i.substring(a+1)}this.stack=i}}},util.inherits(assert.AssertionError,Error),assert.fail=fail,assert.ok=ok,assert.equal=function(t,e,r){t!=e&&fail(t,e,r,"==",assert.equal)},assert.notEqual=function(t,e,r){t==e&&fail(t,e,r,"!=",assert.notEqual)},assert.deepEqual=function(t,e,r){_deepEqual(t,e)||fail(t,e,r,"deepEqual",assert.deepEqual)},assert.notDeepEqual=function(t,e,r){_deepEqual(t,e)&&fail(t,e,r,"notDeepEqual",assert.notDeepEqual)},assert.strictEqual=function(t,e,r){t!==e&&fail(t,e,r,"===",assert.strictEqual)},assert.notStrictEqual=function(t,e,r){t===e&&fail(t,e,r,"!==",assert.notStrictEqual)},assert["throws"]=function(t,e,r){_throws.apply(this,[!0].concat(pSlice.call(arguments)))},assert.doesNotThrow=function(t,e){_throws.apply(this,[!1].concat(pSlice.call(arguments)))},assert.ifError=function(t){if(t)throw t};var objectKeys=Object.keys||function(t){var e=[];for(var r in t)hasOwn.call(t,r)&&e.push(r);return e};

},{"util/":254}],18:[function(require,module,exports){
"use strict";function init(){for(var o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r=0,e=o.length;e>r;++r)lookup[r]=o[r],revLookup[o.charCodeAt(r)]=r;revLookup["-".charCodeAt(0)]=62,revLookup["_".charCodeAt(0)]=63}function toByteArray(o){var r,e,t,u,n,p,a=o.length;if(a%4>0)throw new Error("Invalid string. Length must be a multiple of 4");n="="===o[a-2]?2:"="===o[a-1]?1:0,p=new Arr(3*a/4-n),t=n>0?a-4:a;var k=0;for(r=0,e=0;t>r;r+=4,e+=3)u=revLookup[o.charCodeAt(r)]<<18|revLookup[o.charCodeAt(r+1)]<<12|revLookup[o.charCodeAt(r+2)]<<6|revLookup[o.charCodeAt(r+3)],p[k++]=u>>16&255,p[k++]=u>>8&255,p[k++]=255&u;return 2===n?(u=revLookup[o.charCodeAt(r)]<<2|revLookup[o.charCodeAt(r+1)]>>4,p[k++]=255&u):1===n&&(u=revLookup[o.charCodeAt(r)]<<10|revLookup[o.charCodeAt(r+1)]<<4|revLookup[o.charCodeAt(r+2)]>>2,p[k++]=u>>8&255,p[k++]=255&u),p}function tripletToBase64(o){return lookup[o>>18&63]+lookup[o>>12&63]+lookup[o>>6&63]+lookup[63&o]}function encodeChunk(o,r,e){for(var t,u=[],n=r;e>n;n+=3)t=(o[n]<<16)+(o[n+1]<<8)+o[n+2],u.push(tripletToBase64(t));return u.join("")}function fromByteArray(o){for(var r,e=o.length,t=e%3,u="",n=[],p=16383,a=0,k=e-t;k>a;a+=p)n.push(encodeChunk(o,a,a+p>k?k:a+p));return 1===t?(r=o[e-1],u+=lookup[r>>2],u+=lookup[r<<4&63],u+="=="):2===t&&(r=(o[e-2]<<8)+o[e-1],u+=lookup[r>>10],u+=lookup[r>>4&63],u+=lookup[r<<2&63],u+="="),n.push(u),n.join("")}exports.toByteArray=toByteArray,exports.fromByteArray=fromByteArray;var lookup=[],revLookup=[],Arr="undefined"!=typeof Uint8Array?Uint8Array:Array;init();

},{}],19:[function(require,module,exports){
!function(t,i){"use strict";function r(t,i){if(!t)throw new Error(i||"Assertion failed")}function h(t,i){t.super_=i;var r=function(){};r.prototype=i.prototype,t.prototype=new r,t.prototype.constructor=t}function n(t,i,r){return n.isBN(t)?t:(this.negative=0,this.words=null,this.length=0,this.red=null,void(null!==t&&("le"!==i&&"be"!==i||(r=i,i=10),this._init(t||0,i||10,r||"be"))))}function e(t,i,r){for(var h=0,n=Math.min(t.length,r),e=i;n>e;e++){var o=t.charCodeAt(e)-48;h<<=4,h|=o>=49&&54>=o?o-49+10:o>=17&&22>=o?o-17+10:15&o}return h}function o(t,i,r,h){for(var n=0,e=Math.min(t.length,r),o=i;e>o;o++){var s=t.charCodeAt(o)-48;n*=h,n+=s>=49?s-49+10:s>=17?s-17+10:s}return n}function s(t){for(var i=new Array(t.bitLength()),r=0;r<i.length;r++){var h=r/26|0,n=r%26;i[r]=(t.words[h]&1<<n)>>>n}return i}function u(t,i,r){r.negative=i.negative^t.negative;var h=t.length+i.length|0;r.length=h,h=h-1|0;var n=0|t.words[0],e=0|i.words[0],o=n*e,s=67108863&o,u=o/67108864|0;r.words[0]=s;for(var a=1;h>a;a++){for(var l=u>>>26,m=67108863&u,f=Math.min(a,i.length-1),d=Math.max(0,a-t.length+1);f>=d;d++){var p=a-d|0;n=0|t.words[p],e=0|i.words[d],o=n*e+m,l+=o/67108864|0,m=67108863&o}r.words[a]=0|m,u=0|l}return 0!==u?r.words[a]=0|u:r.length--,r.strip()}function a(t,i,r){r.negative=i.negative^t.negative,r.length=t.length+i.length;for(var h=0,n=0,e=0;e<r.length-1;e++){var o=n;n=0;for(var s=67108863&h,u=Math.min(e,i.length-1),a=Math.max(0,e-t.length+1);u>=a;a++){var l=e-a,m=0|t.words[l],f=0|i.words[a],d=m*f,p=67108863&d;o=o+(d/67108864|0)|0,p=p+s|0,s=67108863&p,o=o+(p>>>26)|0,n+=o>>>26,o&=67108863}r.words[e]=s,h=o,o=n}return 0!==h?r.words[e]=h:r.length--,r.strip()}function l(t,i,r){var h=new m;return h.mulp(t,i,r)}function m(t,i){this.x=t,this.y=i}function f(t,i){this.name=t,this.p=new n(i,16),this.n=this.p.bitLength(),this.k=new n(1).iushln(this.n).isub(this.p),this.tmp=this._tmp()}function d(){f.call(this,"k256","ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")}function p(){f.call(this,"p224","ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")}function M(){f.call(this,"p192","ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")}function v(){f.call(this,"25519","7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")}function g(t){if("string"==typeof t){var i=n._prime(t);this.m=i.p,this.prime=i}else r(t.gtn(1),"modulus must be greater than 1"),this.m=t,this.prime=null}function c(t){g.call(this,t),this.shift=this.m.bitLength(),this.shift%26!==0&&(this.shift+=26-this.shift%26),this.r=new n(1).iushln(this.shift),this.r2=this.imod(this.r.sqr()),this.rinv=this.r._invmp(this.m),this.minv=this.rinv.mul(this.r).isubn(1).div(this.m),this.minv=this.minv.umod(this.r),this.minv=this.r.sub(this.minv)}"object"==typeof t?t.exports=n:i.BN=n,n.BN=n,n.wordSize=26;var w;try{w=require("buffer").Buffer}catch(y){}n.isBN=function(t){return null!==t&&"object"==typeof t&&"BN"===t.constructor.name&&Array.isArray(t.words)},n.max=function(t,i){return t.cmp(i)>0?t:i},n.min=function(t,i){return t.cmp(i)<0?t:i},n.prototype._init=function(t,i,h){if("number"==typeof t)return this._initNumber(t,i,h);if("object"==typeof t)return this._initArray(t,i,h);"hex"===i&&(i=16),r(i===(0|i)&&i>=2&&36>=i),t=t.toString().replace(/\s+/g,"");var n=0;"-"===t[0]&&n++,16===i?this._parseHex(t,n):this._parseBase(t,i,n),"-"===t[0]&&(this.negative=1),this.strip(),"le"===h&&this._initArray(this.toArray(),i,h)},n.prototype._initNumber=function(t,i,h){0>t&&(this.negative=1,t=-t),67108864>t?(this.words=[67108863&t],this.length=1):4503599627370496>t?(this.words=[67108863&t,t/67108864&67108863],this.length=2):(r(9007199254740992>t),this.words=[67108863&t,t/67108864&67108863,1],this.length=3),"le"===h&&this._initArray(this.toArray(),i,h)},n.prototype._initArray=function(t,i,h){if(r("number"==typeof t.length),t.length<=0)return this.words=[0],this.length=1,this;this.length=Math.ceil(t.length/3),this.words=new Array(this.length);for(var n=0;n<this.length;n++)this.words[n]=0;var e,o,s=0;if("be"===h)for(n=t.length-1,e=0;n>=0;n-=3)o=t[n]|t[n-1]<<8|t[n-2]<<16,this.words[e]|=o<<s&67108863,this.words[e+1]=o>>>26-s&67108863,s+=24,s>=26&&(s-=26,e++);else if("le"===h)for(n=0,e=0;n<t.length;n+=3)o=t[n]|t[n+1]<<8|t[n+2]<<16,this.words[e]|=o<<s&67108863,this.words[e+1]=o>>>26-s&67108863,s+=24,s>=26&&(s-=26,e++);return this.strip()},n.prototype._parseHex=function(t,i){this.length=Math.ceil((t.length-i)/6),this.words=new Array(this.length);for(var r=0;r<this.length;r++)this.words[r]=0;var h,n,o=0;for(r=t.length-6,h=0;r>=i;r-=6)n=e(t,r,r+6),this.words[h]|=n<<o&67108863,this.words[h+1]|=n>>>26-o&4194303,o+=24,o>=26&&(o-=26,h++);r+6!==i&&(n=e(t,i,r+6),this.words[h]|=n<<o&67108863,this.words[h+1]|=n>>>26-o&4194303),this.strip()},n.prototype._parseBase=function(t,i,r){this.words=[0],this.length=1;for(var h=0,n=1;67108863>=n;n*=i)h++;h--,n=n/i|0;for(var e=t.length-r,s=e%h,u=Math.min(e,e-s)+r,a=0,l=r;u>l;l+=h)a=o(t,l,l+h,i),this.imuln(n),this.words[0]+a<67108864?this.words[0]+=a:this._iaddn(a);if(0!==s){var m=1;for(a=o(t,l,t.length,i),l=0;s>l;l++)m*=i;this.imuln(m),this.words[0]+a<67108864?this.words[0]+=a:this._iaddn(a)}},n.prototype.copy=function(t){t.words=new Array(this.length);for(var i=0;i<this.length;i++)t.words[i]=this.words[i];t.length=this.length,t.negative=this.negative,t.red=this.red},n.prototype.clone=function(){var t=new n(null);return this.copy(t),t},n.prototype._expand=function(t){for(;this.length<t;)this.words[this.length++]=0;return this},n.prototype.strip=function(){for(;this.length>1&&0===this.words[this.length-1];)this.length--;return this._normSign()},n.prototype._normSign=function(){return 1===this.length&&0===this.words[0]&&(this.negative=0),this},n.prototype.inspect=function(){return(this.red?"<BN-R: ":"<BN: ")+this.toString(16)+">"};var b=["","0","00","000","0000","00000","000000","0000000","00000000","000000000","0000000000","00000000000","000000000000","0000000000000","00000000000000","000000000000000","0000000000000000","00000000000000000","000000000000000000","0000000000000000000","00000000000000000000","000000000000000000000","0000000000000000000000","00000000000000000000000","000000000000000000000000","0000000000000000000000000"],_=[0,0,25,16,12,11,10,9,8,8,7,7,7,7,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],k=[0,0,33554432,43046721,16777216,48828125,60466176,40353607,16777216,43046721,1e7,19487171,35831808,62748517,7529536,11390625,16777216,24137569,34012224,47045881,64e6,4084101,5153632,6436343,7962624,9765625,11881376,14348907,17210368,20511149,243e5,28629151,33554432,39135393,45435424,52521875,60466176];n.prototype.toString=function(t,i){t=t||10,i=0|i||1;var h;if(16===t||"hex"===t){h="";for(var n=0,e=0,o=0;o<this.length;o++){var s=this.words[o],u=(16777215&(s<<n|e)).toString(16);e=s>>>24-n&16777215,h=0!==e||o!==this.length-1?b[6-u.length]+u+h:u+h,n+=2,n>=26&&(n-=26,o--)}for(0!==e&&(h=e.toString(16)+h);h.length%i!==0;)h="0"+h;return 0!==this.negative&&(h="-"+h),h}if(t===(0|t)&&t>=2&&36>=t){var a=_[t],l=k[t];h="";var m=this.clone();for(m.negative=0;!m.isZero();){var f=m.modn(l).toString(t);m=m.idivn(l),h=m.isZero()?f+h:b[a-f.length]+f+h}for(this.isZero()&&(h="0"+h);h.length%i!==0;)h="0"+h;return 0!==this.negative&&(h="-"+h),h}r(!1,"Base should be between 2 and 36")},n.prototype.toNumber=function(){var t=this.words[0];return 2===this.length?t+=67108864*this.words[1]:3===this.length&&1===this.words[2]?t+=4503599627370496+67108864*this.words[1]:this.length>2&&r(!1,"Number can only safely store up to 53 bits"),0!==this.negative?-t:t},n.prototype.toJSON=function(){return this.toString(16)},n.prototype.toBuffer=function(t,i){return r("undefined"!=typeof w),this.toArrayLike(w,t,i)},n.prototype.toArray=function(t,i){return this.toArrayLike(Array,t,i)},n.prototype.toArrayLike=function(t,i,h){var n=this.byteLength(),e=h||Math.max(1,n);r(e>=n,"byte array longer than desired length"),r(e>0,"Requested array length <= 0"),this.strip();var o,s,u="le"===i,a=new t(e),l=this.clone();if(u){for(s=0;!l.isZero();s++)o=l.andln(255),l.iushrn(8),a[s]=o;for(;e>s;s++)a[s]=0}else{for(s=0;e-n>s;s++)a[s]=0;for(s=0;!l.isZero();s++)o=l.andln(255),l.iushrn(8),a[e-s-1]=o}return a},Math.clz32?n.prototype._countBits=function(t){return 32-Math.clz32(t)}:n.prototype._countBits=function(t){var i=t,r=0;return i>=4096&&(r+=13,i>>>=13),i>=64&&(r+=7,i>>>=7),i>=8&&(r+=4,i>>>=4),i>=2&&(r+=2,i>>>=2),r+i},n.prototype._zeroBits=function(t){if(0===t)return 26;var i=t,r=0;return 0===(8191&i)&&(r+=13,i>>>=13),0===(127&i)&&(r+=7,i>>>=7),0===(15&i)&&(r+=4,i>>>=4),0===(3&i)&&(r+=2,i>>>=2),0===(1&i)&&r++,r},n.prototype.bitLength=function(){var t=this.words[this.length-1],i=this._countBits(t);return 26*(this.length-1)+i},n.prototype.zeroBits=function(){if(this.isZero())return 0;for(var t=0,i=0;i<this.length;i++){var r=this._zeroBits(this.words[i]);if(t+=r,26!==r)break}return t},n.prototype.byteLength=function(){return Math.ceil(this.bitLength()/8)},n.prototype.toTwos=function(t){return 0!==this.negative?this.abs().inotn(t).iaddn(1):this.clone()},n.prototype.fromTwos=function(t){return this.testn(t-1)?this.notn(t).iaddn(1).ineg():this.clone()},n.prototype.isNeg=function(){return 0!==this.negative},n.prototype.neg=function(){return this.clone().ineg()},n.prototype.ineg=function(){return this.isZero()||(this.negative^=1),this},n.prototype.iuor=function(t){for(;this.length<t.length;)this.words[this.length++]=0;for(var i=0;i<t.length;i++)this.words[i]=this.words[i]|t.words[i];return this.strip()},n.prototype.ior=function(t){return r(0===(this.negative|t.negative)),this.iuor(t)},n.prototype.or=function(t){return this.length>t.length?this.clone().ior(t):t.clone().ior(this)},n.prototype.uor=function(t){return this.length>t.length?this.clone().iuor(t):t.clone().iuor(this)},n.prototype.iuand=function(t){var i;i=this.length>t.length?t:this;for(var r=0;r<i.length;r++)this.words[r]=this.words[r]&t.words[r];return this.length=i.length,this.strip()},n.prototype.iand=function(t){return r(0===(this.negative|t.negative)),this.iuand(t)},n.prototype.and=function(t){return this.length>t.length?this.clone().iand(t):t.clone().iand(this)},n.prototype.uand=function(t){return this.length>t.length?this.clone().iuand(t):t.clone().iuand(this)},n.prototype.iuxor=function(t){var i,r;this.length>t.length?(i=this,r=t):(i=t,r=this);for(var h=0;h<r.length;h++)this.words[h]=i.words[h]^r.words[h];if(this!==i)for(;h<i.length;h++)this.words[h]=i.words[h];return this.length=i.length,this.strip()},n.prototype.ixor=function(t){return r(0===(this.negative|t.negative)),this.iuxor(t)},n.prototype.xor=function(t){return this.length>t.length?this.clone().ixor(t):t.clone().ixor(this)},n.prototype.uxor=function(t){return this.length>t.length?this.clone().iuxor(t):t.clone().iuxor(this)},n.prototype.inotn=function(t){r("number"==typeof t&&t>=0);var i=0|Math.ceil(t/26),h=t%26;this._expand(i),h>0&&i--;for(var n=0;i>n;n++)this.words[n]=67108863&~this.words[n];return h>0&&(this.words[n]=~this.words[n]&67108863>>26-h),this.strip()},n.prototype.notn=function(t){return this.clone().inotn(t)},n.prototype.setn=function(t,i){r("number"==typeof t&&t>=0);var h=t/26|0,n=t%26;return this._expand(h+1),i?this.words[h]=this.words[h]|1<<n:this.words[h]=this.words[h]&~(1<<n),this.strip()},n.prototype.iadd=function(t){var i;if(0!==this.negative&&0===t.negative)return this.negative=0,i=this.isub(t),this.negative^=1,this._normSign();if(0===this.negative&&0!==t.negative)return t.negative=0,i=this.isub(t),t.negative=1,i._normSign();var r,h;this.length>t.length?(r=this,h=t):(r=t,h=this);for(var n=0,e=0;e<h.length;e++)i=(0|r.words[e])+(0|h.words[e])+n,this.words[e]=67108863&i,n=i>>>26;for(;0!==n&&e<r.length;e++)i=(0|r.words[e])+n,this.words[e]=67108863&i,n=i>>>26;if(this.length=r.length,0!==n)this.words[this.length]=n,this.length++;else if(r!==this)for(;e<r.length;e++)this.words[e]=r.words[e];return this},n.prototype.add=function(t){var i;return 0!==t.negative&&0===this.negative?(t.negative=0,i=this.sub(t),t.negative^=1,i):0===t.negative&&0!==this.negative?(this.negative=0,i=t.sub(this),this.negative=1,i):this.length>t.length?this.clone().iadd(t):t.clone().iadd(this)},n.prototype.isub=function(t){if(0!==t.negative){t.negative=0;var i=this.iadd(t);return t.negative=1,i._normSign()}if(0!==this.negative)return this.negative=0,this.iadd(t),this.negative=1,this._normSign();var r=this.cmp(t);if(0===r)return this.negative=0,this.length=1,this.words[0]=0,this;var h,n;r>0?(h=this,n=t):(h=t,n=this);for(var e=0,o=0;o<n.length;o++)i=(0|h.words[o])-(0|n.words[o])+e,e=i>>26,this.words[o]=67108863&i;for(;0!==e&&o<h.length;o++)i=(0|h.words[o])+e,e=i>>26,this.words[o]=67108863&i;if(0===e&&o<h.length&&h!==this)for(;o<h.length;o++)this.words[o]=h.words[o];return this.length=Math.max(this.length,o),h!==this&&(this.negative=1),this.strip()},n.prototype.sub=function(t){return this.clone().isub(t)};var A=function(t,i,r){var h,n,e,o=t.words,s=i.words,u=r.words,a=0,l=0|o[0],m=8191&l,f=l>>>13,d=0|o[1],p=8191&d,M=d>>>13,v=0|o[2],g=8191&v,c=v>>>13,w=0|o[3],y=8191&w,b=w>>>13,_=0|o[4],k=8191&_,A=_>>>13,x=0|o[5],S=8191&x,Z=x>>>13,q=0|o[6],B=8191&q,R=q>>>13,N=0|o[7],L=8191&N,I=N>>>13,T=0|o[8],E=8191&T,z=T>>>13,O=0|o[9],j=8191&O,K=O>>>13,P=0|s[0],F=8191&P,C=P>>>13,D=0|s[1],H=8191&D,J=D>>>13,U=0|s[2],G=8191&U,Q=U>>>13,V=0|s[3],W=8191&V,X=V>>>13,Y=0|s[4],$=8191&Y,tt=Y>>>13,it=0|s[5],rt=8191&it,ht=it>>>13,nt=0|s[6],et=8191&nt,ot=nt>>>13,st=0|s[7],ut=8191&st,at=st>>>13,lt=0|s[8],mt=8191&lt,ft=lt>>>13,dt=0|s[9],pt=8191&dt,Mt=dt>>>13;r.negative=t.negative^i.negative,r.length=19,h=Math.imul(m,F),n=Math.imul(m,C),n+=Math.imul(f,F),e=Math.imul(f,C);var vt=a+h+((8191&n)<<13);a=e+(n>>>13)+(vt>>>26),vt&=67108863,h=Math.imul(p,F),n=Math.imul(p,C),n+=Math.imul(M,F),e=Math.imul(M,C),h+=Math.imul(m,H),n+=Math.imul(m,J),n+=Math.imul(f,H),e+=Math.imul(f,J);var gt=a+h+((8191&n)<<13);a=e+(n>>>13)+(gt>>>26),gt&=67108863,h=Math.imul(g,F),n=Math.imul(g,C),n+=Math.imul(c,F),e=Math.imul(c,C),h+=Math.imul(p,H),n+=Math.imul(p,J),n+=Math.imul(M,H),e+=Math.imul(M,J),h+=Math.imul(m,G),n+=Math.imul(m,Q),n+=Math.imul(f,G),e+=Math.imul(f,Q);var ct=a+h+((8191&n)<<13);a=e+(n>>>13)+(ct>>>26),ct&=67108863,h=Math.imul(y,F),n=Math.imul(y,C),n+=Math.imul(b,F),e=Math.imul(b,C),h+=Math.imul(g,H),n+=Math.imul(g,J),n+=Math.imul(c,H),e+=Math.imul(c,J),h+=Math.imul(p,G),n+=Math.imul(p,Q),n+=Math.imul(M,G),e+=Math.imul(M,Q),h+=Math.imul(m,W),n+=Math.imul(m,X),n+=Math.imul(f,W),e+=Math.imul(f,X);var wt=a+h+((8191&n)<<13);a=e+(n>>>13)+(wt>>>26),wt&=67108863,h=Math.imul(k,F),n=Math.imul(k,C),n+=Math.imul(A,F),e=Math.imul(A,C),h+=Math.imul(y,H),n+=Math.imul(y,J),n+=Math.imul(b,H),e+=Math.imul(b,J),h+=Math.imul(g,G),n+=Math.imul(g,Q),n+=Math.imul(c,G),e+=Math.imul(c,Q),h+=Math.imul(p,W),n+=Math.imul(p,X),n+=Math.imul(M,W),e+=Math.imul(M,X),h+=Math.imul(m,$),n+=Math.imul(m,tt),n+=Math.imul(f,$),e+=Math.imul(f,tt);var yt=a+h+((8191&n)<<13);a=e+(n>>>13)+(yt>>>26),yt&=67108863,h=Math.imul(S,F),n=Math.imul(S,C),n+=Math.imul(Z,F),e=Math.imul(Z,C),h+=Math.imul(k,H),n+=Math.imul(k,J),n+=Math.imul(A,H),e+=Math.imul(A,J),h+=Math.imul(y,G),n+=Math.imul(y,Q),n+=Math.imul(b,G),e+=Math.imul(b,Q),h+=Math.imul(g,W),n+=Math.imul(g,X),n+=Math.imul(c,W),e+=Math.imul(c,X),h+=Math.imul(p,$),n+=Math.imul(p,tt),n+=Math.imul(M,$),e+=Math.imul(M,tt),h+=Math.imul(m,rt),n+=Math.imul(m,ht),n+=Math.imul(f,rt),e+=Math.imul(f,ht);var bt=a+h+((8191&n)<<13);a=e+(n>>>13)+(bt>>>26),bt&=67108863,h=Math.imul(B,F),n=Math.imul(B,C),n+=Math.imul(R,F),e=Math.imul(R,C),h+=Math.imul(S,H),n+=Math.imul(S,J),n+=Math.imul(Z,H),e+=Math.imul(Z,J),h+=Math.imul(k,G),n+=Math.imul(k,Q),n+=Math.imul(A,G),e+=Math.imul(A,Q),h+=Math.imul(y,W),n+=Math.imul(y,X),n+=Math.imul(b,W),e+=Math.imul(b,X),h+=Math.imul(g,$),n+=Math.imul(g,tt),n+=Math.imul(c,$),e+=Math.imul(c,tt),h+=Math.imul(p,rt),n+=Math.imul(p,ht),n+=Math.imul(M,rt),e+=Math.imul(M,ht),h+=Math.imul(m,et),n+=Math.imul(m,ot),n+=Math.imul(f,et),e+=Math.imul(f,ot);var _t=a+h+((8191&n)<<13);a=e+(n>>>13)+(_t>>>26),_t&=67108863,h=Math.imul(L,F),n=Math.imul(L,C),n+=Math.imul(I,F),e=Math.imul(I,C),h+=Math.imul(B,H),n+=Math.imul(B,J),n+=Math.imul(R,H),e+=Math.imul(R,J),h+=Math.imul(S,G),n+=Math.imul(S,Q),n+=Math.imul(Z,G),e+=Math.imul(Z,Q),h+=Math.imul(k,W),n+=Math.imul(k,X),n+=Math.imul(A,W),e+=Math.imul(A,X),h+=Math.imul(y,$),n+=Math.imul(y,tt),n+=Math.imul(b,$),e+=Math.imul(b,tt),h+=Math.imul(g,rt),n+=Math.imul(g,ht),n+=Math.imul(c,rt),e+=Math.imul(c,ht),h+=Math.imul(p,et),n+=Math.imul(p,ot),n+=Math.imul(M,et),e+=Math.imul(M,ot),h+=Math.imul(m,ut),n+=Math.imul(m,at),n+=Math.imul(f,ut),e+=Math.imul(f,at);var kt=a+h+((8191&n)<<13);a=e+(n>>>13)+(kt>>>26),kt&=67108863,h=Math.imul(E,F),n=Math.imul(E,C),n+=Math.imul(z,F),e=Math.imul(z,C),h+=Math.imul(L,H),n+=Math.imul(L,J),n+=Math.imul(I,H),e+=Math.imul(I,J),h+=Math.imul(B,G),n+=Math.imul(B,Q),n+=Math.imul(R,G),e+=Math.imul(R,Q),h+=Math.imul(S,W),n+=Math.imul(S,X),n+=Math.imul(Z,W),e+=Math.imul(Z,X),h+=Math.imul(k,$),n+=Math.imul(k,tt),n+=Math.imul(A,$),e+=Math.imul(A,tt),h+=Math.imul(y,rt),n+=Math.imul(y,ht),n+=Math.imul(b,rt),e+=Math.imul(b,ht),h+=Math.imul(g,et),n+=Math.imul(g,ot),n+=Math.imul(c,et),e+=Math.imul(c,ot),h+=Math.imul(p,ut),n+=Math.imul(p,at),n+=Math.imul(M,ut),e+=Math.imul(M,at),h+=Math.imul(m,mt),n+=Math.imul(m,ft),n+=Math.imul(f,mt),e+=Math.imul(f,ft);var At=a+h+((8191&n)<<13);a=e+(n>>>13)+(At>>>26),At&=67108863,h=Math.imul(j,F),n=Math.imul(j,C),n+=Math.imul(K,F),e=Math.imul(K,C),h+=Math.imul(E,H),n+=Math.imul(E,J),n+=Math.imul(z,H),e+=Math.imul(z,J),h+=Math.imul(L,G),n+=Math.imul(L,Q),n+=Math.imul(I,G),e+=Math.imul(I,Q),h+=Math.imul(B,W),n+=Math.imul(B,X),n+=Math.imul(R,W),e+=Math.imul(R,X),h+=Math.imul(S,$),n+=Math.imul(S,tt),n+=Math.imul(Z,$),e+=Math.imul(Z,tt),h+=Math.imul(k,rt),n+=Math.imul(k,ht),n+=Math.imul(A,rt),e+=Math.imul(A,ht),h+=Math.imul(y,et),n+=Math.imul(y,ot),n+=Math.imul(b,et),e+=Math.imul(b,ot),h+=Math.imul(g,ut),n+=Math.imul(g,at),n+=Math.imul(c,ut),e+=Math.imul(c,at),h+=Math.imul(p,mt),n+=Math.imul(p,ft),n+=Math.imul(M,mt),e+=Math.imul(M,ft),h+=Math.imul(m,pt),n+=Math.imul(m,Mt),n+=Math.imul(f,pt),e+=Math.imul(f,Mt);var xt=a+h+((8191&n)<<13);a=e+(n>>>13)+(xt>>>26),xt&=67108863,h=Math.imul(j,H),n=Math.imul(j,J),n+=Math.imul(K,H),e=Math.imul(K,J),h+=Math.imul(E,G),n+=Math.imul(E,Q),n+=Math.imul(z,G),e+=Math.imul(z,Q),h+=Math.imul(L,W),n+=Math.imul(L,X),n+=Math.imul(I,W),e+=Math.imul(I,X),h+=Math.imul(B,$),n+=Math.imul(B,tt),n+=Math.imul(R,$),e+=Math.imul(R,tt),h+=Math.imul(S,rt),n+=Math.imul(S,ht),n+=Math.imul(Z,rt),e+=Math.imul(Z,ht),h+=Math.imul(k,et),n+=Math.imul(k,ot),n+=Math.imul(A,et),e+=Math.imul(A,ot),h+=Math.imul(y,ut),n+=Math.imul(y,at),n+=Math.imul(b,ut),e+=Math.imul(b,at),h+=Math.imul(g,mt),n+=Math.imul(g,ft),n+=Math.imul(c,mt),e+=Math.imul(c,ft),h+=Math.imul(p,pt),n+=Math.imul(p,Mt),n+=Math.imul(M,pt),e+=Math.imul(M,Mt);var St=a+h+((8191&n)<<13);a=e+(n>>>13)+(St>>>26),St&=67108863,h=Math.imul(j,G),n=Math.imul(j,Q),n+=Math.imul(K,G),e=Math.imul(K,Q),h+=Math.imul(E,W),n+=Math.imul(E,X),n+=Math.imul(z,W),e+=Math.imul(z,X),h+=Math.imul(L,$),n+=Math.imul(L,tt),n+=Math.imul(I,$),e+=Math.imul(I,tt),h+=Math.imul(B,rt),n+=Math.imul(B,ht),n+=Math.imul(R,rt),e+=Math.imul(R,ht),h+=Math.imul(S,et),n+=Math.imul(S,ot),n+=Math.imul(Z,et),e+=Math.imul(Z,ot),h+=Math.imul(k,ut),n+=Math.imul(k,at),n+=Math.imul(A,ut),e+=Math.imul(A,at),h+=Math.imul(y,mt),n+=Math.imul(y,ft),n+=Math.imul(b,mt),e+=Math.imul(b,ft),h+=Math.imul(g,pt),n+=Math.imul(g,Mt),n+=Math.imul(c,pt),e+=Math.imul(c,Mt);var Zt=a+h+((8191&n)<<13);a=e+(n>>>13)+(Zt>>>26),Zt&=67108863,h=Math.imul(j,W),n=Math.imul(j,X),n+=Math.imul(K,W),e=Math.imul(K,X),h+=Math.imul(E,$),n+=Math.imul(E,tt),n+=Math.imul(z,$),e+=Math.imul(z,tt),h+=Math.imul(L,rt),n+=Math.imul(L,ht),n+=Math.imul(I,rt),e+=Math.imul(I,ht),h+=Math.imul(B,et),n+=Math.imul(B,ot),n+=Math.imul(R,et),e+=Math.imul(R,ot),h+=Math.imul(S,ut),n+=Math.imul(S,at),n+=Math.imul(Z,ut),e+=Math.imul(Z,at),h+=Math.imul(k,mt),n+=Math.imul(k,ft),n+=Math.imul(A,mt),e+=Math.imul(A,ft),h+=Math.imul(y,pt),n+=Math.imul(y,Mt),n+=Math.imul(b,pt),e+=Math.imul(b,Mt);var qt=a+h+((8191&n)<<13);a=e+(n>>>13)+(qt>>>26),qt&=67108863,h=Math.imul(j,$),n=Math.imul(j,tt),n+=Math.imul(K,$),e=Math.imul(K,tt),h+=Math.imul(E,rt),n+=Math.imul(E,ht),n+=Math.imul(z,rt),e+=Math.imul(z,ht),h+=Math.imul(L,et),n+=Math.imul(L,ot),n+=Math.imul(I,et),e+=Math.imul(I,ot),h+=Math.imul(B,ut),n+=Math.imul(B,at),n+=Math.imul(R,ut),e+=Math.imul(R,at),h+=Math.imul(S,mt),n+=Math.imul(S,ft),n+=Math.imul(Z,mt),e+=Math.imul(Z,ft),h+=Math.imul(k,pt),n+=Math.imul(k,Mt),n+=Math.imul(A,pt),e+=Math.imul(A,Mt);var Bt=a+h+((8191&n)<<13);a=e+(n>>>13)+(Bt>>>26),Bt&=67108863,h=Math.imul(j,rt),n=Math.imul(j,ht),n+=Math.imul(K,rt),e=Math.imul(K,ht),h+=Math.imul(E,et),n+=Math.imul(E,ot),n+=Math.imul(z,et),e+=Math.imul(z,ot),h+=Math.imul(L,ut),n+=Math.imul(L,at),n+=Math.imul(I,ut),e+=Math.imul(I,at),h+=Math.imul(B,mt),n+=Math.imul(B,ft),n+=Math.imul(R,mt),e+=Math.imul(R,ft),h+=Math.imul(S,pt),n+=Math.imul(S,Mt),n+=Math.imul(Z,pt),e+=Math.imul(Z,Mt);var Rt=a+h+((8191&n)<<13);a=e+(n>>>13)+(Rt>>>26),Rt&=67108863,h=Math.imul(j,et),n=Math.imul(j,ot),n+=Math.imul(K,et),e=Math.imul(K,ot),h+=Math.imul(E,ut),n+=Math.imul(E,at),n+=Math.imul(z,ut),e+=Math.imul(z,at),h+=Math.imul(L,mt),n+=Math.imul(L,ft),n+=Math.imul(I,mt),e+=Math.imul(I,ft),h+=Math.imul(B,pt),n+=Math.imul(B,Mt),n+=Math.imul(R,pt),e+=Math.imul(R,Mt);var Nt=a+h+((8191&n)<<13);a=e+(n>>>13)+(Nt>>>26),Nt&=67108863,h=Math.imul(j,ut),n=Math.imul(j,at),n+=Math.imul(K,ut),e=Math.imul(K,at),h+=Math.imul(E,mt),n+=Math.imul(E,ft),n+=Math.imul(z,mt),e+=Math.imul(z,ft),h+=Math.imul(L,pt),n+=Math.imul(L,Mt),n+=Math.imul(I,pt),e+=Math.imul(I,Mt);var Lt=a+h+((8191&n)<<13);a=e+(n>>>13)+(Lt>>>26),Lt&=67108863,h=Math.imul(j,mt),n=Math.imul(j,ft),n+=Math.imul(K,mt),e=Math.imul(K,ft),h+=Math.imul(E,pt),n+=Math.imul(E,Mt),n+=Math.imul(z,pt),e+=Math.imul(z,Mt);var It=a+h+((8191&n)<<13);a=e+(n>>>13)+(It>>>26),It&=67108863,h=Math.imul(j,pt),n=Math.imul(j,Mt),n+=Math.imul(K,pt),e=Math.imul(K,Mt);var Tt=a+h+((8191&n)<<13);return a=e+(n>>>13)+(Tt>>>26),Tt&=67108863,u[0]=vt,u[1]=gt,u[2]=ct,u[3]=wt,u[4]=yt,u[5]=bt,u[6]=_t,u[7]=kt,u[8]=At,u[9]=xt,u[10]=St,u[11]=Zt,u[12]=qt,u[13]=Bt,u[14]=Rt,u[15]=Nt,u[16]=Lt,u[17]=It,u[18]=Tt,0!==a&&(u[19]=a,r.length++),r};Math.imul||(A=u),n.prototype.mulTo=function(t,i){var r,h=this.length+t.length;return r=10===this.length&&10===t.length?A(this,t,i):63>h?u(this,t,i):1024>h?a(this,t,i):l(this,t,i)},m.prototype.makeRBT=function(t){for(var i=new Array(t),r=n.prototype._countBits(t)-1,h=0;t>h;h++)i[h]=this.revBin(h,r,t);return i},m.prototype.revBin=function(t,i,r){if(0===t||t===r-1)return t;for(var h=0,n=0;i>n;n++)h|=(1&t)<<i-n-1,t>>=1;return h},m.prototype.permute=function(t,i,r,h,n,e){for(var o=0;e>o;o++)h[o]=i[t[o]],n[o]=r[t[o]]},m.prototype.transform=function(t,i,r,h,n,e){this.permute(e,t,i,r,h,n);for(var o=1;n>o;o<<=1)for(var s=o<<1,u=Math.cos(2*Math.PI/s),a=Math.sin(2*Math.PI/s),l=0;n>l;l+=s)for(var m=u,f=a,d=0;o>d;d++){var p=r[l+d],M=h[l+d],v=r[l+d+o],g=h[l+d+o],c=m*v-f*g;g=m*g+f*v,v=c,r[l+d]=p+v,h[l+d]=M+g,r[l+d+o]=p-v,h[l+d+o]=M-g,d!==s&&(c=u*m-a*f,f=u*f+a*m,m=c)}},m.prototype.guessLen13b=function(t,i){var r=1|Math.max(i,t),h=1&r,n=0;for(r=r/2|0;r;r>>>=1)n++;return 1<<n+1+h},m.prototype.conjugate=function(t,i,r){if(!(1>=r))for(var h=0;r/2>h;h++){var n=t[h];t[h]=t[r-h-1],t[r-h-1]=n,n=i[h],i[h]=-i[r-h-1],i[r-h-1]=-n}},m.prototype.normalize13b=function(t,i){for(var r=0,h=0;i/2>h;h++){var n=8192*Math.round(t[2*h+1]/i)+Math.round(t[2*h]/i)+r;t[h]=67108863&n,r=67108864>n?0:n/67108864|0}return t},m.prototype.convert13b=function(t,i,h,n){for(var e=0,o=0;i>o;o++)e+=0|t[o],h[2*o]=8191&e,e>>>=13,h[2*o+1]=8191&e,e>>>=13;for(o=2*i;n>o;++o)h[o]=0;r(0===e),r(0===(-8192&e))},m.prototype.stub=function(t){for(var i=new Array(t),r=0;t>r;r++)i[r]=0;return i},m.prototype.mulp=function(t,i,r){var h=2*this.guessLen13b(t.length,i.length),n=this.makeRBT(h),e=this.stub(h),o=new Array(h),s=new Array(h),u=new Array(h),a=new Array(h),l=new Array(h),m=new Array(h),f=r.words;f.length=h,this.convert13b(t.words,t.length,o,h),this.convert13b(i.words,i.length,a,h),this.transform(o,e,s,u,h,n),this.transform(a,e,l,m,h,n);for(var d=0;h>d;d++){var p=s[d]*l[d]-u[d]*m[d];u[d]=s[d]*m[d]+u[d]*l[d],s[d]=p}return this.conjugate(s,u,h),this.transform(s,u,f,e,h,n),this.conjugate(f,e,h),this.normalize13b(f,h),r.negative=t.negative^i.negative,r.length=t.length+i.length,r.strip()},n.prototype.mul=function(t){var i=new n(null);return i.words=new Array(this.length+t.length),this.mulTo(t,i)},n.prototype.mulf=function(t){var i=new n(null);return i.words=new Array(this.length+t.length),l(this,t,i)},n.prototype.imul=function(t){return this.clone().mulTo(t,this)},n.prototype.imuln=function(t){r("number"==typeof t),r(67108864>t);for(var i=0,h=0;h<this.length;h++){var n=(0|this.words[h])*t,e=(67108863&n)+(67108863&i);i>>=26,i+=n/67108864|0,i+=e>>>26,this.words[h]=67108863&e}return 0!==i&&(this.words[h]=i,this.length++),this},n.prototype.muln=function(t){return this.clone().imuln(t)},n.prototype.sqr=function(){return this.mul(this)},n.prototype.isqr=function(){return this.imul(this.clone())},n.prototype.pow=function(t){var i=s(t);if(0===i.length)return new n(1);for(var r=this,h=0;h<i.length&&0===i[h];h++,r=r.sqr());if(++h<i.length)for(var e=r.sqr();h<i.length;h++,e=e.sqr())0!==i[h]&&(r=r.mul(e));return r},n.prototype.iushln=function(t){r("number"==typeof t&&t>=0);var i,h=t%26,n=(t-h)/26,e=67108863>>>26-h<<26-h;if(0!==h){var o=0;for(i=0;i<this.length;i++){var s=this.words[i]&e,u=(0|this.words[i])-s<<h;this.words[i]=u|o,o=s>>>26-h}o&&(this.words[i]=o,this.length++)}if(0!==n){for(i=this.length-1;i>=0;i--)this.words[i+n]=this.words[i];for(i=0;n>i;i++)this.words[i]=0;this.length+=n}return this.strip()},n.prototype.ishln=function(t){return r(0===this.negative),this.iushln(t)},n.prototype.iushrn=function(t,i,h){r("number"==typeof t&&t>=0);var n;n=i?(i-i%26)/26:0;var e=t%26,o=Math.min((t-e)/26,this.length),s=67108863^67108863>>>e<<e,u=h;if(n-=o,n=Math.max(0,n),u){for(var a=0;o>a;a++)u.words[a]=this.words[a];u.length=o}if(0===o);else if(this.length>o)for(this.length-=o,a=0;a<this.length;a++)this.words[a]=this.words[a+o];else this.words[0]=0,this.length=1;var l=0;for(a=this.length-1;a>=0&&(0!==l||a>=n);a--){var m=0|this.words[a];this.words[a]=l<<26-e|m>>>e,l=m&s}return u&&0!==l&&(u.words[u.length++]=l),0===this.length&&(this.words[0]=0,this.length=1),this.strip()},n.prototype.ishrn=function(t,i,h){return r(0===this.negative),this.iushrn(t,i,h)},n.prototype.shln=function(t){return this.clone().ishln(t)},n.prototype.ushln=function(t){return this.clone().iushln(t)},n.prototype.shrn=function(t){return this.clone().ishrn(t)},n.prototype.ushrn=function(t){return this.clone().iushrn(t)},n.prototype.testn=function(t){r("number"==typeof t&&t>=0);var i=t%26,h=(t-i)/26,n=1<<i;if(this.length<=h)return!1;var e=this.words[h];return!!(e&n)},n.prototype.imaskn=function(t){r("number"==typeof t&&t>=0);var i=t%26,h=(t-i)/26;if(r(0===this.negative,"imaskn works only with positive numbers"),0!==i&&h++,this.length=Math.min(h,this.length),0!==i){var n=67108863^67108863>>>i<<i;this.words[this.length-1]&=n}return this.strip()},n.prototype.maskn=function(t){return this.clone().imaskn(t)},n.prototype.iaddn=function(t){return r("number"==typeof t),r(67108864>t),0>t?this.isubn(-t):0!==this.negative?1===this.length&&(0|this.words[0])<t?(this.words[0]=t-(0|this.words[0]),this.negative=0,this):(this.negative=0,this.isubn(t),this.negative=1,this):this._iaddn(t)},n.prototype._iaddn=function(t){this.words[0]+=t;for(var i=0;i<this.length&&this.words[i]>=67108864;i++)this.words[i]-=67108864,i===this.length-1?this.words[i+1]=1:this.words[i+1]++;return this.length=Math.max(this.length,i+1),this},n.prototype.isubn=function(t){if(r("number"==typeof t),r(67108864>t),0>t)return this.iaddn(-t);if(0!==this.negative)return this.negative=0,this.iaddn(t),this.negative=1,this;if(this.words[0]-=t,1===this.length&&this.words[0]<0)this.words[0]=-this.words[0],this.negative=1;else for(var i=0;i<this.length&&this.words[i]<0;i++)this.words[i]+=67108864,this.words[i+1]-=1;return this.strip()},n.prototype.addn=function(t){return this.clone().iaddn(t)},n.prototype.subn=function(t){return this.clone().isubn(t)},n.prototype.iabs=function(){return this.negative=0,this},n.prototype.abs=function(){return this.clone().iabs()},n.prototype._ishlnsubmul=function(t,i,h){var n,e=t.length+h;this._expand(e);var o,s=0;for(n=0;n<t.length;n++){o=(0|this.words[n+h])+s;var u=(0|t.words[n])*i;o-=67108863&u,s=(o>>26)-(u/67108864|0),this.words[n+h]=67108863&o}for(;n<this.length-h;n++)o=(0|this.words[n+h])+s,s=o>>26,this.words[n+h]=67108863&o;if(0===s)return this.strip();for(r(-1===s),s=0,n=0;n<this.length;n++)o=-(0|this.words[n])+s,s=o>>26,this.words[n]=67108863&o;return this.negative=1,this.strip()},n.prototype._wordDiv=function(t,i){var r=this.length-t.length,h=this.clone(),e=t,o=0|e.words[e.length-1],s=this._countBits(o);r=26-s,0!==r&&(e=e.ushln(r),h.iushln(r),o=0|e.words[e.length-1]);var u,a=h.length-e.length;if("mod"!==i){u=new n(null),u.length=a+1,u.words=new Array(u.length);for(var l=0;l<u.length;l++)u.words[l]=0}var m=h.clone()._ishlnsubmul(e,1,a);0===m.negative&&(h=m,u&&(u.words[a]=1));for(var f=a-1;f>=0;f--){var d=67108864*(0|h.words[e.length+f])+(0|h.words[e.length+f-1]);for(d=Math.min(d/o|0,67108863),h._ishlnsubmul(e,d,f);0!==h.negative;)d--,h.negative=0,h._ishlnsubmul(e,1,f),h.isZero()||(h.negative^=1);u&&(u.words[f]=d)}return u&&u.strip(),h.strip(),"div"!==i&&0!==r&&h.iushrn(r),{div:u||null,mod:h}},n.prototype.divmod=function(t,i,h){if(r(!t.isZero()),this.isZero())return{div:new n(0),mod:new n(0)};var e,o,s;return 0!==this.negative&&0===t.negative?(s=this.neg().divmod(t,i),"mod"!==i&&(e=s.div.neg()),"div"!==i&&(o=s.mod.neg(),h&&0!==o.negative&&o.iadd(t)),{div:e,mod:o}):0===this.negative&&0!==t.negative?(s=this.divmod(t.neg(),i),"mod"!==i&&(e=s.div.neg()),{div:e,mod:s.mod}):0!==(this.negative&t.negative)?(s=this.neg().divmod(t.neg(),i),"div"!==i&&(o=s.mod.neg(),h&&0!==o.negative&&o.isub(t)),{div:s.div,mod:o}):t.length>this.length||this.cmp(t)<0?{div:new n(0),mod:this}:1===t.length?"div"===i?{div:this.divn(t.words[0]),mod:null}:"mod"===i?{div:null,mod:new n(this.modn(t.words[0]))}:{div:this.divn(t.words[0]),mod:new n(this.modn(t.words[0]))}:this._wordDiv(t,i)},n.prototype.div=function(t){return this.divmod(t,"div",!1).div},n.prototype.mod=function(t){return this.divmod(t,"mod",!1).mod},n.prototype.umod=function(t){return this.divmod(t,"mod",!0).mod},n.prototype.divRound=function(t){var i=this.divmod(t);if(i.mod.isZero())return i.div;var r=0!==i.div.negative?i.mod.isub(t):i.mod,h=t.ushrn(1),n=t.andln(1),e=r.cmp(h);return 0>e||1===n&&0===e?i.div:0!==i.div.negative?i.div.isubn(1):i.div.iaddn(1)},n.prototype.modn=function(t){r(67108863>=t);for(var i=(1<<26)%t,h=0,n=this.length-1;n>=0;n--)h=(i*h+(0|this.words[n]))%t;return h},n.prototype.idivn=function(t){r(67108863>=t);for(var i=0,h=this.length-1;h>=0;h--){var n=(0|this.words[h])+67108864*i;this.words[h]=n/t|0,i=n%t}return this.strip()},n.prototype.divn=function(t){return this.clone().idivn(t)},n.prototype.egcd=function(t){r(0===t.negative),r(!t.isZero());var i=this,h=t.clone();i=0!==i.negative?i.umod(t):i.clone();for(var e=new n(1),o=new n(0),s=new n(0),u=new n(1),a=0;i.isEven()&&h.isEven();)i.iushrn(1),h.iushrn(1),++a;for(var l=h.clone(),m=i.clone();!i.isZero();){for(var f=0,d=1;0===(i.words[0]&d)&&26>f;++f,d<<=1);if(f>0)for(i.iushrn(f);f-- >0;)(e.isOdd()||o.isOdd())&&(e.iadd(l),o.isub(m)),e.iushrn(1),o.iushrn(1);for(var p=0,M=1;0===(h.words[0]&M)&&26>p;++p,M<<=1);if(p>0)for(h.iushrn(p);p-- >0;)(s.isOdd()||u.isOdd())&&(s.iadd(l),u.isub(m)),s.iushrn(1),u.iushrn(1);i.cmp(h)>=0?(i.isub(h),e.isub(s),o.isub(u)):(h.isub(i),s.isub(e),u.isub(o))}return{a:s,b:u,gcd:h.iushln(a)}},n.prototype._invmp=function(t){r(0===t.negative),r(!t.isZero());var i=this,h=t.clone();i=0!==i.negative?i.umod(t):i.clone();for(var e=new n(1),o=new n(0),s=h.clone();i.cmpn(1)>0&&h.cmpn(1)>0;){
for(var u=0,a=1;0===(i.words[0]&a)&&26>u;++u,a<<=1);if(u>0)for(i.iushrn(u);u-- >0;)e.isOdd()&&e.iadd(s),e.iushrn(1);for(var l=0,m=1;0===(h.words[0]&m)&&26>l;++l,m<<=1);if(l>0)for(h.iushrn(l);l-- >0;)o.isOdd()&&o.iadd(s),o.iushrn(1);i.cmp(h)>=0?(i.isub(h),e.isub(o)):(h.isub(i),o.isub(e))}var f;return f=0===i.cmpn(1)?e:o,f.cmpn(0)<0&&f.iadd(t),f},n.prototype.gcd=function(t){if(this.isZero())return t.abs();if(t.isZero())return this.abs();var i=this.clone(),r=t.clone();i.negative=0,r.negative=0;for(var h=0;i.isEven()&&r.isEven();h++)i.iushrn(1),r.iushrn(1);for(;;){for(;i.isEven();)i.iushrn(1);for(;r.isEven();)r.iushrn(1);var n=i.cmp(r);if(0>n){var e=i;i=r,r=e}else if(0===n||0===r.cmpn(1))break;i.isub(r)}return r.iushln(h)},n.prototype.invm=function(t){return this.egcd(t).a.umod(t)},n.prototype.isEven=function(){return 0===(1&this.words[0])},n.prototype.isOdd=function(){return 1===(1&this.words[0])},n.prototype.andln=function(t){return this.words[0]&t},n.prototype.bincn=function(t){r("number"==typeof t);var i=t%26,h=(t-i)/26,n=1<<i;if(this.length<=h)return this._expand(h+1),this.words[h]|=n,this;for(var e=n,o=h;0!==e&&o<this.length;o++){var s=0|this.words[o];s+=e,e=s>>>26,s&=67108863,this.words[o]=s}return 0!==e&&(this.words[o]=e,this.length++),this},n.prototype.isZero=function(){return 1===this.length&&0===this.words[0]},n.prototype.cmpn=function(t){var i=0>t;if(0!==this.negative&&!i)return-1;if(0===this.negative&&i)return 1;this.strip();var h;if(this.length>1)h=1;else{i&&(t=-t),r(67108863>=t,"Number is too big");var n=0|this.words[0];h=n===t?0:t>n?-1:1}return 0!==this.negative?0|-h:h},n.prototype.cmp=function(t){if(0!==this.negative&&0===t.negative)return-1;if(0===this.negative&&0!==t.negative)return 1;var i=this.ucmp(t);return 0!==this.negative?0|-i:i},n.prototype.ucmp=function(t){if(this.length>t.length)return 1;if(this.length<t.length)return-1;for(var i=0,r=this.length-1;r>=0;r--){var h=0|this.words[r],n=0|t.words[r];if(h!==n){n>h?i=-1:h>n&&(i=1);break}}return i},n.prototype.gtn=function(t){return 1===this.cmpn(t)},n.prototype.gt=function(t){return 1===this.cmp(t)},n.prototype.gten=function(t){return this.cmpn(t)>=0},n.prototype.gte=function(t){return this.cmp(t)>=0},n.prototype.ltn=function(t){return-1===this.cmpn(t)},n.prototype.lt=function(t){return-1===this.cmp(t)},n.prototype.lten=function(t){return this.cmpn(t)<=0},n.prototype.lte=function(t){return this.cmp(t)<=0},n.prototype.eqn=function(t){return 0===this.cmpn(t)},n.prototype.eq=function(t){return 0===this.cmp(t)},n.red=function(t){return new g(t)},n.prototype.toRed=function(t){return r(!this.red,"Already a number in reduction context"),r(0===this.negative,"red works only with positives"),t.convertTo(this)._forceRed(t)},n.prototype.fromRed=function(){return r(this.red,"fromRed works only with numbers in reduction context"),this.red.convertFrom(this)},n.prototype._forceRed=function(t){return this.red=t,this},n.prototype.forceRed=function(t){return r(!this.red,"Already a number in reduction context"),this._forceRed(t)},n.prototype.redAdd=function(t){return r(this.red,"redAdd works only with red numbers"),this.red.add(this,t)},n.prototype.redIAdd=function(t){return r(this.red,"redIAdd works only with red numbers"),this.red.iadd(this,t)},n.prototype.redSub=function(t){return r(this.red,"redSub works only with red numbers"),this.red.sub(this,t)},n.prototype.redISub=function(t){return r(this.red,"redISub works only with red numbers"),this.red.isub(this,t)},n.prototype.redShl=function(t){return r(this.red,"redShl works only with red numbers"),this.red.shl(this,t)},n.prototype.redMul=function(t){return r(this.red,"redMul works only with red numbers"),this.red._verify2(this,t),this.red.mul(this,t)},n.prototype.redIMul=function(t){return r(this.red,"redMul works only with red numbers"),this.red._verify2(this,t),this.red.imul(this,t)},n.prototype.redSqr=function(){return r(this.red,"redSqr works only with red numbers"),this.red._verify1(this),this.red.sqr(this)},n.prototype.redISqr=function(){return r(this.red,"redISqr works only with red numbers"),this.red._verify1(this),this.red.isqr(this)},n.prototype.redSqrt=function(){return r(this.red,"redSqrt works only with red numbers"),this.red._verify1(this),this.red.sqrt(this)},n.prototype.redInvm=function(){return r(this.red,"redInvm works only with red numbers"),this.red._verify1(this),this.red.invm(this)},n.prototype.redNeg=function(){return r(this.red,"redNeg works only with red numbers"),this.red._verify1(this),this.red.neg(this)},n.prototype.redPow=function(t){return r(this.red&&!t.red,"redPow(normalNum)"),this.red._verify1(this),this.red.pow(this,t)};var x={k256:null,p224:null,p192:null,p25519:null};f.prototype._tmp=function(){var t=new n(null);return t.words=new Array(Math.ceil(this.n/13)),t},f.prototype.ireduce=function(t){var i,r=t;do this.split(r,this.tmp),r=this.imulK(r),r=r.iadd(this.tmp),i=r.bitLength();while(i>this.n);var h=i<this.n?-1:r.ucmp(this.p);return 0===h?(r.words[0]=0,r.length=1):h>0?r.isub(this.p):r.strip(),r},f.prototype.split=function(t,i){t.iushrn(this.n,0,i)},f.prototype.imulK=function(t){return t.imul(this.k)},h(d,f),d.prototype.split=function(t,i){for(var r=4194303,h=Math.min(t.length,9),n=0;h>n;n++)i.words[n]=t.words[n];if(i.length=h,t.length<=9)return t.words[0]=0,void(t.length=1);var e=t.words[9];for(i.words[i.length++]=e&r,n=10;n<t.length;n++){var o=0|t.words[n];t.words[n-10]=(o&r)<<4|e>>>22,e=o}e>>>=22,t.words[n-10]=e,0===e&&t.length>10?t.length-=10:t.length-=9},d.prototype.imulK=function(t){t.words[t.length]=0,t.words[t.length+1]=0,t.length+=2;for(var i=0,r=0;r<t.length;r++){var h=0|t.words[r];i+=977*h,t.words[r]=67108863&i,i=64*h+(i/67108864|0)}return 0===t.words[t.length-1]&&(t.length--,0===t.words[t.length-1]&&t.length--),t},h(p,f),h(M,f),h(v,f),v.prototype.imulK=function(t){for(var i=0,r=0;r<t.length;r++){var h=19*(0|t.words[r])+i,n=67108863&h;h>>>=26,t.words[r]=n,i=h}return 0!==i&&(t.words[t.length++]=i),t},n._prime=function S(t){if(x[t])return x[t];var S;if("k256"===t)S=new d;else if("p224"===t)S=new p;else if("p192"===t)S=new M;else{if("p25519"!==t)throw new Error("Unknown prime "+t);S=new v}return x[t]=S,S},g.prototype._verify1=function(t){r(0===t.negative,"red works only with positives"),r(t.red,"red works only with red numbers")},g.prototype._verify2=function(t,i){r(0===(t.negative|i.negative),"red works only with positives"),r(t.red&&t.red===i.red,"red works only with red numbers")},g.prototype.imod=function(t){return this.prime?this.prime.ireduce(t)._forceRed(this):t.umod(this.m)._forceRed(this)},g.prototype.neg=function(t){return t.isZero()?t.clone():this.m.sub(t)._forceRed(this)},g.prototype.add=function(t,i){this._verify2(t,i);var r=t.add(i);return r.cmp(this.m)>=0&&r.isub(this.m),r._forceRed(this)},g.prototype.iadd=function(t,i){this._verify2(t,i);var r=t.iadd(i);return r.cmp(this.m)>=0&&r.isub(this.m),r},g.prototype.sub=function(t,i){this._verify2(t,i);var r=t.sub(i);return r.cmpn(0)<0&&r.iadd(this.m),r._forceRed(this)},g.prototype.isub=function(t,i){this._verify2(t,i);var r=t.isub(i);return r.cmpn(0)<0&&r.iadd(this.m),r},g.prototype.shl=function(t,i){return this._verify1(t),this.imod(t.ushln(i))},g.prototype.imul=function(t,i){return this._verify2(t,i),this.imod(t.imul(i))},g.prototype.mul=function(t,i){return this._verify2(t,i),this.imod(t.mul(i))},g.prototype.isqr=function(t){return this.imul(t,t.clone())},g.prototype.sqr=function(t){return this.mul(t,t)},g.prototype.sqrt=function(t){if(t.isZero())return t.clone();var i=this.m.andln(3);if(r(i%2===1),3===i){var h=this.m.add(new n(1)).iushrn(2);return this.pow(t,h)}for(var e=this.m.subn(1),o=0;!e.isZero()&&0===e.andln(1);)o++,e.iushrn(1);r(!e.isZero());var s=new n(1).toRed(this),u=s.redNeg(),a=this.m.subn(1).iushrn(1),l=this.m.bitLength();for(l=new n(2*l*l).toRed(this);0!==this.pow(l,a).cmp(u);)l.redIAdd(u);for(var m=this.pow(l,e),f=this.pow(t,e.addn(1).iushrn(1)),d=this.pow(t,e),p=o;0!==d.cmp(s);){for(var M=d,v=0;0!==M.cmp(s);v++)M=M.redSqr();r(p>v);var g=this.pow(m,new n(1).iushln(p-v-1));f=f.redMul(g),m=g.redSqr(),d=d.redMul(m),p=v}return f},g.prototype.invm=function(t){var i=t._invmp(this.m);return 0!==i.negative?(i.negative=0,this.imod(i).redNeg()):this.imod(i)},g.prototype.pow=function(t,i){if(i.isZero())return new n(1);if(0===i.cmpn(1))return t.clone();var r=4,h=new Array(1<<r);h[0]=new n(1).toRed(this),h[1]=t;for(var e=2;e<h.length;e++)h[e]=this.mul(h[e-1],t);var o=h[0],s=0,u=0,a=i.bitLength()%26;for(0===a&&(a=26),e=i.length-1;e>=0;e--){for(var l=i.words[e],m=a-1;m>=0;m--){var f=l>>m&1;o!==h[0]&&(o=this.sqr(o)),0!==f||0!==s?(s<<=1,s|=f,u++,(u===r||0===e&&0===m)&&(o=this.mul(o,h[s]),u=0,s=0)):u=0}a=26}return o},g.prototype.convertTo=function(t){var i=t.umod(this.m);return i===t?i.clone():i},g.prototype.convertFrom=function(t){var i=t.clone();return i.red=null,i},n.mont=function(t){return new c(t)},h(c,g),c.prototype.convertTo=function(t){return this.imod(t.ushln(this.shift))},c.prototype.convertFrom=function(t){var i=this.imod(t.mul(this.rinv));return i.red=null,i},c.prototype.imul=function(t,i){if(t.isZero()||i.isZero())return t.words[0]=0,t.length=1,t;var r=t.imul(i),h=r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),n=r.isub(h).iushrn(this.shift),e=n;return n.cmp(this.m)>=0?e=n.isub(this.m):n.cmpn(0)<0&&(e=n.iadd(this.m)),e._forceRed(this)},c.prototype.mul=function(t,i){if(t.isZero()||i.isZero())return new n(0)._forceRed(this);var r=t.mul(i),h=r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),e=r.isub(h).iushrn(this.shift),o=e;return e.cmp(this.m)>=0?o=e.isub(this.m):e.cmpn(0)<0&&(o=e.iadd(this.m)),o._forceRed(this)},c.prototype.invm=function(t){var i=this.imod(t._invmp(this.m).mul(this.r2));return i._forceRed(this)}}("undefined"==typeof module||module,this);

},{"buffer":60}],20:[function(require,module,exports){
"use strict";function bodyParser(e){var r={};if(e)for(var t in e)"type"!==t&&(r[t]=e[t]);var a=exports.urlencoded(r),n=exports.json(r);return function(e,r,t){n(e,r,function(n){return n?t(n):void a(e,r,t)})}}function createParserGetter(e){return function(){return loadParser(e)}}function loadParser(e){var r=parsers[e];if(void 0!==r)return r;switch(e){case"json":r=require("./lib/types/json");break;case"raw":r=require("./lib/types/raw");break;case"text":r=require("./lib/types/text");break;case"urlencoded":r=require("./lib/types/urlencoded")}return parsers[e]=r}var deprecate=require("depd")("body-parser"),parsers=Object.create(null);exports=module.exports=deprecate["function"](bodyParser,"bodyParser: use individual json/urlencoded middlewares"),Object.defineProperty(exports,"json",{configurable:!0,enumerable:!0,get:createParserGetter("json")}),Object.defineProperty(exports,"raw",{configurable:!0,enumerable:!0,get:createParserGetter("raw")}),Object.defineProperty(exports,"text",{configurable:!0,enumerable:!0,get:createParserGetter("text")}),Object.defineProperty(exports,"urlencoded",{configurable:!0,enumerable:!0,get:createParserGetter("urlencoded")});

},{"./lib/types/json":22,"./lib/types/raw":23,"./lib/types/text":24,"./lib/types/urlencoded":25,"depd":78}],21:[function(require,module,exports){
"use strict";function read(e,t,r,n,o,i){var a,d,s=i||{};e._body=!0;var c=null!==s.encoding?s.encoding||"utf-8":null,u=s.verify;try{d=contentstream(e,o,s.inflate),a=d.length,d.length=void 0}catch(l){return r(l)}return s.length=a,s.encoding=u?null:c,null!==s.encoding||null===c||iconv.encodingExists(c)?(o("read body"),void getBody(d,s,function(i,a){if(i)return setErrorStatus(i,400),"encoding.unsupported"===i.type&&(i=createError(415,'unsupported charset "'+c.toUpperCase()+'"',{charset:c.toLowerCase()})),d.resume(),void onFinished(e,function(){r(i)});if(u)try{o("verify body"),u(e,t,a,c)}catch(i){return setErrorStatus(i,403),void r(i)}var s;try{o("parse body"),s="string"!=typeof a&&null!==c?iconv.decode(a,c):a,e.body=n(s)}catch(i){return i.body=void 0===s?a:s,setErrorStatus(i,400),void r(i)}r()})):r(createError(415,'unsupported charset "'+c.toUpperCase()+'"',{charset:c.toLowerCase()}))}function contentstream(e,t,r){var n,o=(e.headers["content-encoding"]||"identity").toLowerCase(),i=e.headers["content-length"];if(t('content-encoding "%s"',o),r===!1&&"identity"!==o)throw createError(415,"content encoding unsupported");switch(o){case"deflate":n=zlib.createInflate(),t("inflate body"),e.pipe(n);break;case"gzip":n=zlib.createGunzip(),t("gunzip body"),e.pipe(n);break;case"identity":n=e,n.length=i;break;default:throw createError(415,'unsupported content encoding "'+o+'"',{encoding:o})}return n}function setErrorStatus(e,t){e.status||e.statusCode||(e.status=t,e.statusCode=t)}var createError=require("http-errors"),getBody=require("raw-body"),iconv=require("iconv-lite"),onFinished=require("on-finished"),zlib=require("zlib");module.exports=read;

},{"http-errors":137,"iconv-lite":157,"on-finished":180,"raw-body":215,"zlib":57}],22:[function(require,module,exports){
"use strict";function json(e){function r(e){if(0===e.length)return{};if(a){var r=firstchar(e);if("{"!==r&&"["!==r)throw debug("strict violation"),new SyntaxError("Unexpected token "+r)}return debug("parse json"),JSON.parse(e,o)}var t=e||{},n="number"!=typeof t.limit?bytes.parse(t.limit||"100kb"):t.limit,i=t.inflate!==!1,o=t.reviver,a=t.strict!==!1,u=t.type||"application/json",s=t.verify||!1;if(s!==!1&&"function"!=typeof s)throw new TypeError("option verify must be function");var p="function"!=typeof u?typeChecker(u):u;return function(e,t,o){if(e._body)return debug("body already parsed"),o();if(e.body=e.body||{},!typeis.hasBody(e))return debug("skip empty body"),o();if(debug("content-type %j",e.headers["content-type"]),!p(e))return debug("skip parsing"),o();var a=getCharset(e)||"utf-8";return"utf-"!==a.substr(0,4)?(debug("invalid charset"),void o(createError(415,'unsupported charset "'+a.toUpperCase()+'"',{charset:a}))):void read(e,t,o,r,debug,{encoding:a,inflate:i,limit:n,verify:s})}}function firstchar(e){var r=firstcharRegExp.exec(e);return r?r[1]:""}function getCharset(e){try{return contentType.parse(e).parameters.charset.toLowerCase()}catch(r){return}}function typeChecker(e){return function(r){return Boolean(typeis(r,e))}}var bytes=require("bytes"),contentType=require("content-type"),createError=require("http-errors"),debug=require("debug")("body-parser:json"),read=require("../read"),typeis=require("type-is");module.exports=json;var firstcharRegExp=/^[\x20\x09\x0a\x0d]*(.)/;

},{"../read":21,"bytes":63,"content-type":66,"debug":76,"http-errors":137,"type-is":248}],23:[function(require,module,exports){
"use strict";function raw(e){function t(e){return e}var r=e||{},i=r.inflate!==!1,n="number"!=typeof r.limit?bytes.parse(r.limit||"100kb"):r.limit,o=r.type||"application/octet-stream",u=r.verify||!1;if(u!==!1&&"function"!=typeof u)throw new TypeError("option verify must be function");var y="function"!=typeof o?typeChecker(o):o;return function(e,r,o){return e._body?(debug("body already parsed"),o()):(e.body=e.body||{},typeis.hasBody(e)?(debug("content-type %j",e.headers["content-type"]),y(e)?void read(e,r,o,t,debug,{encoding:null,inflate:i,limit:n,verify:u}):(debug("skip parsing"),o())):(debug("skip empty body"),o()))}}function typeChecker(e){return function(t){return Boolean(typeis(t,e))}}var bytes=require("bytes"),debug=require("debug")("body-parser:raw"),read=require("../read"),typeis=require("type-is");module.exports=raw;

},{"../read":21,"bytes":63,"debug":76,"type-is":248}],24:[function(require,module,exports){
"use strict";function text(e){function t(e){return e}var r=e||{},n=r.defaultCharset||"utf-8",i=r.inflate!==!1,u="number"!=typeof r.limit?bytes.parse(r.limit||"100kb"):r.limit,o=r.type||"text/plain",y=r.verify||!1;if(y!==!1&&"function"!=typeof y)throw new TypeError("option verify must be function");var a="function"!=typeof o?typeChecker(o):o;return function(e,r,o){if(e._body)return debug("body already parsed"),o();if(e.body=e.body||{},!typeis.hasBody(e))return debug("skip empty body"),o();if(debug("content-type %j",e.headers["content-type"]),!a(e))return debug("skip parsing"),o();var p=getCharset(e)||n;read(e,r,o,t,debug,{encoding:p,inflate:i,limit:u,verify:y})}}function getCharset(e){try{return contentType.parse(e).parameters.charset.toLowerCase()}catch(t){return}}function typeChecker(e){return function(t){return Boolean(typeis(t,e))}}var bytes=require("bytes"),contentType=require("content-type"),debug=require("debug")("body-parser:text"),read=require("../read"),typeis=require("type-is");module.exports=text;

},{"../read":21,"bytes":63,"content-type":66,"debug":76,"type-is":248}],25:[function(require,module,exports){
"use strict";function urlencoded(e){function r(e){return e.length?p(e):{}}var t=e||{};void 0===t.extended&&deprecate("undefined extended: provide extended option");var i=t.extended!==!1,a=t.inflate!==!1,n="number"!=typeof t.limit?bytes.parse(t.limit||"100kb"):t.limit,o=t.type||"application/x-www-form-urlencoded",u=t.verify||!1;if(u!==!1&&"function"!=typeof u)throw new TypeError("option verify must be function");var p=i?extendedparser(t):simpleparser(t),d="function"!=typeof o?typeChecker(o):o;return function(e,t,i){if(e._body)return debug("body already parsed"),i();if(e.body=e.body||{},!typeis.hasBody(e))return debug("skip empty body"),i();if(debug("content-type %j",e.headers["content-type"]),!d(e))return debug("skip parsing"),i();var o=getCharset(e)||"utf-8";return"utf-8"!==o?(debug("invalid charset"),void i(createError(415,'unsupported charset "'+o.toUpperCase()+'"',{charset:o}))):void read(e,t,i,r,debug,{debug:debug,encoding:o,inflate:a,limit:n,verify:u})}}function extendedparser(e){var r=void 0!==e.parameterLimit?e.parameterLimit:1e3,t=parser("qs");if(isNaN(r)||1>r)throw new TypeError("option parameterLimit must be a positive number");return isFinite(r)&&(r=0|r),function(e){var i=parameterCount(e,r);if(void 0===i)throw debug("too many parameters"),createError(413,"too many parameters");var a=Math.max(100,i);return debug("parse extended urlencoding"),t(e,{allowPrototypes:!0,arrayLimit:a,depth:1/0,parameterLimit:r})}}function getCharset(e){try{return contentType.parse(e).parameters.charset.toLowerCase()}catch(r){return}}function parameterCount(e,r){for(var t=0,i=0;-1!==(i=e.indexOf("&",i));)if(t++,i++,t===r)return;return t}function parser(e){var r=parsers[e];if(void 0!==r)return r.parse;switch(e){case"qs":r=require("qs");break;case"querystring":r=require("querystring")}return parsers[e]=r,r.parse}function simpleparser(e){var r=void 0!==e.parameterLimit?e.parameterLimit:1e3,t=parser("querystring");if(isNaN(r)||1>r)throw new TypeError("option parameterLimit must be a positive number");return isFinite(r)&&(r=0|r),function(e){var i=parameterCount(e,r);if(void 0===i)throw debug("too many parameters"),createError(413,"too many parameters");return debug("parse urlencoding"),t(e,void 0,void 0,{maxKeys:r})}}function typeChecker(e){return function(r){return Boolean(typeis(r,e))}}var bytes=require("bytes"),contentType=require("content-type"),createError=require("http-errors"),debug=require("debug")("body-parser:urlencoded"),deprecate=require("depd")("body-parser"),read=require("../read"),typeis=require("type-is");module.exports=urlencoded;var parsers=Object.create(null);

},{"../read":21,"bytes":63,"content-type":66,"debug":76,"depd":78,"http-errors":137,"qs":26,"querystring":212,"type-is":248}],26:[function(require,module,exports){
var Stringify=require("./stringify"),Parse=require("./parse"),internals={};module.exports={stringify:Stringify,parse:Parse};

},{"./parse":27,"./stringify":28}],27:[function(require,module,exports){
var Utils=require("./utils"),internals={delimiter:"&",depth:5,arrayLimit:20,parameterLimit:1e3,strictNullHandling:!1,plainObjects:!1,allowPrototypes:!1,allowDots:!1};internals.parseValues=function(e,t){for(var r={},l=e.split(t.delimiter,t.parameterLimit===1/0?void 0:t.parameterLimit),a=0,i=l.length;i>a;++a){var n=l[a],s=-1===n.indexOf("]=")?n.indexOf("="):n.indexOf("]=")+1;if(-1===s)r[Utils.decode(n)]="",t.strictNullHandling&&(r[Utils.decode(n)]=null);else{var o=Utils.decode(n.slice(0,s)),p=Utils.decode(n.slice(s+1));Object.prototype.hasOwnProperty.call(r,o)?r[o]=[].concat(r[o]).concat(p):r[o]=p}}return r},internals.parseObject=function(e,t,r){if(!e.length)return t;var l,a=e.shift();if("[]"===a)l=[],l=l.concat(internals.parseObject(e,t,r));else{l=r.plainObjects?Object.create(null):{};var i="["===a[0]&&"]"===a[a.length-1]?a.slice(1,a.length-1):a,n=parseInt(i,10),s=""+n;!isNaN(n)&&a!==i&&s===i&&n>=0&&r.parseArrays&&n<=r.arrayLimit?(l=[],l[n]=internals.parseObject(e,t,r)):l[i]=internals.parseObject(e,t,r)}return l},internals.parseKeys=function(e,t,r){if(e){r.allowDots&&(e=e.replace(/\.([^\.\[]+)/g,"[$1]"));var l=/^([^\[\]]*)/,a=/(\[[^\[\]]*\])/g,i=l.exec(e),n=[];if(i[1]){if(!r.plainObjects&&Object.prototype.hasOwnProperty(i[1])&&!r.allowPrototypes)return;n.push(i[1])}for(var s=0;null!==(i=a.exec(e))&&s<r.depth;)++s,(r.plainObjects||!Object.prototype.hasOwnProperty(i[1].replace(/\[|\]/g,""))||r.allowPrototypes)&&n.push(i[1]);return i&&n.push("["+e.slice(i.index)+"]"),internals.parseObject(n,t,r)}},module.exports=function(e,t){if(t=t||{},t.delimiter="string"==typeof t.delimiter||Utils.isRegExp(t.delimiter)?t.delimiter:internals.delimiter,t.depth="number"==typeof t.depth?t.depth:internals.depth,t.arrayLimit="number"==typeof t.arrayLimit?t.arrayLimit:internals.arrayLimit,t.parseArrays=t.parseArrays!==!1,t.allowDots="boolean"==typeof t.allowDots?t.allowDots:internals.allowDots,t.plainObjects="boolean"==typeof t.plainObjects?t.plainObjects:internals.plainObjects,t.allowPrototypes="boolean"==typeof t.allowPrototypes?t.allowPrototypes:internals.allowPrototypes,t.parameterLimit="number"==typeof t.parameterLimit?t.parameterLimit:internals.parameterLimit,t.strictNullHandling="boolean"==typeof t.strictNullHandling?t.strictNullHandling:internals.strictNullHandling,""===e||null===e||"undefined"==typeof e)return t.plainObjects?Object.create(null):{};for(var r="string"==typeof e?internals.parseValues(e,t):e,l=t.plainObjects?Object.create(null):{},a=Object.keys(r),i=0,n=a.length;n>i;++i){var s=a[i],o=internals.parseKeys(s,r[s],t);l=Utils.merge(l,o,t)}return Utils.compact(l)};

},{"./utils":29}],28:[function(require,module,exports){
var Utils=require("./utils"),internals={delimiter:"&",arrayPrefixGenerators:{brackets:function(e,r){return e+"[]"},indices:function(e,r){return e+"["+r+"]"},repeat:function(e,r){return e}},strictNullHandling:!1,skipNulls:!1,encode:!0};internals.stringify=function(e,r,n,t,i,l,a,s){if("function"==typeof a)e=a(r,e);else if(Utils.isBuffer(e))e=e.toString();else if(e instanceof Date)e=e.toISOString();else if(null===e){if(t)return l?Utils.encode(r):r;e=""}if("string"==typeof e||"number"==typeof e||"boolean"==typeof e)return l?[Utils.encode(r)+"="+Utils.encode(e)]:[r+"="+e];var o=[];if("undefined"==typeof e)return o;var f;if(Array.isArray(a))f=a;else{var u=Object.keys(e);f=s?u.sort(s):u}for(var c=0,y=f.length;y>c;++c){var d=f[c];i&&null===e[d]||(o=Array.isArray(e)?o.concat(internals.stringify(e[d],n(r,d),n,t,i,l,a)):o.concat(internals.stringify(e[d],r+"["+d+"]",n,t,i,l,a)))}return o},module.exports=function(e,r){r=r||{};var n,t,i="undefined"==typeof r.delimiter?internals.delimiter:r.delimiter,l="boolean"==typeof r.strictNullHandling?r.strictNullHandling:internals.strictNullHandling,a="boolean"==typeof r.skipNulls?r.skipNulls:internals.skipNulls,s="boolean"==typeof r.encode?r.encode:internals.encode,o="function"==typeof r.sort?r.sort:null;"function"==typeof r.filter?(t=r.filter,e=t("",e)):Array.isArray(r.filter)&&(n=t=r.filter);var f=[];if("object"!=typeof e||null===e)return"";var u;u=r.arrayFormat in internals.arrayPrefixGenerators?r.arrayFormat:"indices"in r?r.indices?"indices":"repeat":"indices";var c=internals.arrayPrefixGenerators[u];n||(n=Object.keys(e)),o&&n.sort(o);for(var y=0,d=n.length;d>y;++y){var p=n[y];a&&null===e[p]||(f=f.concat(internals.stringify(e[p],p,c,l,a,s,t,o)))}return f.join(i)};

},{"./utils":29}],29:[function(require,module,exports){
var internals={};internals.hexTable=new Array(256);for(var h=0;256>h;++h)internals.hexTable[h]="%"+((16>h?"0":"")+h.toString(16)).toUpperCase();exports.arrayToObject=function(e,r){for(var t=r.plainObjects?Object.create(null):{},n=0,a=e.length;a>n;++n)"undefined"!=typeof e[n]&&(t[n]=e[n]);return t},exports.merge=function(e,r,t){if(!r)return e;if("object"!=typeof r)return Array.isArray(e)?e.push(r):"object"==typeof e?e[r]=!0:e=[e,r],e;if("object"!=typeof e)return e=[e].concat(r);Array.isArray(e)&&!Array.isArray(r)&&(e=exports.arrayToObject(e,t));for(var n=Object.keys(r),a=0,o=n.length;o>a;++a){var c=n[a],i=r[c];Object.prototype.hasOwnProperty.call(e,c)?e[c]=exports.merge(e[c],i,t):e[c]=i}return e},exports.decode=function(e){try{return decodeURIComponent(e.replace(/\+/g," "))}catch(r){return e}},exports.encode=function(e){if(0===e.length)return e;"string"!=typeof e&&(e=""+e);for(var r="",t=0,n=e.length;n>t;++t){var a=e.charCodeAt(t);45===a||46===a||95===a||126===a||a>=48&&57>=a||a>=65&&90>=a||a>=97&&122>=a?r+=e[t]:128>a?r+=internals.hexTable[a]:2048>a?r+=internals.hexTable[192|a>>6]+internals.hexTable[128|63&a]:55296>a||a>=57344?r+=internals.hexTable[224|a>>12]+internals.hexTable[128|a>>6&63]+internals.hexTable[128|63&a]:(++t,a=65536+((1023&a)<<10|1023&e.charCodeAt(t)),r+=internals.hexTable[240|a>>18]+internals.hexTable[128|a>>12&63]+internals.hexTable[128|a>>6&63]+internals.hexTable[128|63&a])}return r},exports.compact=function(e,r){if("object"!=typeof e||null===e)return e;r=r||[];var t=r.indexOf(e);if(-1!==t)return r[t];if(r.push(e),Array.isArray(e)){for(var n=[],a=0,o=e.length;o>a;++a)"undefined"!=typeof e[a]&&n.push(e[a]);return n}var c=Object.keys(e);for(a=0,o=c.length;o>a;++a){var i=c[a];e[i]=exports.compact(e[i],r)}return e},exports.isRegExp=function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},exports.isBuffer=function(e){return null===e||"undefined"==typeof e?!1:!!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e))};

},{}],30:[function(require,module,exports){
function Rand(n){this.rand=n}var r;if(module.exports=function(n){return r||(r=new Rand(null)),r.generate(n)},module.exports.Rand=Rand,Rand.prototype.generate=function(n){return this._rand(n)},"object"==typeof window)window.crypto&&window.crypto.getRandomValues?Rand.prototype._rand=function(n){var r=new Uint8Array(n);return window.crypto.getRandomValues(r),r}:window.msCrypto&&window.msCrypto.getRandomValues?Rand.prototype._rand=function(n){var r=new Uint8Array(n);return window.msCrypto.getRandomValues(r),r}:Rand.prototype._rand=function(){throw new Error("Not implemented yet")};else try{var crypto=require("crypto");Rand.prototype._rand=function(n){return crypto.randomBytes(n)}}catch(e){Rand.prototype._rand=function(n){for(var r=new Uint8Array(n),t=0;t<r.length;t++)r[t]=this.rand.getByte();return r}}

},{"crypto":75}],31:[function(require,module,exports){

},{}],32:[function(require,module,exports){
(function (Buffer){
function fixup_uint32(t){var e,i;return e=t>uint_max||0>t?(i=Math.abs(t)%uint_max,0>t?uint_max-i:i):t}function scrub_vec(t){for(var e=0;e<t.length;t++)t[e]=0;return!1}function Global(){this.SBOX=[],this.INV_SBOX=[],this.SUB_MIX=[[],[],[],[]],this.INV_SUB_MIX=[[],[],[],[]],this.init(),this.RCON=[0,1,2,4,8,16,32,64,128,27,54]}function bufferToArray(t){for(var e=t.length/4,i=new Array(e),r=-1;++r<e;)i[r]=t.readUInt32BE(4*r);return i}function AES(t){this._key=bufferToArray(t),this._doReset()}var uint_max=Math.pow(2,32);Global.prototype.init=function(){var t,e,i,r,n,S,u,_,o,h;for(t=function(){var t,i;for(i=[],e=t=0;256>t;e=++t)128>e?i.push(e<<1):i.push(e<<1^283);return i}(),n=0,o=0,e=h=0;256>h;e=++h)i=o^o<<1^o<<2^o<<3^o<<4,i=i>>>8^255&i^99,this.SBOX[n]=i,this.INV_SBOX[i]=n,S=t[n],u=t[S],_=t[u],r=257*t[i]^16843008*i,this.SUB_MIX[0][n]=r<<24|r>>>8,this.SUB_MIX[1][n]=r<<16|r>>>16,this.SUB_MIX[2][n]=r<<8|r>>>24,this.SUB_MIX[3][n]=r,r=16843009*_^65537*u^257*S^16843008*n,this.INV_SUB_MIX[0][i]=r<<24|r>>>8,this.INV_SUB_MIX[1][i]=r<<16|r>>>16,this.INV_SUB_MIX[2][i]=r<<8|r>>>24,this.INV_SUB_MIX[3][i]=r,0===n?n=o=1:(n=S^t[t[t[_^S]]],o^=t[t[o]]);return!0};var G=new Global;AES.blockSize=16,AES.prototype.blockSize=AES.blockSize,AES.keySize=32,AES.prototype.keySize=AES.keySize,AES.prototype._doReset=function(){var t,e,i,r,n,S;for(i=this._key,e=i.length,this._nRounds=e+6,n=4*(this._nRounds+1),this._keySchedule=[],r=0;n>r;r++)this._keySchedule[r]=e>r?i[r]:(S=this._keySchedule[r-1],r%e===0?(S=S<<8|S>>>24,S=G.SBOX[S>>>24]<<24|G.SBOX[S>>>16&255]<<16|G.SBOX[S>>>8&255]<<8|G.SBOX[255&S],S^=G.RCON[r/e|0]<<24):e>6&&r%e===4?S=G.SBOX[S>>>24]<<24|G.SBOX[S>>>16&255]<<16|G.SBOX[S>>>8&255]<<8|G.SBOX[255&S]:void 0,this._keySchedule[r-e]^S);for(this._invKeySchedule=[],t=0;n>t;t++)r=n-t,S=this._keySchedule[r-(t%4?0:4)],this._invKeySchedule[t]=4>t||4>=r?S:G.INV_SUB_MIX[0][G.SBOX[S>>>24]]^G.INV_SUB_MIX[1][G.SBOX[S>>>16&255]]^G.INV_SUB_MIX[2][G.SBOX[S>>>8&255]]^G.INV_SUB_MIX[3][G.SBOX[255&S]];return!0},AES.prototype.encryptBlock=function(t){t=bufferToArray(new Buffer(t));var e=this._doCryptBlock(t,this._keySchedule,G.SUB_MIX,G.SBOX),i=new Buffer(16);return i.writeUInt32BE(e[0],0),i.writeUInt32BE(e[1],4),i.writeUInt32BE(e[2],8),i.writeUInt32BE(e[3],12),i},AES.prototype.decryptBlock=function(t){t=bufferToArray(new Buffer(t));var e=[t[3],t[1]];t[1]=e[0],t[3]=e[1];var i=this._doCryptBlock(t,this._invKeySchedule,G.INV_SUB_MIX,G.INV_SBOX),r=new Buffer(16);return r.writeUInt32BE(i[0],0),r.writeUInt32BE(i[3],4),r.writeUInt32BE(i[2],8),r.writeUInt32BE(i[1],12),r},AES.prototype.scrub=function(){scrub_vec(this._keySchedule),scrub_vec(this._invKeySchedule),scrub_vec(this._key)},AES.prototype._doCryptBlock=function(t,e,i,r){var n,S,u,_,o,h,B,s,c;S=t[0]^e[0],u=t[1]^e[1],_=t[2]^e[2],o=t[3]^e[3],n=4;for(var f=1;f<this._nRounds;f++)h=i[0][S>>>24]^i[1][u>>>16&255]^i[2][_>>>8&255]^i[3][255&o]^e[n++],B=i[0][u>>>24]^i[1][_>>>16&255]^i[2][o>>>8&255]^i[3][255&S]^e[n++],s=i[0][_>>>24]^i[1][o>>>16&255]^i[2][S>>>8&255]^i[3][255&u]^e[n++],c=i[0][o>>>24]^i[1][S>>>16&255]^i[2][u>>>8&255]^i[3][255&_]^e[n++],S=h,u=B,_=s,o=c;return h=(r[S>>>24]<<24|r[u>>>16&255]<<16|r[_>>>8&255]<<8|r[255&o])^e[n++],B=(r[u>>>24]<<24|r[_>>>16&255]<<16|r[o>>>8&255]<<8|r[255&S])^e[n++],s=(r[_>>>24]<<24|r[o>>>16&255]<<16|r[S>>>8&255]<<8|r[255&u])^e[n++],c=(r[o>>>24]<<24|r[S>>>16&255]<<16|r[u>>>8&255]<<8|r[255&_])^e[n++],[fixup_uint32(h),fixup_uint32(B),fixup_uint32(s),fixup_uint32(c)]},exports.AES=AES;

}).call(this,require("buffer").Buffer)
},{"buffer":60}],33:[function(require,module,exports){
(function (Buffer){
function StreamCipher(t,e,r,h){if(!(this instanceof StreamCipher))return new StreamCipher(t,e,r);Transform.call(this),this._finID=Buffer.concat([r,new Buffer([0,0,0,1])]),r=Buffer.concat([r,new Buffer([0,0,0,2])]),this._cipher=new aes.AES(e),this._prev=new Buffer(r.length),this._cache=new Buffer(""),this._secCache=new Buffer(""),this._decrypt=h,this._alen=0,this._len=0,r.copy(this._prev),this._mode=t;var i=new Buffer(4);i.fill(0),this._ghash=new GHASH(this._cipher.encryptBlock(i)),this._authTag=null,this._called=!1}function xorTest(t,e){var r=0;t.length!==e.length&&r++;for(var h=Math.min(t.length,e.length),i=-1;++i<h;)r+=t[i]^e[i];return r}var aes=require("./aes"),Transform=require("cipher-base"),inherits=require("inherits"),GHASH=require("./ghash"),xor=require("buffer-xor");inherits(StreamCipher,Transform),module.exports=StreamCipher,StreamCipher.prototype._update=function(t){if(!this._called&&this._alen){var e=16-this._alen%16;16>e&&(e=new Buffer(e),e.fill(0),this._ghash.update(e))}this._called=!0;var r=this._mode.encrypt(this,t);return this._decrypt?this._ghash.update(t):this._ghash.update(r),this._len+=t.length,r},StreamCipher.prototype._final=function(){if(this._decrypt&&!this._authTag)throw new Error("Unsupported state or unable to authenticate data");var t=xor(this._ghash["final"](8*this._alen,8*this._len),this._cipher.encryptBlock(this._finID));if(this._decrypt){if(xorTest(t,this._authTag))throw new Error("Unsupported state or unable to authenticate data")}else this._authTag=t;this._cipher.scrub()},StreamCipher.prototype.getAuthTag=function(){if(!this._decrypt&&Buffer.isBuffer(this._authTag))return this._authTag;throw new Error("Attempting to get auth tag in unsupported state")},StreamCipher.prototype.setAuthTag=function(t){if(!this._decrypt)throw new Error("Attempting to set auth tag in unsupported state");this._authTag=t},StreamCipher.prototype.setAAD=function(t){if(this._called)throw new Error("Attempting to set AAD in unsupported state");this._ghash.update(t),this._alen+=t.length};

}).call(this,require("buffer").Buffer)
},{"./aes":32,"./ghash":37,"buffer":60,"buffer-xor":59,"cipher-base":64,"inherits":161}],34:[function(require,module,exports){
function getCiphers(){return Object.keys(modes)}var ciphers=require("./encrypter");exports.createCipher=exports.Cipher=ciphers.createCipher,exports.createCipheriv=exports.Cipheriv=ciphers.createCipheriv;var deciphers=require("./decrypter");exports.createDecipher=exports.Decipher=deciphers.createDecipher,exports.createDecipheriv=exports.Decipheriv=deciphers.createDecipheriv;var modes=require("./modes");exports.listCiphers=exports.getCiphers=getCiphers;

},{"./decrypter":35,"./encrypter":36,"./modes":38}],35:[function(require,module,exports){
(function (Buffer){
function Decipher(e,r,t){return this instanceof Decipher?(Transform.call(this),this._cache=new Splitter,this._last=void 0,this._cipher=new aes.AES(r),this._prev=new Buffer(t.length),t.copy(this._prev),this._mode=e,void(this._autopadding=!0)):new Decipher(e,r,t)}function Splitter(){return this instanceof Splitter?void(this.cache=new Buffer("")):new Splitter}function unpad(e){for(var r=e[15],t=-1;++t<r;)if(e[t+(16-r)]!==r)throw new Error("unable to decrypt data");return 16!==r?e.slice(0,16-r):void 0}function createDecipheriv(e,r,t){var i=modes[e.toLowerCase()];if(!i)throw new TypeError("invalid suite type");if("string"==typeof t&&(t=new Buffer(t)),"string"==typeof r&&(r=new Buffer(r)),r.length!==i.key/8)throw new TypeError("invalid key length "+r.length);if(t.length!==i.iv)throw new TypeError("invalid iv length "+t.length);return"stream"===i.type?new StreamCipher(modelist[i.mode],r,t,!0):"auth"===i.type?new AuthCipher(modelist[i.mode],r,t,!0):new Decipher(modelist[i.mode],r,t)}function createDecipher(e,r){var t=modes[e.toLowerCase()];if(!t)throw new TypeError("invalid suite type");var i=ebtk(r,!1,t.key,t.iv);return createDecipheriv(e,i.key,i.iv)}var aes=require("./aes"),Transform=require("cipher-base"),inherits=require("inherits"),modes=require("./modes"),StreamCipher=require("./streamCipher"),AuthCipher=require("./authCipher"),ebtk=require("evp_bytestokey");inherits(Decipher,Transform),Decipher.prototype._update=function(e){this._cache.add(e);for(var r,t,i=[];r=this._cache.get(this._autopadding);)t=this._mode.decrypt(this,r),i.push(t);return Buffer.concat(i)},Decipher.prototype._final=function(){var e=this._cache.flush();if(this._autopadding)return unpad(this._mode.decrypt(this,e));if(e)throw new Error("data not multiple of block length")},Decipher.prototype.setAutoPadding=function(e){return this._autopadding=!!e,this},Splitter.prototype.add=function(e){this.cache=Buffer.concat([this.cache,e])},Splitter.prototype.get=function(e){var r;if(e){if(this.cache.length>16)return r=this.cache.slice(0,16),this.cache=this.cache.slice(16),r}else if(this.cache.length>=16)return r=this.cache.slice(0,16),this.cache=this.cache.slice(16),r;return null},Splitter.prototype.flush=function(){return this.cache.length?this.cache:void 0};var modelist={ECB:require("./modes/ecb"),CBC:require("./modes/cbc"),CFB:require("./modes/cfb"),CFB8:require("./modes/cfb8"),CFB1:require("./modes/cfb1"),OFB:require("./modes/ofb"),CTR:require("./modes/ctr"),GCM:require("./modes/ctr")};exports.createDecipher=createDecipher,exports.createDecipheriv=createDecipheriv;

}).call(this,require("buffer").Buffer)
},{"./aes":32,"./authCipher":33,"./modes":38,"./modes/cbc":39,"./modes/cfb":40,"./modes/cfb1":41,"./modes/cfb8":42,"./modes/ctr":43,"./modes/ecb":44,"./modes/ofb":45,"./streamCipher":46,"buffer":60,"cipher-base":64,"evp_bytestokey":111,"inherits":161}],36:[function(require,module,exports){
(function (Buffer){
function Cipher(e,r,t){return this instanceof Cipher?(Transform.call(this),this._cache=new Splitter,this._cipher=new aes.AES(r),this._prev=new Buffer(t.length),t.copy(this._prev),this._mode=e,void(this._autopadding=!0)):new Cipher(e,r,t)}function Splitter(){return this instanceof Splitter?void(this.cache=new Buffer("")):new Splitter}function createCipheriv(e,r,t){var i=modes[e.toLowerCase()];if(!i)throw new TypeError("invalid suite type");if("string"==typeof t&&(t=new Buffer(t)),"string"==typeof r&&(r=new Buffer(r)),r.length!==i.key/8)throw new TypeError("invalid key length "+r.length);if(t.length!==i.iv)throw new TypeError("invalid iv length "+t.length);return"stream"===i.type?new StreamCipher(modelist[i.mode],r,t):"auth"===i.type?new AuthCipher(modelist[i.mode],r,t):new Cipher(modelist[i.mode],r,t)}function createCipher(e,r){var t=modes[e.toLowerCase()];if(!t)throw new TypeError("invalid suite type");var i=ebtk(r,!1,t.key,t.iv);return createCipheriv(e,i.key,i.iv)}var aes=require("./aes"),Transform=require("cipher-base"),inherits=require("inherits"),modes=require("./modes"),ebtk=require("evp_bytestokey"),StreamCipher=require("./streamCipher"),AuthCipher=require("./authCipher");inherits(Cipher,Transform),Cipher.prototype._update=function(e){this._cache.add(e);for(var r,t,i=[];r=this._cache.get();)t=this._mode.encrypt(this,r),i.push(t);return Buffer.concat(i)},Cipher.prototype._final=function(){var e=this._cache.flush();if(this._autopadding)return e=this._mode.encrypt(this,e),this._cipher.scrub(),e;if("10101010101010101010101010101010"!==e.toString("hex"))throw this._cipher.scrub(),new Error("data not multiple of block length")},Cipher.prototype.setAutoPadding=function(e){return this._autopadding=!!e,this},Splitter.prototype.add=function(e){this.cache=Buffer.concat([this.cache,e])},Splitter.prototype.get=function(){if(this.cache.length>15){var e=this.cache.slice(0,16);return this.cache=this.cache.slice(16),e}return null},Splitter.prototype.flush=function(){for(var e=16-this.cache.length,r=new Buffer(e),t=-1;++t<e;)r.writeUInt8(e,t);var i=Buffer.concat([this.cache,r]);return i};var modelist={ECB:require("./modes/ecb"),CBC:require("./modes/cbc"),CFB:require("./modes/cfb"),CFB8:require("./modes/cfb8"),CFB1:require("./modes/cfb1"),OFB:require("./modes/ofb"),CTR:require("./modes/ctr"),GCM:require("./modes/ctr")};exports.createCipheriv=createCipheriv,exports.createCipher=createCipher;

}).call(this,require("buffer").Buffer)
},{"./aes":32,"./authCipher":33,"./modes":38,"./modes/cbc":39,"./modes/cfb":40,"./modes/cfb1":41,"./modes/cfb8":42,"./modes/ctr":43,"./modes/ecb":44,"./modes/ofb":45,"./streamCipher":46,"buffer":60,"cipher-base":64,"evp_bytestokey":111,"inherits":161}],37:[function(require,module,exports){
(function (Buffer){
function GHASH(t){this.h=t,this.state=new Buffer(16),this.state.fill(0),this.cache=new Buffer("")}function toArray(t){return[t.readUInt32BE(0),t.readUInt32BE(4),t.readUInt32BE(8),t.readUInt32BE(12)]}function fromArray(t){t=t.map(fixup_uint32);var r=new Buffer(16);return r.writeUInt32BE(t[0],0),r.writeUInt32BE(t[1],4),r.writeUInt32BE(t[2],8),r.writeUInt32BE(t[3],12),r}function fixup_uint32(t){var r,e;return r=t>uint_max||0>t?(e=Math.abs(t)%uint_max,0>t?uint_max-e:e):t}function xor(t,r){return[t[0]^r[0],t[1]^r[1],t[2]^r[2],t[3]^r[3]]}var zeros=new Buffer(16);zeros.fill(0),module.exports=GHASH,GHASH.prototype.ghash=function(t){for(var r=-1;++r<t.length;)this.state[r]^=t[r];this._multiply()},GHASH.prototype._multiply=function(){for(var t,r,e,i=toArray(this.h),a=[0,0,0,0],n=-1;++n<128;){for(r=0!==(this.state[~~(n/8)]&1<<7-n%8),r&&(a=xor(a,i)),e=0!==(1&i[3]),t=3;t>0;t--)i[t]=i[t]>>>1|(1&i[t-1])<<31;i[0]=i[0]>>>1,e&&(i[0]=i[0]^225<<24)}this.state=fromArray(a)},GHASH.prototype.update=function(t){this.cache=Buffer.concat([this.cache,t]);for(var r;this.cache.length>=16;)r=this.cache.slice(0,16),this.cache=this.cache.slice(16),this.ghash(r)},GHASH.prototype["final"]=function(t,r){return this.cache.length&&this.ghash(Buffer.concat([this.cache,zeros],16)),this.ghash(fromArray([0,t,0,r])),this.state};var uint_max=Math.pow(2,32);

}).call(this,require("buffer").Buffer)
},{"buffer":60}],38:[function(require,module,exports){
exports["aes-128-ecb"]={cipher:"AES",key:128,iv:0,mode:"ECB",type:"block"},exports["aes-192-ecb"]={cipher:"AES",key:192,iv:0,mode:"ECB",type:"block"},exports["aes-256-ecb"]={cipher:"AES",key:256,iv:0,mode:"ECB",type:"block"},exports["aes-128-cbc"]={cipher:"AES",key:128,iv:16,mode:"CBC",type:"block"},exports["aes-192-cbc"]={cipher:"AES",key:192,iv:16,mode:"CBC",type:"block"},exports["aes-256-cbc"]={cipher:"AES",key:256,iv:16,mode:"CBC",type:"block"},exports.aes128=exports["aes-128-cbc"],exports.aes192=exports["aes-192-cbc"],exports.aes256=exports["aes-256-cbc"],exports["aes-128-cfb"]={cipher:"AES",key:128,iv:16,mode:"CFB",type:"stream"},exports["aes-192-cfb"]={cipher:"AES",key:192,iv:16,mode:"CFB",type:"stream"},exports["aes-256-cfb"]={cipher:"AES",key:256,iv:16,mode:"CFB",type:"stream"},exports["aes-128-cfb8"]={cipher:"AES",key:128,iv:16,mode:"CFB8",type:"stream"},exports["aes-192-cfb8"]={cipher:"AES",key:192,iv:16,mode:"CFB8",type:"stream"},exports["aes-256-cfb8"]={cipher:"AES",key:256,iv:16,mode:"CFB8",type:"stream"},exports["aes-128-cfb1"]={cipher:"AES",key:128,iv:16,mode:"CFB1",type:"stream"},exports["aes-192-cfb1"]={cipher:"AES",key:192,iv:16,mode:"CFB1",type:"stream"},exports["aes-256-cfb1"]={cipher:"AES",key:256,iv:16,mode:"CFB1",type:"stream"},exports["aes-128-ofb"]={cipher:"AES",key:128,iv:16,mode:"OFB",type:"stream"},exports["aes-192-ofb"]={cipher:"AES",key:192,iv:16,mode:"OFB",type:"stream"},exports["aes-256-ofb"]={cipher:"AES",key:256,iv:16,mode:"OFB",type:"stream"},exports["aes-128-ctr"]={cipher:"AES",key:128,iv:16,mode:"CTR",type:"stream"},exports["aes-192-ctr"]={cipher:"AES",key:192,iv:16,mode:"CTR",type:"stream"},exports["aes-256-ctr"]={cipher:"AES",key:256,iv:16,mode:"CTR",type:"stream"},exports["aes-128-gcm"]={cipher:"AES",key:128,iv:12,mode:"GCM",type:"auth"},exports["aes-192-gcm"]={cipher:"AES",key:192,iv:12,mode:"GCM",type:"auth"},exports["aes-256-gcm"]={cipher:"AES",key:256,iv:12,mode:"GCM",type:"auth"};

},{}],39:[function(require,module,exports){
var xor=require("buffer-xor");exports.encrypt=function(r,e){var p=xor(e,r._prev);return r._prev=r._cipher.encryptBlock(p),r._prev},exports.decrypt=function(r,e){var p=r._prev;r._prev=e;var c=r._cipher.decryptBlock(e);return xor(c,p)};

},{"buffer-xor":59}],40:[function(require,module,exports){
(function (Buffer){
function encryptStart(e,r,c){var t=r.length,n=xor(r,e._cache);return e._cache=e._cache.slice(t),e._prev=Buffer.concat([e._prev,c?r:n]),n}var xor=require("buffer-xor");exports.encrypt=function(e,r,c){for(var t,n=new Buffer("");r.length;){if(0===e._cache.length&&(e._cache=e._cipher.encryptBlock(e._prev),e._prev=new Buffer("")),!(e._cache.length<=r.length)){n=Buffer.concat([n,encryptStart(e,r,c)]);break}t=e._cache.length,n=Buffer.concat([n,encryptStart(e,r.slice(0,t),c)]),r=r.slice(t)}return n};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"buffer-xor":59}],41:[function(require,module,exports){
(function (Buffer){
function encryptByte(r,e,n){for(var t,f,c,u=-1,o=8,p=0;++u<o;)t=r._cipher.encryptBlock(r._prev),f=e&1<<7-u?128:0,c=t[0]^f,p+=(128&c)>>u%8,r._prev=shiftIn(r._prev,n?f:c);return p}function shiftIn(r,e){var n=r.length,t=-1,f=new Buffer(r.length);for(r=Buffer.concat([r,new Buffer([e])]);++t<n;)f[t]=r[t]<<1|r[t+1]>>7;return f}exports.encrypt=function(r,e,n){for(var t=e.length,f=new Buffer(t),c=-1;++c<t;)f[c]=encryptByte(r,e[c],n);return f};

}).call(this,require("buffer").Buffer)
},{"buffer":60}],42:[function(require,module,exports){
(function (Buffer){
function encryptByte(e,r,n){var t=e._cipher.encryptBlock(e._prev),c=t[0]^r;return e._prev=Buffer.concat([e._prev.slice(1),new Buffer([n?r:c])]),c}exports.encrypt=function(e,r,n){for(var t=r.length,c=new Buffer(t),f=-1;++f<t;)c[f]=encryptByte(e,r[f],n);return c};

}).call(this,require("buffer").Buffer)
},{"buffer":60}],43:[function(require,module,exports){
(function (Buffer){
function incr32(e){for(var r,c=e.length;c--;){if(r=e.readUInt8(c),255!==r){r++,e.writeUInt8(r,c);break}e.writeUInt8(0,c)}}function getBlock(e){var r=e._cipher.encryptBlock(e._prev);return incr32(e._prev),r}var xor=require("buffer-xor");exports.encrypt=function(e,r){for(;e._cache.length<r.length;)e._cache=Buffer.concat([e._cache,getBlock(e)]);var c=e._cache.slice(0,r.length);return e._cache=e._cache.slice(r.length),xor(r,c)};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"buffer-xor":59}],44:[function(require,module,exports){
exports.encrypt=function(r,c){return r._cipher.encryptBlock(c)},exports.decrypt=function(r,c){return r._cipher.decryptBlock(c)};

},{}],45:[function(require,module,exports){
(function (Buffer){
function getBlock(e){return e._prev=e._cipher.encryptBlock(e._prev),e._prev}var xor=require("buffer-xor");exports.encrypt=function(e,c){for(;e._cache.length<c.length;)e._cache=Buffer.concat([e._cache,getBlock(e)]);var r=e._cache.slice(0,c.length);return e._cache=e._cache.slice(c.length),xor(c,r)};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"buffer-xor":59}],46:[function(require,module,exports){
(function (Buffer){
function StreamCipher(e,r,t,i){return this instanceof StreamCipher?(Transform.call(this),this._cipher=new aes.AES(r),this._prev=new Buffer(t.length),this._cache=new Buffer(""),this._secCache=new Buffer(""),this._decrypt=i,t.copy(this._prev),void(this._mode=e)):new StreamCipher(e,r,t)}var aes=require("./aes"),Transform=require("cipher-base"),inherits=require("inherits");inherits(StreamCipher,Transform),module.exports=StreamCipher,StreamCipher.prototype._update=function(e){return this._mode.encrypt(this,e,this._decrypt)},StreamCipher.prototype._final=function(){this._cipher.scrub()};

}).call(this,require("buffer").Buffer)
},{"./aes":32,"buffer":60,"cipher-base":64,"inherits":161}],47:[function(require,module,exports){
function createCipher(e,r){var s,i;if(e=e.toLowerCase(),aesModes[e])s=aesModes[e].key,i=aesModes[e].iv;else{if(!desModes[e])throw new TypeError("invalid suite type");s=8*desModes[e].key,i=desModes[e].iv}var t=ebtk(r,!1,s,i);return createCipheriv(e,t.key,t.iv)}function createDecipher(e,r){var s,i;if(e=e.toLowerCase(),aesModes[e])s=aesModes[e].key,i=aesModes[e].iv;else{if(!desModes[e])throw new TypeError("invalid suite type");s=8*desModes[e].key,i=desModes[e].iv}var t=ebtk(r,!1,s,i);return createDecipheriv(e,t.key,t.iv)}function createCipheriv(e,r,s){if(e=e.toLowerCase(),aesModes[e])return aes.createCipheriv(e,r,s);if(desModes[e])return new DES({key:r,iv:s,mode:e});throw new TypeError("invalid suite type")}function createDecipheriv(e,r,s){if(e=e.toLowerCase(),aesModes[e])return aes.createDecipheriv(e,r,s);if(desModes[e])return new DES({key:r,iv:s,mode:e,decrypt:!0});throw new TypeError("invalid suite type")}function getCiphers(){return Object.keys(desModes).concat(aes.getCiphers())}var ebtk=require("evp_bytestokey"),aes=require("browserify-aes/browser"),DES=require("browserify-des"),desModes=require("browserify-des/modes"),aesModes=require("browserify-aes/modes");exports.createCipher=exports.Cipher=createCipher,exports.createCipheriv=exports.Cipheriv=createCipheriv,exports.createDecipher=exports.Decipher=createDecipher,exports.createDecipheriv=exports.Decipheriv=createDecipheriv,exports.listCiphers=exports.getCiphers=getCiphers;

},{"browserify-aes/browser":34,"browserify-aes/modes":38,"browserify-des":48,"browserify-des/modes":49,"evp_bytestokey":111}],48:[function(require,module,exports){
(function (Buffer){
function DES(e){CipherBase.call(this);var s,d=e.mode.toLowerCase(),t=modes[d];s=e.decrypt?"decrypt":"encrypt";var r=e.key;"des-ede"!==d&&"des-ede-cbc"!==d||(r=Buffer.concat([r,r.slice(0,8)]));var i=e.iv;this._des=t.create({key:r,iv:i,type:s})}var CipherBase=require("cipher-base"),des=require("des.js"),inherits=require("inherits"),modes={"des-ede3-cbc":des.CBC.instantiate(des.EDE),"des-ede3":des.EDE,"des-ede-cbc":des.CBC.instantiate(des.EDE),"des-ede":des.EDE,"des-cbc":des.CBC.instantiate(des.DES),"des-ecb":des.DES};modes.des=modes["des-cbc"],modes.des3=modes["des-ede3-cbc"],module.exports=DES,inherits(DES,CipherBase),DES.prototype._update=function(e){return new Buffer(this._des.update(e))},DES.prototype._final=function(){return new Buffer(this._des["final"]())};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"cipher-base":64,"des.js":79,"inherits":161}],49:[function(require,module,exports){
exports["des-ecb"]={key:8,iv:0},exports["des-cbc"]=exports.des={key:8,iv:8},exports["des-ede3-cbc"]=exports.des3={key:24,iv:8},exports["des-ede3"]={key:24,iv:0},exports["des-ede-cbc"]={key:16,iv:8},exports["des-ede"]={key:16,iv:0};

},{}],50:[function(require,module,exports){
(function (Buffer){
function blind(e){var n=getr(e),r=n.toRed(bn.mont(e.modulus)).redPow(new bn(e.publicExponent)).fromRed();return{blinder:r,unblinder:n.invm(e.modulus)}}function crt(e,n){var r=blind(n),o=n.modulus.byteLength(),u=(bn.mont(n.modulus),new bn(e).mul(r.blinder).umod(n.modulus)),m=u.toRed(bn.mont(n.prime1)),d=u.toRed(bn.mont(n.prime2)),t=n.coefficient,i=n.prime1,b=n.prime2,l=m.redPow(n.exponent1),s=d.redPow(n.exponent2);l=l.fromRed(),s=s.fromRed();var p=l.isub(s).imul(t).umod(i);return p.imul(b),s.iadd(p),new Buffer(s.imul(r.unblinder).umod(n.modulus).toArray(!1,o))}function getr(e){for(var n=e.modulus.byteLength(),r=new bn(randomBytes(n));r.cmp(e.modulus)>=0||!r.umod(e.prime1)||!r.umod(e.prime2);)r=new bn(randomBytes(n));return r}var bn=require("bn.js"),randomBytes=require("randombytes");module.exports=crt,crt.getr=getr;

}).call(this,require("buffer").Buffer)
},{"bn.js":19,"buffer":60,"randombytes":213}],51:[function(require,module,exports){
(function (Buffer){
"use strict";exports["RSA-SHA224"]=exports.sha224WithRSAEncryption={sign:"rsa",hash:"sha224",id:new Buffer("302d300d06096086480165030402040500041c","hex")},exports["RSA-SHA256"]=exports.sha256WithRSAEncryption={sign:"rsa",hash:"sha256",id:new Buffer("3031300d060960864801650304020105000420","hex")},exports["RSA-SHA384"]=exports.sha384WithRSAEncryption={sign:"rsa",hash:"sha384",id:new Buffer("3041300d060960864801650304020205000430","hex")},exports["RSA-SHA512"]=exports.sha512WithRSAEncryption={sign:"rsa",hash:"sha512",id:new Buffer("3051300d060960864801650304020305000440","hex")},exports["RSA-SHA1"]={sign:"rsa",hash:"sha1",id:new Buffer("3021300906052b0e03021a05000414","hex")},exports["ecdsa-with-SHA1"]={sign:"ecdsa",hash:"sha1",id:new Buffer("","hex")},exports.DSA=exports["DSA-SHA1"]=exports["DSA-SHA"]={sign:"dsa",hash:"sha1",id:new Buffer("","hex")},exports["DSA-SHA224"]=exports["DSA-WITH-SHA224"]={sign:"dsa",hash:"sha224",id:new Buffer("","hex")},exports["DSA-SHA256"]=exports["DSA-WITH-SHA256"]={sign:"dsa",hash:"sha256",id:new Buffer("","hex")},exports["DSA-SHA384"]=exports["DSA-WITH-SHA384"]={sign:"dsa",hash:"sha384",id:new Buffer("","hex")},exports["DSA-SHA512"]=exports["DSA-WITH-SHA512"]={sign:"dsa",hash:"sha512",id:new Buffer("","hex")},exports["DSA-RIPEMD160"]={sign:"dsa",hash:"rmd160",id:new Buffer("","hex")},exports["RSA-RIPEMD160"]=exports.ripemd160WithRSA={sign:"rsa",hash:"rmd160",id:new Buffer("3021300906052b2403020105000414","hex")},exports["RSA-MD5"]=exports.md5WithRSAEncryption={sign:"rsa",hash:"md5",id:new Buffer("3020300c06082a864886f70d020505000410","hex")};

}).call(this,require("buffer").Buffer)
},{"buffer":60}],52:[function(require,module,exports){
(function (Buffer){
function Sign(e){stream.Writable.call(this);var t=algos[e];if(!t)throw new Error("Unknown message digest");this._hashType=t.hash,this._hash=createHash(t.hash),this._tag=t.id,this._signType=t.sign}function Verify(e){stream.Writable.call(this);var t=algos[e];if(!t)throw new Error("Unknown message digest");this._hash=createHash(t.hash),this._tag=t.id,this._signType=t.sign}function createSign(e){return new Sign(e)}function createVerify(e){return new Verify(e)}var _algos=require("./algos"),createHash=require("create-hash"),inherits=require("inherits"),sign=require("./sign"),stream=require("stream"),verify=require("./verify"),algos={};Object.keys(_algos).forEach(function(e){algos[e]=algos[e.toLowerCase()]=_algos[e]}),inherits(Sign,stream.Writable),Sign.prototype._write=function(e,t,i){this._hash.update(e),i()},Sign.prototype.update=function(e,t){return"string"==typeof e&&(e=new Buffer(e,t)),this._hash.update(e),this},Sign.prototype.sign=function(e,t){this.end();var i=this._hash.digest(),r=sign(Buffer.concat([this._tag,i]),e,this._hashType,this._signType);return t?r.toString(t):r},inherits(Verify,stream.Writable),Verify.prototype._write=function(e,t,i){this._hash.update(e),i()},Verify.prototype.update=function(e,t){return"string"==typeof e&&(e=new Buffer(e,t)),this._hash.update(e),this},Verify.prototype.verify=function(e,t,i){"string"==typeof t&&(t=new Buffer(t,i)),this.end();var r=this._hash.digest();return verify(t,Buffer.concat([this._tag,r]),e,this._signType)},module.exports={Sign:createSign,Verify:createVerify,createSign:createSign,createVerify:createVerify};

}).call(this,require("buffer").Buffer)
},{"./algos":51,"./sign":54,"./verify":55,"buffer":60,"create-hash":71,"inherits":161,"stream":241}],53:[function(require,module,exports){
"use strict";exports["1.3.132.0.10"]="secp256k1",exports["1.3.132.0.33"]="p224",exports["1.2.840.10045.3.1.1"]="p192",exports["1.2.840.10045.3.1.7"]="p256",exports["1.3.132.0.34"]="p384",exports["1.3.132.0.35"]="p521";

},{}],54:[function(require,module,exports){
(function (Buffer){
function sign(e,r,t,n){var a=parseKeys(r);if(a.curve){if("ecdsa"!==n)throw new Error("wrong private key type");return ecSign(e,a)}if("dsa"===a.type){if("dsa"!==n)throw new Error("wrong private key type");return dsaSign(e,a,t)}if("rsa"!==n)throw new Error("wrong private key type");for(var i=a.modulus.byteLength(),u=[0,1];e.length+u.length+1<i;)u.push(255);u.push(0);for(var o=-1;++o<e.length;)u.push(e[o]);var c=crt(u,a);return c}function ecSign(e,r){var t=curves[r.curve.join(".")];if(!t)throw new Error("unknown curve "+r.curve.join("."));var n=new EC(t),a=n.genKeyPair();a._importPrivate(r.privateKey);var i=a.sign(e);return new Buffer(i.toDER())}function dsaSign(e,r,t){for(var n,a=r.params.priv_key,i=r.params.p,u=r.params.q,o=r.params.g,c=new BN(0),f=bits2int(e,u).mod(u),s=!1,g=getKey(a,u,e,t);s===!1;)n=makeKey(u,g,t),c=makeR(o,n,i,u),s=n.invm(u).imul(f.add(a.mul(c))).mod(u),s.cmpn(0)||(s=!1,c=new BN(0));return toDER(c,s)}function toDER(e,r){e=e.toArray(),r=r.toArray(),128&e[0]&&(e=[0].concat(e)),128&r[0]&&(r=[0].concat(r));var t=e.length+r.length+4,n=[48,t,2,e.length];return n=n.concat(e,[2,r.length],r),new Buffer(n)}function getKey(e,r,t,n){if(e=new Buffer(e.toArray()),e.length<r.byteLength()){var a=new Buffer(r.byteLength()-e.length);a.fill(0),e=Buffer.concat([a,e])}var i=t.length,u=bits2octets(t,r),o=new Buffer(i);o.fill(1);var c=new Buffer(i);return c.fill(0),c=createHmac(n,c).update(o).update(new Buffer([0])).update(e).update(u).digest(),o=createHmac(n,c).update(o).digest(),c=createHmac(n,c).update(o).update(new Buffer([1])).update(e).update(u).digest(),o=createHmac(n,c).update(o).digest(),{k:c,v:o}}function bits2int(e,r){var t=new BN(e),n=(e.length<<3)-r.bitLength();return n>0&&t.ishrn(n),t}function bits2octets(e,r){e=bits2int(e,r),e=e.mod(r);var t=new Buffer(e.toArray());if(t.length<r.byteLength()){var n=new Buffer(r.byteLength()-t.length);n.fill(0),t=Buffer.concat([n,t])}return t}function makeKey(e,r,t){var n,a;do{for(n=new Buffer("");8*n.length<e.bitLength();)r.v=createHmac(t,r.k).update(r.v).digest(),n=Buffer.concat([n,r.v]);a=bits2int(n,e),r.k=createHmac(t,r.k).update(r.v).update(new Buffer([0])).digest(),r.v=createHmac(t,r.k).update(r.v).digest()}while(-1!==a.cmp(e));return a}function makeR(e,r,t,n){return e.toRed(BN.mont(t)).redPow(r).fromRed().mod(n)}var createHmac=require("create-hmac"),crt=require("browserify-rsa"),curves=require("./curves"),elliptic=require("elliptic"),parseKeys=require("parse-asn1"),BN=require("bn.js"),EC=elliptic.ec;module.exports=sign,module.exports.getKey=getKey,module.exports.makeKey=makeKey;

}).call(this,require("buffer").Buffer)
},{"./curves":53,"bn.js":19,"browserify-rsa":50,"buffer":60,"create-hmac":74,"elliptic":91,"parse-asn1":195}],55:[function(require,module,exports){
(function (Buffer){
function verify(e,r,t,n){var o=parseKeys(t);if("ec"===o.type){if("ecdsa"!==n)throw new Error("wrong public key type");return ecVerify(e,r,o)}if("dsa"===o.type){if("dsa"!==n)throw new Error("wrong public key type");return dsaVerify(e,r,o)}if("rsa"!==n)throw new Error("wrong public key type");for(var a=o.modulus.byteLength(),i=[1],u=0;r.length+i.length+2<a;)i.push(255),u++;i.push(0);for(var d=-1;++d<r.length;)i.push(r[d]);i=new Buffer(i);var c=BN.mont(o.modulus);e=new BN(e).toRed(c),e=e.redPow(new BN(o.publicExponent)),e=new Buffer(e.fromRed().toArray());var l=0;for(8>u&&(l=1),a=Math.min(e.length,i.length),e.length!==i.length&&(l=1),d=-1;++d<a;)l|=e[d]^i[d];return 0===l}function ecVerify(e,r,t){var n=curves[t.data.algorithm.curve.join(".")];if(!n)throw new Error("unknown curve "+t.data.algorithm.curve.join("."));var o=new EC(n),a=t.data.subjectPrivateKey.data;return o.verify(r,e,a)}function dsaVerify(e,r,t){var n=t.data.p,o=t.data.q,a=t.data.g,i=t.data.pub_key,u=parseKeys.signature.decode(e,"der"),d=u.s,c=u.r;checkValue(d,o),checkValue(c,o);var l=BN.mont(n),f=d.invm(o),s=a.toRed(l).redPow(new BN(r).mul(f).mod(o)).fromRed().mul(i.toRed(l).redPow(c.mul(f).mod(o)).fromRed()).mod(n).mod(o);return!s.cmp(c)}function checkValue(e,r){if(e.cmpn(0)<=0)throw new Error("invalid sig");if(e.cmp(r)>=r)throw new Error("invalid sig")}var curves=require("./curves"),elliptic=require("elliptic"),parseKeys=require("parse-asn1"),BN=require("bn.js"),EC=elliptic.ec;module.exports=verify;

}).call(this,require("buffer").Buffer)
},{"./curves":53,"bn.js":19,"buffer":60,"elliptic":91,"parse-asn1":195}],56:[function(require,module,exports){
(function (process,Buffer){
function Zlib(t){if(t<exports.DEFLATE||t>exports.UNZIP)throw new TypeError("Bad argument");this.mode=t,this.init_done=!1,this.write_in_progress=!1,this.pending_close=!1,this.windowBits=0,this.level=0,this.memLevel=0,this.strategy=0,this.dictionary=null}function bufferSet(t,e){for(var s=0;s<t.length;s++)this[e+s]=t[s]}var msg=require("pako/lib/zlib/messages"),zstream=require("pako/lib/zlib/zstream"),zlib_deflate=require("pako/lib/zlib/deflate.js"),zlib_inflate=require("pako/lib/zlib/inflate.js"),constants=require("pako/lib/zlib/constants");for(var key in constants)exports[key]=constants[key];exports.NONE=0,exports.DEFLATE=1,exports.INFLATE=2,exports.GZIP=3,exports.GUNZIP=4,exports.DEFLATERAW=5,exports.INFLATERAW=6,exports.UNZIP=7,Zlib.prototype.init=function(t,e,s,i,r){switch(this.windowBits=t,this.level=e,this.memLevel=s,this.strategy=i,this.mode!==exports.GZIP&&this.mode!==exports.GUNZIP||(this.windowBits+=16),this.mode===exports.UNZIP&&(this.windowBits+=32),this.mode!==exports.DEFLATERAW&&this.mode!==exports.INFLATERAW||(this.windowBits=-this.windowBits),this.strm=new zstream,this.mode){case exports.DEFLATE:case exports.GZIP:case exports.DEFLATERAW:var o=zlib_deflate.deflateInit2(this.strm,this.level,exports.Z_DEFLATED,this.windowBits,this.memLevel,this.strategy);break;case exports.INFLATE:case exports.GUNZIP:case exports.INFLATERAW:case exports.UNZIP:var o=zlib_inflate.inflateInit2(this.strm,this.windowBits);break;default:throw new Error("Unknown mode "+this.mode)}return o!==exports.Z_OK?void this._error(o):(this.write_in_progress=!1,void(this.init_done=!0))},Zlib.prototype.params=function(){throw new Error("deflateParams Not supported")},Zlib.prototype._writeCheck=function(){if(!this.init_done)throw new Error("write before init");if(this.mode===exports.NONE)throw new Error("already finalized");if(this.write_in_progress)throw new Error("write already in progress");if(this.pending_close)throw new Error("close is pending")},Zlib.prototype.write=function(t,e,s,i,r,o,n){this._writeCheck(),this.write_in_progress=!0;var a=this;return process.nextTick(function(){a.write_in_progress=!1;var p=a._write(t,e,s,i,r,o,n);a.callback(p[0],p[1]),a.pending_close&&a.close()}),this},Zlib.prototype.writeSync=function(t,e,s,i,r,o,n){return this._writeCheck(),this._write(t,e,s,i,r,o,n)},Zlib.prototype._write=function(t,e,s,i,r,o,n){if(this.write_in_progress=!0,t!==exports.Z_NO_FLUSH&&t!==exports.Z_PARTIAL_FLUSH&&t!==exports.Z_SYNC_FLUSH&&t!==exports.Z_FULL_FLUSH&&t!==exports.Z_FINISH&&t!==exports.Z_BLOCK)throw new Error("Invalid flush value");null==e&&(e=new Buffer(0),i=0,s=0),r._set?r.set=r._set:r.set=bufferSet;var a=this.strm;switch(a.avail_in=i,a.input=e,a.next_in=s,a.avail_out=n,a.output=r,a.next_out=o,this.mode){case exports.DEFLATE:case exports.GZIP:case exports.DEFLATERAW:var p=zlib_deflate.deflate(a,t);break;case exports.UNZIP:case exports.INFLATE:case exports.GUNZIP:case exports.INFLATERAW:var p=zlib_inflate.inflate(a,t);break;default:throw new Error("Unknown mode "+this.mode)}return p!==exports.Z_STREAM_END&&p!==exports.Z_OK&&this._error(p),this.write_in_progress=!1,[a.avail_in,a.avail_out]},Zlib.prototype.close=function(){return this.write_in_progress?void(this.pending_close=!0):(this.pending_close=!1,this.mode===exports.DEFLATE||this.mode===exports.GZIP||this.mode===exports.DEFLATERAW?zlib_deflate.deflateEnd(this.strm):zlib_inflate.inflateEnd(this.strm),void(this.mode=exports.NONE))},Zlib.prototype.reset=function(){switch(this.mode){case exports.DEFLATE:case exports.DEFLATERAW:var t=zlib_deflate.deflateReset(this.strm);break;case exports.INFLATE:case exports.INFLATERAW:var t=zlib_inflate.inflateReset(this.strm)}t!==exports.Z_OK&&this._error(t)},Zlib.prototype._error=function(t){this.onerror(msg[t]+": "+this.strm.msg,t),this.write_in_progress=!1,this.pending_close&&this.close()},exports.Zlib=Zlib;

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":201,"buffer":60,"pako/lib/zlib/constants":183,"pako/lib/zlib/deflate.js":185,"pako/lib/zlib/inflate.js":187,"pako/lib/zlib/messages":189,"pako/lib/zlib/zstream":191}],57:[function(require,module,exports){
(function (process,Buffer){
function zlibBuffer(e,n,i){function t(){for(var n;null!==(n=e.read());)o.push(n),s+=n.length;e.once("readable",t)}function r(n){e.removeListener("end",f),e.removeListener("readable",t),i(n)}function f(){var n=Buffer.concat(o,s);o=[],i(null,n),e.close()}var o=[],s=0;e.on("error",r),e.on("end",f),e.end(n),t()}function zlibBufferSync(e,n){if("string"==typeof n&&(n=new Buffer(n)),!Buffer.isBuffer(n))throw new TypeError("Not a string or buffer");var i=binding.Z_FINISH;return e._processChunk(n,i)}function Deflate(e){return this instanceof Deflate?void Zlib.call(this,e,binding.DEFLATE):new Deflate(e)}function Inflate(e){return this instanceof Inflate?void Zlib.call(this,e,binding.INFLATE):new Inflate(e)}function Gzip(e){return this instanceof Gzip?void Zlib.call(this,e,binding.GZIP):new Gzip(e)}function Gunzip(e){return this instanceof Gunzip?void Zlib.call(this,e,binding.GUNZIP):new Gunzip(e)}function DeflateRaw(e){return this instanceof DeflateRaw?void Zlib.call(this,e,binding.DEFLATERAW):new DeflateRaw(e)}function InflateRaw(e){return this instanceof InflateRaw?void Zlib.call(this,e,binding.INFLATERAW):new InflateRaw(e)}function Unzip(e){return this instanceof Unzip?void Zlib.call(this,e,binding.UNZIP):new Unzip(e)}function Zlib(e,n){if(this._opts=e=e||{},this._chunkSize=e.chunkSize||exports.Z_DEFAULT_CHUNK,Transform.call(this,e),e.flush&&e.flush!==binding.Z_NO_FLUSH&&e.flush!==binding.Z_PARTIAL_FLUSH&&e.flush!==binding.Z_SYNC_FLUSH&&e.flush!==binding.Z_FULL_FLUSH&&e.flush!==binding.Z_FINISH&&e.flush!==binding.Z_BLOCK)throw new Error("Invalid flush flag: "+e.flush);if(this._flushFlag=e.flush||binding.Z_NO_FLUSH,e.chunkSize&&(e.chunkSize<exports.Z_MIN_CHUNK||e.chunkSize>exports.Z_MAX_CHUNK))throw new Error("Invalid chunk size: "+e.chunkSize);if(e.windowBits&&(e.windowBits<exports.Z_MIN_WINDOWBITS||e.windowBits>exports.Z_MAX_WINDOWBITS))throw new Error("Invalid windowBits: "+e.windowBits);if(e.level&&(e.level<exports.Z_MIN_LEVEL||e.level>exports.Z_MAX_LEVEL))throw new Error("Invalid compression level: "+e.level);if(e.memLevel&&(e.memLevel<exports.Z_MIN_MEMLEVEL||e.memLevel>exports.Z_MAX_MEMLEVEL))throw new Error("Invalid memLevel: "+e.memLevel);if(e.strategy&&e.strategy!=exports.Z_FILTERED&&e.strategy!=exports.Z_HUFFMAN_ONLY&&e.strategy!=exports.Z_RLE&&e.strategy!=exports.Z_FIXED&&e.strategy!=exports.Z_DEFAULT_STRATEGY)throw new Error("Invalid strategy: "+e.strategy);if(e.dictionary&&!Buffer.isBuffer(e.dictionary))throw new Error("Invalid dictionary: it should be a Buffer instance");this._binding=new binding.Zlib(n);var i=this;this._hadError=!1,this._binding.onerror=function(e,n){i._binding=null,i._hadError=!0;var t=new Error(e);t.errno=n,t.code=exports.codes[n],i.emit("error",t)};var t=exports.Z_DEFAULT_COMPRESSION;"number"==typeof e.level&&(t=e.level);var r=exports.Z_DEFAULT_STRATEGY;"number"==typeof e.strategy&&(r=e.strategy),this._binding.init(e.windowBits||exports.Z_DEFAULT_WINDOWBITS,t,e.memLevel||exports.Z_DEFAULT_MEMLEVEL,r,e.dictionary),this._buffer=new Buffer(this._chunkSize),this._offset=0,this._closed=!1,this._level=t,this._strategy=r,this.once("end",this.close)}var Transform=require("_stream_transform"),binding=require("./binding"),util=require("util"),assert=require("assert").ok;binding.Z_MIN_WINDOWBITS=8,binding.Z_MAX_WINDOWBITS=15,binding.Z_DEFAULT_WINDOWBITS=15,binding.Z_MIN_CHUNK=64,binding.Z_MAX_CHUNK=1/0,binding.Z_DEFAULT_CHUNK=16384,binding.Z_MIN_MEMLEVEL=1,binding.Z_MAX_MEMLEVEL=9,binding.Z_DEFAULT_MEMLEVEL=8,binding.Z_MIN_LEVEL=-1,binding.Z_MAX_LEVEL=9,binding.Z_DEFAULT_LEVEL=binding.Z_DEFAULT_COMPRESSION,Object.keys(binding).forEach(function(e){e.match(/^Z/)&&(exports[e]=binding[e])}),exports.codes={Z_OK:binding.Z_OK,Z_STREAM_END:binding.Z_STREAM_END,Z_NEED_DICT:binding.Z_NEED_DICT,Z_ERRNO:binding.Z_ERRNO,Z_STREAM_ERROR:binding.Z_STREAM_ERROR,Z_DATA_ERROR:binding.Z_DATA_ERROR,Z_MEM_ERROR:binding.Z_MEM_ERROR,Z_BUF_ERROR:binding.Z_BUF_ERROR,Z_VERSION_ERROR:binding.Z_VERSION_ERROR},Object.keys(exports.codes).forEach(function(e){exports.codes[exports.codes[e]]=e}),exports.Deflate=Deflate,exports.Inflate=Inflate,exports.Gzip=Gzip,exports.Gunzip=Gunzip,exports.DeflateRaw=DeflateRaw,exports.InflateRaw=InflateRaw,exports.Unzip=Unzip,exports.createDeflate=function(e){return new Deflate(e)},exports.createInflate=function(e){return new Inflate(e)},exports.createDeflateRaw=function(e){return new DeflateRaw(e)},exports.createInflateRaw=function(e){return new InflateRaw(e)},exports.createGzip=function(e){return new Gzip(e)},exports.createGunzip=function(e){return new Gunzip(e)},exports.createUnzip=function(e){return new Unzip(e)},exports.deflate=function(e,n,i){return"function"==typeof n&&(i=n,n={}),zlibBuffer(new Deflate(n),e,i)},exports.deflateSync=function(e,n){return zlibBufferSync(new Deflate(n),e)},exports.gzip=function(e,n,i){return"function"==typeof n&&(i=n,n={}),zlibBuffer(new Gzip(n),e,i)},exports.gzipSync=function(e,n){return zlibBufferSync(new Gzip(n),e)},exports.deflateRaw=function(e,n,i){return"function"==typeof n&&(i=n,n={}),zlibBuffer(new DeflateRaw(n),e,i)},exports.deflateRawSync=function(e,n){return zlibBufferSync(new DeflateRaw(n),e)},exports.unzip=function(e,n,i){return"function"==typeof n&&(i=n,n={}),zlibBuffer(new Unzip(n),e,i)},exports.unzipSync=function(e,n){return zlibBufferSync(new Unzip(n),e)},exports.inflate=function(e,n,i){return"function"==typeof n&&(i=n,n={}),zlibBuffer(new Inflate(n),e,i)},exports.inflateSync=function(e,n){return zlibBufferSync(new Inflate(n),e)},exports.gunzip=function(e,n,i){return"function"==typeof n&&(i=n,n={}),zlibBuffer(new Gunzip(n),e,i)},exports.gunzipSync=function(e,n){return zlibBufferSync(new Gunzip(n),e)},exports.inflateRaw=function(e,n,i){return"function"==typeof n&&(i=n,n={}),zlibBuffer(new InflateRaw(n),e,i)},exports.inflateRawSync=function(e,n){return zlibBufferSync(new InflateRaw(n),e)},util.inherits(Zlib,Transform),Zlib.prototype.params=function(e,n,i){if(e<exports.Z_MIN_LEVEL||e>exports.Z_MAX_LEVEL)throw new RangeError("Invalid compression level: "+e);if(n!=exports.Z_FILTERED&&n!=exports.Z_HUFFMAN_ONLY&&n!=exports.Z_RLE&&n!=exports.Z_FIXED&&n!=exports.Z_DEFAULT_STRATEGY)throw new TypeError("Invalid strategy: "+n);if(this._level!==e||this._strategy!==n){var t=this;this.flush(binding.Z_SYNC_FLUSH,function(){t._binding.params(e,n),t._hadError||(t._level=e,t._strategy=n,i&&i())})}else process.nextTick(i)},Zlib.prototype.reset=function(){return this._binding.reset()},Zlib.prototype._flush=function(e){this._transform(new Buffer(0),"",e)},Zlib.prototype.flush=function(e,n){var i=this._writableState;if(("function"==typeof e||void 0===e&&!n)&&(n=e,e=binding.Z_FULL_FLUSH),i.ended)n&&process.nextTick(n);else if(i.ending)n&&this.once("end",n);else if(i.needDrain){var t=this;this.once("drain",function(){t.flush(n)})}else this._flushFlag=e,this.write(new Buffer(0),"",n)},Zlib.prototype.close=function(e){if(e&&process.nextTick(e),!this._closed){this._closed=!0,this._binding.close();var n=this;process.nextTick(function(){n.emit("close")})}},Zlib.prototype._transform=function(e,n,i){var t,r=this._writableState,f=r.ending||r.ended,o=f&&(!e||r.length===e.length);if(null===!e&&!Buffer.isBuffer(e))return i(new Error("invalid input"));o?t=binding.Z_FINISH:(t=this._flushFlag,e.length>=r.length&&(this._flushFlag=this._opts.flush||binding.Z_NO_FLUSH));this._processChunk(e,t,i)},Zlib.prototype._processChunk=function(e,n,i){function t(u,c){if(!s._hadError){var h=f-c;if(assert(h>=0,"have should not go down"),h>0){var p=s._buffer.slice(s._offset,s._offset+h);s._offset+=h,l?s.push(p):(a.push(p),_+=p.length)}if((0===c||s._offset>=s._chunkSize)&&(f=s._chunkSize,s._offset=0,s._buffer=new Buffer(s._chunkSize)),0===c){if(o+=r-u,r=u,!l)return!0;var d=s._binding.write(n,e,o,r,s._buffer,s._offset,s._chunkSize);return d.callback=t,void(d.buffer=e)}return l?void i():!1}}var r=e&&e.length,f=this._chunkSize-this._offset,o=0,s=this,l="function"==typeof i;if(!l){var u,a=[],_=0;this.on("error",function(e){u=e});do var c=this._binding.writeSync(n,e,o,r,this._buffer,this._offset,f);while(!this._hadError&&t(c[0],c[1]));if(this._hadError)throw u;var h=Buffer.concat(a,_);return this.close(),h}var p=this._binding.write(n,e,o,r,this._buffer,this._offset,f);p.buffer=e,p.callback=t},util.inherits(Deflate,Zlib),util.inherits(Inflate,Zlib),util.inherits(Gzip,Zlib),util.inherits(Gunzip,Zlib),util.inherits(DeflateRaw,Zlib),util.inherits(InflateRaw,Zlib),util.inherits(Unzip,Zlib);

}).call(this,require('_process'),require("buffer").Buffer)
},{"./binding":56,"_process":201,"_stream_transform":226,"assert":17,"buffer":60,"util":254}],58:[function(require,module,exports){

},{}],59:[function(require,module,exports){
(function (Buffer){
module.exports=function(e,n){for(var r=Math.min(e.length,n.length),t=new Buffer(r),f=0;r>f;++f)t[f]=e[f]^n[f];return t};

}).call(this,require("buffer").Buffer)
},{"buffer":60}],60:[function(require,module,exports){
(function (global){
"use strict";function typedArraySupport(){try{var t=new Uint8Array(1);return t.foo=function(){return 42},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(e){return!1}}function kMaxLength(){return Buffer.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function createBuffer(t,e){if(kMaxLength()<e)throw new RangeError("Invalid typed array length");return Buffer.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e),t.__proto__=Buffer.prototype):(null===t&&(t=new Buffer(e)),t.length=e),t}function Buffer(t,e,r){if(!(Buffer.TYPED_ARRAY_SUPPORT||this instanceof Buffer))return new Buffer(t,e,r);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return allocUnsafe(this,t)}return from(this,t,e,r)}function from(t,e,r,n){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?fromArrayBuffer(t,e,r,n):"string"==typeof e?fromString(t,e,r):fromObject(t,e)}function assertSize(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number')}function alloc(t,e,r,n){return assertSize(e),0>=e?createBuffer(t,e):void 0!==r?"string"==typeof n?createBuffer(t,e).fill(r,n):createBuffer(t,e).fill(r):createBuffer(t,e)}function allocUnsafe(t,e){if(assertSize(e),t=createBuffer(t,0>e?0:0|checked(e)),!Buffer.TYPED_ARRAY_SUPPORT)for(var r=0;e>r;r++)t[r]=0;return t}function fromString(t,e,r){if("string"==typeof r&&""!==r||(r="utf8"),!Buffer.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var n=0|byteLength(e,r);return t=createBuffer(t,n),t.write(e,r),t}function fromArrayLike(t,e){var r=0|checked(e.length);t=createBuffer(t,r);for(var n=0;r>n;n+=1)t[n]=255&e[n];return t}function fromArrayBuffer(t,e,r,n){if(e.byteLength,0>r||e.byteLength<r)throw new RangeError("'offset' is out of bounds");if(e.byteLength<r+(n||0))throw new RangeError("'length' is out of bounds");return e=void 0===n?new Uint8Array(e,r):new Uint8Array(e,r,n),Buffer.TYPED_ARRAY_SUPPORT?(t=e,t.__proto__=Buffer.prototype):t=fromArrayLike(t,e),t}function fromObject(t,e){if(Buffer.isBuffer(e)){var r=0|checked(e.length);return t=createBuffer(t,r),0===t.length?t:(e.copy(t,0,0,r),t)}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return"number"!=typeof e.length||isnan(e.length)?createBuffer(t,0):fromArrayLike(t,e);if("Buffer"===e.type&&isArray(e.data))return fromArrayLike(t,e.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function checked(t){if(t>=kMaxLength())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+kMaxLength().toString(16)+" bytes");return 0|t}function SlowBuffer(t){return+t!=t&&(t=0),Buffer.alloc(+t)}function byteLength(t,e){if(Buffer.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var r=t.length;if(0===r)return 0;for(var n=!1;;)switch(e){case"ascii":case"binary":case"raw":case"raws":return r;case"utf8":case"utf-8":case void 0:return utf8ToBytes(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return base64ToBytes(t).length;default:if(n)return utf8ToBytes(t).length;e=(""+e).toLowerCase(),n=!0}}function slowToString(t,e,r){var n=!1;if((void 0===e||0>e)&&(e=0),e>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),0>=r)return"";if(r>>>=0,e>>>=0,e>=r)return"";for(t||(t="utf8");;)switch(t){case"hex":return hexSlice(this,e,r);case"utf8":case"utf-8":return utf8Slice(this,e,r);case"ascii":return asciiSlice(this,e,r);case"binary":return binarySlice(this,e,r);case"base64":return base64Slice(this,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}function swap(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}function arrayIndexOf(t,e,r,n){function f(t,e){return 1===i?t[e]:t.readUInt16BE(e*i)}var i=1,o=t.length,u=e.length;if(void 0!==n&&(n=String(n).toLowerCase(),"ucs2"===n||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return-1;i=2,o/=2,u/=2,r/=2}for(var s=-1,h=0;o>r+h;h++)if(f(t,r+h)===f(e,-1===s?0:h-s)){if(-1===s&&(s=h),h-s+1===u)return(r+s)*i}else-1!==s&&(h-=h-s),s=-1;return-1}function hexWrite(t,e,r,n){r=Number(r)||0;var f=t.length-r;n?(n=Number(n),n>f&&(n=f)):n=f;var i=e.length;if(i%2!==0)throw new Error("Invalid hex string");n>i/2&&(n=i/2);for(var o=0;n>o;o++){var u=parseInt(e.substr(2*o,2),16);if(isNaN(u))return o;t[r+o]=u}return o}function utf8Write(t,e,r,n){return blitBuffer(utf8ToBytes(e,t.length-r),t,r,n)}function asciiWrite(t,e,r,n){return blitBuffer(asciiToBytes(e),t,r,n)}function binaryWrite(t,e,r,n){return asciiWrite(t,e,r,n)}function base64Write(t,e,r,n){return blitBuffer(base64ToBytes(e),t,r,n)}function ucs2Write(t,e,r,n){return blitBuffer(utf16leToBytes(e,t.length-r),t,r,n)}function base64Slice(t,e,r){return 0===e&&r===t.length?base64.fromByteArray(t):base64.fromByteArray(t.slice(e,r))}function utf8Slice(t,e,r){r=Math.min(t.length,r);for(var n=[],f=e;r>f;){var i=t[f],o=null,u=i>239?4:i>223?3:i>191?2:1;if(r>=f+u){var s,h,a,c;switch(u){case 1:128>i&&(o=i);break;case 2:s=t[f+1],128===(192&s)&&(c=(31&i)<<6|63&s,c>127&&(o=c));break;case 3:s=t[f+1],h=t[f+2],128===(192&s)&&128===(192&h)&&(c=(15&i)<<12|(63&s)<<6|63&h,c>2047&&(55296>c||c>57343)&&(o=c));break;case 4:s=t[f+1],h=t[f+2],a=t[f+3],128===(192&s)&&128===(192&h)&&128===(192&a)&&(c=(15&i)<<18|(63&s)<<12|(63&h)<<6|63&a,c>65535&&1114112>c&&(o=c))}}null===o?(o=65533,u=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),f+=u}return decodeCodePointsArray(n)}function decodeCodePointsArray(t){var e=t.length;if(MAX_ARGUMENTS_LENGTH>=e)return String.fromCharCode.apply(String,t);for(var r="",n=0;e>n;)r+=String.fromCharCode.apply(String,t.slice(n,n+=MAX_ARGUMENTS_LENGTH));return r}function asciiSlice(t,e,r){var n="";r=Math.min(t.length,r);for(var f=e;r>f;f++)n+=String.fromCharCode(127&t[f]);return n}function binarySlice(t,e,r){var n="";r=Math.min(t.length,r);for(var f=e;r>f;f++)n+=String.fromCharCode(t[f]);return n}function hexSlice(t,e,r){var n=t.length;(!e||0>e)&&(e=0),(!r||0>r||r>n)&&(r=n);for(var f="",i=e;r>i;i++)f+=toHex(t[i]);return f}function utf16leSlice(t,e,r){for(var n=t.slice(e,r),f="",i=0;i<n.length;i+=2)f+=String.fromCharCode(n[i]+256*n[i+1]);return f}function checkOffset(t,e,r){if(t%1!==0||0>t)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function checkInt(t,e,r,n,f,i){if(!Buffer.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>f||i>e)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function objectWriteUInt16(t,e,r,n){0>e&&(e=65535+e+1);for(var f=0,i=Math.min(t.length-r,2);i>f;f++)t[r+f]=(e&255<<8*(n?f:1-f))>>>8*(n?f:1-f)}function objectWriteUInt32(t,e,r,n){0>e&&(e=4294967295+e+1);for(var f=0,i=Math.min(t.length-r,4);i>f;f++)t[r+f]=e>>>8*(n?f:3-f)&255}function checkIEEE754(t,e,r,n,f,i){if(r+n>t.length)throw new RangeError("Index out of range");if(0>r)throw new RangeError("Index out of range")}function writeFloat(t,e,r,n,f){return f||checkIEEE754(t,e,r,4,3.4028234663852886e38,-3.4028234663852886e38),ieee754.write(t,e,r,n,23,4),r+4}function writeDouble(t,e,r,n,f){return f||checkIEEE754(t,e,r,8,1.7976931348623157e308,-1.7976931348623157e308),ieee754.write(t,e,r,n,52,8),r+8}function base64clean(t){if(t=stringtrim(t).replace(INVALID_BASE64_RE,""),t.length<2)return"";for(;t.length%4!==0;)t+="=";return t}function stringtrim(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function toHex(t){return 16>t?"0"+t.toString(16):t.toString(16)}function utf8ToBytes(t,e){e=e||1/0;for(var r,n=t.length,f=null,i=[],o=0;n>o;o++){if(r=t.charCodeAt(o),r>55295&&57344>r){if(!f){if(r>56319){(e-=3)>-1&&i.push(239,191,189);continue}if(o+1===n){(e-=3)>-1&&i.push(239,191,189);continue}f=r;continue}if(56320>r){(e-=3)>-1&&i.push(239,191,189),f=r;continue}r=(f-55296<<10|r-56320)+65536}else f&&(e-=3)>-1&&i.push(239,191,189);if(f=null,128>r){if((e-=1)<0)break;i.push(r)}else if(2048>r){if((e-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(65536>r){if((e-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(1114112>r))throw new Error("Invalid code point");if((e-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return i}function asciiToBytes(t){for(var e=[],r=0;r<t.length;r++)e.push(255&t.charCodeAt(r));return e}function utf16leToBytes(t,e){for(var r,n,f,i=[],o=0;o<t.length&&!((e-=2)<0);o++)r=t.charCodeAt(o),n=r>>8,f=r%256,i.push(f),i.push(n);return i}function base64ToBytes(t){return base64.toByteArray(base64clean(t))}function blitBuffer(t,e,r,n){for(var f=0;n>f&&!(f+r>=e.length||f>=t.length);f++)e[f+r]=t[f];return f}function isnan(t){return t!==t}var base64=require("base64-js"),ieee754=require("ieee754"),isArray=require("isarray");exports.Buffer=Buffer,exports.SlowBuffer=SlowBuffer,exports.INSPECT_MAX_BYTES=50,Buffer.TYPED_ARRAY_SUPPORT=void 0!==global.TYPED_ARRAY_SUPPORT?global.TYPED_ARRAY_SUPPORT:typedArraySupport(),exports.kMaxLength=kMaxLength(),Buffer.poolSize=8192,Buffer._augment=function(t){return t.__proto__=Buffer.prototype,t},Buffer.from=function(t,e,r){return from(null,t,e,r)},Buffer.TYPED_ARRAY_SUPPORT&&(Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&Buffer[Symbol.species]===Buffer&&Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0})),Buffer.alloc=function(t,e,r){return alloc(null,t,e,r)},Buffer.allocUnsafe=function(t){return allocUnsafe(null,t)},Buffer.allocUnsafeSlow=function(t){return allocUnsafe(null,t)},Buffer.isBuffer=function(t){return!(null==t||!t._isBuffer)},Buffer.compare=function(t,e){if(!Buffer.isBuffer(t)||!Buffer.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var r=t.length,n=e.length,f=0,i=Math.min(r,n);i>f;++f)if(t[f]!==e[f]){r=t[f],n=e[f];break}return n>r?-1:r>n?1:0},Buffer.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},Buffer.concat=function(t,e){if(!isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return Buffer.alloc(0);var r;if(void 0===e)for(e=0,r=0;r<t.length;r++)e+=t[r].length;var n=Buffer.allocUnsafe(e),f=0;for(r=0;r<t.length;r++){var i=t[r];if(!Buffer.isBuffer(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(n,f),f+=i.length}return n},Buffer.byteLength=byteLength,Buffer.prototype._isBuffer=!0,Buffer.prototype.swap16=function(){var t=this.length;if(t%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;t>e;e+=2)swap(this,e,e+1);return this},Buffer.prototype.swap32=function(){var t=this.length;if(t%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;t>e;e+=4)swap(this,e,e+3),swap(this,e+1,e+2);return this},Buffer.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?utf8Slice(this,0,t):slowToString.apply(this,arguments)},Buffer.prototype.equals=function(t){if(!Buffer.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t?!0:0===Buffer.compare(this,t)},Buffer.prototype.inspect=function(){var t="",e=exports.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,e).match(/.{2}/g).join(" "),this.length>e&&(t+=" ... ")),"<Buffer "+t+">"},Buffer.prototype.compare=function(t,e,r,n,f){if(!Buffer.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===f&&(f=this.length),0>e||r>t.length||0>n||f>this.length)throw new RangeError("out of range index");if(n>=f&&e>=r)return 0;if(n>=f)return-1;if(e>=r)return 1;if(e>>>=0,r>>>=0,n>>>=0,f>>>=0,this===t)return 0;for(var i=f-n,o=r-e,u=Math.min(i,o),s=this.slice(n,f),h=t.slice(e,r),a=0;u>a;++a)if(s[a]!==h[a]){i=s[a],o=h[a];break}return o>i?-1:i>o?1:0},Buffer.prototype.indexOf=function(t,e,r){if("string"==typeof e?(r=e,e=0):e>2147483647?e=2147483647:-2147483648>e&&(e=-2147483648),e>>=0,0===this.length)return-1;if(e>=this.length)return-1;if(0>e&&(e=Math.max(this.length+e,0)),"string"==typeof t&&(t=Buffer.from(t,r)),Buffer.isBuffer(t))return 0===t.length?-1:arrayIndexOf(this,t,e,r);if("number"==typeof t)return Buffer.TYPED_ARRAY_SUPPORT&&"function"===Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,t,e):arrayIndexOf(this,[t],e,r);throw new TypeError("val must be string, number or Buffer")},Buffer.prototype.includes=function(t,e,r){return-1!==this.indexOf(t,e,r)},Buffer.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e=0|e,isFinite(r)?(r=0|r,void 0===n&&(n="utf8")):(n=r,r=void 0)}var f=this.length-e;if((void 0===r||r>f)&&(r=f),t.length>0&&(0>r||0>e)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var i=!1;;)switch(n){case"hex":return hexWrite(this,t,e,r);case"utf8":case"utf-8":return utf8Write(this,t,e,r);case"ascii":return asciiWrite(this,t,e,r);case"binary":return binaryWrite(this,t,e,r);case"base64":return base64Write(this,t,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,t,e,r);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),i=!0}},Buffer.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var MAX_ARGUMENTS_LENGTH=4096;Buffer.prototype.slice=function(t,e){var r=this.length;t=~~t,e=void 0===e?r:~~e,0>t?(t+=r,0>t&&(t=0)):t>r&&(t=r),0>e?(e+=r,0>e&&(e=0)):e>r&&(e=r),t>e&&(e=t);var n;if(Buffer.TYPED_ARRAY_SUPPORT)n=this.subarray(t,e),n.__proto__=Buffer.prototype;else{var f=e-t;n=new Buffer(f,void 0);for(var i=0;f>i;i++)n[i]=this[i+t]}return n},Buffer.prototype.readUIntLE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=this[t],f=1,i=0;++i<e&&(f*=256);)n+=this[t+i]*f;return n},Buffer.prototype.readUIntBE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=this[t+--e],f=1;e>0&&(f*=256);)n+=this[t+--e]*f;return n},Buffer.prototype.readUInt8=function(t,e){return e||checkOffset(t,1,this.length),this[t]},Buffer.prototype.readUInt16LE=function(t,e){return e||checkOffset(t,2,this.length),this[t]|this[t+1]<<8},Buffer.prototype.readUInt16BE=function(t,e){return e||checkOffset(t,2,this.length),this[t]<<8|this[t+1]},Buffer.prototype.readUInt32LE=function(t,e){return e||checkOffset(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},Buffer.prototype.readUInt32BE=function(t,e){return e||checkOffset(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},Buffer.prototype.readIntLE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=this[t],f=1,i=0;++i<e&&(f*=256);)n+=this[t+i]*f;return f*=128,n>=f&&(n-=Math.pow(2,8*e)),n},Buffer.prototype.readIntBE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=e,f=1,i=this[t+--n];n>0&&(f*=256);)i+=this[t+--n]*f;return f*=128,i>=f&&(i-=Math.pow(2,8*e)),i},Buffer.prototype.readInt8=function(t,e){return e||checkOffset(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},Buffer.prototype.readInt16LE=function(t,e){e||checkOffset(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt16BE=function(t,e){e||checkOffset(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt32LE=function(t,e){return e||checkOffset(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},Buffer.prototype.readInt32BE=function(t,e){return e||checkOffset(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},Buffer.prototype.readFloatLE=function(t,e){return e||checkOffset(t,4,this.length),ieee754.read(this,t,!0,23,4)},Buffer.prototype.readFloatBE=function(t,e){return e||checkOffset(t,4,this.length),ieee754.read(this,t,!1,23,4)},Buffer.prototype.readDoubleLE=function(t,e){return e||checkOffset(t,8,this.length),ieee754.read(this,t,!0,52,8)},Buffer.prototype.readDoubleBE=function(t,e){return e||checkOffset(t,8,this.length),ieee754.read(this,t,!1,52,8)},Buffer.prototype.writeUIntLE=function(t,e,r,n){if(t=+t,e=0|e,r=0|r,!n){var f=Math.pow(2,8*r)-1;checkInt(this,t,e,r,f,0)}var i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},Buffer.prototype.writeUIntBE=function(t,e,r,n){if(t=+t,e=0|e,r=0|r,!n){var f=Math.pow(2,8*r)-1;checkInt(this,t,e,r,f,0)}var i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},Buffer.prototype.writeUInt8=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,1,255,0),Buffer.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},Buffer.prototype.writeUInt16LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):objectWriteUInt16(this,t,e,!0),e+2},Buffer.prototype.writeUInt16BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):objectWriteUInt16(this,t,e,!1),e+2},Buffer.prototype.writeUInt32LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):objectWriteUInt32(this,t,e,!0),e+4},Buffer.prototype.writeUInt32BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):objectWriteUInt32(this,t,e,!1),e+4},Buffer.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e=0|e,!n){var f=Math.pow(2,8*r-1);checkInt(this,t,e,r,f-1,-f)}var i=0,o=1,u=0;for(this[e]=255&t;++i<r&&(o*=256);)0>t&&0===u&&0!==this[e+i-1]&&(u=1),this[e+i]=(t/o>>0)-u&255;return e+r},Buffer.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e=0|e,!n){var f=Math.pow(2,8*r-1);checkInt(this,t,e,r,f-1,-f)}var i=r-1,o=1,u=0;for(this[e+i]=255&t;--i>=0&&(o*=256);)0>t&&0===u&&0!==this[e+i+1]&&(u=1),this[e+i]=(t/o>>0)-u&255;return e+r},Buffer.prototype.writeInt8=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,1,127,-128),Buffer.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),0>t&&(t=255+t+1),this[e]=255&t,e+1},Buffer.prototype.writeInt16LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):objectWriteUInt16(this,t,e,!0),e+2},Buffer.prototype.writeInt16BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):objectWriteUInt16(this,t,e,!1),e+2},Buffer.prototype.writeInt32LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,2147483647,-2147483648),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):objectWriteUInt32(this,t,e,!0),e+4},Buffer.prototype.writeInt32BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,2147483647,-2147483648),0>t&&(t=4294967295+t+1),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):objectWriteUInt32(this,t,e,!1),e+4},Buffer.prototype.writeFloatLE=function(t,e,r){return writeFloat(this,t,e,!0,r)},Buffer.prototype.writeFloatBE=function(t,e,r){return writeFloat(this,t,e,!1,r)},Buffer.prototype.writeDoubleLE=function(t,e,r){return writeDouble(this,t,e,!0,r)},Buffer.prototype.writeDoubleBE=function(t,e,r){return writeDouble(this,t,e,!1,r)},Buffer.prototype.copy=function(t,e,r,n){if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&r>n&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(0>e)throw new RangeError("targetStart out of bounds");if(0>r||r>=this.length)throw new RangeError("sourceStart out of bounds");if(0>n)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var f,i=n-r;if(this===t&&e>r&&n>e)for(f=i-1;f>=0;f--)t[f+e]=this[f+r];else if(1e3>i||!Buffer.TYPED_ARRAY_SUPPORT)for(f=0;i>f;f++)t[f+e]=this[f+r];else Uint8Array.prototype.set.call(t,this.subarray(r,r+i),e);return i},Buffer.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===t.length){var f=t.charCodeAt(0);256>f&&(t=f)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!Buffer.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t=255&t);if(0>e||this.length<e||this.length<r)throw new RangeError("Out of range index");if(e>=r)return this;e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0);var i;if("number"==typeof t)for(i=e;r>i;i++)this[i]=t;else{var o=Buffer.isBuffer(t)?t:utf8ToBytes(new Buffer(t,n).toString()),u=o.length;for(i=0;r-e>i;i++)this[i+e]=o[i%u]}return this};var INVALID_BASE64_RE=/[^+\/0-9A-Za-z-_]/g;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":18,"ieee754":159,"isarray":61}],61:[function(require,module,exports){
var toString={}.toString;module.exports=Array.isArray||function(r){return"[object Array]"==toString.call(r)};

},{}],62:[function(require,module,exports){
module.exports={100:"Continue",101:"Switching Protocols",102:"Processing",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",208:"Already Reported",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Payload Too Large",414:"URI Too Long",415:"Unsupported Media Type",416:"Range Not Satisfiable",417:"Expectation Failed",418:"I'm a teapot",421:"Misdirected Request",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Unordered Collection",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",508:"Loop Detected",509:"Bandwidth Limit Exceeded",510:"Not Extended",511:"Network Authentication Required"};

},{}],63:[function(require,module,exports){
"use strict";function bytes(e,r){return"string"==typeof e?parse(e):"number"==typeof e?format(e,r):null}function format(e,r){if("number"!=typeof e)return null;var a=Math.abs(e),t=r&&r.thousandsSeparator||"",o=r&&void 0!==r.decimalPlaces?r.decimalPlaces:2,m=Boolean(r&&r.fixedDecimals),p="B";a>=map.tb?p="TB":a>=map.gb?p="GB":a>=map.mb?p="MB":a>=map.kb&&(p="kB");var s=e/map[p.toLowerCase()],n=s.toFixed(o);return m||(n=n.replace(/(?:\.0*|(\.[^0]+)0+)$/,"$1")),t&&(n=n.replace(/\B(?=(\d{3})+(?!\d))/g,t)),n+p}function parse(e){if("number"==typeof e&&!isNaN(e))return e;if("string"!=typeof e)return null;var r,a=e.match(/^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb)$/i),t="b";return a?(r=parseFloat(a[1]),t=a[4].toLowerCase()):(r=parseInt(e),t="b"),map[t]*r}module.exports=bytes,module.exports.format=format,module.exports.parse=parse;var map={b:1,kb:1024,mb:1<<20,gb:1<<30,tb:1024*(1<<30)};

},{}],64:[function(require,module,exports){
(function (Buffer){
function CipherBase(t){Transform.call(this),this.hashMode="string"==typeof t,this.hashMode?this[t]=this._finalOrDigest:this["final"]=this._finalOrDigest,this._decoder=null,this._encoding=null}var Transform=require("stream").Transform,inherits=require("inherits"),StringDecoder=require("string_decoder").StringDecoder;module.exports=CipherBase,inherits(CipherBase,Transform),CipherBase.prototype.update=function(t,e,r){"string"==typeof t&&(t=new Buffer(t,e));var i=this._update(t);return this.hashMode?this:(r&&(i=this._toString(i,r)),i)},CipherBase.prototype.setAutoPadding=function(){},CipherBase.prototype.getAuthTag=function(){throw new Error("trying to get auth tag in unsupported state")},CipherBase.prototype.setAuthTag=function(){throw new Error("trying to set auth tag in unsupported state")},CipherBase.prototype.setAAD=function(){throw new Error("trying to set aad in unsupported state")},CipherBase.prototype._transform=function(t,e,r){var i;try{this.hashMode?this._update(t):this.push(this._update(t))}catch(n){i=n}finally{r(i)}},CipherBase.prototype._flush=function(t){var e;try{this.push(this._final())}catch(r){e=r}finally{t(e)}},CipherBase.prototype._finalOrDigest=function(t){var e=this._final()||new Buffer("");return t&&(e=this._toString(e,t,!0)),e},CipherBase.prototype._toString=function(t,e,r){if(this._decoder||(this._decoder=new StringDecoder(e),this._encoding=e),this._encoding!==e)throw new Error("can't switch encodings");var i=this._decoder.write(t);return r&&(i+=this._decoder.end()),i};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"inherits":161,"stream":241,"string_decoder":246}],65:[function(require,module,exports){
(function (Buffer){
"use strict";function contentDisposition(e,t){var r=t||{},n=r.type||"attachment",a=createparams(e,r.fallback);return format(new ContentDisposition(n,a))}function createparams(e,t){if(void 0!==e){var r={};if("string"!=typeof e)throw new TypeError("filename must be a string");if(void 0===t&&(t=!0),"string"!=typeof t&&"boolean"!=typeof t)throw new TypeError("fallback must be a string or boolean");if("string"==typeof t&&nonLatin1RegExp.test(t))throw new TypeError("fallback must be ISO-8859-1 string");var n=basename(e),a=textRegExp.test(n),o="string"!=typeof t?t&&getlatin1(n):basename(t),i="string"==typeof o&&o!==n;return(i||!a||hexEscapeRegExp.test(n))&&(r["filename*"]=n),(a||i)&&(r.filename=i?o:n),r}}function format(e){var t=e.parameters,r=e.type;if(!r||"string"!=typeof r||!tokenRegExp.test(r))throw new TypeError("invalid type");var n=String(r).toLowerCase();if(t&&"object"==typeof t)for(var a,o=Object.keys(t).sort(),i=0;i<o.length;i++){a=o[i];var p="*"===a.substr(-1)?ustring(t[a]):qstring(t[a]);n+="; "+a+"="+p}return n}function decodefield(e){var t=extValueRegExp.exec(e);if(!t)throw new TypeError("invalid extended field value");var r,n=t[1].toLowerCase(),a=t[2],o=a.replace(hexEscapeReplaceRegExp,pdecode);switch(n){case"iso-8859-1":r=getlatin1(o);break;case"utf-8":r=new Buffer(o,"binary").toString("utf8");break;default:throw new TypeError("unsupported charset in extended field")}return r}function getlatin1(e){return String(e).replace(nonLatin1RegExp,"?")}function parse(e){if(!e||"string"!=typeof e)throw new TypeError("argument string is required");var t=dispositionTypeRegExp.exec(e);if(!t)throw new TypeError("invalid type format");var r,n,a=t[0].length,o=t[1].toLowerCase(),i=[],p={};for(a=paramRegExp.lastIndex=";"===t[0].substr(-1)?a-1:a;t=paramRegExp.exec(e);){if(t.index!==a)throw new TypeError("invalid parameter format");if(a+=t[0].length,r=t[1].toLowerCase(),n=t[2],-1!==i.indexOf(r))throw new TypeError("invalid duplicate parameter");i.push(r),r.indexOf("*")+1!==r.length?"string"!=typeof p[r]&&('"'===n[0]&&(n=n.substr(1,n.length-2).replace(qescRegExp,"$1")),p[r]=n):(r=r.slice(0,-1),n=decodefield(n),p[r]=n)}if(-1!==a&&a!==e.length)throw new TypeError("invalid parameter format");return new ContentDisposition(o,p)}function pdecode(e,t){return String.fromCharCode(parseInt(t,16))}function pencode(e){var t=String(e).charCodeAt(0).toString(16).toUpperCase();return 1===t.length?"%0"+t:"%"+t}function qstring(e){var t=String(e);return'"'+t.replace(quoteRegExp,"\\$1")+'"'}function ustring(e){var t=String(e),r=encodeURIComponent(t).replace(encodeUriAttrCharRegExp,pencode);return"UTF-8''"+r}function ContentDisposition(e,t){this.type=e,this.parameters=t}module.exports=contentDisposition,module.exports.parse=parse;var basename=require("path").basename,encodeUriAttrCharRegExp=/[\x00-\x20"'\(\)*,\/:;<=>?@\[\\\]\{\}\x7f]/g,hexEscapeRegExp=/%[0-9A-Fa-f]{2}/,hexEscapeReplaceRegExp=/%([0-9A-Fa-f]{2})/g,nonLatin1RegExp=/[^\x20-\x7e\xa0-\xff]/g,qescRegExp=/\\([\u0000-\u007f])/g,quoteRegExp=/([\\"])/g,paramRegExp=/; *([!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) *= *("(?:[ !\x23-\x5b\x5d-\x7e\x80-\xff]|\\[\x20-\x7e])*"|[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) */g,textRegExp=/^[\x20-\x7e\x80-\xff]+$/,tokenRegExp=/^[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+$/,extValueRegExp=/^([A-Za-z0-9!#$%&+\-^_`{}~]+)'(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4,8}|)'((?:%[0-9A-Fa-f]{2}|[A-Za-z0-9!#$&+\-\.^_`|~])+)$/,dispositionTypeRegExp=/^([!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) *(?:$|;)/;

}).call(this,require("buffer").Buffer)
},{"buffer":60,"path":197}],66:[function(require,module,exports){
function format(e){if(!e||"object"!=typeof e)throw new TypeError("argument obj is required");var t=e.parameters,r=e.type;if(!r||!typeRegExp.test(r))throw new TypeError("invalid type");var n=r;if(t&&"object"==typeof t)for(var o,a=Object.keys(t).sort(),p=0;p<a.length;p++){if(o=a[p],!tokenRegExp.test(o))throw new TypeError("invalid parameter name");n+="; "+o+"="+qstring(t[o])}return n}function parse(e){if(!e)throw new TypeError("argument string is required");if("object"==typeof e&&(e=getcontenttype(e),"string"!=typeof e))throw new TypeError("content-type header is missing from object");if("string"!=typeof e)throw new TypeError("argument string is required to be a string");var t=e.indexOf(";"),r=-1!==t?e.substr(0,t).trim():e.trim();if(!typeRegExp.test(r))throw new TypeError("invalid media type");var n,o,a,p=new ContentType(r.toLowerCase());for(paramRegExp.lastIndex=t;o=paramRegExp.exec(e);){if(o.index!==t)throw new TypeError("invalid parameter format");t+=o[0].length,n=o[1].toLowerCase(),a=o[2],'"'===a[0]&&(a=a.substr(1,a.length-2).replace(qescRegExp,"$1")),p.parameters[n]=a}if(-1!==t&&t!==e.length)throw new TypeError("invalid parameter format");return p}function getcontenttype(e){return"function"==typeof e.getHeader?e.getHeader("content-type"):"object"==typeof e.headers?e.headers&&e.headers["content-type"]:void 0}function qstring(e){var t=String(e);if(tokenRegExp.test(t))return t;if(t.length>0&&!textRegExp.test(t))throw new TypeError("invalid parameter value");return'"'+t.replace(quoteRegExp,"\\$1")+'"'}function ContentType(e){this.parameters=Object.create(null),this.type=e}var paramRegExp=/; *([!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+) */g,textRegExp=/^[\u000b\u0020-\u007e\u0080-\u00ff]+$/,tokenRegExp=/^[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+$/,qescRegExp=/\\([\u000b\u0020-\u00ff])/g,quoteRegExp=/([\\"])/g,typeRegExp=/^[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+\/[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+$/;exports.format=format,exports.parse=parse;

},{}],67:[function(require,module,exports){
function sha1(e){return crypto.createHash("sha1").update(e).digest("hex")}var crypto=require("crypto");exports.sign=function(e,r){if("string"!=typeof e)throw new TypeError("Cookie value must be provided as a string.");if("string"!=typeof r)throw new TypeError("Secret string must be provided.");return e+"."+crypto.createHmac("sha256",r).update(e).digest("base64").replace(/\=+$/,"")},exports.unsign=function(e,r){if("string"!=typeof e)throw new TypeError("Signed cookie string must be provided.");if("string"!=typeof r)throw new TypeError("Secret string must be provided.");var t=e.slice(0,e.lastIndexOf(".")),o=exports.sign(t,r);return sha1(o)==sha1(e)?t:!1};

},{"crypto":75}],68:[function(require,module,exports){
function parse(e,r){if("string"!=typeof e)throw new TypeError("argument str must be a string");var t={},n=r||{},i=e.split(/; */),o=n.decode||decode;return i.forEach(function(e){var r=e.indexOf("=");if(!(0>r)){var n=e.substr(0,r).trim(),i=e.substr(++r,e.length).trim();'"'==i[0]&&(i=i.slice(1,-1)),void 0==t[n]&&(t[n]=tryDecode(i,o))}}),t}function serialize(e,r,t){var n=t||{},i=n.encode||encode;if(!fieldContentRegExp.test(e))throw new TypeError("argument name is invalid");var o=i(r);if(o&&!fieldContentRegExp.test(o))throw new TypeError("argument val is invalid");var a=[e+"="+o];if(null!=n.maxAge){var s=n.maxAge-0;if(isNaN(s))throw new Error("maxAge should be a Number");a.push("Max-Age="+s)}if(n.domain){if(!fieldContentRegExp.test(n.domain))throw new TypeError("option domain is invalid");a.push("Domain="+n.domain)}if(n.path){if(!fieldContentRegExp.test(n.path))throw new TypeError("option path is invalid");a.push("Path="+n.path)}return n.expires&&a.push("Expires="+n.expires.toUTCString()),n.httpOnly&&a.push("HttpOnly"),n.secure&&a.push("Secure"),a.join("; ")}function tryDecode(e,r){try{return r(e)}catch(t){return e}}exports.parse=parse,exports.serialize=serialize;var decode=decodeURIComponent,encode=encodeURIComponent,fieldContentRegExp=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

},{}],69:[function(require,module,exports){
(function (Buffer){
function isArray(r){return Array.isArray?Array.isArray(r):"[object Array]"===objectToString(r)}function isBoolean(r){return"boolean"==typeof r}function isNull(r){return null===r}function isNullOrUndefined(r){return null==r}function isNumber(r){return"number"==typeof r}function isString(r){return"string"==typeof r}function isSymbol(r){return"symbol"==typeof r}function isUndefined(r){return void 0===r}function isRegExp(r){return"[object RegExp]"===objectToString(r)}function isObject(r){return"object"==typeof r&&null!==r}function isDate(r){return"[object Date]"===objectToString(r)}function isError(r){return"[object Error]"===objectToString(r)||r instanceof Error}function isFunction(r){return"function"==typeof r}function isPrimitive(r){return null===r||"boolean"==typeof r||"number"==typeof r||"string"==typeof r||"symbol"==typeof r||"undefined"==typeof r}function objectToString(r){return Object.prototype.toString.call(r)}exports.isArray=isArray,exports.isBoolean=isBoolean,exports.isNull=isNull,exports.isNullOrUndefined=isNullOrUndefined,exports.isNumber=isNumber,exports.isString=isString,exports.isSymbol=isSymbol,exports.isUndefined=isUndefined,exports.isRegExp=isRegExp,exports.isObject=isObject,exports.isDate=isDate,exports.isError=isError,exports.isFunction=isFunction,exports.isPrimitive=isPrimitive,exports.isBuffer=Buffer.isBuffer;

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":163}],70:[function(require,module,exports){
(function (Buffer){
function ECDH(e){this.curveType=aliases[e],this.curveType||(this.curveType={name:e}),this.curve=new elliptic.ec(this.curveType.name),this.keys=void 0}function formatReturnValue(e,t,r){Array.isArray(e)||(e=e.toArray());var i=new Buffer(e);if(r&&i.length<r){var s=new Buffer(r-i.length);s.fill(0),i=Buffer.concat([s,i])}return t?i.toString(t):i}var elliptic=require("elliptic"),BN=require("bn.js");module.exports=function(e){return new ECDH(e)};var aliases={secp256k1:{name:"secp256k1",byteLength:32},secp224r1:{name:"p224",byteLength:28},prime256v1:{name:"p256",byteLength:32},prime192v1:{name:"p192",byteLength:24},ed25519:{name:"ed25519",byteLength:32},secp384r1:{name:"p384",byteLength:48},secp521r1:{name:"p521",byteLength:66}};aliases.p224=aliases.secp224r1,aliases.p256=aliases.secp256r1=aliases.prime256v1,aliases.p192=aliases.secp192r1=aliases.prime192v1,aliases.p384=aliases.secp384r1,aliases.p521=aliases.secp521r1,ECDH.prototype.generateKeys=function(e,t){return this.keys=this.curve.genKeyPair(),this.getPublicKey(e,t)},ECDH.prototype.computeSecret=function(e,t,r){t=t||"utf8",Buffer.isBuffer(e)||(e=new Buffer(e,t));var i=this.curve.keyFromPublic(e).getPublic(),s=i.mul(this.keys.getPrivate()).getX();return formatReturnValue(s,r,this.curveType.byteLength)},ECDH.prototype.getPublicKey=function(e,t){var r=this.keys.getPublic("compressed"===t,!0);return"hybrid"===t&&(r[r.length-1]%2?r[0]=7:r[0]=6),formatReturnValue(r,e)},ECDH.prototype.getPrivateKey=function(e){return formatReturnValue(this.keys.getPrivate(),e)},ECDH.prototype.setPublicKey=function(e,t){return t=t||"utf8",Buffer.isBuffer(e)||(e=new Buffer(e,t)),this.keys._importPublic(e),this},ECDH.prototype.setPrivateKey=function(e,t){t=t||"utf8",Buffer.isBuffer(e)||(e=new Buffer(e,t));var r=new BN(e);return r=r.toString(16),this.keys._importPrivate(r),this};

}).call(this,require("buffer").Buffer)
},{"bn.js":19,"buffer":60,"elliptic":91}],71:[function(require,module,exports){
(function (Buffer){
"use strict";function HashNoConstructor(s){Base.call(this,"digest"),this._hash=s,this.buffers=[]}function Hash(s){Base.call(this,"digest"),this._hash=s}var inherits=require("inherits"),md5=require("./md5"),rmd160=require("ripemd160"),sha=require("sha.js"),Base=require("cipher-base");inherits(HashNoConstructor,Base),HashNoConstructor.prototype._update=function(s){this.buffers.push(s)},HashNoConstructor.prototype._final=function(){var s=Buffer.concat(this.buffers),t=this._hash(s);return this.buffers=null,t},inherits(Hash,Base),Hash.prototype._update=function(s){this._hash.update(s)},Hash.prototype._final=function(){return this._hash.digest()},module.exports=function(s){return s=s.toLowerCase(),"md5"===s?new HashNoConstructor(md5):"rmd160"===s||"ripemd160"===s?new HashNoConstructor(rmd160):new Hash(sha(s))};

}).call(this,require("buffer").Buffer)
},{"./md5":73,"buffer":60,"cipher-base":64,"inherits":161,"ripemd160":228,"sha.js":232}],72:[function(require,module,exports){
(function (Buffer){
"use strict";function toArray(r,e){if(r.length%intSize!==0){var t=r.length+(intSize-r.length%intSize);r=Buffer.concat([r,zeroBuffer],t)}for(var f=[],n=e?r.readInt32BE:r.readInt32LE,i=0;i<r.length;i+=intSize)f.push(n.call(r,i));return f}function toBuffer(r,e,t){for(var f=new Buffer(e),n=t?f.writeInt32BE:f.writeInt32LE,i=0;i<r.length;i++)n.call(f,r[i],4*i,!0);return f}function hash(r,e,t,f){Buffer.isBuffer(r)||(r=new Buffer(r));var n=e(toArray(r,f),r.length*chrsz);return toBuffer(n,t,f)}var intSize=4,zeroBuffer=new Buffer(intSize);zeroBuffer.fill(0);var chrsz=8;exports.hash=hash;

}).call(this,require("buffer").Buffer)
},{"buffer":60}],73:[function(require,module,exports){
"use strict";function core_md5(d,_){d[_>>5]|=128<<_%32,d[(_+64>>>9<<4)+14]=_;for(var m=1732584193,f=-271733879,i=-1732584194,h=271733878,r=0;r<d.length;r+=16){var g=m,n=f,e=i,a=h;m=md5_ff(m,f,i,h,d[r+0],7,-680876936),h=md5_ff(h,m,f,i,d[r+1],12,-389564586),i=md5_ff(i,h,m,f,d[r+2],17,606105819),f=md5_ff(f,i,h,m,d[r+3],22,-1044525330),m=md5_ff(m,f,i,h,d[r+4],7,-176418897),h=md5_ff(h,m,f,i,d[r+5],12,1200080426),i=md5_ff(i,h,m,f,d[r+6],17,-1473231341),f=md5_ff(f,i,h,m,d[r+7],22,-45705983),m=md5_ff(m,f,i,h,d[r+8],7,1770035416),h=md5_ff(h,m,f,i,d[r+9],12,-1958414417),i=md5_ff(i,h,m,f,d[r+10],17,-42063),f=md5_ff(f,i,h,m,d[r+11],22,-1990404162),m=md5_ff(m,f,i,h,d[r+12],7,1804603682),h=md5_ff(h,m,f,i,d[r+13],12,-40341101),i=md5_ff(i,h,m,f,d[r+14],17,-1502002290),f=md5_ff(f,i,h,m,d[r+15],22,1236535329),m=md5_gg(m,f,i,h,d[r+1],5,-165796510),h=md5_gg(h,m,f,i,d[r+6],9,-1069501632),i=md5_gg(i,h,m,f,d[r+11],14,643717713),f=md5_gg(f,i,h,m,d[r+0],20,-373897302),m=md5_gg(m,f,i,h,d[r+5],5,-701558691),h=md5_gg(h,m,f,i,d[r+10],9,38016083),i=md5_gg(i,h,m,f,d[r+15],14,-660478335),f=md5_gg(f,i,h,m,d[r+4],20,-405537848),m=md5_gg(m,f,i,h,d[r+9],5,568446438),h=md5_gg(h,m,f,i,d[r+14],9,-1019803690),i=md5_gg(i,h,m,f,d[r+3],14,-187363961),f=md5_gg(f,i,h,m,d[r+8],20,1163531501),m=md5_gg(m,f,i,h,d[r+13],5,-1444681467),h=md5_gg(h,m,f,i,d[r+2],9,-51403784),i=md5_gg(i,h,m,f,d[r+7],14,1735328473),f=md5_gg(f,i,h,m,d[r+12],20,-1926607734),m=md5_hh(m,f,i,h,d[r+5],4,-378558),h=md5_hh(h,m,f,i,d[r+8],11,-2022574463),i=md5_hh(i,h,m,f,d[r+11],16,1839030562),f=md5_hh(f,i,h,m,d[r+14],23,-35309556),m=md5_hh(m,f,i,h,d[r+1],4,-1530992060),h=md5_hh(h,m,f,i,d[r+4],11,1272893353),i=md5_hh(i,h,m,f,d[r+7],16,-155497632),f=md5_hh(f,i,h,m,d[r+10],23,-1094730640),m=md5_hh(m,f,i,h,d[r+13],4,681279174),h=md5_hh(h,m,f,i,d[r+0],11,-358537222),i=md5_hh(i,h,m,f,d[r+3],16,-722521979),f=md5_hh(f,i,h,m,d[r+6],23,76029189),m=md5_hh(m,f,i,h,d[r+9],4,-640364487),h=md5_hh(h,m,f,i,d[r+12],11,-421815835),i=md5_hh(i,h,m,f,d[r+15],16,530742520),f=md5_hh(f,i,h,m,d[r+2],23,-995338651),m=md5_ii(m,f,i,h,d[r+0],6,-198630844),h=md5_ii(h,m,f,i,d[r+7],10,1126891415),i=md5_ii(i,h,m,f,d[r+14],15,-1416354905),f=md5_ii(f,i,h,m,d[r+5],21,-57434055),m=md5_ii(m,f,i,h,d[r+12],6,1700485571),h=md5_ii(h,m,f,i,d[r+3],10,-1894986606),i=md5_ii(i,h,m,f,d[r+10],15,-1051523),f=md5_ii(f,i,h,m,d[r+1],21,-2054922799),m=md5_ii(m,f,i,h,d[r+8],6,1873313359),h=md5_ii(h,m,f,i,d[r+15],10,-30611744),i=md5_ii(i,h,m,f,d[r+6],15,-1560198380),f=md5_ii(f,i,h,m,d[r+13],21,1309151649),m=md5_ii(m,f,i,h,d[r+4],6,-145523070),h=md5_ii(h,m,f,i,d[r+11],10,-1120210379),i=md5_ii(i,h,m,f,d[r+2],15,718787259),f=md5_ii(f,i,h,m,d[r+9],21,-343485551),m=safe_add(m,g),f=safe_add(f,n),i=safe_add(i,e),h=safe_add(h,a)}return Array(m,f,i,h)}function md5_cmn(d,_,m,f,i,h){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,h)),i),m)}function md5_ff(d,_,m,f,i,h,r){return md5_cmn(_&m|~_&f,d,_,i,h,r)}function md5_gg(d,_,m,f,i,h,r){return md5_cmn(_&f|m&~f,d,_,i,h,r)}function md5_hh(d,_,m,f,i,h,r){return md5_cmn(_^m^f,d,_,i,h,r)}function md5_ii(d,_,m,f,i,h,r){return md5_cmn(m^(_|~f),d,_,i,h,r)}function safe_add(d,_){var m=(65535&d)+(65535&_),f=(d>>16)+(_>>16)+(m>>16);return f<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}var helpers=require("./helpers");module.exports=function(d){return helpers.hash(d,core_md5,16)};

},{"./helpers":72}],74:[function(require,module,exports){
(function (Buffer){
"use strict";function Hmac(t,e){Transform.call(this),t=t.toLowerCase(),"string"==typeof e&&(e=new Buffer(e));var r="sha512"===t||"sha384"===t?128:64;this._alg=t,this._key=e,e.length>r?e=createHash(t).update(e).digest():e.length<r&&(e=Buffer.concat([e,ZEROS],r));for(var a=this._ipad=new Buffer(r),s=this._opad=new Buffer(r),i=0;r>i;i++)a[i]=54^e[i],s[i]=92^e[i];this._hash=createHash(t).update(a)}var createHash=require("create-hash/browser"),inherits=require("inherits"),Transform=require("stream").Transform,ZEROS=new Buffer(128);ZEROS.fill(0),inherits(Hmac,Transform),Hmac.prototype.update=function(t,e){return this._hash.update(t,e),this},Hmac.prototype._transform=function(t,e,r){this._hash.update(t),r()},Hmac.prototype._flush=function(t){this.push(this.digest()),t()},Hmac.prototype.digest=function(t){var e=this._hash.digest();return createHash(this._alg).update(this._opad).update(e).digest(t)},module.exports=function(t,e){return new Hmac(t,e)};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"create-hash/browser":71,"inherits":161,"stream":241}],75:[function(require,module,exports){
"use strict";exports.randomBytes=exports.rng=exports.pseudoRandomBytes=exports.prng=require("randombytes"),exports.createHash=exports.Hash=require("create-hash"),exports.createHmac=exports.Hmac=require("create-hmac");var hashes=["sha1","sha224","sha256","sha384","sha512","md5","rmd160"].concat(Object.keys(require("browserify-sign/algos")));exports.getHashes=function(){return hashes};var p=require("pbkdf2");exports.pbkdf2=p.pbkdf2,exports.pbkdf2Sync=p.pbkdf2Sync;var aes=require("browserify-cipher");["Cipher","createCipher","Cipheriv","createCipheriv","Decipher","createDecipher","Decipheriv","createDecipheriv","getCiphers","listCiphers"].forEach(function(e){exports[e]=aes[e]});var dh=require("diffie-hellman");["DiffieHellmanGroup","createDiffieHellmanGroup","getDiffieHellman","createDiffieHellman","DiffieHellman"].forEach(function(e){exports[e]=dh[e]});var sign=require("browserify-sign");["createSign","Sign","createVerify","Verify"].forEach(function(e){exports[e]=sign[e]}),exports.createECDH=require("create-ecdh");var publicEncrypt=require("public-encrypt");["publicEncrypt","privateEncrypt","publicDecrypt","privateDecrypt"].forEach(function(e){exports[e]=publicEncrypt[e]}),["createCredentials"].forEach(function(e){exports[e]=function(){throw new Error(["sorry, "+e+" is not implemented yet","we accept pull requests","https://github.com/crypto-browserify/crypto-browserify"].join("\n"))}});

},{"browserify-cipher":47,"browserify-sign":52,"browserify-sign/algos":51,"create-ecdh":70,"create-hash":71,"create-hmac":74,"diffie-hellman":86,"pbkdf2":199,"public-encrypt":203,"randombytes":213}],76:[function(require,module,exports){
function useColors(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}function formatArgs(){var o=arguments,e=this.useColors;if(o[0]=(e?"%c":"")+this.namespace+(e?" %c":" ")+o[0]+(e?"%c ":" ")+"+"+exports.humanize(this.diff),!e)return o;var r="color: "+this.color;o=[o[0],r,"color: inherit"].concat(Array.prototype.slice.call(o,1));var t=0,s=0;return o[0].replace(/%[a-z%]/g,function(o){"%%"!==o&&(t++,"%c"===o&&(s=t))}),o.splice(s,0,r),o}function log(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function save(o){try{null==o?exports.storage.removeItem("debug"):exports.storage.debug=o}catch(e){}}function load(){var o;try{o=exports.storage.debug}catch(e){}return o}function localstorage(){try{return window.localStorage}catch(o){}}exports=module.exports=require("./debug"),exports.log=log,exports.formatArgs=formatArgs,exports.save=save,exports.load=load,exports.useColors=useColors,exports.storage="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:localstorage(),exports.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],exports.formatters.j=function(o){return JSON.stringify(o)},exports.enable(load());

},{"./debug":77}],77:[function(require,module,exports){
function selectColor(){return exports.colors[prevColor++%exports.colors.length]}function debug(e){function r(){}function o(){var e=o,r=+new Date,s=r-(prevTime||r);e.diff=s,e.prev=prevTime,e.curr=r,prevTime=r,null==e.useColors&&(e.useColors=exports.useColors()),null==e.color&&e.useColors&&(e.color=selectColor());var t=Array.prototype.slice.call(arguments);t[0]=exports.coerce(t[0]),"string"!=typeof t[0]&&(t=["%o"].concat(t));var n=0;t[0]=t[0].replace(/%([a-z%])/g,function(r,o){if("%%"===r)return r;n++;var s=exports.formatters[o];if("function"==typeof s){var p=t[n];r=s.call(e,p),t.splice(n,1),n--}return r}),"function"==typeof exports.formatArgs&&(t=exports.formatArgs.apply(e,t));var p=o.log||exports.log||console.log.bind(console);p.apply(e,t)}r.enabled=!1,o.enabled=!0;var s=exports.enabled(e)?o:r;return s.namespace=e,s}function enable(e){exports.save(e);for(var r=(e||"").split(/[\s,]+/),o=r.length,s=0;o>s;s++)r[s]&&(e=r[s].replace(/\*/g,".*?"),"-"===e[0]?exports.skips.push(new RegExp("^"+e.substr(1)+"$")):exports.names.push(new RegExp("^"+e+"$")))}function disable(){exports.enable("")}function enabled(e){var r,o;for(r=0,o=exports.skips.length;o>r;r++)if(exports.skips[r].test(e))return!1;for(r=0,o=exports.names.length;o>r;r++)if(exports.names[r].test(e))return!0;return!1}function coerce(e){return e instanceof Error?e.stack||e.message:e}exports=module.exports=debug,exports.coerce=coerce,exports.disable=disable,exports.enable=enable,exports.enabled=enabled,exports.humanize=require("ms"),exports.names=[],exports.skips=[],exports.formatters={};var prevColor=0,prevTime;

},{"ms":174}],78:[function(require,module,exports){
"use strict";function depd(r){function e(r){}if(!r)throw new TypeError("argument namespace is required");return e._file=void 0,e._ignored=!0,e._namespace=r,e._traced=!1,e._warned=Object.create(null),e["function"]=wrapfunction,e.property=wrapproperty,e}function wrapfunction(r,e){if("function"!=typeof r)throw new TypeError("argument fn must be a function");return r}function wrapproperty(r,e,t){if(!r||"object"!=typeof r&&"function"!=typeof r)throw new TypeError("argument obj must be object");var o=Object.getOwnPropertyDescriptor(r,e);if(!o)throw new TypeError("must call property on owner object");if(!o.configurable)throw new TypeError("property must be configurable")}module.exports=depd;

},{}],79:[function(require,module,exports){
"use strict";exports.utils=require("./des/utils"),exports.Cipher=require("./des/cipher"),exports.DES=require("./des/des"),exports.CBC=require("./des/cbc"),exports.EDE=require("./des/ede");

},{"./des/cbc":80,"./des/cipher":81,"./des/des":82,"./des/ede":83,"./des/utils":84}],80:[function(require,module,exports){
"use strict";function CBCState(t){assert.equal(t.length,8,"Invalid IV length"),this.iv=new Array(8);for(var i=0;i<this.iv.length;i++)this.iv[i]=t[i]}function instantiate(t){function i(i){t.call(this,i),this._cbcInit()}inherits(i,t);for(var e=Object.keys(proto),r=0;r<e.length;r++){var n=e[r];i.prototype[n]=proto[n]}return i.create=function(t){return new i(t)},i}var assert=require("minimalistic-assert"),inherits=require("inherits"),proto={};exports.instantiate=instantiate,proto._cbcInit=function(){var t=new CBCState(this.options.iv);this._cbcState=t},proto._update=function(t,i,e,r){var n=this._cbcState,s=this.constructor.super_.prototype,o=n.iv;if("encrypt"===this.type){for(var a=0;a<this.blockSize;a++)o[a]^=t[i+a];s._update.call(this,o,0,e,r);for(var a=0;a<this.blockSize;a++)o[a]=e[r+a]}else{s._update.call(this,t,i,e,r);for(var a=0;a<this.blockSize;a++)e[r+a]^=o[a];for(var a=0;a<this.blockSize;a++)o[a]=t[i+a]}};

},{"inherits":161,"minimalistic-assert":173}],81:[function(require,module,exports){
"use strict";function Cipher(t){this.options=t,this.type=this.options.type,this.blockSize=8,this._init(),this.buffer=new Array(this.blockSize),this.bufferOff=0}var assert=require("minimalistic-assert");module.exports=Cipher,Cipher.prototype._init=function(){},Cipher.prototype.update=function(t){return 0===t.length?[]:"decrypt"===this.type?this._updateDecrypt(t):this._updateEncrypt(t)},Cipher.prototype._buffer=function(t,e){for(var r=Math.min(this.buffer.length-this.bufferOff,t.length-e),i=0;r>i;i++)this.buffer[this.bufferOff+i]=t[e+i];return this.bufferOff+=r,r},Cipher.prototype._flushBuffer=function(t,e){return this._update(this.buffer,0,t,e),this.bufferOff=0,this.blockSize},Cipher.prototype._updateEncrypt=function(t){var e=0,r=0,i=(this.bufferOff+t.length)/this.blockSize|0,f=new Array(i*this.blockSize);0!==this.bufferOff&&(e+=this._buffer(t,e),this.bufferOff===this.buffer.length&&(r+=this._flushBuffer(f,r)));for(var h=t.length-(t.length-e)%this.blockSize;h>e;e+=this.blockSize)this._update(t,e,f,r),r+=this.blockSize;for(;e<t.length;e++,this.bufferOff++)this.buffer[this.bufferOff]=t[e];return f},Cipher.prototype._updateDecrypt=function(t){for(var e=0,r=0,i=Math.ceil((this.bufferOff+t.length)/this.blockSize)-1,f=new Array(i*this.blockSize);i>0;i--)e+=this._buffer(t,e),r+=this._flushBuffer(f,r);return e+=this._buffer(t,e),f},Cipher.prototype["final"]=function(t){var e;t&&(e=this.update(t));var r;return r="encrypt"===this.type?this._finalEncrypt():this._finalDecrypt(),e?e.concat(r):r},Cipher.prototype._pad=function(t,e){if(0===e)return!1;for(;e<t.length;)t[e++]=0;return!0},Cipher.prototype._finalEncrypt=function(){if(!this._pad(this.buffer,this.bufferOff))return[];var t=new Array(this.blockSize);return this._update(this.buffer,0,t,0),t},Cipher.prototype._unpad=function(t){return t},Cipher.prototype._finalDecrypt=function(){assert.equal(this.bufferOff,this.blockSize,"Not enough data to decrypt");var t=new Array(this.blockSize);return this._flushBuffer(t,0),this._unpad(t)};

},{"minimalistic-assert":173}],82:[function(require,module,exports){
"use strict";function DESState(){this.tmp=new Array(2),this.keys=null}function DES(t){Cipher.call(this,t);var e=new DESState;this._desState=e,this.deriveKeys(e,t.key)}var assert=require("minimalistic-assert"),inherits=require("inherits"),des=require("../des"),utils=des.utils,Cipher=des.Cipher;inherits(DES,Cipher),module.exports=DES,DES.create=function(t){return new DES(t)};var shiftTable=[1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];DES.prototype.deriveKeys=function(t,e){t.keys=new Array(32),assert.equal(e.length,this.blockSize,"Invalid key length");var r=utils.readUInt32BE(e,0),s=utils.readUInt32BE(e,4);utils.pc1(r,s,t.tmp,0),r=t.tmp[0],s=t.tmp[1];for(var i=0;i<t.keys.length;i+=2){var n=shiftTable[i>>>1];r=utils.r28shl(r,n),s=utils.r28shl(s,n),utils.pc2(r,s,t.keys,i)}},DES.prototype._update=function(t,e,r,s){var i=this._desState,n=utils.readUInt32BE(t,e),p=utils.readUInt32BE(t,e+4);utils.ip(n,p,i.tmp,0),n=i.tmp[0],p=i.tmp[1],"encrypt"===this.type?this._encrypt(i,n,p,i.tmp,0):this._decrypt(i,n,p,i.tmp,0),n=i.tmp[0],p=i.tmp[1],utils.writeUInt32BE(r,n,s),utils.writeUInt32BE(r,p,s+4)},DES.prototype._pad=function(t,e){for(var r=t.length-e,s=e;s<t.length;s++)t[s]=r;return!0},DES.prototype._unpad=function(t){for(var e=t[t.length-1],r=t.length-e;r<t.length;r++)assert.equal(t[r],e);return t.slice(0,t.length-e)},DES.prototype._encrypt=function(t,e,r,s,i){for(var n=e,p=r,u=0;u<t.keys.length;u+=2){var l=t.keys[u],a=t.keys[u+1];utils.expand(p,t.tmp,0),l^=t.tmp[0],a^=t.tmp[1];var h=utils.substitute(l,a),o=utils.permute(h),y=p;p=(n^o)>>>0,n=y}utils.rip(p,n,s,i)},DES.prototype._decrypt=function(t,e,r,s,i){for(var n=r,p=e,u=t.keys.length-2;u>=0;u-=2){var l=t.keys[u],a=t.keys[u+1];utils.expand(n,t.tmp,0),l^=t.tmp[0],a^=t.tmp[1];var h=utils.substitute(l,a),o=utils.permute(h),y=n;n=(p^o)>>>0,p=y}utils.rip(n,p,s,i)};

},{"../des":79,"inherits":161,"minimalistic-assert":173}],83:[function(require,module,exports){
"use strict";function EDEState(e,t){assert.equal(t.length,24,"Invalid key length");var r=t.slice(0,8),p=t.slice(8,16),i=t.slice(16,24);"encrypt"===e?this.ciphers=[DES.create({type:"encrypt",key:r}),DES.create({type:"decrypt",key:p}),DES.create({type:"encrypt",key:i})]:this.ciphers=[DES.create({type:"decrypt",key:i}),DES.create({type:"encrypt",key:p}),DES.create({type:"decrypt",key:r})]}function EDE(e){Cipher.call(this,e);var t=new EDEState(this.type,this.options.key);this._edeState=t}var assert=require("minimalistic-assert"),inherits=require("inherits"),des=require("../des"),Cipher=des.Cipher,DES=des.DES;inherits(EDE,Cipher),module.exports=EDE,EDE.create=function(e){return new EDE(e)},EDE.prototype._update=function(e,t,r,p){var i=this._edeState;i.ciphers[0]._update(e,t,r,p),i.ciphers[1]._update(r,p,r,p),i.ciphers[2]._update(r,p,r,p)},EDE.prototype._pad=DES.prototype._pad,EDE.prototype._unpad=DES.prototype._unpad;

},{"../des":79,"inherits":161,"minimalistic-assert":173}],84:[function(require,module,exports){
"use strict";exports.readUInt32BE=function(r,o){var t=r[0+o]<<24|r[1+o]<<16|r[2+o]<<8|r[3+o];return t>>>0},exports.writeUInt32BE=function(r,o,t){r[0+t]=o>>>24,r[1+t]=o>>>16&255,r[2+t]=o>>>8&255,r[3+t]=255&o},exports.ip=function(r,o,t,a){for(var e=0,f=0,n=6;n>=0;n-=2){for(var v=0;24>=v;v+=8)e<<=1,e|=o>>>v+n&1;for(var v=0;24>=v;v+=8)e<<=1,e|=r>>>v+n&1}for(var n=6;n>=0;n-=2){for(var v=1;25>=v;v+=8)f<<=1,f|=o>>>v+n&1;for(var v=1;25>=v;v+=8)f<<=1,f|=r>>>v+n&1}t[a+0]=e>>>0,t[a+1]=f>>>0},exports.rip=function(r,o,t,a){for(var e=0,f=0,n=0;4>n;n++)for(var v=24;v>=0;v-=8)e<<=1,e|=o>>>v+n&1,e<<=1,e|=r>>>v+n&1;for(var n=4;8>n;n++)for(var v=24;v>=0;v-=8)f<<=1,f|=o>>>v+n&1,f<<=1,f|=r>>>v+n&1;t[a+0]=e>>>0,t[a+1]=f>>>0},exports.pc1=function(r,o,t,a){for(var e=0,f=0,n=7;n>=5;n--){for(var v=0;24>=v;v+=8)e<<=1,e|=o>>v+n&1;for(var v=0;24>=v;v+=8)e<<=1,e|=r>>v+n&1}for(var v=0;24>=v;v+=8)e<<=1,e|=o>>v+n&1;for(var n=1;3>=n;n++){for(var v=0;24>=v;v+=8)f<<=1,f|=o>>v+n&1;for(var v=0;24>=v;v+=8)f<<=1,f|=r>>v+n&1}for(var v=0;24>=v;v+=8)f<<=1,f|=r>>v+n&1;t[a+0]=e>>>0,t[a+1]=f>>>0},exports.r28shl=function(r,o){return r<<o&268435455|r>>>28-o};var pc2table=[14,11,17,4,27,23,25,0,13,22,7,18,5,9,16,24,2,20,12,21,1,8,15,26,15,4,25,19,9,1,26,16,5,11,23,8,12,7,17,0,22,3,10,14,6,20,27,24];exports.pc2=function(r,o,t,a){for(var e=0,f=0,n=pc2table.length>>>1,v=0;n>v;v++)e<<=1,e|=r>>>pc2table[v]&1;for(var v=n;v<pc2table.length;v++)f<<=1,f|=o>>>pc2table[v]&1;t[a+0]=e>>>0,t[a+1]=f>>>0},exports.expand=function(r,o,t){var a=0,e=0;a=(1&r)<<5|r>>>27;for(var f=23;f>=15;f-=4)a<<=6,a|=r>>>f&63;for(var f=11;f>=3;f-=4)e|=r>>>f&63,e<<=6;e|=(31&r)<<1|r>>>31,o[t+0]=a>>>0,o[t+1]=e>>>0};var sTable=[14,0,4,15,13,7,1,4,2,14,15,2,11,13,8,1,3,10,10,6,6,12,12,11,5,9,9,5,0,3,7,8,4,15,1,12,14,8,8,2,13,4,6,9,2,1,11,7,15,5,12,11,9,3,7,14,3,10,10,0,5,6,0,13,15,3,1,13,8,4,14,7,6,15,11,2,3,8,4,14,9,12,7,0,2,1,13,10,12,6,0,9,5,11,10,5,0,13,14,8,7,10,11,1,10,3,4,15,13,4,1,2,5,11,8,6,12,7,6,12,9,0,3,5,2,14,15,9,10,13,0,7,9,0,14,9,6,3,3,4,15,6,5,10,1,2,13,8,12,5,7,14,11,12,4,11,2,15,8,1,13,1,6,10,4,13,9,0,8,6,15,9,3,8,0,7,11,4,1,15,2,14,12,3,5,11,10,5,14,2,7,12,7,13,13,8,14,11,3,5,0,6,6,15,9,0,10,3,1,4,2,7,8,2,5,12,11,1,12,10,4,14,15,9,10,3,6,15,9,0,0,6,12,10,11,1,7,13,13,8,15,9,1,4,3,5,14,11,5,12,2,7,8,2,4,14,2,14,12,11,4,2,1,12,7,4,10,7,11,13,6,1,8,5,5,0,3,15,15,10,13,3,0,9,14,8,9,6,4,11,2,8,1,12,11,7,10,1,13,14,7,2,8,13,15,6,9,15,12,0,5,9,6,10,3,4,0,5,14,3,12,10,1,15,10,4,15,2,9,7,2,12,6,9,8,5,0,6,13,1,3,13,4,14,14,0,7,11,5,3,11,8,9,4,14,3,15,2,5,12,2,9,8,5,12,15,3,10,7,11,0,14,4,1,10,7,1,6,13,0,11,8,6,13,4,13,11,0,2,11,14,7,15,4,0,9,8,1,13,10,3,14,12,3,9,5,7,12,5,2,10,15,6,8,1,6,1,6,4,11,11,13,13,8,12,1,3,4,7,10,14,7,10,9,15,5,6,0,8,15,0,14,5,2,9,3,2,12,13,1,2,15,8,13,4,8,6,10,15,3,11,7,1,4,10,12,9,5,3,6,14,11,5,0,0,14,12,9,7,2,7,2,11,1,4,14,1,7,9,4,12,10,14,8,2,13,0,15,6,12,10,9,13,0,15,3,3,5,5,6,8,11];exports.substitute=function(r,o){for(var t=0,a=0;4>a;a++){var e=r>>>18-6*a&63,f=sTable[64*a+e];t<<=4,t|=f}for(var a=0;4>a;a++){var e=o>>>18-6*a&63,f=sTable[256+64*a+e];t<<=4,t|=f}return t>>>0};var permuteTable=[16,25,12,11,3,20,4,15,31,17,9,6,27,14,1,22,30,24,8,18,0,5,29,23,13,19,2,26,10,21,28,7];exports.permute=function(r){for(var o=0,t=0;t<permuteTable.length;t++)o<<=1,o|=r>>>permuteTable[t]&1;return o>>>0},exports.padSplit=function(r,o,t){for(var a=r.toString(2);a.length<o;)a="0"+a;for(var e=[],f=0;o>f;f+=t)e.push(a.slice(f,f+t));return e.join(" ")};

},{}],85:[function(require,module,exports){
"use strict";function destroy(e){return e instanceof ReadStream?destroyReadStream(e):e instanceof Stream?("function"==typeof e.destroy&&e.destroy(),e):e}function destroyReadStream(e){return e.destroy(),"function"==typeof e.close&&e.on("open",onOpenClose),e}function onOpenClose(){"number"==typeof this.fd&&this.close()}var ReadStream=require("fs").ReadStream,Stream=require("stream");module.exports=destroy;

},{"fs":58,"stream":241}],86:[function(require,module,exports){
(function (Buffer){
function getDiffieHellman(e){var r=new Buffer(primes[e].prime,"hex"),f=new Buffer(primes[e].gen,"hex");return new DH(r,f)}function createDiffieHellman(e,r,f,i){return Buffer.isBuffer(r)||void 0===ENCODINGS[r]?createDiffieHellman(e,"binary",r,f):(r=r||"binary",i=i||"binary",f=f||new Buffer([2]),Buffer.isBuffer(f)||(f=new Buffer(f,i)),"number"==typeof e?new DH(generatePrime(e,f),f,!0):(Buffer.isBuffer(e)||(e=new Buffer(e,r)),new DH(e,f,!0)))}var generatePrime=require("./lib/generatePrime"),primes=require("./lib/primes.json"),DH=require("./lib/dh"),ENCODINGS={binary:!0,hex:!0,base64:!0};exports.DiffieHellmanGroup=exports.createDiffieHellmanGroup=exports.getDiffieHellman=getDiffieHellman,exports.createDiffieHellman=exports.DiffieHellman=createDiffieHellman;

}).call(this,require("buffer").Buffer)
},{"./lib/dh":87,"./lib/generatePrime":88,"./lib/primes.json":89,"buffer":60}],87:[function(require,module,exports){
(function (Buffer){
function setPublicKey(e,r){return r=r||"utf8",Buffer.isBuffer(e)||(e=new Buffer(e,r)),this._pub=new BN(e),this}function setPrivateKey(e,r){return r=r||"utf8",Buffer.isBuffer(e)||(e=new Buffer(e,r)),this._priv=new BN(e),this}function checkPrime(e,r){var t=r.toString("hex"),i=[t,e.toString(16)].join("_");if(i in primeCache)return primeCache[i];var n=0;if(e.isEven()||!primes.simpleSieve||!primes.fermatTest(e)||!millerRabin.test(e))return n+=1,n+="02"===t||"05"===t?8:4,primeCache[i]=n,n;millerRabin.test(e.shrn(1))||(n+=2);var u;switch(t){case"02":e.mod(TWENTYFOUR).cmp(ELEVEN)&&(n+=8);break;case"05":u=e.mod(TEN),u.cmp(THREE)&&u.cmp(SEVEN)&&(n+=8);break;default:n+=4}return primeCache[i]=n,n}function DH(e,r,t){this.setGenerator(r),this.__prime=new BN(e),this._prime=BN.mont(this.__prime),this._primeLen=e.length,this._pub=void 0,this._priv=void 0,this._primeCode=void 0,t?(this.setPublicKey=setPublicKey,this.setPrivateKey=setPrivateKey):this._primeCode=8}function formatReturnValue(e,r){var t=new Buffer(e.toArray());return r?t.toString(r):t}var BN=require("bn.js"),MillerRabin=require("miller-rabin"),millerRabin=new MillerRabin,TWENTYFOUR=new BN(24),ELEVEN=new BN(11),TEN=new BN(10),THREE=new BN(3),SEVEN=new BN(7),primes=require("./generatePrime"),randomBytes=require("randombytes");module.exports=DH;var primeCache={};Object.defineProperty(DH.prototype,"verifyError",{enumerable:!0,get:function(){return"number"!=typeof this._primeCode&&(this._primeCode=checkPrime(this.__prime,this.__gen)),this._primeCode}}),DH.prototype.generateKeys=function(){return this._priv||(this._priv=new BN(randomBytes(this._primeLen))),this._pub=this._gen.toRed(this._prime).redPow(this._priv).fromRed(),this.getPublicKey()},DH.prototype.computeSecret=function(e){e=new BN(e),e=e.toRed(this._prime);var r=e.redPow(this._priv).fromRed(),t=new Buffer(r.toArray()),i=this.getPrime();if(t.length<i.length){var n=new Buffer(i.length-t.length);n.fill(0),t=Buffer.concat([n,t])}return t},DH.prototype.getPublicKey=function(e){return formatReturnValue(this._pub,e)},DH.prototype.getPrivateKey=function(e){return formatReturnValue(this._priv,e)},DH.prototype.getPrime=function(e){return formatReturnValue(this.__prime,e)},DH.prototype.getGenerator=function(e){return formatReturnValue(this._gen,e)},DH.prototype.setGenerator=function(e,r){return r=r||"utf8",Buffer.isBuffer(e)||(e=new Buffer(e,r)),this.__gen=e,this._gen=new BN(e),this};

}).call(this,require("buffer").Buffer)
},{"./generatePrime":88,"bn.js":19,"buffer":60,"miller-rabin":167,"randombytes":213}],88:[function(require,module,exports){
function _getPrimes(){if(null!==primes)return primes;var e=1048576,r=[];r[0]=2;for(var i=1,n=3;e>n;n+=2){for(var t=Math.ceil(Math.sqrt(n)),m=0;i>m&&r[m]<=t&&n%r[m]!==0;m++);i!==m&&r[m]<=t||(r[i++]=n)}return primes=r,r}function simpleSieve(e){for(var r=_getPrimes(),i=0;i<r.length;i++)if(0===e.modn(r[i]))return 0===e.cmpn(r[i]);return!0}function fermatTest(e){var r=BN.mont(e);return 0===TWO.toRed(r).redPow(e.subn(1)).fromRed().cmpn(1)}function findPrime(e,r){if(16>e)return new BN(2===r||5===r?[140,123]:[140,39]);r=new BN(r);for(var i,n;;){for(i=new BN(randomBytes(Math.ceil(e/8)));i.bitLength()>e;)i.ishrn(1);if(i.isEven()&&i.iadd(ONE),i.testn(1)||i.iadd(TWO),r.cmp(TWO)){if(!r.cmp(FIVE))for(;i.mod(TEN).cmp(THREE);)i.iadd(FOUR)}else for(;i.mod(TWENTYFOUR).cmp(ELEVEN);)i.iadd(FOUR);if(n=i.shrn(1),simpleSieve(n)&&simpleSieve(i)&&fermatTest(n)&&fermatTest(i)&&millerRabin.test(n)&&millerRabin.test(i))return i}}var randomBytes=require("randombytes");module.exports=findPrime,findPrime.simpleSieve=simpleSieve,findPrime.fermatTest=fermatTest;var BN=require("bn.js"),TWENTYFOUR=new BN(24),MillerRabin=require("miller-rabin"),millerRabin=new MillerRabin,ONE=new BN(1),TWO=new BN(2),FIVE=new BN(5),SIXTEEN=new BN(16),EIGHT=new BN(8),TEN=new BN(10),THREE=new BN(3),SEVEN=new BN(7),ELEVEN=new BN(11),FOUR=new BN(4),TWELVE=new BN(12),primes=null;

},{"bn.js":19,"miller-rabin":167,"randombytes":213}],89:[function(require,module,exports){
module.exports={
    "modp1": {
        "gen": "02",
        "prime": "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
    },
    "modp2": {
        "gen": "02",
        "prime": "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
    },
    "modp5": {
        "gen": "02",
        "prime": "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
    },
    "modp14": {
        "gen": "02",
        "prime": "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
    },
    "modp15": {
        "gen": "02",
        "prime": "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
    },
    "modp16": {
        "gen": "02",
        "prime": "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
    },
    "modp17": {
        "gen": "02",
        "prime": "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
    },
    "modp18": {
        "gen": "02",
        "prime": "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
    }
}
},{}],90:[function(require,module,exports){
"use strict";function first(r,e){function n(){t(),e.apply(null,arguments)}function t(){for(var r,e=0;e<o.length;e++)r=o[e],r.ee.removeListener(r.event,r.fn)}function a(r){e=r}if(!Array.isArray(r))throw new TypeError("arg must be an array of [ee, events...] arrays");for(var o=[],f=0;f<r.length;f++){var i=r[f];if(!Array.isArray(i)||i.length<2)throw new TypeError("each array member must be [ee, events...]");for(var s=i[0],l=1;l<i.length;l++){var u=i[l],h=listener(u,n);s.on(u,h),o.push({ee:s,event:u,fn:h})}}return a.cancel=t,a}function listener(r,e){return function(n){for(var t=new Array(arguments.length),a=this,o="error"===r?n:null,f=0;f<t.length;f++)t[f]=arguments[f];e(o,a,r,t)}}module.exports=first;

},{}],91:[function(require,module,exports){
"use strict";var elliptic=exports;elliptic.version=require("../package.json").version,elliptic.utils=require("./elliptic/utils"),elliptic.rand=require("brorand"),elliptic.hmacDRBG=require("./elliptic/hmac-drbg"),elliptic.curve=require("./elliptic/curve"),elliptic.curves=require("./elliptic/curves"),elliptic.ec=require("./elliptic/ec"),elliptic.eddsa=require("./elliptic/eddsa");

},{"../package.json":107,"./elliptic/curve":94,"./elliptic/curves":97,"./elliptic/ec":98,"./elliptic/eddsa":101,"./elliptic/hmac-drbg":104,"./elliptic/utils":106,"brorand":30}],92:[function(require,module,exports){
"use strict";function BaseCurve(t,e){this.type=t,this.p=new BN(e.p,16),this.red=e.prime?BN.red(e.prime):BN.mont(this.p),this.zero=new BN(0).toRed(this.red),this.one=new BN(1).toRed(this.red),this.two=new BN(2).toRed(this.red),this.n=e.n&&new BN(e.n,16),this.g=e.g&&this.pointFromJSON(e.g,e.gRed),this._wnafT1=new Array(4),this._wnafT2=new Array(4),this._wnafT3=new Array(4),this._wnafT4=new Array(4)}function BasePoint(t,e){this.curve=t,this.type=e,this.precomputed=null}var BN=require("bn.js"),elliptic=require("../../elliptic"),utils=elliptic.utils,getNAF=utils.getNAF,getJSF=utils.getJSF,assert=utils.assert;module.exports=BaseCurve,BaseCurve.prototype.point=function(){throw new Error("Not implemented")},BaseCurve.prototype.validate=function(){throw new Error("Not implemented")},BaseCurve.prototype._fixedNafMul=function(t,e){assert(t.precomputed);var r=t._getDoubles(),n=getNAF(e,1),o=(1<<r.step+1)-(r.step%2===0?2:1);o/=3;for(var i=[],s=0;s<n.length;s+=r.step){for(var a=0,e=s+r.step-1;e>=s;e--)a=(a<<1)+n[e];i.push(a)}for(var p=this.jpoint(null,null,null),u=this.jpoint(null,null,null),d=o;d>0;d--){for(var s=0;s<i.length;s++){var a=i[s];a===d?u=u.mixedAdd(r.points[s]):a===-d&&(u=u.mixedAdd(r.points[s].neg()))}p=p.add(u)}return p.toP()},BaseCurve.prototype._wnafMul=function(t,e){var r=4,n=t._getNAFPoints(r);r=n.wnd;for(var o=n.points,i=getNAF(e,r),s=this.jpoint(null,null,null),a=i.length-1;a>=0;a--){for(var e=0;a>=0&&0===i[a];a--)e++;if(a>=0&&e++,s=s.dblp(e),0>a)break;var p=i[a];assert(0!==p),s="affine"===t.type?p>0?s.mixedAdd(o[p-1>>1]):s.mixedAdd(o[-p-1>>1].neg()):p>0?s.add(o[p-1>>1]):s.add(o[-p-1>>1].neg())}return"affine"===t.type?s.toP():s},BaseCurve.prototype._wnafMulAdd=function(t,e,r,n){for(var o=this._wnafT1,i=this._wnafT2,s=this._wnafT3,a=0,p=0;n>p;p++){var u=e[p],d=u._getNAFPoints(t);o[p]=d.wnd,i[p]=d.points}for(var p=n-1;p>=1;p-=2){var l=p-1,h=p;if(1===o[l]&&1===o[h]){var f=[e[l],null,null,e[h]];0===e[l].y.cmp(e[h].y)?(f[1]=e[l].add(e[h]),f[2]=e[l].toJ().mixedAdd(e[h].neg())):0===e[l].y.cmp(e[h].y.redNeg())?(f[1]=e[l].toJ().mixedAdd(e[h]),f[2]=e[l].add(e[h].neg())):(f[1]=e[l].toJ().mixedAdd(e[h]),f[2]=e[l].toJ().mixedAdd(e[h].neg()));var c=[-3,-1,-5,-7,0,7,5,1,3],v=getJSF(r[l],r[h]);a=Math.max(v[0].length,a),s[l]=new Array(a),s[h]=new Array(a);for(var g=0;a>g;g++){var m=0|v[0][g],y=0|v[1][g];s[l][g]=c[3*(m+1)+(y+1)],s[h][g]=0,i[l]=f}}else s[l]=getNAF(r[l],o[l]),s[h]=getNAF(r[h],o[h]),a=Math.max(s[l].length,a),a=Math.max(s[h].length,a)}for(var w=this.jpoint(null,null,null),B=this._wnafT4,p=a;p>=0;p--){for(var A=0;p>=0;){for(var b=!0,g=0;n>g;g++)B[g]=0|s[g][p],0!==B[g]&&(b=!1);if(!b)break;A++,p--}if(p>=0&&A++,w=w.dblp(A),0>p)break;for(var g=0;n>g;g++){var u,N=B[g];0!==N&&(N>0?u=i[g][N-1>>1]:0>N&&(u=i[g][-N-1>>1].neg()),w="affine"===u.type?w.mixedAdd(u):w.add(u))}}for(var p=0;n>p;p++)i[p]=null;return w.toP()},BaseCurve.BasePoint=BasePoint,BasePoint.prototype.eq=function(){throw new Error("Not implemented")},BasePoint.prototype.validate=function(){return this.curve.validate(this)},BaseCurve.prototype.decodePoint=function(t,e){t=utils.toArray(t,e);var r=this.p.byteLength();if(4===t[0]&&t.length-1===2*r)return this.point(t.slice(1,1+r),t.slice(1+r,1+2*r));if((2===t[0]||3===t[0])&&t.length-1===r)return this.pointFromX(t.slice(1,1+r),3===t[0]);throw new Error("Unknown point format")},BasePoint.prototype.encodeCompressed=function(t){return this.encode(t,!0)},BasePoint.prototype._encode=function(t){var e=this.curve.p.byteLength(),r=this.getX().toArray("be",e);return t?[this.getY().isEven()?2:3].concat(r):[4].concat(r,this.getY().toArray("be",e))},BasePoint.prototype.encode=function(t,e){return utils.encode(this._encode(e),t)},BasePoint.prototype.precompute=function(t){if(this.precomputed)return this;var e={doubles:null,naf:null,beta:null};return e.naf=this._getNAFPoints(8),e.doubles=this._getDoubles(4,t),e.beta=this._getBeta(),this.precomputed=e,this},BasePoint.prototype._hasDoubles=function(t){if(!this.precomputed)return!1;var e=this.precomputed.doubles;return e?e.points.length>=Math.ceil((t.bitLength()+1)/e.step):!1},BasePoint.prototype._getDoubles=function(t,e){if(this.precomputed&&this.precomputed.doubles)return this.precomputed.doubles;for(var r=[this],n=this,o=0;e>o;o+=t){for(var i=0;t>i;i++)n=n.dbl();r.push(n)}return{step:t,points:r}},BasePoint.prototype._getNAFPoints=function(t){if(this.precomputed&&this.precomputed.naf)return this.precomputed.naf;for(var e=[this],r=(1<<t)-1,n=1===r?null:this.dbl(),o=1;r>o;o++)e[o]=e[o-1].add(n);return{wnd:t,points:e}},BasePoint.prototype._getBeta=function(){return null},BasePoint.prototype.dblp=function(t){for(var e=this,r=0;t>r;r++)e=e.dbl();return e};

},{"../../elliptic":91,"bn.js":19}],93:[function(require,module,exports){
"use strict";function EdwardsCurve(t){this.twisted=1!==(0|t.a),this.mOneA=this.twisted&&-1===(0|t.a),this.extended=this.mOneA,Base.call(this,"edwards",t),this.a=new BN(t.a,16).umod(this.red.m),this.a=this.a.toRed(this.red),this.c=new BN(t.c,16).toRed(this.red),this.c2=this.c.redSqr(),this.d=new BN(t.d,16).toRed(this.red),this.dd=this.d.redAdd(this.d),assert(!this.twisted||0===this.c.fromRed().cmpn(1)),this.oneC=1===(0|t.c)}function Point(t,e,r,i,d){Base.BasePoint.call(this,t,"projective"),null===e&&null===r&&null===i?(this.x=this.curve.zero,this.y=this.curve.one,this.z=this.curve.one,this.t=this.curve.zero,this.zOne=!0):(this.x=new BN(e,16),this.y=new BN(r,16),this.z=i?new BN(i,16):this.curve.one,this.t=d&&new BN(d,16),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.y.red||(this.y=this.y.toRed(this.curve.red)),this.z.red||(this.z=this.z.toRed(this.curve.red)),this.t&&!this.t.red&&(this.t=this.t.toRed(this.curve.red)),this.zOne=this.z===this.curve.one,this.curve.extended&&!this.t&&(this.t=this.x.redMul(this.y),this.zOne||(this.t=this.t.redMul(this.z.redInvm()))))}var curve=require("../curve"),elliptic=require("../../elliptic"),BN=require("bn.js"),inherits=require("inherits"),Base=curve.base,assert=elliptic.utils.assert;inherits(EdwardsCurve,Base),module.exports=EdwardsCurve,EdwardsCurve.prototype._mulA=function(t){return this.mOneA?t.redNeg():this.a.redMul(t)},EdwardsCurve.prototype._mulC=function(t){return this.oneC?t:this.c.redMul(t)},EdwardsCurve.prototype.jpoint=function(t,e,r,i){return this.point(t,e,r,i)},EdwardsCurve.prototype.pointFromX=function(t,e){t=new BN(t,16),t.red||(t=t.toRed(this.red));var r=t.redSqr(),i=this.c2.redSub(this.a.redMul(r)),d=this.one.redSub(this.c2.redMul(this.d).redMul(r)),s=i.redMul(d.redInvm()),u=s.redSqrt();if(0!==u.redSqr().redSub(s).cmp(this.zero))throw new Error("invalid point");var n=u.fromRed().isOdd();return(e&&!n||!e&&n)&&(u=u.redNeg()),this.point(t,u)},EdwardsCurve.prototype.pointFromY=function(t,e){t=new BN(t,16),t.red||(t=t.toRed(this.red));var r=t.redSqr(),i=r.redSub(this.one),d=r.redMul(this.d).redAdd(this.one),s=i.redMul(d.redInvm());if(0===s.cmp(this.zero)){if(e)throw new Error("invalid point");return this.point(this.zero,t)}var u=s.redSqrt();if(0!==u.redSqr().redSub(s).cmp(this.zero))throw new Error("invalid point");return u.isOdd()!==e&&(u=u.redNeg()),this.point(u,t)},EdwardsCurve.prototype.validate=function(t){if(t.isInfinity())return!0;t.normalize();var e=t.x.redSqr(),r=t.y.redSqr(),i=e.redMul(this.a).redAdd(r),d=this.c2.redMul(this.one.redAdd(this.d.redMul(e).redMul(r)));return 0===i.cmp(d)},inherits(Point,Base.BasePoint),EdwardsCurve.prototype.pointFromJSON=function(t){return Point.fromJSON(this,t)},EdwardsCurve.prototype.point=function(t,e,r,i){return new Point(this,t,e,r,i)},Point.fromJSON=function(t,e){return new Point(t,e[0],e[1],e[2])},Point.prototype.inspect=function(){return this.isInfinity()?"<EC Point Infinity>":"<EC Point x: "+this.x.fromRed().toString(16,2)+" y: "+this.y.fromRed().toString(16,2)+" z: "+this.z.fromRed().toString(16,2)+">"},Point.prototype.isInfinity=function(){return 0===this.x.cmpn(0)&&0===this.y.cmp(this.z)},Point.prototype._extDbl=function(){var t=this.x.redSqr(),e=this.y.redSqr(),r=this.z.redSqr();r=r.redIAdd(r);var i=this.curve._mulA(t),d=this.x.redAdd(this.y).redSqr().redISub(t).redISub(e),s=i.redAdd(e),u=s.redSub(r),n=i.redSub(e),h=d.redMul(u),o=s.redMul(n),l=d.redMul(n),c=u.redMul(s);return this.curve.point(h,o,c,l)},Point.prototype._projDbl=function(){var t,e,r,i=this.x.redAdd(this.y).redSqr(),d=this.x.redSqr(),s=this.y.redSqr();if(this.curve.twisted){var u=this.curve._mulA(d),n=u.redAdd(s);if(this.zOne)t=i.redSub(d).redSub(s).redMul(n.redSub(this.curve.two)),e=n.redMul(u.redSub(s)),r=n.redSqr().redSub(n).redSub(n);else{var h=this.z.redSqr(),o=n.redSub(h).redISub(h);t=i.redSub(d).redISub(s).redMul(o),e=n.redMul(u.redSub(s)),r=n.redMul(o)}}else{var u=d.redAdd(s),h=this.curve._mulC(this.c.redMul(this.z)).redSqr(),o=u.redSub(h).redSub(h);t=this.curve._mulC(i.redISub(u)).redMul(o),e=this.curve._mulC(u).redMul(d.redISub(s)),r=u.redMul(o)}return this.curve.point(t,e,r)},Point.prototype.dbl=function(){return this.isInfinity()?this:this.curve.extended?this._extDbl():this._projDbl()},Point.prototype._extAdd=function(t){var e=this.y.redSub(this.x).redMul(t.y.redSub(t.x)),r=this.y.redAdd(this.x).redMul(t.y.redAdd(t.x)),i=this.t.redMul(this.curve.dd).redMul(t.t),d=this.z.redMul(t.z.redAdd(t.z)),s=r.redSub(e),u=d.redSub(i),n=d.redAdd(i),h=r.redAdd(e),o=s.redMul(u),l=n.redMul(h),c=s.redMul(h),p=u.redMul(n);return this.curve.point(o,l,p,c)},Point.prototype._projAdd=function(t){var e,r,i=this.z.redMul(t.z),d=i.redSqr(),s=this.x.redMul(t.x),u=this.y.redMul(t.y),n=this.curve.d.redMul(s).redMul(u),h=d.redSub(n),o=d.redAdd(n),l=this.x.redAdd(this.y).redMul(t.x.redAdd(t.y)).redISub(s).redISub(u),c=i.redMul(h).redMul(l);return this.curve.twisted?(e=i.redMul(o).redMul(u.redSub(this.curve._mulA(s))),r=h.redMul(o)):(e=i.redMul(o).redMul(u.redSub(s)),r=this.curve._mulC(h).redMul(o)),this.curve.point(c,e,r)},Point.prototype.add=function(t){return this.isInfinity()?t:t.isInfinity()?this:this.curve.extended?this._extAdd(t):this._projAdd(t)},Point.prototype.mul=function(t){return this._hasDoubles(t)?this.curve._fixedNafMul(this,t):this.curve._wnafMul(this,t)},Point.prototype.mulAdd=function(t,e,r){return this.curve._wnafMulAdd(1,[this,e],[t,r],2)},Point.prototype.normalize=function(){if(this.zOne)return this;var t=this.z.redInvm();return this.x=this.x.redMul(t),this.y=this.y.redMul(t),this.t&&(this.t=this.t.redMul(t)),this.z=this.curve.one,this.zOne=!0,this},Point.prototype.neg=function(){return this.curve.point(this.x.redNeg(),this.y,this.z,this.t&&this.t.redNeg())},Point.prototype.getX=function(){return this.normalize(),this.x.fromRed()},Point.prototype.getY=function(){return this.normalize(),this.y.fromRed()},Point.prototype.eq=function(t){return this===t||0===this.getX().cmp(t.getX())&&0===this.getY().cmp(t.getY())},Point.prototype.toP=Point.prototype.normalize,Point.prototype.mixedAdd=Point.prototype.add;

},{"../../elliptic":91,"../curve":94,"bn.js":19,"inherits":161}],94:[function(require,module,exports){
"use strict";var curve=exports;curve.base=require("./base"),curve["short"]=require("./short"),curve.mont=require("./mont"),curve.edwards=require("./edwards");

},{"./base":92,"./edwards":93,"./mont":95,"./short":96}],95:[function(require,module,exports){
"use strict";function MontCurve(t){Base.call(this,"mont",t),this.a=new BN(t.a,16).toRed(this.red),this.b=new BN(t.b,16).toRed(this.red),this.i4=new BN(4).toRed(this.red).redInvm(),this.two=new BN(2).toRed(this.red),this.a24=this.i4.redMul(this.a.redAdd(this.two))}function Point(t,e,r){Base.BasePoint.call(this,t,"projective"),null===e&&null===r?(this.x=this.curve.one,this.z=this.curve.zero):(this.x=new BN(e,16),this.z=new BN(r,16),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.z.red||(this.z=this.z.toRed(this.curve.red)))}var curve=require("../curve"),BN=require("bn.js"),inherits=require("inherits"),Base=curve.base,elliptic=require("../../elliptic"),utils=elliptic.utils;inherits(MontCurve,Base),module.exports=MontCurve,MontCurve.prototype.validate=function(t){var e=t.normalize().x,r=e.redSqr(),i=r.redMul(e).redAdd(r.redMul(this.a)).redAdd(e),n=i.redSqrt();return 0===n.redSqr().cmp(i)},inherits(Point,Base.BasePoint),MontCurve.prototype.decodePoint=function(t,e){return this.point(utils.toArray(t,e),1)},MontCurve.prototype.point=function(t,e){return new Point(this,t,e)},MontCurve.prototype.pointFromJSON=function(t){return Point.fromJSON(this,t)},Point.prototype.precompute=function(){},Point.prototype._encode=function(){return this.getX().toArray("be",this.curve.p.byteLength())},Point.fromJSON=function(t,e){return new Point(t,e[0],e[1]||t.one)},Point.prototype.inspect=function(){return this.isInfinity()?"<EC Point Infinity>":"<EC Point x: "+this.x.fromRed().toString(16,2)+" z: "+this.z.fromRed().toString(16,2)+">"},Point.prototype.isInfinity=function(){return 0===this.z.cmpn(0)},Point.prototype.dbl=function(){var t=this.x.redAdd(this.z),e=t.redSqr(),r=this.x.redSub(this.z),i=r.redSqr(),n=e.redSub(i),o=e.redMul(i),u=n.redMul(i.redAdd(this.curve.a24.redMul(n)));return this.curve.point(o,u)},Point.prototype.add=function(){throw new Error("Not supported on Montgomery curve")},Point.prototype.diffAdd=function(t,e){var r=this.x.redAdd(this.z),i=this.x.redSub(this.z),n=t.x.redAdd(t.z),o=t.x.redSub(t.z),u=o.redMul(r),d=n.redMul(i),s=e.z.redMul(u.redAdd(d).redSqr()),h=e.x.redMul(u.redISub(d).redSqr());return this.curve.point(s,h)},Point.prototype.mul=function(t){for(var e=t.clone(),r=this,i=this.curve.point(null,null),n=this,o=[];0!==e.cmpn(0);e.iushrn(1))o.push(e.andln(1));for(var u=o.length-1;u>=0;u--)0===o[u]?(r=r.diffAdd(i,n),i=i.dbl()):(i=r.diffAdd(i,n),r=r.dbl());return i},Point.prototype.mulAdd=function(){throw new Error("Not supported on Montgomery curve")},Point.prototype.eq=function(t){return 0===this.getX().cmp(t.getX())},Point.prototype.normalize=function(){return this.x=this.x.redMul(this.z.redInvm()),this.z=this.curve.one,this},Point.prototype.getX=function(){return this.normalize(),this.x.fromRed()};

},{"../../elliptic":91,"../curve":94,"bn.js":19,"inherits":161}],96:[function(require,module,exports){
"use strict";function ShortCurve(r){Base.call(this,"short",r),this.a=new BN(r.a,16).toRed(this.red),this.b=new BN(r.b,16).toRed(this.red),this.tinv=this.two.redInvm(),this.zeroA=0===this.a.fromRed().cmpn(0),this.threeA=0===this.a.fromRed().sub(this.p).cmpn(-3),this.endo=this._getEndomorphism(r),this._endoWnafT1=new Array(4),this._endoWnafT2=new Array(4)}function Point(r,e,t,d){Base.BasePoint.call(this,r,"affine"),null===e&&null===t?(this.x=null,this.y=null,this.inf=!0):(this.x=new BN(e,16),this.y=new BN(t,16),d&&(this.x.forceRed(this.curve.red),this.y.forceRed(this.curve.red)),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.y.red||(this.y=this.y.toRed(this.curve.red)),this.inf=!1)}function JPoint(r,e,t,d){Base.BasePoint.call(this,r,"jacobian"),null===e&&null===t&&null===d?(this.x=this.curve.one,this.y=this.curve.one,this.z=new BN(0)):(this.x=new BN(e,16),this.y=new BN(t,16),this.z=new BN(d,16)),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.y.red||(this.y=this.y.toRed(this.curve.red)),this.z.red||(this.z=this.z.toRed(this.curve.red)),this.zOne=this.z===this.curve.one}var curve=require("../curve"),elliptic=require("../../elliptic"),BN=require("bn.js"),inherits=require("inherits"),Base=curve.base,assert=elliptic.utils.assert;inherits(ShortCurve,Base),module.exports=ShortCurve,ShortCurve.prototype._getEndomorphism=function(r){if(this.zeroA&&this.g&&this.n&&1===this.p.modn(3)){var e,t;if(r.beta)e=new BN(r.beta,16).toRed(this.red);else{var d=this._getEndoRoots(this.p);e=d[0].cmp(d[1])<0?d[0]:d[1],e=e.toRed(this.red)}if(r.lambda)t=new BN(r.lambda,16);else{var i=this._getEndoRoots(this.n);0===this.g.mul(i[0]).x.cmp(this.g.x.redMul(e))?t=i[0]:(t=i[1],assert(0===this.g.mul(t).x.cmp(this.g.x.redMul(e))))}var n;return n=r.basis?r.basis.map(function(r){return{a:new BN(r.a,16),b:new BN(r.b,16)}}):this._getEndoBasis(t),{beta:e,lambda:t,basis:n}}},ShortCurve.prototype._getEndoRoots=function(r){var e=r===this.p?this.red:BN.mont(r),t=new BN(2).toRed(e).redInvm(),d=t.redNeg(),i=new BN(3).toRed(e).redNeg().redSqrt().redMul(t),n=d.redAdd(i).fromRed(),u=d.redSub(i).fromRed();return[n,u]},ShortCurve.prototype._getEndoBasis=function(r){for(var e,t,d,i,n,u,s,o,h,l=this.n.ushrn(Math.floor(this.n.bitLength()/2)),p=r,a=this.n.clone(),f=new BN(1),c=new BN(0),S=new BN(0),v=new BN(1),b=0;0!==p.cmpn(0);){var I=a.div(p);o=a.sub(I.mul(p)),h=S.sub(I.mul(f));var y=v.sub(I.mul(c));if(!d&&o.cmp(l)<0)e=s.neg(),t=f,d=o.neg(),i=h;else if(d&&2===++b)break;s=o,a=p,p=o,S=f,f=h,v=c,c=y}n=o.neg(),u=h;var A=d.sqr().add(i.sqr()),m=n.sqr().add(u.sqr());return m.cmp(A)>=0&&(n=e,u=t),d.negative&&(d=d.neg(),i=i.neg()),n.negative&&(n=n.neg(),u=u.neg()),[{a:d,b:i},{a:n,b:u}]},ShortCurve.prototype._endoSplit=function(r){var e=this.endo.basis,t=e[0],d=e[1],i=d.b.mul(r).divRound(this.n),n=t.b.neg().mul(r).divRound(this.n),u=i.mul(t.a),s=n.mul(d.a),o=i.mul(t.b),h=n.mul(d.b),l=r.sub(u).sub(s),p=o.add(h).neg();return{k1:l,k2:p}},ShortCurve.prototype.pointFromX=function(r,e){r=new BN(r,16),r.red||(r=r.toRed(this.red));var t=r.redSqr().redMul(r).redIAdd(r.redMul(this.a)).redIAdd(this.b),d=t.redSqrt();if(0!==d.redSqr().redSub(t).cmp(this.zero))throw new Error("invalid point");var i=d.fromRed().isOdd();return(e&&!i||!e&&i)&&(d=d.redNeg()),this.point(r,d)},ShortCurve.prototype.validate=function(r){if(r.inf)return!0;var e=r.x,t=r.y,d=this.a.redMul(e),i=e.redSqr().redMul(e).redIAdd(d).redIAdd(this.b);return 0===t.redSqr().redISub(i).cmpn(0)},ShortCurve.prototype._endoWnafMulAdd=function(r,e){for(var t=this._endoWnafT1,d=this._endoWnafT2,i=0;i<r.length;i++){var n=this._endoSplit(e[i]),u=r[i],s=u._getBeta();n.k1.negative&&(n.k1.ineg(),u=u.neg(!0)),n.k2.negative&&(n.k2.ineg(),s=s.neg(!0)),t[2*i]=u,t[2*i+1]=s,d[2*i]=n.k1,d[2*i+1]=n.k2}for(var o=this._wnafMulAdd(1,t,d,2*i),h=0;2*i>h;h++)t[h]=null,d[h]=null;return o},inherits(Point,Base.BasePoint),ShortCurve.prototype.point=function(r,e,t){return new Point(this,r,e,t)},ShortCurve.prototype.pointFromJSON=function(r,e){return Point.fromJSON(this,r,e)},Point.prototype._getBeta=function(){if(this.curve.endo){var r=this.precomputed;if(r&&r.beta)return r.beta;var e=this.curve.point(this.x.redMul(this.curve.endo.beta),this.y);if(r){var t=this.curve,d=function(r){return t.point(r.x.redMul(t.endo.beta),r.y)};r.beta=e,e.precomputed={beta:null,naf:r.naf&&{wnd:r.naf.wnd,points:r.naf.points.map(d)},doubles:r.doubles&&{step:r.doubles.step,points:r.doubles.points.map(d)}}}return e}},Point.prototype.toJSON=function(){return this.precomputed?[this.x,this.y,this.precomputed&&{doubles:this.precomputed.doubles&&{step:this.precomputed.doubles.step,points:this.precomputed.doubles.points.slice(1)},naf:this.precomputed.naf&&{wnd:this.precomputed.naf.wnd,points:this.precomputed.naf.points.slice(1)}}]:[this.x,this.y]},Point.fromJSON=function(r,e,t){function d(e){return r.point(e[0],e[1],t)}"string"==typeof e&&(e=JSON.parse(e));var i=r.point(e[0],e[1],t);if(!e[2])return i;var n=e[2];return i.precomputed={beta:null,doubles:n.doubles&&{step:n.doubles.step,points:[i].concat(n.doubles.points.map(d))},naf:n.naf&&{wnd:n.naf.wnd,points:[i].concat(n.naf.points.map(d))}},i},Point.prototype.inspect=function(){return this.isInfinity()?"<EC Point Infinity>":"<EC Point x: "+this.x.fromRed().toString(16,2)+" y: "+this.y.fromRed().toString(16,2)+">"},Point.prototype.isInfinity=function(){return this.inf},Point.prototype.add=function(r){if(this.inf)return r;if(r.inf)return this;if(this.eq(r))return this.dbl();if(this.neg().eq(r))return this.curve.point(null,null);if(0===this.x.cmp(r.x))return this.curve.point(null,null);var e=this.y.redSub(r.y);0!==e.cmpn(0)&&(e=e.redMul(this.x.redSub(r.x).redInvm()));var t=e.redSqr().redISub(this.x).redISub(r.x),d=e.redMul(this.x.redSub(t)).redISub(this.y);return this.curve.point(t,d)},Point.prototype.dbl=function(){if(this.inf)return this;var r=this.y.redAdd(this.y);if(0===r.cmpn(0))return this.curve.point(null,null);var e=this.curve.a,t=this.x.redSqr(),d=r.redInvm(),i=t.redAdd(t).redIAdd(t).redIAdd(e).redMul(d),n=i.redSqr().redISub(this.x.redAdd(this.x)),u=i.redMul(this.x.redSub(n)).redISub(this.y);return this.curve.point(n,u)},Point.prototype.getX=function(){return this.x.fromRed()},Point.prototype.getY=function(){return this.y.fromRed()},Point.prototype.mul=function(r){return r=new BN(r,16),this._hasDoubles(r)?this.curve._fixedNafMul(this,r):this.curve.endo?this.curve._endoWnafMulAdd([this],[r]):this.curve._wnafMul(this,r)},Point.prototype.mulAdd=function(r,e,t){var d=[this,e],i=[r,t];return this.curve.endo?this.curve._endoWnafMulAdd(d,i):this.curve._wnafMulAdd(1,d,i,2)},Point.prototype.eq=function(r){return this===r||this.inf===r.inf&&(this.inf||0===this.x.cmp(r.x)&&0===this.y.cmp(r.y))},Point.prototype.neg=function(r){if(this.inf)return this;var e=this.curve.point(this.x,this.y.redNeg());if(r&&this.precomputed){var t=this.precomputed,d=function(r){return r.neg()};e.precomputed={naf:t.naf&&{wnd:t.naf.wnd,points:t.naf.points.map(d)},doubles:t.doubles&&{step:t.doubles.step,points:t.doubles.points.map(d)}}}return e},Point.prototype.toJ=function(){if(this.inf)return this.curve.jpoint(null,null,null);var r=this.curve.jpoint(this.x,this.y,this.curve.one);return r},inherits(JPoint,Base.BasePoint),ShortCurve.prototype.jpoint=function(r,e,t){return new JPoint(this,r,e,t)},JPoint.prototype.toP=function(){if(this.isInfinity())return this.curve.point(null,null);var r=this.z.redInvm(),e=r.redSqr(),t=this.x.redMul(e),d=this.y.redMul(e).redMul(r);return this.curve.point(t,d)},JPoint.prototype.neg=function(){return this.curve.jpoint(this.x,this.y.redNeg(),this.z)},JPoint.prototype.add=function(r){if(this.isInfinity())return r;if(r.isInfinity())return this;var e=r.z.redSqr(),t=this.z.redSqr(),d=this.x.redMul(e),i=r.x.redMul(t),n=this.y.redMul(e.redMul(r.z)),u=r.y.redMul(t.redMul(this.z)),s=d.redSub(i),o=n.redSub(u);if(0===s.cmpn(0))return 0!==o.cmpn(0)?this.curve.jpoint(null,null,null):this.dbl();var h=s.redSqr(),l=h.redMul(s),p=d.redMul(h),a=o.redSqr().redIAdd(l).redISub(p).redISub(p),f=o.redMul(p.redISub(a)).redISub(n.redMul(l)),c=this.z.redMul(r.z).redMul(s);return this.curve.jpoint(a,f,c)},JPoint.prototype.mixedAdd=function(r){if(this.isInfinity())return r.toJ();if(r.isInfinity())return this;var e=this.z.redSqr(),t=this.x,d=r.x.redMul(e),i=this.y,n=r.y.redMul(e).redMul(this.z),u=t.redSub(d),s=i.redSub(n);if(0===u.cmpn(0))return 0!==s.cmpn(0)?this.curve.jpoint(null,null,null):this.dbl();var o=u.redSqr(),h=o.redMul(u),l=t.redMul(o),p=s.redSqr().redIAdd(h).redISub(l).redISub(l),a=s.redMul(l.redISub(p)).redISub(i.redMul(h)),f=this.z.redMul(u);return this.curve.jpoint(p,a,f)},JPoint.prototype.dblp=function(r){if(0===r)return this;if(this.isInfinity())return this;if(!r)return this.dbl();if(this.curve.zeroA||this.curve.threeA){for(var e=this,t=0;r>t;t++)e=e.dbl();return e}for(var d=this.curve.a,i=this.curve.tinv,n=this.x,u=this.y,s=this.z,o=s.redSqr().redSqr(),h=u.redAdd(u),t=0;r>t;t++){var l=n.redSqr(),p=h.redSqr(),a=p.redSqr(),f=l.redAdd(l).redIAdd(l).redIAdd(d.redMul(o)),c=n.redMul(p),S=f.redSqr().redISub(c.redAdd(c)),v=c.redISub(S),b=f.redMul(v);b=b.redIAdd(b).redISub(a);var I=h.redMul(s);r>t+1&&(o=o.redMul(a)),n=S,s=I,h=b}return this.curve.jpoint(n,h.redMul(i),s)},JPoint.prototype.dbl=function(){return this.isInfinity()?this:this.curve.zeroA?this._zeroDbl():this.curve.threeA?this._threeDbl():this._dbl()},JPoint.prototype._zeroDbl=function(){var r,e,t;if(this.zOne){var d=this.x.redSqr(),i=this.y.redSqr(),n=i.redSqr(),u=this.x.redAdd(i).redSqr().redISub(d).redISub(n);u=u.redIAdd(u);var s=d.redAdd(d).redIAdd(d),o=s.redSqr().redISub(u).redISub(u),h=n.redIAdd(n);h=h.redIAdd(h),h=h.redIAdd(h),r=o,e=s.redMul(u.redISub(o)).redISub(h),t=this.y.redAdd(this.y)}else{var l=this.x.redSqr(),p=this.y.redSqr(),a=p.redSqr(),f=this.x.redAdd(p).redSqr().redISub(l).redISub(a);f=f.redIAdd(f);var c=l.redAdd(l).redIAdd(l),S=c.redSqr(),v=a.redIAdd(a);v=v.redIAdd(v),v=v.redIAdd(v),r=S.redISub(f).redISub(f),e=c.redMul(f.redISub(r)).redISub(v),t=this.y.redMul(this.z),t=t.redIAdd(t)}return this.curve.jpoint(r,e,t)},JPoint.prototype._threeDbl=function(){var r,e,t;if(this.zOne){var d=this.x.redSqr(),i=this.y.redSqr(),n=i.redSqr(),u=this.x.redAdd(i).redSqr().redISub(d).redISub(n);u=u.redIAdd(u);var s=d.redAdd(d).redIAdd(d).redIAdd(this.curve.a),o=s.redSqr().redISub(u).redISub(u);r=o;var h=n.redIAdd(n);h=h.redIAdd(h),h=h.redIAdd(h),e=s.redMul(u.redISub(o)).redISub(h),t=this.y.redAdd(this.y)}else{var l=this.z.redSqr(),p=this.y.redSqr(),a=this.x.redMul(p),f=this.x.redSub(l).redMul(this.x.redAdd(l));f=f.redAdd(f).redIAdd(f);var c=a.redIAdd(a);c=c.redIAdd(c);var S=c.redAdd(c);r=f.redSqr().redISub(S),t=this.y.redAdd(this.z).redSqr().redISub(p).redISub(l);var v=p.redSqr();v=v.redIAdd(v),v=v.redIAdd(v),v=v.redIAdd(v),e=f.redMul(c.redISub(r)).redISub(v)}return this.curve.jpoint(r,e,t)},JPoint.prototype._dbl=function(){var r=this.curve.a,e=this.x,t=this.y,d=this.z,i=d.redSqr().redSqr(),n=e.redSqr(),u=t.redSqr(),s=n.redAdd(n).redIAdd(n).redIAdd(r.redMul(i)),o=e.redAdd(e);o=o.redIAdd(o);var h=o.redMul(u),l=s.redSqr().redISub(h.redAdd(h)),p=h.redISub(l),a=u.redSqr();a=a.redIAdd(a),a=a.redIAdd(a),a=a.redIAdd(a);var f=s.redMul(p).redISub(a),c=t.redAdd(t).redMul(d);return this.curve.jpoint(l,f,c)},JPoint.prototype.trpl=function(){if(!this.curve.zeroA)return this.dbl().add(this);var r=this.x.redSqr(),e=this.y.redSqr(),t=this.z.redSqr(),d=e.redSqr(),i=r.redAdd(r).redIAdd(r),n=i.redSqr(),u=this.x.redAdd(e).redSqr().redISub(r).redISub(d);u=u.redIAdd(u),u=u.redAdd(u).redIAdd(u),u=u.redISub(n);var s=u.redSqr(),o=d.redIAdd(d);o=o.redIAdd(o),o=o.redIAdd(o),o=o.redIAdd(o);var h=i.redIAdd(u).redSqr().redISub(n).redISub(s).redISub(o),l=e.redMul(h);l=l.redIAdd(l),l=l.redIAdd(l);var p=this.x.redMul(s).redISub(l);p=p.redIAdd(p),p=p.redIAdd(p);var a=this.y.redMul(h.redMul(o.redISub(h)).redISub(u.redMul(s)));a=a.redIAdd(a),a=a.redIAdd(a),a=a.redIAdd(a);var f=this.z.redAdd(u).redSqr().redISub(t).redISub(s);return this.curve.jpoint(p,a,f)},JPoint.prototype.mul=function(r,e){return r=new BN(r,e),this.curve._wnafMul(this,r)},JPoint.prototype.eq=function(r){if("affine"===r.type)return this.eq(r.toJ());if(this===r)return!0;var e=this.z.redSqr(),t=r.z.redSqr();if(0!==this.x.redMul(t).redISub(r.x.redMul(e)).cmpn(0))return!1;var d=e.redMul(this.z),i=t.redMul(r.z);return 0===this.y.redMul(i).redISub(r.y.redMul(d)).cmpn(0)},JPoint.prototype.inspect=function(){return this.isInfinity()?"<EC JPoint Infinity>":"<EC JPoint x: "+this.x.toString(16,2)+" y: "+this.y.toString(16,2)+" z: "+this.z.toString(16,2)+">"},JPoint.prototype.isInfinity=function(){return 0===this.z.cmpn(0)};

},{"../../elliptic":91,"../curve":94,"bn.js":19,"inherits":161}],97:[function(require,module,exports){
"use strict";function PresetCurve(f){"short"===f.type?this.curve=new elliptic.curve["short"](f):"edwards"===f.type?this.curve=new elliptic.curve.edwards(f):this.curve=new elliptic.curve.mont(f),this.g=this.curve.g,this.n=this.curve.n,this.hash=f.hash,assert(this.g.validate(),"Invalid curve"),assert(this.g.mul(this.n).isInfinity(),"Invalid curve, G*N != O")}function defineCurve(f,e){Object.defineProperty(curves,f,{configurable:!0,enumerable:!0,get:function(){var a=new PresetCurve(e);return Object.defineProperty(curves,f,{configurable:!0,enumerable:!0,value:a}),a}})}var curves=exports,hash=require("hash.js"),elliptic=require("../elliptic"),assert=elliptic.utils.assert;curves.PresetCurve=PresetCurve,defineCurve("p192",{type:"short",prime:"p192",p:"ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",a:"ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",b:"64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",n:"ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",hash:hash.sha256,gRed:!1,g:["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012","07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]}),defineCurve("p224",{type:"short",prime:"p224",p:"ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",a:"ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",b:"b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",n:"ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",hash:hash.sha256,gRed:!1,g:["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21","bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]}),defineCurve("p256",{type:"short",prime:null,p:"ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",a:"ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",b:"5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",n:"ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",hash:hash.sha256,gRed:!1,g:["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296","4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]}),defineCurve("p384",{type:"short",prime:null,p:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",a:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",b:"b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",n:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",hash:hash.sha384,gRed:!1,g:["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7","3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"]}),defineCurve("p521",{type:"short",prime:null,p:"000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",a:"000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",b:"00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",n:"000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",hash:hash.sha512,gRed:!1,g:["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66","00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"]}),defineCurve("curve25519",{type:"mont",prime:"p25519",p:"7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",a:"76d06",b:"0",n:"1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",hash:hash.sha256,gRed:!1,g:["9"]}),defineCurve("ed25519",{type:"edwards",prime:"p25519",p:"7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",a:"-1",c:"1",d:"52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",n:"1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",hash:hash.sha256,gRed:!1,g:["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a","6666666666666666666666666666666666666666666666666666666666666658"]});var pre;try{pre=require("./precomputed/secp256k1")}catch(e){pre=void 0}defineCurve("secp256k1",{type:"short",prime:"k256",p:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",a:"0",b:"7",n:"ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",h:"1",hash:hash.sha256,beta:"7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",lambda:"5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",basis:[{a:"3086d221a7d46bcde86c90e49284eb15",b:"-e4437ed6010e88286f547fa90abfe4c3"},{a:"114ca50f7a8e2f3f657c1108d9d44cfd8",b:"3086d221a7d46bcde86c90e49284eb15"}],gRed:!1,g:["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798","483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",pre]});

},{"../elliptic":91,"./precomputed/secp256k1":105,"hash.js":131}],98:[function(require,module,exports){
"use strict";function EC(e){return this instanceof EC?("string"==typeof e&&(assert(elliptic.curves.hasOwnProperty(e),"Unknown curve "+e),e=elliptic.curves[e]),e instanceof elliptic.curves.PresetCurve&&(e={curve:e}),this.curve=e.curve.curve,this.n=this.curve.n,this.nh=this.n.ushrn(1),this.g=this.curve.g,this.g=e.curve.g,this.g.precompute(e.curve.n.bitLength()+1),void(this.hash=e.hash||e.curve.hash)):new EC(e)}var BN=require("bn.js"),elliptic=require("../../elliptic"),utils=elliptic.utils,assert=utils.assert,KeyPair=require("./key"),Signature=require("./signature");module.exports=EC,EC.prototype.keyPair=function(e){return new KeyPair(this,e)},EC.prototype.keyFromPrivate=function(e,t){return KeyPair.fromPrivate(this,e,t)},EC.prototype.keyFromPublic=function(e,t){return KeyPair.fromPublic(this,e,t)},EC.prototype.genKeyPair=function(e){e||(e={});for(var t=new elliptic.hmacDRBG({hash:this.hash,pers:e.pers,entropy:e.entropy||elliptic.rand(this.hash.hmacStrength),nonce:this.n.toArray()}),r=this.n.byteLength(),i=this.n.sub(new BN(2));;){var n=new BN(t.generate(r));if(!(n.cmp(i)>0))return n.iaddn(1),this.keyFromPrivate(n)}},EC.prototype._truncateToN=function(e,t){var r=8*e.byteLength()-this.n.bitLength();return r>0&&(e=e.ushrn(r)),!t&&e.cmp(this.n)>=0?e.sub(this.n):e},EC.prototype.sign=function(e,t,r,i){"object"==typeof r&&(i=r,r=null),i||(i={}),t=this.keyFromPrivate(t,r),e=this._truncateToN(new BN(e,16));for(var n=this.n.byteLength(),s=t.getPrivate().toArray("be",n),u=e.toArray("be",n),o=new elliptic.hmacDRBG({hash:this.hash,entropy:s,nonce:u,pers:i.pers,persEnc:i.persEnc}),h=this.n.sub(new BN(1)),c=0;!0;c++){var a=i.k?i.k(c):new BN(o.generate(this.n.byteLength()));if(a=this._truncateToN(a,!0),!(a.cmpn(1)<=0||a.cmp(h)>=0)){var p=this.g.mul(a);if(!p.isInfinity()){var v=p.getX(),m=v.umod(this.n);if(0!==m.cmpn(0)){var y=a.invm(this.n).mul(m.mul(t.getPrivate()).iadd(e));if(y=y.umod(this.n),0!==y.cmpn(0)){var l=(p.getY().isOdd()?1:0)|(0!==v.cmp(m)?2:0);return i.canonical&&y.cmp(this.nh)>0&&(y=this.n.sub(y),l^=1),new Signature({r:m,s:y,recoveryParam:l})}}}}}},EC.prototype.verify=function(e,t,r,i){e=this._truncateToN(new BN(e,16)),r=this.keyFromPublic(r,i),t=new Signature(t,"hex");var n=t.r,s=t.s;if(n.cmpn(1)<0||n.cmp(this.n)>=0)return!1;if(s.cmpn(1)<0||s.cmp(this.n)>=0)return!1;var u=s.invm(this.n),o=u.mul(e).umod(this.n),h=u.mul(n).umod(this.n),c=this.g.mulAdd(o,r.getPublic(),h);return c.isInfinity()?!1:0===c.getX().umod(this.n).cmp(n)},EC.prototype.recoverPubKey=function(e,t,r,i){assert((3&r)===r,"The recovery param is more than two bits"),t=new Signature(t,i);var n=this.n,s=new BN(e),u=t.r,o=t.s,h=1&r,c=r>>1;if(u.cmp(this.curve.p.umod(this.curve.n))>=0&&c)throw new Error("Unable to find sencond key candinate");u=c?this.curve.pointFromX(u.add(this.curve.n),h):this.curve.pointFromX(u,h);var a=n.sub(s),p=t.r.invm(n);return this.g.mulAdd(a,u,o).mul(p)},EC.prototype.getKeyRecoveryParam=function(e,t,r,i){if(t=new Signature(t,i),null!==t.recoveryParam)return t.recoveryParam;for(var n=0;4>n;n++){var s;try{s=this.recoverPubKey(e,t,n)}catch(e){continue}if(s.eq(r))return n}throw new Error("Unable to find valid recovery factor")};

},{"../../elliptic":91,"./key":99,"./signature":100,"bn.js":19}],99:[function(require,module,exports){
"use strict";function KeyPair(i,t){this.ec=i,this.priv=null,this.pub=null,t.priv&&this._importPrivate(t.priv,t.privEnc),t.pub&&this._importPublic(t.pub,t.pubEnc)}var BN=require("bn.js");module.exports=KeyPair,KeyPair.fromPublic=function(i,t,r){return t instanceof KeyPair?t:new KeyPair(i,{pub:t,pubEnc:r})},KeyPair.fromPrivate=function(i,t,r){return t instanceof KeyPair?t:new KeyPair(i,{priv:t,privEnc:r})},KeyPair.prototype.validate=function(){var i=this.getPublic();return i.isInfinity()?{result:!1,reason:"Invalid public key"}:i.validate()?i.mul(this.ec.curve.n).isInfinity()?{result:!0,reason:null}:{result:!1,reason:"Public key * N != O"}:{result:!1,reason:"Public key is not a point"}},KeyPair.prototype.getPublic=function(i,t){return"string"==typeof i&&(t=i,i=null),this.pub||(this.pub=this.ec.g.mul(this.priv)),t?this.pub.encode(t,i):this.pub},KeyPair.prototype.getPrivate=function(i){return"hex"===i?this.priv.toString(16,2):this.priv},KeyPair.prototype._importPrivate=function(i,t){this.priv=new BN(i,t||16),this.priv=this.priv.umod(this.ec.curve.n)},KeyPair.prototype._importPublic=function(i,t){return i.x||i.y?void(this.pub=this.ec.curve.point(i.x,i.y)):void(this.pub=this.ec.curve.decodePoint(i,t))},KeyPair.prototype.derive=function(i){return i.mul(this.priv).getX()},KeyPair.prototype.sign=function(i,t,r){return this.ec.sign(i,this,t,r)},KeyPair.prototype.verify=function(i,t){return this.ec.verify(i,t,this)},KeyPair.prototype.inspect=function(){return"<Key priv: "+(this.priv&&this.priv.toString(16,2))+" pub: "+(this.pub&&this.pub.inspect())+" >"};

},{"bn.js":19}],100:[function(require,module,exports){
"use strict";function Signature(t,r){return t instanceof Signature?t:void(this._importDER(t,r)||(assert(t.r&&t.s,"Signature without r or s"),this.r=new BN(t.r,16),this.s=new BN(t.s,16),void 0===t.recoveryParam?this.recoveryParam=null:this.recoveryParam=t.recoveryParam))}function Position(){this.place=0}function getLength(t,r){var e=t[r.place++];if(!(128&e))return e;for(var n=15&e,i=0,a=0,c=r.place;n>a;a++,c++)i<<=8,i|=t[c];return r.place=c,i}function rmPadding(t){for(var r=0,e=t.length-1;!t[r]&&!(128&t[r+1])&&e>r;)r++;return 0===r?t:t.slice(r)}function constructLength(t,r){if(128>r)return void t.push(r);var e=1+(Math.log(r)/Math.LN2>>>3);for(t.push(128|e);--e;)t.push(r>>>(e<<3)&255);t.push(r)}var BN=require("bn.js"),elliptic=require("../../elliptic"),utils=elliptic.utils,assert=utils.assert;module.exports=Signature,Signature.prototype._importDER=function(t,r){t=utils.toArray(t,r);var e=new Position;if(48!==t[e.place++])return!1;var n=getLength(t,e);if(n+e.place!==t.length)return!1;if(2!==t[e.place++])return!1;var i=getLength(t,e),a=t.slice(e.place,i+e.place);if(e.place+=i,2!==t[e.place++])return!1;var c=getLength(t,e);if(t.length!==c+e.place)return!1;var s=t.slice(e.place,c+e.place);return 0===a[0]&&128&a[1]&&(a=a.slice(1)),0===s[0]&&128&s[1]&&(s=s.slice(1)),this.r=new BN(a),this.s=new BN(s),this.recoveryParam=null,!0},Signature.prototype.toDER=function(t){var r=this.r.toArray(),e=this.s.toArray();for(128&r[0]&&(r=[0].concat(r)),128&e[0]&&(e=[0].concat(e)),r=rmPadding(r),e=rmPadding(e);!(e[0]||128&e[1]);)e=e.slice(1);var n=[2];constructLength(n,r.length),n=n.concat(r),n.push(2),constructLength(n,e.length);var i=n.concat(e),a=[48];return constructLength(a,i.length),a=a.concat(i),utils.encode(a,t)};

},{"../../elliptic":91,"bn.js":19}],101:[function(require,module,exports){
"use strict";function EDDSA(t){if(assert("ed25519"===t,"only tested with ed25519 so far"),!(this instanceof EDDSA))return new EDDSA(t);var t=elliptic.curves[t].curve;this.curve=t,this.g=t.g,this.g.precompute(t.n.bitLength()+1),this.pointClass=t.point().constructor,this.encodingLength=Math.ceil(t.n.bitLength()/8),this.hash=hash.sha512}var hash=require("hash.js"),elliptic=require("../../elliptic"),utils=elliptic.utils,assert=utils.assert,parseBytes=utils.parseBytes,KeyPair=require("./key"),Signature=require("./signature");module.exports=EDDSA,EDDSA.prototype.sign=function(t,e){t=parseBytes(t);var i=this.keyFromSecret(e),r=this.hashInt(i.messagePrefix(),t),n=this.g.mul(r),s=this.encodePoint(n),o=this.hashInt(s,i.pubBytes(),t).mul(i.priv()),u=r.add(o).umod(this.curve.n);return this.makeSignature({R:n,S:u,Rencoded:s})},EDDSA.prototype.verify=function(t,e,i){t=parseBytes(t),e=this.makeSignature(e);var r=this.keyFromPublic(i),n=this.hashInt(e.Rencoded(),r.pubBytes(),t),s=this.g.mul(e.S()),o=e.R().add(r.pub().mul(n));return o.eq(s)},EDDSA.prototype.hashInt=function(){for(var t=this.hash(),e=0;e<arguments.length;e++)t.update(arguments[e]);return utils.intFromLE(t.digest()).umod(this.curve.n)},EDDSA.prototype.keyFromPublic=function(t){return KeyPair.fromPublic(this,t)},EDDSA.prototype.keyFromSecret=function(t){return KeyPair.fromSecret(this,t)},EDDSA.prototype.makeSignature=function(t){return t instanceof Signature?t:new Signature(this,t)},EDDSA.prototype.encodePoint=function(t){var e=t.getY().toArray("le",this.encodingLength);return e[this.encodingLength-1]|=t.getX().isOdd()?128:0,e},EDDSA.prototype.decodePoint=function(t){t=utils.parseBytes(t);var e=t.length-1,i=t.slice(0,e).concat(-129&t[e]),r=0!==(128&t[e]),n=utils.intFromLE(i);return this.curve.pointFromY(n,r)},EDDSA.prototype.encodeInt=function(t){return t.toArray("le",this.encodingLength)},EDDSA.prototype.decodeInt=function(t){return utils.intFromLE(t)},EDDSA.prototype.isPoint=function(t){return t instanceof this.pointClass};

},{"../../elliptic":91,"./key":102,"./signature":103,"hash.js":131}],102:[function(require,module,exports){
"use strict";function KeyPair(e,t){this.eddsa=e,this._secret=parseBytes(t.secret),e.isPoint(t.pub)?this._pub=t.pub:this._pubBytes=parseBytes(t.pub)}var elliptic=require("../../elliptic"),utils=elliptic.utils,assert=utils.assert,parseBytes=utils.parseBytes,cachedProperty=utils.cachedProperty;KeyPair.fromPublic=function(e,t){return t instanceof KeyPair?t:new KeyPair(e,{pub:t})},KeyPair.fromSecret=function(e,t){return t instanceof KeyPair?t:new KeyPair(e,{secret:t})},KeyPair.prototype.secret=function(){return this._secret},cachedProperty(KeyPair,function(){return this.eddsa.encodePoint(this.pub())}),cachedProperty(KeyPair,function(){return this._pubBytes?this.eddsa.decodePoint(this._pubBytes):this.eddsa.g.mul(this.priv())}),cachedProperty(KeyPair,function(){var e=this.eddsa,t=this.hash(),i=e.encodingLength-1,r=t.slice(0,e.encodingLength);return r[0]&=248,r[i]&=127,r[i]|=64,r}),cachedProperty(KeyPair,function(){return this.eddsa.decodeInt(this.privBytes())}),cachedProperty(KeyPair,function(){return this.eddsa.hash().update(this.secret()).digest()}),cachedProperty(KeyPair,function(){return this.hash().slice(this.eddsa.encodingLength)}),KeyPair.prototype.sign=function(e){return assert(this._secret,"KeyPair can only verify"),this.eddsa.sign(e,this)},KeyPair.prototype.verify=function(e,t){return this.eddsa.verify(e,t,this)},KeyPair.prototype.getSecret=function(e){return assert(this._secret,"KeyPair is public only"),utils.encode(this.secret(),e)},KeyPair.prototype.getPublic=function(e){return utils.encode(this.pubBytes(),e)},module.exports=KeyPair;

},{"../../elliptic":91}],103:[function(require,module,exports){
"use strict";function Signature(e,t){this.eddsa=e,"object"!=typeof t&&(t=parseBytes(t)),Array.isArray(t)&&(t={R:t.slice(0,e.encodingLength),S:t.slice(e.encodingLength)}),assert(t.R&&t.S,"Signature without R or S"),e.isPoint(t.R)&&(this._R=t.R),t.S instanceof BN&&(this._S=t.S),this._Rencoded=Array.isArray(t.R)?t.R:t.Rencoded,this._Sencoded=Array.isArray(t.S)?t.S:t.Sencoded}var BN=require("bn.js"),elliptic=require("../../elliptic"),utils=elliptic.utils,assert=utils.assert,cachedProperty=utils.cachedProperty,parseBytes=utils.parseBytes;cachedProperty(Signature,function(){return this.eddsa.decodeInt(this.Sencoded())}),cachedProperty(Signature,function(){return this.eddsa.decodePoint(this.Rencoded())}),cachedProperty(Signature,function(){return this.eddsa.encodePoint(this.R())}),cachedProperty(Signature,function(){return this.eddsa.encodeInt(this.S())}),Signature.prototype.toBytes=function(){return this.Rencoded().concat(this.Sencoded())},Signature.prototype.toHex=function(){return utils.encode(this.toBytes(),"hex").toUpperCase()},module.exports=Signature;

},{"../../elliptic":91,"bn.js":19}],104:[function(require,module,exports){
"use strict";function HmacDRBG(t){if(!(this instanceof HmacDRBG))return new HmacDRBG(t);this.hash=t.hash,this.predResist=!!t.predResist,this.outLen=this.hash.outSize,this.minEntropy=t.minEntropy||this.hash.hmacStrength,this.reseed=null,this.reseedInterval=null,this.K=null,this.V=null;var e=utils.toArray(t.entropy,t.entropyEnc),s=utils.toArray(t.nonce,t.nonceEnc),i=utils.toArray(t.pers,t.persEnc);assert(e.length>=this.minEntropy/8,"Not enough entropy. Minimum is: "+this.minEntropy+" bits"),this._init(e,s,i)}var hash=require("hash.js"),elliptic=require("../elliptic"),utils=elliptic.utils,assert=utils.assert;module.exports=HmacDRBG,HmacDRBG.prototype._init=function(t,e,s){var i=t.concat(e).concat(s);this.K=new Array(this.outLen/8),this.V=new Array(this.outLen/8);for(var h=0;h<this.V.length;h++)this.K[h]=0,this.V[h]=1;this._update(i),this.reseed=1,this.reseedInterval=281474976710656},HmacDRBG.prototype._hmac=function(){return new hash.hmac(this.hash,this.K)},HmacDRBG.prototype._update=function(t){var e=this._hmac().update(this.V).update([0]);t&&(e=e.update(t)),this.K=e.digest(),this.V=this._hmac().update(this.V).digest(),t&&(this.K=this._hmac().update(this.V).update([1]).update(t).digest(),this.V=this._hmac().update(this.V).digest())},HmacDRBG.prototype.reseed=function(t,e,s,i){"string"!=typeof e&&(i=s,s=e,e=null),t=utils.toBuffer(t,e),s=utils.toBuffer(s,i),assert(t.length>=this.minEntropy/8,"Not enough entropy. Minimum is: "+this.minEntropy+" bits"),this._update(t.concat(s||[])),this.reseed=1},HmacDRBG.prototype.generate=function(t,e,s,i){if(this.reseed>this.reseedInterval)throw new Error("Reseed is required");"string"!=typeof e&&(i=s,s=e,e=null),s&&(s=utils.toArray(s,i),this._update(s));for(var h=[];h.length<t;)this.V=this._hmac().update(this.V).digest(),h=h.concat(this.V);var r=h.slice(0,t);return this._update(s),this.reseed++,utils.encode(r,e)};

},{"../elliptic":91,"hash.js":131}],105:[function(require,module,exports){
module.exports={doubles:{step:4,points:[["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a","f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"],["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508","11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"],["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739","d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"],["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640","4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"],["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c","4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"],["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda","96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"],["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa","5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"],["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0","cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"],["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d","9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"],["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d","e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"],["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1","9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"],["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0","5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"],["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047","10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"],["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862","283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"],["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7","7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"],["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd","56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"],["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83","7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"],["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a","53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"],["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8","bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"],["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d","4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"],["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725","7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"],["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754","4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"],["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c","17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"],["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6","6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"],["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39","c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"],["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891","893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"],["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b","febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"],["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03","2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"],["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d","eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"],["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070","7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"],["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4","e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"],["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da","662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"],["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11","1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"],["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e","efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"],["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41","2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"],["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef","67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"],["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8","db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"],["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d","648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"],["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96","35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"],["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd","ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"],["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5","9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"],["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266","40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"],["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71","34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"],["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac","c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"],["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751","1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"],["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e","493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"],["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241","c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"],["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3","be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"],["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f","4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"],["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19","aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"],["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be","b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"],["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9","6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"],["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2","8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"],["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13","7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"],["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c","ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"],["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba","2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"],["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151","e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"],["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073","d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"],["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458","38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"],["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b","69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"],["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366","d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"],["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa","40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"],["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0","620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"],["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787","7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"],["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e","ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]]},naf:{wnd:7,points:[["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9","388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"],["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4","d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"],["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc","6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"],["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe","cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"],["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb","d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"],["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8","ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"],["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e","581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"],["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34","4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"],["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c","85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"],["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5","321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"],["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f","2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"],["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714","73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"],["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729","a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"],["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db","2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"],["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4","e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"],["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5","b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"],["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479","2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"],["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d","80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"],["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f","1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"],["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb","d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"],["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9","eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"],["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963","758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"],["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74","958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"],["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530","e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"],["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b","5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"],["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247","cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"],["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1","cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"],["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120","4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"],["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435","91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"],["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18","673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"],["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8","59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"],["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb","3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"],["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f","55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"],["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143","efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"],["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba","e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"],["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45","f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"],["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a","744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"],["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e","c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"],["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8","e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"],["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c","30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"],["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519","e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"],["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab","100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"],["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca","ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"],["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf","8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"],["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610","68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"],["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4","f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"],["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c","d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"],["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940","edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"],["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980","a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"],["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3","66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"],["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf","9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"],["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63","4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"],["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448","fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"],["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf","5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"],["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5","8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"],["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6","8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"],["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5","5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"],["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99","f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"],["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51","f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"],["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5","42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"],["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5","204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"],["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997","4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"],["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881","73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"],["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5","39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"],["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66","d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"],["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726","ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"],["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede","6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"],["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94","60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"],["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31","3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"],["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51","b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"],["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252","ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"],["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5","cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"],["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b","6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"],["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4","322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"],["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f","6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"],["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889","2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"],["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246","b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"],["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984","998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"],["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a","b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"],["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030","bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"],["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197","6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"],["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593","c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"],["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef","21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"],["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38","60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"],["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a","49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"],["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111","5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"],["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502","7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"],["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea","be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"],["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26","8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"],["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986","39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"],["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e","62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"],["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4","25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"],["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda","ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"],["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859","cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"],["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f","f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"],["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c","6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"],["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942","fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"],["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a","1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"],["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80","5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"],["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d","438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"],["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1","cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"],["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63","c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"],["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352","6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"],["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193","ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"],["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00","9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"],["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58","ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"],["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7","d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"],["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8","c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"],["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e","67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"],["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d","cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"],["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b","299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"],["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f","f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"],["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6","462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"],["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297","62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"],["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a","7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"],["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c","ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"],["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52","4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"],["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb","bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"],["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065","bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"],["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917","603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"],["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9","cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"],["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3","553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"],["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57","712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"],["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66","ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"],["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8","9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"],["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721","9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"],["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180","4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]]}};

},{}],106:[function(require,module,exports){
"use strict";function toArray(r,t){if(Array.isArray(r))return r.slice();if(!r)return[];var e=[];if("string"!=typeof r){for(var n=0;n<r.length;n++)e[n]=0|r[n];return e}if(t){if("hex"===t){r=r.replace(/[^a-z0-9]+/gi,""),r.length%2!==0&&(r="0"+r);for(var n=0;n<r.length;n+=2)e.push(parseInt(r[n]+r[n+1],16))}}else for(var n=0;n<r.length;n++){var i=r.charCodeAt(n),o=i>>8,s=255&i;o?e.push(o,s):e.push(s)}return e}function zero2(r){return 1===r.length?"0"+r:r}function toHex(r){for(var t="",e=0;e<r.length;e++)t+=zero2(r[e].toString(16));return t}function getNAF(r,t){for(var e=[],n=1<<t+1,i=r.clone();i.cmpn(1)>=0;){var o;if(i.isOdd()){var s=i.andln(n-1);o=s>(n>>1)-1?(n>>1)-s:s,i.isubn(o)}else o=0;e.push(o);for(var u=0!==i.cmpn(0)&&0===i.andln(n-1)?t+1:1,a=1;u>a;a++)e.push(0);i.iushrn(u)}return e}function getJSF(r,t){var e=[[],[]];r=r.clone(),t=t.clone();for(var n=0,i=0;r.cmpn(-n)>0||t.cmpn(-i)>0;){var o=r.andln(3)+n&3,s=t.andln(3)+i&3;3===o&&(o=-1),3===s&&(s=-1);var u;if(0===(1&o))u=0;else{var a=r.andln(7)+n&7;u=3!==a&&5!==a||2!==s?o:-o}e[0].push(u);var l;if(0===(1&s))l=0;else{var a=t.andln(7)+i&7;l=3!==a&&5!==a||2!==o?s:-s}e[1].push(l),2*n===u+1&&(n=1-n),2*i===l+1&&(i=1-i),r.iushrn(1),t.iushrn(1)}return e}function cachedProperty(r,t){var e=t.name,n="_"+e;r.prototype[e]=function(){return void 0!==this[n]?this[n]:this[n]=t.call(this)}}function parseBytes(r){return"string"==typeof r?utils.toArray(r,"hex"):r}function intFromLE(r){return new BN(r,"hex","le")}var utils=exports,BN=require("bn.js");utils.assert=function(r,t){if(!r)throw new Error(t||"Assertion failed")},utils.toArray=toArray,utils.zero2=zero2,utils.toHex=toHex,utils.encode=function(r,t){return"hex"===t?toHex(r):r},utils.getNAF=getNAF,utils.getJSF=getJSF,utils.cachedProperty=cachedProperty,utils.parseBytes=parseBytes,utils.intFromLE=intFromLE;

},{"bn.js":19}],107:[function(require,module,exports){
module.exports={
  "_args": [
    [
      "elliptic@^6.0.0",
      "/home/oredds/Workspace/EDA/eMazon-Me/node_modules/browserify-sign"
    ]
  ],
  "_from": "elliptic@>=6.0.0 <7.0.0",
  "_id": "elliptic@6.2.3",
  "_inCache": true,
  "_installable": true,
  "_location": "/elliptic",
  "_nodeVersion": "5.4.1",
  "_npmUser": {
    "email": "fedor@indutny.com",
    "name": "indutny"
  },
  "_npmVersion": "3.3.12",
  "_phantomChildren": {},
  "_requested": {
    "name": "elliptic",
    "raw": "elliptic@^6.0.0",
    "rawSpec": "^6.0.0",
    "scope": null,
    "spec": ">=6.0.0 <7.0.0",
    "type": "range"
  },
  "_requiredBy": [
    "/browserify-sign",
    "/create-ecdh"
  ],
  "_resolved": "https://registry.npmjs.org/elliptic/-/elliptic-6.2.3.tgz",
  "_shasum": "18e46d7306b0951275a2d42063270a14b74ebe99",
  "_shrinkwrap": null,
  "_spec": "elliptic@^6.0.0",
  "_where": "/home/oredds/Workspace/EDA/eMazon-Me/node_modules/browserify-sign",
  "author": {
    "email": "fedor@indutny.com",
    "name": "Fedor Indutny"
  },
  "bugs": {
    "url": "https://github.com/indutny/elliptic/issues"
  },
  "dependencies": {
    "bn.js": "^4.0.0",
    "brorand": "^1.0.1",
    "hash.js": "^1.0.0",
    "inherits": "^2.0.1"
  },
  "description": "EC cryptography",
  "devDependencies": {
    "coveralls": "^2.11.3",
    "istanbul": "^0.4.2",
    "jscs": "^2.9.0",
    "jshint": "^2.6.0",
    "mocha": "^2.1.0"
  },
  "directories": {},
  "dist": {
    "shasum": "18e46d7306b0951275a2d42063270a14b74ebe99",
    "tarball": "https://registry.npmjs.org/elliptic/-/elliptic-6.2.3.tgz"
  },
  "files": [
    "lib"
  ],
  "gitHead": "c32f20b22b420eb6af3c6dda28963deb7facf823",
  "homepage": "https://github.com/indutny/elliptic",
  "keywords": [
    "EC",
    "Elliptic",
    "curve",
    "Cryptography"
  ],
  "license": "MIT",
  "main": "lib/elliptic.js",
  "maintainers": [
    {
      "email": "fedor@indutny.com",
      "name": "indutny"
    }
  ],
  "name": "elliptic",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/indutny/elliptic.git"
  },
  "scripts": {
    "coverage": "npm run unit --coverage",
    "coveralls": "npm run coverage && cat ./coverage/lcov.info | coveralls",
    "jscs": "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/*.js",
    "jshint": "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/*.js",
    "lint": "npm run jscs && npm run jshint",
    "test": "npm run lint && npm run unit",
    "unit": "istanbul test _mocha --reporter=spec test/*-test.js"
  },
  "version": "6.2.3"
}

},{}],108:[function(require,module,exports){
"use strict";function escapeHtml(e){var t=""+e,a=matchHtmlRegExp.exec(t);if(!a)return t;var r,c="",s=0,n=0;for(s=a.index;s<t.length;s++){switch(t.charCodeAt(s)){case 34:r="&quot;";break;case 38:r="&amp;";break;case 39:r="&#39;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}n!==s&&(c+=t.substring(n,s)),n=s+1,c+=r}return n!==s?c+t.substring(n,s):c}var matchHtmlRegExp=/["'&<>]/;module.exports=escapeHtml;

},{}],109:[function(require,module,exports){
(function (Buffer){
"use strict";function entitytag(t){if(0===t.length)return'"0-1B2M2Y8AsgTpgAmY7PhCfg"';var e=crypto.createHash("md5").update(t,"utf8").digest("base64").replace(base64PadCharRegExp,""),r="string"==typeof t?Buffer.byteLength(t,"utf8"):t.length;return'"'+r.toString(16)+"-"+e+'"'}function etag(t,e){if(null==t)throw new TypeError("argument entity is required");var r=isstats(t),n=e&&"boolean"==typeof e.weak?e.weak:r;if(!r&&"string"!=typeof t&&!Buffer.isBuffer(t))throw new TypeError("argument entity must be string, Buffer, or fs.Stats");var i=r?stattag(t):entitytag(t);return n?"W/"+i:i}function isstats(t){return"function"==typeof Stats&&t instanceof Stats?!0:t&&"object"==typeof t&&"ctime"in t&&"[object Date]"===toString.call(t.ctime)&&"mtime"in t&&"[object Date]"===toString.call(t.mtime)&&"ino"in t&&"number"==typeof t.ino&&"size"in t&&"number"==typeof t.size}function stattag(t){var e=t.mtime.getTime().toString(16),r=t.size.toString(16);return'"'+r+"-"+e+'"'}module.exports=etag;var crypto=require("crypto"),Stats=require("fs").Stats,base64PadCharRegExp=/=+$/,toString=Object.prototype.toString;

}).call(this,require("buffer").Buffer)
},{"buffer":60,"crypto":75,"fs":58}],110:[function(require,module,exports){
function EventEmitter(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function isFunction(e){return"function"==typeof e}function isNumber(e){return"number"==typeof e}function isObject(e){return"object"==typeof e&&null!==e}function isUndefined(e){return void 0===e}module.exports=EventEmitter,EventEmitter.EventEmitter=EventEmitter,EventEmitter.prototype._events=void 0,EventEmitter.prototype._maxListeners=void 0,EventEmitter.defaultMaxListeners=10,EventEmitter.prototype.setMaxListeners=function(e){if(!isNumber(e)||0>e||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},EventEmitter.prototype.emit=function(e){var t,i,n,s,r,o;if(this._events||(this._events={}),"error"===e&&(!this._events.error||isObject(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t;throw TypeError('Uncaught, unspecified "error" event.')}if(i=this._events[e],isUndefined(i))return!1;if(isFunction(i))switch(arguments.length){case 1:i.call(this);break;case 2:i.call(this,arguments[1]);break;case 3:i.call(this,arguments[1],arguments[2]);break;default:s=Array.prototype.slice.call(arguments,1),i.apply(this,s)}else if(isObject(i))for(s=Array.prototype.slice.call(arguments,1),o=i.slice(),n=o.length,r=0;n>r;r++)o[r].apply(this,s);return!0},EventEmitter.prototype.addListener=function(e,t){var i;if(!isFunction(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,isFunction(t.listener)?t.listener:t),this._events[e]?isObject(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,isObject(this._events[e])&&!this._events[e].warned&&(i=isUndefined(this._maxListeners)?EventEmitter.defaultMaxListeners:this._maxListeners,i&&i>0&&this._events[e].length>i&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())),this},EventEmitter.prototype.on=EventEmitter.prototype.addListener,EventEmitter.prototype.once=function(e,t){function i(){this.removeListener(e,i),n||(n=!0,t.apply(this,arguments))}if(!isFunction(t))throw TypeError("listener must be a function");var n=!1;return i.listener=t,this.on(e,i),this},EventEmitter.prototype.removeListener=function(e,t){var i,n,s,r;if(!isFunction(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(i=this._events[e],s=i.length,n=-1,i===t||isFunction(i.listener)&&i.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(isObject(i)){for(r=s;r-- >0;)if(i[r]===t||i[r].listener&&i[r].listener===t){n=r;break}if(0>n)return this;1===i.length?(i.length=0,delete this._events[e]):i.splice(n,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},EventEmitter.prototype.removeAllListeners=function(e){var t,i;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(i=this._events[e],isFunction(i))this.removeListener(e,i);else if(i)for(;i.length;)this.removeListener(e,i[i.length-1]);return delete this._events[e],this},EventEmitter.prototype.listeners=function(e){var t;return t=this._events&&this._events[e]?isFunction(this._events[e])?[this._events[e]]:this._events[e].slice():[]},EventEmitter.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(isFunction(t))return 1;if(t)return t.length}return 0},EventEmitter.listenerCount=function(e,t){return e.listenerCount(t)};

},{}],111:[function(require,module,exports){
(function (Buffer){
function EVP_BytesToKey(e,f,r,u){Buffer.isBuffer(e)||(e=new Buffer(e,"binary")),f&&!Buffer.isBuffer(f)&&(f=new Buffer(f,"binary")),r/=8,u=u||0;for(var i,n,a=0,t=0,B=new Buffer(r),o=new Buffer(u),h=0,s=[];;){if(h++>0&&s.push(i),s.push(e),f&&s.push(f),i=md5(Buffer.concat(s)),s=[],n=0,r>0)for(;;){if(0===r)break;if(n===i.length)break;B[a++]=i[n],r--,n++}if(u>0&&n!==i.length)for(;;){if(0===u)break;if(n===i.length)break;o[t++]=i[n],u--,n++}if(0===r&&0===u)break}for(n=0;n<i.length;n++)i[n]=0;return{key:B,iv:o}}var md5=require("create-hash/md5");module.exports=EVP_BytesToKey;

}).call(this,require("buffer").Buffer)
},{"buffer":60,"create-hash/md5":73}],112:[function(require,module,exports){
"use strict";module.exports=require("./lib/express");

},{"./lib/express":114}],113:[function(require,module,exports){
(function (process){
"use strict";function logerror(e){"test"!==this.get("env")&&console.error(e.stack||e.toString())}function tryRender(e,t,r){try{e.render(t,r)}catch(i){r(i)}}var finalhandler=require("finalhandler"),Router=require("./router"),methods=require("methods"),middleware=require("./middleware/init"),query=require("./middleware/query"),debug=require("debug")("express:application"),View=require("./view"),http=require("http"),compileETag=require("./utils").compileETag,compileQueryParser=require("./utils").compileQueryParser,compileTrust=require("./utils").compileTrust,deprecate=require("depd")("express"),flatten=require("array-flatten"),merge=require("utils-merge"),resolve=require("path").resolve,slice=Array.prototype.slice,app=exports=module.exports={},trustProxyDefaultSymbol="@@symbol:trust_proxy_default";app.init=function(){this.cache={},this.engines={},this.settings={},this.defaultConfiguration()},app.defaultConfiguration=function(){var e=process.env.NODE_ENV||"development";this.enable("x-powered-by"),this.set("etag","weak"),this.set("env",e),this.set("query parser","extended"),this.set("subdomain offset",2),this.set("trust proxy",!1),Object.defineProperty(this.settings,trustProxyDefaultSymbol,{configurable:!0,value:!0}),debug("booting in %s mode",e),this.on("mount",function(e){this.settings[trustProxyDefaultSymbol]===!0&&"function"==typeof e.settings["trust proxy fn"]&&(delete this.settings["trust proxy"],delete this.settings["trust proxy fn"]),this.request.__proto__=e.request,this.response.__proto__=e.response,this.engines.__proto__=e.engines,this.settings.__proto__=e.settings}),this.locals=Object.create(null),this.mountpath="/",this.locals.settings=this.settings,this.set("view",View),this.set("views",resolve("views")),this.set("jsonp callback name","callback"),"production"===e&&this.enable("view cache"),Object.defineProperty(this,"router",{get:function(){throw new Error("'app.router' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.")}})},app.lazyrouter=function(){this._router||(this._router=new Router({caseSensitive:this.enabled("case sensitive routing"),strict:this.enabled("strict routing")}),this._router.use(query(this.get("query parser fn"))),this._router.use(middleware.init(this)))},app.handle=function(e,t,r){var i=this._router,s=r||finalhandler(e,t,{env:this.get("env"),onerror:logerror.bind(this)});return i?void i.handle(e,t,s):(debug("no routes defined on app"),void s())},app.use=function(e){var t=0,r="/";if("function"!=typeof e){for(var i=e;Array.isArray(i)&&0!==i.length;)i=i[0];"function"!=typeof i&&(t=1,r=e)}var s=flatten(slice.call(arguments,t));if(0===s.length)throw new TypeError("app.use() requires middleware functions");this.lazyrouter();var n=this._router;return s.forEach(function(e){return e&&e.handle&&e.set?(debug(".use app under %s",r),e.mountpath=r,e.parent=this,n.use(r,function(t,r,i){var s=t.app;e.handle(t,r,function(e){t.__proto__=s.request,r.__proto__=s.response,i(e)})}),void e.emit("mount",this)):n.use(r,e)},this),this},app.route=function(e){return this.lazyrouter(),this._router.route(e)},app.engine=function(e,t){if("function"!=typeof t)throw new Error("callback function required");var r="."!==e[0]?"."+e:e;return this.engines[r]=t,this},app.param=function(e,t){if(this.lazyrouter(),Array.isArray(e)){for(var r=0;r<e.length;r++)this.param(e[r],t);return this}return this._router.param(e,t),this},app.set=function(e,t){if(1===arguments.length)return this.settings[e];switch(debug('set "%s" to %o',e,t),this.settings[e]=t,e){case"etag":this.set("etag fn",compileETag(t));break;case"query parser":this.set("query parser fn",compileQueryParser(t));break;case"trust proxy":this.set("trust proxy fn",compileTrust(t)),Object.defineProperty(this.settings,trustProxyDefaultSymbol,{configurable:!0,value:!1})}return this},app.path=function(){return this.parent?this.parent.path()+this.mountpath:""},app.enabled=function(e){return Boolean(this.set(e))},app.disabled=function(e){return!this.set(e)},app.enable=function(e){return this.set(e,!0)},app.disable=function(e){return this.set(e,!1)},methods.forEach(function(e){app[e]=function(t){if("get"===e&&1===arguments.length)return this.set(t);this.lazyrouter();var r=this._router.route(t);return r[e].apply(r,slice.call(arguments,1)),this}}),app.all=function(e){this.lazyrouter();for(var t=this._router.route(e),r=slice.call(arguments,1),i=0;i<methods.length;i++)t[methods[i]].apply(t,r);return this},app.del=deprecate["function"](app["delete"],"app.del: Use app.delete instead"),app.render=function(e,t,r){var i,s=this.cache,n=r,o=this.engines,a=t,u={};if("function"==typeof t&&(n=t,a={}),merge(u,this.locals),a._locals&&merge(u,a._locals),merge(u,a),null==u.cache&&(u.cache=this.enabled("view cache")),u.cache&&(i=s[e]),!i){var p=this.get("view");if(i=new p(e,{defaultEngine:this.get("view engine"),root:this.get("views"),engines:o}),!i.path){var h=Array.isArray(i.root)&&i.root.length>1?'directories "'+i.root.slice(0,-1).join('", "')+'" or "'+i.root[i.root.length-1]+'"':'directory "'+i.root+'"',l=new Error('Failed to lookup view "'+e+'" in views '+h);return l.view=i,n(l)}u.cache&&(s[e]=i)}tryRender(i,u,n)},app.listen=function(){var e=http.createServer(this);return e.listen.apply(e,arguments)};

}).call(this,require('_process'))
},{"./middleware/init":115,"./middleware/query":116,"./router":119,"./utils":122,"./view":123,"_process":201,"array-flatten":2,"debug":76,"depd":78,"finalhandler":128,"http":242,"methods":166,"path":197,"utils-merge":255}],114:[function(require,module,exports){
"use strict";function createApplication(){var e=function(r,t,o){e.handle(r,t,o)};return mixin(e,EventEmitter.prototype,!1),mixin(e,proto,!1),e.request={__proto__:req,app:e},e.response={__proto__:res,app:e},e.init(),e}var EventEmitter=require("events").EventEmitter,mixin=require("merge-descriptors"),proto=require("./application"),Route=require("./router/route"),Router=require("./router"),req=require("./request"),res=require("./response");exports=module.exports=createApplication,exports.application=proto,exports.request=req,exports.response=res,exports.Route=Route,exports.Router=Router,exports.query=require("./middleware/query"),exports["static"]=require("serve-static"),["json","urlencoded","bodyParser","compress","cookieSession","session","logger","cookieParser","favicon","responseTime","errorHandler","timeout","methodOverride","vhost","csrf","directory","limit","multipart","staticCache"].forEach(function(e){Object.defineProperty(exports,e,{get:function(){throw new Error("Most middleware (like "+e+") is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.")},configurable:!0})});

},{"./application":113,"./middleware/query":116,"./request":117,"./response":118,"./router":119,"./router/route":121,"events":110,"merge-descriptors":165,"serve-static":230}],115:[function(require,module,exports){
"use strict";exports.init=function(e){return function(r,t,o){e.enabled("x-powered-by")&&t.setHeader("X-Powered-By","Express"),r.res=t,t.req=r,r.next=o,r.__proto__=e.request,t.__proto__=e.response,t.locals=t.locals||Object.create(null),o()}};

},{}],116:[function(require,module,exports){
"use strict";var parseUrl=require("parseurl"),qs=require("qs");module.exports=function(r){var e=Object.create(r||null),o=qs.parse;return"function"==typeof r&&(o=r,e=void 0),void 0!==e&&(void 0===e.allowDots&&(e.allowDots=!1),void 0===e.allowPrototypes&&(e.allowPrototypes=!0)),function(r,t,l){if(!r.query){var s=parseUrl(r).query;r.query=o(s,e)}l()}};

},{"parseurl":196,"qs":124}],117:[function(require,module,exports){
"use strict";function defineGetter(e,r,t){Object.defineProperty(e,r,{configurable:!0,enumerable:!0,get:t})}var accepts=require("accepts"),deprecate=require("depd")("express"),isIP=require("net").isIP,typeis=require("type-is"),http=require("http"),fresh=require("fresh"),parseRange=require("range-parser"),parse=require("parseurl"),proxyaddr=require("proxy-addr"),req=exports=module.exports={__proto__:http.IncomingMessage.prototype};req.get=req.header=function(e){var r=e.toLowerCase();switch(r){case"referer":case"referrer":return this.headers.referrer||this.headers.referer;default:return this.headers[r]}},req.accepts=function(){var e=accepts(this);return e.types.apply(e,arguments)},req.acceptsEncodings=function(){var e=accepts(this);return e.encodings.apply(e,arguments)},req.acceptsEncoding=deprecate["function"](req.acceptsEncodings,"req.acceptsEncoding: Use acceptsEncodings instead"),req.acceptsCharsets=function(){var e=accepts(this);return e.charsets.apply(e,arguments)},req.acceptsCharset=deprecate["function"](req.acceptsCharsets,"req.acceptsCharset: Use acceptsCharsets instead"),req.acceptsLanguages=function(){var e=accepts(this);return e.languages.apply(e,arguments)},req.acceptsLanguage=deprecate["function"](req.acceptsLanguages,"req.acceptsLanguage: Use acceptsLanguages instead"),req.range=function(e){var r=this.get("Range");if(r)return parseRange(e,r)},req.param=function(e,r){var t=this.params||{},s=this.body||{},n=this.query||{},a=1===arguments.length?"name":"name, default";return deprecate("req.param("+a+"): Use req.params, req.body, or req.query instead"),null!=t[e]&&t.hasOwnProperty(e)?t[e]:null!=s[e]?s[e]:null!=n[e]?n[e]:r},req.is=function(e){var r=e;if(!Array.isArray(e)){r=new Array(arguments.length);for(var t=0;t<r.length;t++)r[t]=arguments[t]}return typeis(this,r)},defineGetter(req,"protocol",function(){var e=this.connection.encrypted?"https":"http",r=this.app.get("trust proxy fn");return r(this.connection.remoteAddress,0)?(e=this.get("X-Forwarded-Proto")||e,e.split(/\s*,\s*/)[0]):e}),defineGetter(req,"secure",function(){return"https"===this.protocol}),defineGetter(req,"ip",function(){var e=this.app.get("trust proxy fn");return proxyaddr(this,e)}),defineGetter(req,"ips",function(){var e=this.app.get("trust proxy fn"),r=proxyaddr.all(this,e);return r.slice(1).reverse()}),defineGetter(req,"subdomains",function e(){var r=this.hostname;if(!r)return[];var t=this.app.get("subdomain offset"),e=isIP(r)?[r]:r.split(".").reverse();return e.slice(t)}),defineGetter(req,"path",function(){return parse(this).pathname}),defineGetter(req,"hostname",function(){var e=this.app.get("trust proxy fn"),r=this.get("X-Forwarded-Host");if(r&&e(this.connection.remoteAddress,0)||(r=this.get("Host")),r){var t="["===r[0]?r.indexOf("]")+1:0,s=r.indexOf(":",t);return-1!==s?r.substring(0,s):r}}),defineGetter(req,"host",deprecate["function"](function(){return this.hostname},"req.host: Use req.hostname instead")),defineGetter(req,"fresh",function(){var e=this.method,r=this.res.statusCode;return"GET"!=e&&"HEAD"!=e?!1:r>=200&&300>r||304==r?fresh(this.headers,this.res._headers||{}):!1}),defineGetter(req,"stale",function(){return!this.fresh}),defineGetter(req,"xhr",function(){var e=this.get("X-Requested-With")||"";return"xmlhttprequest"===e.toLowerCase()});

},{"accepts":1,"depd":78,"fresh":130,"http":242,"net":58,"parseurl":196,"proxy-addr":202,"range-parser":214,"type-is":248}],118:[function(require,module,exports){
(function (Buffer){
"use strict";function sendfile(e,t,s,r){function n(){if(!p){p=!0;var e=new Error("Request aborted");e.code="ECONNABORTED",r(e)}}function i(){if(!p){p=!0;var e=new Error("EISDIR, read");e.code="EISDIR",r(e)}}function o(e){p||(p=!0,r(e))}function a(){p||(p=!0,r())}function u(){d=!1}function h(e){return e&&"ECONNRESET"===e.code?n():e?o(e):void(p||setImmediate(function(){return d===!1||p?void(p||(p=!0,r())):void n()}))}function c(){d=!0}var d,p=!1;t.on("directory",i),t.on("end",a),t.on("error",o),t.on("file",u),t.on("stream",c),onFinished(e,h),s.headers&&t.on("headers",function(e){for(var t=s.headers,r=Object.keys(t),n=0;n<r.length;n++){var i=r[n];e.setHeader(i,t[i])}}),t.pipe(e)}var contentDisposition=require("content-disposition"),deprecate=require("depd")("express"),escapeHtml=require("escape-html"),http=require("http"),isAbsolute=require("./utils").isAbsolute,onFinished=require("on-finished"),path=require("path"),merge=require("utils-merge"),sign=require("cookie-signature").sign,normalizeType=require("./utils").normalizeType,normalizeTypes=require("./utils").normalizeTypes,setCharset=require("./utils").setCharset,statusCodes=http.STATUS_CODES,cookie=require("cookie"),send=require("send"),extname=path.extname,mime=send.mime,resolve=path.resolve,vary=require("vary"),res=module.exports={__proto__:http.ServerResponse.prototype},charsetRegExp=/;\s*charset\s*=/;res.status=function(e){return this.statusCode=e,this},res.links=function(e){var t=this.get("Link")||"";return t&&(t+=", "),this.set("Link",t+Object.keys(e).map(function(t){return"<"+e[t]+'>; rel="'+t+'"'}).join(", "))},res.send=function(e){var t,s,r,n=e,i=this.req,o=this.app;switch(2===arguments.length&&("number"!=typeof arguments[0]&&"number"==typeof arguments[1]?(deprecate("res.send(body, status): Use res.status(status).send(body) instead"),this.statusCode=arguments[1]):(deprecate("res.send(status, body): Use res.status(status).send(body) instead"),this.statusCode=arguments[0],n=arguments[1])),"number"==typeof n&&1===arguments.length&&(this.get("Content-Type")||this.type("txt"),deprecate("res.send(status): Use res.sendStatus(status) instead"),this.statusCode=n,n=statusCodes[n]),typeof n){case"string":this.get("Content-Type")||this.type("html");break;case"boolean":case"number":case"object":if(null===n)n="";else{if(!Buffer.isBuffer(n))return this.json(n);this.get("Content-Type")||this.type("bin")}}"string"==typeof n&&(t="utf8",r=this.get("Content-Type"),"string"==typeof r&&this.set("Content-Type",setCharset(r,"utf-8"))),void 0!==n&&(Buffer.isBuffer(n)||(n=new Buffer(n,t),t=void 0),s=n.length,this.set("Content-Length",s));var a,u=void 0!==s&&o.get("etag fn");return"function"!=typeof u||this.get("ETag")||(a=u(n,t))&&this.set("ETag",a),i.fresh&&(this.statusCode=304),204!=this.statusCode&&304!=this.statusCode||(this.removeHeader("Content-Type"),this.removeHeader("Content-Length"),this.removeHeader("Transfer-Encoding"),n=""),"HEAD"===i.method?this.end():this.end(n,t),this},res.json=function(e){var t=e;2===arguments.length&&("number"==typeof arguments[1]?(deprecate("res.json(obj, status): Use res.status(status).json(obj) instead"),this.statusCode=arguments[1]):(deprecate("res.json(status, obj): Use res.status(status).json(obj) instead"),this.statusCode=arguments[0],t=arguments[1]));var s=this.app,r=s.get("json replacer"),n=s.get("json spaces"),i=JSON.stringify(t,r,n);return this.get("Content-Type")||this.set("Content-Type","application/json"),this.send(i)},res.jsonp=function(e){var t=e;2===arguments.length&&("number"==typeof arguments[1]?(deprecate("res.jsonp(obj, status): Use res.status(status).json(obj) instead"),this.statusCode=arguments[1]):(deprecate("res.jsonp(status, obj): Use res.status(status).jsonp(obj) instead"),this.statusCode=arguments[0],t=arguments[1]));var s=this.app,r=s.get("json replacer"),n=s.get("json spaces"),i=JSON.stringify(t,r,n),o=this.req.query[s.get("jsonp callback name")];return this.get("Content-Type")||(this.set("X-Content-Type-Options","nosniff"),this.set("Content-Type","application/json")),Array.isArray(o)&&(o=o[0]),"string"==typeof o&&0!==o.length&&(this.charset="utf-8",this.set("X-Content-Type-Options","nosniff"),this.set("Content-Type","text/javascript"),o=o.replace(/[^\[\]\w$.]/g,""),i=i.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029"),i="/**/ typeof "+o+" === 'function' && "+o+"("+i+");"),this.send(i)},res.sendStatus=function(e){var t=statusCodes[e]||String(e);return this.statusCode=e,this.type("txt"),this.send(t)},res.sendFile=function(e,t,s){var r=s,n=this.req,i=this,o=n.next,a=t||{};if(!e)throw new TypeError("path argument is required to res.sendFile");if("function"==typeof t&&(r=t,a={}),!a.root&&!isAbsolute(e))throw new TypeError("path must be absolute or specify root to res.sendFile");var u=encodeURI(e),h=send(n,u,a);sendfile(i,h,a,function(e){return r?r(e):e&&"EISDIR"===e.code?o():void(e&&"ECONNABORTED"!==e.code&&"write"!==e.syscall&&o(e))})},res.sendfile=function(e,t,s){var r=s,n=this.req,i=this,o=n.next,a=t||{};"function"==typeof t&&(r=t,a={});var u=send(n,e,a);sendfile(i,u,a,function(e){return r?r(e):e&&"EISDIR"===e.code?o():void(e&&"ECONNABORT"!==e.code&&"write"!==e.syscall&&o(e))})},res.sendfile=deprecate["function"](res.sendfile,"res.sendfile: Use res.sendFile instead"),res.download=function(e,t,s){var r=s,n=t;"function"==typeof t&&(r=t,n=null);var i={"Content-Disposition":contentDisposition(n||e)},o=resolve(e);return this.sendFile(o,{headers:i},r)},res.contentType=res.type=function(e){var t=-1===e.indexOf("/")?mime.lookup(e):e;return this.set("Content-Type",t)},res.format=function(e){var t=this.req,s=t.next,r=e["default"];r&&delete e["default"];var n=Object.keys(e),i=n.length>0?t.accepts(n):!1;if(this.vary("Accept"),i)this.set("Content-Type",normalizeType(i).value),e[i](t,this,s);else if(r)r();else{var o=new Error("Not Acceptable");o.status=o.statusCode=406,o.types=normalizeTypes(n).map(function(e){return e.value}),s(o)}return this},res.attachment=function(e){return e&&this.type(extname(e)),this.set("Content-Disposition",contentDisposition(e)),this},res.append=function(e,t){var s=this.get(e),r=t;return s&&(r=Array.isArray(s)?s.concat(t):Array.isArray(t)?[s].concat(t):[s,t]),this.set(e,r)},res.set=res.header=function(e,t){if(2===arguments.length){var s=Array.isArray(t)?t.map(String):String(t);if("content-type"===e.toLowerCase()&&!charsetRegExp.test(s)){var r=mime.charsets.lookup(s.split(";")[0]);r&&(s+="; charset="+r.toLowerCase())}this.setHeader(e,s)}else for(var n in e)this.set(n,e[n]);return this},res.get=function(e){return this.getHeader(e)},res.clearCookie=function(e,t){var s=merge({expires:new Date(1),path:"/"},t);return this.cookie(e,"",s)},res.cookie=function(e,t,s){var r=merge({},s),n=this.req.secret,i=r.signed;if(i&&!n)throw new Error('cookieParser("secret") required for signed cookies');var o="object"==typeof t?"j:"+JSON.stringify(t):String(t);return i&&(o="s:"+sign(o,n)),"maxAge"in r&&(r.expires=new Date(Date.now()+r.maxAge),r.maxAge/=1e3),null==r.path&&(r.path="/"),this.append("Set-Cookie",cookie.serialize(e,String(o),r)),this},res.location=function(e){var t=e;return"back"===e&&(t=this.req.get("Referrer")||"/"),this.set("Location",t),this},res.redirect=function(e){var t,s=e,r=302;2===arguments.length&&("number"==typeof arguments[0]?(r=arguments[0],s=arguments[1]):(deprecate("res.redirect(url, status): Use res.redirect(status, url) instead"),r=arguments[1])),this.location(s),s=this.get("Location"),this.format({text:function(){t=statusCodes[r]+". Redirecting to "+encodeURI(s)},html:function(){var e=escapeHtml(s);t="<p>"+statusCodes[r]+'. Redirecting to <a href="'+e+'">'+e+"</a></p>"},"default":function(){t=""}}),this.statusCode=r,this.set("Content-Length",Buffer.byteLength(t)),"HEAD"===this.req.method?this.end():this.end(t)},res.vary=function(e){return!e||Array.isArray(e)&&!e.length?(deprecate("res.vary(): Provide a field name"),this):(vary(this,e),this)},res.render=function(e,t,s){var r=this.req.app,n=s,i=t||{},o=this.req,a=this;"function"==typeof t&&(n=t,i={}),i._locals=a.locals,n=n||function(e,t){return e?o.next(e):void a.send(t)},r.render(e,i,n)};

}).call(this,require("buffer").Buffer)
},{"./utils":122,"buffer":60,"content-disposition":65,"cookie":68,"cookie-signature":67,"depd":78,"escape-html":108,"http":242,"on-finished":180,"path":197,"send":229,"utils-merge":255,"vary":256}],119:[function(require,module,exports){
"use strict";function appendMethods(r,e){for(var t=0;t<e.length;t++){var n=e[t];-1===r.indexOf(n)&&r.push(n)}}function getPathname(r){try{return parseUrl(r).pathname}catch(e){return}}function gettype(r){var e=typeof r;return"object"!==e?e:toString.call(r).replace(objectRegExp,"$1")}function matchLayer(r,e){try{return r.match(e)}catch(t){return t}}function mergeParams(r,e){if("object"!=typeof e||!e)return r;var t=mixin({},e);if(!(0 in r&&0 in e))return mixin(t,r);for(var n=0,a=0;n in r;)n++;for(;a in e;)a++;for(n--;n>=0;n--)r[n+a]=r[n],a>n&&delete r[n];return mixin(t,r)}function restore(r,e){for(var t=new Array(arguments.length-2),n=new Array(arguments.length-2),a=0;a<t.length;a++)t[a]=arguments[a+2],n[a]=e[t[a]];return function(a){for(var o=0;o<t.length;o++)e[t[o]]=n[o];return r.apply(this,arguments)}}function sendOptionsResponse(r,e,t){try{var n=e.join(",");r.set("Allow",n),r.send(n)}catch(a){t(a)}}function wrap(r,e){return function(){var t=new Array(arguments.length+1);t[0]=r;for(var n=0,a=arguments.length;a>n;n++)t[n+1]=arguments[n];e.apply(this,t)}}var Route=require("./route"),Layer=require("./layer"),methods=require("methods"),mixin=require("utils-merge"),debug=require("debug")("express:router"),deprecate=require("depd")("express"),flatten=require("array-flatten"),parseUrl=require("parseurl"),objectRegExp=/^\[object (\S+)\]$/,slice=Array.prototype.slice,toString=Object.prototype.toString,proto=module.exports=function(r){function e(r,t,n){e.handle(r,t,n)}var t=r||{};return e.__proto__=proto,e.params={},e._params=[],e.caseSensitive=t.caseSensitive,e.mergeParams=t.mergeParams,e.strict=t.strict,e.stack=[],e};proto.param=function(r,e){if("function"==typeof r)return deprecate("router.param(fn): Refactor to use path params"),void this._params.push(r);var t,n=this._params,a=n.length;":"===r[0]&&(deprecate("router.param("+JSON.stringify(r)+", fn): Use router.param("+JSON.stringify(r.substr(1))+", fn) instead"),r=r.substr(1));for(var o=0;a>o;++o)(t=n[o](r,e))&&(e=t);if("function"!=typeof e)throw new Error("invalid param() call for "+r+", got "+e);return(this.params[r]=this.params[r]||[]).push(e),this},proto.handle=function(r,e,t){function n(t){var s="route"===t?null:t;if(f&&(r.url=r.url.substr(1),f=!1),0!==c.length&&(r.baseUrl=v,r.url=l+c+r.url.substr(l.length),c=""),p>=d.length)return void setImmediate(y,s);var i=getPathname(r);if(null==i)return y(s);for(var u,b,w;b!==!0&&p<d.length;)if(u=d[p++],b=matchLayer(u,i),w=u.route,"boolean"!=typeof b&&(s=s||b),b===!0&&w)if(s)b=!1;else{var x=r.method,_=w._handles_method(x);_||"OPTIONS"!==x||appendMethods(m,w._options()),_||"HEAD"===x||(b=!1)}if(b!==!0)return y(s);w&&(r.route=w),r.params=o.mergeParams?mergeParams(u.params,g):u.params;var O=u.path;o.process_params(u,h,r,e,function(t){return t?n(s||t):w?u.handle_request(r,e,n):void a(u,s,O,i)})}function a(t,a,o,s){var i=s[o.length];return i&&"/"!==i&&"."!==i?n(a):(0!==o.length&&(debug("trim prefix (%s) from url %s",o,r.url),c=o,r.url=l+r.url.substr(l.length+c.length),u||"/"===r.url[0]||(r.url="/"+r.url,f=!0),r.baseUrl=v+("/"===c[c.length-1]?c.substring(0,c.length-1):c)),debug("%s %s : %s",t.name,o,r.originalUrl),void(a?t.handle_error(a,r,e,n):t.handle_request(r,e,n)))}var o=this;debug("dispatching %s %s",r.method,r.url);var s=1+r.url.indexOf("?"),i=s?s-1:r.url.length,u="/"!==r.url[0]&&1+r.url.substr(0,i).indexOf("://"),l=u?r.url.substr(0,r.url.indexOf("/",2+u)):"",p=0,c="",f=!1,h={},m=[],d=o.stack,g=r.params,v=r.baseUrl||"",y=restore(t,r,"baseUrl","next","params");r.next=n,"OPTIONS"===r.method&&(y=wrap(y,function(r,t){return t||0===m.length?r(t):void sendOptionsResponse(e,m,r)})),r.baseUrl=v,r.originalUrl=r.originalUrl||r.url,n()},proto.process_params=function(r,e,t,n,a){function o(r){return r?a(r):m>=u.length?a():(d=0,(p=u[m++])?(l=p.name,c=t.params[l],f=i[l],h=e[l],void 0!==c&&f?h&&(h.match===c||h.error&&"route"!==h.error)?(t.params[l]=h.value,o(h.error)):(e[l]=h={error:null,match:c,value:c},void s()):o()):a())}function s(r){var e=f[d++];if(h.value=t.params[p.name],r)return h.error=r,void o(r);if(!e)return o();try{e(t,n,s,c,p.name)}catch(a){s(a)}}var i=this.params,u=r.keys;if(!u||0===u.length)return a();var l,p,c,f,h,m=0,d=0;o()},proto.use=function(r){var e=0,t="/";if("function"!=typeof r){for(var n=r;Array.isArray(n)&&0!==n.length;)n=n[0];"function"!=typeof n&&(e=1,t=r)}var a=flatten(slice.call(arguments,e));if(0===a.length)throw new TypeError("Router.use() requires middleware functions");for(var o=0;o<a.length;o++){var r=a[o];if("function"!=typeof r)throw new TypeError("Router.use() requires middleware function but got a "+gettype(r));debug("use %s %s",t,r.name||"<anonymous>");var s=new Layer(t,{sensitive:this.caseSensitive,strict:!1,end:!1},r);s.route=void 0,this.stack.push(s)}return this},proto.route=function r(e){var r=new Route(e),t=new Layer(e,{sensitive:this.caseSensitive,strict:this.strict,end:!0},r.dispatch.bind(r));return t.route=r,this.stack.push(t),r},methods.concat("all").forEach(function(r){proto[r]=function(e){var t=this.route(e);return t[r].apply(t,slice.call(arguments,1)),this}});

},{"./layer":120,"./route":121,"array-flatten":2,"debug":76,"depd":78,"methods":166,"parseurl":196,"utils-merge":255}],120:[function(require,module,exports){
"use strict";function Layer(e,t,r){if(!(this instanceof Layer))return new Layer(e,t,r);debug("new %s",e);var a=t||{};this.handle=r,this.name=r.name||"<anonymous>",this.params=void 0,this.path=void 0,this.regexp=pathRegexp(e,this.keys=[],a),"/"===e&&a.end===!1&&(this.regexp.fast_slash=!0)}function decode_param(e){if("string"!=typeof e||0===e.length)return e;try{return decodeURIComponent(e)}catch(t){throw t instanceof URIError&&(t.message="Failed to decode param '"+e+"'",t.status=t.statusCode=400),t}}var pathRegexp=require("path-to-regexp"),debug=require("debug")("express:router:layer"),hasOwnProperty=Object.prototype.hasOwnProperty;module.exports=Layer,Layer.prototype.handle_error=function(e,t,r,a){var s=this.handle;if(4!==s.length)return a(e);try{s(e,t,r,a)}catch(h){a(h)}},Layer.prototype.handle_request=function(e,t,r){var a=this.handle;if(a.length>3)return r();try{a(e,t,r)}catch(s){r(s)}},Layer.prototype.match=function(e){if(null==e)return this.params=void 0,this.path=void 0,!1;if(this.regexp.fast_slash)return this.params={},this.path="",!0;var t=this.regexp.exec(e);if(!t)return this.params=void 0,this.path=void 0,!1;this.params={},this.path=t[0];for(var r=this.keys,a=this.params,s=1;s<t.length;s++){var h=r[s-1],i=h.name,n=decode_param(t[s]);void 0===n&&hasOwnProperty.call(a,i)||(a[i]=n)}return!0};

},{"debug":76,"path-to-regexp":198}],121:[function(require,module,exports){
"use strict";function Route(t){this.path=t,this.stack=[],debug("new %s",t),this.methods={}}var debug=require("debug")("express:router:route"),flatten=require("array-flatten"),Layer=require("./layer"),methods=require("methods"),slice=Array.prototype.slice,toString=Object.prototype.toString;module.exports=Route,Route.prototype._handles_method=function(t){if(this.methods._all)return!0;var e=t.toLowerCase();return"head"!==e||this.methods.head||(e="get"),Boolean(this.methods[e])},Route.prototype._options=function(){var t=Object.keys(this.methods);this.methods.get&&!this.methods.head&&t.push("head");for(var e=0;e<t.length;e++)t[e]=t[e].toUpperCase();return t},Route.prototype.dispatch=function(t,e,r){function o(i){if(i&&"route"===i)return r();var n=a[s++];return n?n.method&&n.method!==h?o(i):void(i?n.handle_error(i,t,e,o):n.handle_request(t,e,o)):r(i)}var s=0,a=this.stack;if(0===a.length)return r();var h=t.method.toLowerCase();"head"!==h||this.methods.head||(h="get"),t.route=this,o()},Route.prototype.all=function(){for(var t=flatten(slice.call(arguments)),e=0;e<t.length;e++){var r=t[e];if("function"!=typeof r){var o=toString.call(r),s="Route.all() requires callback functions but got a "+o;throw new TypeError(s)}var a=Layer("/",{},r);a.method=void 0,this.methods._all=!0,this.stack.push(a)}return this},methods.forEach(function(t){Route.prototype[t]=function(){for(var e=flatten(slice.call(arguments)),r=0;r<e.length;r++){var o=e[r];if("function"!=typeof o){var s=toString.call(o),a="Route."+t+"() requires callback functions but got a "+s;throw new Error(a)}debug("%s %s",t,this.path);var h=Layer("/",{},o);h.method=t,this.methods[t]=!0,this.stack.push(h)}return this}});

},{"./layer":120,"array-flatten":2,"debug":76,"methods":166}],122:[function(require,module,exports){
(function (Buffer){
"use strict";function acceptParams(e,r){for(var t=e.split(/ *; */),n={value:t[0],quality:1,params:{},originalIndex:r},a=1;a<t.length;++a){var o=t[a].split(/ *= */);"q"==o[0]?n.quality=parseFloat(o[1]):n.params[o[0]]=o[1]}return n}function parseExtendedQueryString(e){return qs.parse(e,{allowDots:!1,allowPrototypes:!0})}function newObject(){return{}}var contentDisposition=require("content-disposition"),contentType=require("content-type"),deprecate=require("depd")("express"),flatten=require("array-flatten"),mime=require("send").mime,basename=require("path").basename,etag=require("etag"),proxyaddr=require("proxy-addr"),qs=require("qs"),querystring=require("querystring");exports.etag=function(e,r){var t=Buffer.isBuffer(e)?e:new Buffer(e,r);return etag(t,{weak:!1})},exports.wetag=function(e,r){var t=Buffer.isBuffer(e)?e:new Buffer(e,r);return etag(t,{weak:!0})},exports.isAbsolute=function(e){return"/"==e[0]?!0:":"==e[1]&&"\\"==e[2]?!0:"\\\\"==e.substring(0,2)?!0:void 0},exports.flatten=deprecate["function"](flatten,"utils.flatten: use array-flatten npm module instead"),exports.normalizeType=function(e){return~e.indexOf("/")?acceptParams(e):{value:mime.lookup(e),params:{}}},exports.normalizeTypes=function(e){for(var r=[],t=0;t<e.length;++t)r.push(exports.normalizeType(e[t]));return r},exports.contentDisposition=deprecate["function"](contentDisposition,"utils.contentDisposition: use content-disposition npm module instead"),exports.compileETag=function(e){var r;if("function"==typeof e)return e;switch(e){case!0:r=exports.wetag;break;case!1:break;case"strong":r=exports.etag;break;case"weak":r=exports.wetag;break;default:throw new TypeError("unknown value for etag function: "+e)}return r},exports.compileQueryParser=function(e){var r;if("function"==typeof e)return e;switch(e){case!0:r=querystring.parse;break;case!1:r=newObject;break;case"extended":r=parseExtendedQueryString;break;case"simple":r=querystring.parse;break;default:throw new TypeError("unknown value for query parser function: "+e)}return r},exports.compileTrust=function(e){return"function"==typeof e?e:e===!0?function(){return!0}:"number"==typeof e?function(r,t){return e>t}:("string"==typeof e&&(e=e.split(/ *, */)),proxyaddr.compile(e||[]))},exports.setCharset=function(e,r){if(!e||!r)return e;var t=contentType.parse(e);return t.parameters.charset=r,contentType.format(t)};

}).call(this,require("buffer").Buffer)
},{"array-flatten":2,"buffer":60,"content-disposition":65,"content-type":66,"depd":78,"etag":109,"path":197,"proxy-addr":202,"qs":124,"querystring":212,"send":229}],123:[function(require,module,exports){
"use strict";function View(e,t){var i=t||{};if(this.defaultEngine=i.defaultEngine,this.ext=extname(e),this.name=e,this.root=i.root,!this.ext&&!this.defaultEngine)throw new Error("No default engine was specified and no extension was provided.");var n=e;this.ext||(this.ext="."!==this.defaultEngine[0]?"."+this.defaultEngine:this.defaultEngine,n+=this.ext),i.engines[this.ext]||(i.engines[this.ext]=require(this.ext.substr(1)).__express),this.engine=i.engines[this.ext],this.path=this.lookup(n)}function tryStat(e){debug('stat "%s"',e);try{return fs.statSync(e)}catch(t){return}}var debug=require("debug")("express:view"),path=require("path"),fs=require("fs"),utils=require("./utils"),dirname=path.dirname,basename=path.basename,extname=path.extname,join=path.join,resolve=path.resolve;module.exports=View,View.prototype.lookup=function(e){var t,i=[].concat(this.root);debug('lookup "%s"',e);for(var n=0;n<i.length&&!t;n++){var s=i[n],r=resolve(s,e),a=dirname(r),o=basename(r);t=this.resolve(a,o)}return t},View.prototype.render=function(e,t){debug('render "%s"',this.path),this.engine(this.path,e,t)},View.prototype.resolve=function(e,t){var i=this.ext,n=join(e,t),s=tryStat(n);return s&&s.isFile()?n:(n=join(e,basename(t,i),"index"+i),s=tryStat(n),s&&s.isFile()?n:void 0)};

},{"./utils":122,"debug":76,"fs":58,"path":197}],124:[function(require,module,exports){
var Stringify=require("./stringify"),Parse=require("./parse"),internals={};module.exports={stringify:Stringify,parse:Parse};

},{"./parse":125,"./stringify":126}],125:[function(require,module,exports){
var Utils=require("./utils"),internals={delimiter:"&",depth:5,arrayLimit:20,parameterLimit:1e3,strictNullHandling:!1,plainObjects:!1,allowPrototypes:!1};internals.parseValues=function(e,t){for(var r={},i=e.split(t.delimiter,t.parameterLimit===1/0?void 0:t.parameterLimit),l=0,a=i.length;a>l;++l){var n=i[l],s=-1===n.indexOf("]=")?n.indexOf("="):n.indexOf("]=")+1;if(-1===s)r[Utils.decode(n)]="",t.strictNullHandling&&(r[Utils.decode(n)]=null);else{var p=Utils.decode(n.slice(0,s)),o=Utils.decode(n.slice(s+1));Object.prototype.hasOwnProperty.call(r,p)?r[p]=[].concat(r[p]).concat(o):r[p]=o}}return r},internals.parseObject=function(e,t,r){if(!e.length)return t;var i,l=e.shift();if("[]"===l)i=[],i=i.concat(internals.parseObject(e,t,r));else{i=r.plainObjects?Object.create(null):{};var a="["===l[0]&&"]"===l[l.length-1]?l.slice(1,l.length-1):l,n=parseInt(a,10),s=""+n;!isNaN(n)&&l!==a&&s===a&&n>=0&&r.parseArrays&&n<=r.arrayLimit?(i=[],i[n]=internals.parseObject(e,t,r)):i[a]=internals.parseObject(e,t,r)}return i},internals.parseKeys=function(e,t,r){if(e){r.allowDots&&(e=e.replace(/\.([^\.\[]+)/g,"[$1]"));var i=/^([^\[\]]*)/,l=/(\[[^\[\]]*\])/g,a=i.exec(e),n=[];if(a[1]){if(!r.plainObjects&&Object.prototype.hasOwnProperty(a[1])&&!r.allowPrototypes)return;n.push(a[1])}for(var s=0;null!==(a=l.exec(e))&&s<r.depth;)++s,(r.plainObjects||!Object.prototype.hasOwnProperty(a[1].replace(/\[|\]/g,""))||r.allowPrototypes)&&n.push(a[1]);return a&&n.push("["+e.slice(a.index)+"]"),internals.parseObject(n,t,r)}},module.exports=function(e,t){if(t=t||{},t.delimiter="string"==typeof t.delimiter||Utils.isRegExp(t.delimiter)?t.delimiter:internals.delimiter,t.depth="number"==typeof t.depth?t.depth:internals.depth,t.arrayLimit="number"==typeof t.arrayLimit?t.arrayLimit:internals.arrayLimit,t.parseArrays=t.parseArrays!==!1,t.allowDots=t.allowDots!==!1,t.plainObjects="boolean"==typeof t.plainObjects?t.plainObjects:internals.plainObjects,t.allowPrototypes="boolean"==typeof t.allowPrototypes?t.allowPrototypes:internals.allowPrototypes,t.parameterLimit="number"==typeof t.parameterLimit?t.parameterLimit:internals.parameterLimit,t.strictNullHandling="boolean"==typeof t.strictNullHandling?t.strictNullHandling:internals.strictNullHandling,""===e||null===e||"undefined"==typeof e)return t.plainObjects?Object.create(null):{};for(var r="string"==typeof e?internals.parseValues(e,t):e,i=t.plainObjects?Object.create(null):{},l=Object.keys(r),a=0,n=l.length;n>a;++a){var s=l[a],p=internals.parseKeys(s,r[s],t);i=Utils.merge(i,p,t)}return Utils.compact(i)};

},{"./utils":127}],126:[function(require,module,exports){
var Utils=require("./utils"),internals={delimiter:"&",arrayPrefixGenerators:{brackets:function(r,e){return r+"[]"},indices:function(r,e){return r+"["+e+"]"},repeat:function(r,e){return r}},strictNullHandling:!1};internals.stringify=function(r,e,n,i,t){if("function"==typeof t)r=t(e,r);else if(Utils.isBuffer(r))r=r.toString();else if(r instanceof Date)r=r.toISOString();else if(null===r){if(i)return Utils.encode(e);r=""}if("string"==typeof r||"number"==typeof r||"boolean"==typeof r)return[Utils.encode(e)+"="+Utils.encode(r)];var a=[];if("undefined"==typeof r)return a;for(var l=Array.isArray(t)?t:Object.keys(r),s=0,f=l.length;f>s;++s){var o=l[s];a=Array.isArray(r)?a.concat(internals.stringify(r[o],n(e,o),n,i,t)):a.concat(internals.stringify(r[o],e+"["+o+"]",n,i,t))}return a},module.exports=function(r,e){e=e||{};var n,i,t="undefined"==typeof e.delimiter?internals.delimiter:e.delimiter,a="boolean"==typeof e.strictNullHandling?e.strictNullHandling:internals.strictNullHandling;"function"==typeof e.filter?(i=e.filter,r=i("",r)):Array.isArray(e.filter)&&(n=i=e.filter);var l=[];if("object"!=typeof r||null===r)return"";var s;s=e.arrayFormat in internals.arrayPrefixGenerators?e.arrayFormat:"indices"in e?e.indices?"indices":"repeat":"indices";var f=internals.arrayPrefixGenerators[s];n||(n=Object.keys(r));for(var o=0,c=n.length;c>o;++o){var u=n[o];l=l.concat(internals.stringify(r[u],u,f,a,i))}return l.join(t)};

},{"./utils":127}],127:[function(require,module,exports){
var internals={};internals.hexTable=new Array(256);for(var h=0;256>h;++h)internals.hexTable[h]="%"+((16>h?"0":"")+h.toString(16)).toUpperCase();exports.arrayToObject=function(e,r){for(var t=r.plainObjects?Object.create(null):{},n=0,a=e.length;a>n;++n)"undefined"!=typeof e[n]&&(t[n]=e[n]);return t},exports.merge=function(e,r,t){if(!r)return e;if("object"!=typeof r)return Array.isArray(e)?e.push(r):"object"==typeof e?e[r]=!0:e=[e,r],e;if("object"!=typeof e)return e=[e].concat(r);Array.isArray(e)&&!Array.isArray(r)&&(e=exports.arrayToObject(e,t));for(var n=Object.keys(r),a=0,o=n.length;o>a;++a){var c=n[a],i=r[c];Object.prototype.hasOwnProperty.call(e,c)?e[c]=exports.merge(e[c],i,t):e[c]=i}return e},exports.decode=function(e){try{return decodeURIComponent(e.replace(/\+/g," "))}catch(r){return e}},exports.encode=function(e){if(0===e.length)return e;"string"!=typeof e&&(e=""+e);for(var r="",t=0,n=e.length;n>t;++t){var a=e.charCodeAt(t);45===a||46===a||95===a||126===a||a>=48&&57>=a||a>=65&&90>=a||a>=97&&122>=a?r+=e[t]:128>a?r+=internals.hexTable[a]:2048>a?r+=internals.hexTable[192|a>>6]+internals.hexTable[128|63&a]:55296>a||a>=57344?r+=internals.hexTable[224|a>>12]+internals.hexTable[128|a>>6&63]+internals.hexTable[128|63&a]:(++t,a=65536+((1023&a)<<10|1023&e.charCodeAt(t)),r+=internals.hexTable[240|a>>18]+internals.hexTable[128|a>>12&63]+internals.hexTable[128|a>>6&63]+internals.hexTable[128|63&a])}return r},exports.compact=function(e,r){if("object"!=typeof e||null===e)return e;r=r||[];var t=r.indexOf(e);if(-1!==t)return r[t];if(r.push(e),Array.isArray(e)){for(var n=[],a=0,o=e.length;o>a;++a)"undefined"!=typeof e[a]&&n.push(e[a]);return n}var c=Object.keys(e);for(a=0,o=c.length;o>a;++a){var i=c[a];e[i]=exports.compact(e[i],r)}return e},exports.isRegExp=function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},exports.isBuffer=function(e){return null===e||"undefined"==typeof e?!1:!!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e))};

},{}],128:[function(require,module,exports){
(function (process,Buffer){
"use strict";function finalhandler(e,t,n){var r=n||{},i=r.env||process.env.NODE_ENV||"development",s=r.onerror;return function(n){var r=t.statusCode;if(!n&&t._header)return void debug("cannot 404 after headers sent");if(n){n.statusCode&&(r=n.statusCode),n.status&&(r=n.status),(!r||400>r)&&(r=500);var d="production"===i?http.STATUS_CODES[r]:n.stack||n.toString();d=escapeHtml(d).replace(/\n/g,"<br>").replace(/  /g," &nbsp;")+"\n"}else r=404,d="Cannot "+escapeHtml(e.method)+" "+escapeHtml(e.originalUrl||e.url)+"\n";return debug("default %s",r),n&&s&&defer(s,n,e,t),t._header?e.socket.destroy():void send(e,t,r,d)}}function send(e,t,n,r){function i(){return t.statusCode=n,t.setHeader("X-Content-Type-Options","nosniff"),t.setHeader("Content-Type","text/html; charset=utf-8"),t.setHeader("Content-Length",Buffer.byteLength(r,"utf8")),"HEAD"===e.method?void t.end():void t.end(r,"utf8")}return isFinished(e)?void i():(unpipe(e),onFinished(e,i),void e.resume())}var debug=require("debug")("finalhandler"),escapeHtml=require("escape-html"),http=require("http"),onFinished=require("on-finished"),unpipe=require("unpipe"),defer="function"==typeof setImmediate?setImmediate:function(e){process.nextTick(e.bind.apply(e,arguments))},isFinished=onFinished.isFinished;module.exports=finalhandler;

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":201,"buffer":60,"debug":76,"escape-html":108,"http":242,"on-finished":180,"unpipe":249}],129:[function(require,module,exports){
function forwarded(r){if(!r)throw new TypeError("argument req is required");var e=(r.headers["x-forwarded-for"]||"").split(/ *, */).filter(Boolean).reverse(),o=r.connection.remoteAddress,d=[o].concat(e);return d}module.exports=forwarded;

},{}],130:[function(require,module,exports){
function fresh(e,n){var t=!0,i=!0,o=e["if-modified-since"],c=e["if-none-match"],f=n["last-modified"],r=n.etag,a=e["cache-control"];return o||c?a&&-1!==a.indexOf("no-cache")?!1:(c&&(c=c.split(/ *, */)),c&&(t=c.some(function(e){return"*"===e||e===r||e==="W/"+r})),o&&(o=new Date(o),f=new Date(f),i=o>=f),!(!t||!i)):!1}module.exports=fresh;

},{}],131:[function(require,module,exports){
var hash=exports;hash.utils=require("./hash/utils"),hash.common=require("./hash/common"),hash.sha=require("./hash/sha"),hash.ripemd=require("./hash/ripemd"),hash.hmac=require("./hash/hmac"),hash.sha1=hash.sha.sha1,hash.sha256=hash.sha.sha256,hash.sha224=hash.sha.sha224,hash.sha384=hash.sha.sha384,hash.sha512=hash.sha.sha512,hash.ripemd160=hash.ripemd.ripemd160;

},{"./hash/common":132,"./hash/hmac":133,"./hash/ripemd":134,"./hash/sha":135,"./hash/utils":136}],132:[function(require,module,exports){
function BlockHash(){this.pending=null,this.pendingTotal=0,this.blockSize=this.constructor.blockSize,this.outSize=this.constructor.outSize,this.hmacStrength=this.constructor.hmacStrength,this.padLength=this.constructor.padLength/8,this.endian="big",this._delta8=this.blockSize/8,this._delta32=this.blockSize/32}var hash=require("../hash"),utils=hash.utils,assert=utils.assert;exports.BlockHash=BlockHash,BlockHash.prototype.update=function(t,i){if(t=utils.toArray(t,i),this.pending?this.pending=this.pending.concat(t):this.pending=t,this.pendingTotal+=t.length,this.pending.length>=this._delta8){t=this.pending;var h=t.length%this._delta8;this.pending=t.slice(t.length-h,t.length),0===this.pending.length&&(this.pending=null),t=utils.join32(t,0,t.length-h,this.endian);for(var s=0;s<t.length;s+=this._delta32)this._update(t,s,s+this._delta32)}return this},BlockHash.prototype.digest=function(t){return this.update(this._pad()),assert(null===this.pending),this._digest(t)},BlockHash.prototype._pad=function(){var t=this.pendingTotal,i=this._delta8,h=i-(t+this.padLength)%i,s=new Array(h+this.padLength);s[0]=128;for(var n=1;h>n;n++)s[n]=0;if(t<<=3,"big"===this.endian){for(var e=8;e<this.padLength;e++)s[n++]=0;s[n++]=0,s[n++]=0,s[n++]=0,s[n++]=0,s[n++]=t>>>24&255,s[n++]=t>>>16&255,s[n++]=t>>>8&255,s[n++]=255&t}else{s[n++]=255&t,s[n++]=t>>>8&255,s[n++]=t>>>16&255,s[n++]=t>>>24&255,s[n++]=0,s[n++]=0,s[n++]=0,s[n++]=0;for(var e=8;e<this.padLength;e++)s[n++]=0}return s};

},{"../hash":131}],133:[function(require,module,exports){
function Hmac(t,i,e){return this instanceof Hmac?(this.Hash=t,this.blockSize=t.blockSize/8,this.outSize=t.outSize/8,this.inner=null,this.outer=null,void this._init(utils.toArray(i,e))):new Hmac(t,i,e)}var hmac=exports,hash=require("../hash"),utils=hash.utils,assert=utils.assert;module.exports=Hmac,Hmac.prototype._init=function(t){t.length>this.blockSize&&(t=(new this.Hash).update(t).digest()),assert(t.length<=this.blockSize);for(var i=t.length;i<this.blockSize;i++)t.push(0);for(var i=0;i<t.length;i++)t[i]^=54;this.inner=(new this.Hash).update(t);for(var i=0;i<t.length;i++)t[i]^=106;this.outer=(new this.Hash).update(t)},Hmac.prototype.update=function(t,i){return this.inner.update(t,i),this},Hmac.prototype.digest=function(t){return this.outer.update(this.inner.digest()),this.outer.digest(t)};

},{"../hash":131}],134:[function(require,module,exports){
function RIPEMD160(){return this instanceof RIPEMD160?(BlockHash.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],void(this.endian="little")):new RIPEMD160}function f(t,h,s,i){return 15>=t?h^s^i:31>=t?h&s|~h&i:47>=t?(h|~s)^i:63>=t?h&i|s&~i:h^(s|~i)}function K(t){return 15>=t?0:31>=t?1518500249:47>=t?1859775393:63>=t?2400959708:2840853838}function Kh(t){return 15>=t?1352829926:31>=t?1548603684:47>=t?1836072691:63>=t?2053994217:0}var hash=require("../hash"),utils=hash.utils,rotl32=utils.rotl32,sum32=utils.sum32,sum32_3=utils.sum32_3,sum32_4=utils.sum32_4,BlockHash=hash.common.BlockHash;utils.inherits(RIPEMD160,BlockHash),exports.ripemd160=RIPEMD160,RIPEMD160.blockSize=512,RIPEMD160.outSize=160,RIPEMD160.hmacStrength=192,RIPEMD160.padLength=64,RIPEMD160.prototype._update=function(t,h){for(var i=this.h[0],u=this.h[1],l=this.h[2],o=this.h[3],e=this.h[4],n=i,m=u,a=l,c=o,_=e,D=0;80>D;D++){var E=sum32(rotl32(sum32_4(i,f(D,u,l,o),t[r[D]+h],K(D)),s[D]),e);i=e,e=o,o=rotl32(l,10),l=u,u=E,E=sum32(rotl32(sum32_4(n,f(79-D,m,a,c),t[rh[D]+h],Kh(D)),sh[D]),_),n=_,_=c,c=rotl32(a,10),a=m,m=E}E=sum32_3(this.h[1],l,c),this.h[1]=sum32_3(this.h[2],o,_),this.h[2]=sum32_3(this.h[3],e,n),this.h[3]=sum32_3(this.h[4],i,m),this.h[4]=sum32_3(this.h[0],u,a),this.h[0]=E},RIPEMD160.prototype._digest=function(t){return"hex"===t?utils.toHex32(this.h,"little"):utils.split32(this.h,"little")};var r=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],rh=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],s=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],sh=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];

},{"../hash":131}],135:[function(require,module,exports){
function SHA256(){return this instanceof SHA256?(BlockHash.call(this),this.h=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],this.k=sha256_K,void(this.W=new Array(64))):new SHA256}function SHA224(){return this instanceof SHA224?(SHA256.call(this),void(this.h=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])):new SHA224}function SHA512(){return this instanceof SHA512?(BlockHash.call(this),this.h=[1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209],this.k=sha512_K,void(this.W=new Array(160))):new SHA512}function SHA384(){return this instanceof SHA384?(SHA512.call(this),void(this.h=[3418070365,3238371032,1654270250,914150663,2438529370,812702999,355462360,4144912697,1731405415,4290775857,2394180231,1750603025,3675008525,1694076839,1203062813,3204075428])):new SHA384}function SHA1(){return this instanceof SHA1?(BlockHash.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],void(this.W=new Array(80))):new SHA1}function ch32(t,h,s){return t&h^~t&s}function maj32(t,h,s){return t&h^t&s^h&s}function p32(t,h,s){return t^h^s}function s0_256(t){return rotr32(t,2)^rotr32(t,13)^rotr32(t,22)}function s1_256(t){return rotr32(t,6)^rotr32(t,11)^rotr32(t,25)}function g0_256(t){return rotr32(t,7)^rotr32(t,18)^t>>>3}function g1_256(t){return rotr32(t,17)^rotr32(t,19)^t>>>10}function ft_1(t,h,s,i){return 0===t?ch32(h,s,i):1===t||3===t?p32(h,s,i):2===t?maj32(h,s,i):void 0}function ch64_hi(t,h,s,i,r,o){var u=t&s^~t&r;return 0>u&&(u+=4294967296),u}function ch64_lo(t,h,s,i,r,o){var u=h&i^~h&o;return 0>u&&(u+=4294967296),u}function maj64_hi(t,h,s,i,r,o){var u=t&s^t&r^s&r;return 0>u&&(u+=4294967296),u}function maj64_lo(t,h,s,i,r,o){var u=h&i^h&o^i&o;return 0>u&&(u+=4294967296),u}function s0_512_hi(t,h){var s=rotr64_hi(t,h,28),i=rotr64_hi(h,t,2),r=rotr64_hi(h,t,7),o=s^i^r;return 0>o&&(o+=4294967296),o}function s0_512_lo(t,h){var s=rotr64_lo(t,h,28),i=rotr64_lo(h,t,2),r=rotr64_lo(h,t,7),o=s^i^r;return 0>o&&(o+=4294967296),o}function s1_512_hi(t,h){var s=rotr64_hi(t,h,14),i=rotr64_hi(t,h,18),r=rotr64_hi(h,t,9),o=s^i^r;return 0>o&&(o+=4294967296),o}function s1_512_lo(t,h){var s=rotr64_lo(t,h,14),i=rotr64_lo(t,h,18),r=rotr64_lo(h,t,9),o=s^i^r;return 0>o&&(o+=4294967296),o}function g0_512_hi(t,h){var s=rotr64_hi(t,h,1),i=rotr64_hi(t,h,8),r=shr64_hi(t,h,7),o=s^i^r;return 0>o&&(o+=4294967296),o}function g0_512_lo(t,h){var s=rotr64_lo(t,h,1),i=rotr64_lo(t,h,8),r=shr64_lo(t,h,7),o=s^i^r;return 0>o&&(o+=4294967296),o}function g1_512_hi(t,h){var s=rotr64_hi(t,h,19),i=rotr64_hi(h,t,29),r=shr64_hi(t,h,6),o=s^i^r;return 0>o&&(o+=4294967296),o}function g1_512_lo(t,h){var s=rotr64_lo(t,h,19),i=rotr64_lo(h,t,29),r=shr64_lo(t,h,6),o=s^i^r;return 0>o&&(o+=4294967296),o}var hash=require("../hash"),utils=hash.utils,assert=utils.assert,rotr32=utils.rotr32,rotl32=utils.rotl32,sum32=utils.sum32,sum32_4=utils.sum32_4,sum32_5=utils.sum32_5,rotr64_hi=utils.rotr64_hi,rotr64_lo=utils.rotr64_lo,shr64_hi=utils.shr64_hi,shr64_lo=utils.shr64_lo,sum64=utils.sum64,sum64_hi=utils.sum64_hi,sum64_lo=utils.sum64_lo,sum64_4_hi=utils.sum64_4_hi,sum64_4_lo=utils.sum64_4_lo,sum64_5_hi=utils.sum64_5_hi,sum64_5_lo=utils.sum64_5_lo,BlockHash=hash.common.BlockHash,sha256_K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],sha512_K=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591],sha1_K=[1518500249,1859775393,2400959708,3395469782];utils.inherits(SHA256,BlockHash),exports.sha256=SHA256,SHA256.blockSize=512,SHA256.outSize=256,SHA256.hmacStrength=192,SHA256.padLength=64,SHA256.prototype._update=function(t,h){for(var s=this.W,i=0;16>i;i++)s[i]=t[h+i];for(;i<s.length;i++)s[i]=sum32_4(g1_256(s[i-2]),s[i-7],g0_256(s[i-15]),s[i-16]);var r=this.h[0],o=this.h[1],u=this.h[2],n=this.h[3],_=this.h[4],e=this.h[5],l=this.h[6],a=this.h[7];assert(this.k.length===s.length);for(var i=0;i<s.length;i++){var c=sum32_5(a,s1_256(_),ch32(_,e,l),this.k[i],s[i]),S=sum32(s0_256(r),maj32(r,o,u));a=l,l=e,e=_,_=sum32(n,c),n=u,u=o,o=r,r=sum32(c,S)}this.h[0]=sum32(this.h[0],r),this.h[1]=sum32(this.h[1],o),this.h[2]=sum32(this.h[2],u),this.h[3]=sum32(this.h[3],n),this.h[4]=sum32(this.h[4],_),this.h[5]=sum32(this.h[5],e),this.h[6]=sum32(this.h[6],l),this.h[7]=sum32(this.h[7],a)},SHA256.prototype._digest=function(t){return"hex"===t?utils.toHex32(this.h,"big"):utils.split32(this.h,"big")},utils.inherits(SHA224,SHA256),exports.sha224=SHA224,SHA224.blockSize=512,SHA224.outSize=224,SHA224.hmacStrength=192,SHA224.padLength=64,SHA224.prototype._digest=function(t){return"hex"===t?utils.toHex32(this.h.slice(0,7),"big"):utils.split32(this.h.slice(0,7),"big")},utils.inherits(SHA512,BlockHash),exports.sha512=SHA512,SHA512.blockSize=1024,SHA512.outSize=512,SHA512.hmacStrength=192,SHA512.padLength=128,SHA512.prototype._prepareBlock=function(t,h){for(var s=this.W,i=0;32>i;i++)s[i]=t[h+i];for(;i<s.length;i+=2){var r=g1_512_hi(s[i-4],s[i-3]),o=g1_512_lo(s[i-4],s[i-3]),u=s[i-14],n=s[i-13],_=g0_512_hi(s[i-30],s[i-29]),e=g0_512_lo(s[i-30],s[i-29]),l=s[i-32],a=s[i-31];s[i]=sum64_4_hi(r,o,u,n,_,e,l,a),s[i+1]=sum64_4_lo(r,o,u,n,_,e,l,a)}},SHA512.prototype._update=function(t,h){this._prepareBlock(t,h);var s=this.W,i=this.h[0],r=this.h[1],o=this.h[2],u=this.h[3],n=this.h[4],_=this.h[5],e=this.h[6],l=this.h[7],a=this.h[8],c=this.h[9],S=this.h[10],m=this.h[11],H=this.h[12],A=this.h[13],f=this.h[14],g=this.h[15];assert(this.k.length===s.length);for(var p=0;p<s.length;p+=2){var v=f,k=g,d=s1_512_hi(a,c),b=s1_512_lo(a,c),x=ch64_hi(a,c,S,m,H,A),y=ch64_lo(a,c,S,m,H,A),z=this.k[p],B=this.k[p+1],w=s[p],j=s[p+1],W=sum64_5_hi(v,k,d,b,x,y,z,B,w,j),K=sum64_5_lo(v,k,d,b,x,y,z,B,w,j),v=s0_512_hi(i,r),k=s0_512_lo(i,r),d=maj64_hi(i,r,o,u,n,_),b=maj64_lo(i,r,o,u,n,_),L=sum64_hi(v,k,d,b),q=sum64_lo(v,k,d,b);f=H,g=A,H=S,A=m,S=a,m=c,a=sum64_hi(e,l,W,K),c=sum64_lo(l,l,W,K),e=n,l=_,n=o,_=u,o=i,u=r,i=sum64_hi(W,K,L,q),r=sum64_lo(W,K,L,q)}sum64(this.h,0,i,r),sum64(this.h,2,o,u),sum64(this.h,4,n,_),sum64(this.h,6,e,l),sum64(this.h,8,a,c),sum64(this.h,10,S,m),sum64(this.h,12,H,A),sum64(this.h,14,f,g)},SHA512.prototype._digest=function(t){return"hex"===t?utils.toHex32(this.h,"big"):utils.split32(this.h,"big")},utils.inherits(SHA384,SHA512),exports.sha384=SHA384,SHA384.blockSize=1024,SHA384.outSize=384,SHA384.hmacStrength=192,SHA384.padLength=128,SHA384.prototype._digest=function(t){return"hex"===t?utils.toHex32(this.h.slice(0,12),"big"):utils.split32(this.h.slice(0,12),"big")},utils.inherits(SHA1,BlockHash),exports.sha1=SHA1,SHA1.blockSize=512,SHA1.outSize=160,SHA1.hmacStrength=80,SHA1.padLength=64,SHA1.prototype._update=function(t,h){for(var s=this.W,i=0;16>i;i++)s[i]=t[h+i];for(;i<s.length;i++)s[i]=rotl32(s[i-3]^s[i-8]^s[i-14]^s[i-16],1);for(var r=this.h[0],o=this.h[1],u=this.h[2],n=this.h[3],_=this.h[4],i=0;i<s.length;i++){var e=~~(i/20),l=sum32_5(rotl32(r,5),ft_1(e,o,u,n),_,s[i],sha1_K[e]);_=n,n=u,u=rotl32(o,30),o=r,r=l}this.h[0]=sum32(this.h[0],r),this.h[1]=sum32(this.h[1],o),this.h[2]=sum32(this.h[2],u),this.h[3]=sum32(this.h[3],n),this.h[4]=sum32(this.h[4],_)},SHA1.prototype._digest=function(t){return"hex"===t?utils.toHex32(this.h,"big"):utils.split32(this.h,"big")};

},{"../hash":131}],136:[function(require,module,exports){
function toArray(r,t){if(Array.isArray(r))return r.slice();if(!r)return[];var n=[];if("string"==typeof r)if(t){if("hex"===t){r=r.replace(/[^a-z0-9]+/gi,""),r.length%2!==0&&(r="0"+r);for(var u=0;u<r.length;u+=2)n.push(parseInt(r[u]+r[u+1],16))}}else for(var u=0;u<r.length;u++){var o=r.charCodeAt(u),e=o>>8,s=255&o;e?n.push(e,s):n.push(s)}else for(var u=0;u<r.length;u++)n[u]=0|r[u];return n}function toHex(r){for(var t="",n=0;n<r.length;n++)t+=zero2(r[n].toString(16));return t}function htonl(r){var t=r>>>24|r>>>8&65280|r<<8&16711680|(255&r)<<24;return t>>>0}function toHex32(r,t){for(var n="",u=0;u<r.length;u++){var o=r[u];"little"===t&&(o=htonl(o)),n+=zero8(o.toString(16))}return n}function zero2(r){return 1===r.length?"0"+r:r}function zero8(r){return 7===r.length?"0"+r:6===r.length?"00"+r:5===r.length?"000"+r:4===r.length?"0000"+r:3===r.length?"00000"+r:2===r.length?"000000"+r:1===r.length?"0000000"+r:r}function join32(r,t,n,u){var o=n-t;assert(o%4===0);for(var e=new Array(o/4),s=0,i=t;s<e.length;s++,i+=4){var l;l="big"===u?r[i]<<24|r[i+1]<<16|r[i+2]<<8|r[i+3]:r[i+3]<<24|r[i+2]<<16|r[i+1]<<8|r[i],e[s]=l>>>0}return e}function split32(r,t){for(var n=new Array(4*r.length),u=0,o=0;u<r.length;u++,o+=4){var e=r[u];"big"===t?(n[o]=e>>>24,n[o+1]=e>>>16&255,n[o+2]=e>>>8&255,n[o+3]=255&e):(n[o+3]=e>>>24,n[o+2]=e>>>16&255,n[o+1]=e>>>8&255,n[o]=255&e)}return n}function rotr32(r,t){return r>>>t|r<<32-t}function rotl32(r,t){return r<<t|r>>>32-t}function sum32(r,t){return r+t>>>0}function sum32_3(r,t,n){return r+t+n>>>0}function sum32_4(r,t,n,u){return r+t+n+u>>>0}function sum32_5(r,t,n,u,o){return r+t+n+u+o>>>0}function assert(r,t){if(!r)throw new Error(t||"Assertion failed")}function sum64(r,t,n,u){var o=r[t],e=r[t+1],s=u+e>>>0,i=(u>s?1:0)+n+o;r[t]=i>>>0,r[t+1]=s}function sum64_hi(r,t,n,u){var o=t+u>>>0,e=(t>o?1:0)+r+n;return e>>>0}function sum64_lo(r,t,n,u){var o=t+u;return o>>>0}function sum64_4_hi(r,t,n,u,o,e,s,i){var l=0,h=t;h=h+u>>>0,l+=t>h?1:0,h=h+e>>>0,l+=e>h?1:0,h=h+i>>>0,l+=i>h?1:0;var _=r+n+o+s+l;return _>>>0}function sum64_4_lo(r,t,n,u,o,e,s,i){var l=t+u+e+i;return l>>>0}function sum64_5_hi(r,t,n,u,o,e,s,i,l,h){var _=0,a=t;a=a+u>>>0,_+=t>a?1:0,a=a+e>>>0,_+=e>a?1:0,a=a+i>>>0,_+=i>a?1:0,a=a+h>>>0,_+=h>a?1:0;var f=r+n+o+s+l+_;return f>>>0}function sum64_5_lo(r,t,n,u,o,e,s,i,l,h){var _=t+u+e+i+h;return _>>>0}function rotr64_hi(r,t,n){var u=t<<32-n|r>>>n;return u>>>0}function rotr64_lo(r,t,n){var u=r<<32-n|t>>>n;return u>>>0}function shr64_hi(r,t,n){return r>>>n}function shr64_lo(r,t,n){var u=r<<32-n|t>>>n;return u>>>0}var utils=exports,inherits=require("inherits");utils.toArray=toArray,utils.toHex=toHex,utils.htonl=htonl,utils.toHex32=toHex32,utils.zero2=zero2,utils.zero8=zero8,utils.join32=join32,utils.split32=split32,utils.rotr32=rotr32,utils.rotl32=rotl32,utils.sum32=sum32,utils.sum32_3=sum32_3,utils.sum32_4=sum32_4,utils.sum32_5=sum32_5,utils.assert=assert,utils.inherits=inherits,exports.sum64=sum64,exports.sum64_hi=sum64_hi,exports.sum64_lo=sum64_lo,exports.sum64_4_hi=sum64_4_hi,exports.sum64_4_lo=sum64_4_lo,exports.sum64_5_hi=sum64_5_hi,exports.sum64_5_lo=sum64_5_lo,exports.rotr64_hi=rotr64_hi,exports.rotr64_lo=rotr64_lo,exports.shr64_hi=shr64_hi,exports.shr64_lo=shr64_lo;

},{"inherits":161}],137:[function(require,module,exports){
function toIdentifier(e){return e.split(" ").map(function(e){return e.slice(0,1).toUpperCase()+e.slice(1)}).join("").replace(/[^ _0-9a-z]/gi,"")}var statuses=require("statuses"),inherits=require("inherits");exports=module.exports=function e(){for(var r,t,o=500,s={},a=0;a<arguments.length;a++){var n=arguments[a];if(n instanceof Error)r=n,o=r.status||r.statusCode||o;else switch(typeof n){case"string":t=n;break;case"number":o=n;break;case"object":s=n}}"number"==typeof o&&statuses[o]||(o=500);var u=exports[o];r||(r=u?new u(t):new Error(t||statuses[o]),Error.captureStackTrace(r,e)),u&&r instanceof u||(r.expose=500>o,r.status=r.statusCode=o);for(var p in s)"status"!==p&&"statusCode"!==p&&(r[p]=s[p]);return r};var codes=statuses.codes.filter(function(e){return e>=400});codes.forEach(function(e){var r=toIdentifier(statuses[e]),t=r.match(/Error$/)?r:r+"Error";if(e>=500){var o=function a(r){var o=new Error(null!=r?r:statuses[e]);return Error.captureStackTrace(o,a),o.__proto__=a.prototype,Object.defineProperty(o,"name",{enumerable:!1,configurable:!0,value:t,writable:!0}),o};return inherits(o,Error),o.prototype.status=o.prototype.statusCode=e,o.prototype.expose=!1,void(exports[e]=exports[r]=o)}var s=function n(r){var o=new Error(null!=r?r:statuses[e]);return Error.captureStackTrace(o,n),o.__proto__=n.prototype,Object.defineProperty(o,"name",{enumerable:!1,configurable:!0,value:t,writable:!0}),o};inherits(s,Error),s.prototype.status=s.prototype.statusCode=e,s.prototype.expose=!0,exports[e]=exports[r]=s}),exports["I'mateapot"]=exports.ImATeapot;

},{"inherits":161,"statuses":240}],138:[function(require,module,exports){
(function (Buffer){
"use strict";function DBCSCodec(e,t){if(this.encodingName=e.encodingName,!e)throw new Error("DBCS codec is called without the data.");if(!e.table)throw new Error("Encoding '"+this.encodingName+"' has no data.");var o=e.table();this.decodeTables=[],this.decodeTables[0]=UNASSIGNED_NODE.slice(0),this.decodeTableSeq=[];for(var r=0;r<o.length;r++)this._addDecodeChunk(o[r]);this.defaultCharUnicode=t.defaultCharUnicode,this.encodeTable=[],this.encodeTableSeq=[];var i={};if(e.encodeSkipVals)for(var r=0;r<e.encodeSkipVals.length;r++){var d=e.encodeSkipVals[r];if("number"==typeof d)i[d]=!0;else for(var n=d.from;n<=d.to;n++)i[n]=!0}if(this._fillEncodeTable(0,0,i),e.encodeAdd)for(var a in e.encodeAdd)Object.prototype.hasOwnProperty.call(e.encodeAdd,a)&&this._setEncodeChar(a.charCodeAt(0),e.encodeAdd[a]);if(this.defCharSB=this.encodeTable[0][t.defaultCharSingleByte.charCodeAt(0)],this.defCharSB===UNASSIGNED&&(this.defCharSB=this.encodeTable[0]["?"]),this.defCharSB===UNASSIGNED&&(this.defCharSB="?".charCodeAt(0)),"function"==typeof e.gb18030){this.gb18030=e.gb18030();for(var h=this.decodeTables.length,s=this.decodeTables[h]=UNASSIGNED_NODE.slice(0),c=this.decodeTables.length,l=this.decodeTables[c]=UNASSIGNED_NODE.slice(0),r=129;254>=r;r++)for(var S=NODE_START-this.decodeTables[0][r],f=this.decodeTables[S],n=48;57>=n;n++)f[n]=NODE_START-h;for(var r=129;254>=r;r++)s[r]=NODE_START-c;for(var r=48;57>=r;r++)l[r]=GB18030_CODE}}function DBCSEncoder(e,t){this.leadSurrogate=-1,this.seqObj=void 0,this.encodeTable=t.encodeTable,this.encodeTableSeq=t.encodeTableSeq,this.defaultCharSingleByte=t.defCharSB,this.gb18030=t.gb18030}function DBCSDecoder(e,t){this.nodeIdx=0,this.prevBuf=new Buffer(0),this.decodeTables=t.decodeTables,this.decodeTableSeq=t.decodeTableSeq,this.defaultCharUnicode=t.defaultCharUnicode,this.gb18030=t.gb18030}function findIdx(e,t){if(e[0]>t)return-1;for(var o=0,r=e.length;r-1>o;){var i=o+Math.floor((r-o+1)/2);e[i]<=t?o=i:r=i}return o}exports._dbcs=DBCSCodec;for(var UNASSIGNED=-1,GB18030_CODE=-2,SEQ_START=-10,NODE_START=-1e3,UNASSIGNED_NODE=new Array(256),DEF_CHAR=-1,i=0;256>i;i++)UNASSIGNED_NODE[i]=UNASSIGNED;DBCSCodec.prototype.encoder=DBCSEncoder,DBCSCodec.prototype.decoder=DBCSDecoder,DBCSCodec.prototype._getDecodeTrieNode=function(e){for(var t=[];e>0;e>>=8)t.push(255&e);0==t.length&&t.push(0);for(var o=this.decodeTables[0],r=t.length-1;r>0;r--){var i=o[t[r]];if(i==UNASSIGNED)o[t[r]]=NODE_START-this.decodeTables.length,this.decodeTables.push(o=UNASSIGNED_NODE.slice(0));else{if(!(NODE_START>=i))throw new Error("Overwrite byte in "+this.encodingName+", addr: "+e.toString(16));o=this.decodeTables[NODE_START-i]}}return o},DBCSCodec.prototype._addDecodeChunk=function(e){var t=parseInt(e[0],16),o=this._getDecodeTrieNode(t);t=255&t;for(var r=1;r<e.length;r++){var i=e[r];if("string"==typeof i)for(var d=0;d<i.length;){var n=i.charCodeAt(d++);if(n>=55296&&56320>n){var a=i.charCodeAt(d++);if(!(a>=56320&&57344>a))throw new Error("Incorrect surrogate pair in "+this.encodingName+" at chunk "+e[0]);o[t++]=65536+1024*(n-55296)+(a-56320)}else if(n>4080&&4095>=n){for(var h=4095-n+2,s=[],c=0;h>c;c++)s.push(i.charCodeAt(d++));o[t++]=SEQ_START-this.decodeTableSeq.length,this.decodeTableSeq.push(s)}else o[t++]=n}else{if("number"!=typeof i)throw new Error("Incorrect type '"+typeof i+"' given in "+this.encodingName+" at chunk "+e[0]);for(var l=o[t-1]+1,d=0;i>d;d++)o[t++]=l++}}if(t>255)throw new Error("Incorrect chunk in "+this.encodingName+" at addr "+e[0]+": too long"+t)},DBCSCodec.prototype._getEncodeBucket=function(e){var t=e>>8;return void 0===this.encodeTable[t]&&(this.encodeTable[t]=UNASSIGNED_NODE.slice(0)),this.encodeTable[t]},DBCSCodec.prototype._setEncodeChar=function(e,t){var o=this._getEncodeBucket(e),r=255&e;o[r]<=SEQ_START?this.encodeTableSeq[SEQ_START-o[r]][DEF_CHAR]=t:o[r]==UNASSIGNED&&(o[r]=t)},DBCSCodec.prototype._setEncodeSequence=function(e,t){var o,r=e[0],i=this._getEncodeBucket(r),d=255&r;i[d]<=SEQ_START?o=this.encodeTableSeq[SEQ_START-i[d]]:(o={},i[d]!==UNASSIGNED&&(o[DEF_CHAR]=i[d]),i[d]=SEQ_START-this.encodeTableSeq.length,this.encodeTableSeq.push(o));for(var n=1;n<e.length-1;n++){var a=o[r];"object"==typeof a?o=a:(o=o[r]={},void 0!==a&&(o[DEF_CHAR]=a))}r=e[e.length-1],o[r]=t},DBCSCodec.prototype._fillEncodeTable=function(e,t,o){for(var r=this.decodeTables[e],i=0;256>i;i++){var d=r[i],n=t+i;o[n]||(d>=0?this._setEncodeChar(d,n):NODE_START>=d?this._fillEncodeTable(NODE_START-d,n<<8,o):SEQ_START>=d&&this._setEncodeSequence(this.decodeTableSeq[SEQ_START-d],n))}},DBCSEncoder.prototype.write=function(e){for(var t=new Buffer(e.length*(this.gb18030?4:3)),o=this.leadSurrogate,r=this.seqObj,i=-1,d=0,n=0;;){if(-1===i){if(d==e.length)break;var a=e.charCodeAt(d++)}else{var a=i;i=-1}if(a>=55296&&57344>a)if(56320>a){if(-1===o){o=a;continue}o=a,a=UNASSIGNED}else-1!==o?(a=65536+1024*(o-55296)+(a-56320),o=-1):a=UNASSIGNED;else-1!==o&&(i=a,a=UNASSIGNED,o=-1);var h=UNASSIGNED;if(void 0!==r&&a!=UNASSIGNED){var s=r[a];if("object"==typeof s){r=s;continue}"number"==typeof s?h=s:void 0==s&&(s=r[DEF_CHAR],void 0!==s&&(h=s,i=a)),r=void 0}else if(a>=0){var c=this.encodeTable[a>>8];if(void 0!==c&&(h=c[255&a]),SEQ_START>=h){r=this.encodeTableSeq[SEQ_START-h];continue}if(h==UNASSIGNED&&this.gb18030){var l=findIdx(this.gb18030.uChars,a);if(-1!=l){var h=this.gb18030.gbChars[l]+(a-this.gb18030.uChars[l]);t[n++]=129+Math.floor(h/12600),h%=12600,t[n++]=48+Math.floor(h/1260),h%=1260,t[n++]=129+Math.floor(h/10),h%=10,t[n++]=48+h;continue}}}h===UNASSIGNED&&(h=this.defaultCharSingleByte),256>h?t[n++]=h:65536>h?(t[n++]=h>>8,t[n++]=255&h):(t[n++]=h>>16,t[n++]=h>>8&255,t[n++]=255&h)}return this.seqObj=r,this.leadSurrogate=o,t.slice(0,n)},DBCSEncoder.prototype.end=function(){if(-1!==this.leadSurrogate||void 0!==this.seqObj){var e=new Buffer(10),t=0;if(this.seqObj){var o=this.seqObj[DEF_CHAR];void 0!==o&&(256>o?e[t++]=o:(e[t++]=o>>8,e[t++]=255&o)),this.seqObj=void 0}return-1!==this.leadSurrogate&&(e[t++]=this.defaultCharSingleByte,this.leadSurrogate=-1),e.slice(0,t)}},DBCSEncoder.prototype.findIdx=findIdx,DBCSDecoder.prototype.write=function(e){var t,o=new Buffer(2*e.length),r=this.nodeIdx,i=this.prevBuf,d=this.prevBuf.length,n=-this.prevBuf.length;d>0&&(i=Buffer.concat([i,e.slice(0,10)]));for(var a=0,h=0;a<e.length;a++){var s=a>=0?e[a]:i[a+d],t=this.decodeTables[r][s];if(t>=0);else if(t===UNASSIGNED)a=n,t=this.defaultCharUnicode.charCodeAt(0);else if(t===GB18030_CODE){var c=n>=0?e.slice(n,a+1):i.slice(n+d,a+1+d),l=12600*(c[0]-129)+1260*(c[1]-48)+10*(c[2]-129)+(c[3]-48),S=findIdx(this.gb18030.gbChars,l);t=this.gb18030.uChars[S]+l-this.gb18030.gbChars[S]}else{if(NODE_START>=t){r=NODE_START-t;continue}if(!(SEQ_START>=t))throw new Error("iconv-lite internal error: invalid decoding table value "+t+" at "+r+"/"+s);for(var f=this.decodeTableSeq[SEQ_START-t],T=0;T<f.length-1;T++)t=f[T],o[h++]=255&t,o[h++]=t>>8;t=f[f.length-1]}if(t>65535){t-=65536;var E=55296+Math.floor(t/1024);o[h++]=255&E,o[h++]=E>>8,t=56320+t%1024}o[h++]=255&t,o[h++]=t>>8,r=0,n=a+1}return this.nodeIdx=r,this.prevBuf=n>=0?e.slice(n):i.slice(n+d),o.slice(0,h).toString("ucs2")},DBCSDecoder.prototype.end=function(){for(var e="";this.prevBuf.length>0;){e+=this.defaultCharUnicode;var t=this.prevBuf.slice(1);this.prevBuf=new Buffer(0),this.nodeIdx=0,t.length>0&&(e+=this.write(t))}return this.nodeIdx=0,e};

}).call(this,require("buffer").Buffer)
},{"buffer":60}],139:[function(require,module,exports){
"use strict";module.exports={shiftjis:{type:"_dbcs",table:function(){return require("./tables/shiftjis.json")},encodeAdd:{"¥":92,"‾":126},encodeSkipVals:[{from:60736,to:63808}]},csshiftjis:"shiftjis",mskanji:"shiftjis",sjis:"shiftjis",windows31j:"shiftjis",xsjis:"shiftjis",windows932:"shiftjis",932:"shiftjis",cp932:"shiftjis",eucjp:{type:"_dbcs",table:function(){return require("./tables/eucjp.json")},encodeAdd:{"¥":92,"‾":126}},gb2312:"cp936",gb231280:"cp936",gb23121980:"cp936",csgb2312:"cp936",csiso58gb231280:"cp936",euccn:"cp936",isoir58:"gbk",windows936:"cp936",936:"cp936",cp936:{type:"_dbcs",table:function(){return require("./tables/cp936.json")}},gbk:{type:"_dbcs",table:function(){return require("./tables/cp936.json").concat(require("./tables/gbk-added.json"))}},xgbk:"gbk",gb18030:{type:"_dbcs",table:function(){return require("./tables/cp936.json").concat(require("./tables/gbk-added.json"))},gb18030:function(){return require("./tables/gb18030-ranges.json")}},chinese:"gb18030",windows949:"cp949",949:"cp949",cp949:{type:"_dbcs",table:function(){return require("./tables/cp949.json")}},cseuckr:"cp949",csksc56011987:"cp949",euckr:"cp949",isoir149:"cp949",korean:"cp949",ksc56011987:"cp949",ksc56011989:"cp949",ksc5601:"cp949",windows950:"cp950",950:"cp950",cp950:{type:"_dbcs",table:function(){return require("./tables/cp950.json")}},big5:"big5hkscs",big5hkscs:{type:"_dbcs",table:function(){return require("./tables/cp950.json").concat(require("./tables/big5-added.json"))},encodeSkipVals:[41676]},cnbig5:"big5hkscs",csbig5:"big5hkscs",xxbig5:"big5hkscs"};

},{"./tables/big5-added.json":145,"./tables/cp936.json":146,"./tables/cp949.json":147,"./tables/cp950.json":148,"./tables/eucjp.json":149,"./tables/gb18030-ranges.json":150,"./tables/gbk-added.json":151,"./tables/shiftjis.json":152}],140:[function(require,module,exports){
"use strict";for(var modules=[require("./internal"),require("./utf16"),require("./utf7"),require("./sbcs-codec"),require("./sbcs-data"),require("./sbcs-data-generated"),require("./dbcs-codec"),require("./dbcs-data")],i=0;i<modules.length;i++){var module=modules[i];for(var enc in module)Object.prototype.hasOwnProperty.call(module,enc)&&(exports[enc]=module[enc])}

},{"./dbcs-codec":138,"./dbcs-data":139,"./internal":141,"./sbcs-codec":142,"./sbcs-data":144,"./sbcs-data-generated":143,"./utf16":153,"./utf7":154}],141:[function(require,module,exports){
(function (Buffer){
"use strict";function InternalCodec(e,t){this.enc=e.encodingName,this.bomAware=e.bomAware,"base64"===this.enc?this.encoder=InternalEncoderBase64:"cesu8"===this.enc&&(this.enc="utf8",this.encoder=InternalEncoderCesu8,3==new Buffer("eda080","hex").toString().length&&(this.decoder=InternalDecoderCesu8,this.defaultCharUnicode=t.defaultCharUnicode))}function InternalDecoder(e,t){StringDecoder.call(this,t.enc)}function InternalEncoder(e,t){this.enc=t.enc}function InternalEncoderBase64(e,t){this.prevStr=""}function InternalEncoderCesu8(e,t){}function InternalDecoderCesu8(e,t){this.acc=0,this.contBytes=0,this.accBytes=0,this.defaultCharUnicode=t.defaultCharUnicode}module.exports={utf8:{type:"_internal",bomAware:!0},cesu8:{type:"_internal",bomAware:!0},unicode11utf8:"utf8",ucs2:{type:"_internal",bomAware:!0},utf16le:"ucs2",binary:{type:"_internal"},base64:{type:"_internal"},hex:{type:"_internal"},_internal:InternalCodec},InternalCodec.prototype.encoder=InternalEncoder,InternalCodec.prototype.decoder=InternalDecoder;var StringDecoder=require("string_decoder").StringDecoder;StringDecoder.prototype.end||(StringDecoder.prototype.end=function(){}),InternalDecoder.prototype=StringDecoder.prototype,InternalEncoder.prototype.write=function(e){return new Buffer(e,this.enc)},InternalEncoder.prototype.end=function(){},InternalEncoderBase64.prototype.write=function(e){e=this.prevStr+e;var t=e.length-e.length%4;return this.prevStr=e.slice(t),e=e.slice(0,t),new Buffer(e,"base64")},InternalEncoderBase64.prototype.end=function(){return new Buffer(this.prevStr,"base64")},InternalEncoderCesu8.prototype.write=function(e){for(var t=new Buffer(3*e.length),n=0,r=0;r<e.length;r++){var o=e.charCodeAt(r);128>o?t[n++]=o:2048>o?(t[n++]=192+(o>>>6),t[n++]=128+(63&o)):(t[n++]=224+(o>>>12),t[n++]=128+(o>>>6&63),t[n++]=128+(63&o))}return t.slice(0,n)},InternalEncoderCesu8.prototype.end=function(){},InternalDecoderCesu8.prototype.write=function(e){for(var t=this.acc,n=this.contBytes,r=this.accBytes,o="",c=0;c<e.length;c++){var i=e[c];128!==(192&i)?(n>0&&(o+=this.defaultCharUnicode,n=0),128>i?o+=String.fromCharCode(i):224>i?(t=31&i,n=1,r=1):240>i?(t=15&i,n=2,r=1):o+=this.defaultCharUnicode):n>0?(t=t<<6|63&i,n--,r++,0===n&&(o+=2===r&&128>t&&t>0?this.defaultCharUnicode:3===r&&2048>t?this.defaultCharUnicode:String.fromCharCode(t))):o+=this.defaultCharUnicode}return this.acc=t,this.contBytes=n,this.accBytes=r,o},InternalDecoderCesu8.prototype.end=function(){var e=0;return this.contBytes>0&&(e+=this.defaultCharUnicode),e};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"string_decoder":246}],142:[function(require,module,exports){
(function (Buffer){
"use strict";function SBCSCodec(e,r){if(!e)throw new Error("SBCS codec is called without the data.");if(!e.chars||128!==e.chars.length&&256!==e.chars.length)throw new Error("Encoding '"+e.type+"' has incorrect 'chars' (must be of len 128 or 256)");if(128===e.chars.length){for(var o="",t=0;128>t;t++)o+=String.fromCharCode(t);e.chars=o+e.chars}this.decodeBuf=new Buffer(e.chars,"ucs2");var c=new Buffer(65536);c.fill(r.defaultCharSingleByte.charCodeAt(0));for(var t=0;t<e.chars.length;t++)c[e.chars.charCodeAt(t)]=t;this.encodeBuf=c}function SBCSEncoder(e,r){this.encodeBuf=r.encodeBuf}function SBCSDecoder(e,r){this.decodeBuf=r.decodeBuf}exports._sbcs=SBCSCodec,SBCSCodec.prototype.encoder=SBCSEncoder,SBCSCodec.prototype.decoder=SBCSDecoder,SBCSEncoder.prototype.write=function(e){for(var r=new Buffer(e.length),o=0;o<e.length;o++)r[o]=this.encodeBuf[e.charCodeAt(o)];return r},SBCSEncoder.prototype.end=function(){},SBCSDecoder.prototype.write=function(e){for(var r=this.decodeBuf,o=new Buffer(2*e.length),t=0,c=0,n=0;n<e.length;n++)t=2*e[n],c=2*n,o[c]=r[t],o[c+1]=r[t+1];return o.toString("ucs2")},SBCSDecoder.prototype.end=function(){};

}).call(this,require("buffer").Buffer)
},{"buffer":60}],143:[function(require,module,exports){
"use strict";module.exports={437:"cp437",737:"cp737",775:"cp775",850:"cp850",852:"cp852",855:"cp855",856:"cp856",857:"cp857",858:"cp858",860:"cp860",861:"cp861",862:"cp862",863:"cp863",864:"cp864",865:"cp865",866:"cp866",869:"cp869",874:"windows874",922:"cp922",1046:"cp1046",1124:"cp1124",1125:"cp1125",1129:"cp1129",1133:"cp1133",1161:"cp1161",1162:"cp1162",1163:"cp1163",1250:"windows1250",1251:"windows1251",1252:"windows1252",1253:"windows1253",1254:"windows1254",1255:"windows1255",1256:"windows1256",1257:"windows1257",1258:"windows1258",28591:"iso88591",28592:"iso88592",28593:"iso88593",28594:"iso88594",28595:"iso88595",28596:"iso88596",28597:"iso88597",28598:"iso88598",28599:"iso88599",28600:"iso885910",28601:"iso885911",28603:"iso885913",28604:"iso885914",28605:"iso885915",28606:"iso885916",windows874:{type:"_sbcs",chars:"€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},win874:"windows874",cp874:"windows874",windows1250:{type:"_sbcs",chars:"€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"},win1250:"windows1250",cp1250:"windows1250",windows1251:{type:"_sbcs",chars:"ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},win1251:"windows1251",cp1251:"windows1251",windows1252:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},win1252:"windows1252",cp1252:"windows1252",windows1253:{type:"_sbcs",chars:"€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"},win1253:"windows1253",cp1253:"windows1253",windows1254:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"},win1254:"windows1254",cp1254:"windows1254",windows1255:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹ�ֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"},win1255:"windows1255",cp1255:"windows1255",windows1256:{type:"_sbcs",chars:"€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"},win1256:"windows1256",cp1256:"windows1256",windows1257:{type:"_sbcs",chars:"€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"},win1257:"windows1257",cp1257:"windows1257",windows1258:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"},win1258:"windows1258",cp1258:"windows1258",iso88591:{type:"_sbcs",chars:" ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},cp28591:"iso88591",iso88592:{type:"_sbcs",chars:" Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"},cp28592:"iso88592",iso88593:{type:"_sbcs",chars:" Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙"},cp28593:"iso88593",iso88594:{type:"_sbcs",chars:" ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙"},cp28594:"iso88594",iso88595:{type:"_sbcs",chars:" ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ"},cp28595:"iso88595",iso88596:{type:"_sbcs",chars:" ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������"},cp28596:"iso88596",iso88597:{type:"_sbcs",chars:" ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"},cp28597:"iso88597",iso88598:{type:"_sbcs",chars:" �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"},cp28598:"iso88598",iso88599:{type:"_sbcs",chars:" ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"},cp28599:"iso88599",iso885910:{type:"_sbcs",chars:" ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ"},cp28600:"iso885910",iso885911:{type:"_sbcs",chars:" กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},cp28601:"iso885911",iso885913:{type:"_sbcs",chars:" ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’"},cp28603:"iso885913",iso885914:{type:"_sbcs",chars:" Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ"},cp28604:"iso885914",iso885915:{type:"_sbcs",chars:" ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},cp28605:"iso885915",iso885916:{type:"_sbcs",chars:" ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ"},cp28606:"iso885916",cp437:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm437:"cp437",csibm437:"cp437",cp737:{type:"_sbcs",chars:"ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "},ibm737:"cp737",csibm737:"cp737",cp775:{type:"_sbcs",chars:"ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "},ibm775:"cp775",csibm775:"cp775",cp850:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "},ibm850:"cp850",csibm850:"cp850",cp852:{type:"_sbcs",chars:"ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "},ibm852:"cp852",csibm852:"cp852",cp855:{type:"_sbcs",chars:"ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "},ibm855:"cp855",csibm855:"cp855",cp856:{type:"_sbcs",chars:"אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ "},ibm856:"cp856",csibm856:"cp856",cp857:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "},ibm857:"cp857",csibm857:"cp857",cp858:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "},ibm858:"cp858",csibm858:"cp858",cp860:{type:"_sbcs",chars:"ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm860:"cp860",csibm860:"cp860",cp861:{type:"_sbcs",chars:"ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm861:"cp861",csibm861:"cp861",cp862:{type:"_sbcs",chars:"אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm862:"cp862",csibm862:"cp862",cp863:{type:"_sbcs",chars:"ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm863:"cp863",csibm863:"cp863",cp864:{type:"_sbcs",chars:"\x00\b	\n\x0B\f\r !\"#$٪&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�"},ibm864:"cp864",csibm864:"cp864",cp865:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm865:"cp865",csibm865:"cp865",cp866:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ "},ibm866:"cp866",csibm866:"cp866",cp869:{type:"_sbcs",chars:"������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ "},ibm869:"cp869",csibm869:"cp869",cp922:{type:"_sbcs",chars:" ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ"},ibm922:"cp922",csibm922:"cp922",cp1046:{type:"_sbcs",chars:"ﺈ×÷ﹱ■│─┐┌└┘ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ ¤ﺋﺑﺗﺛﺟﺣ،­ﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ؛ﺻﺿﻊ؟ﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟﻵﻷﻹﻻﻣﻧﻬﻩ�"},ibm1046:"cp1046",csibm1046:"cp1046",cp1124:{type:"_sbcs",chars:" ЁЂҐЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђґєѕіїјљњћќ§ўџ"},ibm1124:"cp1124",csibm1124:"cp1124",cp1125:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ "},ibm1125:"cp1125",csibm1125:"cp1125",cp1129:{type:"_sbcs",chars:" ¡¢£¤¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"},ibm1129:"cp1129",csibm1129:"cp1129",cp1133:{type:"_sbcs",chars:" ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ���ຯະາຳິີຶືຸູຼັົຽ���ເແໂໃໄ່້໊໋໌ໍໆ�ໜໝ₭����������������໐໑໒໓໔໕໖໗໘໙��¢¬¦�"},ibm1133:"cp1133",csibm1133:"cp1133",cp1161:{type:"_sbcs",chars:"��������������������������������่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋€฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛¢¬¦ "},ibm1161:"cp1161",csibm1161:"cp1161",cp1162:{type:"_sbcs",chars:"€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},ibm1162:"cp1162",csibm1162:"cp1162",cp1163:{type:"_sbcs",chars:" ¡¢£€¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"},ibm1163:"cp1163",csibm1163:"cp1163",maccroatian:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊�©⁄¤‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ"},maccyrillic:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°¢£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµ∂ЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"},macgreek:{type:"_sbcs",chars:"Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦­ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ�"},maciceland:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},macroman:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},macromania:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂŞ∞±≤≥¥µ∂∑∏π∫ªºΩăş¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›Ţţ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},macthai:{type:"_sbcs",chars:"«»…“”�•‘’� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\ufeff​–—฿เแโใไๅๆ็่้๊๋์ํ™๏๐๑๒๓๔๕๖๗๘๙®©����"},macturkish:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙ�ˆ˜¯˘˙˚¸˝˛ˇ"},macukraine:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"},koi8r:{type:"_sbcs",chars:"─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ё╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡Ё╢╣╤╥╦╧╨╩╪╫╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},koi8u:{type:"_sbcs",chars:"─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґ╝╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪Ґ╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},koi8ru:{type:"_sbcs",chars:"─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґў╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪ҐЎ©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},koi8t:{type:"_sbcs",chars:"қғ‚Ғ„…†‡�‰ҳ‹ҲҷҶ�Қ‘’“”•–—�™�›�����ӯӮё¤ӣ¦§���«¬­®�°±²Ё�Ӣ¶·�№�»���©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},armscii8:{type:"_sbcs",chars:" �և։)(»«—.՝,-֊…՜՛՞ԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ՚�"},rk1048:{type:"_sbcs",chars:"ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},tcvn:{type:"_sbcs",chars:"\x00ÚỤỪỬỮ\b	\n\x0B\f\rỨỰỲỶỸÝỴ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ"},georgianacademy:{type:"_sbcs",chars:"‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},georgianps:{type:"_sbcs",chars:"‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},pt154:{type:"_sbcs",chars:"ҖҒӮғ„…ҶҮҲүҠӢҢҚҺҸҗ‘’“”•–—ҳҷҡӣңқһҹ ЎўЈӨҘҰ§Ё©Ә«¬ӯ®Ҝ°ұІіҙө¶·ё№ә»јҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},viscii:{type:"_sbcs",chars:"\x00ẲẴẪ\b	\n\x0B\f\rỶỸỴ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ"},iso646cn:{type:"_sbcs",chars:"\x00\b	\n\x0B\f\r !\"#¥%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"},iso646jp:{type:"_sbcs",chars:"\x00\b	\n\x0B\f\r !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[¥]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"},hproman8:{type:"_sbcs",chars:" ÀÂÈÊËÎÏ´ˋˆ¨˜ÙÛ₤¯Ýý°ÇçÑñ¡¿¤£¥§ƒ¢âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ·µ¶¾—¼½ªº«■»±�"},macintosh:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},ascii:{type:"_sbcs",chars:"��������������������������������������������������������������������������������������������������������������������������������"},tis620:{type:"_sbcs",chars:"���������������������������������กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"}};

},{}],144:[function(require,module,exports){
"use strict";module.exports={10029:"maccenteuro",maccenteuro:{type:"_sbcs",chars:"ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"},808:"cp808",ibm808:"cp808",cp808:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ "},ascii8bit:"ascii",usascii:"ascii",ansix34:"ascii",ansix341968:"ascii",ansix341986:"ascii",csascii:"ascii",cp367:"ascii",ibm367:"ascii",isoir6:"ascii",iso646us:"ascii",iso646irv:"ascii",us:"ascii",latin1:"iso88591",latin2:"iso88592",latin3:"iso88593",latin4:"iso88594",latin5:"iso88599",latin6:"iso885910",latin7:"iso885913",latin8:"iso885914",latin9:"iso885915",latin10:"iso885916",csisolatin1:"iso88591",csisolatin2:"iso88592",csisolatin3:"iso88593",csisolatin4:"iso88594",csisolatincyrillic:"iso88595",csisolatinarabic:"iso88596",csisolatingreek:"iso88597",csisolatinhebrew:"iso88598",csisolatin5:"iso88599",csisolatin6:"iso885910",l1:"iso88591",l2:"iso88592",l3:"iso88593",l4:"iso88594",l5:"iso88599",l6:"iso885910",l7:"iso885913",l8:"iso885914",l9:"iso885915",l10:"iso885916",isoir14:"iso646jp",isoir57:"iso646cn",isoir100:"iso88591",isoir101:"iso88592",isoir109:"iso88593",isoir110:"iso88594",isoir144:"iso88595",isoir127:"iso88596",isoir126:"iso88597",isoir138:"iso88598",isoir148:"iso88599",isoir157:"iso885910",isoir166:"tis620",isoir179:"iso885913",isoir199:"iso885914",isoir203:"iso885915",isoir226:"iso885916",cp819:"iso88591",ibm819:"iso88591",cyrillic:"iso88595",arabic:"iso88596",arabic8:"iso88596",ecma114:"iso88596",asmo708:"iso88596",greek:"iso88597",greek8:"iso88597",ecma118:"iso88597",elot928:"iso88597",hebrew:"iso88598",hebrew8:"iso88598",turkish:"iso88599",turkish8:"iso88599",thai:"iso885911",thai8:"iso885911",celtic:"iso885914",celtic8:"iso885914",isoceltic:"iso885914",tis6200:"tis620",tis62025291:"tis620",tis62025330:"tis620",10000:"macroman",10006:"macgreek",10007:"maccyrillic",10079:"maciceland",10081:"macturkish",cspc8codepage437:"cp437",cspc775baltic:"cp775",cspc850multilingual:"cp850",cspcp852:"cp852",cspc862latinhebrew:"cp862",cpgr:"cp869",msee:"cp1250",mscyrl:"cp1251",msansi:"cp1252",msgreek:"cp1253",msturk:"cp1254",mshebr:"cp1255",msarab:"cp1256",winbaltrim:"cp1257",cp20866:"koi8r",20866:"koi8r",ibm878:"koi8r",cskoi8r:"koi8r",cp21866:"koi8u",21866:"koi8u",ibm1168:"koi8u",strk10482002:"rk1048",tcvn5712:"tcvn",tcvn57121:"tcvn",gb198880:"iso646cn",cn:"iso646cn",csiso14jisc6220ro:"iso646jp",jisc62201969ro:"iso646jp",jp:"iso646jp",cshproman8:"hproman8",r8:"hproman8",roman8:"hproman8",xroman8:"hproman8",ibm1051:"hproman8",mac:"macintosh",csmacintosh:"macintosh"};

},{}],145:[function(require,module,exports){
module.exports=[
["8740","䏰䰲䘃䖦䕸𧉧䵷䖳𧲱䳢𧳅㮕䜶䝄䱇䱀𤊿𣘗𧍒𦺋𧃒䱗𪍑䝏䗚䲅𧱬䴇䪤䚡𦬣爥𥩔𡩣𣸆𣽡晍囻"],
["8767","綕夝𨮹㷴霴𧯯寛𡵞媤㘥𩺰嫑宷峼杮薓𩥅瑡璝㡵𡵓𣚞𦀡㻬"],
["87a1","𥣞㫵竼龗𤅡𨤍𣇪𠪊𣉞䌊蒄龖鐯䤰蘓墖靊鈘秐稲晠権袝瑌篅枂稬剏遆㓦珄𥶹瓆鿇垳䤯呌䄱𣚎堘穲𧭥讏䚮𦺈䆁𥶙箮𢒼鿈𢓁𢓉𢓌鿉蔄𣖻䂴鿊䓡𪷿拁灮鿋"],
["8840","㇀",4,"𠄌㇅𠃑𠃍㇆㇇𠃋𡿨㇈𠃊㇉㇊㇋㇌𠄎㇍㇎ĀÁǍÀĒÉĚÈŌÓǑÒ࿿Ê̄Ế࿿Ê̌ỀÊāáǎàɑēéěèīíǐìōóǒòūúǔùǖǘǚ"],
["88a1","ǜü࿿ê̄ế࿿ê̌ềêɡ⏚⏛"],
["8940","𪎩𡅅"],
["8943","攊"],
["8946","丽滝鵎釟"],
["894c","𧜵撑会伨侨兖兴农凤务动医华发变团声处备夲头学实実岚庆总斉柾栄桥济炼电纤纬纺织经统缆缷艺苏药视设询车轧轮"],
["89a1","琑糼緍楆竉刧"],
["89ab","醌碸酞肼"],
["89b0","贋胶𠧧"],
["89b5","肟黇䳍鷉鸌䰾𩷶𧀎鸊𪄳㗁"],
["89c1","溚舾甙"],
["89c5","䤑马骏龙禇𨑬𡷊𠗐𢫦两亁亀亇亿仫伷㑌侽㹈倃傈㑽㒓㒥円夅凛凼刅争剹劐匧㗇厩㕑厰㕓参吣㕭㕲㚁咓咣咴咹哐哯唘唣唨㖘唿㖥㖿嗗㗅"],
["8a40","𧶄唥"],
["8a43","𠱂𠴕𥄫喐𢳆㧬𠍁蹆𤶸𩓥䁓𨂾睺𢰸㨴䟕𨅝𦧲𤷪擝𠵼𠾴𠳕𡃴撍蹾𠺖𠰋𠽤𢲩𨉖𤓓"],
["8a64","𠵆𩩍𨃩䟴𤺧𢳂骲㩧𩗴㿭㔆𥋇𩟔𧣈𢵄鵮頕"],
["8a76","䏙𦂥撴哣𢵌𢯊𡁷㧻𡁯"],
["8aa1","𦛚𦜖𧦠擪𥁒𠱃蹨𢆡𨭌𠜱"],
["8aac","䠋𠆩㿺塳𢶍"],
["8ab2","𤗈𠓼𦂗𠽌𠶖啹䂻䎺"],
["8abb","䪴𢩦𡂝膪飵𠶜捹㧾𢝵跀嚡摼㹃"],
["8ac9","𪘁𠸉𢫏𢳉"],
["8ace","𡃈𣧂㦒㨆𨊛㕸𥹉𢃇噒𠼱𢲲𩜠㒼氽𤸻"],
["8adf","𧕴𢺋𢈈𪙛𨳍𠹺𠰴𦠜羓𡃏𢠃𢤹㗻𥇣𠺌𠾍𠺪㾓𠼰𠵇𡅏𠹌"],
["8af6","𠺫𠮩𠵈𡃀𡄽㿹𢚖搲𠾭"],
["8b40","𣏴𧘹𢯎𠵾𠵿𢱑𢱕㨘𠺘𡃇𠼮𪘲𦭐𨳒𨶙𨳊閪哌苄喹"],
["8b55","𩻃鰦骶𧝞𢷮煀腭胬尜𦕲脴㞗卟𨂽醶𠻺𠸏𠹷𠻻㗝𤷫㘉𠳖嚯𢞵𡃉𠸐𠹸𡁸𡅈𨈇𡑕𠹹𤹐𢶤婔𡀝𡀞𡃵𡃶垜𠸑"],
["8ba1","𧚔𨋍𠾵𠹻𥅾㜃𠾶𡆀𥋘𪊽𤧚𡠺𤅷𨉼墙剨㘚𥜽箲孨䠀䬬鼧䧧鰟鮍𥭴𣄽嗻㗲嚉丨夂𡯁屮靑𠂆乛亻㔾尣彑忄㣺扌攵歺氵氺灬爫丬犭𤣩罒礻糹罓𦉪㓁"],
["8bde","𦍋耂肀𦘒𦥑卝衤见𧢲讠贝钅镸长门𨸏韦页风飞饣𩠐鱼鸟黄歯龜丷𠂇阝户钢"],
["8c40","倻淾𩱳龦㷉袏𤅎灷峵䬠𥇍㕙𥴰愢𨨲辧釶熑朙玺𣊁𪄇㲋𡦀䬐磤琂冮𨜏䀉橣𪊺䈣蘏𠩯稪𩥇𨫪靕灍匤𢁾鏴盙𨧣龧矝亣俰傼丯众龨吴綋墒壐𡶶庒庙忂𢜒斋"],
["8ca1","𣏹椙橃𣱣泿"],
["8ca7","爀𤔅玌㻛𤨓嬕璹讃𥲤𥚕窓篬糃繬苸薗龩袐龪躹龫迏蕟駠鈡龬𨶹𡐿䁱䊢娚"],
["8cc9","顨杫䉶圽"],
["8cce","藖𤥻芿𧄍䲁𦵴嵻𦬕𦾾龭龮宖龯曧繛湗秊㶈䓃𣉖𢞖䎚䔶"],
["8ce6","峕𣬚諹屸㴒𣕑嵸龲煗䕘𤃬𡸣䱷㥸㑊𠆤𦱁諌侴𠈹妿腬顖𩣺弻"],
["8d40","𠮟"],
["8d42","𢇁𨥭䄂䚻𩁹㼇龳𪆵䃸㟖䛷𦱆䅼𨚲𧏿䕭㣔𥒚䕡䔛䶉䱻䵶䗪㿈𤬏㙡䓞䒽䇭崾嵈嵖㷼㠏嶤嶹㠠㠸幂庽弥徃㤈㤔㤿㥍惗愽峥㦉憷憹懏㦸戬抐拥挘㧸嚱"],
["8da1","㨃揢揻搇摚㩋擀崕嘡龟㪗斆㪽旿晓㫲暒㬢朖㭂枤栀㭘桊梄㭲㭱㭻椉楃牜楤榟榅㮼槖㯝橥橴橱檂㯬檙㯲檫檵櫔櫶殁毁毪汵沪㳋洂洆洦涁㳯涤涱渕渘温溆𨧀溻滢滚齿滨滩漤漴㵆𣽁澁澾㵪㵵熷岙㶊瀬㶑灐灔灯灿炉𠌥䏁㗱𠻘"],
["8e40","𣻗垾𦻓焾𥟠㙎榢𨯩孴穉𥣡𩓙穥穽𥦬窻窰竂竃燑𦒍䇊竚竝竪䇯咲𥰁笋筕笩𥌎𥳾箢筯莜𥮴𦱿篐萡箒箸𥴠㶭𥱥蒒篺簆簵𥳁籄粃𤢂粦晽𤕸糉糇糦籴糳糵糎"],
["8ea1","繧䔝𦹄絝𦻖璍綉綫焵綳緒𤁗𦀩緤㴓緵𡟹緥𨍭縝𦄡𦅚繮纒䌫鑬縧罀罁罇礶𦋐駡羗𦍑羣𡙡𠁨䕜𣝦䔃𨌺翺𦒉者耈耝耨耯𪂇𦳃耻耼聡𢜔䦉𦘦𣷣𦛨朥肧𨩈脇脚墰𢛶汿𦒘𤾸擧𡒊舘𡡞橓𤩥𤪕䑺舩𠬍𦩒𣵾俹𡓽蓢荢𦬊𤦧𣔰𡝳𣷸芪椛芳䇛"],
["8f40","蕋苐茚𠸖𡞴㛁𣅽𣕚艻苢茘𣺋𦶣𦬅𦮗𣗎㶿茝嗬莅䔋𦶥莬菁菓㑾𦻔橗蕚㒖𦹂𢻯葘𥯤葱㷓䓤檧葊𣲵祘蒨𦮖𦹷𦹃蓞萏莑䒠蒓蓤𥲑䉀𥳀䕃蔴嫲𦺙䔧蕳䔖枿蘖"],
["8fa1","𨘥𨘻藁𧂈蘂𡖂𧃍䕫䕪蘨㙈𡢢号𧎚虾蝱𪃸蟮𢰧螱蟚蠏噡虬桖䘏衅衆𧗠𣶹𧗤衞袜䙛袴袵揁装睷𧜏覇覊覦覩覧覼𨨥觧𧤤𧪽誜瞓釾誐𧩙竩𧬺𣾏䜓𧬸煼謌謟𥐰𥕥謿譌譍誩𤩺讐讛誯𡛟䘕衏貛𧵔𧶏貫㜥𧵓賖𧶘𧶽贒贃𡤐賛灜贑𤳉㻐起"],
["9040","趩𨀂𡀔𤦊㭼𨆼𧄌竧躭躶軃鋔輙輭𨍥𨐒辥錃𪊟𠩐辳䤪𨧞𨔽𣶻廸𣉢迹𪀔𨚼𨔁𢌥㦀𦻗逷𨔼𧪾遡𨕬𨘋邨𨜓郄𨛦邮都酧㫰醩釄粬𨤳𡺉鈎沟鉁鉢𥖹銹𨫆𣲛𨬌𥗛"],
["90a1","𠴱錬鍫𨫡𨯫炏嫃𨫢𨫥䥥鉄𨯬𨰹𨯿鍳鑛躼閅閦鐦閠濶䊹𢙺𨛘𡉼𣸮䧟氜陻隖䅬隣𦻕懚隶磵𨫠隽双䦡𦲸𠉴𦐐𩂯𩃥𤫑𡤕𣌊霱虂霶䨏䔽䖅𤫩灵孁霛靜𩇕靗孊𩇫靟鐥僐𣂷𣂼鞉鞟鞱鞾韀韒韠𥑬韮琜𩐳響韵𩐝𧥺䫑頴頳顋顦㬎𧅵㵑𠘰𤅜"],
["9140","𥜆飊颷飈飇䫿𦴧𡛓喰飡飦飬鍸餹𤨩䭲𩡗𩤅駵騌騻騐驘𥜥㛄𩂱𩯕髠髢𩬅髴䰎鬔鬭𨘀倴鬴𦦨㣃𣁽魐魀𩴾婅𡡣鮎𤉋鰂鯿鰌𩹨鷔𩾷𪆒𪆫𪃡𪄣𪇟鵾鶃𪄴鸎梈"],
["91a1","鷄𢅛𪆓𪈠𡤻𪈳鴹𪂹𪊴麐麕麞麢䴴麪麯𤍤黁㭠㧥㴝伲㞾𨰫鼂鼈䮖鐤𦶢鼗鼖鼹嚟嚊齅馸𩂋韲葿齢齩竜龎爖䮾𤥵𤦻煷𤧸𤍈𤩑玞𨯚𡣺禟𨥾𨸶鍩鏳𨩄鋬鎁鏋𨥬𤒹爗㻫睲穃烐𤑳𤏸煾𡟯炣𡢾𣖙㻇𡢅𥐯𡟸㜢𡛻𡠹㛡𡝴𡣑𥽋㜣𡛀坛𤨥𡏾𡊨"],
["9240","𡏆𡒶蔃𣚦蔃葕𤦔𧅥𣸱𥕜𣻻𧁒䓴𣛮𩦝𦼦柹㜳㰕㷧塬𡤢栐䁗𣜿𤃡𤂋𤄏𦰡哋嚞𦚱嚒𠿟𠮨𠸍鏆𨬓鎜仸儫㠙𤐶亼𠑥𠍿佋侊𥙑婨𠆫𠏋㦙𠌊𠐔㐵伩𠋀𨺳𠉵諚𠈌亘"],
["92a1","働儍侢伃𤨎𣺊佂倮偬傁俌俥偘僼兙兛兝兞湶𣖕𣸹𣺿浲𡢄𣺉冨凃𠗠䓝𠒣𠒒𠒑赺𨪜𠜎剙劤𠡳勡鍮䙺熌𤎌𠰠𤦬𡃤槑𠸝瑹㻞璙琔瑖玘䮎𤪼𤂍叐㖄爏𤃉喴𠍅响𠯆圝鉝雴鍦埝垍坿㘾壋媙𨩆𡛺𡝯𡜐娬妸銏婾嫏娒𥥆𡧳𡡡𤊕㛵洅瑃娡𥺃"],
["9340","媁𨯗𠐓鏠璌𡌃焅䥲鐈𨧻鎽㞠尞岞幞幈𡦖𡥼𣫮廍孏𡤃𡤄㜁𡢠㛝𡛾㛓脪𨩇𡶺𣑲𨦨弌弎𡤧𡞫婫𡜻孄蘔𧗽衠恾𢡠𢘫忛㺸𢖯𢖾𩂈𦽳懀𠀾𠁆𢘛憙憘恵𢲛𢴇𤛔𩅍"],
["93a1","摱𤙥𢭪㨩𢬢𣑐𩣪𢹸挷𪑛撶挱揑𤧣𢵧护𢲡搻敫楲㯴𣂎𣊭𤦉𣊫唍𣋠𡣙𩐿曎𣊉𣆳㫠䆐𥖄𨬢𥖏𡛼𥕛𥐥磮𣄃𡠪𣈴㑤𣈏𣆂𤋉暎𦴤晫䮓昰𧡰𡷫晣𣋒𣋡昞𥡲㣑𣠺𣞼㮙𣞢𣏾瓐㮖枏𤘪梶栞㯄檾㡣𣟕𤒇樳橒櫉欅𡤒攑梘橌㯗橺歗𣿀𣲚鎠鋲𨯪𨫋"],
["9440","銉𨀞𨧜鑧涥漋𤧬浧𣽿㶏渄𤀼娽渊塇洤硂焻𤌚𤉶烱牐犇犔𤞏𤜥兹𤪤𠗫瑺𣻸𣙟𤩊𤤗𥿡㼆㺱𤫟𨰣𣼵悧㻳瓌琼鎇琷䒟𦷪䕑疃㽣𤳙𤴆㽘畕癳𪗆㬙瑨𨫌𤦫𤦎㫻"],
["94a1","㷍𤩎㻿𤧅𤣳釺圲鍂𨫣𡡤僟𥈡𥇧睸𣈲眎眏睻𤚗𣞁㩞𤣰琸璛㺿𤪺𤫇䃈𤪖𦆮錇𥖁砞碍碈磒珐祙𧝁𥛣䄎禛蒖禥樭𣻺稺秴䅮𡛦䄲鈵秱𠵌𤦌𠊙𣶺𡝮㖗啫㕰㚪𠇔𠰍竢婙𢛵𥪯𥪜娍𠉛磰娪𥯆竾䇹籝籭䈑𥮳𥺼𥺦糍𤧹𡞰粎籼粮檲緜縇緓罎𦉡"],
["9540","𦅜𧭈綗𥺂䉪𦭵𠤖柖𠁎𣗏埄𦐒𦏸𤥢翝笧𠠬𥫩𥵃笌𥸎駦虅驣樜𣐿㧢𤧷𦖭騟𦖠蒀𧄧𦳑䓪脷䐂胆脉腂𦞴飃𦩂艢艥𦩑葓𦶧蘐𧈛媆䅿𡡀嬫𡢡嫤𡣘蚠蜨𣶏蠭𧐢娂"],
["95a1","衮佅袇袿裦襥襍𥚃襔𧞅𧞄𨯵𨯙𨮜𨧹㺭蒣䛵䛏㟲訽訜𩑈彍鈫𤊄旔焩烄𡡅鵭貟賩𧷜妚矃姰䍮㛔踪躧𤰉輰轊䋴汘澻𢌡䢛潹溋𡟚鯩㚵𤤯邻邗啱䤆醻鐄𨩋䁢𨫼鐧𨰝𨰻蓥訫閙閧閗閖𨴴瑅㻂𤣿𤩂𤏪㻧𣈥随𨻧𨹦𨹥㻌𤧭𤩸𣿮琒瑫㻼靁𩂰"],
["9640","桇䨝𩂓𥟟靝鍨𨦉𨰦𨬯𦎾銺嬑譩䤼珹𤈛鞛靱餸𠼦巁𨯅𤪲頟𩓚鋶𩗗釥䓀𨭐𤩧𨭤飜𨩅㼀鈪䤥萔餻饍𧬆㷽馛䭯馪驜𨭥𥣈檏騡嫾騯𩣱䮐𩥈馼䮽䮗鍽塲𡌂堢𤦸"],
["96a1","𡓨硄𢜟𣶸棅㵽鑘㤧慐𢞁𢥫愇鱏鱓鱻鰵鰐魿鯏𩸭鮟𪇵𪃾鴡䲮𤄄鸘䲰鴌𪆴𪃭𪃳𩤯鶥蒽𦸒𦿟𦮂藼䔳𦶤𦺄𦷰萠藮𦸀𣟗𦁤秢𣖜𣙀䤭𤧞㵢鏛銾鍈𠊿碹鉷鑍俤㑀遤𥕝砽硔碶硋𡝗𣇉𤥁㚚佲濚濙瀞瀞吔𤆵垻壳垊鴖埗焴㒯𤆬燫𦱀𤾗嬨𡞵𨩉"],
["9740","愌嫎娋䊼𤒈㜬䭻𨧼鎻鎸𡣖𠼝葲𦳀𡐓𤋺𢰦𤏁妔𣶷𦝁綨𦅛𦂤𤦹𤦋𨧺鋥珢㻩璴𨭣𡢟㻡𤪳櫘珳珻㻖𤨾𤪔𡟙𤩦𠎧𡐤𤧥瑈𤤖炥𤥶銄珦鍟𠓾錱𨫎𨨖鎆𨯧𥗕䤵𨪂煫"],
["97a1","𤥃𠳿嚤𠘚𠯫𠲸唂秄𡟺緾𡛂𤩐𡡒䔮鐁㜊𨫀𤦭妰𡢿𡢃𧒄媡㛢𣵛㚰鉟婹𨪁𡡢鍴㳍𠪴䪖㦊僴㵩㵌𡎜煵䋻𨈘渏𩃤䓫浗𧹏灧沯㳖𣿭𣸭渂漌㵯𠏵畑㚼㓈䚀㻚䡱姄鉮䤾轁𨰜𦯀堒埈㛖𡑒烾𤍢𤩱𢿣𡊰𢎽梹楧𡎘𣓥𧯴𣛟𨪃𣟖𣏺𤲟樚𣚭𦲷萾䓟䓎"],
["9840","𦴦𦵑𦲂𦿞漗𧄉茽𡜺菭𦲀𧁓𡟛妉媂𡞳婡婱𡤅𤇼㜭姯𡜼㛇熎鎐暚𤊥婮娫𤊓樫𣻹𧜶𤑛𤋊焝𤉙𨧡侰𦴨峂𤓎𧹍𤎽樌𤉖𡌄炦焳𤏩㶥泟勇𤩏繥姫崯㷳彜𤩝𡟟綤萦"],
["98a1","咅𣫺𣌀𠈔坾𠣕𠘙㿥𡾞𪊶瀃𩅛嵰玏糓𨩙𩐠俈翧狍猐𧫴猸猹𥛶獁獈㺩𧬘遬燵𤣲珡臶㻊県㻑沢国琙琞琟㻢㻰㻴㻺瓓㼎㽓畂畭畲疍㽼痈痜㿀癍㿗癴㿜発𤽜熈嘣覀塩䀝睃䀹条䁅㗛瞘䁪䁯属瞾矋売砘点砜䂨砹硇硑硦葈𥔵礳栃礲䄃"],
["9940","䄉禑禙辻稆込䅧窑䆲窼艹䇄竏竛䇏両筢筬筻簒簛䉠䉺类粜䊌粸䊔糭输烀𠳏総緔緐緽羮羴犟䎗耠耥笹耮耱联㷌垴炠肷胩䏭脌猪脎脒畠脔䐁㬹腖腙腚"],
["99a1","䐓堺腼膄䐥膓䐭膥埯臁臤艔䒏芦艶苊苘苿䒰荗险榊萅烵葤惣蒈䔄蒾蓡蓸蔐蔸蕒䔻蕯蕰藠䕷虲蚒蚲蛯际螋䘆䘗袮裿褤襇覑𧥧訩訸誔誴豑賔賲贜䞘塟跃䟭仮踺嗘坔蹱嗵躰䠷軎転軤軭軲辷迁迊迌逳駄䢭飠鈓䤞鈨鉘鉫銱銮銿"],
["9a40","鋣鋫鋳鋴鋽鍃鎄鎭䥅䥑麿鐗匁鐝鐭鐾䥪鑔鑹锭関䦧间阳䧥枠䨤靀䨵鞲韂噔䫤惨颹䬙飱塄餎餙冴餜餷饂饝饢䭰駅䮝騼鬏窃魩鮁鯝鯱鯴䱭鰠㝯𡯂鵉鰺"],
["9aa1","黾噐鶓鶽鷀鷼银辶鹻麬麱麽黆铜黢黱黸竈齄𠂔𠊷𠎠椚铃妬𠓗塀铁㞹𠗕𠘕𠙶𡚺块煳𠫂𠫍𠮿呪吆𠯋咞𠯻𠰻𠱓𠱥𠱼惧𠲍噺𠲵𠳝𠳭𠵯𠶲𠷈楕鰯螥𠸄𠸎𠻗𠾐𠼭𠹳尠𠾼帋𡁜𡁏𡁶朞𡁻𡂈𡂖㙇𡂿𡃓𡄯𡄻卤蒭𡋣𡍵𡌶讁𡕷𡘙𡟃𡟇乸炻𡠭𡥪"],
["9b40","𡨭𡩅𡰪𡱰𡲬𡻈拃𡻕𡼕熘桕𢁅槩㛈𢉼𢏗𢏺𢜪𢡱𢥏苽𢥧𢦓𢫕覥𢫨辠𢬎鞸𢬿顇骽𢱌"],
["9b62","𢲈𢲷𥯨𢴈𢴒𢶷𢶕𢹂𢽴𢿌𣀳𣁦𣌟𣏞徱晈暿𧩹𣕧𣗳爁𤦺矗𣘚𣜖纇𠍆墵朎"],
["9ba1","椘𣪧𧙗𥿢𣸑𣺹𧗾𢂚䣐䪸𤄙𨪚𤋮𤌍𤀻𤌴𤎖𤩅𠗊凒𠘑妟𡺨㮾𣳿𤐄𤓖垈𤙴㦛𤜯𨗨𩧉㝢𢇃譞𨭎駖𤠒𤣻𤨕爉𤫀𠱸奥𤺥𤾆𠝹軚𥀬劏圿煱𥊙𥐙𣽊𤪧喼𥑆𥑮𦭒釔㑳𥔿𧘲𥕞䜘𥕢𥕦𥟇𤤿𥡝偦㓻𣏌惞𥤃䝼𨥈𥪮𥮉𥰆𡶐垡煑澶𦄂𧰒遖𦆲𤾚譢𦐂𦑊"],
["9c40","嵛𦯷輶𦒄𡤜諪𤧶𦒈𣿯𦔒䯀𦖿𦚵𢜛鑥𥟡憕娧晉侻嚹𤔡𦛼乪𤤴陖涏𦲽㘘襷𦞙𦡮𦐑𦡞營𦣇筂𩃀𠨑𦤦鄄𦤹穅鷰𦧺騦𦨭㙟𦑩𠀡禃𦨴𦭛崬𣔙菏𦮝䛐𦲤画补𦶮墶"],
["9ca1","㜜𢖍𧁋𧇍㱔𧊀𧊅銁𢅺𧊋錰𧋦𤧐氹钟𧑐𠻸蠧裵𢤦𨑳𡞱溸𤨪𡠠㦤㚹尐秣䔿暶𩲭𩢤襃𧟌𧡘囖䃟𡘊㦡𣜯𨃨𡏅熭荦𧧝𩆨婧䲷𧂯𨦫𧧽𧨊𧬋𧵦𤅺筃祾𨀉澵𪋟樃𨌘厢𦸇鎿栶靝𨅯𨀣𦦵𡏭𣈯𨁈嶅𨰰𨂃圕頣𨥉嶫𤦈斾槕叒𤪥𣾁㰑朶𨂐𨃴𨄮𡾡𨅏"],
["9d40","𨆉𨆯𨈚𨌆𨌯𨎊㗊𨑨𨚪䣺揦𨥖砈鉕𨦸䏲𨧧䏟𨧨𨭆𨯔姸𨰉輋𨿅𩃬筑𩄐𩄼㷷𩅞𤫊运犏嚋𩓧𩗩𩖰𩖸𩜲𩣑𩥉𩥪𩧃𩨨𩬎𩵚𩶛纟𩻸𩼣䲤镇𪊓熢𪋿䶑递𪗋䶜𠲜达嗁"],
["9da1","辺𢒰边𤪓䔉繿潖檱仪㓤𨬬𧢝㜺躀𡟵𨀤𨭬𨮙𧨾𦚯㷫𧙕𣲷𥘵𥥖亚𥺁𦉘嚿𠹭踎孭𣺈𤲞揞拐𡟶𡡻攰嘭𥱊吚𥌑㷆𩶘䱽嘢嘞罉𥻘奵𣵀蝰东𠿪𠵉𣚺脗鵞贘瘻鱅癎瞹鍅吲腈苷嘥脲萘肽嗪祢噃吖𠺝㗎嘅嗱曱𨋢㘭甴嗰喺咗啲𠱁𠲖廐𥅈𠹶𢱢"],
["9e40","𠺢麫絚嗞𡁵抝靭咔賍燶酶揼掹揾啩𢭃鱲𢺳冚㓟𠶧冧呍唞唓癦踭𦢊疱肶蠄螆裇膶萜𡃁䓬猄𤜆宐茋𦢓噻𢛴𧴯𤆣𧵳𦻐𧊶酰𡇙鈈𣳼𪚩𠺬𠻹牦𡲢䝎𤿂𧿹𠿫䃺"],
["9ea1","鱝攟𢶠䣳𤟠𩵼𠿬𠸊恢𧖣𠿭"],
["9ead","𦁈𡆇熣纎鵐业丄㕷嬍沲卧㚬㧜卽㚥𤘘墚𤭮舭呋垪𥪕𠥹"],
["9ec5","㩒𢑥獴𩺬䴉鯭𣳾𩼰䱛𤾩𩖞𩿞葜𣶶𧊲𦞳𣜠挮紥𣻷𣸬㨪逈勌㹴㙺䗩𠒎癀嫰𠺶硺𧼮墧䂿噼鮋嵴癔𪐴麅䳡痹㟻愙𣃚𤏲"],
["9ef5","噝𡊩垧𤥣𩸆刴𧂮㖭汊鵼"],
["9f40","籖鬹埞𡝬屓擓𩓐𦌵𧅤蚭𠴨𦴢𤫢𠵱"],
["9f4f","凾𡼏嶎霃𡷑麁遌笟鬂峑箣扨挵髿篏鬪籾鬮籂粆鰕篼鬉鼗鰛𤤾齚啳寃俽麘俲剠㸆勑坧偖妷帒韈鶫轜呩鞴饀鞺匬愰"],
["9fa1","椬叚鰊鴂䰻陁榀傦畆𡝭駚剳"],
["9fae","酙隁酜"],
["9fb2","酑𨺗捿𦴣櫊嘑醎畺抅𠏼獏籰𥰡𣳽"],
["9fc1","𤤙盖鮝个𠳔莾衂"],
["9fc9","届槀僭坺刟巵从氱𠇲伹咜哚劚趂㗾弌㗳"],
["9fdb","歒酼龥鮗頮颴骺麨麄煺笔"],
["9fe7","毺蠘罸"],
["9feb","嘠𪙊蹷齓"],
["9ff0","跔蹏鸜踁抂𨍽踨蹵竓𤩷稾磘泪詧瘇"],
["a040","𨩚鼦泎蟖痃𪊲硓咢贌狢獱謭猂瓱賫𤪻蘯徺袠䒷"],
["a055","𡠻𦸅"],
["a058","詾𢔛"],
["a05b","惽癧髗鵄鍮鮏蟵"],
["a063","蠏賷猬霡鮰㗖犲䰇籑饊𦅙慙䰄麖慽"],
["a073","坟慯抦戹拎㩜懢厪𣏵捤栂㗒"],
["a0a1","嵗𨯂迚𨸹"],
["a0a6","僙𡵆礆匲阸𠼻䁥"],
["a0ae","矾"],
["a0b0","糂𥼚糚稭聦聣絍甅瓲覔舚朌聢𧒆聛瓰脃眤覉𦟌畓𦻑螩蟎臈螌詉貭譃眫瓸蓚㘵榲趦"],
["a0d4","覩瑨涹蟁𤀑瓧㷛煶悤憜㳑煢恷"],
["a0e2","罱𨬭牐惩䭾删㰘𣳇𥻗𧙖𥔱𡥄𡋾𩤃𦷜𧂭峁𦆭𨨏𣙷𠃮𦡆𤼎䕢嬟𦍌齐麦𦉫"],
["a3c0","␀",31,"␡"],
["c6a1","①",9,"⑴",9,"ⅰ",9,"丶丿亅亠冂冖冫勹匸卩厶夊宀巛⼳广廴彐彡攴无疒癶辵隶¨ˆヽヾゝゞ〃仝々〆〇ー［］✽ぁ",23],
["c740","す",58,"ァアィイ"],
["c7a1","ゥ",81,"А",5,"ЁЖ",4],
["c840","Л",26,"ёж",25,"⇧↸↹㇏𠃌乚𠂊刂䒑"],
["c8a1","龰冈龱𧘇"],
["c8cd","￢￤＇＂㈱№℡゛゜⺀⺄⺆⺇⺈⺊⺌⺍⺕⺜⺝⺥⺧⺪⺬⺮⺶⺼⺾⻆⻊⻌⻍⻏⻖⻗⻞⻣"],
["c8f5","ʃɐɛɔɵœøŋʊɪ"],
["f9fe","￭"],
["fa40","𠕇鋛𠗟𣿅蕌䊵珯况㙉𤥂𨧤鍄𡧛苮𣳈砼杄拟𤤳𨦪𠊠𦮳𡌅侫𢓭倈𦴩𧪄𣘀𤪱𢔓倩𠍾徤𠎀𠍇滛𠐟偽儁㑺儎顬㝃萖𤦤𠒇兠𣎴兪𠯿𢃼𠋥𢔰𠖎𣈳𡦃宂蝽𠖳𣲙冲冸"],
["faa1","鴴凉减凑㳜凓𤪦决凢卂凭菍椾𣜭彻刋刦刼劵剗劔効勅簕蕂勠蘍𦬓包𨫞啉滙𣾀𠥔𣿬匳卄𠯢泋𡜦栛珕恊㺪㣌𡛨燝䒢卭却𨚫卾卿𡖖𡘓矦厓𨪛厠厫厮玧𥝲㽙玜叁叅汉义埾叙㪫𠮏叠𣿫𢶣叶𠱷吓灹唫晗浛呭𦭓𠵴啝咏咤䞦𡜍𠻝㶴𠵍"],
["fb40","𨦼𢚘啇䳭启琗喆喩嘅𡣗𤀺䕒𤐵暳𡂴嘷曍𣊊暤暭噍噏磱囱鞇叾圀囯园𨭦㘣𡉏坆𤆥汮炋坂㚱𦱾埦𡐖堃𡑔𤍣堦𤯵塜墪㕡壠壜𡈼壻寿坃𪅐𤉸鏓㖡够梦㛃湙"],
["fba1","𡘾娤啓𡚒蔅姉𠵎𦲁𦴪𡟜姙𡟻𡞲𦶦浱𡠨𡛕姹𦹅媫婣㛦𤦩婷㜈媖瑥嫓𦾡𢕔㶅𡤑㜲𡚸広勐孶斈孼𧨎䀄䡝𠈄寕慠𡨴𥧌𠖥寳宝䴐尅𡭄尓珎尔𡲥𦬨屉䣝岅峩峯嶋𡷹𡸷崐崘嵆𡺤岺巗苼㠭𤤁𢁉𢅳芇㠶㯂帮檊幵幺𤒼𠳓厦亷廐厨𡝱帉廴𨒂"],
["fc40","廹廻㢠廼栾鐛弍𠇁弢㫞䢮𡌺强𦢈𢏐彘𢑱彣鞽𦹮彲鍀𨨶徧嶶㵟𥉐𡽪𧃸𢙨釖𠊞𨨩怱暅𡡷㥣㷇㘹垐𢞴祱㹀悞悤悳𤦂𤦏𧩓璤僡媠慤萤慂慈𦻒憁凴𠙖憇宪𣾷"],
["fca1","𢡟懓𨮝𩥝懐㤲𢦀𢣁怣慜攞掋𠄘担𡝰拕𢸍捬𤧟㨗搸揸𡎎𡟼撐澊𢸶頔𤂌𥜝擡擥鑻㩦携㩗敍漖𤨨𤨣斅敭敟𣁾斵𤥀䬷旑䃘𡠩无旣忟𣐀昘𣇷𣇸晄𣆤𣆥晋𠹵晧𥇦晳晴𡸽𣈱𨗴𣇈𥌓矅𢣷馤朂𤎜𤨡㬫槺𣟂杞杧杢𤇍𩃭柗䓩栢湐鈼栁𣏦𦶠桝"],
["fd40","𣑯槡樋𨫟楳棃𣗍椁椀㴲㨁𣘼㮀枬楡𨩊䋼椶榘㮡𠏉荣傐槹𣙙𢄪橅𣜃檝㯳枱櫈𩆜㰍欝𠤣惞欵歴𢟍溵𣫛𠎵𡥘㝀吡𣭚毡𣻼毜氷𢒋𤣱𦭑汚舦汹𣶼䓅𣶽𤆤𤤌𤤀"],
["fda1","𣳉㛥㳫𠴲鮃𣇹𢒑羏样𦴥𦶡𦷫涖浜湼漄𤥿𤂅𦹲蔳𦽴凇沜渝萮𨬡港𣸯瑓𣾂秌湏媑𣁋濸㜍澝𣸰滺𡒗𤀽䕕鏰潄潜㵎潴𩅰㴻澟𤅄濓𤂑𤅕𤀹𣿰𣾴𤄿凟𤅖𤅗𤅀𦇝灋灾炧炁烌烕烖烟䄄㷨熴熖𤉷焫煅媈煊煮岜𤍥煏鍢𤋁焬𤑚𤨧𤨢熺𨯨炽爎"],
["fe40","鑂爕夑鑃爤鍁𥘅爮牀𤥴梽牕牗㹕𣁄栍漽犂猪猫𤠣𨠫䣭𨠄猨献珏玪𠰺𦨮珉瑉𤇢𡛧𤨤昣㛅𤦷𤦍𤧻珷琕椃𤨦琹𠗃㻗瑜𢢭瑠𨺲瑇珤瑶莹瑬㜰瑴鏱樬璂䥓𤪌"],
["fea1","𤅟𤩹𨮏孆𨰃𡢞瓈𡦈甎瓩甞𨻙𡩋寗𨺬鎅畍畊畧畮𤾂㼄𤴓疎瑝疞疴瘂瘬癑癏癯癶𦏵皐臯㟸𦤑𦤎皡皥皷盌𦾟葢𥂝𥅽𡸜眞眦着撯𥈠睘𣊬瞯𨥤𨥨𡛁矴砉𡍶𤨒棊碯磇磓隥礮𥗠磗礴碱𧘌辸袄𨬫𦂃𢘜禆褀椂禀𥡗禝𧬹礼禩渪𧄦㺨秆𩄍秔"]
]

},{}],146:[function(require,module,exports){
module.exports=[
["0","\u0000",127,"€"],
["8140","丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪",5,"乲乴",9,"乿",6,"亇亊"],
["8180","亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂",6,"伋伌伒",4,"伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾",4,"佄佅佇",5,"佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢"],
["8240","侤侫侭侰",4,"侶",8,"俀俁係俆俇俈俉俋俌俍俒",4,"俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿",11],
["8280","個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯",10,"倻倽倿偀偁偂偄偅偆偉偊偋偍偐",4,"偖偗偘偙偛偝",7,"偦",5,"偭",8,"偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎",20,"傤傦傪傫傭",4,"傳",6,"傼"],
["8340","傽",17,"僐",5,"僗僘僙僛",10,"僨僩僪僫僯僰僱僲僴僶",4,"僼",9,"儈"],
["8380","儉儊儌",5,"儓",13,"儢",28,"兂兇兊兌兎兏児兒兓兗兘兙兛兝",4,"兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦",4,"冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒",5],
["8440","凘凙凚凜凞凟凢凣凥",5,"凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄",5,"剋剎剏剒剓剕剗剘"],
["8480","剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳",9,"剾劀劃",4,"劉",6,"劑劒劔",6,"劜劤劥劦劧劮劯劰労",9,"勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務",5,"勠勡勢勣勥",10,"勱",7,"勻勼勽匁匂匃匄匇匉匊匋匌匎"],
["8540","匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯",9,"匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏"],
["8580","厐",4,"厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯",6,"厷厸厹厺厼厽厾叀參",4,"収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝",4,"呣呥呧呩",7,"呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡"],
["8640","咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠",4,"哫哬哯哰哱哴",5,"哻哾唀唂唃唄唅唈唊",4,"唒唓唕",5,"唜唝唞唟唡唥唦"],
["8680","唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋",4,"啑啒啓啔啗",4,"啝啞啟啠啢啣啨啩啫啯",5,"啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠",6,"喨",8,"喲喴営喸喺喼喿",4,"嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗",4,"嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸",4,"嗿嘂嘃嘄嘅"],
["8740","嘆嘇嘊嘋嘍嘐",7,"嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀",11,"噏",4,"噕噖噚噛噝",4],
["8780","噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽",7,"嚇",6,"嚐嚑嚒嚔",14,"嚤",10,"嚰",6,"嚸嚹嚺嚻嚽",12,"囋",8,"囕囖囘囙囜団囥",5,"囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國",6],
["8840","園",9,"圝圞圠圡圢圤圥圦圧圫圱圲圴",4,"圼圽圿坁坃坄坅坆坈坉坋坒",4,"坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀"],
["8880","垁垇垈垉垊垍",4,"垔",6,"垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹",8,"埄",6,"埌埍埐埑埓埖埗埛埜埞埡埢埣埥",7,"埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥",4,"堫",4,"報堲堳場堶",7],
["8940","堾",5,"塅",6,"塎塏塐塒塓塕塖塗塙",4,"塟",5,"塦",4,"塭",16,"塿墂墄墆墇墈墊墋墌"],
["8980","墍",4,"墔",4,"墛墜墝墠",7,"墪",17,"墽墾墿壀壂壃壄壆",10,"壒壓壔壖",13,"壥",5,"壭壯壱売壴壵壷壸壺",7,"夃夅夆夈",4,"夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻"],
["8a40","夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛",4,"奡奣奤奦",12,"奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦"],
["8a80","妧妬妭妰妱妳",5,"妺妼妽妿",6,"姇姈姉姌姍姎姏姕姖姙姛姞",4,"姤姦姧姩姪姫姭",11,"姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪",6,"娳娵娷",4,"娽娾娿婁",4,"婇婈婋",9,"婖婗婘婙婛",5],
["8b40","婡婣婤婥婦婨婩婫",8,"婸婹婻婼婽婾媀",17,"媓",6,"媜",13,"媫媬"],
["8b80","媭",4,"媴媶媷媹",4,"媿嫀嫃",5,"嫊嫋嫍",4,"嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬",4,"嫲",22,"嬊",11,"嬘",25,"嬳嬵嬶嬸",7,"孁",6],
["8c40","孈",7,"孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏"],
["8c80","寑寔",8,"寠寢寣實寧審",4,"寯寱",6,"寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧",6,"屰屲",6,"屻屼屽屾岀岃",4,"岉岊岋岎岏岒岓岕岝",4,"岤",4],
["8d40","岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅",5,"峌",5,"峓",5,"峚",6,"峢峣峧峩峫峬峮峯峱",9,"峼",4],
["8d80","崁崄崅崈",5,"崏",4,"崕崗崘崙崚崜崝崟",4,"崥崨崪崫崬崯",4,"崵",7,"崿",7,"嵈嵉嵍",10,"嵙嵚嵜嵞",10,"嵪嵭嵮嵰嵱嵲嵳嵵",12,"嶃",21,"嶚嶛嶜嶞嶟嶠"],
["8e40","嶡",21,"嶸",12,"巆",6,"巎",12,"巜巟巠巣巤巪巬巭"],
["8e80","巰巵巶巸",4,"巿帀帄帇帉帊帋帍帎帒帓帗帞",7,"帨",4,"帯帰帲",4,"帹帺帾帿幀幁幃幆",5,"幍",6,"幖",4,"幜幝幟幠幣",14,"幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨",4,"庮",4,"庴庺庻庼庽庿",6],
["8f40","廆廇廈廋",5,"廔廕廗廘廙廚廜",11,"廩廫",8,"廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤"],
["8f80","弨弫弬弮弰弲",6,"弻弽弾弿彁",14,"彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢",5,"復徫徬徯",5,"徶徸徹徺徻徾",4,"忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇"],
["9040","怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰",4,"怶",4,"怽怾恀恄",6,"恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀"],
["9080","悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽",7,"惇惈惉惌",4,"惒惓惔惖惗惙惛惞惡",4,"惪惱惲惵惷惸惻",4,"愂愃愄愅愇愊愋愌愐",4,"愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬",18,"慀",6],
["9140","慇慉態慍慏慐慒慓慔慖",6,"慞慟慠慡慣慤慥慦慩",6,"慱慲慳慴慶慸",18,"憌憍憏",4,"憕"],
["9180","憖",6,"憞",8,"憪憫憭",9,"憸",5,"憿懀懁懃",4,"應懌",4,"懓懕",16,"懧",13,"懶",8,"戀",5,"戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸",4,"扂扄扅扆扊"],
["9240","扏扐払扖扗扙扚扜",6,"扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋",5,"抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁"],
["9280","拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳",5,"挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖",7,"捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙",6,"採掤掦掫掯掱掲掵掶掹掻掽掿揀"],
["9340","揁揂揃揅揇揈揊揋揌揑揓揔揕揗",6,"揟揢揤",4,"揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆",4,"損搎搑搒搕",5,"搝搟搢搣搤"],
["9380","搥搧搨搩搫搮",5,"搵",4,"搻搼搾摀摂摃摉摋",6,"摓摕摖摗摙",4,"摟",7,"摨摪摫摬摮",9,"摻",6,"撃撆撈",8,"撓撔撗撘撚撛撜撝撟",4,"撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆",6,"擏擑擓擔擕擖擙據"],
["9440","擛擜擝擟擠擡擣擥擧",24,"攁",7,"攊",7,"攓",4,"攙",8],
["9480","攢攣攤攦",4,"攬攭攰攱攲攳攷攺攼攽敀",4,"敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數",14,"斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱",7,"斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘",7,"旡旣旤旪旫"],
["9540","旲旳旴旵旸旹旻",4,"昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷",4,"昽昿晀時晄",6,"晍晎晐晑晘"],
["9580","晙晛晜晝晞晠晢晣晥晧晩",4,"晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘",4,"暞",8,"暩",4,"暯",4,"暵暶暷暸暺暻暼暽暿",25,"曚曞",7,"曧曨曪",5,"曱曵曶書曺曻曽朁朂會"],
["9640","朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠",5,"朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗",4,"杝杢杣杤杦杧杫杬杮東杴杶"],
["9680","杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹",7,"柂柅",9,"柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵",7,"柾栁栂栃栄栆栍栐栒栔栕栘",4,"栞栟栠栢",6,"栫",6,"栴栵栶栺栻栿桇桋桍桏桒桖",5],
["9740","桜桝桞桟桪桬",7,"桵桸",8,"梂梄梇",7,"梐梑梒梔梕梖梘",9,"梣梤梥梩梪梫梬梮梱梲梴梶梷梸"],
["9780","梹",6,"棁棃",5,"棊棌棎棏棐棑棓棔棖棗棙棛",4,"棡棢棤",9,"棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆",4,"椌椏椑椓",11,"椡椢椣椥",7,"椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃",16,"楕楖楘楙楛楜楟"],
["9840","楡楢楤楥楧楨楩楪楬業楯楰楲",4,"楺楻楽楾楿榁榃榅榊榋榌榎",5,"榖榗榙榚榝",9,"榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽"],
["9880","榾榿槀槂",7,"構槍槏槑槒槓槕",5,"槜槝槞槡",11,"槮槯槰槱槳",9,"槾樀",9,"樋",11,"標",5,"樠樢",5,"権樫樬樭樮樰樲樳樴樶",6,"樿",4,"橅橆橈",7,"橑",6,"橚"],
["9940","橜",4,"橢橣橤橦",10,"橲",6,"橺橻橽橾橿檁檂檃檅",8,"檏檒",4,"檘",7,"檡",5],
["9980","檧檨檪檭",114,"欥欦欨",6],
["9a40","欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍",11,"歚",7,"歨歩歫",13,"歺歽歾歿殀殅殈"],
["9a80","殌殎殏殐殑殔殕殗殘殙殜",4,"殢",7,"殫",7,"殶殸",6,"毀毃毄毆",4,"毌毎毐毑毘毚毜",4,"毢",7,"毬毭毮毰毱毲毴毶毷毸毺毻毼毾",6,"氈",4,"氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋",4,"汑汒汓汖汘"],
["9b40","汙汚汢汣汥汦汧汫",4,"汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘"],
["9b80","泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟",5,"洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽",4,"涃涄涆涇涊涋涍涏涐涒涖",4,"涜涢涥涬涭涰涱涳涴涶涷涹",5,"淁淂淃淈淉淊"],
["9c40","淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽",7,"渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵"],
["9c80","渶渷渹渻",7,"湅",7,"湏湐湑湒湕湗湙湚湜湝湞湠",10,"湬湭湯",14,"満溁溂溄溇溈溊",4,"溑",6,"溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪",5],
["9d40","滰滱滲滳滵滶滷滸滺",7,"漃漄漅漇漈漊",4,"漐漑漒漖",9,"漡漢漣漥漦漧漨漬漮漰漲漴漵漷",6,"漿潀潁潂"],
["9d80","潃潄潅潈潉潊潌潎",9,"潙潚潛潝潟潠潡潣潤潥潧",5,"潯潰潱潳潵潶潷潹潻潽",6,"澅澆澇澊澋澏",12,"澝澞澟澠澢",4,"澨",10,"澴澵澷澸澺",5,"濁濃",5,"濊",6,"濓",10,"濟濢濣濤濥"],
["9e40","濦",7,"濰",32,"瀒",7,"瀜",6,"瀤",6],
["9e80","瀫",9,"瀶瀷瀸瀺",17,"灍灎灐",13,"灟",11,"灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞",12,"炰炲炴炵炶為炾炿烄烅烆烇烉烋",12,"烚"],
["9f40","烜烝烞烠烡烢烣烥烪烮烰",6,"烸烺烻烼烾",10,"焋",4,"焑焒焔焗焛",10,"焧",7,"焲焳焴"],
["9f80","焵焷",13,"煆煇煈煉煋煍煏",12,"煝煟",4,"煥煩",4,"煯煰煱煴煵煶煷煹煻煼煾",5,"熅",4,"熋熌熍熎熐熑熒熓熕熖熗熚",4,"熡",6,"熩熪熫熭",5,"熴熶熷熸熺",8,"燄",9,"燏",4],
["a040","燖",9,"燡燢燣燤燦燨",5,"燯",9,"燺",11,"爇",19],
["a080","爛爜爞",9,"爩爫爭爮爯爲爳爴爺爼爾牀",6,"牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅",4,"犌犎犐犑犓",11,"犠",11,"犮犱犲犳犵犺",6,"狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛"],
["a1a1","　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈",7,"〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"],
["a2a1","ⅰ",9],
["a2b1","⒈",19,"⑴",19,"①",9],
["a2e5","㈠",9],
["a2f1","Ⅰ",11],
["a3a1","！＂＃￥％",88,"￣"],
["a4a1","ぁ",82],
["a5a1","ァ",85],
["a6a1","Α",16,"Σ",6],
["a6c1","α",16,"σ",6],
["a6e0","︵︶︹︺︿﹀︽︾﹁﹂﹃﹄"],
["a6ee","︻︼︷︸︱"],
["a6f4","︳︴"],
["a7a1","А",5,"ЁЖ",25],
["a7d1","а",5,"ёж",25],
["a840","ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═",35,"▁",6],
["a880","█",7,"▓▔▕▼▽◢◣◤◥☉⊕〒〝〞"],
["a8a1","āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ"],
["a8bd","ńň"],
["a8c0","ɡ"],
["a8c5","ㄅ",36],
["a940","〡",8,"㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤"],
["a959","℡㈱"],
["a95c","‐"],
["a960","ー゛゜ヽヾ〆ゝゞ﹉",9,"﹔﹕﹖﹗﹙",8],
["a980","﹢",4,"﹨﹩﹪﹫"],
["a996","〇"],
["a9a4","─",75],
["aa40","狜狝狟狢",5,"狪狫狵狶狹狽狾狿猀猂猄",5,"猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀",8],
["aa80","獉獊獋獌獎獏獑獓獔獕獖獘",7,"獡",10,"獮獰獱"],
["ab40","獲",11,"獿",4,"玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣",5,"玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃",4],
["ab80","珋珌珎珒",6,"珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳",4],
["ac40","珸",10,"琄琇琈琋琌琍琎琑",8,"琜",5,"琣琤琧琩琫琭琯琱琲琷",4,"琽琾琿瑀瑂",11],
["ac80","瑎",6,"瑖瑘瑝瑠",12,"瑮瑯瑱",4,"瑸瑹瑺"],
["ad40","瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑",10,"璝璟",7,"璪",15,"璻",12],
["ad80","瓈",9,"瓓",8,"瓝瓟瓡瓥瓧",6,"瓰瓱瓲"],
["ae40","瓳瓵瓸",6,"甀甁甂甃甅",7,"甎甐甒甔甕甖甗甛甝甞甠",4,"甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘"],
["ae80","畝",7,"畧畨畩畫",6,"畳畵當畷畺",4,"疀疁疂疄疅疇"],
["af40","疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦",4,"疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇"],
["af80","瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄"],
["b040","癅",6,"癎",5,"癕癗",4,"癝癟癠癡癢癤",6,"癬癭癮癰",7,"癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛"],
["b080","皜",7,"皥",8,"皯皰皳皵",9,"盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥"],
["b140","盄盇盉盋盌盓盕盙盚盜盝盞盠",4,"盦",7,"盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎",10,"眛眜眝眞眡眣眤眥眧眪眫"],
["b180","眬眮眰",4,"眹眻眽眾眿睂睄睅睆睈",7,"睒",7,"睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳"],
["b240","睝睞睟睠睤睧睩睪睭",11,"睺睻睼瞁瞂瞃瞆",5,"瞏瞐瞓",11,"瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶",4],
["b280","瞼瞾矀",12,"矎",8,"矘矙矚矝",4,"矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖"],
["b340","矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃",5,"砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚"],
["b380","硛硜硞",11,"硯",7,"硸硹硺硻硽",6,"场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚"],
["b440","碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨",7,"碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚",9],
["b480","磤磥磦磧磩磪磫磭",4,"磳磵磶磸磹磻",5,"礂礃礄礆",6,"础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮"],
["b540","礍",5,"礔",9,"礟",4,"礥",14,"礵",4,"礽礿祂祃祄祅祇祊",8,"祔祕祘祙祡祣"],
["b580","祤祦祩祪祫祬祮祰",6,"祹祻",4,"禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠"],
["b640","禓",6,"禛",11,"禨",10,"禴",4,"禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙",5,"秠秡秢秥秨秪"],
["b680","秬秮秱",6,"秹秺秼秾秿稁稄稅稇稈稉稊稌稏",4,"稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二"],
["b740","稝稟稡稢稤",14,"稴稵稶稸稺稾穀",5,"穇",9,"穒",4,"穘",16],
["b780","穩",6,"穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服"],
["b840","窣窤窧窩窪窫窮",4,"窴",10,"竀",10,"竌",9,"竗竘竚竛竜竝竡竢竤竧",5,"竮竰竱竲竳"],
["b880","竴",4,"竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹"],
["b940","笯笰笲笴笵笶笷笹笻笽笿",5,"筆筈筊筍筎筓筕筗筙筜筞筟筡筣",10,"筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆",6,"箎箏"],
["b980","箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹",7,"篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈"],
["ba40","篅篈築篊篋篍篎篏篐篒篔",4,"篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲",4,"篸篹篺篻篽篿",7,"簈簉簊簍簎簐",5,"簗簘簙"],
["ba80","簚",4,"簠",5,"簨簩簫",12,"簹",5,"籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖"],
["bb40","籃",9,"籎",36,"籵",5,"籾",9],
["bb80","粈粊",6,"粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴",4,"粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕"],
["bc40","粿糀糂糃糄糆糉糋糎",6,"糘糚糛糝糞糡",6,"糩",5,"糰",7,"糹糺糼",13,"紋",5],
["bc80","紑",14,"紡紣紤紥紦紨紩紪紬紭紮細",6,"肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件"],
["bd40","紷",54,"絯",7],
["bd80","絸",32,"健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸"],
["be40","継",12,"綧",6,"綯",42],
["be80","線",32,"尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻"],
["bf40","緻",62],
["bf80","縺縼",4,"繂",4,"繈",21,"俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀"],
["c040","繞",35,"纃",23,"纜纝纞"],
["c080","纮纴纻纼绖绤绬绹缊缐缞缷缹缻",6,"罃罆",9,"罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐"],
["c140","罖罙罛罜罝罞罠罣",4,"罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂",7,"羋羍羏",4,"羕",4,"羛羜羠羢羣羥羦羨",6,"羱"],
["c180","羳",4,"羺羻羾翀翂翃翄翆翇翈翉翋翍翏",4,"翖翗翙",5,"翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿"],
["c240","翤翧翨翪翫翬翭翯翲翴",6,"翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫",5,"耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗"],
["c280","聙聛",13,"聫",5,"聲",11,"隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫"],
["c340","聾肁肂肅肈肊肍",5,"肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇",4,"胏",6,"胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋"],
["c380","脌脕脗脙脛脜脝脟",12,"脭脮脰脳脴脵脷脹",4,"脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸"],
["c440","腀",5,"腇腉腍腎腏腒腖腗腘腛",4,"腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃",4,"膉膋膌膍膎膐膒",5,"膙膚膞",4,"膤膥"],
["c480","膧膩膫",7,"膴",5,"膼膽膾膿臄臅臇臈臉臋臍",6,"摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁"],
["c540","臔",14,"臤臥臦臨臩臫臮",4,"臵",5,"臽臿舃與",4,"舎舏舑舓舕",5,"舝舠舤舥舦舧舩舮舲舺舼舽舿"],
["c580","艀艁艂艃艅艆艈艊艌艍艎艐",7,"艙艛艜艝艞艠",7,"艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗"],
["c640","艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸"],
["c680","苺苼",4,"茊茋茍茐茒茓茖茘茙茝",9,"茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐"],
["c740","茾茿荁荂荄荅荈荊",4,"荓荕",4,"荝荢荰",6,"荹荺荾",6,"莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡",6,"莬莭莮"],
["c780","莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠"],
["c840","菮華菳",4,"菺菻菼菾菿萀萂萅萇萈萉萊萐萒",5,"萙萚萛萞",5,"萩",7,"萲",5,"萹萺萻萾",7,"葇葈葉"],
["c880","葊",6,"葒",4,"葘葝葞葟葠葢葤",4,"葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁"],
["c940","葽",4,"蒃蒄蒅蒆蒊蒍蒏",7,"蒘蒚蒛蒝蒞蒟蒠蒢",12,"蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗"],
["c980","蓘",4,"蓞蓡蓢蓤蓧",4,"蓭蓮蓯蓱",10,"蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳"],
["ca40","蔃",8,"蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢",8,"蔭",9,"蔾",4,"蕄蕅蕆蕇蕋",10],
["ca80","蕗蕘蕚蕛蕜蕝蕟",4,"蕥蕦蕧蕩",8,"蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱"],
["cb40","薂薃薆薈",6,"薐",10,"薝",6,"薥薦薧薩薫薬薭薱",5,"薸薺",6,"藂",6,"藊",4,"藑藒"],
["cb80","藔藖",5,"藝",6,"藥藦藧藨藪",14,"恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔"],
["cc40","藹藺藼藽藾蘀",4,"蘆",10,"蘒蘓蘔蘕蘗",15,"蘨蘪",13,"蘹蘺蘻蘽蘾蘿虀"],
["cc80","虁",11,"虒虓處",4,"虛虜虝號虠虡虣",7,"獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃"],
["cd40","虭虯虰虲",6,"蚃",6,"蚎",4,"蚔蚖",5,"蚞",4,"蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻",4,"蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜"],
["cd80","蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威"],
["ce40","蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀",6,"蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚",5,"蝡蝢蝦",7,"蝯蝱蝲蝳蝵"],
["ce80","蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎",4,"螔螕螖螘",6,"螠",4,"巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺"],
["cf40","螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁",4,"蟇蟈蟉蟌",4,"蟔",6,"蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯",9],
["cf80","蟺蟻蟼蟽蟿蠀蠁蠂蠄",5,"蠋",7,"蠔蠗蠘蠙蠚蠜",4,"蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓"],
["d040","蠤",13,"蠳",5,"蠺蠻蠽蠾蠿衁衂衃衆",5,"衎",5,"衕衖衘衚",6,"衦衧衪衭衯衱衳衴衵衶衸衹衺"],
["d080","衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗",4,"袝",4,"袣袥",5,"小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄"],
["d140","袬袮袯袰袲",4,"袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚",4,"裠裡裦裧裩",6,"裲裵裶裷裺裻製裿褀褁褃",5],
["d180","褉褋",4,"褑褔",4,"褜",4,"褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶"],
["d240","褸",8,"襂襃襅",24,"襠",5,"襧",19,"襼"],
["d280","襽襾覀覂覄覅覇",26,"摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐"],
["d340","覢",30,"觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴",6],
["d380","觻",4,"訁",5,"計",21,"印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉"],
["d440","訞",31,"訿",8,"詉",21],
["d480","詟",25,"詺",6,"浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧"],
["d540","誁",7,"誋",7,"誔",46],
["d580","諃",32,"铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政"],
["d640","諤",34,"謈",27],
["d680","謤謥謧",30,"帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑"],
["d740","譆",31,"譧",4,"譭",25],
["d780","讇",24,"讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座"],
["d840","谸",8,"豂豃豄豅豈豊豋豍",7,"豖豗豘豙豛",5,"豣",6,"豬",6,"豴豵豶豷豻",6,"貃貄貆貇"],
["d880","貈貋貍",6,"貕貖貗貙",20,"亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝"],
["d940","貮",62],
["d980","賭",32,"佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼"],
["da40","贎",14,"贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸",8,"趂趃趆趇趈趉趌",4,"趒趓趕",9,"趠趡"],
["da80","趢趤",12,"趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺"],
["db40","跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾",6,"踆踇踈踋踍踎踐踑踒踓踕",7,"踠踡踤",4,"踫踭踰踲踳踴踶踷踸踻踼踾"],
["db80","踿蹃蹅蹆蹌",4,"蹓",5,"蹚",11,"蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝"],
["dc40","蹳蹵蹷",4,"蹽蹾躀躂躃躄躆躈",6,"躑躒躓躕",6,"躝躟",11,"躭躮躰躱躳",6,"躻",7],
["dc80","軃",10,"軏",21,"堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥"],
["dd40","軥",62],
["dd80","輤",32,"荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺"],
["de40","轅",32,"轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆"],
["de80","迉",4,"迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖"],
["df40","這逜連逤逥逧",5,"逰",4,"逷逹逺逽逿遀遃遅遆遈",4,"過達違遖遙遚遜",5,"遤遦遧適遪遫遬遯",4,"遶",6,"遾邁"],
["df80","還邅邆邇邉邊邌",4,"邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼"],
["e040","郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅",19,"鄚鄛鄜"],
["e080","鄝鄟鄠鄡鄤",10,"鄰鄲",6,"鄺",8,"酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼"],
["e140","酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀",4,"醆醈醊醎醏醓",6,"醜",5,"醤",5,"醫醬醰醱醲醳醶醷醸醹醻"],
["e180","醼",10,"釈釋釐釒",9,"針",8,"帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺"],
["e240","釦",62],
["e280","鈥",32,"狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧",5,"饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂"],
["e340","鉆",45,"鉵",16],
["e380","銆",7,"銏",24,"恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾"],
["e440","銨",5,"銯",24,"鋉",31],
["e480","鋩",32,"洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑"],
["e540","錊",51,"錿",10],
["e580","鍊",31,"鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣"],
["e640","鍬",34,"鎐",27],
["e680","鎬",29,"鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩"],
["e740","鏎",7,"鏗",54],
["e780","鐎",32,"纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡",6,"缪缫缬缭缯",4,"缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬"],
["e840","鐯",14,"鐿",43,"鑬鑭鑮鑯"],
["e880","鑰",20,"钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹"],
["e940","锧锳锽镃镈镋镕镚镠镮镴镵長",7,"門",42],
["e980","閫",32,"椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋"],
["ea40","闌",27,"闬闿阇阓阘阛阞阠阣",6,"阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗"],
["ea80","陘陙陚陜陝陞陠陣陥陦陫陭",4,"陳陸",12,"隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰"],
["eb40","隌階隑隒隓隕隖隚際隝",9,"隨",7,"隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖",9,"雡",6,"雫"],
["eb80","雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗",4,"霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻"],
["ec40","霡",8,"霫霬霮霯霱霳",4,"霺霻霼霽霿",18,"靔靕靗靘靚靜靝靟靣靤靦靧靨靪",7],
["ec80","靲靵靷",4,"靽",7,"鞆",4,"鞌鞎鞏鞐鞓鞕鞖鞗鞙",4,"臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐"],
["ed40","鞞鞟鞡鞢鞤",6,"鞬鞮鞰鞱鞳鞵",46],
["ed80","韤韥韨韮",4,"韴韷",23,"怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨"],
["ee40","頏",62],
["ee80","顎",32,"睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶",4,"钼钽钿铄铈",6,"铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪"],
["ef40","顯",5,"颋颎颒颕颙颣風",37,"飏飐飔飖飗飛飜飝飠",4],
["ef80","飥飦飩",30,"铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒",4,"锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤",8,"镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔"],
["f040","餈",4,"餎餏餑",28,"餯",26],
["f080","饊",9,"饖",12,"饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨",4,"鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦",6,"鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙"],
["f140","馌馎馚",10,"馦馧馩",47],
["f180","駙",32,"瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃"],
["f240","駺",62],
["f280","騹",32,"颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒"],
["f340","驚",17,"驲骃骉骍骎骔骕骙骦骩",6,"骲骳骴骵骹骻骽骾骿髃髄髆",4,"髍髎髏髐髒體髕髖髗髙髚髛髜"],
["f380","髝髞髠髢髣髤髥髧髨髩髪髬髮髰",8,"髺髼",6,"鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋"],
["f440","鬇鬉",5,"鬐鬑鬒鬔",10,"鬠鬡鬢鬤",10,"鬰鬱鬳",7,"鬽鬾鬿魀魆魊魋魌魎魐魒魓魕",5],
["f480","魛",32,"簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤"],
["f540","魼",62],
["f580","鮻",32,"酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜"],
["f640","鯜",62],
["f680","鰛",32,"觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅",5,"龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞",5,"鲥",4,"鲫鲭鲮鲰",7,"鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋"],
["f740","鰼",62],
["f780","鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾",4,"鳈鳉鳑鳒鳚鳛鳠鳡鳌",4,"鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄"],
["f840","鳣",62],
["f880","鴢",32],
["f940","鵃",62],
["f980","鶂",32],
["fa40","鶣",62],
["fa80","鷢",32],
["fb40","鸃",27,"鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴",9,"麀"],
["fb80","麁麃麄麅麆麉麊麌",5,"麔",8,"麞麠",5,"麧麨麩麪"],
["fc40","麫",8,"麵麶麷麹麺麼麿",4,"黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰",8,"黺黽黿",6],
["fc80","鼆",4,"鼌鼏鼑鼒鼔鼕鼖鼘鼚",5,"鼡鼣",8,"鼭鼮鼰鼱"],
["fd40","鼲",4,"鼸鼺鼼鼿",4,"齅",10,"齒",38],
["fd80","齹",5,"龁龂龍",11,"龜龝龞龡",4,"郎凉秊裏隣"],
["fe40","兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"]
]

},{}],147:[function(require,module,exports){
module.exports=[
["0","\u0000",127],
["8141","갂갃갅갆갋",4,"갘갞갟갡갢갣갥",6,"갮갲갳갴"],
["8161","갵갶갷갺갻갽갾갿걁",9,"걌걎",5,"걕"],
["8181","걖걗걙걚걛걝",18,"걲걳걵걶걹걻",4,"겂겇겈겍겎겏겑겒겓겕",6,"겞겢",5,"겫겭겮겱",6,"겺겾겿곀곂곃곅곆곇곉곊곋곍",7,"곖곘",7,"곢곣곥곦곩곫곭곮곲곴곷",4,"곾곿괁괂괃괅괇",4,"괎괐괒괓"],
["8241","괔괕괖괗괙괚괛괝괞괟괡",7,"괪괫괮",5],
["8261","괶괷괹괺괻괽",6,"굆굈굊",5,"굑굒굓굕굖굗"],
["8281","굙",7,"굢굤",7,"굮굯굱굲굷굸굹굺굾궀궃",4,"궊궋궍궎궏궑",10,"궞",5,"궥",17,"궸",7,"귂귃귅귆귇귉",6,"귒귔",7,"귝귞귟귡귢귣귥",18],
["8341","귺귻귽귾긂",5,"긊긌긎",5,"긕",7],
["8361","긝",18,"긲긳긵긶긹긻긼"],
["8381","긽긾긿깂깄깇깈깉깋깏깑깒깓깕깗",4,"깞깢깣깤깦깧깪깫깭깮깯깱",6,"깺깾",5,"꺆",5,"꺍",46,"꺿껁껂껃껅",6,"껎껒",5,"껚껛껝",8],
["8441","껦껧껩껪껬껮",5,"껵껶껷껹껺껻껽",8],
["8461","꼆꼉꼊꼋꼌꼎꼏꼑",18],
["8481","꼤",7,"꼮꼯꼱꼳꼵",6,"꼾꽀꽄꽅꽆꽇꽊",5,"꽑",10,"꽞",5,"꽦",18,"꽺",5,"꾁꾂꾃꾅꾆꾇꾉",6,"꾒꾓꾔꾖",5,"꾝",26,"꾺꾻꾽꾾"],
["8541","꾿꿁",5,"꿊꿌꿏",4,"꿕",6,"꿝",4],
["8561","꿢",5,"꿪",5,"꿲꿳꿵꿶꿷꿹",6,"뀂뀃"],
["8581","뀅",6,"뀍뀎뀏뀑뀒뀓뀕",6,"뀞",9,"뀩",26,"끆끇끉끋끍끏끐끑끒끖끘끚끛끜끞",29,"끾끿낁낂낃낅",6,"낎낐낒",5,"낛낝낞낣낤"],
["8641","낥낦낧낪낰낲낶낷낹낺낻낽",6,"냆냊",5,"냒"],
["8661","냓냕냖냗냙",6,"냡냢냣냤냦",10],
["8681","냱",22,"넊넍넎넏넑넔넕넖넗넚넞",4,"넦넧넩넪넫넭",6,"넶넺",5,"녂녃녅녆녇녉",6,"녒녓녖녗녙녚녛녝녞녟녡",22,"녺녻녽녾녿놁놃",4,"놊놌놎놏놐놑놕놖놗놙놚놛놝"],
["8741","놞",9,"놩",15],
["8761","놹",18,"뇍뇎뇏뇑뇒뇓뇕"],
["8781","뇖",5,"뇞뇠",7,"뇪뇫뇭뇮뇯뇱",7,"뇺뇼뇾",5,"눆눇눉눊눍",6,"눖눘눚",5,"눡",18,"눵",6,"눽",26,"뉙뉚뉛뉝뉞뉟뉡",6,"뉪",4],
["8841","뉯",4,"뉶",5,"뉽",6,"늆늇늈늊",4],
["8861","늏늒늓늕늖늗늛",4,"늢늤늧늨늩늫늭늮늯늱늲늳늵늶늷"],
["8881","늸",15,"닊닋닍닎닏닑닓",4,"닚닜닞닟닠닡닣닧닩닪닰닱닲닶닼닽닾댂댃댅댆댇댉",6,"댒댖",5,"댝",54,"덗덙덚덝덠덡덢덣"],
["8941","덦덨덪덬덭덯덲덳덵덶덷덹",6,"뎂뎆",5,"뎍"],
["8961","뎎뎏뎑뎒뎓뎕",10,"뎢",5,"뎩뎪뎫뎭"],
["8981","뎮",21,"돆돇돉돊돍돏돑돒돓돖돘돚돜돞돟돡돢돣돥돦돧돩",18,"돽",18,"됑",6,"됙됚됛됝됞됟됡",6,"됪됬",7,"됵",15],
["8a41","둅",10,"둒둓둕둖둗둙",6,"둢둤둦"],
["8a61","둧",4,"둭",18,"뒁뒂"],
["8a81","뒃",4,"뒉",19,"뒞",5,"뒥뒦뒧뒩뒪뒫뒭",7,"뒶뒸뒺",5,"듁듂듃듅듆듇듉",6,"듑듒듓듔듖",5,"듞듟듡듢듥듧",4,"듮듰듲",5,"듹",26,"딖딗딙딚딝"],
["8b41","딞",5,"딦딫",4,"딲딳딵딶딷딹",6,"땂땆"],
["8b61","땇땈땉땊땎땏땑땒땓땕",6,"땞땢",8],
["8b81","땫",52,"떢떣떥떦떧떩떬떭떮떯떲떶",4,"떾떿뗁뗂뗃뗅",6,"뗎뗒",5,"뗙",18,"뗭",18],
["8c41","똀",15,"똒똓똕똖똗똙",4],
["8c61","똞",6,"똦",5,"똭",6,"똵",5],
["8c81","똻",12,"뙉",26,"뙥뙦뙧뙩",50,"뚞뚟뚡뚢뚣뚥",5,"뚭뚮뚯뚰뚲",16],
["8d41","뛃",16,"뛕",8],
["8d61","뛞",17,"뛱뛲뛳뛵뛶뛷뛹뛺"],
["8d81","뛻",4,"뜂뜃뜄뜆",33,"뜪뜫뜭뜮뜱",6,"뜺뜼",7,"띅띆띇띉띊띋띍",6,"띖",9,"띡띢띣띥띦띧띩",6,"띲띴띶",5,"띾띿랁랂랃랅",6,"랎랓랔랕랚랛랝랞"],
["8e41","랟랡",6,"랪랮",5,"랶랷랹",8],
["8e61","럂",4,"럈럊",19],
["8e81","럞",13,"럮럯럱럲럳럵",6,"럾렂",4,"렊렋렍렎렏렑",6,"렚렜렞",5,"렦렧렩렪렫렭",6,"렶렺",5,"롁롂롃롅",11,"롒롔",7,"롞롟롡롢롣롥",6,"롮롰롲",5,"롹롺롻롽",7],
["8f41","뢅",7,"뢎",17],
["8f61","뢠",7,"뢩",6,"뢱뢲뢳뢵뢶뢷뢹",4],
["8f81","뢾뢿룂룄룆",5,"룍룎룏룑룒룓룕",7,"룞룠룢",5,"룪룫룭룮룯룱",6,"룺룼룾",5,"뤅",18,"뤙",6,"뤡",26,"뤾뤿륁륂륃륅",6,"륍륎륐륒",5],
["9041","륚륛륝륞륟륡",6,"륪륬륮",5,"륶륷륹륺륻륽"],
["9061","륾",5,"릆릈릋릌릏",15],
["9081","릟",12,"릮릯릱릲릳릵",6,"릾맀맂",5,"맊맋맍맓",4,"맚맜맟맠맢맦맧맩맪맫맭",6,"맶맻",4,"먂",5,"먉",11,"먖",33,"먺먻먽먾먿멁멃멄멅멆"],
["9141","멇멊멌멏멐멑멒멖멗멙멚멛멝",6,"멦멪",5],
["9161","멲멳멵멶멷멹",9,"몆몈몉몊몋몍",5],
["9181","몓",20,"몪몭몮몯몱몳",4,"몺몼몾",5,"뫅뫆뫇뫉",14,"뫚",33,"뫽뫾뫿묁묂묃묅",7,"묎묐묒",5,"묙묚묛묝묞묟묡",6],
["9241","묨묪묬",7,"묷묹묺묿",4,"뭆뭈뭊뭋뭌뭎뭑뭒"],
["9261","뭓뭕뭖뭗뭙",7,"뭢뭤",7,"뭭",4],
["9281","뭲",21,"뮉뮊뮋뮍뮎뮏뮑",18,"뮥뮦뮧뮩뮪뮫뮭",6,"뮵뮶뮸",7,"믁믂믃믅믆믇믉",6,"믑믒믔",35,"믺믻믽믾밁"],
["9341","밃",4,"밊밎밐밒밓밙밚밠밡밢밣밦밨밪밫밬밮밯밲밳밵"],
["9361","밶밷밹",6,"뱂뱆뱇뱈뱊뱋뱎뱏뱑",8],
["9381","뱚뱛뱜뱞",37,"벆벇벉벊벍벏",4,"벖벘벛",4,"벢벣벥벦벩",6,"벲벶",5,"벾벿볁볂볃볅",7,"볎볒볓볔볖볗볙볚볛볝",22,"볷볹볺볻볽"],
["9441","볾",5,"봆봈봊",5,"봑봒봓봕",8],
["9461","봞",5,"봥",6,"봭",12],
["9481","봺",5,"뵁",6,"뵊뵋뵍뵎뵏뵑",6,"뵚",9,"뵥뵦뵧뵩",22,"붂붃붅붆붋",4,"붒붔붖붗붘붛붝",6,"붥",10,"붱",6,"붹",24],
["9541","뷒뷓뷖뷗뷙뷚뷛뷝",11,"뷪",5,"뷱"],
["9561","뷲뷳뷵뷶뷷뷹",6,"븁븂븄븆",5,"븎븏븑븒븓"],
["9581","븕",6,"븞븠",35,"빆빇빉빊빋빍빏",4,"빖빘빜빝빞빟빢빣빥빦빧빩빫",4,"빲빶",4,"빾빿뺁뺂뺃뺅",6,"뺎뺒",5,"뺚",13,"뺩",14],
["9641","뺸",23,"뻒뻓"],
["9661","뻕뻖뻙",6,"뻡뻢뻦",5,"뻭",8],
["9681","뻶",10,"뼂",5,"뼊",13,"뼚뼞",33,"뽂뽃뽅뽆뽇뽉",6,"뽒뽓뽔뽖",44],
["9741","뾃",16,"뾕",8],
["9761","뾞",17,"뾱",7],
["9781","뾹",11,"뿆",5,"뿎뿏뿑뿒뿓뿕",6,"뿝뿞뿠뿢",89,"쀽쀾쀿"],
["9841","쁀",16,"쁒",5,"쁙쁚쁛"],
["9861","쁝쁞쁟쁡",6,"쁪",15],
["9881","쁺",21,"삒삓삕삖삗삙",6,"삢삤삦",5,"삮삱삲삷",4,"삾샂샃샄샆샇샊샋샍샎샏샑",6,"샚샞",5,"샦샧샩샪샫샭",6,"샶샸샺",5,"섁섂섃섅섆섇섉",6,"섑섒섓섔섖",5,"섡섢섥섨섩섪섫섮"],
["9941","섲섳섴섵섷섺섻섽섾섿셁",6,"셊셎",5,"셖셗"],
["9961","셙셚셛셝",6,"셦셪",5,"셱셲셳셵셶셷셹셺셻"],
["9981","셼",8,"솆",5,"솏솑솒솓솕솗",4,"솞솠솢솣솤솦솧솪솫솭솮솯솱",11,"솾",5,"쇅쇆쇇쇉쇊쇋쇍",6,"쇕쇖쇙",6,"쇡쇢쇣쇥쇦쇧쇩",6,"쇲쇴",7,"쇾쇿숁숂숃숅",6,"숎숐숒",5,"숚숛숝숞숡숢숣"],
["9a41","숤숥숦숧숪숬숮숰숳숵",16],
["9a61","쉆쉇쉉",6,"쉒쉓쉕쉖쉗쉙",6,"쉡쉢쉣쉤쉦"],
["9a81","쉧",4,"쉮쉯쉱쉲쉳쉵",6,"쉾슀슂",5,"슊",5,"슑",6,"슙슚슜슞",5,"슦슧슩슪슫슮",5,"슶슸슺",33,"싞싟싡싢싥",5,"싮싰싲싳싴싵싷싺싽싾싿쌁",6,"쌊쌋쌎쌏"],
["9b41","쌐쌑쌒쌖쌗쌙쌚쌛쌝",6,"쌦쌧쌪",8],
["9b61","쌳",17,"썆",7],
["9b81","썎",25,"썪썫썭썮썯썱썳",4,"썺썻썾",5,"쎅쎆쎇쎉쎊쎋쎍",50,"쏁",22,"쏚"],
["9c41","쏛쏝쏞쏡쏣",4,"쏪쏫쏬쏮",5,"쏶쏷쏹",5],
["9c61","쏿",8,"쐉",6,"쐑",9],
["9c81","쐛",8,"쐥",6,"쐭쐮쐯쐱쐲쐳쐵",6,"쐾",9,"쑉",26,"쑦쑧쑩쑪쑫쑭",6,"쑶쑷쑸쑺",5,"쒁",18,"쒕",6,"쒝",12],
["9d41","쒪",13,"쒹쒺쒻쒽",8],
["9d61","쓆",25],
["9d81","쓠",8,"쓪",5,"쓲쓳쓵쓶쓷쓹쓻쓼쓽쓾씂",9,"씍씎씏씑씒씓씕",6,"씝",10,"씪씫씭씮씯씱",6,"씺씼씾",5,"앆앇앋앏앐앑앒앖앚앛앜앟앢앣앥앦앧앩",6,"앲앶",5,"앾앿얁얂얃얅얆얈얉얊얋얎얐얒얓얔"],
["9e41","얖얙얚얛얝얞얟얡",7,"얪",9,"얶"],
["9e61","얷얺얿",4,"엋엍엏엒엓엕엖엗엙",6,"엢엤엦엧"],
["9e81","엨엩엪엫엯엱엲엳엵엸엹엺엻옂옃옄옉옊옋옍옎옏옑",6,"옚옝",6,"옦옧옩옪옫옯옱옲옶옸옺옼옽옾옿왂왃왅왆왇왉",6,"왒왖",5,"왞왟왡",10,"왭왮왰왲",5,"왺왻왽왾왿욁",6,"욊욌욎",5,"욖욗욙욚욛욝",6,"욦"],
["9f41","욨욪",5,"욲욳욵욶욷욻",4,"웂웄웆",5,"웎"],
["9f61","웏웑웒웓웕",6,"웞웟웢",5,"웪웫웭웮웯웱웲"],
["9f81","웳",4,"웺웻웼웾",5,"윆윇윉윊윋윍",6,"윖윘윚",5,"윢윣윥윦윧윩",6,"윲윴윶윸윹윺윻윾윿읁읂읃읅",4,"읋읎읐읙읚읛읝읞읟읡",6,"읩읪읬",7,"읶읷읹읺읻읿잀잁잂잆잋잌잍잏잒잓잕잙잛",4,"잢잧",4,"잮잯잱잲잳잵잶잷"],
["a041","잸잹잺잻잾쟂",5,"쟊쟋쟍쟏쟑",6,"쟙쟚쟛쟜"],
["a061","쟞",5,"쟥쟦쟧쟩쟪쟫쟭",13],
["a081","쟻",4,"젂젃젅젆젇젉젋",4,"젒젔젗",4,"젞젟젡젢젣젥",6,"젮젰젲",5,"젹젺젻젽젾젿졁",6,"졊졋졎",5,"졕",26,"졲졳졵졶졷졹졻",4,"좂좄좈좉좊좎",5,"좕",7,"좞좠좢좣좤"],
["a141","좥좦좧좩",18,"좾좿죀죁"],
["a161","죂죃죅죆죇죉죊죋죍",6,"죖죘죚",5,"죢죣죥"],
["a181","죦",14,"죶",5,"죾죿줁줂줃줇",4,"줎　、。·‥…¨〃­―∥＼∼‘’“”〔〕〈",9,"±×÷≠≤≥∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢"],
["a241","줐줒",5,"줙",18],
["a261","줭",6,"줵",18],
["a281","쥈",7,"쥒쥓쥕쥖쥗쥙",6,"쥢쥤",7,"쥭쥮쥯⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡€®"],
["a341","쥱쥲쥳쥵",6,"쥽",10,"즊즋즍즎즏"],
["a361","즑",6,"즚즜즞",16],
["a381","즯",16,"짂짃짅짆짉짋",4,"짒짔짗짘짛！",58,"￦］",32,"￣"],
["a441","짞짟짡짣짥짦짨짩짪짫짮짲",5,"짺짻짽짾짿쨁쨂쨃쨄"],
["a461","쨅쨆쨇쨊쨎",5,"쨕쨖쨗쨙",12],
["a481","쨦쨧쨨쨪",28,"ㄱ",93],
["a541","쩇",4,"쩎쩏쩑쩒쩓쩕",6,"쩞쩢",5,"쩩쩪"],
["a561","쩫",17,"쩾",5,"쪅쪆"],
["a581","쪇",16,"쪙",14,"ⅰ",9],
["a5b0","Ⅰ",9],
["a5c1","Α",16,"Σ",6],
["a5e1","α",16,"σ",6],
["a641","쪨",19,"쪾쪿쫁쫂쫃쫅"],
["a661","쫆",5,"쫎쫐쫒쫔쫕쫖쫗쫚",5,"쫡",6],
["a681","쫨쫩쫪쫫쫭",6,"쫵",18,"쬉쬊─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃",7],
["a741","쬋",4,"쬑쬒쬓쬕쬖쬗쬙",6,"쬢",7],
["a761","쬪",22,"쭂쭃쭄"],
["a781","쭅쭆쭇쭊쭋쭍쭎쭏쭑",6,"쭚쭛쭜쭞",5,"쭥",7,"㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙",9,"㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰",9,"㎀",4,"㎺",5,"㎐",4,"Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆"],
["a841","쭭",10,"쭺",14],
["a861","쮉",18,"쮝",6],
["a881","쮤",19,"쮹",11,"ÆÐªĦ"],
["a8a6","Ĳ"],
["a8a8","ĿŁØŒºÞŦŊ"],
["a8b1","㉠",27,"ⓐ",25,"①",14,"½⅓⅔¼¾⅛⅜⅝⅞"],
["a941","쯅",14,"쯕",10],
["a961","쯠쯡쯢쯣쯥쯦쯨쯪",18],
["a981","쯽",14,"찎찏찑찒찓찕",6,"찞찟찠찣찤æđðħıĳĸŀłøœßþŧŋŉ㈀",27,"⒜",25,"⑴",14,"¹²³⁴ⁿ₁₂₃₄"],
["aa41","찥찦찪찫찭찯찱",6,"찺찿",4,"챆챇챉챊챋챍챎"],
["aa61","챏",4,"챖챚",5,"챡챢챣챥챧챩",6,"챱챲"],
["aa81","챳챴챶",29,"ぁ",82],
["ab41","첔첕첖첗첚첛첝첞첟첡",6,"첪첮",5,"첶첷첹"],
["ab61","첺첻첽",6,"쳆쳈쳊",5,"쳑쳒쳓쳕",5],
["ab81","쳛",8,"쳥",6,"쳭쳮쳯쳱",12,"ァ",85],
["ac41","쳾쳿촀촂",5,"촊촋촍촎촏촑",6,"촚촜촞촟촠"],
["ac61","촡촢촣촥촦촧촩촪촫촭",11,"촺",4],
["ac81","촿",28,"쵝쵞쵟А",5,"ЁЖ",25],
["acd1","а",5,"ёж",25],
["ad41","쵡쵢쵣쵥",6,"쵮쵰쵲",5,"쵹",7],
["ad61","춁",6,"춉",10,"춖춗춙춚춛춝춞춟"],
["ad81","춠춡춢춣춦춨춪",5,"춱",18,"췅"],
["ae41","췆",5,"췍췎췏췑",16],
["ae61","췢",5,"췩췪췫췭췮췯췱",6,"췺췼췾",4],
["ae81","츃츅츆츇츉츊츋츍",6,"츕츖츗츘츚",5,"츢츣츥츦츧츩츪츫"],
["af41","츬츭츮츯츲츴츶",19],
["af61","칊",13,"칚칛칝칞칢",5,"칪칬"],
["af81","칮",5,"칶칷칹칺칻칽",6,"캆캈캊",5,"캒캓캕캖캗캙"],
["b041","캚",5,"캢캦",5,"캮",12],
["b061","캻",5,"컂",19],
["b081","컖",13,"컦컧컩컪컭",6,"컶컺",5,"가각간갇갈갉갊감",7,"같",4,"갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆"],
["b141","켂켃켅켆켇켉",6,"켒켔켖",5,"켝켞켟켡켢켣"],
["b161","켥",6,"켮켲",5,"켹",11],
["b181","콅",14,"콖콗콙콚콛콝",6,"콦콨콪콫콬괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸"],
["b241","콭콮콯콲콳콵콶콷콹",6,"쾁쾂쾃쾄쾆",5,"쾍"],
["b261","쾎",18,"쾢",5,"쾩"],
["b281","쾪",5,"쾱",18,"쿅",6,"깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙"],
["b341","쿌",19,"쿢쿣쿥쿦쿧쿩"],
["b361","쿪",5,"쿲쿴쿶",5,"쿽쿾쿿퀁퀂퀃퀅",5],
["b381","퀋",5,"퀒",5,"퀙",19,"끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫",4,"낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝"],
["b441","퀮",5,"퀶퀷퀹퀺퀻퀽",6,"큆큈큊",5],
["b461","큑큒큓큕큖큗큙",6,"큡",10,"큮큯"],
["b481","큱큲큳큵",6,"큾큿킀킂",18,"뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫",4,"닳담답닷",4,"닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥"],
["b541","킕",14,"킦킧킩킪킫킭",5],
["b561","킳킶킸킺",5,"탂탃탅탆탇탊",5,"탒탖",4],
["b581","탛탞탟탡탢탣탥",6,"탮탲",5,"탹",11,"덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸"],
["b641","턅",7,"턎",17],
["b661","턠",15,"턲턳턵턶턷턹턻턼턽턾"],
["b681","턿텂텆",5,"텎텏텑텒텓텕",6,"텞텠텢",5,"텩텪텫텭땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗"],
["b741","텮",13,"텽",6,"톅톆톇톉톊"],
["b761","톋",20,"톢톣톥톦톧"],
["b781","톩",6,"톲톴톶톷톸톹톻톽톾톿퇁",14,"래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩"],
["b841","퇐",7,"퇙",17],
["b861","퇫",8,"퇵퇶퇷퇹",13],
["b881","툈툊",5,"툑",24,"륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많",4,"맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼"],
["b941","툪툫툮툯툱툲툳툵",6,"툾퉀퉂",5,"퉉퉊퉋퉌"],
["b961","퉍",14,"퉝",6,"퉥퉦퉧퉨"],
["b981","퉩",22,"튂튃튅튆튇튉튊튋튌묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바",4,"받",4,"밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗"],
["ba41","튍튎튏튒튓튔튖",5,"튝튞튟튡튢튣튥",6,"튭"],
["ba61","튮튯튰튲",5,"튺튻튽튾틁틃",4,"틊틌",5],
["ba81","틒틓틕틖틗틙틚틛틝",6,"틦",9,"틲틳틵틶틷틹틺벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤"],
["bb41","틻",4,"팂팄팆",5,"팏팑팒팓팕팗",4,"팞팢팣"],
["bb61","팤팦팧팪팫팭팮팯팱",6,"팺팾",5,"퍆퍇퍈퍉"],
["bb81","퍊",31,"빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤"],
["bc41","퍪",17,"퍾퍿펁펂펃펅펆펇"],
["bc61","펈펉펊펋펎펒",5,"펚펛펝펞펟펡",6,"펪펬펮"],
["bc81","펯",4,"펵펶펷펹펺펻펽",6,"폆폇폊",5,"폑",5,"샥샨샬샴샵샷샹섀섄섈섐섕서",4,"섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭"],
["bd41","폗폙",7,"폢폤",7,"폮폯폱폲폳폵폶폷"],
["bd61","폸폹폺폻폾퐀퐂",5,"퐉",13],
["bd81","퐗",5,"퐞",25,"숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰"],
["be41","퐸",7,"푁푂푃푅",14],
["be61","푔",7,"푝푞푟푡푢푣푥",7,"푮푰푱푲"],
["be81","푳",4,"푺푻푽푾풁풃",4,"풊풌풎",5,"풕",8,"쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄",6,"엌엎"],
["bf41","풞",10,"풪",14],
["bf61","풹",18,"퓍퓎퓏퓑퓒퓓퓕"],
["bf81","퓖",5,"퓝퓞퓠",7,"퓩퓪퓫퓭퓮퓯퓱",6,"퓹퓺퓼에엑엔엘엠엡엣엥여역엮연열엶엷염",5,"옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨"],
["c041","퓾",5,"픅픆픇픉픊픋픍",6,"픖픘",5],
["c061","픞",25],
["c081","픸픹픺픻픾픿핁핂핃핅",6,"핎핐핒",5,"핚핛핝핞핟핡핢핣웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응",7,"읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊"],
["c141","핤핦핧핪핬핮",5,"핶핷핹핺핻핽",6,"햆햊햋"],
["c161","햌햍햎햏햑",19,"햦햧"],
["c181","햨",31,"점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓"],
["c241","헊헋헍헎헏헑헓",4,"헚헜헞",5,"헦헧헩헪헫헭헮"],
["c261","헯",4,"헶헸헺",5,"혂혃혅혆혇혉",6,"혒"],
["c281","혖",5,"혝혞혟혡혢혣혥",7,"혮",9,"혺혻징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻"],
["c341","혽혾혿홁홂홃홄홆홇홊홌홎홏홐홒홓홖홗홙홚홛홝",4],
["c361","홢",4,"홨홪",5,"홲홳홵",11],
["c381","횁횂횄횆",5,"횎횏횑횒횓횕",7,"횞횠횢",5,"횩횪찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층"],
["c441","횫횭횮횯횱",7,"횺횼",7,"훆훇훉훊훋"],
["c461","훍훎훏훐훒훓훕훖훘훚",5,"훡훢훣훥훦훧훩",4],
["c481","훮훯훱훲훳훴훶",5,"훾훿휁휂휃휅",11,"휒휓휔치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼"],
["c541","휕휖휗휚휛휝휞휟휡",6,"휪휬휮",5,"휶휷휹"],
["c561","휺휻휽",6,"흅흆흈흊",5,"흒흓흕흚",4],
["c581","흟흢흤흦흧흨흪흫흭흮흯흱흲흳흵",6,"흾흿힀힂",5,"힊힋큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜"],
["c641","힍힎힏힑",6,"힚힜힞",5],
["c6a1","퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁"],
["c7a1","퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠"],
["c8a1","혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝"],
["caa1","伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪慤殼珏脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗癎看磵稈竿簡肝艮艱諫間乫喝曷渴碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕"],
["cba1","匣岬甲胛鉀閘剛堈姜岡崗康强彊慷江畺疆糠絳綱羌腔舡薑襁講鋼降鱇介价個凱塏愷愾慨改槪漑疥皆盖箇芥蓋豈鎧開喀客坑更粳羹醵倨去居巨拒据據擧渠炬祛距踞車遽鉅鋸乾件健巾建愆楗腱虔蹇鍵騫乞傑杰桀儉劍劒檢"],
["cca1","瞼鈐黔劫怯迲偈憩揭擊格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京俓倞傾儆勁勍卿坰境庚徑慶憬擎敬景暻更梗涇炅烱璟璥瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械"],
["cda1","棨溪界癸磎稽系繫繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦苽菰藁蠱袴誥賈辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾琨袞鯤汨滑骨供公共功孔工恐恭拱控攻珙空蚣貢鞏串寡戈果瓜"],
["cea1","科菓誇課跨過鍋顆廓槨藿郭串冠官寬慣棺款灌琯瓘管罐菅觀貫關館刮恝括适侊光匡壙廣曠洸炚狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌嶠巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇俱具勾"],
["cfa1","區口句咎嘔坵垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究絿耉臼舅舊苟衢謳購軀逑邱鉤銶駒驅鳩鷗龜國局菊鞠鞫麴君窘群裙軍郡堀屈掘窟宮弓穹窮芎躬倦券勸卷圈拳捲權淃眷厥獗蕨蹶闕机櫃潰詭軌饋句晷歸貴"],
["d0a1","鬼龜叫圭奎揆槻珪硅窺竅糾葵規赳逵閨勻均畇筠菌鈞龜橘克剋劇戟棘極隙僅劤勤懃斤根槿瑾筋芹菫覲謹近饉契今妗擒昑檎琴禁禽芩衾衿襟金錦伋及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼夔奇妓寄岐崎己幾忌技旗旣"],
["d1a1","朞期杞棋棄機欺氣汽沂淇玘琦琪璂璣畸畿碁磯祁祇祈祺箕紀綺羈耆耭肌記譏豈起錡錤飢饑騎騏驥麒緊佶吉拮桔金喫儺喇奈娜懦懶拏拿癩",5,"那樂",4,"諾酪駱亂卵暖欄煖爛蘭難鸞捏捺南嵐枏楠湳濫男藍襤拉"],
["d2a1","納臘蠟衲囊娘廊",4,"乃來內奈柰耐冷女年撚秊念恬拈捻寧寗努勞奴弩怒擄櫓爐瑙盧",5,"駑魯",10,"濃籠聾膿農惱牢磊腦賂雷尿壘",7,"嫩訥杻紐勒",5,"能菱陵尼泥匿溺多茶"],
["d3a1","丹亶但單團壇彖斷旦檀段湍短端簞緞蛋袒鄲鍛撻澾獺疸達啖坍憺擔曇淡湛潭澹痰聃膽蕁覃談譚錟沓畓答踏遝唐堂塘幢戇撞棠當糖螳黨代垈坮大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃"],
["d4a1","棹櫂淘渡滔濤燾盜睹禱稻萄覩賭跳蹈逃途道都鍍陶韜毒瀆牘犢獨督禿篤纛讀墩惇敦旽暾沌焞燉豚頓乭突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜枓痘竇荳讀豆逗頭屯臀芚遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶拏癩羅"],
["d5a1","蘿螺裸邏樂洛烙珞絡落諾酪駱丹亂卵欄欒瀾爛蘭鸞剌辣嵐擥攬欖濫籃纜藍襤覽拉臘蠟廊朗浪狼琅瑯螂郞來崍徠萊冷掠略亮倆兩凉梁樑粮粱糧良諒輛量侶儷勵呂廬慮戾旅櫚濾礪藜蠣閭驢驪麗黎力曆歷瀝礫轢靂憐戀攣漣"],
["d6a1","煉璉練聯蓮輦連鍊冽列劣洌烈裂廉斂殮濂簾獵令伶囹寧岺嶺怜玲笭羚翎聆逞鈴零靈領齡例澧禮醴隷勞怒撈擄櫓潞瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠菉錄鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼"],
["d7a1","遼鬧龍壘婁屢樓淚漏瘻累縷蔞褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗率隆勒肋凜凌楞稜綾菱陵俚利厘吏唎履悧李梨浬犁狸理璃異痢籬罹羸莉裏裡里釐離鯉吝潾燐璘藺躪隣鱗麟林淋琳臨霖砬"],
["d8a1","立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫邈万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻唜抹末沫茉襪靺亡妄忘忙望網罔芒茫莽輞邙埋妹媒寐昧枚梅每煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉沔眄眠綿緬面麵滅"],
["d9a1","蔑冥名命明暝椧溟皿瞑茗蓂螟酩銘鳴袂侮冒募姆帽慕摸摹暮某模母毛牟牡瑁眸矛耗芼茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫竗苗錨務巫憮懋戊拇撫无楙武毋無珷畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文"],
["daa1","汶紊紋聞蚊門雯勿沕物味媚尾嵋彌微未梶楣渼湄眉米美薇謎迷靡黴岷悶愍憫敏旻旼民泯玟珉緡閔密蜜謐剝博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃泮潘班畔瘢盤盼磐磻礬絆般蟠返頒飯勃拔撥渤潑"],
["dba1","發跋醱鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防龐倍俳北培徘拜排杯湃焙盃背胚裴裵褙賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番磻繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖"],
["dca1","碧蘗闢霹便卞弁變辨辯邊別瞥鱉鼈丙倂兵屛幷昞昺柄棅炳甁病秉竝輧餠騈保堡報寶普步洑湺潽珤甫菩補褓譜輔伏僕匐卜宓復服福腹茯蔔複覆輹輻馥鰒本乶俸奉封峯峰捧棒烽熢琫縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦"],
["dda1","孚孵富府復扶敷斧浮溥父符簿缶腐腑膚艀芙莩訃負賦賻赴趺部釜阜附駙鳧北分吩噴墳奔奮忿憤扮昐汾焚盆粉糞紛芬賁雰不佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖毗毘沸泌琵痺砒碑秕秘粃緋翡肥"],
["dea1","脾臂菲蜚裨誹譬費鄙非飛鼻嚬嬪彬斌檳殯浜濱瀕牝玭貧賓頻憑氷聘騁乍事些仕伺似使俟僿史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯柶査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削數朔索"],
["dfa1","傘刪山散汕珊産疝算蒜酸霰乷撒殺煞薩三參杉森渗芟蔘衫揷澁鈒颯上傷像償商喪嘗孀尙峠常床庠廂想桑橡湘爽牀狀相祥箱翔裳觴詳象賞霜塞璽賽嗇塞穡索色牲生甥省笙墅壻嶼序庶徐恕抒捿敍暑曙書栖棲犀瑞筮絮緖署"],
["e0a1","胥舒薯西誓逝鋤黍鼠夕奭席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇敾旋渲煽琁瑄璇璿癬禪線繕羨腺膳船蘚蟬詵跣選銑鐥饍鮮卨屑楔泄洩渫舌薛褻設說雪齧剡暹殲纖蟾贍閃陝攝涉燮葉城姓宬性惺成星晟猩珹盛省筬"],
["e1a1","聖聲腥誠醒世勢歲洗稅笹細說貰召嘯塑宵小少巢所掃搔昭梳沼消溯瀟炤燒甦疏疎瘙笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束涑粟續謖贖速孫巽損蓀遜飡率宋悚松淞訟誦送頌刷殺灑碎鎖衰釗修受嗽囚垂壽嫂守岫峀帥愁"],
["e2a1","戍手授搜收數樹殊水洙漱燧狩獸琇璲瘦睡秀穗竪粹綏綬繡羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑潚熟琡璹肅菽巡徇循恂旬栒楯橓殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述鉥崇崧"],
["e3a1","嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始媤尸屎屍市弑恃施是時枾柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄篒蝕識軾食飾伸侁信呻娠宸愼新晨燼申神紳腎臣莘薪藎蜃訊身辛辰迅失室實悉審尋心沁"],
["e4a1","沈深瀋甚芯諶什十拾雙氏亞俄兒啞娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼唵岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額"],
["e5a1","櫻罌鶯鸚也倻冶夜惹揶椰爺耶若野弱掠略約若葯蒻藥躍亮佯兩凉壤孃恙揚攘敭暘梁楊樣洋瀁煬痒瘍禳穰糧羊良襄諒讓釀陽量養圄御於漁瘀禦語馭魚齬億憶抑檍臆偃堰彦焉言諺孼蘖俺儼嚴奄掩淹嶪業円予余勵呂女如廬"],
["e6a1","旅歟汝濾璵礖礪與艅茹輿轝閭餘驪麗黎亦力域役易曆歷疫繹譯轢逆驛嚥堧姸娟宴年延憐戀捐挻撚椽沇沿涎涓淵演漣烟然煙煉燃燕璉硏硯秊筵緣練縯聯衍軟輦蓮連鉛鍊鳶列劣咽悅涅烈熱裂說閱厭廉念捻染殮炎焰琰艶苒"],
["e7a1","簾閻髥鹽曄獵燁葉令囹塋寧嶺嶸影怜映暎楹榮永泳渶潁濚瀛瀯煐營獰玲瑛瑩瓔盈穎纓羚聆英詠迎鈴鍈零霙靈領乂倪例刈叡曳汭濊猊睿穢芮藝蘂禮裔詣譽豫醴銳隸霓預五伍俉傲午吾吳嗚塢墺奧娛寤悟惡懊敖旿晤梧汚澳"],
["e8a1","烏熬獒筽蜈誤鰲鼇屋沃獄玉鈺溫瑥瘟穩縕蘊兀壅擁瓮甕癰翁邕雍饔渦瓦窩窪臥蛙蝸訛婉完宛梡椀浣玩琓琬碗緩翫脘腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏了僚僥凹堯夭妖姚寥寮尿嶢拗搖撓擾料曜樂橈燎燿瑤療"],
["e9a1","窈窯繇繞耀腰蓼蟯要謠遙遼邀饒慾欲浴縟褥辱俑傭冗勇埇墉容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞龍于佑偶優又友右宇寓尤愚憂旴牛玗瑀盂祐禑禹紆羽芋藕虞迂遇郵釪隅雨雩勖彧旭昱栯煜稶郁頊云暈橒殞澐熉耘芸蕓"],
["eaa1","運隕雲韻蔚鬱亐熊雄元原員圓園垣媛嫄寃怨愿援沅洹湲源爰猿瑗苑袁轅遠阮院願鴛月越鉞位偉僞危圍委威尉慰暐渭爲瑋緯胃萎葦蔿蝟衛褘謂違韋魏乳侑儒兪劉唯喩孺宥幼幽庾悠惟愈愉揄攸有杻柔柚柳楡楢油洧流游溜"],
["eba1","濡猶猷琉瑜由留癒硫紐維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮類六堉戮毓肉育陸倫允奫尹崙淪潤玧胤贇輪鈗閏律慄栗率聿戎瀜絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤薏蟻衣誼"],
["eca1","議醫二以伊利吏夷姨履已弛彛怡易李梨泥爾珥理異痍痢移罹而耳肄苡荑裏裡貽貳邇里離飴餌匿溺瀷益翊翌翼謚人仁刃印吝咽因姻寅引忍湮燐璘絪茵藺蚓認隣靭靷鱗麟一佚佾壹日溢逸鎰馹任壬妊姙恁林淋稔臨荏賃入卄"],
["eda1","立笠粒仍剩孕芿仔刺咨姉姿子字孜恣慈滋炙煮玆瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣欌漿牆狀獐璋章粧腸臟臧莊葬蔣薔藏裝贓醬長"],
["eea1","障再哉在宰才材栽梓渽滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧菹著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄炙的積笛籍績翟荻謫賊赤跡蹟迪迹適鏑佃佺傳全典前剪塡塼奠專展廛悛戰栓殿氈澱"],
["efa1","煎琠田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電顚顫餞切截折浙癤竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈姃定幀庭廷征情挺政整旌晶晸柾楨檉正汀淀淨渟湞瀞炡玎珽町睛碇禎程穽精綎艇訂諪貞鄭酊釘鉦鋌錠霆靖"],
["f0a1","靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪璪眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝倧宗從悰慫棕淙琮種終綜縱腫"],
["f1a1","踪踵鍾鐘佐坐左座挫罪主住侏做姝胄呪周嗾奏宙州廚晝朱柱株注洲湊澍炷珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈寯峻晙樽浚準濬焌畯竣蠢逡遵雋駿茁中仲衆重卽櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只"],
["f2a1","咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝芷蜘誌識贄趾遲直稙稷織職唇嗔塵振搢晉晋桭榛殄津溱珍瑨璡畛疹盡眞瞋秦縉縝臻蔯袗診賑軫辰進鎭陣陳震侄叱姪嫉帙桎瓆疾秩窒膣蛭質跌迭斟朕什執潗緝輯"],
["f3a1","鏶集徵懲澄且侘借叉嗟嵯差次此磋箚茶蹉車遮捉搾着窄錯鑿齪撰澯燦璨瓚竄簒纂粲纘讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債埰寀寨彩採砦綵菜蔡采釵冊柵策"],
["f4a1","責凄妻悽處倜刺剔尺慽戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺玔穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添甛瞻簽籤詹諂堞妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖切剃替涕滯締諦逮遞體初剿哨憔抄招梢"],
["f5a1","椒楚樵炒焦硝礁礎秒稍肖艸苕草蕉貂超酢醋醮促囑燭矗蜀觸寸忖村邨叢塚寵悤憁摠總聰蔥銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛騶鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿瑃出朮黜充忠沖蟲衝衷悴膵萃"],
["f6a1","贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治淄熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七柒漆侵寢枕沈浸琛砧針鍼蟄秤稱快他咤唾墮妥惰打拖朶楕舵陀馱駝倬卓啄坼度托拓擢晫柝濁濯琢琸託"],
["f7a1","鐸呑嘆坦彈憚歎灘炭綻誕奪脫探眈耽貪塔搭榻宕帑湯糖蕩兌台太怠態殆汰泰笞胎苔跆邰颱宅擇澤撑攄兎吐土討慟桶洞痛筒統通堆槌腿褪退頹偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販辦鈑"],
["f8a1","阪八叭捌佩唄悖敗沛浿牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平枰萍評吠嬖幣廢弊斃肺蔽閉陛佈包匍匏咆哺圃布怖抛抱捕暴泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆輻俵剽彪慓杓標漂瓢票表豹飇飄驃"],
["f9a1","品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌珌畢疋筆苾馝乏逼下何厦夏廈昰河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉姮嫦巷恒抗杭桁沆港缸肛航"],
["faa1","行降項亥偕咳垓奚孩害懈楷海瀣蟹解該諧邂駭骸劾核倖幸杏荇行享向嚮珦鄕響餉饗香噓墟虛許憲櫶獻軒歇險驗奕爀赫革俔峴弦懸晛泫炫玄玹現眩睍絃絢縣舷衒見賢鉉顯孑穴血頁嫌俠協夾峽挾浹狹脅脇莢鋏頰亨兄刑型"],
["fba1","形泂滎瀅灐炯熒珩瑩荊螢衡逈邢鎣馨兮彗惠慧暳蕙蹊醯鞋乎互呼壕壺好岵弧戶扈昊晧毫浩淏湖滸澔濠濩灝狐琥瑚瓠皓祜糊縞胡芦葫蒿虎號蝴護豪鎬頀顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪烘紅虹訌鴻化和嬅樺火畵"],
["fca1","禍禾花華話譁貨靴廓擴攫確碻穫丸喚奐宦幻患換歡晥桓渙煥環紈還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄榥況湟滉潢煌璜皇篁簧荒蝗遑隍黃匯回廻徊恢悔懷晦會檜淮澮灰獪繪膾茴蛔誨賄劃獲宖橫鐄哮嚆孝效斅曉梟涍淆"],
["fda1","爻肴酵驍侯候厚后吼喉嗅帿後朽煦珝逅勛勳塤壎焄熏燻薰訓暈薨喧暄煊萱卉喙毁彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣炘痕吃屹紇訖欠欽歆吸恰洽翕興僖凞喜噫囍姬嬉希憙憘戱晞曦熙熹熺犧禧稀羲詰"]
]

},{}],148:[function(require,module,exports){
module.exports=[
["0","\u0000",127],
["a140","　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚"],
["a1a1","﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢",4,"～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／"],
["a240","＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁",7,"▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭"],
["a2a1","╮╰╯═╞╪╡◢◣◥◤╱╲╳０",9,"Ⅰ",9,"〡",8,"十卄卅Ａ",25,"ａ",21],
["a340","ｗｘｙｚΑ",16,"Σ",6,"α",16,"σ",6,"ㄅ",10],
["a3a1","ㄐ",25,"˙ˉˊˇˋ"],
["a3e1","€"],
["a440","一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才"],
["a4a1","丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"],
["a540","世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外"],
["a5a1","央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全"],
["a640","共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年"],
["a6a1","式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣"],
["a740","作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍"],
["a7a1","均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠"],
["a840","杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒"],
["a8a1","芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵"],
["a940","咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居"],
["a9a1","屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊"],
["aa40","昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠"],
["aaa1","炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附"],
["ab40","陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品"],
["aba1","哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷"],
["ac40","拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗"],
["aca1","活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄"],
["ad40","耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥"],
["ada1","迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪"],
["ae40","哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙"],
["aea1","恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓"],
["af40","浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷"],
["afa1","砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃"],
["b040","虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡"],
["b0a1","陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀"],
["b140","娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽"],
["b1a1","情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺"],
["b240","毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶"],
["b2a1","瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼"],
["b340","莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途"],
["b3a1","部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠"],
["b440","婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍"],
["b4a1","插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋"],
["b540","溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘"],
["b5a1","窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁"],
["b640","詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑"],
["b6a1","間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼"],
["b740","媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業"],
["b7a1","楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督"],
["b840","睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫"],
["b8a1","腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊"],
["b940","辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴"],
["b9a1","飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇"],
["ba40","愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢"],
["baa1","滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"],
["bb40","罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤"],
["bba1","說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜"],
["bc40","劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂"],
["bca1","慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃"],
["bd40","瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯"],
["bda1","翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞"],
["be40","輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉"],
["bea1","鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡"],
["bf40","濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊"],
["bfa1","縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚"],
["c040","錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇"],
["c0a1","嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬"],
["c140","瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪"],
["c1a1","薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁"],
["c240","駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘"],
["c2a1","癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦"],
["c340","鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"],
["c3a1","獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類"],
["c440","願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼"],
["c4a1","纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴"],
["c540","護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬"],
["c5a1","禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒"],
["c640","讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲"],
["c940","乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕"],
["c9a1","氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋"],
["ca40","汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘"],
["caa1","吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇"],
["cb40","杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓"],
["cba1","芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢"],
["cc40","坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋"],
["cca1","怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲"],
["cd40","泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺"],
["cda1","矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏"],
["ce40","哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛"],
["cea1","峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺"],
["cf40","柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂"],
["cfa1","洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀"],
["d040","穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪"],
["d0a1","苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱"],
["d140","唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧"],
["d1a1","恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤"],
["d240","毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸"],
["d2a1","牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐"],
["d340","笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢"],
["d3a1","荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐"],
["d440","酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅"],
["d4a1","唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏"],
["d540","崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟"],
["d5a1","捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉"],
["d640","淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏"],
["d6a1","痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟"],
["d740","耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷"],
["d7a1","蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪"],
["d840","釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷"],
["d8a1","堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔"],
["d940","惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒"],
["d9a1","晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞"],
["da40","湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖"],
["daa1","琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥"],
["db40","罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳"],
["dba1","菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺"],
["dc40","軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈"],
["dca1","隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆"],
["dd40","媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤"],
["dda1","搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼"],
["de40","毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓"],
["dea1","煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓"],
["df40","稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯"],
["dfa1","腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤"],
["e040","觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿"],
["e0a1","遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠"],
["e140","凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠"],
["e1a1","寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉"],
["e240","榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊"],
["e2a1","漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓"],
["e340","禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞"],
["e3a1","耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻"],
["e440","裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍"],
["e4a1","銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘"],
["e540","噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉"],
["e5a1","憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒"],
["e640","澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙"],
["e6a1","獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟"],
["e740","膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢"],
["e7a1","蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧"],
["e840","踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓"],
["e8a1","銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮"],
["e940","噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺"],
["e9a1","憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸"],
["ea40","澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙"],
["eaa1","瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘"],
["eb40","蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠"],
["eba1","諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌"],
["ec40","錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕"],
["eca1","魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎"],
["ed40","檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶"],
["eda1","瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞"],
["ee40","蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞"],
["eea1","謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜"],
["ef40","鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰"],
["efa1","鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶"],
["f040","璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒"],
["f0a1","臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧"],
["f140","蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪"],
["f1a1","鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰"],
["f240","徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛"],
["f2a1","礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕"],
["f340","譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦"],
["f3a1","鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲"],
["f440","嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩"],
["f4a1","禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿"],
["f540","鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛"],
["f5a1","鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥"],
["f640","蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺"],
["f6a1","騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚"],
["f740","糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊"],
["f7a1","驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾"],
["f840","讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏"],
["f8a1","齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚"],
["f940","纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊"],
["f9a1","龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓"]
]

},{}],149:[function(require,module,exports){
module.exports=[
["0","\u0000",127],
["8ea1","｡",62],
["a1a1","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇"],
["a2a1","◆□■△▲▽▼※〒→←↑↓〓"],
["a2ba","∈∋⊆⊇⊂⊃∪∩"],
["a2ca","∧∨￢⇒⇔∀∃"],
["a2dc","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],
["a2f2","Å‰♯♭♪†‡¶"],
["a2fe","◯"],
["a3b0","０",9],
["a3c1","Ａ",25],
["a3e1","ａ",25],
["a4a1","ぁ",82],
["a5a1","ァ",85],
["a6a1","Α",16,"Σ",6],
["a6c1","α",16,"σ",6],
["a7a1","А",5,"ЁЖ",25],
["a7d1","а",5,"ёж",25],
["a8a1","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],
["ada1","①",19,"Ⅰ",9],
["adc0","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],
["addf","㍻〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],
["b0a1","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],
["b1a1","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応"],
["b2a1","押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],
["b3a1","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱"],
["b4a1","粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],
["b5a1","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京"],
["b6a1","供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],
["b7a1","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲"],
["b8a1","検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],
["b9a1","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込"],
["baa1","此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],
["bba1","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時"],
["bca1","次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],
["bda1","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償"],
["bea1","勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],
["bfa1","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾"],
["c0a1","澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],
["c1a1","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎"],
["c2a1","臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],
["c3a1","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵"],
["c4a1","帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],
["c5a1","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到"],
["c6a1","董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],
["c7a1","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦"],
["c8a1","函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],
["c9a1","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服"],
["caa1","福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],
["cba1","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満"],
["cca1","漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],
["cda1","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃"],
["cea1","痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],
["cfa1","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],
["d0a1","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],
["d1a1","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨"],
["d2a1","辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],
["d3a1","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉"],
["d4a1","圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],
["d5a1","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓"],
["d6a1","屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],
["d7a1","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚"],
["d8a1","悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],
["d9a1","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼"],
["daa1","據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],
["dba1","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍"],
["dca1","棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],
["dda1","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾"],
["dea1","沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],
["dfa1","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼"],
["e0a1","燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],
["e1a1","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰"],
["e2a1","癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],
["e3a1","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐"],
["e4a1","筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],
["e5a1","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺"],
["e6a1","罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],
["e7a1","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙"],
["e8a1","茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],
["e9a1","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙"],
["eaa1","蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],
["eba1","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫"],
["eca1","譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],
["eda1","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸"],
["eea1","遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],
["efa1","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞"],
["f0a1","陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],
["f1a1","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷"],
["f2a1","髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],
["f3a1","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠"],
["f4a1","堯槇遙瑤凜熙"],
["f9a1","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德"],
["faa1","忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],
["fba1","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚"],
["fca1","釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],
["fcf1","ⅰ",9,"￢￤＇＂"],
["8fa2af","˘ˇ¸˙˝¯˛˚～΄΅"],
["8fa2c2","¡¦¿"],
["8fa2eb","ºª©®™¤№"],
["8fa6e1","ΆΈΉΊΪ"],
["8fa6e7","Ό"],
["8fa6e9","ΎΫ"],
["8fa6ec","Ώ"],
["8fa6f1","άέήίϊΐόςύϋΰώ"],
["8fa7c2","Ђ",10,"ЎЏ"],
["8fa7f2","ђ",10,"ўџ"],
["8fa9a1","ÆĐ"],
["8fa9a4","Ħ"],
["8fa9a6","Ĳ"],
["8fa9a8","ŁĿ"],
["8fa9ab","ŊØŒ"],
["8fa9af","ŦÞ"],
["8fa9c1","æđðħıĳĸłŀŉŋøœßŧþ"],
["8faaa1","ÁÀÄÂĂǍĀĄÅÃĆĈČÇĊĎÉÈËÊĚĖĒĘ"],
["8faaba","ĜĞĢĠĤÍÌÏÎǏİĪĮĨĴĶĹĽĻŃŇŅÑÓÒÖÔǑŐŌÕŔŘŖŚŜŠŞŤŢÚÙÜÛŬǓŰŪŲŮŨǗǛǙǕŴÝŸŶŹŽŻ"],
["8faba1","áàäâăǎāąåãćĉčçċďéèëêěėēęǵĝğ"],
["8fabbd","ġĥíìïîǐ"],
["8fabc5","īįĩĵķĺľļńňņñóòöôǒőōõŕřŗśŝšşťţúùüûŭǔűūųůũǘǜǚǖŵýÿŷźžż"],
["8fb0a1","丂丄丅丌丒丟丣两丨丫丮丯丰丵乀乁乄乇乑乚乜乣乨乩乴乵乹乿亍亖亗亝亯亹仃仐仚仛仠仡仢仨仯仱仳仵份仾仿伀伂伃伈伋伌伒伕伖众伙伮伱你伳伵伷伹伻伾佀佂佈佉佋佌佒佔佖佘佟佣佪佬佮佱佷佸佹佺佽佾侁侂侄"],
["8fb1a1","侅侉侊侌侎侐侒侓侔侗侙侚侞侟侲侷侹侻侼侽侾俀俁俅俆俈俉俋俌俍俏俒俜俠俢俰俲俼俽俿倀倁倄倇倊倌倎倐倓倗倘倛倜倝倞倢倧倮倰倲倳倵偀偁偂偅偆偊偌偎偑偒偓偗偙偟偠偢偣偦偧偪偭偰偱倻傁傃傄傆傊傎傏傐"],
["8fb2a1","傒傓傔傖傛傜傞",4,"傪傯傰傹傺傽僀僃僄僇僌僎僐僓僔僘僜僝僟僢僤僦僨僩僯僱僶僺僾儃儆儇儈儋儌儍儎僲儐儗儙儛儜儝儞儣儧儨儬儭儯儱儳儴儵儸儹兂兊兏兓兕兗兘兟兤兦兾冃冄冋冎冘冝冡冣冭冸冺冼冾冿凂"],
["8fb3a1","凈减凑凒凓凕凘凞凢凥凮凲凳凴凷刁刂刅划刓刕刖刘刢刨刱刲刵刼剅剉剕剗剘剚剜剟剠剡剦剮剷剸剹劀劂劅劊劌劓劕劖劗劘劚劜劤劥劦劧劯劰劶劷劸劺劻劽勀勄勆勈勌勏勑勔勖勛勜勡勥勨勩勪勬勰勱勴勶勷匀匃匊匋"],
["8fb4a1","匌匑匓匘匛匜匞匟匥匧匨匩匫匬匭匰匲匵匼匽匾卂卌卋卙卛卡卣卥卬卭卲卹卾厃厇厈厎厓厔厙厝厡厤厪厫厯厲厴厵厷厸厺厽叀叅叏叒叓叕叚叝叞叠另叧叵吂吓吚吡吧吨吪启吱吴吵呃呄呇呍呏呞呢呤呦呧呩呫呭呮呴呿"],
["8fb5a1","咁咃咅咈咉咍咑咕咖咜咟咡咦咧咩咪咭咮咱咷咹咺咻咿哆哊响哎哠哪哬哯哶哼哾哿唀唁唅唈唉唌唍唎唕唪唫唲唵唶唻唼唽啁啇啉啊啍啐啑啘啚啛啞啠啡啤啦啿喁喂喆喈喎喏喑喒喓喔喗喣喤喭喲喿嗁嗃嗆嗉嗋嗌嗎嗑嗒"],
["8fb6a1","嗓嗗嗘嗛嗞嗢嗩嗶嗿嘅嘈嘊嘍",5,"嘙嘬嘰嘳嘵嘷嘹嘻嘼嘽嘿噀噁噃噄噆噉噋噍噏噔噞噠噡噢噣噦噩噭噯噱噲噵嚄嚅嚈嚋嚌嚕嚙嚚嚝嚞嚟嚦嚧嚨嚩嚫嚬嚭嚱嚳嚷嚾囅囉囊囋囏囐囌囍囙囜囝囟囡囤",4,"囱囫园"],
["8fb7a1","囶囷圁圂圇圊圌圑圕圚圛圝圠圢圣圤圥圩圪圬圮圯圳圴圽圾圿坅坆坌坍坒坢坥坧坨坫坭",4,"坳坴坵坷坹坺坻坼坾垁垃垌垔垗垙垚垜垝垞垟垡垕垧垨垩垬垸垽埇埈埌埏埕埝埞埤埦埧埩埭埰埵埶埸埽埾埿堃堄堈堉埡"],
["8fb8a1","堌堍堛堞堟堠堦堧堭堲堹堿塉塌塍塏塐塕塟塡塤塧塨塸塼塿墀墁墇墈墉墊墌墍墏墐墔墖墝墠墡墢墦墩墱墲壄墼壂壈壍壎壐壒壔壖壚壝壡壢壩壳夅夆夋夌夒夓夔虁夝夡夣夤夨夯夰夳夵夶夿奃奆奒奓奙奛奝奞奟奡奣奫奭"],
["8fb9a1","奯奲奵奶她奻奼妋妌妎妒妕妗妟妤妧妭妮妯妰妳妷妺妼姁姃姄姈姊姍姒姝姞姟姣姤姧姮姯姱姲姴姷娀娄娌娍娎娒娓娞娣娤娧娨娪娭娰婄婅婇婈婌婐婕婞婣婥婧婭婷婺婻婾媋媐媓媖媙媜媞媟媠媢媧媬媱媲媳媵媸媺媻媿"],
["8fbaa1","嫄嫆嫈嫏嫚嫜嫠嫥嫪嫮嫵嫶嫽嬀嬁嬈嬗嬴嬙嬛嬝嬡嬥嬭嬸孁孋孌孒孖孞孨孮孯孼孽孾孿宁宄宆宊宎宐宑宓宔宖宨宩宬宭宯宱宲宷宺宼寀寁寍寏寖",4,"寠寯寱寴寽尌尗尞尟尣尦尩尫尬尮尰尲尵尶屙屚屜屢屣屧屨屩"],
["8fbba1","屭屰屴屵屺屻屼屽岇岈岊岏岒岝岟岠岢岣岦岪岲岴岵岺峉峋峒峝峗峮峱峲峴崁崆崍崒崫崣崤崦崧崱崴崹崽崿嵂嵃嵆嵈嵕嵑嵙嵊嵟嵠嵡嵢嵤嵪嵭嵰嵹嵺嵾嵿嶁嶃嶈嶊嶒嶓嶔嶕嶙嶛嶟嶠嶧嶫嶰嶴嶸嶹巃巇巋巐巎巘巙巠巤"],
["8fbca1","巩巸巹帀帇帍帒帔帕帘帟帠帮帨帲帵帾幋幐幉幑幖幘幛幜幞幨幪",4,"幰庀庋庎庢庤庥庨庪庬庱庳庽庾庿廆廌廋廎廑廒廔廕廜廞廥廫异弆弇弈弎弙弜弝弡弢弣弤弨弫弬弮弰弴弶弻弽弿彀彄彅彇彍彐彔彘彛彠彣彤彧"],
["8fbda1","彯彲彴彵彸彺彽彾徉徍徏徖徜徝徢徧徫徤徬徯徰徱徸忄忇忈忉忋忐",4,"忞忡忢忨忩忪忬忭忮忯忲忳忶忺忼怇怊怍怓怔怗怘怚怟怤怭怳怵恀恇恈恉恌恑恔恖恗恝恡恧恱恾恿悂悆悈悊悎悑悓悕悘悝悞悢悤悥您悰悱悷"],
["8fbea1","悻悾惂惄惈惉惊惋惎惏惔惕惙惛惝惞惢惥惲惵惸惼惽愂愇愊愌愐",4,"愖愗愙愜愞愢愪愫愰愱愵愶愷愹慁慅慆慉慞慠慬慲慸慻慼慿憀憁憃憄憋憍憒憓憗憘憜憝憟憠憥憨憪憭憸憹憼懀懁懂懎懏懕懜懝懞懟懡懢懧懩懥"],
["8fbfa1","懬懭懯戁戃戄戇戓戕戜戠戢戣戧戩戫戹戽扂扃扄扆扌扐扑扒扔扖扚扜扤扭扯扳扺扽抍抎抏抐抦抨抳抶抷抺抾抿拄拎拕拖拚拪拲拴拼拽挃挄挊挋挍挐挓挖挘挩挪挭挵挶挹挼捁捂捃捄捆捊捋捎捒捓捔捘捛捥捦捬捭捱捴捵"],
["8fc0a1","捸捼捽捿掂掄掇掊掐掔掕掙掚掞掤掦掭掮掯掽揁揅揈揎揑揓揔揕揜揠揥揪揬揲揳揵揸揹搉搊搐搒搔搘搞搠搢搤搥搩搪搯搰搵搽搿摋摏摑摒摓摔摚摛摜摝摟摠摡摣摭摳摴摻摽撅撇撏撐撑撘撙撛撝撟撡撣撦撨撬撳撽撾撿"],
["8fc1a1","擄擉擊擋擌擎擐擑擕擗擤擥擩擪擭擰擵擷擻擿攁攄攈攉攊攏攓攔攖攙攛攞攟攢攦攩攮攱攺攼攽敃敇敉敐敒敔敟敠敧敫敺敽斁斅斊斒斕斘斝斠斣斦斮斲斳斴斿旂旈旉旎旐旔旖旘旟旰旲旴旵旹旾旿昀昄昈昉昍昑昒昕昖昝"],
["8fc2a1","昞昡昢昣昤昦昩昪昫昬昮昰昱昳昹昷晀晅晆晊晌晑晎晗晘晙晛晜晠晡曻晪晫晬晾晳晵晿晷晸晹晻暀晼暋暌暍暐暒暙暚暛暜暟暠暤暭暱暲暵暻暿曀曂曃曈曌曎曏曔曛曟曨曫曬曮曺朅朇朎朓朙朜朠朢朳朾杅杇杈杌杔杕杝"],
["8fc3a1","杦杬杮杴杶杻极构枎枏枑枓枖枘枙枛枰枱枲枵枻枼枽柹柀柂柃柅柈柉柒柗柙柜柡柦柰柲柶柷桒栔栙栝栟栨栧栬栭栯栰栱栳栻栿桄桅桊桌桕桗桘桛桫桮",4,"桵桹桺桻桼梂梄梆梈梖梘梚梜梡梣梥梩梪梮梲梻棅棈棌棏"],
["8fc4a1","棐棑棓棖棙棜棝棥棨棪棫棬棭棰棱棵棶棻棼棽椆椉椊椐椑椓椖椗椱椳椵椸椻楂楅楉楎楗楛楣楤楥楦楨楩楬楰楱楲楺楻楿榀榍榒榖榘榡榥榦榨榫榭榯榷榸榺榼槅槈槑槖槗槢槥槮槯槱槳槵槾樀樁樃樏樑樕樚樝樠樤樨樰樲"],
["8fc5a1","樴樷樻樾樿橅橆橉橊橎橐橑橒橕橖橛橤橧橪橱橳橾檁檃檆檇檉檋檑檛檝檞檟檥檫檯檰檱檴檽檾檿櫆櫉櫈櫌櫐櫔櫕櫖櫜櫝櫤櫧櫬櫰櫱櫲櫼櫽欂欃欆欇欉欏欐欑欗欛欞欤欨欫欬欯欵欶欻欿歆歊歍歒歖歘歝歠歧歫歮歰歵歽"],
["8fc6a1","歾殂殅殗殛殟殠殢殣殨殩殬殭殮殰殸殹殽殾毃毄毉毌毖毚毡毣毦毧毮毱毷毹毿氂氄氅氉氍氎氐氒氙氟氦氧氨氬氮氳氵氶氺氻氿汊汋汍汏汒汔汙汛汜汫汭汯汴汶汸汹汻沅沆沇沉沔沕沗沘沜沟沰沲沴泂泆泍泏泐泑泒泔泖"],
["8fc7a1","泚泜泠泧泩泫泬泮泲泴洄洇洊洎洏洑洓洚洦洧洨汧洮洯洱洹洼洿浗浞浟浡浥浧浯浰浼涂涇涑涒涔涖涗涘涪涬涴涷涹涽涿淄淈淊淎淏淖淛淝淟淠淢淥淩淯淰淴淶淼渀渄渞渢渧渲渶渹渻渼湄湅湈湉湋湏湑湒湓湔湗湜湝湞"],
["8fc8a1","湢湣湨湳湻湽溍溓溙溠溧溭溮溱溳溻溿滀滁滃滇滈滊滍滎滏滫滭滮滹滻滽漄漈漊漌漍漖漘漚漛漦漩漪漯漰漳漶漻漼漭潏潑潒潓潗潙潚潝潞潡潢潨潬潽潾澃澇澈澋澌澍澐澒澓澔澖澚澟澠澥澦澧澨澮澯澰澵澶澼濅濇濈濊"],
["8fc9a1","濚濞濨濩濰濵濹濼濽瀀瀅瀆瀇瀍瀗瀠瀣瀯瀴瀷瀹瀼灃灄灈灉灊灋灔灕灝灞灎灤灥灬灮灵灶灾炁炅炆炔",4,"炛炤炫炰炱炴炷烊烑烓烔烕烖烘烜烤烺焃",4,"焋焌焏焞焠焫焭焯焰焱焸煁煅煆煇煊煋煐煒煗煚煜煞煠"],
["8fcaa1","煨煹熀熅熇熌熒熚熛熠熢熯熰熲熳熺熿燀燁燄燋燌燓燖燙燚燜燸燾爀爇爈爉爓爗爚爝爟爤爫爯爴爸爹牁牂牃牅牎牏牐牓牕牖牚牜牞牠牣牨牫牮牯牱牷牸牻牼牿犄犉犍犎犓犛犨犭犮犱犴犾狁狇狉狌狕狖狘狟狥狳狴狺狻"],
["8fcba1","狾猂猄猅猇猋猍猒猓猘猙猞猢猤猧猨猬猱猲猵猺猻猽獃獍獐獒獖獘獝獞獟獠獦獧獩獫獬獮獯獱獷獹獼玀玁玃玅玆玎玐玓玕玗玘玜玞玟玠玢玥玦玪玫玭玵玷玹玼玽玿珅珆珉珋珌珏珒珓珖珙珝珡珣珦珧珩珴珵珷珹珺珻珽"],
["8fcca1","珿琀琁琄琇琊琑琚琛琤琦琨",9,"琹瑀瑃瑄瑆瑇瑋瑍瑑瑒瑗瑝瑢瑦瑧瑨瑫瑭瑮瑱瑲璀璁璅璆璇璉璏璐璑璒璘璙璚璜璟璠璡璣璦璨璩璪璫璮璯璱璲璵璹璻璿瓈瓉瓌瓐瓓瓘瓚瓛瓞瓟瓤瓨瓪瓫瓯瓴瓺瓻瓼瓿甆"],
["8fcda1","甒甖甗甠甡甤甧甩甪甯甶甹甽甾甿畀畃畇畈畎畐畒畗畞畟畡畯畱畹",5,"疁疅疐疒疓疕疙疜疢疤疴疺疿痀痁痄痆痌痎痏痗痜痟痠痡痤痧痬痮痯痱痹瘀瘂瘃瘄瘇瘈瘊瘌瘏瘒瘓瘕瘖瘙瘛瘜瘝瘞瘣瘥瘦瘩瘭瘲瘳瘵瘸瘹"],
["8fcea1","瘺瘼癊癀癁癃癄癅癉癋癕癙癟癤癥癭癮癯癱癴皁皅皌皍皕皛皜皝皟皠皢",6,"皪皭皽盁盅盉盋盌盎盔盙盠盦盨盬盰盱盶盹盼眀眆眊眎眒眔眕眗眙眚眜眢眨眭眮眯眴眵眶眹眽眾睂睅睆睊睍睎睏睒睖睗睜睞睟睠睢"],
["8fcfa1","睤睧睪睬睰睲睳睴睺睽瞀瞄瞌瞍瞔瞕瞖瞚瞟瞢瞧瞪瞮瞯瞱瞵瞾矃矉矑矒矕矙矞矟矠矤矦矪矬矰矱矴矸矻砅砆砉砍砎砑砝砡砢砣砭砮砰砵砷硃硄硇硈硌硎硒硜硞硠硡硣硤硨硪确硺硾碊碏碔碘碡碝碞碟碤碨碬碭碰碱碲碳"],
["8fd0a1","碻碽碿磇磈磉磌磎磒磓磕磖磤磛磟磠磡磦磪磲磳礀磶磷磺磻磿礆礌礐礚礜礞礟礠礥礧礩礭礱礴礵礻礽礿祄祅祆祊祋祏祑祔祘祛祜祧祩祫祲祹祻祼祾禋禌禑禓禔禕禖禘禛禜禡禨禩禫禯禱禴禸离秂秄秇秈秊秏秔秖秚秝秞"],
["8fd1a1","秠秢秥秪秫秭秱秸秼稂稃稇稉稊稌稑稕稛稞稡稧稫稭稯稰稴稵稸稹稺穄穅穇穈穌穕穖穙穜穝穟穠穥穧穪穭穵穸穾窀窂窅窆窊窋窐窑窔窞窠窣窬窳窵窹窻窼竆竉竌竎竑竛竨竩竫竬竱竴竻竽竾笇笔笟笣笧笩笪笫笭笮笯笰"],
["8fd2a1","笱笴笽笿筀筁筇筎筕筠筤筦筩筪筭筯筲筳筷箄箉箎箐箑箖箛箞箠箥箬箯箰箲箵箶箺箻箼箽篂篅篈篊篔篖篗篙篚篛篨篪篲篴篵篸篹篺篼篾簁簂簃簄簆簉簋簌簎簏簙簛簠簥簦簨簬簱簳簴簶簹簺籆籊籕籑籒籓籙",5],
["8fd3a1","籡籣籧籩籭籮籰籲籹籼籽粆粇粏粔粞粠粦粰粶粷粺粻粼粿糄糇糈糉糍糏糓糔糕糗糙糚糝糦糩糫糵紃紇紈紉紏紑紒紓紖紝紞紣紦紪紭紱紼紽紾絀絁絇絈絍絑絓絗絙絚絜絝絥絧絪絰絸絺絻絿綁綂綃綅綆綈綋綌綍綑綖綗綝"],
["8fd4a1","綞綦綧綪綳綶綷綹緂",4,"緌緍緎緗緙縀緢緥緦緪緫緭緱緵緶緹緺縈縐縑縕縗縜縝縠縧縨縬縭縯縳縶縿繄繅繇繎繐繒繘繟繡繢繥繫繮繯繳繸繾纁纆纇纊纍纑纕纘纚纝纞缼缻缽缾缿罃罄罇罏罒罓罛罜罝罡罣罤罥罦罭"],
["8fd5a1","罱罽罾罿羀羋羍羏羐羑羖羗羜羡羢羦羪羭羴羼羿翀翃翈翎翏翛翟翣翥翨翬翮翯翲翺翽翾翿耇耈耊耍耎耏耑耓耔耖耝耞耟耠耤耦耬耮耰耴耵耷耹耺耼耾聀聄聠聤聦聭聱聵肁肈肎肜肞肦肧肫肸肹胈胍胏胒胔胕胗胘胠胭胮"],
["8fd6a1","胰胲胳胶胹胺胾脃脋脖脗脘脜脞脠脤脧脬脰脵脺脼腅腇腊腌腒腗腠腡腧腨腩腭腯腷膁膐膄膅膆膋膎膖膘膛膞膢膮膲膴膻臋臃臅臊臎臏臕臗臛臝臞臡臤臫臬臰臱臲臵臶臸臹臽臿舀舃舏舓舔舙舚舝舡舢舨舲舴舺艃艄艅艆"],
["8fd7a1","艋艎艏艑艖艜艠艣艧艭艴艻艽艿芀芁芃芄芇芉芊芎芑芔芖芘芚芛芠芡芣芤芧芨芩芪芮芰芲芴芷芺芼芾芿苆苐苕苚苠苢苤苨苪苭苯苶苷苽苾茀茁茇茈茊茋荔茛茝茞茟茡茢茬茭茮茰茳茷茺茼茽荂荃荄荇荍荎荑荕荖荗荰荸"],
["8fd8a1","荽荿莀莂莄莆莍莒莔莕莘莙莛莜莝莦莧莩莬莾莿菀菇菉菏菐菑菔菝荓菨菪菶菸菹菼萁萆萊萏萑萕萙莭萯萹葅葇葈葊葍葏葑葒葖葘葙葚葜葠葤葥葧葪葰葳葴葶葸葼葽蒁蒅蒒蒓蒕蒞蒦蒨蒩蒪蒯蒱蒴蒺蒽蒾蓀蓂蓇蓈蓌蓏蓓"],
["8fd9a1","蓜蓧蓪蓯蓰蓱蓲蓷蔲蓺蓻蓽蔂蔃蔇蔌蔎蔐蔜蔞蔢蔣蔤蔥蔧蔪蔫蔯蔳蔴蔶蔿蕆蕏",4,"蕖蕙蕜",6,"蕤蕫蕯蕹蕺蕻蕽蕿薁薅薆薉薋薌薏薓薘薝薟薠薢薥薧薴薶薷薸薼薽薾薿藂藇藊藋藎薭藘藚藟藠藦藨藭藳藶藼"],
["8fdaa1","藿蘀蘄蘅蘍蘎蘐蘑蘒蘘蘙蘛蘞蘡蘧蘩蘶蘸蘺蘼蘽虀虂虆虒虓虖虗虘虙虝虠",4,"虩虬虯虵虶虷虺蚍蚑蚖蚘蚚蚜蚡蚦蚧蚨蚭蚱蚳蚴蚵蚷蚸蚹蚿蛀蛁蛃蛅蛑蛒蛕蛗蛚蛜蛠蛣蛥蛧蚈蛺蛼蛽蜄蜅蜇蜋蜎蜏蜐蜓蜔蜙蜞蜟蜡蜣"],
["8fdba1","蜨蜮蜯蜱蜲蜹蜺蜼蜽蜾蝀蝃蝅蝍蝘蝝蝡蝤蝥蝯蝱蝲蝻螃",6,"螋螌螐螓螕螗螘螙螞螠螣螧螬螭螮螱螵螾螿蟁蟈蟉蟊蟎蟕蟖蟙蟚蟜蟟蟢蟣蟤蟪蟫蟭蟱蟳蟸蟺蟿蠁蠃蠆蠉蠊蠋蠐蠙蠒蠓蠔蠘蠚蠛蠜蠞蠟蠨蠭蠮蠰蠲蠵"],
["8fdca1","蠺蠼衁衃衅衈衉衊衋衎衑衕衖衘衚衜衟衠衤衩衱衹衻袀袘袚袛袜袟袠袨袪袺袽袾裀裊",4,"裑裒裓裛裞裧裯裰裱裵裷褁褆褍褎褏褕褖褘褙褚褜褠褦褧褨褰褱褲褵褹褺褾襀襂襅襆襉襏襒襗襚襛襜襡襢襣襫襮襰襳襵襺"],
["8fdda1","襻襼襽覉覍覐覔覕覛覜覟覠覥覰覴覵覶覷覼觔",4,"觥觩觫觭觱觳觶觹觽觿訄訅訇訏訑訒訔訕訞訠訢訤訦訫訬訯訵訷訽訾詀詃詅詇詉詍詎詓詖詗詘詜詝詡詥詧詵詶詷詹詺詻詾詿誀誃誆誋誏誐誒誖誗誙誟誧誩誮誯誳"],
["8fdea1","誶誷誻誾諃諆諈諉諊諑諓諔諕諗諝諟諬諰諴諵諶諼諿謅謆謋謑謜謞謟謊謭謰謷謼譂",4,"譈譒譓譔譙譍譞譣譭譶譸譹譼譾讁讄讅讋讍讏讔讕讜讞讟谸谹谽谾豅豇豉豋豏豑豓豔豗豘豛豝豙豣豤豦豨豩豭豳豵豶豻豾貆"],
["8fdfa1","貇貋貐貒貓貙貛貜貤貹貺賅賆賉賋賏賖賕賙賝賡賨賬賯賰賲賵賷賸賾賿贁贃贉贒贗贛赥赩赬赮赿趂趄趈趍趐趑趕趞趟趠趦趫趬趯趲趵趷趹趻跀跅跆跇跈跊跎跑跔跕跗跙跤跥跧跬跰趼跱跲跴跽踁踄踅踆踋踑踔踖踠踡踢"],
["8fe0a1","踣踦踧踱踳踶踷踸踹踽蹀蹁蹋蹍蹎蹏蹔蹛蹜蹝蹞蹡蹢蹩蹬蹭蹯蹰蹱蹹蹺蹻躂躃躉躐躒躕躚躛躝躞躢躧躩躭躮躳躵躺躻軀軁軃軄軇軏軑軔軜軨軮軰軱軷軹軺軭輀輂輇輈輏輐輖輗輘輞輠輡輣輥輧輨輬輭輮輴輵輶輷輺轀轁"],
["8fe1a1","轃轇轏轑",4,"轘轝轞轥辝辠辡辤辥辦辵辶辸达迀迁迆迊迋迍运迒迓迕迠迣迤迨迮迱迵迶迻迾适逄逈逌逘逛逨逩逯逪逬逭逳逴逷逿遃遄遌遛遝遢遦遧遬遰遴遹邅邈邋邌邎邐邕邗邘邙邛邠邡邢邥邰邲邳邴邶邽郌邾郃"],
["8fe2a1","郄郅郇郈郕郗郘郙郜郝郟郥郒郶郫郯郰郴郾郿鄀鄄鄅鄆鄈鄍鄐鄔鄖鄗鄘鄚鄜鄞鄠鄥鄢鄣鄧鄩鄮鄯鄱鄴鄶鄷鄹鄺鄼鄽酃酇酈酏酓酗酙酚酛酡酤酧酭酴酹酺酻醁醃醅醆醊醎醑醓醔醕醘醞醡醦醨醬醭醮醰醱醲醳醶醻醼醽醿"],
["8fe3a1","釂釃釅釓釔釗釙釚釞釤釥釩釪釬",5,"釷釹釻釽鈀鈁鈄鈅鈆鈇鈉鈊鈌鈐鈒鈓鈖鈘鈜鈝鈣鈤鈥鈦鈨鈮鈯鈰鈳鈵鈶鈸鈹鈺鈼鈾鉀鉂鉃鉆鉇鉊鉍鉎鉏鉑鉘鉙鉜鉝鉠鉡鉥鉧鉨鉩鉮鉯鉰鉵",4,"鉻鉼鉽鉿銈銉銊銍銎銒銗"],
["8fe4a1","銙銟銠銤銥銧銨銫銯銲銶銸銺銻銼銽銿",4,"鋅鋆鋇鋈鋋鋌鋍鋎鋐鋓鋕鋗鋘鋙鋜鋝鋟鋠鋡鋣鋥鋧鋨鋬鋮鋰鋹鋻鋿錀錂錈錍錑錔錕錜錝錞錟錡錤錥錧錩錪錳錴錶錷鍇鍈鍉鍐鍑鍒鍕鍗鍘鍚鍞鍤鍥鍧鍩鍪鍭鍯鍰鍱鍳鍴鍶"],
["8fe5a1","鍺鍽鍿鎀鎁鎂鎈鎊鎋鎍鎏鎒鎕鎘鎛鎞鎡鎣鎤鎦鎨鎫鎴鎵鎶鎺鎩鏁鏄鏅鏆鏇鏉",4,"鏓鏙鏜鏞鏟鏢鏦鏧鏹鏷鏸鏺鏻鏽鐁鐂鐄鐈鐉鐍鐎鐏鐕鐖鐗鐟鐮鐯鐱鐲鐳鐴鐻鐿鐽鑃鑅鑈鑊鑌鑕鑙鑜鑟鑡鑣鑨鑫鑭鑮鑯鑱鑲钄钃镸镹"],
["8fe6a1","镾閄閈閌閍閎閝閞閟閡閦閩閫閬閴閶閺閽閿闆闈闉闋闐闑闒闓闙闚闝闞闟闠闤闦阝阞阢阤阥阦阬阱阳阷阸阹阺阼阽陁陒陔陖陗陘陡陮陴陻陼陾陿隁隂隃隄隉隑隖隚隝隟隤隥隦隩隮隯隳隺雊雒嶲雘雚雝雞雟雩雯雱雺霂"],
["8fe7a1","霃霅霉霚霛霝霡霢霣霨霱霳靁靃靊靎靏靕靗靘靚靛靣靧靪靮靳靶靷靸靻靽靿鞀鞉鞕鞖鞗鞙鞚鞞鞟鞢鞬鞮鞱鞲鞵鞶鞸鞹鞺鞼鞾鞿韁韄韅韇韉韊韌韍韎韐韑韔韗韘韙韝韞韠韛韡韤韯韱韴韷韸韺頇頊頙頍頎頔頖頜頞頠頣頦"],
["8fe8a1","頫頮頯頰頲頳頵頥頾顄顇顊顑顒顓顖顗顙顚顢顣顥顦顪顬颫颭颮颰颴颷颸颺颻颿飂飅飈飌飡飣飥飦飧飪飳飶餂餇餈餑餕餖餗餚餛餜餟餢餦餧餫餱",4,"餹餺餻餼饀饁饆饇饈饍饎饔饘饙饛饜饞饟饠馛馝馟馦馰馱馲馵"],
["8fe9a1","馹馺馽馿駃駉駓駔駙駚駜駞駧駪駫駬駰駴駵駹駽駾騂騃騄騋騌騐騑騖騞騠騢騣騤騧騭騮騳騵騶騸驇驁驄驊驋驌驎驑驔驖驝骪骬骮骯骲骴骵骶骹骻骾骿髁髃髆髈髎髐髒髕髖髗髛髜髠髤髥髧髩髬髲髳髵髹髺髽髿",4],
["8feaa1","鬄鬅鬈鬉鬋鬌鬍鬎鬐鬒鬖鬙鬛鬜鬠鬦鬫鬭鬳鬴鬵鬷鬹鬺鬽魈魋魌魕魖魗魛魞魡魣魥魦魨魪",4,"魳魵魷魸魹魿鮀鮄鮅鮆鮇鮉鮊鮋鮍鮏鮐鮔鮚鮝鮞鮦鮧鮩鮬鮰鮱鮲鮷鮸鮻鮼鮾鮿鯁鯇鯈鯎鯐鯗鯘鯝鯟鯥鯧鯪鯫鯯鯳鯷鯸"],
["8feba1","鯹鯺鯽鯿鰀鰂鰋鰏鰑鰖鰘鰙鰚鰜鰞鰢鰣鰦",4,"鰱鰵鰶鰷鰽鱁鱃鱄鱅鱉鱊鱎鱏鱐鱓鱔鱖鱘鱛鱝鱞鱟鱣鱩鱪鱜鱫鱨鱮鱰鱲鱵鱷鱻鳦鳲鳷鳹鴋鴂鴑鴗鴘鴜鴝鴞鴯鴰鴲鴳鴴鴺鴼鵅鴽鵂鵃鵇鵊鵓鵔鵟鵣鵢鵥鵩鵪鵫鵰鵶鵷鵻"],
["8feca1","鵼鵾鶃鶄鶆鶊鶍鶎鶒鶓鶕鶖鶗鶘鶡鶪鶬鶮鶱鶵鶹鶼鶿鷃鷇鷉鷊鷔鷕鷖鷗鷚鷞鷟鷠鷥鷧鷩鷫鷮鷰鷳鷴鷾鸊鸂鸇鸎鸐鸑鸒鸕鸖鸙鸜鸝鹺鹻鹼麀麂麃麄麅麇麎麏麖麘麛麞麤麨麬麮麯麰麳麴麵黆黈黋黕黟黤黧黬黭黮黰黱黲黵"],
["8feda1","黸黿鼂鼃鼉鼏鼐鼑鼒鼔鼖鼗鼙鼚鼛鼟鼢鼦鼪鼫鼯鼱鼲鼴鼷鼹鼺鼼鼽鼿齁齃",4,"齓齕齖齗齘齚齝齞齨齩齭",4,"齳齵齺齽龏龐龑龒龔龖龗龞龡龢龣龥"]
]

},{}],150:[function(require,module,exports){
module.exports={"uChars":[128,165,169,178,184,216,226,235,238,244,248,251,253,258,276,284,300,325,329,334,364,463,465,467,469,471,473,475,477,506,594,610,712,716,730,930,938,962,970,1026,1104,1106,8209,8215,8218,8222,8231,8241,8244,8246,8252,8365,8452,8454,8458,8471,8482,8556,8570,8596,8602,8713,8720,8722,8726,8731,8737,8740,8742,8748,8751,8760,8766,8777,8781,8787,8802,8808,8816,8854,8858,8870,8896,8979,9322,9372,9548,9588,9616,9622,9634,9652,9662,9672,9676,9680,9702,9735,9738,9793,9795,11906,11909,11913,11917,11928,11944,11947,11951,11956,11960,11964,11979,12284,12292,12312,12319,12330,12351,12436,12447,12535,12543,12586,12842,12850,12964,13200,13215,13218,13253,13263,13267,13270,13384,13428,13727,13839,13851,14617,14703,14801,14816,14964,15183,15471,15585,16471,16736,17208,17325,17330,17374,17623,17997,18018,18212,18218,18301,18318,18760,18811,18814,18820,18823,18844,18848,18872,19576,19620,19738,19887,40870,59244,59336,59367,59413,59417,59423,59431,59437,59443,59452,59460,59478,59493,63789,63866,63894,63976,63986,64016,64018,64021,64025,64034,64037,64042,65074,65093,65107,65112,65127,65132,65375,65510,65536],"gbChars":[0,36,38,45,50,81,89,95,96,100,103,104,105,109,126,133,148,172,175,179,208,306,307,308,309,310,311,312,313,341,428,443,544,545,558,741,742,749,750,805,819,820,7922,7924,7925,7927,7934,7943,7944,7945,7950,8062,8148,8149,8152,8164,8174,8236,8240,8262,8264,8374,8380,8381,8384,8388,8390,8392,8393,8394,8396,8401,8406,8416,8419,8424,8437,8439,8445,8482,8485,8496,8521,8603,8936,8946,9046,9050,9063,9066,9076,9092,9100,9108,9111,9113,9131,9162,9164,9218,9219,11329,11331,11334,11336,11346,11361,11363,11366,11370,11372,11375,11389,11682,11686,11687,11692,11694,11714,11716,11723,11725,11730,11736,11982,11989,12102,12336,12348,12350,12384,12393,12395,12397,12510,12553,12851,12962,12973,13738,13823,13919,13933,14080,14298,14585,14698,15583,15847,16318,16434,16438,16481,16729,17102,17122,17315,17320,17402,17418,17859,17909,17911,17915,17916,17936,17939,17961,18664,18703,18814,18962,19043,33469,33470,33471,33484,33485,33490,33497,33501,33505,33513,33520,33536,33550,37845,37921,37948,38029,38038,38064,38065,38066,38069,38075,38076,38078,39108,39109,39113,39114,39115,39116,39265,39394,189000]}
},{}],151:[function(require,module,exports){
module.exports=[
["a140","",62],
["a180","",32],
["a240","",62],
["a280","",32],
["a2ab","",5],
["a2e3","€"],
["a2ef",""],
["a2fd",""],
["a340","",62],
["a380","",31,"　"],
["a440","",62],
["a480","",32],
["a4f4","",10],
["a540","",62],
["a580","",32],
["a5f7","",7],
["a640","",62],
["a680","",32],
["a6b9","",7],
["a6d9","",6],
["a6ec",""],
["a6f3",""],
["a6f6","",8],
["a740","",62],
["a780","",32],
["a7c2","",14],
["a7f2","",12],
["a896","",10],
["a8bc",""],
["a8bf","ǹ"],
["a8c1",""],
["a8ea","",20],
["a958",""],
["a95b",""],
["a95d",""],
["a989","〾⿰",11],
["a997","",12],
["a9f0","",14],
["aaa1","",93],
["aba1","",93],
["aca1","",93],
["ada1","",93],
["aea1","",93],
["afa1","",93],
["d7fa","",4],
["f8a1","",93],
["f9a1","",93],
["faa1","",93],
["fba1","",93],
["fca1","",93],
["fda1","",93],
["fe50","⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌"],
["fe80","䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓",6,"䶮",93]
]

},{}],152:[function(require,module,exports){
module.exports=[
["0","\u0000",128],
["a1","｡",62],
["8140","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×"],
["8180","÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓"],
["81b8","∈∋⊆⊇⊂⊃∪∩"],
["81c8","∧∨￢⇒⇔∀∃"],
["81da","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],
["81f0","Å‰♯♭♪†‡¶"],
["81fc","◯"],
["824f","０",9],
["8260","Ａ",25],
["8281","ａ",25],
["829f","ぁ",82],
["8340","ァ",62],
["8380","ム",22],
["839f","Α",16,"Σ",6],
["83bf","α",16,"σ",6],
["8440","А",5,"ЁЖ",25],
["8470","а",5,"ёж",7],
["8480","о",17],
["849f","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],
["8740","①",19,"Ⅰ",9],
["875f","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],
["877e","㍻"],
["8780","〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],
["889f","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],
["8940","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円"],
["8980","園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],
["8a40","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫"],
["8a80","橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],
["8b40","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救"],
["8b80","朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],
["8c40","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨"],
["8c80","劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],
["8d40","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降"],
["8d80","項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],
["8e40","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止"],
["8e80","死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],
["8f40","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳"],
["8f80","準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],
["9040","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨"],
["9080","逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],
["9140","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻"],
["9180","操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],
["9240","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄"],
["9280","逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],
["9340","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬"],
["9380","凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],
["9440","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅"],
["9480","楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],
["9540","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷"],
["9580","斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],
["9640","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆"],
["9680","摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],
["9740","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲"],
["9780","沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],
["9840","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],
["989f","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],
["9940","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭"],
["9980","凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],
["9a40","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸"],
["9a80","噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],
["9b40","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀"],
["9b80","它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],
["9c40","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠"],
["9c80","怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],
["9d40","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫"],
["9d80","捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],
["9e40","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎"],
["9e80","梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],
["9f40","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯"],
["9f80","麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],
["e040","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝"],
["e080","烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],
["e140","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿"],
["e180","痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],
["e240","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰"],
["e280","窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],
["e340","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷"],
["e380","縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],
["e440","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤"],
["e480","艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],
["e540","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬"],
["e580","蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],
["e640","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧"],
["e680","諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],
["e740","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜"],
["e780","轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],
["e840","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙"],
["e880","閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],
["e940","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃"],
["e980","騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],
["ea40","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯"],
["ea80","黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙"],
["ed40","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏"],
["ed80","塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],
["ee40","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙"],
["ee80","蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],
["eeef","ⅰ",9,"￢￤＇＂"],
["f040","",62],
["f080","",124],
["f140","",62],
["f180","",124],
["f240","",62],
["f280","",124],
["f340","",62],
["f380","",124],
["f440","",62],
["f480","",124],
["f540","",62],
["f580","",124],
["f640","",62],
["f680","",124],
["f740","",62],
["f780","",124],
["f840","",62],
["f880","",124],
["f940",""],
["fa40","ⅰ",9,"Ⅰ",9,"￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊"],
["fa80","兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯"],
["fb40","涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神"],
["fb80","祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙"],
["fc40","髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"]
]

},{}],153:[function(require,module,exports){
(function (Buffer){
"use strict";function Utf16BECodec(){}function Utf16BEEncoder(){}function Utf16BEDecoder(){this.overflowByte=-1}function Utf16Codec(t,e){this.iconv=e}function Utf16Encoder(t,e){t=t||{},void 0===t.addBOM&&(t.addBOM=!0),this.encoder=e.iconv.getEncoder("utf-16le",t)}function Utf16Decoder(t,e){this.decoder=null,this.initialBytes=[],this.initialBytesLen=0,this.options=t||{},this.iconv=e.iconv}function detectEncoding(t,e){var o=e||"utf-16le";if(t.length>=2)if(254==t[0]&&255==t[1])o="utf-16be";else if(255==t[0]&&254==t[1])o="utf-16le";else{for(var n=0,i=0,r=Math.min(t.length-t.length%2,64),c=0;r>c;c+=2)0===t[c]&&0!==t[c+1]&&i++,0!==t[c]&&0===t[c+1]&&n++;i>n?o="utf-16be":n>i&&(o="utf-16le")}return o}exports.utf16be=Utf16BECodec,Utf16BECodec.prototype.encoder=Utf16BEEncoder,Utf16BECodec.prototype.decoder=Utf16BEDecoder,Utf16BECodec.prototype.bomAware=!0,Utf16BEEncoder.prototype.write=function(t){for(var e=new Buffer(t,"ucs2"),o=0;o<e.length;o+=2){var n=e[o];e[o]=e[o+1],e[o+1]=n}return e},Utf16BEEncoder.prototype.end=function(){},Utf16BEDecoder.prototype.write=function(t){if(0==t.length)return"";var e=new Buffer(t.length+1),o=0,n=0;for(-1!==this.overflowByte&&(e[0]=t[0],e[1]=this.overflowByte,o=1,n=2);o<t.length-1;o+=2,n+=2)e[n]=t[o+1],e[n+1]=t[o];return this.overflowByte=o==t.length-1?t[t.length-1]:-1,e.slice(0,n).toString("ucs2")},Utf16BEDecoder.prototype.end=function(){},exports.utf16=Utf16Codec,Utf16Codec.prototype.encoder=Utf16Encoder,Utf16Codec.prototype.decoder=Utf16Decoder,Utf16Encoder.prototype.write=function(t){return this.encoder.write(t)},Utf16Encoder.prototype.end=function(){return this.encoder.end()},Utf16Decoder.prototype.write=function(t){if(!this.decoder){if(this.initialBytes.push(t),this.initialBytesLen+=t.length,this.initialBytesLen<16)return"";var t=Buffer.concat(this.initialBytes),e=detectEncoding(t,this.options.defaultEncoding);this.decoder=this.iconv.getDecoder(e,this.options),this.initialBytes.length=this.initialBytesLen=0}return this.decoder.write(t)},Utf16Decoder.prototype.end=function(){if(!this.decoder){var t=Buffer.concat(this.initialBytes),e=detectEncoding(t,this.options.defaultEncoding);this.decoder=this.iconv.getDecoder(e,this.options);var o=this.decoder.write(t),n=this.decoder.end();return n?o+n:o}return this.decoder.end()};

}).call(this,require("buffer").Buffer)
},{"buffer":60}],154:[function(require,module,exports){
(function (Buffer){
"use strict";function Utf7Codec(e,t){this.iconv=t}function Utf7Encoder(e,t){this.iconv=t.iconv}function Utf7Decoder(e,t){this.iconv=t.iconv,this.inBase64=!1,this.base64Accum=""}function Utf7IMAPCodec(e,t){this.iconv=t}function Utf7IMAPEncoder(e,t){this.iconv=t.iconv,this.inBase64=!1,this.base64Accum=new Buffer(6),this.base64AccumIdx=0}function Utf7IMAPDecoder(e,t){this.iconv=t.iconv,this.inBase64=!1,this.base64Accum=""}exports.utf7=Utf7Codec,exports.unicode11utf7="utf7",Utf7Codec.prototype.encoder=Utf7Encoder,Utf7Codec.prototype.decoder=Utf7Decoder,Utf7Codec.prototype.bomAware=!0;var nonDirectChars=/[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;Utf7Encoder.prototype.write=function(e){return new Buffer(e.replace(nonDirectChars,function(e){return"+"+("+"===e?"":this.iconv.encode(e,"utf16-be").toString("base64").replace(/=+$/,""))+"-"}.bind(this)))},Utf7Encoder.prototype.end=function(){};for(var base64Regex=/[A-Za-z0-9\/+]/,base64Chars=[],i=0;256>i;i++)base64Chars[i]=base64Regex.test(String.fromCharCode(i));var plusChar="+".charCodeAt(0),minusChar="-".charCodeAt(0),andChar="&".charCodeAt(0);Utf7Decoder.prototype.write=function(e){for(var t="",i=0,s=this.inBase64,c=this.base64Accum,r=0;r<e.length;r++)if(s){if(!base64Chars[e[r]]){if(r==i&&e[r]==minusChar)t+="+";else{var n=c+e.slice(i,r).toString();t+=this.iconv.decode(new Buffer(n,"base64"),"utf16-be")}e[r]!=minusChar&&r--,i=r+1,s=!1,c=""}}else e[r]==plusChar&&(t+=this.iconv.decode(e.slice(i,r),"ascii"),i=r+1,s=!0);if(s){var n=c+e.slice(i).toString(),o=n.length-n.length%8;c=n.slice(o),n=n.slice(0,o),t+=this.iconv.decode(new Buffer(n,"base64"),"utf16-be")}else t+=this.iconv.decode(e.slice(i),"ascii");return this.inBase64=s,this.base64Accum=c,t},Utf7Decoder.prototype.end=function(){var e="";return this.inBase64&&this.base64Accum.length>0&&(e=this.iconv.decode(new Buffer(this.base64Accum,"base64"),"utf16-be")),this.inBase64=!1,this.base64Accum="",e},exports.utf7imap=Utf7IMAPCodec,Utf7IMAPCodec.prototype.encoder=Utf7IMAPEncoder,Utf7IMAPCodec.prototype.decoder=Utf7IMAPDecoder,Utf7IMAPCodec.prototype.bomAware=!0,Utf7IMAPEncoder.prototype.write=function(e){for(var t=this.inBase64,i=this.base64Accum,s=this.base64AccumIdx,c=new Buffer(5*e.length+10),r=0,n=0;n<e.length;n++){var o=e.charCodeAt(n);o>=32&&126>=o?(t&&(s>0&&(r+=c.write(i.slice(0,s).toString("base64").replace(/\//g,",").replace(/=+$/,""),r),s=0),c[r++]=minusChar,t=!1),t||(c[r++]=o,o===andChar&&(c[r++]=minusChar))):(t||(c[r++]=andChar,t=!0),t&&(i[s++]=o>>8,i[s++]=255&o,s==i.length&&(r+=c.write(i.toString("base64").replace(/\//g,","),r),s=0)))}return this.inBase64=t,this.base64AccumIdx=s,c.slice(0,r)},Utf7IMAPEncoder.prototype.end=function(){var e=new Buffer(10),t=0;return this.inBase64&&(this.base64AccumIdx>0&&(t+=e.write(this.base64Accum.slice(0,this.base64AccumIdx).toString("base64").replace(/\//g,",").replace(/=+$/,""),t),this.base64AccumIdx=0),e[t++]=minusChar,this.inBase64=!1),e.slice(0,t)};var base64IMAPChars=base64Chars.slice();base64IMAPChars[",".charCodeAt(0)]=!0,Utf7IMAPDecoder.prototype.write=function(e){for(var t="",i=0,s=this.inBase64,c=this.base64Accum,r=0;r<e.length;r++)if(s){if(!base64IMAPChars[e[r]]){if(r==i&&e[r]==minusChar)t+="&";else{var n=c+e.slice(i,r).toString().replace(/,/g,"/");t+=this.iconv.decode(new Buffer(n,"base64"),"utf16-be")}e[r]!=minusChar&&r--,i=r+1,s=!1,c=""}}else e[r]==andChar&&(t+=this.iconv.decode(e.slice(i,r),"ascii"),i=r+1,s=!0);if(s){var n=c+e.slice(i).toString().replace(/,/g,"/"),o=n.length-n.length%8;c=n.slice(o),n=n.slice(0,o),t+=this.iconv.decode(new Buffer(n,"base64"),"utf16-be")}else t+=this.iconv.decode(e.slice(i),"ascii");return this.inBase64=s,this.base64Accum=c,t},Utf7IMAPDecoder.prototype.end=function(){var e="";return this.inBase64&&this.base64Accum.length>0&&(e=this.iconv.decode(new Buffer(this.base64Accum,"base64"),"utf16-be")),this.inBase64=!1,this.base64Accum="",e};

}).call(this,require("buffer").Buffer)
},{"buffer":60}],155:[function(require,module,exports){
"use strict";function PrependBOMWrapper(r,t){this.encoder=r,this.addBOM=!0}function StripBOMWrapper(r,t){this.decoder=r,this.pass=!1,this.options=t||{}}var BOMChar="\ufeff";exports.PrependBOM=PrependBOMWrapper,PrependBOMWrapper.prototype.write=function(r){return this.addBOM&&(r=BOMChar+r,this.addBOM=!1),this.encoder.write(r)},PrependBOMWrapper.prototype.end=function(){return this.encoder.end()},exports.StripBOM=StripBOMWrapper,StripBOMWrapper.prototype.write=function(r){var t=this.decoder.write(r);return this.pass||!t?t:(t[0]===BOMChar&&(t=t.slice(1),"function"==typeof this.options.stripBOM&&this.options.stripBOM()),this.pass=!0,t)},StripBOMWrapper.prototype.end=function(){return this.decoder.end()};

},{}],156:[function(require,module,exports){
(function (Buffer){
"use strict";module.exports=function(e){var t=void 0;e.supportsNodeEncodingsExtension=!(new Buffer(0)instanceof Uint8Array),e.extendNodeEncodings=function(){if(!t){if(t={},!e.supportsNodeEncodingsExtension)return console.error("ACTION NEEDED: require('iconv-lite').extendNodeEncodings() is not supported in your version of Node"),void console.error("See more info at https://github.com/ashtuchkin/iconv-lite/wiki/Node-v4-compatibility");var o={hex:!0,utf8:!0,"utf-8":!0,ascii:!0,binary:!0,base64:!0,ucs2:!0,"ucs-2":!0,utf16le:!0,"utf-16le":!0};Buffer.isNativeEncoding=function(e){return e&&o[e.toLowerCase()]};var r=require("buffer").SlowBuffer;if(t.SlowBufferToString=r.prototype.toString,r.prototype.toString=function(o,r,n){return o=String(o||"utf8").toLowerCase(),Buffer.isNativeEncoding(o)?t.SlowBufferToString.call(this,o,r,n):("undefined"==typeof r&&(r=0),"undefined"==typeof n&&(n=this.length),e.decode(this.slice(r,n),o))},t.SlowBufferWrite=r.prototype.write,r.prototype.write=function(o,r,n,i){if(isFinite(r))isFinite(n)||(i=n,n=void 0);else{var f=i;i=r,r=n,n=f}r=+r||0;var u=this.length-r;if(n?(n=+n,n>u&&(n=u)):n=u,i=String(i||"utf8").toLowerCase(),Buffer.isNativeEncoding(i))return t.SlowBufferWrite.call(this,o,r,n,i);if(o.length>0&&(0>n||0>r))throw new RangeError("attempt to write beyond buffer bounds");var s=e.encode(o,i);return s.length<n&&(n=s.length),s.copy(this,r,0,n),n},t.BufferIsEncoding=Buffer.isEncoding,Buffer.isEncoding=function(t){return Buffer.isNativeEncoding(t)||e.encodingExists(t)},t.BufferByteLength=Buffer.byteLength,Buffer.byteLength=r.byteLength=function(o,r){return r=String(r||"utf8").toLowerCase(),Buffer.isNativeEncoding(r)?t.BufferByteLength.call(this,o,r):e.encode(o,r).length},t.BufferToString=Buffer.prototype.toString,Buffer.prototype.toString=function(o,r,n){return o=String(o||"utf8").toLowerCase(),Buffer.isNativeEncoding(o)?t.BufferToString.call(this,o,r,n):("undefined"==typeof r&&(r=0),"undefined"==typeof n&&(n=this.length),e.decode(this.slice(r,n),o))},t.BufferWrite=Buffer.prototype.write,Buffer.prototype.write=function(o,r,n,i){var f=r,u=n,s=i;if(isFinite(r))isFinite(n)||(i=n,n=void 0);else{var d=i;i=r,r=n,n=d}if(i=String(i||"utf8").toLowerCase(),Buffer.isNativeEncoding(i))return t.BufferWrite.call(this,o,f,u,s);r=+r||0;var c=this.length-r;if(n?(n=+n,n>c&&(n=c)):n=c,o.length>0&&(0>n||0>r))throw new RangeError("attempt to write beyond buffer bounds");var g=e.encode(o,i);return g.length<n&&(n=g.length),g.copy(this,r,0,n),n},e.supportsStreams){var n=require("stream").Readable;t.ReadableSetEncoding=n.prototype.setEncoding,n.prototype.setEncoding=function(t,o){this._readableState.decoder=e.getDecoder(t,o),this._readableState.encoding=t},n.prototype.collect=e._collect}}},e.undoExtendNodeEncodings=function(){if(e.supportsNodeEncodingsExtension){if(!t)throw new Error("require('iconv-lite').undoExtendNodeEncodings(): Nothing to undo; extendNodeEncodings() is not called.");delete Buffer.isNativeEncoding;var o=require("buffer").SlowBuffer;if(o.prototype.toString=t.SlowBufferToString,o.prototype.write=t.SlowBufferWrite,Buffer.isEncoding=t.BufferIsEncoding,Buffer.byteLength=t.BufferByteLength,Buffer.prototype.toString=t.BufferToString,Buffer.prototype.write=t.BufferWrite,e.supportsStreams){var r=require("stream").Readable;r.prototype.setEncoding=t.ReadableSetEncoding,delete r.prototype.collect}t=void 0}}};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"stream":241}],157:[function(require,module,exports){
(function (process,Buffer){
"use strict";var bomHandling=require("./bom-handling"),iconv=module.exports;iconv.encodings=null,iconv.defaultCharUnicode="�",iconv.defaultCharSingleByte="?",iconv.encode=function(e,n,o){e=""+(e||"");var c=iconv.getEncoder(n,o),r=c.write(e),i=c.end();return i&&i.length>0?Buffer.concat([r,i]):r},iconv.decode=function(e,n,o){"string"==typeof e&&(iconv.skipDecodeWarning||(console.error("Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding"),iconv.skipDecodeWarning=!0),e=new Buffer(""+(e||""),"binary"));var c=iconv.getDecoder(n,o),r=c.write(e),i=c.end();return i?r+i:r},iconv.encodingExists=function(e){try{return iconv.getCodec(e),!0}catch(n){return!1}},iconv.toEncoding=iconv.encode,iconv.fromEncoding=iconv.decode,iconv._codecDataCache={},iconv.getCodec=function(e){iconv.encodings||(iconv.encodings=require("../encodings"));for(var n=(""+e).toLowerCase().replace(/[^0-9a-z]|:\d{4}$/g,""),o={};;){var c=iconv._codecDataCache[n];if(c)return c;var r=iconv.encodings[n];switch(typeof r){case"string":n=r;break;case"object":for(var i in r)o[i]=r[i];o.encodingName||(o.encodingName=n),n=r.type;break;case"function":return o.encodingName||(o.encodingName=n),c=new r(o,iconv),iconv._codecDataCache[o.encodingName]=c,c;default:throw new Error("Encoding not recognized: '"+e+"' (searched as: '"+n+"')")}}},iconv.getEncoder=function(e,n){var o=iconv.getCodec(e),c=new o.encoder(n,o);return o.bomAware&&n&&n.addBOM&&(c=new bomHandling.PrependBOM(c,n)),c},iconv.getDecoder=function(e,n){var o=iconv.getCodec(e),c=new o.decoder(n,o);return!o.bomAware||n&&n.stripBOM===!1||(c=new bomHandling.StripBOM(c,n)),c};var nodeVer="undefined"!=typeof process&&process.versions&&process.versions.node;if(nodeVer){var nodeVerArr=nodeVer.split(".").map(Number);(nodeVerArr[0]>0||nodeVerArr[1]>=10)&&require("./streams")(iconv),require("./extend-node")(iconv)}

}).call(this,require('_process'),require("buffer").Buffer)
},{"../encodings":140,"./bom-handling":155,"./extend-node":156,"./streams":158,"_process":201,"buffer":60}],158:[function(require,module,exports){
(function (Buffer){
"use strict";function IconvLiteEncoderStream(t,e){this.conv=t,e=e||{},e.decodeStrings=!1,Transform.call(this,e)}function IconvLiteDecoderStream(t,e){this.conv=t,e=e||{},e.encoding=this.encoding="utf8",Transform.call(this,e)}var Transform=require("stream").Transform;module.exports=function(t){t.encodeStream=function(e,r){return new IconvLiteEncoderStream(t.getEncoder(e,r),r)},t.decodeStream=function(e,r){return new IconvLiteDecoderStream(t.getDecoder(e,r),r)},t.supportsStreams=!0,t.IconvLiteEncoderStream=IconvLiteEncoderStream,t.IconvLiteDecoderStream=IconvLiteDecoderStream,t._collect=IconvLiteDecoderStream.prototype.collect},IconvLiteEncoderStream.prototype=Object.create(Transform.prototype,{constructor:{value:IconvLiteEncoderStream}}),IconvLiteEncoderStream.prototype._transform=function(t,e,r){if("string"!=typeof t)return r(new Error("Iconv encoding stream needs strings as its input."));try{var o=this.conv.write(t);o&&o.length&&this.push(o),r()}catch(n){r(n)}},IconvLiteEncoderStream.prototype._flush=function(t){try{var e=this.conv.end();e&&e.length&&this.push(e),t()}catch(r){t(r)}},IconvLiteEncoderStream.prototype.collect=function(t){var e=[];return this.on("error",t),this.on("data",function(t){e.push(t)}),this.on("end",function(){t(null,Buffer.concat(e))}),this},IconvLiteDecoderStream.prototype=Object.create(Transform.prototype,{constructor:{value:IconvLiteDecoderStream}}),IconvLiteDecoderStream.prototype._transform=function(t,e,r){if(!Buffer.isBuffer(t))return r(new Error("Iconv decoding stream needs buffers as its input."));try{var o=this.conv.write(t);o&&o.length&&this.push(o,this.encoding),r()}catch(n){r(n)}},IconvLiteDecoderStream.prototype._flush=function(t){try{var e=this.conv.end();e&&e.length&&this.push(e,this.encoding),t()}catch(r){t(r)}},IconvLiteDecoderStream.prototype.collect=function(t){var e="";return this.on("error",t),this.on("data",function(t){e+=t}),this.on("end",function(){t(null,e)}),this};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"stream":241}],159:[function(require,module,exports){
exports.read=function(a,o,t,r,h){var M,p,w=8*h-r-1,f=(1<<w)-1,e=f>>1,i=-7,N=t?h-1:0,n=t?-1:1,s=a[o+N];for(N+=n,M=s&(1<<-i)-1,s>>=-i,i+=w;i>0;M=256*M+a[o+N],N+=n,i-=8);for(p=M&(1<<-i)-1,M>>=-i,i+=r;i>0;p=256*p+a[o+N],N+=n,i-=8);if(0===M)M=1-e;else{if(M===f)return p?NaN:(s?-1:1)*(1/0);p+=Math.pow(2,r),M-=e}return(s?-1:1)*p*Math.pow(2,M-r)},exports.write=function(a,o,t,r,h,M){var p,w,f,e=8*M-h-1,i=(1<<e)-1,N=i>>1,n=23===h?Math.pow(2,-24)-Math.pow(2,-77):0,s=r?0:M-1,u=r?1:-1,l=0>o||0===o&&0>1/o?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(w=isNaN(o)?1:0,p=i):(p=Math.floor(Math.log(o)/Math.LN2),o*(f=Math.pow(2,-p))<1&&(p--,f*=2),o+=p+N>=1?n/f:n*Math.pow(2,1-N),o*f>=2&&(p++,f/=2),p+N>=i?(w=0,p=i):p+N>=1?(w=(o*f-1)*Math.pow(2,h),p+=N):(w=o*Math.pow(2,N-1)*Math.pow(2,h),p=0));h>=8;a[t+s]=255&w,s+=u,w/=256,h-=8);for(p=p<<h|w,e+=h;e>0;a[t+s]=255&p,s+=u,p/=256,e-=8);a[t+s-u]|=128*l};

},{}],160:[function(require,module,exports){
var indexOf=[].indexOf;module.exports=function(e,n){if(indexOf)return e.indexOf(n);for(var r=0;r<e.length;++r)if(e[r]===n)return r;return-1};

},{}],161:[function(require,module,exports){
"function"==typeof Object.create?module.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:module.exports=function(t,e){t.super_=e;var o=function(){};o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t};

},{}],162:[function(require,module,exports){
(function(){var r,t,n,e,i,o,a,s;t={},s=this,"undefined"!=typeof module&&null!==module&&module.exports?module.exports=t:s.ipaddr=t,a=function(r,t,n,e){var i,o;if(r.length!==t.length)throw new Error("ipaddr: cannot match CIDR for objects with different lengths");for(i=0;e>0;){if(o=n-e,0>o&&(o=0),r[i]>>o!==t[i]>>o)return!1;e-=n,i+=1}return!0},t.subnetMatch=function(r,t,n){var e,i,o,a,s;null==n&&(n="unicast");for(e in t)for(i=t[e],!i[0]||i[0]instanceof Array||(i=[i]),a=0,s=i.length;s>a;a++)if(o=i[a],r.match.apply(r,o))return e;return n},t.IPv4=function(){function r(r){var t,n,e;if(4!==r.length)throw new Error("ipaddr: ipv4 octet count should be 4");for(n=0,e=r.length;e>n;n++)if(t=r[n],!(t>=0&&255>=t))throw new Error("ipaddr: ipv4 octet is a byte");this.octets=r}return r.prototype.kind=function(){return"ipv4"},r.prototype.toString=function(){return this.octets.join(".")},r.prototype.toByteArray=function(){return this.octets.slice(0)},r.prototype.match=function(r,t){var n;if(void 0===t&&(n=r,r=n[0],t=n[1]),"ipv4"!==r.kind())throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");return a(this.octets,r.octets,8,t)},r.prototype.SpecialRanges={unspecified:[[new r([0,0,0,0]),8]],broadcast:[[new r([255,255,255,255]),32]],multicast:[[new r([224,0,0,0]),4]],linkLocal:[[new r([169,254,0,0]),16]],loopback:[[new r([127,0,0,0]),8]],"private":[[new r([10,0,0,0]),8],[new r([172,16,0,0]),12],[new r([192,168,0,0]),16]],reserved:[[new r([192,0,0,0]),24],[new r([192,0,2,0]),24],[new r([192,88,99,0]),24],[new r([198,51,100,0]),24],[new r([203,0,113,0]),24],[new r([240,0,0,0]),4]]},r.prototype.range=function(){return t.subnetMatch(this,this.SpecialRanges)},r.prototype.toIPv4MappedAddress=function(){return t.IPv6.parse("::ffff:"+this.toString())},r}(),n="(0?\\d+|0x[a-f0-9]+)",e={fourOctet:new RegExp("^"+n+"\\."+n+"\\."+n+"\\."+n+"$","i"),longValue:new RegExp("^"+n+"$","i")},t.IPv4.parser=function(r){var t,n,i,o,a;if(n=function(r){return"0"===r[0]&&"x"!==r[1]?parseInt(r,8):parseInt(r)},t=r.match(e.fourOctet))return function(){var r,e,o,a;for(o=t.slice(1,6),a=[],r=0,e=o.length;e>r;r++)i=o[r],a.push(n(i));return a}();if(t=r.match(e.longValue)){if(a=n(t[1]),a>4294967295||0>a)throw new Error("ipaddr: address outside defined range");return function(){var r,t;for(t=[],o=r=0;24>=r;o=r+=8)t.push(a>>o&255);return t}().reverse()}return null},t.IPv6=function(){function r(r){var t,n,e;if(8!==r.length)throw new Error("ipaddr: ipv6 part count should be 8");for(n=0,e=r.length;e>n;n++)if(t=r[n],!(t>=0&&65535>=t))throw new Error("ipaddr: ipv6 part should fit to two octets");this.parts=r}return r.prototype.kind=function(){return"ipv6"},r.prototype.toString=function(){var r,t,n,e,i,o,a;for(i=function(){var r,n,e,i;for(e=this.parts,i=[],r=0,n=e.length;n>r;r++)t=e[r],i.push(t.toString(16));return i}.call(this),r=[],n=function(t){return r.push(t)},e=0,o=0,a=i.length;a>o;o++)switch(t=i[o],e){case 0:n("0"===t?"":t),e=1;break;case 1:"0"===t?e=2:n(t);break;case 2:"0"!==t&&(n(""),n(t),e=3);break;case 3:n(t)}return 2===e&&(n(""),n("")),r.join(":")},r.prototype.toByteArray=function(){var r,t,n,e,i;for(r=[],i=this.parts,n=0,e=i.length;e>n;n++)t=i[n],r.push(t>>8),r.push(255&t);return r},r.prototype.toNormalizedString=function(){var r;return function(){var t,n,e,i;for(e=this.parts,i=[],t=0,n=e.length;n>t;t++)r=e[t],i.push(r.toString(16));return i}.call(this).join(":")},r.prototype.match=function(r,t){var n;if(void 0===t&&(n=r,r=n[0],t=n[1]),"ipv6"!==r.kind())throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");return a(this.parts,r.parts,16,t)},r.prototype.SpecialRanges={unspecified:[new r([0,0,0,0,0,0,0,0]),128],linkLocal:[new r([65152,0,0,0,0,0,0,0]),10],multicast:[new r([65280,0,0,0,0,0,0,0]),8],loopback:[new r([0,0,0,0,0,0,0,1]),128],uniqueLocal:[new r([64512,0,0,0,0,0,0,0]),7],ipv4Mapped:[new r([0,0,0,0,0,65535,0,0]),96],rfc6145:[new r([0,0,0,0,65535,0,0,0]),96],rfc6052:[new r([100,65435,0,0,0,0,0,0]),96],"6to4":[new r([8194,0,0,0,0,0,0,0]),16],teredo:[new r([8193,0,0,0,0,0,0,0]),32],reserved:[[new r([8193,3512,0,0,0,0,0,0]),32]]},r.prototype.range=function(){return t.subnetMatch(this,this.SpecialRanges)},r.prototype.isIPv4MappedAddress=function(){return"ipv4Mapped"===this.range()},r.prototype.toIPv4Address=function(){var r,n,e;if(!this.isIPv4MappedAddress())throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");return e=this.parts.slice(-2),r=e[0],n=e[1],new t.IPv4([r>>8,255&r,n>>8,255&n])},r}(),i="(?:[0-9a-f]+::?)+",o={"native":new RegExp("^(::)?("+i+")?([0-9a-f]+)?(::)?$","i"),transitional:new RegExp("^((?:"+i+")|(?:::)(?:"+i+")?)"+(""+n+"\\."+n+"\\."+n+"\\."+n+"$"),"i")},r=function(r,t){var n,e,i,o,a;if(r.indexOf("::")!==r.lastIndexOf("::"))return null;for(n=0,e=-1;(e=r.indexOf(":",e+1))>=0;)n++;if("::"===r.substr(0,2)&&n--,"::"===r.substr(-2,2)&&n--,n>t)return null;for(a=t-n,o=":";a--;)o+="0:";return r=r.replace("::",o),":"===r[0]&&(r=r.slice(1)),":"===r[r.length-1]&&(r=r.slice(0,-1)),function(){var t,n,e,o;for(e=r.split(":"),o=[],t=0,n=e.length;n>t;t++)i=e[t],o.push(parseInt(i,16));return o}()},t.IPv6.parser=function(t){var n,e;return t.match(o["native"])?r(t,8):(n=t.match(o.transitional))&&(e=r(n[1].slice(0,-1),6))?(e.push(parseInt(n[2])<<8|parseInt(n[3])),e.push(parseInt(n[4])<<8|parseInt(n[5])),e):null},t.IPv4.isIPv4=t.IPv6.isIPv6=function(r){return null!==this.parser(r)},t.IPv4.isValid=function(r){var t;try{return new this(this.parser(r)),!0}catch(n){return t=n,!1}},t.IPv6.isValid=function(r){var t;if("string"==typeof r&&-1===r.indexOf(":"))return!1;try{return new this(this.parser(r)),!0}catch(n){return t=n,!1}},t.IPv4.parse=t.IPv6.parse=function(r){var t;if(t=this.parser(r),null===t)throw new Error("ipaddr: string is not formatted like ip address");return new this(t)},t.IPv4.parseCIDR=function(r){var t,n;if((n=r.match(/^(.+)\/(\d+)$/))&&(t=parseInt(n[2]),t>=0&&32>=t))return[this.parse(n[1]),t];throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range")},t.IPv6.parseCIDR=function(r){var t,n;if((n=r.match(/^(.+)\/(\d+)$/))&&(t=parseInt(n[2]),t>=0&&128>=t))return[this.parse(n[1]),t];throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range")},t.isValid=function(r){return t.IPv6.isValid(r)||t.IPv4.isValid(r)},t.parse=function(r){if(t.IPv6.isValid(r))return t.IPv6.parse(r);if(t.IPv4.isValid(r))return t.IPv4.parse(r);throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format")},t.parseCIDR=function(r){var n;try{return t.IPv6.parseCIDR(r)}catch(e){n=e;try{return t.IPv4.parseCIDR(r)}catch(e){throw n=e,new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format")}}},t.process=function(r){var t;return t=this.parse(r),"ipv6"===t.kind()&&t.isIPv4MappedAddress()?t.toIPv4Address():t}}).call(this);

},{}],163:[function(require,module,exports){
module.exports=function(r){return!(null==r||!(r._isBuffer||r.constructor&&"function"==typeof r.constructor.isBuffer&&r.constructor.isBuffer(r)))};

},{}],164:[function(require,module,exports){
function format(e){if(!e||"object"!=typeof e)throw new TypeError("argument obj is required");var t=e.parameters,r=e.subtype,a=e.suffix,p=e.type;if(!p||!typeNameRegExp.test(p))throw new TypeError("invalid type");if(!r||!subtypeNameRegExp.test(r))throw new TypeError("invalid subtype");var n=p+"/"+r;if(a){if(!typeNameRegExp.test(a))throw new TypeError("invalid suffix");n+="+"+a}if(t&&"object"==typeof t)for(var o,i=Object.keys(t).sort(),s=0;s<i.length;s++){if(o=i[s],!tokenRegExp.test(o))throw new TypeError("invalid parameter name");n+="; "+o+"="+qstring(t[o])}return n}function parse(e){if(!e)throw new TypeError("argument string is required");if("object"==typeof e&&(e=getcontenttype(e)),"string"!=typeof e)throw new TypeError("argument string is required to be a string");var t,r,a,p=e.indexOf(";"),n=-1!==p?e.substr(0,p):e,o=splitType(n),i={};for(paramRegExp.lastIndex=p;r=paramRegExp.exec(e);){if(r.index!==p)throw new TypeError("invalid parameter format");p+=r[0].length,t=r[1].toLowerCase(),a=r[2],'"'===a[0]&&(a=a.substr(1,a.length-2).replace(qescRegExp,"$1")),i[t]=a}if(-1!==p&&p!==e.length)throw new TypeError("invalid parameter format");return o.parameters=i,o}function getcontenttype(e){return"function"==typeof e.getHeader?e.getHeader("content-type"):"object"==typeof e.headers?e.headers&&e.headers["content-type"]:void 0}function qstring(e){var t=String(e);if(tokenRegExp.test(t))return t;if(t.length>0&&!textRegExp.test(t))throw new TypeError("invalid parameter value");return'"'+t.replace(quoteRegExp,"\\$1")+'"'}function splitType(e){var t=typeRegExp.exec(e.toLowerCase());if(!t)throw new TypeError("invalid media type");var r,a=t[1],p=t[2],n=p.lastIndexOf("+");-1!==n&&(r=p.substr(n+1),p=p.substr(0,n));var o={type:a,subtype:p,suffix:r};return o}var paramRegExp=/; *([!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) *= *("(?:[ !\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u0020-\u007e])*"|[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) */g,textRegExp=/^[\u0020-\u007e\u0080-\u00ff]+$/,tokenRegExp=/^[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+$/,qescRegExp=/\\([\u0000-\u007f])/g,quoteRegExp=/([\\"])/g,subtypeNameRegExp=/^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/,typeNameRegExp=/^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/,typeRegExp=/^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;exports.format=format,exports.parse=parse;

},{}],165:[function(require,module,exports){
"use strict";function merge(r,e,t){if(!r)throw new TypeError("argument dest is required");if(!e)throw new TypeError("argument src is required");return void 0===t&&(t=!0),Object.getOwnPropertyNames(e).forEach(function(o){if(t||!hasOwnProperty.call(r,o)){var n=Object.getOwnPropertyDescriptor(e,o);Object.defineProperty(r,o,n)}}),r}module.exports=merge;var hasOwnProperty=Object.prototype.hasOwnProperty;

},{}],166:[function(require,module,exports){
"use strict";function getCurrentNodeMethods(){return http.METHODS&&http.METHODS.map(function(t){return t.toLowerCase()})}function getBasicNodeMethods(){return["get","post","put","head","delete","options","trace","copy","lock","mkcol","move","purge","propfind","proppatch","unlock","report","mkactivity","checkout","merge","m-search","notify","subscribe","unsubscribe","patch","search","connect"]}var http=require("http");module.exports=getCurrentNodeMethods()||getBasicNodeMethods();

},{"http":31}],167:[function(require,module,exports){
function MillerRabin(r){this.rand=r||new brorand.Rand}var bn=require("bn.js"),brorand=require("brorand");module.exports=MillerRabin,MillerRabin.create=function(r){return new MillerRabin(r)},MillerRabin.prototype._rand=function(r){var n=r.bitLength(),e=this.rand.generate(Math.ceil(n/8));e[0]|=3;var t=7&n;return 0!==t&&(e[e.length-1]>>=7-t),new bn(e)},MillerRabin.prototype.test=function(r,n,e){var t=r.bitLength(),a=bn.mont(r),i=new bn(1).toRed(a);n||(n=Math.max(1,t/48|0));for(var o=r.subn(1),b=o.subn(1),d=0;!o.testn(d);d++);for(var u=r.shrn(d),f=o.toRed(a),c=!0;n>0;n--){var s=this._rand(b);e&&e(s);var l=s.toRed(a).redPow(u);if(0!==l.cmp(i)&&0!==l.cmp(f)){for(var m=1;d>m;m++){if(l=l.redSqr(),0===l.cmp(i))return!1;if(0===l.cmp(f))break}if(m===d)return!1}}return c},MillerRabin.prototype.getDivisor=function(r,n){var e=r.bitLength(),t=bn.mont(r),a=new bn(1).toRed(t);n||(n=Math.max(1,e/48|0));for(var i=r.subn(1),o=i.subn(1),b=0;!i.testn(b);b++);for(var d=r.shrn(b),u=i.toRed(t);n>0;n--){var f=this._rand(o),c=r.gcd(f);if(0!==c.cmpn(1))return c;var s=f.toRed(t).redPow(d);if(0!==s.cmp(a)&&0!==s.cmp(u)){for(var l=1;b>l;l++){if(s=s.redSqr(),0===s.cmp(a))return s.fromRed().subn(1).gcd(r);if(0===s.cmp(u))break}if(l===b)return s=s.redSqr(),s.fromRed().subn(1).gcd(r)}}return!1};

},{"bn.js":19,"brorand":30}],168:[function(require,module,exports){
module.exports={
  "application/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "application/3gpdash-qoe-report+xml": {
    "source": "iana"
  },
  "application/3gpp-ims+xml": {
    "source": "iana"
  },
  "application/a2l": {
    "source": "iana"
  },
  "application/activemessage": {
    "source": "iana"
  },
  "application/alto-costmap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-costmapfilter+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-directory+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointcost+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointcostparams+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointprop+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointpropparams+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-error+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-networkmap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-networkmapfilter+json": {
    "source": "iana",
    "compressible": true
  },
  "application/aml": {
    "source": "iana"
  },
  "application/andrew-inset": {
    "source": "iana",
    "extensions": ["ez"]
  },
  "application/applefile": {
    "source": "iana"
  },
  "application/applixware": {
    "source": "apache",
    "extensions": ["aw"]
  },
  "application/atf": {
    "source": "iana"
  },
  "application/atfx": {
    "source": "iana"
  },
  "application/atom+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["atom"]
  },
  "application/atomcat+xml": {
    "source": "iana",
    "extensions": ["atomcat"]
  },
  "application/atomdeleted+xml": {
    "source": "iana"
  },
  "application/atomicmail": {
    "source": "iana"
  },
  "application/atomsvc+xml": {
    "source": "iana",
    "extensions": ["atomsvc"]
  },
  "application/atxml": {
    "source": "iana"
  },
  "application/auth-policy+xml": {
    "source": "iana"
  },
  "application/bacnet-xdd+zip": {
    "source": "iana"
  },
  "application/batch-smtp": {
    "source": "iana"
  },
  "application/bdoc": {
    "compressible": false,
    "extensions": ["bdoc"]
  },
  "application/beep+xml": {
    "source": "iana"
  },
  "application/calendar+json": {
    "source": "iana",
    "compressible": true
  },
  "application/calendar+xml": {
    "source": "iana"
  },
  "application/call-completion": {
    "source": "iana"
  },
  "application/cals-1840": {
    "source": "iana"
  },
  "application/cbor": {
    "source": "iana"
  },
  "application/ccmp+xml": {
    "source": "iana"
  },
  "application/ccxml+xml": {
    "source": "iana",
    "extensions": ["ccxml"]
  },
  "application/cdfx+xml": {
    "source": "iana"
  },
  "application/cdmi-capability": {
    "source": "iana",
    "extensions": ["cdmia"]
  },
  "application/cdmi-container": {
    "source": "iana",
    "extensions": ["cdmic"]
  },
  "application/cdmi-domain": {
    "source": "iana",
    "extensions": ["cdmid"]
  },
  "application/cdmi-object": {
    "source": "iana",
    "extensions": ["cdmio"]
  },
  "application/cdmi-queue": {
    "source": "iana",
    "extensions": ["cdmiq"]
  },
  "application/cdni": {
    "source": "iana"
  },
  "application/cea": {
    "source": "iana"
  },
  "application/cea-2018+xml": {
    "source": "iana"
  },
  "application/cellml+xml": {
    "source": "iana"
  },
  "application/cfw": {
    "source": "iana"
  },
  "application/cms": {
    "source": "iana"
  },
  "application/cnrp+xml": {
    "source": "iana"
  },
  "application/coap-group+json": {
    "source": "iana",
    "compressible": true
  },
  "application/commonground": {
    "source": "iana"
  },
  "application/conference-info+xml": {
    "source": "iana"
  },
  "application/cpl+xml": {
    "source": "iana"
  },
  "application/csrattrs": {
    "source": "iana"
  },
  "application/csta+xml": {
    "source": "iana"
  },
  "application/cstadata+xml": {
    "source": "iana"
  },
  "application/csvm+json": {
    "source": "iana",
    "compressible": true
  },
  "application/cu-seeme": {
    "source": "apache",
    "extensions": ["cu"]
  },
  "application/cybercash": {
    "source": "iana"
  },
  "application/dart": {
    "compressible": true
  },
  "application/dash+xml": {
    "source": "iana",
    "extensions": ["mpd"]
  },
  "application/dashdelta": {
    "source": "iana"
  },
  "application/davmount+xml": {
    "source": "iana",
    "extensions": ["davmount"]
  },
  "application/dca-rft": {
    "source": "iana"
  },
  "application/dcd": {
    "source": "iana"
  },
  "application/dec-dx": {
    "source": "iana"
  },
  "application/dialog-info+xml": {
    "source": "iana"
  },
  "application/dicom": {
    "source": "iana"
  },
  "application/dii": {
    "source": "iana"
  },
  "application/dit": {
    "source": "iana"
  },
  "application/dns": {
    "source": "iana"
  },
  "application/docbook+xml": {
    "source": "apache",
    "extensions": ["dbk"]
  },
  "application/dskpp+xml": {
    "source": "iana"
  },
  "application/dssc+der": {
    "source": "iana",
    "extensions": ["dssc"]
  },
  "application/dssc+xml": {
    "source": "iana",
    "extensions": ["xdssc"]
  },
  "application/dvcs": {
    "source": "iana"
  },
  "application/ecmascript": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ecma"]
  },
  "application/edi-consent": {
    "source": "iana"
  },
  "application/edi-x12": {
    "source": "iana",
    "compressible": false
  },
  "application/edifact": {
    "source": "iana",
    "compressible": false
  },
  "application/emergencycalldata.comment+xml": {
    "source": "iana"
  },
  "application/emergencycalldata.deviceinfo+xml": {
    "source": "iana"
  },
  "application/emergencycalldata.providerinfo+xml": {
    "source": "iana"
  },
  "application/emergencycalldata.serviceinfo+xml": {
    "source": "iana"
  },
  "application/emergencycalldata.subscriberinfo+xml": {
    "source": "iana"
  },
  "application/emma+xml": {
    "source": "iana",
    "extensions": ["emma"]
  },
  "application/emotionml+xml": {
    "source": "iana"
  },
  "application/encaprtp": {
    "source": "iana"
  },
  "application/epp+xml": {
    "source": "iana"
  },
  "application/epub+zip": {
    "source": "iana",
    "extensions": ["epub"]
  },
  "application/eshop": {
    "source": "iana"
  },
  "application/exi": {
    "source": "iana",
    "extensions": ["exi"]
  },
  "application/fastinfoset": {
    "source": "iana"
  },
  "application/fastsoap": {
    "source": "iana"
  },
  "application/fdt+xml": {
    "source": "iana"
  },
  "application/fits": {
    "source": "iana"
  },
  "application/font-sfnt": {
    "source": "iana"
  },
  "application/font-tdpfr": {
    "source": "iana",
    "extensions": ["pfr"]
  },
  "application/font-woff": {
    "source": "iana",
    "compressible": false,
    "extensions": ["woff"]
  },
  "application/font-woff2": {
    "compressible": false,
    "extensions": ["woff2"]
  },
  "application/framework-attributes+xml": {
    "source": "iana"
  },
  "application/gml+xml": {
    "source": "apache",
    "extensions": ["gml"]
  },
  "application/gpx+xml": {
    "source": "apache",
    "extensions": ["gpx"]
  },
  "application/gxf": {
    "source": "apache",
    "extensions": ["gxf"]
  },
  "application/gzip": {
    "source": "iana",
    "compressible": false
  },
  "application/h224": {
    "source": "iana"
  },
  "application/held+xml": {
    "source": "iana"
  },
  "application/http": {
    "source": "iana"
  },
  "application/hyperstudio": {
    "source": "iana",
    "extensions": ["stk"]
  },
  "application/ibe-key-request+xml": {
    "source": "iana"
  },
  "application/ibe-pkg-reply+xml": {
    "source": "iana"
  },
  "application/ibe-pp-data": {
    "source": "iana"
  },
  "application/iges": {
    "source": "iana"
  },
  "application/im-iscomposing+xml": {
    "source": "iana"
  },
  "application/index": {
    "source": "iana"
  },
  "application/index.cmd": {
    "source": "iana"
  },
  "application/index.obj": {
    "source": "iana"
  },
  "application/index.response": {
    "source": "iana"
  },
  "application/index.vnd": {
    "source": "iana"
  },
  "application/inkml+xml": {
    "source": "iana",
    "extensions": ["ink","inkml"]
  },
  "application/iotp": {
    "source": "iana"
  },
  "application/ipfix": {
    "source": "iana",
    "extensions": ["ipfix"]
  },
  "application/ipp": {
    "source": "iana"
  },
  "application/isup": {
    "source": "iana"
  },
  "application/its+xml": {
    "source": "iana"
  },
  "application/java-archive": {
    "source": "apache",
    "compressible": false,
    "extensions": ["jar","war","ear"]
  },
  "application/java-serialized-object": {
    "source": "apache",
    "compressible": false,
    "extensions": ["ser"]
  },
  "application/java-vm": {
    "source": "apache",
    "compressible": false,
    "extensions": ["class"]
  },
  "application/javascript": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["js"]
  },
  "application/jose": {
    "source": "iana"
  },
  "application/jose+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jrd+json": {
    "source": "iana",
    "compressible": true
  },
  "application/json": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["json","map"]
  },
  "application/json-patch+json": {
    "source": "iana",
    "compressible": true
  },
  "application/json-seq": {
    "source": "iana"
  },
  "application/json5": {
    "extensions": ["json5"]
  },
  "application/jsonml+json": {
    "source": "apache",
    "compressible": true,
    "extensions": ["jsonml"]
  },
  "application/jwk+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jwk-set+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jwt": {
    "source": "iana"
  },
  "application/kpml-request+xml": {
    "source": "iana"
  },
  "application/kpml-response+xml": {
    "source": "iana"
  },
  "application/ld+json": {
    "source": "iana",
    "compressible": true,
    "extensions": ["jsonld"]
  },
  "application/link-format": {
    "source": "iana"
  },
  "application/load-control+xml": {
    "source": "iana"
  },
  "application/lost+xml": {
    "source": "iana",
    "extensions": ["lostxml"]
  },
  "application/lostsync+xml": {
    "source": "iana"
  },
  "application/lxf": {
    "source": "iana"
  },
  "application/mac-binhex40": {
    "source": "iana",
    "extensions": ["hqx"]
  },
  "application/mac-compactpro": {
    "source": "apache",
    "extensions": ["cpt"]
  },
  "application/macwriteii": {
    "source": "iana"
  },
  "application/mads+xml": {
    "source": "iana",
    "extensions": ["mads"]
  },
  "application/manifest+json": {
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["webmanifest"]
  },
  "application/marc": {
    "source": "iana",
    "extensions": ["mrc"]
  },
  "application/marcxml+xml": {
    "source": "iana",
    "extensions": ["mrcx"]
  },
  "application/mathematica": {
    "source": "iana",
    "extensions": ["ma","nb","mb"]
  },
  "application/mathml+xml": {
    "source": "iana",
    "extensions": ["mathml"]
  },
  "application/mathml-content+xml": {
    "source": "iana"
  },
  "application/mathml-presentation+xml": {
    "source": "iana"
  },
  "application/mbms-associated-procedure-description+xml": {
    "source": "iana"
  },
  "application/mbms-deregister+xml": {
    "source": "iana"
  },
  "application/mbms-envelope+xml": {
    "source": "iana"
  },
  "application/mbms-msk+xml": {
    "source": "iana"
  },
  "application/mbms-msk-response+xml": {
    "source": "iana"
  },
  "application/mbms-protection-description+xml": {
    "source": "iana"
  },
  "application/mbms-reception-report+xml": {
    "source": "iana"
  },
  "application/mbms-register+xml": {
    "source": "iana"
  },
  "application/mbms-register-response+xml": {
    "source": "iana"
  },
  "application/mbms-schedule+xml": {
    "source": "iana"
  },
  "application/mbms-user-service-description+xml": {
    "source": "iana"
  },
  "application/mbox": {
    "source": "iana",
    "extensions": ["mbox"]
  },
  "application/media-policy-dataset+xml": {
    "source": "iana"
  },
  "application/media_control+xml": {
    "source": "iana"
  },
  "application/mediaservercontrol+xml": {
    "source": "iana",
    "extensions": ["mscml"]
  },
  "application/merge-patch+json": {
    "source": "iana",
    "compressible": true
  },
  "application/metalink+xml": {
    "source": "apache",
    "extensions": ["metalink"]
  },
  "application/metalink4+xml": {
    "source": "iana",
    "extensions": ["meta4"]
  },
  "application/mets+xml": {
    "source": "iana",
    "extensions": ["mets"]
  },
  "application/mf4": {
    "source": "iana"
  },
  "application/mikey": {
    "source": "iana"
  },
  "application/mods+xml": {
    "source": "iana",
    "extensions": ["mods"]
  },
  "application/moss-keys": {
    "source": "iana"
  },
  "application/moss-signature": {
    "source": "iana"
  },
  "application/mosskey-data": {
    "source": "iana"
  },
  "application/mosskey-request": {
    "source": "iana"
  },
  "application/mp21": {
    "source": "iana",
    "extensions": ["m21","mp21"]
  },
  "application/mp4": {
    "source": "iana",
    "extensions": ["mp4s","m4p"]
  },
  "application/mpeg4-generic": {
    "source": "iana"
  },
  "application/mpeg4-iod": {
    "source": "iana"
  },
  "application/mpeg4-iod-xmt": {
    "source": "iana"
  },
  "application/mrb-consumer+xml": {
    "source": "iana"
  },
  "application/mrb-publish+xml": {
    "source": "iana"
  },
  "application/msc-ivr+xml": {
    "source": "iana"
  },
  "application/msc-mixer+xml": {
    "source": "iana"
  },
  "application/msword": {
    "source": "iana",
    "compressible": false,
    "extensions": ["doc","dot"]
  },
  "application/mxf": {
    "source": "iana",
    "extensions": ["mxf"]
  },
  "application/nasdata": {
    "source": "iana"
  },
  "application/news-checkgroups": {
    "source": "iana"
  },
  "application/news-groupinfo": {
    "source": "iana"
  },
  "application/news-transmission": {
    "source": "iana"
  },
  "application/nlsml+xml": {
    "source": "iana"
  },
  "application/nss": {
    "source": "iana"
  },
  "application/ocsp-request": {
    "source": "iana"
  },
  "application/ocsp-response": {
    "source": "iana"
  },
  "application/octet-stream": {
    "source": "iana",
    "compressible": false,
    "extensions": ["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]
  },
  "application/oda": {
    "source": "iana",
    "extensions": ["oda"]
  },
  "application/odx": {
    "source": "iana"
  },
  "application/oebps-package+xml": {
    "source": "iana",
    "extensions": ["opf"]
  },
  "application/ogg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ogx"]
  },
  "application/omdoc+xml": {
    "source": "apache",
    "extensions": ["omdoc"]
  },
  "application/onenote": {
    "source": "apache",
    "extensions": ["onetoc","onetoc2","onetmp","onepkg"]
  },
  "application/oxps": {
    "source": "iana",
    "extensions": ["oxps"]
  },
  "application/p2p-overlay+xml": {
    "source": "iana"
  },
  "application/parityfec": {
    "source": "iana"
  },
  "application/patch-ops-error+xml": {
    "source": "iana",
    "extensions": ["xer"]
  },
  "application/pdf": {
    "source": "iana",
    "compressible": false,
    "extensions": ["pdf"]
  },
  "application/pdx": {
    "source": "iana"
  },
  "application/pgp-encrypted": {
    "source": "iana",
    "compressible": false,
    "extensions": ["pgp"]
  },
  "application/pgp-keys": {
    "source": "iana"
  },
  "application/pgp-signature": {
    "source": "iana",
    "extensions": ["asc","sig"]
  },
  "application/pics-rules": {
    "source": "apache",
    "extensions": ["prf"]
  },
  "application/pidf+xml": {
    "source": "iana"
  },
  "application/pidf-diff+xml": {
    "source": "iana"
  },
  "application/pkcs10": {
    "source": "iana",
    "extensions": ["p10"]
  },
  "application/pkcs12": {
    "source": "iana"
  },
  "application/pkcs7-mime": {
    "source": "iana",
    "extensions": ["p7m","p7c"]
  },
  "application/pkcs7-signature": {
    "source": "iana",
    "extensions": ["p7s"]
  },
  "application/pkcs8": {
    "source": "iana",
    "extensions": ["p8"]
  },
  "application/pkix-attr-cert": {
    "source": "iana",
    "extensions": ["ac"]
  },
  "application/pkix-cert": {
    "source": "iana",
    "extensions": ["cer"]
  },
  "application/pkix-crl": {
    "source": "iana",
    "extensions": ["crl"]
  },
  "application/pkix-pkipath": {
    "source": "iana",
    "extensions": ["pkipath"]
  },
  "application/pkixcmp": {
    "source": "iana",
    "extensions": ["pki"]
  },
  "application/pls+xml": {
    "source": "iana",
    "extensions": ["pls"]
  },
  "application/poc-settings+xml": {
    "source": "iana"
  },
  "application/postscript": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ai","eps","ps"]
  },
  "application/ppsp-tracker+json": {
    "source": "iana",
    "compressible": true
  },
  "application/problem+json": {
    "source": "iana",
    "compressible": true
  },
  "application/problem+xml": {
    "source": "iana"
  },
  "application/provenance+xml": {
    "source": "iana"
  },
  "application/prs.alvestrand.titrax-sheet": {
    "source": "iana"
  },
  "application/prs.cww": {
    "source": "iana",
    "extensions": ["cww"]
  },
  "application/prs.hpub+zip": {
    "source": "iana"
  },
  "application/prs.nprend": {
    "source": "iana"
  },
  "application/prs.plucker": {
    "source": "iana"
  },
  "application/prs.rdf-xml-crypt": {
    "source": "iana"
  },
  "application/prs.xsf+xml": {
    "source": "iana"
  },
  "application/pskc+xml": {
    "source": "iana",
    "extensions": ["pskcxml"]
  },
  "application/qsig": {
    "source": "iana"
  },
  "application/raptorfec": {
    "source": "iana"
  },
  "application/rdap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/rdf+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rdf"]
  },
  "application/reginfo+xml": {
    "source": "iana",
    "extensions": ["rif"]
  },
  "application/relax-ng-compact-syntax": {
    "source": "iana",
    "extensions": ["rnc"]
  },
  "application/remote-printing": {
    "source": "iana"
  },
  "application/reputon+json": {
    "source": "iana",
    "compressible": true
  },
  "application/resource-lists+xml": {
    "source": "iana",
    "extensions": ["rl"]
  },
  "application/resource-lists-diff+xml": {
    "source": "iana",
    "extensions": ["rld"]
  },
  "application/rfc+xml": {
    "source": "iana"
  },
  "application/riscos": {
    "source": "iana"
  },
  "application/rlmi+xml": {
    "source": "iana"
  },
  "application/rls-services+xml": {
    "source": "iana",
    "extensions": ["rs"]
  },
  "application/rpki-ghostbusters": {
    "source": "iana",
    "extensions": ["gbr"]
  },
  "application/rpki-manifest": {
    "source": "iana",
    "extensions": ["mft"]
  },
  "application/rpki-roa": {
    "source": "iana",
    "extensions": ["roa"]
  },
  "application/rpki-updown": {
    "source": "iana"
  },
  "application/rsd+xml": {
    "source": "apache",
    "extensions": ["rsd"]
  },
  "application/rss+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["rss"]
  },
  "application/rtf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rtf"]
  },
  "application/rtploopback": {
    "source": "iana"
  },
  "application/rtx": {
    "source": "iana"
  },
  "application/samlassertion+xml": {
    "source": "iana"
  },
  "application/samlmetadata+xml": {
    "source": "iana"
  },
  "application/sbml+xml": {
    "source": "iana",
    "extensions": ["sbml"]
  },
  "application/scaip+xml": {
    "source": "iana"
  },
  "application/scim+json": {
    "source": "iana",
    "compressible": true
  },
  "application/scvp-cv-request": {
    "source": "iana",
    "extensions": ["scq"]
  },
  "application/scvp-cv-response": {
    "source": "iana",
    "extensions": ["scs"]
  },
  "application/scvp-vp-request": {
    "source": "iana",
    "extensions": ["spq"]
  },
  "application/scvp-vp-response": {
    "source": "iana",
    "extensions": ["spp"]
  },
  "application/sdp": {
    "source": "iana",
    "extensions": ["sdp"]
  },
  "application/sep+xml": {
    "source": "iana"
  },
  "application/sep-exi": {
    "source": "iana"
  },
  "application/session-info": {
    "source": "iana"
  },
  "application/set-payment": {
    "source": "iana"
  },
  "application/set-payment-initiation": {
    "source": "iana",
    "extensions": ["setpay"]
  },
  "application/set-registration": {
    "source": "iana"
  },
  "application/set-registration-initiation": {
    "source": "iana",
    "extensions": ["setreg"]
  },
  "application/sgml": {
    "source": "iana"
  },
  "application/sgml-open-catalog": {
    "source": "iana"
  },
  "application/shf+xml": {
    "source": "iana",
    "extensions": ["shf"]
  },
  "application/sieve": {
    "source": "iana"
  },
  "application/simple-filter+xml": {
    "source": "iana"
  },
  "application/simple-message-summary": {
    "source": "iana"
  },
  "application/simplesymbolcontainer": {
    "source": "iana"
  },
  "application/slate": {
    "source": "iana"
  },
  "application/smil": {
    "source": "iana"
  },
  "application/smil+xml": {
    "source": "iana",
    "extensions": ["smi","smil"]
  },
  "application/smpte336m": {
    "source": "iana"
  },
  "application/soap+fastinfoset": {
    "source": "iana"
  },
  "application/soap+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/sparql-query": {
    "source": "iana",
    "extensions": ["rq"]
  },
  "application/sparql-results+xml": {
    "source": "iana",
    "extensions": ["srx"]
  },
  "application/spirits-event+xml": {
    "source": "iana"
  },
  "application/sql": {
    "source": "iana"
  },
  "application/srgs": {
    "source": "iana",
    "extensions": ["gram"]
  },
  "application/srgs+xml": {
    "source": "iana",
    "extensions": ["grxml"]
  },
  "application/sru+xml": {
    "source": "iana",
    "extensions": ["sru"]
  },
  "application/ssdl+xml": {
    "source": "apache",
    "extensions": ["ssdl"]
  },
  "application/ssml+xml": {
    "source": "iana",
    "extensions": ["ssml"]
  },
  "application/tamp-apex-update": {
    "source": "iana"
  },
  "application/tamp-apex-update-confirm": {
    "source": "iana"
  },
  "application/tamp-community-update": {
    "source": "iana"
  },
  "application/tamp-community-update-confirm": {
    "source": "iana"
  },
  "application/tamp-error": {
    "source": "iana"
  },
  "application/tamp-sequence-adjust": {
    "source": "iana"
  },
  "application/tamp-sequence-adjust-confirm": {
    "source": "iana"
  },
  "application/tamp-status-query": {
    "source": "iana"
  },
  "application/tamp-status-response": {
    "source": "iana"
  },
  "application/tamp-update": {
    "source": "iana"
  },
  "application/tamp-update-confirm": {
    "source": "iana"
  },
  "application/tar": {
    "compressible": true
  },
  "application/tei+xml": {
    "source": "iana",
    "extensions": ["tei","teicorpus"]
  },
  "application/thraud+xml": {
    "source": "iana",
    "extensions": ["tfi"]
  },
  "application/timestamp-query": {
    "source": "iana"
  },
  "application/timestamp-reply": {
    "source": "iana"
  },
  "application/timestamped-data": {
    "source": "iana",
    "extensions": ["tsd"]
  },
  "application/ttml+xml": {
    "source": "iana"
  },
  "application/tve-trigger": {
    "source": "iana"
  },
  "application/ulpfec": {
    "source": "iana"
  },
  "application/urc-grpsheet+xml": {
    "source": "iana"
  },
  "application/urc-ressheet+xml": {
    "source": "iana"
  },
  "application/urc-targetdesc+xml": {
    "source": "iana"
  },
  "application/urc-uisocketdesc+xml": {
    "source": "iana"
  },
  "application/vcard+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vcard+xml": {
    "source": "iana"
  },
  "application/vemmi": {
    "source": "iana"
  },
  "application/vividence.scriptfile": {
    "source": "apache"
  },
  "application/vnd.3gpp-prose+xml": {
    "source": "iana"
  },
  "application/vnd.3gpp-prose-pc3ch+xml": {
    "source": "iana"
  },
  "application/vnd.3gpp.access-transfer-events+xml": {
    "source": "iana"
  },
  "application/vnd.3gpp.bsf+xml": {
    "source": "iana"
  },
  "application/vnd.3gpp.mid-call+xml": {
    "source": "iana"
  },
  "application/vnd.3gpp.pic-bw-large": {
    "source": "iana",
    "extensions": ["plb"]
  },
  "application/vnd.3gpp.pic-bw-small": {
    "source": "iana",
    "extensions": ["psb"]
  },
  "application/vnd.3gpp.pic-bw-var": {
    "source": "iana",
    "extensions": ["pvb"]
  },
  "application/vnd.3gpp.sms": {
    "source": "iana"
  },
  "application/vnd.3gpp.srvcc-ext+xml": {
    "source": "iana"
  },
  "application/vnd.3gpp.srvcc-info+xml": {
    "source": "iana"
  },
  "application/vnd.3gpp.state-and-event-info+xml": {
    "source": "iana"
  },
  "application/vnd.3gpp.ussd+xml": {
    "source": "iana"
  },
  "application/vnd.3gpp2.bcmcsinfo+xml": {
    "source": "iana"
  },
  "application/vnd.3gpp2.sms": {
    "source": "iana"
  },
  "application/vnd.3gpp2.tcap": {
    "source": "iana",
    "extensions": ["tcap"]
  },
  "application/vnd.3m.post-it-notes": {
    "source": "iana",
    "extensions": ["pwn"]
  },
  "application/vnd.accpac.simply.aso": {
    "source": "iana",
    "extensions": ["aso"]
  },
  "application/vnd.accpac.simply.imp": {
    "source": "iana",
    "extensions": ["imp"]
  },
  "application/vnd.acucobol": {
    "source": "iana",
    "extensions": ["acu"]
  },
  "application/vnd.acucorp": {
    "source": "iana",
    "extensions": ["atc","acutc"]
  },
  "application/vnd.adobe.air-application-installer-package+zip": {
    "source": "apache",
    "extensions": ["air"]
  },
  "application/vnd.adobe.flash.movie": {
    "source": "iana"
  },
  "application/vnd.adobe.formscentral.fcdt": {
    "source": "iana",
    "extensions": ["fcdt"]
  },
  "application/vnd.adobe.fxp": {
    "source": "iana",
    "extensions": ["fxp","fxpl"]
  },
  "application/vnd.adobe.partial-upload": {
    "source": "iana"
  },
  "application/vnd.adobe.xdp+xml": {
    "source": "iana",
    "extensions": ["xdp"]
  },
  "application/vnd.adobe.xfdf": {
    "source": "iana",
    "extensions": ["xfdf"]
  },
  "application/vnd.aether.imp": {
    "source": "iana"
  },
  "application/vnd.ah-barcode": {
    "source": "iana"
  },
  "application/vnd.ahead.space": {
    "source": "iana",
    "extensions": ["ahead"]
  },
  "application/vnd.airzip.filesecure.azf": {
    "source": "iana",
    "extensions": ["azf"]
  },
  "application/vnd.airzip.filesecure.azs": {
    "source": "iana",
    "extensions": ["azs"]
  },
  "application/vnd.amazon.ebook": {
    "source": "apache",
    "extensions": ["azw"]
  },
  "application/vnd.americandynamics.acc": {
    "source": "iana",
    "extensions": ["acc"]
  },
  "application/vnd.amiga.ami": {
    "source": "iana",
    "extensions": ["ami"]
  },
  "application/vnd.amundsen.maze+xml": {
    "source": "iana"
  },
  "application/vnd.android.package-archive": {
    "source": "apache",
    "compressible": false,
    "extensions": ["apk"]
  },
  "application/vnd.anki": {
    "source": "iana"
  },
  "application/vnd.anser-web-certificate-issue-initiation": {
    "source": "iana",
    "extensions": ["cii"]
  },
  "application/vnd.anser-web-funds-transfer-initiation": {
    "source": "apache",
    "extensions": ["fti"]
  },
  "application/vnd.antix.game-component": {
    "source": "iana",
    "extensions": ["atx"]
  },
  "application/vnd.apache.thrift.binary": {
    "source": "iana"
  },
  "application/vnd.apache.thrift.compact": {
    "source": "iana"
  },
  "application/vnd.apache.thrift.json": {
    "source": "iana"
  },
  "application/vnd.api+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.apple.installer+xml": {
    "source": "iana",
    "extensions": ["mpkg"]
  },
  "application/vnd.apple.mpegurl": {
    "source": "iana",
    "extensions": ["m3u8"]
  },
  "application/vnd.apple.pkpass": {
    "compressible": false,
    "extensions": ["pkpass"]
  },
  "application/vnd.arastra.swi": {
    "source": "iana"
  },
  "application/vnd.aristanetworks.swi": {
    "source": "iana",
    "extensions": ["swi"]
  },
  "application/vnd.artsquare": {
    "source": "iana"
  },
  "application/vnd.astraea-software.iota": {
    "source": "iana",
    "extensions": ["iota"]
  },
  "application/vnd.audiograph": {
    "source": "iana",
    "extensions": ["aep"]
  },
  "application/vnd.autopackage": {
    "source": "iana"
  },
  "application/vnd.avistar+xml": {
    "source": "iana"
  },
  "application/vnd.balsamiq.bmml+xml": {
    "source": "iana"
  },
  "application/vnd.balsamiq.bmpr": {
    "source": "iana"
  },
  "application/vnd.bekitzur-stech+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.biopax.rdf+xml": {
    "source": "iana"
  },
  "application/vnd.blueice.multipass": {
    "source": "iana",
    "extensions": ["mpm"]
  },
  "application/vnd.bluetooth.ep.oob": {
    "source": "iana"
  },
  "application/vnd.bluetooth.le.oob": {
    "source": "iana"
  },
  "application/vnd.bmi": {
    "source": "iana",
    "extensions": ["bmi"]
  },
  "application/vnd.businessobjects": {
    "source": "iana",
    "extensions": ["rep"]
  },
  "application/vnd.cab-jscript": {
    "source": "iana"
  },
  "application/vnd.canon-cpdl": {
    "source": "iana"
  },
  "application/vnd.canon-lips": {
    "source": "iana"
  },
  "application/vnd.cendio.thinlinc.clientconf": {
    "source": "iana"
  },
  "application/vnd.century-systems.tcp_stream": {
    "source": "iana"
  },
  "application/vnd.chemdraw+xml": {
    "source": "iana",
    "extensions": ["cdxml"]
  },
  "application/vnd.chipnuts.karaoke-mmd": {
    "source": "iana",
    "extensions": ["mmd"]
  },
  "application/vnd.cinderella": {
    "source": "iana",
    "extensions": ["cdy"]
  },
  "application/vnd.cirpack.isdn-ext": {
    "source": "iana"
  },
  "application/vnd.citationstyles.style+xml": {
    "source": "iana"
  },
  "application/vnd.claymore": {
    "source": "iana",
    "extensions": ["cla"]
  },
  "application/vnd.cloanto.rp9": {
    "source": "iana",
    "extensions": ["rp9"]
  },
  "application/vnd.clonk.c4group": {
    "source": "iana",
    "extensions": ["c4g","c4d","c4f","c4p","c4u"]
  },
  "application/vnd.cluetrust.cartomobile-config": {
    "source": "iana",
    "extensions": ["c11amc"]
  },
  "application/vnd.cluetrust.cartomobile-config-pkg": {
    "source": "iana",
    "extensions": ["c11amz"]
  },
  "application/vnd.coffeescript": {
    "source": "iana"
  },
  "application/vnd.collection+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.collection.doc+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.collection.next+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.commerce-battelle": {
    "source": "iana"
  },
  "application/vnd.commonspace": {
    "source": "iana",
    "extensions": ["csp"]
  },
  "application/vnd.contact.cmsg": {
    "source": "iana",
    "extensions": ["cdbcmsg"]
  },
  "application/vnd.cosmocaller": {
    "source": "iana",
    "extensions": ["cmc"]
  },
  "application/vnd.crick.clicker": {
    "source": "iana",
    "extensions": ["clkx"]
  },
  "application/vnd.crick.clicker.keyboard": {
    "source": "iana",
    "extensions": ["clkk"]
  },
  "application/vnd.crick.clicker.palette": {
    "source": "iana",
    "extensions": ["clkp"]
  },
  "application/vnd.crick.clicker.template": {
    "source": "iana",
    "extensions": ["clkt"]
  },
  "application/vnd.crick.clicker.wordbank": {
    "source": "iana",
    "extensions": ["clkw"]
  },
  "application/vnd.criticaltools.wbs+xml": {
    "source": "iana",
    "extensions": ["wbs"]
  },
  "application/vnd.ctc-posml": {
    "source": "iana",
    "extensions": ["pml"]
  },
  "application/vnd.ctct.ws+xml": {
    "source": "iana"
  },
  "application/vnd.cups-pdf": {
    "source": "iana"
  },
  "application/vnd.cups-postscript": {
    "source": "iana"
  },
  "application/vnd.cups-ppd": {
    "source": "iana",
    "extensions": ["ppd"]
  },
  "application/vnd.cups-raster": {
    "source": "iana"
  },
  "application/vnd.cups-raw": {
    "source": "iana"
  },
  "application/vnd.curl": {
    "source": "iana"
  },
  "application/vnd.curl.car": {
    "source": "apache",
    "extensions": ["car"]
  },
  "application/vnd.curl.pcurl": {
    "source": "apache",
    "extensions": ["pcurl"]
  },
  "application/vnd.cyan.dean.root+xml": {
    "source": "iana"
  },
  "application/vnd.cybank": {
    "source": "iana"
  },
  "application/vnd.dart": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dart"]
  },
  "application/vnd.data-vision.rdz": {
    "source": "iana",
    "extensions": ["rdz"]
  },
  "application/vnd.debian.binary-package": {
    "source": "iana"
  },
  "application/vnd.dece.data": {
    "source": "iana",
    "extensions": ["uvf","uvvf","uvd","uvvd"]
  },
  "application/vnd.dece.ttml+xml": {
    "source": "iana",
    "extensions": ["uvt","uvvt"]
  },
  "application/vnd.dece.unspecified": {
    "source": "iana",
    "extensions": ["uvx","uvvx"]
  },
  "application/vnd.dece.zip": {
    "source": "iana",
    "extensions": ["uvz","uvvz"]
  },
  "application/vnd.denovo.fcselayout-link": {
    "source": "iana",
    "extensions": ["fe_launch"]
  },
  "application/vnd.desmume-movie": {
    "source": "iana"
  },
  "application/vnd.dir-bi.plate-dl-nosuffix": {
    "source": "iana"
  },
  "application/vnd.dm.delegation+xml": {
    "source": "iana"
  },
  "application/vnd.dna": {
    "source": "iana",
    "extensions": ["dna"]
  },
  "application/vnd.document+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dolby.mlp": {
    "source": "apache",
    "extensions": ["mlp"]
  },
  "application/vnd.dolby.mobile.1": {
    "source": "iana"
  },
  "application/vnd.dolby.mobile.2": {
    "source": "iana"
  },
  "application/vnd.doremir.scorecloud-binary-document": {
    "source": "iana"
  },
  "application/vnd.dpgraph": {
    "source": "iana",
    "extensions": ["dpg"]
  },
  "application/vnd.dreamfactory": {
    "source": "iana",
    "extensions": ["dfac"]
  },
  "application/vnd.drive+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ds-keypoint": {
    "source": "apache",
    "extensions": ["kpxx"]
  },
  "application/vnd.dtg.local": {
    "source": "iana"
  },
  "application/vnd.dtg.local.flash": {
    "source": "iana"
  },
  "application/vnd.dtg.local.html": {
    "source": "iana"
  },
  "application/vnd.dvb.ait": {
    "source": "iana",
    "extensions": ["ait"]
  },
  "application/vnd.dvb.dvbj": {
    "source": "iana"
  },
  "application/vnd.dvb.esgcontainer": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcdftnotifaccess": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcesgaccess": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcesgaccess2": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcesgpdd": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcroaming": {
    "source": "iana"
  },
  "application/vnd.dvb.iptv.alfec-base": {
    "source": "iana"
  },
  "application/vnd.dvb.iptv.alfec-enhancement": {
    "source": "iana"
  },
  "application/vnd.dvb.notif-aggregate-root+xml": {
    "source": "iana"
  },
  "application/vnd.dvb.notif-container+xml": {
    "source": "iana"
  },
  "application/vnd.dvb.notif-generic+xml": {
    "source": "iana"
  },
  "application/vnd.dvb.notif-ia-msglist+xml": {
    "source": "iana"
  },
  "application/vnd.dvb.notif-ia-registration-request+xml": {
    "source": "iana"
  },
  "application/vnd.dvb.notif-ia-registration-response+xml": {
    "source": "iana"
  },
  "application/vnd.dvb.notif-init+xml": {
    "source": "iana"
  },
  "application/vnd.dvb.pfr": {
    "source": "iana"
  },
  "application/vnd.dvb.service": {
    "source": "iana",
    "extensions": ["svc"]
  },
  "application/vnd.dxr": {
    "source": "iana"
  },
  "application/vnd.dynageo": {
    "source": "iana",
    "extensions": ["geo"]
  },
  "application/vnd.dzr": {
    "source": "iana"
  },
  "application/vnd.easykaraoke.cdgdownload": {
    "source": "iana"
  },
  "application/vnd.ecdis-update": {
    "source": "iana"
  },
  "application/vnd.ecowin.chart": {
    "source": "iana",
    "extensions": ["mag"]
  },
  "application/vnd.ecowin.filerequest": {
    "source": "iana"
  },
  "application/vnd.ecowin.fileupdate": {
    "source": "iana"
  },
  "application/vnd.ecowin.series": {
    "source": "iana"
  },
  "application/vnd.ecowin.seriesrequest": {
    "source": "iana"
  },
  "application/vnd.ecowin.seriesupdate": {
    "source": "iana"
  },
  "application/vnd.emclient.accessrequest+xml": {
    "source": "iana"
  },
  "application/vnd.enliven": {
    "source": "iana",
    "extensions": ["nml"]
  },
  "application/vnd.enphase.envoy": {
    "source": "iana"
  },
  "application/vnd.eprints.data+xml": {
    "source": "iana"
  },
  "application/vnd.epson.esf": {
    "source": "iana",
    "extensions": ["esf"]
  },
  "application/vnd.epson.msf": {
    "source": "iana",
    "extensions": ["msf"]
  },
  "application/vnd.epson.quickanime": {
    "source": "iana",
    "extensions": ["qam"]
  },
  "application/vnd.epson.salt": {
    "source": "iana",
    "extensions": ["slt"]
  },
  "application/vnd.epson.ssf": {
    "source": "iana",
    "extensions": ["ssf"]
  },
  "application/vnd.ericsson.quickcall": {
    "source": "iana"
  },
  "application/vnd.eszigno3+xml": {
    "source": "iana",
    "extensions": ["es3","et3"]
  },
  "application/vnd.etsi.aoc+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.asic-e+zip": {
    "source": "iana"
  },
  "application/vnd.etsi.asic-s+zip": {
    "source": "iana"
  },
  "application/vnd.etsi.cug+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.iptvcommand+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.iptvdiscovery+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.iptvprofile+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.iptvsad-bc+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.iptvsad-cod+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.iptvsad-npvr+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.iptvservice+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.iptvsync+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.iptvueprofile+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.mcid+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.mheg5": {
    "source": "iana"
  },
  "application/vnd.etsi.overload-control-policy-dataset+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.pstn+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.sci+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.simservs+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.timestamp-token": {
    "source": "iana"
  },
  "application/vnd.etsi.tsl+xml": {
    "source": "iana"
  },
  "application/vnd.etsi.tsl.der": {
    "source": "iana"
  },
  "application/vnd.eudora.data": {
    "source": "iana"
  },
  "application/vnd.ezpix-album": {
    "source": "iana",
    "extensions": ["ez2"]
  },
  "application/vnd.ezpix-package": {
    "source": "iana",
    "extensions": ["ez3"]
  },
  "application/vnd.f-secure.mobile": {
    "source": "iana"
  },
  "application/vnd.fastcopy-disk-image": {
    "source": "iana"
  },
  "application/vnd.fdf": {
    "source": "iana",
    "extensions": ["fdf"]
  },
  "application/vnd.fdsn.mseed": {
    "source": "iana",
    "extensions": ["mseed"]
  },
  "application/vnd.fdsn.seed": {
    "source": "iana",
    "extensions": ["seed","dataless"]
  },
  "application/vnd.ffsns": {
    "source": "iana"
  },
  "application/vnd.filmit.zfc": {
    "source": "iana"
  },
  "application/vnd.fints": {
    "source": "iana"
  },
  "application/vnd.firemonkeys.cloudcell": {
    "source": "iana"
  },
  "application/vnd.flographit": {
    "source": "iana",
    "extensions": ["gph"]
  },
  "application/vnd.fluxtime.clip": {
    "source": "iana",
    "extensions": ["ftc"]
  },
  "application/vnd.font-fontforge-sfd": {
    "source": "iana"
  },
  "application/vnd.framemaker": {
    "source": "iana",
    "extensions": ["fm","frame","maker","book"]
  },
  "application/vnd.frogans.fnc": {
    "source": "iana",
    "extensions": ["fnc"]
  },
  "application/vnd.frogans.ltf": {
    "source": "iana",
    "extensions": ["ltf"]
  },
  "application/vnd.fsc.weblaunch": {
    "source": "iana",
    "extensions": ["fsc"]
  },
  "application/vnd.fujitsu.oasys": {
    "source": "iana",
    "extensions": ["oas"]
  },
  "application/vnd.fujitsu.oasys2": {
    "source": "iana",
    "extensions": ["oa2"]
  },
  "application/vnd.fujitsu.oasys3": {
    "source": "iana",
    "extensions": ["oa3"]
  },
  "application/vnd.fujitsu.oasysgp": {
    "source": "iana",
    "extensions": ["fg5"]
  },
  "application/vnd.fujitsu.oasysprs": {
    "source": "iana",
    "extensions": ["bh2"]
  },
  "application/vnd.fujixerox.art-ex": {
    "source": "iana"
  },
  "application/vnd.fujixerox.art4": {
    "source": "iana"
  },
  "application/vnd.fujixerox.ddd": {
    "source": "iana",
    "extensions": ["ddd"]
  },
  "application/vnd.fujixerox.docuworks": {
    "source": "iana",
    "extensions": ["xdw"]
  },
  "application/vnd.fujixerox.docuworks.binder": {
    "source": "iana",
    "extensions": ["xbd"]
  },
  "application/vnd.fujixerox.docuworks.container": {
    "source": "iana"
  },
  "application/vnd.fujixerox.hbpl": {
    "source": "iana"
  },
  "application/vnd.fut-misnet": {
    "source": "iana"
  },
  "application/vnd.fuzzysheet": {
    "source": "iana",
    "extensions": ["fzs"]
  },
  "application/vnd.genomatix.tuxedo": {
    "source": "iana",
    "extensions": ["txd"]
  },
  "application/vnd.geo+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.geocube+xml": {
    "source": "iana"
  },
  "application/vnd.geogebra.file": {
    "source": "iana",
    "extensions": ["ggb"]
  },
  "application/vnd.geogebra.tool": {
    "source": "iana",
    "extensions": ["ggt"]
  },
  "application/vnd.geometry-explorer": {
    "source": "iana",
    "extensions": ["gex","gre"]
  },
  "application/vnd.geonext": {
    "source": "iana",
    "extensions": ["gxt"]
  },
  "application/vnd.geoplan": {
    "source": "iana",
    "extensions": ["g2w"]
  },
  "application/vnd.geospace": {
    "source": "iana",
    "extensions": ["g3w"]
  },
  "application/vnd.gerber": {
    "source": "iana"
  },
  "application/vnd.globalplatform.card-content-mgt": {
    "source": "iana"
  },
  "application/vnd.globalplatform.card-content-mgt-response": {
    "source": "iana"
  },
  "application/vnd.gmx": {
    "source": "iana",
    "extensions": ["gmx"]
  },
  "application/vnd.google-apps.document": {
    "compressible": false,
    "extensions": ["gdoc"]
  },
  "application/vnd.google-apps.presentation": {
    "compressible": false,
    "extensions": ["gslides"]
  },
  "application/vnd.google-apps.spreadsheet": {
    "compressible": false,
    "extensions": ["gsheet"]
  },
  "application/vnd.google-earth.kml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["kml"]
  },
  "application/vnd.google-earth.kmz": {
    "source": "iana",
    "compressible": false,
    "extensions": ["kmz"]
  },
  "application/vnd.gov.sk.e-form+xml": {
    "source": "iana"
  },
  "application/vnd.gov.sk.e-form+zip": {
    "source": "iana"
  },
  "application/vnd.gov.sk.xmldatacontainer+xml": {
    "source": "iana"
  },
  "application/vnd.grafeq": {
    "source": "iana",
    "extensions": ["gqf","gqs"]
  },
  "application/vnd.gridmp": {
    "source": "iana"
  },
  "application/vnd.groove-account": {
    "source": "iana",
    "extensions": ["gac"]
  },
  "application/vnd.groove-help": {
    "source": "iana",
    "extensions": ["ghf"]
  },
  "application/vnd.groove-identity-message": {
    "source": "iana",
    "extensions": ["gim"]
  },
  "application/vnd.groove-injector": {
    "source": "iana",
    "extensions": ["grv"]
  },
  "application/vnd.groove-tool-message": {
    "source": "iana",
    "extensions": ["gtm"]
  },
  "application/vnd.groove-tool-template": {
    "source": "iana",
    "extensions": ["tpl"]
  },
  "application/vnd.groove-vcard": {
    "source": "iana",
    "extensions": ["vcg"]
  },
  "application/vnd.hal+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hal+xml": {
    "source": "iana",
    "extensions": ["hal"]
  },
  "application/vnd.handheld-entertainment+xml": {
    "source": "iana",
    "extensions": ["zmm"]
  },
  "application/vnd.hbci": {
    "source": "iana",
    "extensions": ["hbci"]
  },
  "application/vnd.hcl-bireports": {
    "source": "iana"
  },
  "application/vnd.hdt": {
    "source": "iana"
  },
  "application/vnd.heroku+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hhe.lesson-player": {
    "source": "iana",
    "extensions": ["les"]
  },
  "application/vnd.hp-hpgl": {
    "source": "iana",
    "extensions": ["hpgl"]
  },
  "application/vnd.hp-hpid": {
    "source": "iana",
    "extensions": ["hpid"]
  },
  "application/vnd.hp-hps": {
    "source": "iana",
    "extensions": ["hps"]
  },
  "application/vnd.hp-jlyt": {
    "source": "iana",
    "extensions": ["jlt"]
  },
  "application/vnd.hp-pcl": {
    "source": "iana",
    "extensions": ["pcl"]
  },
  "application/vnd.hp-pclxl": {
    "source": "iana",
    "extensions": ["pclxl"]
  },
  "application/vnd.httphone": {
    "source": "iana"
  },
  "application/vnd.hydrostatix.sof-data": {
    "source": "iana",
    "extensions": ["sfd-hdstx"]
  },
  "application/vnd.hyperdrive+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hzn-3d-crossword": {
    "source": "iana"
  },
  "application/vnd.ibm.afplinedata": {
    "source": "iana"
  },
  "application/vnd.ibm.electronic-media": {
    "source": "iana"
  },
  "application/vnd.ibm.minipay": {
    "source": "iana",
    "extensions": ["mpy"]
  },
  "application/vnd.ibm.modcap": {
    "source": "iana",
    "extensions": ["afp","listafp","list3820"]
  },
  "application/vnd.ibm.rights-management": {
    "source": "iana",
    "extensions": ["irm"]
  },
  "application/vnd.ibm.secure-container": {
    "source": "iana",
    "extensions": ["sc"]
  },
  "application/vnd.iccprofile": {
    "source": "iana",
    "extensions": ["icc","icm"]
  },
  "application/vnd.ieee.1905": {
    "source": "iana"
  },
  "application/vnd.igloader": {
    "source": "iana",
    "extensions": ["igl"]
  },
  "application/vnd.immervision-ivp": {
    "source": "iana",
    "extensions": ["ivp"]
  },
  "application/vnd.immervision-ivu": {
    "source": "iana",
    "extensions": ["ivu"]
  },
  "application/vnd.ims.imsccv1p1": {
    "source": "iana"
  },
  "application/vnd.ims.imsccv1p2": {
    "source": "iana"
  },
  "application/vnd.ims.imsccv1p3": {
    "source": "iana"
  },
  "application/vnd.ims.lis.v2.result+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolproxy+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolproxy.id+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolsettings+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.informedcontrol.rms+xml": {
    "source": "iana"
  },
  "application/vnd.informix-visionary": {
    "source": "iana"
  },
  "application/vnd.infotech.project": {
    "source": "iana"
  },
  "application/vnd.infotech.project+xml": {
    "source": "iana"
  },
  "application/vnd.innopath.wamp.notification": {
    "source": "iana"
  },
  "application/vnd.insors.igm": {
    "source": "iana",
    "extensions": ["igm"]
  },
  "application/vnd.intercon.formnet": {
    "source": "iana",
    "extensions": ["xpw","xpx"]
  },
  "application/vnd.intergeo": {
    "source": "iana",
    "extensions": ["i2g"]
  },
  "application/vnd.intertrust.digibox": {
    "source": "iana"
  },
  "application/vnd.intertrust.nncp": {
    "source": "iana"
  },
  "application/vnd.intu.qbo": {
    "source": "iana",
    "extensions": ["qbo"]
  },
  "application/vnd.intu.qfx": {
    "source": "iana",
    "extensions": ["qfx"]
  },
  "application/vnd.iptc.g2.catalogitem+xml": {
    "source": "iana"
  },
  "application/vnd.iptc.g2.conceptitem+xml": {
    "source": "iana"
  },
  "application/vnd.iptc.g2.knowledgeitem+xml": {
    "source": "iana"
  },
  "application/vnd.iptc.g2.newsitem+xml": {
    "source": "iana"
  },
  "application/vnd.iptc.g2.newsmessage+xml": {
    "source": "iana"
  },
  "application/vnd.iptc.g2.packageitem+xml": {
    "source": "iana"
  },
  "application/vnd.iptc.g2.planningitem+xml": {
    "source": "iana"
  },
  "application/vnd.ipunplugged.rcprofile": {
    "source": "iana",
    "extensions": ["rcprofile"]
  },
  "application/vnd.irepository.package+xml": {
    "source": "iana",
    "extensions": ["irp"]
  },
  "application/vnd.is-xpr": {
    "source": "iana",
    "extensions": ["xpr"]
  },
  "application/vnd.isac.fcs": {
    "source": "iana",
    "extensions": ["fcs"]
  },
  "application/vnd.jam": {
    "source": "iana",
    "extensions": ["jam"]
  },
  "application/vnd.japannet-directory-service": {
    "source": "iana"
  },
  "application/vnd.japannet-jpnstore-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-payment-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-registration": {
    "source": "iana"
  },
  "application/vnd.japannet-registration-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-setstore-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-verification": {
    "source": "iana"
  },
  "application/vnd.japannet-verification-wakeup": {
    "source": "iana"
  },
  "application/vnd.jcp.javame.midlet-rms": {
    "source": "iana",
    "extensions": ["rms"]
  },
  "application/vnd.jisp": {
    "source": "iana",
    "extensions": ["jisp"]
  },
  "application/vnd.joost.joda-archive": {
    "source": "iana",
    "extensions": ["joda"]
  },
  "application/vnd.jsk.isdn-ngn": {
    "source": "iana"
  },
  "application/vnd.kahootz": {
    "source": "iana",
    "extensions": ["ktz","ktr"]
  },
  "application/vnd.kde.karbon": {
    "source": "iana",
    "extensions": ["karbon"]
  },
  "application/vnd.kde.kchart": {
    "source": "iana",
    "extensions": ["chrt"]
  },
  "application/vnd.kde.kformula": {
    "source": "iana",
    "extensions": ["kfo"]
  },
  "application/vnd.kde.kivio": {
    "source": "iana",
    "extensions": ["flw"]
  },
  "application/vnd.kde.kontour": {
    "source": "iana",
    "extensions": ["kon"]
  },
  "application/vnd.kde.kpresenter": {
    "source": "iana",
    "extensions": ["kpr","kpt"]
  },
  "application/vnd.kde.kspread": {
    "source": "iana",
    "extensions": ["ksp"]
  },
  "application/vnd.kde.kword": {
    "source": "iana",
    "extensions": ["kwd","kwt"]
  },
  "application/vnd.kenameaapp": {
    "source": "iana",
    "extensions": ["htke"]
  },
  "application/vnd.kidspiration": {
    "source": "iana",
    "extensions": ["kia"]
  },
  "application/vnd.kinar": {
    "source": "iana",
    "extensions": ["kne","knp"]
  },
  "application/vnd.koan": {
    "source": "iana",
    "extensions": ["skp","skd","skt","skm"]
  },
  "application/vnd.kodak-descriptor": {
    "source": "iana",
    "extensions": ["sse"]
  },
  "application/vnd.las.las+xml": {
    "source": "iana",
    "extensions": ["lasxml"]
  },
  "application/vnd.liberty-request+xml": {
    "source": "iana"
  },
  "application/vnd.llamagraphics.life-balance.desktop": {
    "source": "iana",
    "extensions": ["lbd"]
  },
  "application/vnd.llamagraphics.life-balance.exchange+xml": {
    "source": "iana",
    "extensions": ["lbe"]
  },
  "application/vnd.lotus-1-2-3": {
    "source": "iana",
    "extensions": ["123"]
  },
  "application/vnd.lotus-approach": {
    "source": "iana",
    "extensions": ["apr"]
  },
  "application/vnd.lotus-freelance": {
    "source": "iana",
    "extensions": ["pre"]
  },
  "application/vnd.lotus-notes": {
    "source": "iana",
    "extensions": ["nsf"]
  },
  "application/vnd.lotus-organizer": {
    "source": "iana",
    "extensions": ["org"]
  },
  "application/vnd.lotus-screencam": {
    "source": "iana",
    "extensions": ["scm"]
  },
  "application/vnd.lotus-wordpro": {
    "source": "iana",
    "extensions": ["lwp"]
  },
  "application/vnd.macports.portpkg": {
    "source": "iana",
    "extensions": ["portpkg"]
  },
  "application/vnd.mapbox-vector-tile": {
    "source": "iana"
  },
  "application/vnd.marlin.drm.actiontoken+xml": {
    "source": "iana"
  },
  "application/vnd.marlin.drm.conftoken+xml": {
    "source": "iana"
  },
  "application/vnd.marlin.drm.license+xml": {
    "source": "iana"
  },
  "application/vnd.marlin.drm.mdcf": {
    "source": "iana"
  },
  "application/vnd.mason+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.maxmind.maxmind-db": {
    "source": "iana"
  },
  "application/vnd.mcd": {
    "source": "iana",
    "extensions": ["mcd"]
  },
  "application/vnd.medcalcdata": {
    "source": "iana",
    "extensions": ["mc1"]
  },
  "application/vnd.mediastation.cdkey": {
    "source": "iana",
    "extensions": ["cdkey"]
  },
  "application/vnd.meridian-slingshot": {
    "source": "iana"
  },
  "application/vnd.mfer": {
    "source": "iana",
    "extensions": ["mwf"]
  },
  "application/vnd.mfmp": {
    "source": "iana",
    "extensions": ["mfm"]
  },
  "application/vnd.micro+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.micrografx.flo": {
    "source": "iana",
    "extensions": ["flo"]
  },
  "application/vnd.micrografx.igx": {
    "source": "iana",
    "extensions": ["igx"]
  },
  "application/vnd.microsoft.portable-executable": {
    "source": "iana"
  },
  "application/vnd.miele+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.mif": {
    "source": "iana",
    "extensions": ["mif"]
  },
  "application/vnd.minisoft-hp3000-save": {
    "source": "iana"
  },
  "application/vnd.mitsubishi.misty-guard.trustweb": {
    "source": "iana"
  },
  "application/vnd.mobius.daf": {
    "source": "iana",
    "extensions": ["daf"]
  },
  "application/vnd.mobius.dis": {
    "source": "iana",
    "extensions": ["dis"]
  },
  "application/vnd.mobius.mbk": {
    "source": "iana",
    "extensions": ["mbk"]
  },
  "application/vnd.mobius.mqy": {
    "source": "iana",
    "extensions": ["mqy"]
  },
  "application/vnd.mobius.msl": {
    "source": "iana",
    "extensions": ["msl"]
  },
  "application/vnd.mobius.plc": {
    "source": "iana",
    "extensions": ["plc"]
  },
  "application/vnd.mobius.txf": {
    "source": "iana",
    "extensions": ["txf"]
  },
  "application/vnd.mophun.application": {
    "source": "iana",
    "extensions": ["mpn"]
  },
  "application/vnd.mophun.certificate": {
    "source": "iana",
    "extensions": ["mpc"]
  },
  "application/vnd.motorola.flexsuite": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.adsi": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.fis": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.gotap": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.kmr": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.ttc": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.wem": {
    "source": "iana"
  },
  "application/vnd.motorola.iprm": {
    "source": "iana"
  },
  "application/vnd.mozilla.xul+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xul"]
  },
  "application/vnd.ms-3mfdocument": {
    "source": "iana"
  },
  "application/vnd.ms-artgalry": {
    "source": "iana",
    "extensions": ["cil"]
  },
  "application/vnd.ms-asf": {
    "source": "iana"
  },
  "application/vnd.ms-cab-compressed": {
    "source": "iana",
    "extensions": ["cab"]
  },
  "application/vnd.ms-color.iccprofile": {
    "source": "apache"
  },
  "application/vnd.ms-excel": {
    "source": "iana",
    "compressible": false,
    "extensions": ["xls","xlm","xla","xlc","xlt","xlw"]
  },
  "application/vnd.ms-excel.addin.macroenabled.12": {
    "source": "iana",
    "extensions": ["xlam"]
  },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
    "source": "iana",
    "extensions": ["xlsb"]
  },
  "application/vnd.ms-excel.sheet.macroenabled.12": {
    "source": "iana",
    "extensions": ["xlsm"]
  },
  "application/vnd.ms-excel.template.macroenabled.12": {
    "source": "iana",
    "extensions": ["xltm"]
  },
  "application/vnd.ms-fontobject": {
    "source": "iana",
    "compressible": true,
    "extensions": ["eot"]
  },
  "application/vnd.ms-htmlhelp": {
    "source": "iana",
    "extensions": ["chm"]
  },
  "application/vnd.ms-ims": {
    "source": "iana",
    "extensions": ["ims"]
  },
  "application/vnd.ms-lrm": {
    "source": "iana",
    "extensions": ["lrm"]
  },
  "application/vnd.ms-office.activex+xml": {
    "source": "iana"
  },
  "application/vnd.ms-officetheme": {
    "source": "iana",
    "extensions": ["thmx"]
  },
  "application/vnd.ms-opentype": {
    "source": "apache",
    "compressible": true
  },
  "application/vnd.ms-package.obfuscated-opentype": {
    "source": "apache"
  },
  "application/vnd.ms-pki.seccat": {
    "source": "apache",
    "extensions": ["cat"]
  },
  "application/vnd.ms-pki.stl": {
    "source": "apache",
    "extensions": ["stl"]
  },
  "application/vnd.ms-playready.initiator+xml": {
    "source": "iana"
  },
  "application/vnd.ms-powerpoint": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ppt","pps","pot"]
  },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": {
    "source": "iana",
    "extensions": ["ppam"]
  },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
    "source": "iana",
    "extensions": ["pptm"]
  },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": {
    "source": "iana",
    "extensions": ["sldm"]
  },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
    "source": "iana",
    "extensions": ["ppsm"]
  },
  "application/vnd.ms-powerpoint.template.macroenabled.12": {
    "source": "iana",
    "extensions": ["potm"]
  },
  "application/vnd.ms-printdevicecapabilities+xml": {
    "source": "iana"
  },
  "application/vnd.ms-printing.printticket+xml": {
    "source": "apache"
  },
  "application/vnd.ms-printschematicket+xml": {
    "source": "iana"
  },
  "application/vnd.ms-project": {
    "source": "iana",
    "extensions": ["mpp","mpt"]
  },
  "application/vnd.ms-tnef": {
    "source": "iana"
  },
  "application/vnd.ms-windows.devicepairing": {
    "source": "iana"
  },
  "application/vnd.ms-windows.nwprinting.oob": {
    "source": "iana"
  },
  "application/vnd.ms-windows.printerpairing": {
    "source": "iana"
  },
  "application/vnd.ms-windows.wsd.oob": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.lic-chlg-req": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.lic-resp": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.meter-chlg-req": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.meter-resp": {
    "source": "iana"
  },
  "application/vnd.ms-word.document.macroenabled.12": {
    "source": "iana",
    "extensions": ["docm"]
  },
  "application/vnd.ms-word.template.macroenabled.12": {
    "source": "iana",
    "extensions": ["dotm"]
  },
  "application/vnd.ms-works": {
    "source": "iana",
    "extensions": ["wps","wks","wcm","wdb"]
  },
  "application/vnd.ms-wpl": {
    "source": "iana",
    "extensions": ["wpl"]
  },
  "application/vnd.ms-xpsdocument": {
    "source": "iana",
    "compressible": false,
    "extensions": ["xps"]
  },
  "application/vnd.msa-disk-image": {
    "source": "iana"
  },
  "application/vnd.mseq": {
    "source": "iana",
    "extensions": ["mseq"]
  },
  "application/vnd.msign": {
    "source": "iana"
  },
  "application/vnd.multiad.creator": {
    "source": "iana"
  },
  "application/vnd.multiad.creator.cif": {
    "source": "iana"
  },
  "application/vnd.music-niff": {
    "source": "iana"
  },
  "application/vnd.musician": {
    "source": "iana",
    "extensions": ["mus"]
  },
  "application/vnd.muvee.style": {
    "source": "iana",
    "extensions": ["msty"]
  },
  "application/vnd.mynfc": {
    "source": "iana",
    "extensions": ["taglet"]
  },
  "application/vnd.ncd.control": {
    "source": "iana"
  },
  "application/vnd.ncd.reference": {
    "source": "iana"
  },
  "application/vnd.nervana": {
    "source": "iana"
  },
  "application/vnd.netfpx": {
    "source": "iana"
  },
  "application/vnd.neurolanguage.nlu": {
    "source": "iana",
    "extensions": ["nlu"]
  },
  "application/vnd.nintendo.nitro.rom": {
    "source": "iana"
  },
  "application/vnd.nintendo.snes.rom": {
    "source": "iana"
  },
  "application/vnd.nitf": {
    "source": "iana",
    "extensions": ["ntf","nitf"]
  },
  "application/vnd.noblenet-directory": {
    "source": "iana",
    "extensions": ["nnd"]
  },
  "application/vnd.noblenet-sealer": {
    "source": "iana",
    "extensions": ["nns"]
  },
  "application/vnd.noblenet-web": {
    "source": "iana",
    "extensions": ["nnw"]
  },
  "application/vnd.nokia.catalogs": {
    "source": "iana"
  },
  "application/vnd.nokia.conml+wbxml": {
    "source": "iana"
  },
  "application/vnd.nokia.conml+xml": {
    "source": "iana"
  },
  "application/vnd.nokia.iptv.config+xml": {
    "source": "iana"
  },
  "application/vnd.nokia.isds-radio-presets": {
    "source": "iana"
  },
  "application/vnd.nokia.landmark+wbxml": {
    "source": "iana"
  },
  "application/vnd.nokia.landmark+xml": {
    "source": "iana"
  },
  "application/vnd.nokia.landmarkcollection+xml": {
    "source": "iana"
  },
  "application/vnd.nokia.n-gage.ac+xml": {
    "source": "iana"
  },
  "application/vnd.nokia.n-gage.data": {
    "source": "iana",
    "extensions": ["ngdat"]
  },
  "application/vnd.nokia.n-gage.symbian.install": {
    "source": "iana",
    "extensions": ["n-gage"]
  },
  "application/vnd.nokia.ncd": {
    "source": "iana"
  },
  "application/vnd.nokia.pcd+wbxml": {
    "source": "iana"
  },
  "application/vnd.nokia.pcd+xml": {
    "source": "iana"
  },
  "application/vnd.nokia.radio-preset": {
    "source": "iana",
    "extensions": ["rpst"]
  },
  "application/vnd.nokia.radio-presets": {
    "source": "iana",
    "extensions": ["rpss"]
  },
  "application/vnd.novadigm.edm": {
    "source": "iana",
    "extensions": ["edm"]
  },
  "application/vnd.novadigm.edx": {
    "source": "iana",
    "extensions": ["edx"]
  },
  "application/vnd.novadigm.ext": {
    "source": "iana",
    "extensions": ["ext"]
  },
  "application/vnd.ntt-local.content-share": {
    "source": "iana"
  },
  "application/vnd.ntt-local.file-transfer": {
    "source": "iana"
  },
  "application/vnd.ntt-local.ogw_remote-access": {
    "source": "iana"
  },
  "application/vnd.ntt-local.sip-ta_remote": {
    "source": "iana"
  },
  "application/vnd.ntt-local.sip-ta_tcp_stream": {
    "source": "iana"
  },
  "application/vnd.oasis.opendocument.chart": {
    "source": "iana",
    "extensions": ["odc"]
  },
  "application/vnd.oasis.opendocument.chart-template": {
    "source": "iana",
    "extensions": ["otc"]
  },
  "application/vnd.oasis.opendocument.database": {
    "source": "iana",
    "extensions": ["odb"]
  },
  "application/vnd.oasis.opendocument.formula": {
    "source": "iana",
    "extensions": ["odf"]
  },
  "application/vnd.oasis.opendocument.formula-template": {
    "source": "iana",
    "extensions": ["odft"]
  },
  "application/vnd.oasis.opendocument.graphics": {
    "source": "iana",
    "compressible": false,
    "extensions": ["odg"]
  },
  "application/vnd.oasis.opendocument.graphics-template": {
    "source": "iana",
    "extensions": ["otg"]
  },
  "application/vnd.oasis.opendocument.image": {
    "source": "iana",
    "extensions": ["odi"]
  },
  "application/vnd.oasis.opendocument.image-template": {
    "source": "iana",
    "extensions": ["oti"]
  },
  "application/vnd.oasis.opendocument.presentation": {
    "source": "iana",
    "compressible": false,
    "extensions": ["odp"]
  },
  "application/vnd.oasis.opendocument.presentation-template": {
    "source": "iana",
    "extensions": ["otp"]
  },
  "application/vnd.oasis.opendocument.spreadsheet": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ods"]
  },
  "application/vnd.oasis.opendocument.spreadsheet-template": {
    "source": "iana",
    "extensions": ["ots"]
  },
  "application/vnd.oasis.opendocument.text": {
    "source": "iana",
    "compressible": false,
    "extensions": ["odt"]
  },
  "application/vnd.oasis.opendocument.text-master": {
    "source": "iana",
    "extensions": ["odm"]
  },
  "application/vnd.oasis.opendocument.text-template": {
    "source": "iana",
    "extensions": ["ott"]
  },
  "application/vnd.oasis.opendocument.text-web": {
    "source": "iana",
    "extensions": ["oth"]
  },
  "application/vnd.obn": {
    "source": "iana"
  },
  "application/vnd.oftn.l10n+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.contentaccessdownload+xml": {
    "source": "iana"
  },
  "application/vnd.oipf.contentaccessstreaming+xml": {
    "source": "iana"
  },
  "application/vnd.oipf.cspg-hexbinary": {
    "source": "iana"
  },
  "application/vnd.oipf.dae.svg+xml": {
    "source": "iana"
  },
  "application/vnd.oipf.dae.xhtml+xml": {
    "source": "iana"
  },
  "application/vnd.oipf.mippvcontrolmessage+xml": {
    "source": "iana"
  },
  "application/vnd.oipf.pae.gem": {
    "source": "iana"
  },
  "application/vnd.oipf.spdiscovery+xml": {
    "source": "iana"
  },
  "application/vnd.oipf.spdlist+xml": {
    "source": "iana"
  },
  "application/vnd.oipf.ueprofile+xml": {
    "source": "iana"
  },
  "application/vnd.oipf.userprofile+xml": {
    "source": "iana"
  },
  "application/vnd.olpc-sugar": {
    "source": "iana",
    "extensions": ["xo"]
  },
  "application/vnd.oma-scws-config": {
    "source": "iana"
  },
  "application/vnd.oma-scws-http-request": {
    "source": "iana"
  },
  "application/vnd.oma-scws-http-response": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.drm-trigger+xml": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.imd+xml": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.ltkm": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.notification+xml": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.provisioningtrigger": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.sgboot": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.sgdd+xml": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.sgdu": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.simple-symbol-container": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.smartcard-trigger+xml": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.sprov+xml": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.stkm": {
    "source": "iana"
  },
  "application/vnd.oma.cab-address-book+xml": {
    "source": "iana"
  },
  "application/vnd.oma.cab-feature-handler+xml": {
    "source": "iana"
  },
  "application/vnd.oma.cab-pcc+xml": {
    "source": "iana"
  },
  "application/vnd.oma.cab-subs-invite+xml": {
    "source": "iana"
  },
  "application/vnd.oma.cab-user-prefs+xml": {
    "source": "iana"
  },
  "application/vnd.oma.dcd": {
    "source": "iana"
  },
  "application/vnd.oma.dcdc": {
    "source": "iana"
  },
  "application/vnd.oma.dd2+xml": {
    "source": "iana",
    "extensions": ["dd2"]
  },
  "application/vnd.oma.drm.risd+xml": {
    "source": "iana"
  },
  "application/vnd.oma.group-usage-list+xml": {
    "source": "iana"
  },
  "application/vnd.oma.pal+xml": {
    "source": "iana"
  },
  "application/vnd.oma.poc.detailed-progress-report+xml": {
    "source": "iana"
  },
  "application/vnd.oma.poc.final-report+xml": {
    "source": "iana"
  },
  "application/vnd.oma.poc.groups+xml": {
    "source": "iana"
  },
  "application/vnd.oma.poc.invocation-descriptor+xml": {
    "source": "iana"
  },
  "application/vnd.oma.poc.optimized-progress-report+xml": {
    "source": "iana"
  },
  "application/vnd.oma.push": {
    "source": "iana"
  },
  "application/vnd.oma.scidm.messages+xml": {
    "source": "iana"
  },
  "application/vnd.oma.xcap-directory+xml": {
    "source": "iana"
  },
  "application/vnd.omads-email+xml": {
    "source": "iana"
  },
  "application/vnd.omads-file+xml": {
    "source": "iana"
  },
  "application/vnd.omads-folder+xml": {
    "source": "iana"
  },
  "application/vnd.omaloc-supl-init": {
    "source": "iana"
  },
  "application/vnd.openblox.game+xml": {
    "source": "iana"
  },
  "application/vnd.openblox.game-binary": {
    "source": "iana"
  },
  "application/vnd.openeye.oeb": {
    "source": "iana"
  },
  "application/vnd.openofficeorg.extension": {
    "source": "apache",
    "extensions": ["oxt"]
  },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.drawing+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml-template": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    "source": "iana",
    "compressible": false,
    "extensions": ["pptx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
    "source": "iana",
    "extensions": ["sldx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    "source": "iana",
    "extensions": ["ppsx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template": {
    "source": "apache",
    "extensions": ["potx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml-template": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    "source": "iana",
    "compressible": false,
    "extensions": ["xlsx"]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    "source": "apache",
    "extensions": ["xltx"]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.theme+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.vmldrawing": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml-template": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    "source": "iana",
    "compressible": false,
    "extensions": ["docx"]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    "source": "apache",
    "extensions": ["dotx"]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-package.core-properties+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-package.relationships+xml": {
    "source": "iana"
  },
  "application/vnd.oracle.resource+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.orange.indata": {
    "source": "iana"
  },
  "application/vnd.osa.netdeploy": {
    "source": "iana"
  },
  "application/vnd.osgeo.mapguide.package": {
    "source": "iana",
    "extensions": ["mgp"]
  },
  "application/vnd.osgi.bundle": {
    "source": "iana"
  },
  "application/vnd.osgi.dp": {
    "source": "iana",
    "extensions": ["dp"]
  },
  "application/vnd.osgi.subsystem": {
    "source": "iana",
    "extensions": ["esa"]
  },
  "application/vnd.otps.ct-kip+xml": {
    "source": "iana"
  },
  "application/vnd.oxli.countgraph": {
    "source": "iana"
  },
  "application/vnd.pagerduty+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.palm": {
    "source": "iana",
    "extensions": ["pdb","pqa","oprc"]
  },
  "application/vnd.panoply": {
    "source": "iana"
  },
  "application/vnd.paos+xml": {
    "source": "iana"
  },
  "application/vnd.paos.xml": {
    "source": "apache"
  },
  "application/vnd.pawaafile": {
    "source": "iana",
    "extensions": ["paw"]
  },
  "application/vnd.pcos": {
    "source": "iana"
  },
  "application/vnd.pg.format": {
    "source": "iana",
    "extensions": ["str"]
  },
  "application/vnd.pg.osasli": {
    "source": "iana",
    "extensions": ["ei6"]
  },
  "application/vnd.piaccess.application-licence": {
    "source": "iana"
  },
  "application/vnd.picsel": {
    "source": "iana",
    "extensions": ["efif"]
  },
  "application/vnd.pmi.widget": {
    "source": "iana",
    "extensions": ["wg"]
  },
  "application/vnd.poc.group-advertisement+xml": {
    "source": "iana"
  },
  "application/vnd.pocketlearn": {
    "source": "iana",
    "extensions": ["plf"]
  },
  "application/vnd.powerbuilder6": {
    "source": "iana",
    "extensions": ["pbd"]
  },
  "application/vnd.powerbuilder6-s": {
    "source": "iana"
  },
  "application/vnd.powerbuilder7": {
    "source": "iana"
  },
  "application/vnd.powerbuilder7-s": {
    "source": "iana"
  },
  "application/vnd.powerbuilder75": {
    "source": "iana"
  },
  "application/vnd.powerbuilder75-s": {
    "source": "iana"
  },
  "application/vnd.preminet": {
    "source": "iana"
  },
  "application/vnd.previewsystems.box": {
    "source": "iana",
    "extensions": ["box"]
  },
  "application/vnd.proteus.magazine": {
    "source": "iana",
    "extensions": ["mgz"]
  },
  "application/vnd.publishare-delta-tree": {
    "source": "iana",
    "extensions": ["qps"]
  },
  "application/vnd.pvi.ptid1": {
    "source": "iana",
    "extensions": ["ptid"]
  },
  "application/vnd.pwg-multiplexed": {
    "source": "iana"
  },
  "application/vnd.pwg-xhtml-print+xml": {
    "source": "iana"
  },
  "application/vnd.qualcomm.brew-app-res": {
    "source": "iana"
  },
  "application/vnd.quark.quarkxpress": {
    "source": "iana",
    "extensions": ["qxd","qxt","qwd","qwt","qxl","qxb"]
  },
  "application/vnd.quobject-quoxdocument": {
    "source": "iana"
  },
  "application/vnd.radisys.moml+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-audit+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-audit-conf+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-audit-conn+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-audit-dialog+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-audit-stream+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-conf+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-dialog+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-dialog-base+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-dialog-group+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-dialog-speech+xml": {
    "source": "iana"
  },
  "application/vnd.radisys.msml-dialog-transform+xml": {
    "source": "iana"
  },
  "application/vnd.rainstor.data": {
    "source": "iana"
  },
  "application/vnd.rapid": {
    "source": "iana"
  },
  "application/vnd.realvnc.bed": {
    "source": "iana",
    "extensions": ["bed"]
  },
  "application/vnd.recordare.musicxml": {
    "source": "iana",
    "extensions": ["mxl"]
  },
  "application/vnd.recordare.musicxml+xml": {
    "source": "iana",
    "extensions": ["musicxml"]
  },
  "application/vnd.renlearn.rlprint": {
    "source": "iana"
  },
  "application/vnd.rig.cryptonote": {
    "source": "iana",
    "extensions": ["cryptonote"]
  },
  "application/vnd.rim.cod": {
    "source": "apache",
    "extensions": ["cod"]
  },
  "application/vnd.rn-realmedia": {
    "source": "apache",
    "extensions": ["rm"]
  },
  "application/vnd.rn-realmedia-vbr": {
    "source": "apache",
    "extensions": ["rmvb"]
  },
  "application/vnd.route66.link66+xml": {
    "source": "iana",
    "extensions": ["link66"]
  },
  "application/vnd.rs-274x": {
    "source": "iana"
  },
  "application/vnd.ruckus.download": {
    "source": "iana"
  },
  "application/vnd.s3sms": {
    "source": "iana"
  },
  "application/vnd.sailingtracker.track": {
    "source": "iana",
    "extensions": ["st"]
  },
  "application/vnd.sbm.cid": {
    "source": "iana"
  },
  "application/vnd.sbm.mid2": {
    "source": "iana"
  },
  "application/vnd.scribus": {
    "source": "iana"
  },
  "application/vnd.sealed.3df": {
    "source": "iana"
  },
  "application/vnd.sealed.csf": {
    "source": "iana"
  },
  "application/vnd.sealed.doc": {
    "source": "iana"
  },
  "application/vnd.sealed.eml": {
    "source": "iana"
  },
  "application/vnd.sealed.mht": {
    "source": "iana"
  },
  "application/vnd.sealed.net": {
    "source": "iana"
  },
  "application/vnd.sealed.ppt": {
    "source": "iana"
  },
  "application/vnd.sealed.tiff": {
    "source": "iana"
  },
  "application/vnd.sealed.xls": {
    "source": "iana"
  },
  "application/vnd.sealedmedia.softseal.html": {
    "source": "iana"
  },
  "application/vnd.sealedmedia.softseal.pdf": {
    "source": "iana"
  },
  "application/vnd.seemail": {
    "source": "iana",
    "extensions": ["see"]
  },
  "application/vnd.sema": {
    "source": "iana",
    "extensions": ["sema"]
  },
  "application/vnd.semd": {
    "source": "iana",
    "extensions": ["semd"]
  },
  "application/vnd.semf": {
    "source": "iana",
    "extensions": ["semf"]
  },
  "application/vnd.shana.informed.formdata": {
    "source": "iana",
    "extensions": ["ifm"]
  },
  "application/vnd.shana.informed.formtemplate": {
    "source": "iana",
    "extensions": ["itp"]
  },
  "application/vnd.shana.informed.interchange": {
    "source": "iana",
    "extensions": ["iif"]
  },
  "application/vnd.shana.informed.package": {
    "source": "iana",
    "extensions": ["ipk"]
  },
  "application/vnd.simtech-mindmapper": {
    "source": "iana",
    "extensions": ["twd","twds"]
  },
  "application/vnd.siren+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.smaf": {
    "source": "iana",
    "extensions": ["mmf"]
  },
  "application/vnd.smart.notebook": {
    "source": "iana"
  },
  "application/vnd.smart.teacher": {
    "source": "iana",
    "extensions": ["teacher"]
  },
  "application/vnd.software602.filler.form+xml": {
    "source": "iana"
  },
  "application/vnd.software602.filler.form-xml-zip": {
    "source": "iana"
  },
  "application/vnd.solent.sdkm+xml": {
    "source": "iana",
    "extensions": ["sdkm","sdkd"]
  },
  "application/vnd.spotfire.dxp": {
    "source": "iana",
    "extensions": ["dxp"]
  },
  "application/vnd.spotfire.sfs": {
    "source": "iana",
    "extensions": ["sfs"]
  },
  "application/vnd.sss-cod": {
    "source": "iana"
  },
  "application/vnd.sss-dtf": {
    "source": "iana"
  },
  "application/vnd.sss-ntf": {
    "source": "iana"
  },
  "application/vnd.stardivision.calc": {
    "source": "apache",
    "extensions": ["sdc"]
  },
  "application/vnd.stardivision.draw": {
    "source": "apache",
    "extensions": ["sda"]
  },
  "application/vnd.stardivision.impress": {
    "source": "apache",
    "extensions": ["sdd"]
  },
  "application/vnd.stardivision.math": {
    "source": "apache",
    "extensions": ["smf"]
  },
  "application/vnd.stardivision.writer": {
    "source": "apache",
    "extensions": ["sdw","vor"]
  },
  "application/vnd.stardivision.writer-global": {
    "source": "apache",
    "extensions": ["sgl"]
  },
  "application/vnd.stepmania.package": {
    "source": "iana",
    "extensions": ["smzip"]
  },
  "application/vnd.stepmania.stepchart": {
    "source": "iana",
    "extensions": ["sm"]
  },
  "application/vnd.street-stream": {
    "source": "iana"
  },
  "application/vnd.sun.wadl+xml": {
    "source": "iana"
  },
  "application/vnd.sun.xml.calc": {
    "source": "apache",
    "extensions": ["sxc"]
  },
  "application/vnd.sun.xml.calc.template": {
    "source": "apache",
    "extensions": ["stc"]
  },
  "application/vnd.sun.xml.draw": {
    "source": "apache",
    "extensions": ["sxd"]
  },
  "application/vnd.sun.xml.draw.template": {
    "source": "apache",
    "extensions": ["std"]
  },
  "application/vnd.sun.xml.impress": {
    "source": "apache",
    "extensions": ["sxi"]
  },
  "application/vnd.sun.xml.impress.template": {
    "source": "apache",
    "extensions": ["sti"]
  },
  "application/vnd.sun.xml.math": {
    "source": "apache",
    "extensions": ["sxm"]
  },
  "application/vnd.sun.xml.writer": {
    "source": "apache",
    "extensions": ["sxw"]
  },
  "application/vnd.sun.xml.writer.global": {
    "source": "apache",
    "extensions": ["sxg"]
  },
  "application/vnd.sun.xml.writer.template": {
    "source": "apache",
    "extensions": ["stw"]
  },
  "application/vnd.sus-calendar": {
    "source": "iana",
    "extensions": ["sus","susp"]
  },
  "application/vnd.svd": {
    "source": "iana",
    "extensions": ["svd"]
  },
  "application/vnd.swiftview-ics": {
    "source": "iana"
  },
  "application/vnd.symbian.install": {
    "source": "apache",
    "extensions": ["sis","sisx"]
  },
  "application/vnd.syncml+xml": {
    "source": "iana",
    "extensions": ["xsm"]
  },
  "application/vnd.syncml.dm+wbxml": {
    "source": "iana",
    "extensions": ["bdm"]
  },
  "application/vnd.syncml.dm+xml": {
    "source": "iana",
    "extensions": ["xdm"]
  },
  "application/vnd.syncml.dm.notification": {
    "source": "iana"
  },
  "application/vnd.syncml.dmddf+wbxml": {
    "source": "iana"
  },
  "application/vnd.syncml.dmddf+xml": {
    "source": "iana"
  },
  "application/vnd.syncml.dmtnds+wbxml": {
    "source": "iana"
  },
  "application/vnd.syncml.dmtnds+xml": {
    "source": "iana"
  },
  "application/vnd.syncml.ds.notification": {
    "source": "iana"
  },
  "application/vnd.tao.intent-module-archive": {
    "source": "iana",
    "extensions": ["tao"]
  },
  "application/vnd.tcpdump.pcap": {
    "source": "iana",
    "extensions": ["pcap","cap","dmp"]
  },
  "application/vnd.tmd.mediaflex.api+xml": {
    "source": "iana"
  },
  "application/vnd.tml": {
    "source": "iana"
  },
  "application/vnd.tmobile-livetv": {
    "source": "iana",
    "extensions": ["tmo"]
  },
  "application/vnd.trid.tpt": {
    "source": "iana",
    "extensions": ["tpt"]
  },
  "application/vnd.triscape.mxs": {
    "source": "iana",
    "extensions": ["mxs"]
  },
  "application/vnd.trueapp": {
    "source": "iana",
    "extensions": ["tra"]
  },
  "application/vnd.truedoc": {
    "source": "iana"
  },
  "application/vnd.ubisoft.webplayer": {
    "source": "iana"
  },
  "application/vnd.ufdl": {
    "source": "iana",
    "extensions": ["ufd","ufdl"]
  },
  "application/vnd.uiq.theme": {
    "source": "iana",
    "extensions": ["utz"]
  },
  "application/vnd.umajin": {
    "source": "iana",
    "extensions": ["umj"]
  },
  "application/vnd.unity": {
    "source": "iana",
    "extensions": ["unityweb"]
  },
  "application/vnd.uoml+xml": {
    "source": "iana",
    "extensions": ["uoml"]
  },
  "application/vnd.uplanet.alert": {
    "source": "iana"
  },
  "application/vnd.uplanet.alert-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.bearer-choice": {
    "source": "iana"
  },
  "application/vnd.uplanet.bearer-choice-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.cacheop": {
    "source": "iana"
  },
  "application/vnd.uplanet.cacheop-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.channel": {
    "source": "iana"
  },
  "application/vnd.uplanet.channel-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.list": {
    "source": "iana"
  },
  "application/vnd.uplanet.list-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.listcmd": {
    "source": "iana"
  },
  "application/vnd.uplanet.listcmd-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.signal": {
    "source": "iana"
  },
  "application/vnd.uri-map": {
    "source": "iana"
  },
  "application/vnd.valve.source.material": {
    "source": "iana"
  },
  "application/vnd.vcx": {
    "source": "iana",
    "extensions": ["vcx"]
  },
  "application/vnd.vd-study": {
    "source": "iana"
  },
  "application/vnd.vectorworks": {
    "source": "iana"
  },
  "application/vnd.verimatrix.vcas": {
    "source": "iana"
  },
  "application/vnd.vidsoft.vidconference": {
    "source": "iana"
  },
  "application/vnd.visio": {
    "source": "iana",
    "extensions": ["vsd","vst","vss","vsw"]
  },
  "application/vnd.visionary": {
    "source": "iana",
    "extensions": ["vis"]
  },
  "application/vnd.vividence.scriptfile": {
    "source": "iana"
  },
  "application/vnd.vsf": {
    "source": "iana",
    "extensions": ["vsf"]
  },
  "application/vnd.wap.sic": {
    "source": "iana"
  },
  "application/vnd.wap.slc": {
    "source": "iana"
  },
  "application/vnd.wap.wbxml": {
    "source": "iana",
    "extensions": ["wbxml"]
  },
  "application/vnd.wap.wmlc": {
    "source": "iana",
    "extensions": ["wmlc"]
  },
  "application/vnd.wap.wmlscriptc": {
    "source": "iana",
    "extensions": ["wmlsc"]
  },
  "application/vnd.webturbo": {
    "source": "iana",
    "extensions": ["wtb"]
  },
  "application/vnd.wfa.p2p": {
    "source": "iana"
  },
  "application/vnd.wfa.wsc": {
    "source": "iana"
  },
  "application/vnd.windows.devicepairing": {
    "source": "iana"
  },
  "application/vnd.wmc": {
    "source": "iana"
  },
  "application/vnd.wmf.bootstrap": {
    "source": "iana"
  },
  "application/vnd.wolfram.mathematica": {
    "source": "iana"
  },
  "application/vnd.wolfram.mathematica.package": {
    "source": "iana"
  },
  "application/vnd.wolfram.player": {
    "source": "iana",
    "extensions": ["nbp"]
  },
  "application/vnd.wordperfect": {
    "source": "iana",
    "extensions": ["wpd"]
  },
  "application/vnd.wqd": {
    "source": "iana",
    "extensions": ["wqd"]
  },
  "application/vnd.wrq-hp3000-labelled": {
    "source": "iana"
  },
  "application/vnd.wt.stf": {
    "source": "iana",
    "extensions": ["stf"]
  },
  "application/vnd.wv.csp+wbxml": {
    "source": "iana"
  },
  "application/vnd.wv.csp+xml": {
    "source": "iana"
  },
  "application/vnd.wv.ssp+xml": {
    "source": "iana"
  },
  "application/vnd.xacml+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.xara": {
    "source": "iana",
    "extensions": ["xar"]
  },
  "application/vnd.xfdl": {
    "source": "iana",
    "extensions": ["xfdl"]
  },
  "application/vnd.xfdl.webform": {
    "source": "iana"
  },
  "application/vnd.xmi+xml": {
    "source": "iana"
  },
  "application/vnd.xmpie.cpkg": {
    "source": "iana"
  },
  "application/vnd.xmpie.dpkg": {
    "source": "iana"
  },
  "application/vnd.xmpie.plan": {
    "source": "iana"
  },
  "application/vnd.xmpie.ppkg": {
    "source": "iana"
  },
  "application/vnd.xmpie.xlim": {
    "source": "iana"
  },
  "application/vnd.yamaha.hv-dic": {
    "source": "iana",
    "extensions": ["hvd"]
  },
  "application/vnd.yamaha.hv-script": {
    "source": "iana",
    "extensions": ["hvs"]
  },
  "application/vnd.yamaha.hv-voice": {
    "source": "iana",
    "extensions": ["hvp"]
  },
  "application/vnd.yamaha.openscoreformat": {
    "source": "iana",
    "extensions": ["osf"]
  },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
    "source": "iana",
    "extensions": ["osfpvg"]
  },
  "application/vnd.yamaha.remote-setup": {
    "source": "iana"
  },
  "application/vnd.yamaha.smaf-audio": {
    "source": "iana",
    "extensions": ["saf"]
  },
  "application/vnd.yamaha.smaf-phrase": {
    "source": "iana",
    "extensions": ["spf"]
  },
  "application/vnd.yamaha.through-ngn": {
    "source": "iana"
  },
  "application/vnd.yamaha.tunnel-udpencap": {
    "source": "iana"
  },
  "application/vnd.yaoweme": {
    "source": "iana"
  },
  "application/vnd.yellowriver-custom-menu": {
    "source": "iana",
    "extensions": ["cmp"]
  },
  "application/vnd.zul": {
    "source": "iana",
    "extensions": ["zir","zirz"]
  },
  "application/vnd.zzazz.deck+xml": {
    "source": "iana",
    "extensions": ["zaz"]
  },
  "application/voicexml+xml": {
    "source": "iana",
    "extensions": ["vxml"]
  },
  "application/vq-rtcpxr": {
    "source": "iana"
  },
  "application/watcherinfo+xml": {
    "source": "iana"
  },
  "application/whoispp-query": {
    "source": "iana"
  },
  "application/whoispp-response": {
    "source": "iana"
  },
  "application/widget": {
    "source": "iana",
    "extensions": ["wgt"]
  },
  "application/winhlp": {
    "source": "apache",
    "extensions": ["hlp"]
  },
  "application/wita": {
    "source": "iana"
  },
  "application/wordperfect5.1": {
    "source": "iana"
  },
  "application/wsdl+xml": {
    "source": "iana",
    "extensions": ["wsdl"]
  },
  "application/wspolicy+xml": {
    "source": "iana",
    "extensions": ["wspolicy"]
  },
  "application/x-7z-compressed": {
    "source": "apache",
    "compressible": false,
    "extensions": ["7z"]
  },
  "application/x-abiword": {
    "source": "apache",
    "extensions": ["abw"]
  },
  "application/x-ace-compressed": {
    "source": "apache",
    "extensions": ["ace"]
  },
  "application/x-amf": {
    "source": "apache"
  },
  "application/x-apple-diskimage": {
    "source": "apache",
    "extensions": ["dmg"]
  },
  "application/x-authorware-bin": {
    "source": "apache",
    "extensions": ["aab","x32","u32","vox"]
  },
  "application/x-authorware-map": {
    "source": "apache",
    "extensions": ["aam"]
  },
  "application/x-authorware-seg": {
    "source": "apache",
    "extensions": ["aas"]
  },
  "application/x-bcpio": {
    "source": "apache",
    "extensions": ["bcpio"]
  },
  "application/x-bdoc": {
    "compressible": false,
    "extensions": ["bdoc"]
  },
  "application/x-bittorrent": {
    "source": "apache",
    "extensions": ["torrent"]
  },
  "application/x-blorb": {
    "source": "apache",
    "extensions": ["blb","blorb"]
  },
  "application/x-bzip": {
    "source": "apache",
    "compressible": false,
    "extensions": ["bz"]
  },
  "application/x-bzip2": {
    "source": "apache",
    "compressible": false,
    "extensions": ["bz2","boz"]
  },
  "application/x-cbr": {
    "source": "apache",
    "extensions": ["cbr","cba","cbt","cbz","cb7"]
  },
  "application/x-cdlink": {
    "source": "apache",
    "extensions": ["vcd"]
  },
  "application/x-cfs-compressed": {
    "source": "apache",
    "extensions": ["cfs"]
  },
  "application/x-chat": {
    "source": "apache",
    "extensions": ["chat"]
  },
  "application/x-chess-pgn": {
    "source": "apache",
    "extensions": ["pgn"]
  },
  "application/x-chrome-extension": {
    "extensions": ["crx"]
  },
  "application/x-cocoa": {
    "source": "nginx",
    "extensions": ["cco"]
  },
  "application/x-compress": {
    "source": "apache"
  },
  "application/x-conference": {
    "source": "apache",
    "extensions": ["nsc"]
  },
  "application/x-cpio": {
    "source": "apache",
    "extensions": ["cpio"]
  },
  "application/x-csh": {
    "source": "apache",
    "extensions": ["csh"]
  },
  "application/x-deb": {
    "compressible": false
  },
  "application/x-debian-package": {
    "source": "apache",
    "extensions": ["deb","udeb"]
  },
  "application/x-dgc-compressed": {
    "source": "apache",
    "extensions": ["dgc"]
  },
  "application/x-director": {
    "source": "apache",
    "extensions": ["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]
  },
  "application/x-doom": {
    "source": "apache",
    "extensions": ["wad"]
  },
  "application/x-dtbncx+xml": {
    "source": "apache",
    "extensions": ["ncx"]
  },
  "application/x-dtbook+xml": {
    "source": "apache",
    "extensions": ["dtb"]
  },
  "application/x-dtbresource+xml": {
    "source": "apache",
    "extensions": ["res"]
  },
  "application/x-dvi": {
    "source": "apache",
    "compressible": false,
    "extensions": ["dvi"]
  },
  "application/x-envoy": {
    "source": "apache",
    "extensions": ["evy"]
  },
  "application/x-eva": {
    "source": "apache",
    "extensions": ["eva"]
  },
  "application/x-font-bdf": {
    "source": "apache",
    "extensions": ["bdf"]
  },
  "application/x-font-dos": {
    "source": "apache"
  },
  "application/x-font-framemaker": {
    "source": "apache"
  },
  "application/x-font-ghostscript": {
    "source": "apache",
    "extensions": ["gsf"]
  },
  "application/x-font-libgrx": {
    "source": "apache"
  },
  "application/x-font-linux-psf": {
    "source": "apache",
    "extensions": ["psf"]
  },
  "application/x-font-otf": {
    "source": "apache",
    "compressible": true,
    "extensions": ["otf"]
  },
  "application/x-font-pcf": {
    "source": "apache",
    "extensions": ["pcf"]
  },
  "application/x-font-snf": {
    "source": "apache",
    "extensions": ["snf"]
  },
  "application/x-font-speedo": {
    "source": "apache"
  },
  "application/x-font-sunos-news": {
    "source": "apache"
  },
  "application/x-font-ttf": {
    "source": "apache",
    "compressible": true,
    "extensions": ["ttf","ttc"]
  },
  "application/x-font-type1": {
    "source": "apache",
    "extensions": ["pfa","pfb","pfm","afm"]
  },
  "application/x-font-vfont": {
    "source": "apache"
  },
  "application/x-freearc": {
    "source": "apache",
    "extensions": ["arc"]
  },
  "application/x-futuresplash": {
    "source": "apache",
    "extensions": ["spl"]
  },
  "application/x-gca-compressed": {
    "source": "apache",
    "extensions": ["gca"]
  },
  "application/x-glulx": {
    "source": "apache",
    "extensions": ["ulx"]
  },
  "application/x-gnumeric": {
    "source": "apache",
    "extensions": ["gnumeric"]
  },
  "application/x-gramps-xml": {
    "source": "apache",
    "extensions": ["gramps"]
  },
  "application/x-gtar": {
    "source": "apache",
    "extensions": ["gtar"]
  },
  "application/x-gzip": {
    "source": "apache"
  },
  "application/x-hdf": {
    "source": "apache",
    "extensions": ["hdf"]
  },
  "application/x-httpd-php": {
    "compressible": true,
    "extensions": ["php"]
  },
  "application/x-install-instructions": {
    "source": "apache",
    "extensions": ["install"]
  },
  "application/x-iso9660-image": {
    "source": "apache",
    "extensions": ["iso"]
  },
  "application/x-java-archive-diff": {
    "source": "nginx",
    "extensions": ["jardiff"]
  },
  "application/x-java-jnlp-file": {
    "source": "apache",
    "compressible": false,
    "extensions": ["jnlp"]
  },
  "application/x-javascript": {
    "compressible": true
  },
  "application/x-latex": {
    "source": "apache",
    "compressible": false,
    "extensions": ["latex"]
  },
  "application/x-lua-bytecode": {
    "extensions": ["luac"]
  },
  "application/x-lzh-compressed": {
    "source": "apache",
    "extensions": ["lzh","lha"]
  },
  "application/x-makeself": {
    "source": "nginx",
    "extensions": ["run"]
  },
  "application/x-mie": {
    "source": "apache",
    "extensions": ["mie"]
  },
  "application/x-mobipocket-ebook": {
    "source": "apache",
    "extensions": ["prc","mobi"]
  },
  "application/x-mpegurl": {
    "compressible": false
  },
  "application/x-ms-application": {
    "source": "apache",
    "extensions": ["application"]
  },
  "application/x-ms-shortcut": {
    "source": "apache",
    "extensions": ["lnk"]
  },
  "application/x-ms-wmd": {
    "source": "apache",
    "extensions": ["wmd"]
  },
  "application/x-ms-wmz": {
    "source": "apache",
    "extensions": ["wmz"]
  },
  "application/x-ms-xbap": {
    "source": "apache",
    "extensions": ["xbap"]
  },
  "application/x-msaccess": {
    "source": "apache",
    "extensions": ["mdb"]
  },
  "application/x-msbinder": {
    "source": "apache",
    "extensions": ["obd"]
  },
  "application/x-mscardfile": {
    "source": "apache",
    "extensions": ["crd"]
  },
  "application/x-msclip": {
    "source": "apache",
    "extensions": ["clp"]
  },
  "application/x-msdos-program": {
    "extensions": ["exe"]
  },
  "application/x-msdownload": {
    "source": "apache",
    "extensions": ["exe","dll","com","bat","msi"]
  },
  "application/x-msmediaview": {
    "source": "apache",
    "extensions": ["mvb","m13","m14"]
  },
  "application/x-msmetafile": {
    "source": "apache",
    "extensions": ["wmf","wmz","emf","emz"]
  },
  "application/x-msmoney": {
    "source": "apache",
    "extensions": ["mny"]
  },
  "application/x-mspublisher": {
    "source": "apache",
    "extensions": ["pub"]
  },
  "application/x-msschedule": {
    "source": "apache",
    "extensions": ["scd"]
  },
  "application/x-msterminal": {
    "source": "apache",
    "extensions": ["trm"]
  },
  "application/x-mswrite": {
    "source": "apache",
    "extensions": ["wri"]
  },
  "application/x-netcdf": {
    "source": "apache",
    "extensions": ["nc","cdf"]
  },
  "application/x-ns-proxy-autoconfig": {
    "compressible": true,
    "extensions": ["pac"]
  },
  "application/x-nzb": {
    "source": "apache",
    "extensions": ["nzb"]
  },
  "application/x-perl": {
    "source": "nginx",
    "extensions": ["pl","pm"]
  },
  "application/x-pilot": {
    "source": "nginx",
    "extensions": ["prc","pdb"]
  },
  "application/x-pkcs12": {
    "source": "apache",
    "compressible": false,
    "extensions": ["p12","pfx"]
  },
  "application/x-pkcs7-certificates": {
    "source": "apache",
    "extensions": ["p7b","spc"]
  },
  "application/x-pkcs7-certreqresp": {
    "source": "apache",
    "extensions": ["p7r"]
  },
  "application/x-rar-compressed": {
    "source": "apache",
    "compressible": false,
    "extensions": ["rar"]
  },
  "application/x-redhat-package-manager": {
    "source": "nginx",
    "extensions": ["rpm"]
  },
  "application/x-research-info-systems": {
    "source": "apache",
    "extensions": ["ris"]
  },
  "application/x-sea": {
    "source": "nginx",
    "extensions": ["sea"]
  },
  "application/x-sh": {
    "source": "apache",
    "compressible": true,
    "extensions": ["sh"]
  },
  "application/x-shar": {
    "source": "apache",
    "extensions": ["shar"]
  },
  "application/x-shockwave-flash": {
    "source": "apache",
    "compressible": false,
    "extensions": ["swf"]
  },
  "application/x-silverlight-app": {
    "source": "apache",
    "extensions": ["xap"]
  },
  "application/x-sql": {
    "source": "apache",
    "extensions": ["sql"]
  },
  "application/x-stuffit": {
    "source": "apache",
    "compressible": false,
    "extensions": ["sit"]
  },
  "application/x-stuffitx": {
    "source": "apache",
    "extensions": ["sitx"]
  },
  "application/x-subrip": {
    "source": "apache",
    "extensions": ["srt"]
  },
  "application/x-sv4cpio": {
    "source": "apache",
    "extensions": ["sv4cpio"]
  },
  "application/x-sv4crc": {
    "source": "apache",
    "extensions": ["sv4crc"]
  },
  "application/x-t3vm-image": {
    "source": "apache",
    "extensions": ["t3"]
  },
  "application/x-tads": {
    "source": "apache",
    "extensions": ["gam"]
  },
  "application/x-tar": {
    "source": "apache",
    "compressible": true,
    "extensions": ["tar"]
  },
  "application/x-tcl": {
    "source": "apache",
    "extensions": ["tcl","tk"]
  },
  "application/x-tex": {
    "source": "apache",
    "extensions": ["tex"]
  },
  "application/x-tex-tfm": {
    "source": "apache",
    "extensions": ["tfm"]
  },
  "application/x-texinfo": {
    "source": "apache",
    "extensions": ["texinfo","texi"]
  },
  "application/x-tgif": {
    "source": "apache",
    "extensions": ["obj"]
  },
  "application/x-ustar": {
    "source": "apache",
    "extensions": ["ustar"]
  },
  "application/x-wais-source": {
    "source": "apache",
    "extensions": ["src"]
  },
  "application/x-web-app-manifest+json": {
    "compressible": true,
    "extensions": ["webapp"]
  },
  "application/x-www-form-urlencoded": {
    "source": "iana",
    "compressible": true
  },
  "application/x-x509-ca-cert": {
    "source": "apache",
    "extensions": ["der","crt","pem"]
  },
  "application/x-xfig": {
    "source": "apache",
    "extensions": ["fig"]
  },
  "application/x-xliff+xml": {
    "source": "apache",
    "extensions": ["xlf"]
  },
  "application/x-xpinstall": {
    "source": "apache",
    "compressible": false,
    "extensions": ["xpi"]
  },
  "application/x-xz": {
    "source": "apache",
    "extensions": ["xz"]
  },
  "application/x-zmachine": {
    "source": "apache",
    "extensions": ["z1","z2","z3","z4","z5","z6","z7","z8"]
  },
  "application/x400-bp": {
    "source": "iana"
  },
  "application/xacml+xml": {
    "source": "iana"
  },
  "application/xaml+xml": {
    "source": "apache",
    "extensions": ["xaml"]
  },
  "application/xcap-att+xml": {
    "source": "iana"
  },
  "application/xcap-caps+xml": {
    "source": "iana"
  },
  "application/xcap-diff+xml": {
    "source": "iana",
    "extensions": ["xdf"]
  },
  "application/xcap-el+xml": {
    "source": "iana"
  },
  "application/xcap-error+xml": {
    "source": "iana"
  },
  "application/xcap-ns+xml": {
    "source": "iana"
  },
  "application/xcon-conference-info+xml": {
    "source": "iana"
  },
  "application/xcon-conference-info-diff+xml": {
    "source": "iana"
  },
  "application/xenc+xml": {
    "source": "iana",
    "extensions": ["xenc"]
  },
  "application/xhtml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xhtml","xht"]
  },
  "application/xhtml-voice+xml": {
    "source": "apache"
  },
  "application/xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xml","xsl","xsd","rng"]
  },
  "application/xml-dtd": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dtd"]
  },
  "application/xml-external-parsed-entity": {
    "source": "iana"
  },
  "application/xml-patch+xml": {
    "source": "iana"
  },
  "application/xmpp+xml": {
    "source": "iana"
  },
  "application/xop+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xop"]
  },
  "application/xproc+xml": {
    "source": "apache",
    "extensions": ["xpl"]
  },
  "application/xslt+xml": {
    "source": "iana",
    "extensions": ["xslt"]
  },
  "application/xspf+xml": {
    "source": "apache",
    "extensions": ["xspf"]
  },
  "application/xv+xml": {
    "source": "iana",
    "extensions": ["mxml","xhvml","xvml","xvm"]
  },
  "application/yang": {
    "source": "iana",
    "extensions": ["yang"]
  },
  "application/yin+xml": {
    "source": "iana",
    "extensions": ["yin"]
  },
  "application/zip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["zip"]
  },
  "application/zlib": {
    "source": "iana"
  },
  "audio/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "audio/32kadpcm": {
    "source": "iana"
  },
  "audio/3gpp": {
    "source": "iana"
  },
  "audio/3gpp2": {
    "source": "iana"
  },
  "audio/ac3": {
    "source": "iana"
  },
  "audio/adpcm": {
    "source": "apache",
    "extensions": ["adp"]
  },
  "audio/amr": {
    "source": "iana"
  },
  "audio/amr-wb": {
    "source": "iana"
  },
  "audio/amr-wb+": {
    "source": "iana"
  },
  "audio/aptx": {
    "source": "iana"
  },
  "audio/asc": {
    "source": "iana"
  },
  "audio/atrac-advanced-lossless": {
    "source": "iana"
  },
  "audio/atrac-x": {
    "source": "iana"
  },
  "audio/atrac3": {
    "source": "iana"
  },
  "audio/basic": {
    "source": "iana",
    "compressible": false,
    "extensions": ["au","snd"]
  },
  "audio/bv16": {
    "source": "iana"
  },
  "audio/bv32": {
    "source": "iana"
  },
  "audio/clearmode": {
    "source": "iana"
  },
  "audio/cn": {
    "source": "iana"
  },
  "audio/dat12": {
    "source": "iana"
  },
  "audio/dls": {
    "source": "iana"
  },
  "audio/dsr-es201108": {
    "source": "iana"
  },
  "audio/dsr-es202050": {
    "source": "iana"
  },
  "audio/dsr-es202211": {
    "source": "iana"
  },
  "audio/dsr-es202212": {
    "source": "iana"
  },
  "audio/dv": {
    "source": "iana"
  },
  "audio/dvi4": {
    "source": "iana"
  },
  "audio/eac3": {
    "source": "iana"
  },
  "audio/encaprtp": {
    "source": "iana"
  },
  "audio/evrc": {
    "source": "iana"
  },
  "audio/evrc-qcp": {
    "source": "iana"
  },
  "audio/evrc0": {
    "source": "iana"
  },
  "audio/evrc1": {
    "source": "iana"
  },
  "audio/evrcb": {
    "source": "iana"
  },
  "audio/evrcb0": {
    "source": "iana"
  },
  "audio/evrcb1": {
    "source": "iana"
  },
  "audio/evrcnw": {
    "source": "iana"
  },
  "audio/evrcnw0": {
    "source": "iana"
  },
  "audio/evrcnw1": {
    "source": "iana"
  },
  "audio/evrcwb": {
    "source": "iana"
  },
  "audio/evrcwb0": {
    "source": "iana"
  },
  "audio/evrcwb1": {
    "source": "iana"
  },
  "audio/evs": {
    "source": "iana"
  },
  "audio/fwdred": {
    "source": "iana"
  },
  "audio/g711-0": {
    "source": "iana"
  },
  "audio/g719": {
    "source": "iana"
  },
  "audio/g722": {
    "source": "iana"
  },
  "audio/g7221": {
    "source": "iana"
  },
  "audio/g723": {
    "source": "iana"
  },
  "audio/g726-16": {
    "source": "iana"
  },
  "audio/g726-24": {
    "source": "iana"
  },
  "audio/g726-32": {
    "source": "iana"
  },
  "audio/g726-40": {
    "source": "iana"
  },
  "audio/g728": {
    "source": "iana"
  },
  "audio/g729": {
    "source": "iana"
  },
  "audio/g7291": {
    "source": "iana"
  },
  "audio/g729d": {
    "source": "iana"
  },
  "audio/g729e": {
    "source": "iana"
  },
  "audio/gsm": {
    "source": "iana"
  },
  "audio/gsm-efr": {
    "source": "iana"
  },
  "audio/gsm-hr-08": {
    "source": "iana"
  },
  "audio/ilbc": {
    "source": "iana"
  },
  "audio/ip-mr_v2.5": {
    "source": "iana"
  },
  "audio/isac": {
    "source": "apache"
  },
  "audio/l16": {
    "source": "iana"
  },
  "audio/l20": {
    "source": "iana"
  },
  "audio/l24": {
    "source": "iana",
    "compressible": false
  },
  "audio/l8": {
    "source": "iana"
  },
  "audio/lpc": {
    "source": "iana"
  },
  "audio/midi": {
    "source": "apache",
    "extensions": ["mid","midi","kar","rmi"]
  },
  "audio/mobile-xmf": {
    "source": "iana"
  },
  "audio/mp4": {
    "source": "iana",
    "compressible": false,
    "extensions": ["m4a","mp4a"]
  },
  "audio/mp4a-latm": {
    "source": "iana"
  },
  "audio/mpa": {
    "source": "iana"
  },
  "audio/mpa-robust": {
    "source": "iana"
  },
  "audio/mpeg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["mpga","mp2","mp2a","mp3","m2a","m3a"]
  },
  "audio/mpeg4-generic": {
    "source": "iana"
  },
  "audio/musepack": {
    "source": "apache"
  },
  "audio/ogg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["oga","ogg","spx"]
  },
  "audio/opus": {
    "source": "iana"
  },
  "audio/parityfec": {
    "source": "iana"
  },
  "audio/pcma": {
    "source": "iana"
  },
  "audio/pcma-wb": {
    "source": "iana"
  },
  "audio/pcmu": {
    "source": "iana"
  },
  "audio/pcmu-wb": {
    "source": "iana"
  },
  "audio/prs.sid": {
    "source": "iana"
  },
  "audio/qcelp": {
    "source": "iana"
  },
  "audio/raptorfec": {
    "source": "iana"
  },
  "audio/red": {
    "source": "iana"
  },
  "audio/rtp-enc-aescm128": {
    "source": "iana"
  },
  "audio/rtp-midi": {
    "source": "iana"
  },
  "audio/rtploopback": {
    "source": "iana"
  },
  "audio/rtx": {
    "source": "iana"
  },
  "audio/s3m": {
    "source": "apache",
    "extensions": ["s3m"]
  },
  "audio/silk": {
    "source": "apache",
    "extensions": ["sil"]
  },
  "audio/smv": {
    "source": "iana"
  },
  "audio/smv-qcp": {
    "source": "iana"
  },
  "audio/smv0": {
    "source": "iana"
  },
  "audio/sp-midi": {
    "source": "iana"
  },
  "audio/speex": {
    "source": "iana"
  },
  "audio/t140c": {
    "source": "iana"
  },
  "audio/t38": {
    "source": "iana"
  },
  "audio/telephone-event": {
    "source": "iana"
  },
  "audio/tone": {
    "source": "iana"
  },
  "audio/uemclip": {
    "source": "iana"
  },
  "audio/ulpfec": {
    "source": "iana"
  },
  "audio/vdvi": {
    "source": "iana"
  },
  "audio/vmr-wb": {
    "source": "iana"
  },
  "audio/vnd.3gpp.iufp": {
    "source": "iana"
  },
  "audio/vnd.4sb": {
    "source": "iana"
  },
  "audio/vnd.audiokoz": {
    "source": "iana"
  },
  "audio/vnd.celp": {
    "source": "iana"
  },
  "audio/vnd.cisco.nse": {
    "source": "iana"
  },
  "audio/vnd.cmles.radio-events": {
    "source": "iana"
  },
  "audio/vnd.cns.anp1": {
    "source": "iana"
  },
  "audio/vnd.cns.inf1": {
    "source": "iana"
  },
  "audio/vnd.dece.audio": {
    "source": "iana",
    "extensions": ["uva","uvva"]
  },
  "audio/vnd.digital-winds": {
    "source": "iana",
    "extensions": ["eol"]
  },
  "audio/vnd.dlna.adts": {
    "source": "iana"
  },
  "audio/vnd.dolby.heaac.1": {
    "source": "iana"
  },
  "audio/vnd.dolby.heaac.2": {
    "source": "iana"
  },
  "audio/vnd.dolby.mlp": {
    "source": "iana"
  },
  "audio/vnd.dolby.mps": {
    "source": "iana"
  },
  "audio/vnd.dolby.pl2": {
    "source": "iana"
  },
  "audio/vnd.dolby.pl2x": {
    "source": "iana"
  },
  "audio/vnd.dolby.pl2z": {
    "source": "iana"
  },
  "audio/vnd.dolby.pulse.1": {
    "source": "iana"
  },
  "audio/vnd.dra": {
    "source": "iana",
    "extensions": ["dra"]
  },
  "audio/vnd.dts": {
    "source": "iana",
    "extensions": ["dts"]
  },
  "audio/vnd.dts.hd": {
    "source": "iana",
    "extensions": ["dtshd"]
  },
  "audio/vnd.dvb.file": {
    "source": "iana"
  },
  "audio/vnd.everad.plj": {
    "source": "iana"
  },
  "audio/vnd.hns.audio": {
    "source": "iana"
  },
  "audio/vnd.lucent.voice": {
    "source": "iana",
    "extensions": ["lvp"]
  },
  "audio/vnd.ms-playready.media.pya": {
    "source": "iana",
    "extensions": ["pya"]
  },
  "audio/vnd.nokia.mobile-xmf": {
    "source": "iana"
  },
  "audio/vnd.nortel.vbk": {
    "source": "iana"
  },
  "audio/vnd.nuera.ecelp4800": {
    "source": "iana",
    "extensions": ["ecelp4800"]
  },
  "audio/vnd.nuera.ecelp7470": {
    "source": "iana",
    "extensions": ["ecelp7470"]
  },
  "audio/vnd.nuera.ecelp9600": {
    "source": "iana",
    "extensions": ["ecelp9600"]
  },
  "audio/vnd.octel.sbc": {
    "source": "iana"
  },
  "audio/vnd.qcelp": {
    "source": "iana"
  },
  "audio/vnd.rhetorex.32kadpcm": {
    "source": "iana"
  },
  "audio/vnd.rip": {
    "source": "iana",
    "extensions": ["rip"]
  },
  "audio/vnd.rn-realaudio": {
    "compressible": false
  },
  "audio/vnd.sealedmedia.softseal.mpeg": {
    "source": "iana"
  },
  "audio/vnd.vmx.cvsd": {
    "source": "iana"
  },
  "audio/vnd.wave": {
    "compressible": false
  },
  "audio/vorbis": {
    "source": "iana",
    "compressible": false
  },
  "audio/vorbis-config": {
    "source": "iana"
  },
  "audio/wav": {
    "compressible": false,
    "extensions": ["wav"]
  },
  "audio/wave": {
    "compressible": false,
    "extensions": ["wav"]
  },
  "audio/webm": {
    "source": "apache",
    "compressible": false,
    "extensions": ["weba"]
  },
  "audio/x-aac": {
    "source": "apache",
    "compressible": false,
    "extensions": ["aac"]
  },
  "audio/x-aiff": {
    "source": "apache",
    "extensions": ["aif","aiff","aifc"]
  },
  "audio/x-caf": {
    "source": "apache",
    "compressible": false,
    "extensions": ["caf"]
  },
  "audio/x-flac": {
    "source": "apache",
    "extensions": ["flac"]
  },
  "audio/x-m4a": {
    "source": "nginx",
    "extensions": ["m4a"]
  },
  "audio/x-matroska": {
    "source": "apache",
    "extensions": ["mka"]
  },
  "audio/x-mpegurl": {
    "source": "apache",
    "extensions": ["m3u"]
  },
  "audio/x-ms-wax": {
    "source": "apache",
    "extensions": ["wax"]
  },
  "audio/x-ms-wma": {
    "source": "apache",
    "extensions": ["wma"]
  },
  "audio/x-pn-realaudio": {
    "source": "apache",
    "extensions": ["ram","ra"]
  },
  "audio/x-pn-realaudio-plugin": {
    "source": "apache",
    "extensions": ["rmp"]
  },
  "audio/x-realaudio": {
    "source": "nginx",
    "extensions": ["ra"]
  },
  "audio/x-tta": {
    "source": "apache"
  },
  "audio/x-wav": {
    "source": "apache",
    "extensions": ["wav"]
  },
  "audio/xm": {
    "source": "apache",
    "extensions": ["xm"]
  },
  "chemical/x-cdx": {
    "source": "apache",
    "extensions": ["cdx"]
  },
  "chemical/x-cif": {
    "source": "apache",
    "extensions": ["cif"]
  },
  "chemical/x-cmdf": {
    "source": "apache",
    "extensions": ["cmdf"]
  },
  "chemical/x-cml": {
    "source": "apache",
    "extensions": ["cml"]
  },
  "chemical/x-csml": {
    "source": "apache",
    "extensions": ["csml"]
  },
  "chemical/x-pdb": {
    "source": "apache"
  },
  "chemical/x-xyz": {
    "source": "apache",
    "extensions": ["xyz"]
  },
  "font/opentype": {
    "compressible": true,
    "extensions": ["otf"]
  },
  "image/bmp": {
    "source": "apache",
    "compressible": true,
    "extensions": ["bmp"]
  },
  "image/cgm": {
    "source": "iana",
    "extensions": ["cgm"]
  },
  "image/fits": {
    "source": "iana"
  },
  "image/g3fax": {
    "source": "iana",
    "extensions": ["g3"]
  },
  "image/gif": {
    "source": "iana",
    "compressible": false,
    "extensions": ["gif"]
  },
  "image/ief": {
    "source": "iana",
    "extensions": ["ief"]
  },
  "image/jp2": {
    "source": "iana"
  },
  "image/jpeg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["jpeg","jpg","jpe"]
  },
  "image/jpm": {
    "source": "iana"
  },
  "image/jpx": {
    "source": "iana"
  },
  "image/ktx": {
    "source": "iana",
    "extensions": ["ktx"]
  },
  "image/naplps": {
    "source": "iana"
  },
  "image/pjpeg": {
    "compressible": false
  },
  "image/png": {
    "source": "iana",
    "compressible": false,
    "extensions": ["png"]
  },
  "image/prs.btif": {
    "source": "iana",
    "extensions": ["btif"]
  },
  "image/prs.pti": {
    "source": "iana"
  },
  "image/pwg-raster": {
    "source": "iana"
  },
  "image/sgi": {
    "source": "apache",
    "extensions": ["sgi"]
  },
  "image/svg+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["svg","svgz"]
  },
  "image/t38": {
    "source": "iana"
  },
  "image/tiff": {
    "source": "iana",
    "compressible": false,
    "extensions": ["tiff","tif"]
  },
  "image/tiff-fx": {
    "source": "iana"
  },
  "image/vnd.adobe.photoshop": {
    "source": "iana",
    "compressible": true,
    "extensions": ["psd"]
  },
  "image/vnd.airzip.accelerator.azv": {
    "source": "iana"
  },
  "image/vnd.cns.inf2": {
    "source": "iana"
  },
  "image/vnd.dece.graphic": {
    "source": "iana",
    "extensions": ["uvi","uvvi","uvg","uvvg"]
  },
  "image/vnd.djvu": {
    "source": "iana",
    "extensions": ["djvu","djv"]
  },
  "image/vnd.dvb.subtitle": {
    "source": "iana",
    "extensions": ["sub"]
  },
  "image/vnd.dwg": {
    "source": "iana",
    "extensions": ["dwg"]
  },
  "image/vnd.dxf": {
    "source": "iana",
    "extensions": ["dxf"]
  },
  "image/vnd.fastbidsheet": {
    "source": "iana",
    "extensions": ["fbs"]
  },
  "image/vnd.fpx": {
    "source": "iana",
    "extensions": ["fpx"]
  },
  "image/vnd.fst": {
    "source": "iana",
    "extensions": ["fst"]
  },
  "image/vnd.fujixerox.edmics-mmr": {
    "source": "iana",
    "extensions": ["mmr"]
  },
  "image/vnd.fujixerox.edmics-rlc": {
    "source": "iana",
    "extensions": ["rlc"]
  },
  "image/vnd.globalgraphics.pgb": {
    "source": "iana"
  },
  "image/vnd.microsoft.icon": {
    "source": "iana"
  },
  "image/vnd.mix": {
    "source": "iana"
  },
  "image/vnd.mozilla.apng": {
    "source": "iana"
  },
  "image/vnd.ms-modi": {
    "source": "iana",
    "extensions": ["mdi"]
  },
  "image/vnd.ms-photo": {
    "source": "apache",
    "extensions": ["wdp"]
  },
  "image/vnd.net-fpx": {
    "source": "iana",
    "extensions": ["npx"]
  },
  "image/vnd.radiance": {
    "source": "iana"
  },
  "image/vnd.sealed.png": {
    "source": "iana"
  },
  "image/vnd.sealedmedia.softseal.gif": {
    "source": "iana"
  },
  "image/vnd.sealedmedia.softseal.jpg": {
    "source": "iana"
  },
  "image/vnd.svf": {
    "source": "iana"
  },
  "image/vnd.tencent.tap": {
    "source": "iana"
  },
  "image/vnd.valve.source.texture": {
    "source": "iana"
  },
  "image/vnd.wap.wbmp": {
    "source": "iana",
    "extensions": ["wbmp"]
  },
  "image/vnd.xiff": {
    "source": "iana",
    "extensions": ["xif"]
  },
  "image/vnd.zbrush.pcx": {
    "source": "iana"
  },
  "image/webp": {
    "source": "apache",
    "extensions": ["webp"]
  },
  "image/x-3ds": {
    "source": "apache",
    "extensions": ["3ds"]
  },
  "image/x-cmu-raster": {
    "source": "apache",
    "extensions": ["ras"]
  },
  "image/x-cmx": {
    "source": "apache",
    "extensions": ["cmx"]
  },
  "image/x-freehand": {
    "source": "apache",
    "extensions": ["fh","fhc","fh4","fh5","fh7"]
  },
  "image/x-icon": {
    "source": "apache",
    "compressible": true,
    "extensions": ["ico"]
  },
  "image/x-jng": {
    "source": "nginx",
    "extensions": ["jng"]
  },
  "image/x-mrsid-image": {
    "source": "apache",
    "extensions": ["sid"]
  },
  "image/x-ms-bmp": {
    "source": "nginx",
    "compressible": true,
    "extensions": ["bmp"]
  },
  "image/x-pcx": {
    "source": "apache",
    "extensions": ["pcx"]
  },
  "image/x-pict": {
    "source": "apache",
    "extensions": ["pic","pct"]
  },
  "image/x-portable-anymap": {
    "source": "apache",
    "extensions": ["pnm"]
  },
  "image/x-portable-bitmap": {
    "source": "apache",
    "extensions": ["pbm"]
  },
  "image/x-portable-graymap": {
    "source": "apache",
    "extensions": ["pgm"]
  },
  "image/x-portable-pixmap": {
    "source": "apache",
    "extensions": ["ppm"]
  },
  "image/x-rgb": {
    "source": "apache",
    "extensions": ["rgb"]
  },
  "image/x-tga": {
    "source": "apache",
    "extensions": ["tga"]
  },
  "image/x-xbitmap": {
    "source": "apache",
    "extensions": ["xbm"]
  },
  "image/x-xcf": {
    "compressible": false
  },
  "image/x-xpixmap": {
    "source": "apache",
    "extensions": ["xpm"]
  },
  "image/x-xwindowdump": {
    "source": "apache",
    "extensions": ["xwd"]
  },
  "message/cpim": {
    "source": "iana"
  },
  "message/delivery-status": {
    "source": "iana"
  },
  "message/disposition-notification": {
    "source": "iana"
  },
  "message/external-body": {
    "source": "iana"
  },
  "message/feedback-report": {
    "source": "iana"
  },
  "message/global": {
    "source": "iana"
  },
  "message/global-delivery-status": {
    "source": "iana"
  },
  "message/global-disposition-notification": {
    "source": "iana"
  },
  "message/global-headers": {
    "source": "iana"
  },
  "message/http": {
    "source": "iana",
    "compressible": false
  },
  "message/imdn+xml": {
    "source": "iana",
    "compressible": true
  },
  "message/news": {
    "source": "iana"
  },
  "message/partial": {
    "source": "iana",
    "compressible": false
  },
  "message/rfc822": {
    "source": "iana",
    "compressible": true,
    "extensions": ["eml","mime"]
  },
  "message/s-http": {
    "source": "iana"
  },
  "message/sip": {
    "source": "iana"
  },
  "message/sipfrag": {
    "source": "iana"
  },
  "message/tracking-status": {
    "source": "iana"
  },
  "message/vnd.si.simp": {
    "source": "iana"
  },
  "message/vnd.wfa.wsc": {
    "source": "iana"
  },
  "model/iges": {
    "source": "iana",
    "compressible": false,
    "extensions": ["igs","iges"]
  },
  "model/mesh": {
    "source": "iana",
    "compressible": false,
    "extensions": ["msh","mesh","silo"]
  },
  "model/vnd.collada+xml": {
    "source": "iana",
    "extensions": ["dae"]
  },
  "model/vnd.dwf": {
    "source": "iana",
    "extensions": ["dwf"]
  },
  "model/vnd.flatland.3dml": {
    "source": "iana"
  },
  "model/vnd.gdl": {
    "source": "iana",
    "extensions": ["gdl"]
  },
  "model/vnd.gs-gdl": {
    "source": "apache"
  },
  "model/vnd.gs.gdl": {
    "source": "iana"
  },
  "model/vnd.gtw": {
    "source": "iana",
    "extensions": ["gtw"]
  },
  "model/vnd.moml+xml": {
    "source": "iana"
  },
  "model/vnd.mts": {
    "source": "iana",
    "extensions": ["mts"]
  },
  "model/vnd.opengex": {
    "source": "iana"
  },
  "model/vnd.parasolid.transmit.binary": {
    "source": "iana"
  },
  "model/vnd.parasolid.transmit.text": {
    "source": "iana"
  },
  "model/vnd.rosette.annotated-data-model": {
    "source": "iana"
  },
  "model/vnd.valve.source.compiled-map": {
    "source": "iana"
  },
  "model/vnd.vtu": {
    "source": "iana",
    "extensions": ["vtu"]
  },
  "model/vrml": {
    "source": "iana",
    "compressible": false,
    "extensions": ["wrl","vrml"]
  },
  "model/x3d+binary": {
    "source": "apache",
    "compressible": false,
    "extensions": ["x3db","x3dbz"]
  },
  "model/x3d+fastinfoset": {
    "source": "iana"
  },
  "model/x3d+vrml": {
    "source": "apache",
    "compressible": false,
    "extensions": ["x3dv","x3dvz"]
  },
  "model/x3d+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["x3d","x3dz"]
  },
  "model/x3d-vrml": {
    "source": "iana"
  },
  "multipart/alternative": {
    "source": "iana",
    "compressible": false
  },
  "multipart/appledouble": {
    "source": "iana"
  },
  "multipart/byteranges": {
    "source": "iana"
  },
  "multipart/digest": {
    "source": "iana"
  },
  "multipart/encrypted": {
    "source": "iana",
    "compressible": false
  },
  "multipart/form-data": {
    "source": "iana",
    "compressible": false
  },
  "multipart/header-set": {
    "source": "iana"
  },
  "multipart/mixed": {
    "source": "iana",
    "compressible": false
  },
  "multipart/parallel": {
    "source": "iana"
  },
  "multipart/related": {
    "source": "iana",
    "compressible": false
  },
  "multipart/report": {
    "source": "iana"
  },
  "multipart/signed": {
    "source": "iana",
    "compressible": false
  },
  "multipart/voice-message": {
    "source": "iana"
  },
  "multipart/x-mixed-replace": {
    "source": "iana"
  },
  "text/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "text/cache-manifest": {
    "source": "iana",
    "compressible": true,
    "extensions": ["appcache","manifest"]
  },
  "text/calendar": {
    "source": "iana",
    "extensions": ["ics","ifb"]
  },
  "text/calender": {
    "compressible": true
  },
  "text/cmd": {
    "compressible": true
  },
  "text/coffeescript": {
    "extensions": ["coffee","litcoffee"]
  },
  "text/css": {
    "source": "iana",
    "compressible": true,
    "extensions": ["css"]
  },
  "text/csv": {
    "source": "iana",
    "compressible": true,
    "extensions": ["csv"]
  },
  "text/csv-schema": {
    "source": "iana"
  },
  "text/directory": {
    "source": "iana"
  },
  "text/dns": {
    "source": "iana"
  },
  "text/ecmascript": {
    "source": "iana"
  },
  "text/encaprtp": {
    "source": "iana"
  },
  "text/enriched": {
    "source": "iana"
  },
  "text/fwdred": {
    "source": "iana"
  },
  "text/grammar-ref-list": {
    "source": "iana"
  },
  "text/hjson": {
    "extensions": ["hjson"]
  },
  "text/html": {
    "source": "iana",
    "compressible": true,
    "extensions": ["html","htm","shtml"]
  },
  "text/jade": {
    "extensions": ["jade"]
  },
  "text/javascript": {
    "source": "iana",
    "compressible": true
  },
  "text/jcr-cnd": {
    "source": "iana"
  },
  "text/jsx": {
    "compressible": true,
    "extensions": ["jsx"]
  },
  "text/less": {
    "extensions": ["less"]
  },
  "text/markdown": {
    "source": "iana"
  },
  "text/mathml": {
    "source": "nginx",
    "extensions": ["mml"]
  },
  "text/mizar": {
    "source": "iana"
  },
  "text/n3": {
    "source": "iana",
    "compressible": true,
    "extensions": ["n3"]
  },
  "text/parameters": {
    "source": "iana"
  },
  "text/parityfec": {
    "source": "iana"
  },
  "text/plain": {
    "source": "iana",
    "compressible": true,
    "extensions": ["txt","text","conf","def","list","log","in","ini"]
  },
  "text/provenance-notation": {
    "source": "iana"
  },
  "text/prs.fallenstein.rst": {
    "source": "iana"
  },
  "text/prs.lines.tag": {
    "source": "iana",
    "extensions": ["dsc"]
  },
  "text/raptorfec": {
    "source": "iana"
  },
  "text/red": {
    "source": "iana"
  },
  "text/rfc822-headers": {
    "source": "iana"
  },
  "text/richtext": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rtx"]
  },
  "text/rtf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rtf"]
  },
  "text/rtp-enc-aescm128": {
    "source": "iana"
  },
  "text/rtploopback": {
    "source": "iana"
  },
  "text/rtx": {
    "source": "iana"
  },
  "text/sgml": {
    "source": "iana",
    "extensions": ["sgml","sgm"]
  },
  "text/slim": {
    "extensions": ["slim","slm"]
  },
  "text/stylus": {
    "extensions": ["stylus","styl"]
  },
  "text/t140": {
    "source": "iana"
  },
  "text/tab-separated-values": {
    "source": "iana",
    "compressible": true,
    "extensions": ["tsv"]
  },
  "text/troff": {
    "source": "iana",
    "extensions": ["t","tr","roff","man","me","ms"]
  },
  "text/turtle": {
    "source": "iana",
    "extensions": ["ttl"]
  },
  "text/ulpfec": {
    "source": "iana"
  },
  "text/uri-list": {
    "source": "iana",
    "compressible": true,
    "extensions": ["uri","uris","urls"]
  },
  "text/vcard": {
    "source": "iana",
    "compressible": true,
    "extensions": ["vcard"]
  },
  "text/vnd.a": {
    "source": "iana"
  },
  "text/vnd.abc": {
    "source": "iana"
  },
  "text/vnd.curl": {
    "source": "iana",
    "extensions": ["curl"]
  },
  "text/vnd.curl.dcurl": {
    "source": "apache",
    "extensions": ["dcurl"]
  },
  "text/vnd.curl.mcurl": {
    "source": "apache",
    "extensions": ["mcurl"]
  },
  "text/vnd.curl.scurl": {
    "source": "apache",
    "extensions": ["scurl"]
  },
  "text/vnd.debian.copyright": {
    "source": "iana"
  },
  "text/vnd.dmclientscript": {
    "source": "iana"
  },
  "text/vnd.dvb.subtitle": {
    "source": "iana",
    "extensions": ["sub"]
  },
  "text/vnd.esmertec.theme-descriptor": {
    "source": "iana"
  },
  "text/vnd.fly": {
    "source": "iana",
    "extensions": ["fly"]
  },
  "text/vnd.fmi.flexstor": {
    "source": "iana",
    "extensions": ["flx"]
  },
  "text/vnd.graphviz": {
    "source": "iana",
    "extensions": ["gv"]
  },
  "text/vnd.in3d.3dml": {
    "source": "iana",
    "extensions": ["3dml"]
  },
  "text/vnd.in3d.spot": {
    "source": "iana",
    "extensions": ["spot"]
  },
  "text/vnd.iptc.newsml": {
    "source": "iana"
  },
  "text/vnd.iptc.nitf": {
    "source": "iana"
  },
  "text/vnd.latex-z": {
    "source": "iana"
  },
  "text/vnd.motorola.reflex": {
    "source": "iana"
  },
  "text/vnd.ms-mediapackage": {
    "source": "iana"
  },
  "text/vnd.net2phone.commcenter.command": {
    "source": "iana"
  },
  "text/vnd.radisys.msml-basic-layout": {
    "source": "iana"
  },
  "text/vnd.si.uricatalogue": {
    "source": "iana"
  },
  "text/vnd.sun.j2me.app-descriptor": {
    "source": "iana",
    "extensions": ["jad"]
  },
  "text/vnd.trolltech.linguist": {
    "source": "iana"
  },
  "text/vnd.wap.si": {
    "source": "iana"
  },
  "text/vnd.wap.sl": {
    "source": "iana"
  },
  "text/vnd.wap.wml": {
    "source": "iana",
    "extensions": ["wml"]
  },
  "text/vnd.wap.wmlscript": {
    "source": "iana",
    "extensions": ["wmls"]
  },
  "text/vtt": {
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["vtt"]
  },
  "text/x-asm": {
    "source": "apache",
    "extensions": ["s","asm"]
  },
  "text/x-c": {
    "source": "apache",
    "extensions": ["c","cc","cxx","cpp","h","hh","dic"]
  },
  "text/x-component": {
    "source": "nginx",
    "extensions": ["htc"]
  },
  "text/x-fortran": {
    "source": "apache",
    "extensions": ["f","for","f77","f90"]
  },
  "text/x-gwt-rpc": {
    "compressible": true
  },
  "text/x-handlebars-template": {
    "extensions": ["hbs"]
  },
  "text/x-java-source": {
    "source": "apache",
    "extensions": ["java"]
  },
  "text/x-jquery-tmpl": {
    "compressible": true
  },
  "text/x-lua": {
    "extensions": ["lua"]
  },
  "text/x-markdown": {
    "compressible": true,
    "extensions": ["markdown","md","mkd"]
  },
  "text/x-nfo": {
    "source": "apache",
    "extensions": ["nfo"]
  },
  "text/x-opml": {
    "source": "apache",
    "extensions": ["opml"]
  },
  "text/x-pascal": {
    "source": "apache",
    "extensions": ["p","pas"]
  },
  "text/x-processing": {
    "compressible": true,
    "extensions": ["pde"]
  },
  "text/x-sass": {
    "extensions": ["sass"]
  },
  "text/x-scss": {
    "extensions": ["scss"]
  },
  "text/x-setext": {
    "source": "apache",
    "extensions": ["etx"]
  },
  "text/x-sfv": {
    "source": "apache",
    "extensions": ["sfv"]
  },
  "text/x-suse-ymp": {
    "compressible": true,
    "extensions": ["ymp"]
  },
  "text/x-uuencode": {
    "source": "apache",
    "extensions": ["uu"]
  },
  "text/x-vcalendar": {
    "source": "apache",
    "extensions": ["vcs"]
  },
  "text/x-vcard": {
    "source": "apache",
    "extensions": ["vcf"]
  },
  "text/xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xml"]
  },
  "text/xml-external-parsed-entity": {
    "source": "iana"
  },
  "text/yaml": {
    "extensions": ["yaml","yml"]
  },
  "video/1d-interleaved-parityfec": {
    "source": "apache"
  },
  "video/3gpp": {
    "source": "apache",
    "extensions": ["3gp","3gpp"]
  },
  "video/3gpp-tt": {
    "source": "apache"
  },
  "video/3gpp2": {
    "source": "apache",
    "extensions": ["3g2"]
  },
  "video/bmpeg": {
    "source": "apache"
  },
  "video/bt656": {
    "source": "apache"
  },
  "video/celb": {
    "source": "apache"
  },
  "video/dv": {
    "source": "apache"
  },
  "video/h261": {
    "source": "apache",
    "extensions": ["h261"]
  },
  "video/h263": {
    "source": "apache",
    "extensions": ["h263"]
  },
  "video/h263-1998": {
    "source": "apache"
  },
  "video/h263-2000": {
    "source": "apache"
  },
  "video/h264": {
    "source": "apache",
    "extensions": ["h264"]
  },
  "video/h264-rcdo": {
    "source": "apache"
  },
  "video/h264-svc": {
    "source": "apache"
  },
  "video/jpeg": {
    "source": "apache",
    "extensions": ["jpgv"]
  },
  "video/jpeg2000": {
    "source": "apache"
  },
  "video/jpm": {
    "source": "apache",
    "extensions": ["jpm","jpgm"]
  },
  "video/mj2": {
    "source": "apache",
    "extensions": ["mj2","mjp2"]
  },
  "video/mp1s": {
    "source": "apache"
  },
  "video/mp2p": {
    "source": "apache"
  },
  "video/mp2t": {
    "source": "apache",
    "extensions": ["ts"]
  },
  "video/mp4": {
    "source": "apache",
    "compressible": false,
    "extensions": ["mp4","mp4v","mpg4"]
  },
  "video/mp4v-es": {
    "source": "apache"
  },
  "video/mpeg": {
    "source": "apache",
    "compressible": false,
    "extensions": ["mpeg","mpg","mpe","m1v","m2v"]
  },
  "video/mpeg4-generic": {
    "source": "apache"
  },
  "video/mpv": {
    "source": "apache"
  },
  "video/nv": {
    "source": "apache"
  },
  "video/ogg": {
    "source": "apache",
    "compressible": false,
    "extensions": ["ogv"]
  },
  "video/parityfec": {
    "source": "apache"
  },
  "video/pointer": {
    "source": "apache"
  },
  "video/quicktime": {
    "source": "apache",
    "compressible": false,
    "extensions": ["qt","mov"]
  },
  "video/raw": {
    "source": "apache"
  },
  "video/rtp-enc-aescm128": {
    "source": "apache"
  },
  "video/rtx": {
    "source": "apache"
  },
  "video/smpte292m": {
    "source": "apache"
  },
  "video/ulpfec": {
    "source": "apache"
  },
  "video/vc1": {
    "source": "apache"
  },
  "video/vnd.cctv": {
    "source": "apache"
  },
  "video/vnd.dece.hd": {
    "source": "apache",
    "extensions": ["uvh","uvvh"]
  },
  "video/vnd.dece.mobile": {
    "source": "apache",
    "extensions": ["uvm","uvvm"]
  },
  "video/vnd.dece.mp4": {
    "source": "apache"
  },
  "video/vnd.dece.pd": {
    "source": "apache",
    "extensions": ["uvp","uvvp"]
  },
  "video/vnd.dece.sd": {
    "source": "apache",
    "extensions": ["uvs","uvvs"]
  },
  "video/vnd.dece.video": {
    "source": "apache",
    "extensions": ["uvv","uvvv"]
  },
  "video/vnd.directv.mpeg": {
    "source": "apache"
  },
  "video/vnd.directv.mpeg-tts": {
    "source": "apache"
  },
  "video/vnd.dlna.mpeg-tts": {
    "source": "apache"
  },
  "video/vnd.dvb.file": {
    "source": "apache",
    "extensions": ["dvb"]
  },
  "video/vnd.fvt": {
    "source": "apache",
    "extensions": ["fvt"]
  },
  "video/vnd.hns.video": {
    "source": "apache"
  },
  "video/vnd.iptvforum.1dparityfec-1010": {
    "source": "apache"
  },
  "video/vnd.iptvforum.1dparityfec-2005": {
    "source": "apache"
  },
  "video/vnd.iptvforum.2dparityfec-1010": {
    "source": "apache"
  },
  "video/vnd.iptvforum.2dparityfec-2005": {
    "source": "apache"
  },
  "video/vnd.iptvforum.ttsavc": {
    "source": "apache"
  },
  "video/vnd.iptvforum.ttsmpeg2": {
    "source": "apache"
  },
  "video/vnd.motorola.video": {
    "source": "apache"
  },
  "video/vnd.motorola.videop": {
    "source": "apache"
  },
  "video/vnd.mpegurl": {
    "source": "apache",
    "extensions": ["mxu","m4u"]
  },
  "video/vnd.ms-playready.media.pyv": {
    "source": "apache",
    "extensions": ["pyv"]
  },
  "video/vnd.nokia.interleaved-multimedia": {
    "source": "apache"
  },
  "video/vnd.nokia.videovoip": {
    "source": "apache"
  },
  "video/vnd.objectvideo": {
    "source": "apache"
  },
  "video/vnd.sealed.mpeg1": {
    "source": "apache"
  },
  "video/vnd.sealed.mpeg4": {
    "source": "apache"
  },
  "video/vnd.sealed.swf": {
    "source": "apache"
  },
  "video/vnd.sealedmedia.softseal.mov": {
    "source": "apache"
  },
  "video/vnd.uvvu.mp4": {
    "source": "apache",
    "extensions": ["uvu","uvvu"]
  },
  "video/vnd.vivo": {
    "source": "apache",
    "extensions": ["viv"]
  },
  "video/webm": {
    "source": "apache",
    "compressible": false,
    "extensions": ["webm"]
  },
  "video/x-f4v": {
    "source": "apache",
    "extensions": ["f4v"]
  },
  "video/x-fli": {
    "source": "apache",
    "extensions": ["fli"]
  },
  "video/x-flv": {
    "source": "apache",
    "compressible": false,
    "extensions": ["flv"]
  },
  "video/x-m4v": {
    "source": "apache",
    "extensions": ["m4v"]
  },
  "video/x-matroska": {
    "source": "apache",
    "compressible": false,
    "extensions": ["mkv","mk3d","mks"]
  },
  "video/x-mng": {
    "source": "apache",
    "extensions": ["mng"]
  },
  "video/x-ms-asf": {
    "source": "apache",
    "extensions": ["asf","asx"]
  },
  "video/x-ms-vob": {
    "source": "apache",
    "extensions": ["vob"]
  },
  "video/x-ms-wm": {
    "source": "apache",
    "extensions": ["wm"]
  },
  "video/x-ms-wmv": {
    "source": "apache",
    "compressible": false,
    "extensions": ["wmv"]
  },
  "video/x-ms-wmx": {
    "source": "apache",
    "extensions": ["wmx"]
  },
  "video/x-ms-wvx": {
    "source": "apache",
    "extensions": ["wvx"]
  },
  "video/x-msvideo": {
    "source": "apache",
    "extensions": ["avi"]
  },
  "video/x-sgi-movie": {
    "source": "apache",
    "extensions": ["movie"]
  },
  "video/x-smv": {
    "source": "apache",
    "extensions": ["smv"]
  },
  "x-conference/x-cooltalk": {
    "source": "apache",
    "extensions": ["ice"]
  },
  "x-shader/x-fragment": {
    "compressible": true
  },
  "x-shader/x-vertex": {
    "compressible": true
  }
}

},{}],169:[function(require,module,exports){
module.exports=require("./db.json");

},{"./db.json":168}],170:[function(require,module,exports){
"use strict";function charset(e){if(!e||"string"!=typeof e)return!1;var t=extractTypeRegExp.exec(e),r=t&&db[t[1].toLowerCase()];return r&&r.charset?r.charset:t&&textTypeRegExp.test(t[1])?"UTF-8":!1}function contentType(e){if(!e||"string"!=typeof e)return!1;var t=-1===e.indexOf("/")?exports.lookup(e):e;if(!t)return!1;if(-1===t.indexOf("charset")){var r=exports.charset(t);r&&(t+="; charset="+r.toLowerCase())}return t}function extension(e){if(!e||"string"!=typeof e)return!1;var t=extractTypeRegExp.exec(e),r=t&&exports.extensions[t[1].toLowerCase()];return r&&r.length?r[0]:!1}function lookup(e){if(!e||"string"!=typeof e)return!1;var t=extname("x."+e).toLowerCase().substr(1);return t?exports.types[t]||!1:!1}function populateMaps(e,t){var r=["nginx","apache",void 0,"iana"];Object.keys(db).forEach(function(n){var o=db[n],s=o.extensions;if(s&&s.length){e[n]=s;for(var p=0;p<s.length;p++){var a=s[p];if(t[a]){var i=r.indexOf(db[t[a]].source),x=r.indexOf(o.source);if("application/octet-stream"!==t[a]&&i>x||i===x&&"application/"===t[a].substr(0,12))continue}t[a]=n}}})}var db=require("mime-db"),extname=require("path").extname,extractTypeRegExp=/^\s*([^;\s]*)(?:;|\s|$)/,textTypeRegExp=/^text\//i;exports.charset=charset,exports.charsets={lookup:charset},exports.contentType=contentType,exports.extension=extension,exports.extensions=Object.create(null),exports.lookup=lookup,exports.types=Object.create(null),populateMaps(exports.extensions,exports.types);

},{"mime-db":169,"path":197}],171:[function(require,module,exports){
(function (process){
function Mime(){this.types=Object.create(null),this.extensions=Object.create(null)}var path=require("path"),fs=require("fs");Mime.prototype.define=function(e){for(var t in e){for(var i=e[t],s=0;s<i.length;s++)process.env.DEBUG_MIME&&this.types[i]&&console.warn(this._loading.replace(/.*\//,""),'changes "'+i[s]+'" extension type from '+this.types[i]+" to "+t),this.types[i[s]]=t;this.extensions[t]||(this.extensions[t]=i[0])}},Mime.prototype.load=function(e){this._loading=e;var t={},i=fs.readFileSync(e,"ascii"),s=i.split(/[\r\n]+/);s.forEach(function(e){var i=e.replace(/\s*#.*|^\s*|\s*$/g,"").split(/\s+/);t[i.shift()]=i}),this.define(t),this._loading=null},Mime.prototype.lookup=function(e,t){var i=e.replace(/.*[\.\/\\]/,"").toLowerCase();return this.types[i]||t||this.default_type},Mime.prototype.extension=function(e){var t=e.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();return this.extensions[t]};var mime=new Mime;mime.define(require("./types.json")),mime.default_type=mime.lookup("bin"),mime.Mime=Mime,mime.charsets={lookup:function(e,t){return/^text\//.test(e)?"UTF-8":t}},module.exports=mime;

}).call(this,require('_process'))
},{"./types.json":172,"_process":201,"fs":58,"path":197}],172:[function(require,module,exports){
module.exports={"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomsvc+xml":["atomsvc"],"application/ccxml+xml":["ccxml"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mdp"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma"],"application/emma+xml":["emma"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/font-tdpfr":["pfr"],"application/font-woff":["woff"],"application/font-woff2":["woff2"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/java-archive":["jar"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/prs.cww":["cww"],"application/pskc+xml":["pskcxml"],"application/rdf+xml":["rdf"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/vnd.3gpp.pic-bw-large":["plb"],"application/vnd.3gpp.pic-bw-small":["psb"],"application/vnd.3gpp.pic-bw-var":["pvb"],"application/vnd.3gpp2.tcap":["tcap"],"application/vnd.3m.post-it-notes":["pwn"],"application/vnd.accpac.simply.aso":["aso"],"application/vnd.accpac.simply.imp":["imp"],"application/vnd.acucobol":["acu"],"application/vnd.acucorp":["atc","acutc"],"application/vnd.adobe.air-application-installer-package+zip":["air"],"application/vnd.adobe.formscentral.fcdt":["fcdt"],"application/vnd.adobe.fxp":["fxp","fxpl"],"application/vnd.adobe.xdp+xml":["xdp"],"application/vnd.adobe.xfdf":["xfdf"],"application/vnd.ahead.space":["ahead"],"application/vnd.airzip.filesecure.azf":["azf"],"application/vnd.airzip.filesecure.azs":["azs"],"application/vnd.amazon.ebook":["azw"],"application/vnd.americandynamics.acc":["acc"],"application/vnd.amiga.ami":["ami"],"application/vnd.android.package-archive":["apk"],"application/vnd.anser-web-certificate-issue-initiation":["cii"],"application/vnd.anser-web-funds-transfer-initiation":["fti"],"application/vnd.antix.game-component":["atx"],"application/vnd.apple.installer+xml":["mpkg"],"application/vnd.apple.mpegurl":["m3u8"],"application/vnd.aristanetworks.swi":["swi"],"application/vnd.astraea-software.iota":["iota"],"application/vnd.audiograph":["aep"],"application/vnd.blueice.multipass":["mpm"],"application/vnd.bmi":["bmi"],"application/vnd.businessobjects":["rep"],"application/vnd.chemdraw+xml":["cdxml"],"application/vnd.chipnuts.karaoke-mmd":["mmd"],"application/vnd.cinderella":["cdy"],"application/vnd.claymore":["cla"],"application/vnd.cloanto.rp9":["rp9"],"application/vnd.clonk.c4group":["c4g","c4d","c4f","c4p","c4u"],"application/vnd.cluetrust.cartomobile-config":["c11amc"],"application/vnd.cluetrust.cartomobile-config-pkg":["c11amz"],"application/vnd.commonspace":["csp"],"application/vnd.contact.cmsg":["cdbcmsg"],"application/vnd.cosmocaller":["cmc"],"application/vnd.crick.clicker":["clkx"],"application/vnd.crick.clicker.keyboard":["clkk"],"application/vnd.crick.clicker.palette":["clkp"],"application/vnd.crick.clicker.template":["clkt"],"application/vnd.crick.clicker.wordbank":["clkw"],"application/vnd.criticaltools.wbs+xml":["wbs"],"application/vnd.ctc-posml":["pml"],"application/vnd.cups-ppd":["ppd"],"application/vnd.curl.car":["car"],"application/vnd.curl.pcurl":["pcurl"],"application/vnd.dart":["dart"],"application/vnd.data-vision.rdz":["rdz"],"application/vnd.dece.data":["uvf","uvvf","uvd","uvvd"],"application/vnd.dece.ttml+xml":["uvt","uvvt"],"application/vnd.dece.unspecified":["uvx","uvvx"],"application/vnd.dece.zip":["uvz","uvvz"],"application/vnd.denovo.fcselayout-link":["fe_launch"],"application/vnd.dna":["dna"],"application/vnd.dolby.mlp":["mlp"],"application/vnd.dpgraph":["dpg"],"application/vnd.dreamfactory":["dfac"],"application/vnd.ds-keypoint":["kpxx"],"application/vnd.dvb.ait":["ait"],"application/vnd.dvb.service":["svc"],"application/vnd.dynageo":["geo"],"application/vnd.ecowin.chart":["mag"],"application/vnd.enliven":["nml"],"application/vnd.epson.esf":["esf"],"application/vnd.epson.msf":["msf"],"application/vnd.epson.quickanime":["qam"],"application/vnd.epson.salt":["slt"],"application/vnd.epson.ssf":["ssf"],"application/vnd.eszigno3+xml":["es3","et3"],"application/vnd.ezpix-album":["ez2"],"application/vnd.ezpix-package":["ez3"],"application/vnd.fdf":["fdf"],"application/vnd.fdsn.mseed":["mseed"],"application/vnd.fdsn.seed":["seed","dataless"],"application/vnd.flographit":["gph"],"application/vnd.fluxtime.clip":["ftc"],"application/vnd.framemaker":["fm","frame","maker","book"],"application/vnd.frogans.fnc":["fnc"],"application/vnd.frogans.ltf":["ltf"],"application/vnd.fsc.weblaunch":["fsc"],"application/vnd.fujitsu.oasys":["oas"],"application/vnd.fujitsu.oasys2":["oa2"],"application/vnd.fujitsu.oasys3":["oa3"],"application/vnd.fujitsu.oasysgp":["fg5"],"application/vnd.fujitsu.oasysprs":["bh2"],"application/vnd.fujixerox.ddd":["ddd"],"application/vnd.fujixerox.docuworks":["xdw"],"application/vnd.fujixerox.docuworks.binder":["xbd"],"application/vnd.fuzzysheet":["fzs"],"application/vnd.genomatix.tuxedo":["txd"],"application/vnd.geogebra.file":["ggb"],"application/vnd.geogebra.tool":["ggt"],"application/vnd.geometry-explorer":["gex","gre"],"application/vnd.geonext":["gxt"],"application/vnd.geoplan":["g2w"],"application/vnd.geospace":["g3w"],"application/vnd.gmx":["gmx"],"application/vnd.google-earth.kml+xml":["kml"],"application/vnd.google-earth.kmz":["kmz"],"application/vnd.grafeq":["gqf","gqs"],"application/vnd.groove-account":["gac"],"application/vnd.groove-help":["ghf"],"application/vnd.groove-identity-message":["gim"],"application/vnd.groove-injector":["grv"],"application/vnd.groove-tool-message":["gtm"],"application/vnd.groove-tool-template":["tpl"],"application/vnd.groove-vcard":["vcg"],"application/vnd.hal+xml":["hal"],"application/vnd.handheld-entertainment+xml":["zmm"],"application/vnd.hbci":["hbci"],"application/vnd.hhe.lesson-player":["les"],"application/vnd.hp-hpgl":["hpgl"],"application/vnd.hp-hpid":["hpid"],"application/vnd.hp-hps":["hps"],"application/vnd.hp-jlyt":["jlt"],"application/vnd.hp-pcl":["pcl"],"application/vnd.hp-pclxl":["pclxl"],"application/vnd.ibm.minipay":["mpy"],"application/vnd.ibm.modcap":["afp","listafp","list3820"],"application/vnd.ibm.rights-management":["irm"],"application/vnd.ibm.secure-container":["sc"],"application/vnd.iccprofile":["icc","icm"],"application/vnd.igloader":["igl"],"application/vnd.immervision-ivp":["ivp"],"application/vnd.immervision-ivu":["ivu"],"application/vnd.insors.igm":["igm"],"application/vnd.intercon.formnet":["xpw","xpx"],"application/vnd.intergeo":["i2g"],"application/vnd.intu.qbo":["qbo"],"application/vnd.intu.qfx":["qfx"],"application/vnd.ipunplugged.rcprofile":["rcprofile"],"application/vnd.irepository.package+xml":["irp"],"application/vnd.is-xpr":["xpr"],"application/vnd.isac.fcs":["fcs"],"application/vnd.jam":["jam"],"application/vnd.jcp.javame.midlet-rms":["rms"],"application/vnd.jisp":["jisp"],"application/vnd.joost.joda-archive":["joda"],"application/vnd.kahootz":["ktz","ktr"],"application/vnd.kde.karbon":["karbon"],"application/vnd.kde.kchart":["chrt"],"application/vnd.kde.kformula":["kfo"],"application/vnd.kde.kivio":["flw"],"application/vnd.kde.kontour":["kon"],"application/vnd.kde.kpresenter":["kpr","kpt"],"application/vnd.kde.kspread":["ksp"],"application/vnd.kde.kword":["kwd","kwt"],"application/vnd.kenameaapp":["htke"],"application/vnd.kidspiration":["kia"],"application/vnd.kinar":["kne","knp"],"application/vnd.koan":["skp","skd","skt","skm"],"application/vnd.kodak-descriptor":["sse"],"application/vnd.las.las+xml":["lasxml"],"application/vnd.llamagraphics.life-balance.desktop":["lbd"],"application/vnd.llamagraphics.life-balance.exchange+xml":["lbe"],"application/vnd.lotus-1-2-3":["123"],"application/vnd.lotus-approach":["apr"],"application/vnd.lotus-freelance":["pre"],"application/vnd.lotus-notes":["nsf"],"application/vnd.lotus-organizer":["org"],"application/vnd.lotus-screencam":["scm"],"application/vnd.lotus-wordpro":["lwp"],"application/vnd.macports.portpkg":["portpkg"],"application/vnd.mcd":["mcd"],"application/vnd.medcalcdata":["mc1"],"application/vnd.mediastation.cdkey":["cdkey"],"application/vnd.mfer":["mwf"],"application/vnd.mfmp":["mfm"],"application/vnd.micrografx.flo":["flo"],"application/vnd.micrografx.igx":["igx"],"application/vnd.mif":["mif"],"application/vnd.mobius.daf":["daf"],"application/vnd.mobius.dis":["dis"],"application/vnd.mobius.mbk":["mbk"],"application/vnd.mobius.mqy":["mqy"],"application/vnd.mobius.msl":["msl"],"application/vnd.mobius.plc":["plc"],"application/vnd.mobius.txf":["txf"],"application/vnd.mophun.application":["mpn"],"application/vnd.mophun.certificate":["mpc"],"application/vnd.mozilla.xul+xml":["xul"],"application/vnd.ms-artgalry":["cil"],"application/vnd.ms-cab-compressed":["cab"],"application/vnd.ms-excel":["xls","xlm","xla","xlc","xlt","xlw"],"application/vnd.ms-excel.addin.macroenabled.12":["xlam"],"application/vnd.ms-excel.sheet.binary.macroenabled.12":["xlsb"],"application/vnd.ms-excel.sheet.macroenabled.12":["xlsm"],"application/vnd.ms-excel.template.macroenabled.12":["xltm"],"application/vnd.ms-fontobject":["eot"],"application/vnd.ms-htmlhelp":["chm"],"application/vnd.ms-ims":["ims"],"application/vnd.ms-lrm":["lrm"],"application/vnd.ms-officetheme":["thmx"],"application/vnd.ms-pki.seccat":["cat"],"application/vnd.ms-pki.stl":["stl"],"application/vnd.ms-powerpoint":["ppt","pps","pot"],"application/vnd.ms-powerpoint.addin.macroenabled.12":["ppam"],"application/vnd.ms-powerpoint.presentation.macroenabled.12":["pptm"],"application/vnd.ms-powerpoint.slide.macroenabled.12":["sldm"],"application/vnd.ms-powerpoint.slideshow.macroenabled.12":["ppsm"],"application/vnd.ms-powerpoint.template.macroenabled.12":["potm"],"application/vnd.ms-project":["mpp","mpt"],"application/vnd.ms-word.document.macroenabled.12":["docm"],"application/vnd.ms-word.template.macroenabled.12":["dotm"],"application/vnd.ms-works":["wps","wks","wcm","wdb"],"application/vnd.ms-wpl":["wpl"],"application/vnd.ms-xpsdocument":["xps"],"application/vnd.mseq":["mseq"],"application/vnd.musician":["mus"],"application/vnd.muvee.style":["msty"],"application/vnd.mynfc":["taglet"],"application/vnd.neurolanguage.nlu":["nlu"],"application/vnd.nitf":["ntf","nitf"],"application/vnd.noblenet-directory":["nnd"],"application/vnd.noblenet-sealer":["nns"],"application/vnd.noblenet-web":["nnw"],"application/vnd.nokia.n-gage.data":["ngdat"],"application/vnd.nokia.radio-preset":["rpst"],"application/vnd.nokia.radio-presets":["rpss"],"application/vnd.novadigm.edm":["edm"],"application/vnd.novadigm.edx":["edx"],"application/vnd.novadigm.ext":["ext"],"application/vnd.oasis.opendocument.chart":["odc"],"application/vnd.oasis.opendocument.chart-template":["otc"],"application/vnd.oasis.opendocument.database":["odb"],"application/vnd.oasis.opendocument.formula":["odf"],"application/vnd.oasis.opendocument.formula-template":["odft"],"application/vnd.oasis.opendocument.graphics":["odg"],"application/vnd.oasis.opendocument.graphics-template":["otg"],"application/vnd.oasis.opendocument.image":["odi"],"application/vnd.oasis.opendocument.image-template":["oti"],"application/vnd.oasis.opendocument.presentation":["odp"],"application/vnd.oasis.opendocument.presentation-template":["otp"],"application/vnd.oasis.opendocument.spreadsheet":["ods"],"application/vnd.oasis.opendocument.spreadsheet-template":["ots"],"application/vnd.oasis.opendocument.text":["odt"],"application/vnd.oasis.opendocument.text-master":["odm"],"application/vnd.oasis.opendocument.text-template":["ott"],"application/vnd.oasis.opendocument.text-web":["oth"],"application/vnd.olpc-sugar":["xo"],"application/vnd.oma.dd2+xml":["dd2"],"application/vnd.openofficeorg.extension":["oxt"],"application/vnd.openxmlformats-officedocument.presentationml.presentation":["pptx"],"application/vnd.openxmlformats-officedocument.presentationml.slide":["sldx"],"application/vnd.openxmlformats-officedocument.presentationml.slideshow":["ppsx"],"application/vnd.openxmlformats-officedocument.presentationml.template":["potx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":["xlsx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.template":["xltx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":["docx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.template":["dotx"],"application/vnd.osgeo.mapguide.package":["mgp"],"application/vnd.osgi.dp":["dp"],"application/vnd.osgi.subsystem":["esa"],"application/vnd.palm":["pdb","pqa","oprc"],"application/vnd.pawaafile":["paw"],"application/vnd.pg.format":["str"],"application/vnd.pg.osasli":["ei6"],"application/vnd.picsel":["efif"],"application/vnd.pmi.widget":["wg"],"application/vnd.pocketlearn":["plf"],"application/vnd.powerbuilder6":["pbd"],"application/vnd.previewsystems.box":["box"],"application/vnd.proteus.magazine":["mgz"],"application/vnd.publishare-delta-tree":["qps"],"application/vnd.pvi.ptid1":["ptid"],"application/vnd.quark.quarkxpress":["qxd","qxt","qwd","qwt","qxl","qxb"],"application/vnd.realvnc.bed":["bed"],"application/vnd.recordare.musicxml":["mxl"],"application/vnd.recordare.musicxml+xml":["musicxml"],"application/vnd.rig.cryptonote":["cryptonote"],"application/vnd.rim.cod":["cod"],"application/vnd.rn-realmedia":["rm"],"application/vnd.rn-realmedia-vbr":["rmvb"],"application/vnd.route66.link66+xml":["link66"],"application/vnd.sailingtracker.track":["st"],"application/vnd.seemail":["see"],"application/vnd.sema":["sema"],"application/vnd.semd":["semd"],"application/vnd.semf":["semf"],"application/vnd.shana.informed.formdata":["ifm"],"application/vnd.shana.informed.formtemplate":["itp"],"application/vnd.shana.informed.interchange":["iif"],"application/vnd.shana.informed.package":["ipk"],"application/vnd.simtech-mindmapper":["twd","twds"],"application/vnd.smaf":["mmf"],"application/vnd.smart.teacher":["teacher"],"application/vnd.solent.sdkm+xml":["sdkm","sdkd"],"application/vnd.spotfire.dxp":["dxp"],"application/vnd.spotfire.sfs":["sfs"],"application/vnd.stardivision.calc":["sdc"],"application/vnd.stardivision.draw":["sda"],"application/vnd.stardivision.impress":["sdd"],"application/vnd.stardivision.math":["smf"],"application/vnd.stardivision.writer":["sdw","vor"],"application/vnd.stardivision.writer-global":["sgl"],"application/vnd.stepmania.package":["smzip"],"application/vnd.stepmania.stepchart":["sm"],"application/vnd.sun.xml.calc":["sxc"],"application/vnd.sun.xml.calc.template":["stc"],"application/vnd.sun.xml.draw":["sxd"],"application/vnd.sun.xml.draw.template":["std"],"application/vnd.sun.xml.impress":["sxi"],"application/vnd.sun.xml.impress.template":["sti"],"application/vnd.sun.xml.math":["sxm"],"application/vnd.sun.xml.writer":["sxw"],"application/vnd.sun.xml.writer.global":["sxg"],"application/vnd.sun.xml.writer.template":["stw"],"application/vnd.sus-calendar":["sus","susp"],"application/vnd.svd":["svd"],"application/vnd.symbian.install":["sis","sisx"],"application/vnd.syncml+xml":["xsm"],"application/vnd.syncml.dm+wbxml":["bdm"],"application/vnd.syncml.dm+xml":["xdm"],"application/vnd.tao.intent-module-archive":["tao"],"application/vnd.tcpdump.pcap":["pcap","cap","dmp"],"application/vnd.tmobile-livetv":["tmo"],"application/vnd.trid.tpt":["tpt"],"application/vnd.triscape.mxs":["mxs"],"application/vnd.trueapp":["tra"],"application/vnd.ufdl":["ufd","ufdl"],"application/vnd.uiq.theme":["utz"],"application/vnd.umajin":["umj"],"application/vnd.unity":["unityweb"],"application/vnd.uoml+xml":["uoml"],"application/vnd.vcx":["vcx"],"application/vnd.visio":["vsd","vst","vss","vsw"],"application/vnd.visionary":["vis"],"application/vnd.vsf":["vsf"],"application/vnd.wap.wbxml":["wbxml"],"application/vnd.wap.wmlc":["wmlc"],"application/vnd.wap.wmlscriptc":["wmlsc"],"application/vnd.webturbo":["wtb"],"application/vnd.wolfram.player":["nbp"],"application/vnd.wordperfect":["wpd"],"application/vnd.wqd":["wqd"],"application/vnd.wt.stf":["stf"],"application/vnd.xara":["xar"],"application/vnd.xfdl":["xfdl"],"application/vnd.yamaha.hv-dic":["hvd"],"application/vnd.yamaha.hv-script":["hvs"],"application/vnd.yamaha.hv-voice":["hvp"],"application/vnd.yamaha.openscoreformat":["osf"],"application/vnd.yamaha.openscoreformat.osfpvg+xml":["osfpvg"],"application/vnd.yamaha.smaf-audio":["saf"],"application/vnd.yamaha.smaf-phrase":["spf"],"application/vnd.yellowriver-custom-menu":["cmp"],"application/vnd.zul":["zir","zirz"],"application/vnd.zzazz.deck+xml":["zaz"],"application/voicexml+xml":["vxml"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/x-7z-compressed":["7z"],"application/x-abiword":["abw"],"application/x-ace-compressed":["ace"],"application/x-apple-diskimage":["dmg"],"application/x-authorware-bin":["aab","x32","u32","vox"],"application/x-authorware-map":["aam"],"application/x-authorware-seg":["aas"],"application/x-bcpio":["bcpio"],"application/x-bittorrent":["torrent"],"application/x-blorb":["blb","blorb"],"application/x-bzip":["bz"],"application/x-bzip2":["bz2","boz"],"application/x-cbr":["cbr","cba","cbt","cbz","cb7"],"application/x-cdlink":["vcd"],"application/x-cfs-compressed":["cfs"],"application/x-chat":["chat"],"application/x-chess-pgn":["pgn"],"application/x-chrome-extension":["crx"],"application/x-conference":["nsc"],"application/x-cpio":["cpio"],"application/x-csh":["csh"],"application/x-debian-package":["deb","udeb"],"application/x-dgc-compressed":["dgc"],"application/x-director":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"],"application/x-doom":["wad"],"application/x-dtbncx+xml":["ncx"],"application/x-dtbook+xml":["dtb"],"application/x-dtbresource+xml":["res"],"application/x-dvi":["dvi"],"application/x-envoy":["evy"],"application/x-eva":["eva"],"application/x-font-bdf":["bdf"],"application/x-font-ghostscript":["gsf"],"application/x-font-linux-psf":["psf"],"application/x-font-otf":["otf"],"application/x-font-pcf":["pcf"],"application/x-font-snf":["snf"],"application/x-font-ttf":["ttf","ttc"],"application/x-font-type1":["pfa","pfb","pfm","afm"],"application/x-freearc":["arc"],"application/x-futuresplash":["spl"],"application/x-gca-compressed":["gca"],"application/x-glulx":["ulx"],"application/x-gnumeric":["gnumeric"],"application/x-gramps-xml":["gramps"],"application/x-gtar":["gtar"],"application/x-hdf":["hdf"],"application/x-install-instructions":["install"],"application/x-iso9660-image":["iso"],"application/x-java-jnlp-file":["jnlp"],"application/x-latex":["latex"],"application/x-lua-bytecode":["luac"],"application/x-lzh-compressed":["lzh","lha"],"application/x-mie":["mie"],"application/x-mobipocket-ebook":["prc","mobi"],"application/x-ms-application":["application"],"application/x-ms-shortcut":["lnk"],"application/x-ms-wmd":["wmd"],"application/x-ms-wmz":["wmz"],"application/x-ms-xbap":["xbap"],"application/x-msaccess":["mdb"],"application/x-msbinder":["obd"],"application/x-mscardfile":["crd"],"application/x-msclip":["clp"],"application/x-msdownload":["exe","dll","com","bat","msi"],"application/x-msmediaview":["mvb","m13","m14"],"application/x-msmetafile":["wmf","wmz","emf","emz"],"application/x-msmoney":["mny"],"application/x-mspublisher":["pub"],"application/x-msschedule":["scd"],"application/x-msterminal":["trm"],"application/x-mswrite":["wri"],"application/x-netcdf":["nc","cdf"],"application/x-nzb":["nzb"],"application/x-pkcs12":["p12","pfx"],"application/x-pkcs7-certificates":["p7b","spc"],"application/x-pkcs7-certreqresp":["p7r"],"application/x-rar-compressed":["rar"],"application/x-research-info-systems":["ris"],"application/x-sh":["sh"],"application/x-shar":["shar"],"application/x-shockwave-flash":["swf"],"application/x-silverlight-app":["xap"],"application/x-sql":["sql"],"application/x-stuffit":["sit"],"application/x-stuffitx":["sitx"],"application/x-subrip":["srt"],"application/x-sv4cpio":["sv4cpio"],"application/x-sv4crc":["sv4crc"],"application/x-t3vm-image":["t3"],"application/x-tads":["gam"],"application/x-tar":["tar"],"application/x-tcl":["tcl"],"application/x-tex":["tex"],"application/x-tex-tfm":["tfm"],"application/x-texinfo":["texinfo","texi"],"application/x-tgif":["obj"],"application/x-ustar":["ustar"],"application/x-wais-source":["src"],"application/x-web-app-manifest+json":["webapp"],"application/x-x509-ca-cert":["der","crt"],"application/x-xfig":["fig"],"application/x-xliff+xml":["xlf"],"application/x-xpinstall":["xpi"],"application/x-xz":["xz"],"application/x-zmachine":["z1","z2","z3","z4","z5","z6","z7","z8"],"application/xaml+xml":["xaml"],"application/xcap-diff+xml":["xdf"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xml":["xml","xsl","xsd"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mp4":["mp4a","m4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/vnd.dece.audio":["uva","uvva"],"audio/vnd.digital-winds":["eol"],"audio/vnd.dra":["dra"],"audio/vnd.dts":["dts"],"audio/vnd.dts.hd":["dtshd"],"audio/vnd.lucent.voice":["lvp"],"audio/vnd.ms-playready.media.pya":["pya"],"audio/vnd.nuera.ecelp4800":["ecelp4800"],"audio/vnd.nuera.ecelp7470":["ecelp7470"],"audio/vnd.nuera.ecelp9600":["ecelp9600"],"audio/vnd.rip":["rip"],"audio/webm":["weba"],"audio/x-aac":["aac"],"audio/x-aiff":["aif","aiff","aifc"],"audio/x-caf":["caf"],"audio/x-flac":["flac"],"audio/x-matroska":["mka"],"audio/x-mpegurl":["m3u"],"audio/x-ms-wax":["wax"],"audio/x-ms-wma":["wma"],"audio/x-pn-realaudio":["ram","ra"],"audio/x-pn-realaudio-plugin":["rmp"],"audio/x-wav":["wav"],"audio/xm":["xm"],"chemical/x-cdx":["cdx"],"chemical/x-cif":["cif"],"chemical/x-cmdf":["cmdf"],"chemical/x-cml":["cml"],"chemical/x-csml":["csml"],"chemical/x-xyz":["xyz"],"font/opentype":["otf"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/g3fax":["g3"],"image/gif":["gif"],"image/ief":["ief"],"image/jpeg":["jpeg","jpg","jpe"],"image/ktx":["ktx"],"image/png":["png"],"image/prs.btif":["btif"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/tiff":["tiff","tif"],"image/vnd.adobe.photoshop":["psd"],"image/vnd.dece.graphic":["uvi","uvvi","uvg","uvvg"],"image/vnd.djvu":["djvu","djv"],"image/vnd.dvb.subtitle":["sub"],"image/vnd.dwg":["dwg"],"image/vnd.dxf":["dxf"],"image/vnd.fastbidsheet":["fbs"],"image/vnd.fpx":["fpx"],"image/vnd.fst":["fst"],"image/vnd.fujixerox.edmics-mmr":["mmr"],"image/vnd.fujixerox.edmics-rlc":["rlc"],"image/vnd.ms-modi":["mdi"],"image/vnd.ms-photo":["wdp"],"image/vnd.net-fpx":["npx"],"image/vnd.wap.wbmp":["wbmp"],"image/vnd.xiff":["xif"],"image/webp":["webp"],"image/x-3ds":["3ds"],"image/x-cmu-raster":["ras"],"image/x-cmx":["cmx"],"image/x-freehand":["fh","fhc","fh4","fh5","fh7"],"image/x-icon":["ico"],"image/x-mrsid-image":["sid"],"image/x-pcx":["pcx"],"image/x-pict":["pic","pct"],"image/x-portable-anymap":["pnm"],"image/x-portable-bitmap":["pbm"],"image/x-portable-graymap":["pgm"],"image/x-portable-pixmap":["ppm"],"image/x-rgb":["rgb"],"image/x-tga":["tga"],"image/x-xbitmap":["xbm"],"image/x-xpixmap":["xpm"],"image/x-xwindowdump":["xwd"],"message/rfc822":["eml","mime"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/vnd.collada+xml":["dae"],"model/vnd.dwf":["dwf"],"model/vnd.gdl":["gdl"],"model/vnd.gtw":["gtw"],"model/vnd.mts":["mts"],"model/vnd.vtu":["vtu"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["x3db","x3dbz"],"model/x3d+vrml":["x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee"],"text/css":["css"],"text/csv":["csv"],"text/hjson":["hjson"],"text/html":["html","htm"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/prs.lines.tag":["dsc"],"text/richtext":["rtx"],"text/sgml":["sgml","sgm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vnd.curl":["curl"],"text/vnd.curl.dcurl":["dcurl"],"text/vnd.curl.mcurl":["mcurl"],"text/vnd.curl.scurl":["scurl"],"text/vnd.dvb.subtitle":["sub"],"text/vnd.fly":["fly"],"text/vnd.fmi.flexstor":["flx"],"text/vnd.graphviz":["gv"],"text/vnd.in3d.3dml":["3dml"],"text/vnd.in3d.spot":["spot"],"text/vnd.sun.j2me.app-descriptor":["jad"],"text/vnd.wap.wml":["wml"],"text/vnd.wap.wmlscript":["wmls"],"text/vtt":["vtt"],"text/x-asm":["s","asm"],"text/x-c":["c","cc","cxx","cpp","h","hh","dic"],"text/x-component":["htc"],"text/x-fortran":["f","for","f77","f90"],"text/x-handlebars-template":["hbs"],"text/x-java-source":["java"],"text/x-lua":["lua"],"text/x-markdown":["markdown","md","mkd"],"text/x-nfo":["nfo"],"text/x-opml":["opml"],"text/x-pascal":["p","pas"],"text/x-sass":["sass"],"text/x-scss":["scss"],"text/x-setext":["etx"],"text/x-sfv":["sfv"],"text/x-uuencode":["uu"],"text/x-vcalendar":["vcs"],"text/x-vcard":["vcf"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/vnd.dece.hd":["uvh","uvvh"],"video/vnd.dece.mobile":["uvm","uvvm"],"video/vnd.dece.pd":["uvp","uvvp"],"video/vnd.dece.sd":["uvs","uvvs"],"video/vnd.dece.video":["uvv","uvvv"],"video/vnd.dvb.file":["dvb"],"video/vnd.fvt":["fvt"],"video/vnd.mpegurl":["mxu","m4u"],"video/vnd.ms-playready.media.pyv":["pyv"],"video/vnd.uvvu.mp4":["uvu","uvvu"],"video/vnd.vivo":["viv"],"video/webm":["webm"],"video/x-f4v":["f4v"],"video/x-fli":["fli"],"video/x-flv":["flv"],"video/x-m4v":["m4v"],"video/x-matroska":["mkv","mk3d","mks"],"video/x-mng":["mng"],"video/x-ms-asf":["asf","asx"],"video/x-ms-vob":["vob"],"video/x-ms-wm":["wm"],"video/x-ms-wmv":["wmv"],"video/x-ms-wmx":["wmx"],"video/x-ms-wvx":["wvx"],"video/x-msvideo":["avi"],"video/x-sgi-movie":["movie"],"video/x-smv":["smv"],"x-conference/x-cooltalk":["ice"]}

},{}],173:[function(require,module,exports){
function assert(r,e){if(!r)throw new Error(e||"Assertion failed")}module.exports=assert,assert.equal=function(r,e,s){if(r!=e)throw new Error(s||"Assertion failed: "+r+" != "+e)};

},{}],174:[function(require,module,exports){
function parse(e){if(e=""+e,!(e.length>1e4)){var a=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(a){var r=parseFloat(a[1]),c=(a[2]||"ms").toLowerCase();switch(c){case"years":case"year":case"yrs":case"yr":case"y":return r*y;case"days":case"day":case"d":return r*d;case"hours":case"hour":case"hrs":case"hr":case"h":return r*h;case"minutes":case"minute":case"mins":case"min":case"m":return r*m;case"seconds":case"second":case"secs":case"sec":case"s":return r*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r}}}}function short(e){return e>=d?Math.round(e/d)+"d":e>=h?Math.round(e/h)+"h":e>=m?Math.round(e/m)+"m":e>=s?Math.round(e/s)+"s":e+"ms"}function long(e){return plural(e,d,"day")||plural(e,h,"hour")||plural(e,m,"minute")||plural(e,s,"second")||e+" ms"}function plural(s,e,a){return e>s?void 0:1.5*e>s?Math.floor(s/e)+" "+a:Math.ceil(s/e)+" "+a+"s"}var s=1e3,m=60*s,h=60*m,d=24*h,y=365.25*d;module.exports=function(s,e){return e=e||{},"string"==typeof s?parse(s):e["long"]?long(s):short(s)};

},{}],175:[function(require,module,exports){
function Negotiator(e){return this instanceof Negotiator?void(this.request=e):new Negotiator(e)}var preferredCharsets=require("./lib/charset"),preferredEncodings=require("./lib/encoding"),preferredLanguages=require("./lib/language"),preferredMediaTypes=require("./lib/mediaType");module.exports=Negotiator,Negotiator.Negotiator=Negotiator,Negotiator.prototype.charset=function(e){var t=this.charsets(e);return t&&t[0]},Negotiator.prototype.charsets=function(e){return preferredCharsets(this.request.headers["accept-charset"],e)},Negotiator.prototype.encoding=function(e){var t=this.encodings(e);return t&&t[0]},Negotiator.prototype.encodings=function(e){return preferredEncodings(this.request.headers["accept-encoding"],e)},Negotiator.prototype.language=function(e){var t=this.languages(e);return t&&t[0]},Negotiator.prototype.languages=function(e){return preferredLanguages(this.request.headers["accept-language"],e)},Negotiator.prototype.mediaType=function(e){var t=this.mediaTypes(e);return t&&t[0]},Negotiator.prototype.mediaTypes=function(e){return preferredMediaTypes(this.request.headers.accept,e)},Negotiator.prototype.preferredCharset=Negotiator.prototype.charset,Negotiator.prototype.preferredCharsets=Negotiator.prototype.charsets,Negotiator.prototype.preferredEncoding=Negotiator.prototype.encoding,Negotiator.prototype.preferredEncodings=Negotiator.prototype.encodings,Negotiator.prototype.preferredLanguage=Negotiator.prototype.language,Negotiator.prototype.preferredLanguages=Negotiator.prototype.languages,Negotiator.prototype.preferredMediaType=Negotiator.prototype.mediaType,Negotiator.prototype.preferredMediaTypes=Negotiator.prototype.mediaTypes;

},{"./lib/charset":176,"./lib/encoding":177,"./lib/language":178,"./lib/mediaType":179}],176:[function(require,module,exports){
function parseAcceptCharset(r){for(var e=r.split(","),t=0,s=0;t<e.length;t++){var a=parseCharset(e[t].trim(),t);a&&(e[s++]=a)}return e.length=s,e}function parseCharset(r,e){var t=r.match(/^\s*(\S+?)\s*(?:;(.*))?$/);if(!t)return null;var s=t[1],a=1;if(t[2])for(var i=t[2].split(";"),e=0;e<i.length;e++){var n=i[e].trim().split("=");if("q"===n[0]){a=parseFloat(n[1]);break}}return{charset:s,q:a,i:e}}function getCharsetPriority(r,e,t){for(var s={o:-1,q:0,s:0},a=0;a<e.length;a++){var i=specify(r,e[a],t);i&&(s.s-i.s||s.q-i.q||s.o-i.o)<0&&(s=i)}return s}function specify(r,e,t){var s=0;if(e.charset.toLowerCase()===r.toLowerCase())s|=1;else if("*"!==e.charset)return null;return{i:t,o:e.i,q:e.q,s:s}}function preferredCharsets(r,e){var t=parseAcceptCharset(void 0===r?"*":r||"");if(!e)return t.filter(isQuality).sort(compareSpecs).map(function(r){return r.charset});var s=e.map(function(r,e){return getCharsetPriority(r,t,e)});return s.filter(isQuality).sort(compareSpecs).map(function(r){return e[s.indexOf(r)]})}function compareSpecs(r,e){return e.q-r.q||e.s-r.s||r.o-e.o||r.i-e.i||0}function isQuality(r){return r.q>0}module.exports=preferredCharsets,preferredCharsets.preferredCharsets=preferredCharsets;

},{}],177:[function(require,module,exports){
function parseAcceptEncoding(r){for(var n=r.split(","),e=!1,i=1,t=0,o=0;t<n.length;t++){var c=parseEncoding(n[t].trim(),t);c&&(n[o++]=c,e=e||specify("identity",c),i=Math.min(i,c.q||1))}return e||(n[o++]={encoding:"identity",q:i,i:t}),n.length=o,n}function parseEncoding(r,n){var e=r.match(/^\s*(\S+?)\s*(?:;(.*))?$/);if(!e)return null;var i=e[1],t=1;if(e[2])for(var o=e[2].split(";"),n=0;n<o.length;n++){var c=o[n].trim().split("=");if("q"===c[0]){t=parseFloat(c[1]);break}}return{encoding:i,q:t,i:n}}function getEncodingPriority(r,n,e){for(var i={o:-1,q:0,s:0},t=0;t<n.length;t++){var o=specify(r,n[t],e);o&&(i.s-o.s||i.q-o.q||i.o-o.o)<0&&(i=o)}return i}function specify(r,n,e){var i=0;if(n.encoding.toLowerCase()===r.toLowerCase())i|=1;else if("*"!==n.encoding)return null;return{i:e,o:n.i,q:n.q,s:i}}function preferredEncodings(r,n){var e=parseAcceptEncoding(r||"");if(!n)return e.filter(isQuality).sort(compareSpecs).map(function(r){return r.encoding});var i=n.map(function(r,n){return getEncodingPriority(r,e,n)});return i.filter(isQuality).sort(compareSpecs).map(function(r){return n[i.indexOf(r)]})}function compareSpecs(r,n){return n.q-r.q||n.s-r.s||r.o-n.o||r.i-n.i||0}function isQuality(r){return r.q>0}module.exports=preferredEncodings,preferredEncodings.preferredEncodings=preferredEncodings;

},{}],178:[function(require,module,exports){
function parseAcceptLanguage(e){for(var r=e.split(","),a=0,n=0;a<r.length;a++){var t=parseLanguage(r[a].trim(),a);t&&(r[n++]=t)}return r.length=n,r}function parseLanguage(e,r){var a=e.match(/^\s*(\S+?)(?:-(\S+?))?\s*(?:;(.*))?$/);if(!a)return null;var n=a[1],t=a[2],u=n;t&&(u+="-"+t);var i=1;if(a[3])for(var f=a[3].split(";"),r=0;r<f.length;r++){var s=f[r].split("=");"q"===s[0]&&(i=parseFloat(s[1]))}return{prefix:n,suffix:t,q:i,i:r,full:u}}function getLanguagePriority(e,r,a){for(var n={o:-1,q:0,s:0},t=0;t<r.length;t++){var u=specify(e,r[t],a);u&&(n.s-u.s||n.q-u.q||n.o-u.o)<0&&(n=u)}return n}function specify(e,r,a){var n=parseLanguage(e);if(!n)return null;var t=0;if(r.full.toLowerCase()===n.full.toLowerCase())t|=4;else if(r.prefix.toLowerCase()===n.full.toLowerCase())t|=2;else if(r.full.toLowerCase()===n.prefix.toLowerCase())t|=1;else if("*"!==r.full)return null;return{i:a,o:r.i,q:r.q,s:t}}function preferredLanguages(e,r){var a=parseAcceptLanguage(void 0===e?"*":e||"");if(!r)return a.filter(isQuality).sort(compareSpecs).map(function(e){return e.full});var n=r.map(function(e,r){return getLanguagePriority(e,a,r)});return n.filter(isQuality).sort(compareSpecs).map(function(e){return r[n.indexOf(e)]})}function compareSpecs(e,r){return r.q-e.q||r.s-e.s||e.o-r.o||e.i-r.i||0}function isQuality(e){return e.q>0}module.exports=preferredLanguages,preferredLanguages.preferredLanguages=preferredLanguages;

},{}],179:[function(require,module,exports){
function parseAccept(e){for(var r=splitMediaTypes(e),t=0,n=0;t<r.length;t++){var i=parseMediaType(r[t].trim(),t);i&&(r[n++]=i)}return r.length=n,r}function parseMediaType(e,r){var t=e.match(/\s*(\S+?)\/([^;\s]+)\s*(?:;(.*))?/);if(!t)return null;var n=t[1],i=t[2],a=""+n+"/"+i,s={},u=1;return t[3]&&(s=t[3].split(";").map(function(e){return e.trim().split("=")}).reduce(function(e,r){var t=r[0].toLowerCase(),n=r[1];return e[t]=n&&'"'===n[0]&&'"'===n[n.length-1]?n.substr(1,n.length-2):n,e},s),null!=s.q&&(u=parseFloat(s.q),delete s.q)),{type:n,subtype:i,params:s,q:u,i:r,full:a}}function getMediaTypePriority(e,r,t){for(var n={o:-1,q:0,s:0},i=0;i<r.length;i++){var a=specify(e,r[i],t);a&&(n.s-a.s||n.q-a.q||n.o-a.o)<0&&(n=a)}return n}function specify(e,r,t){var n=parseMediaType(e),i=0;if(!n)return null;if(r.type.toLowerCase()==n.type.toLowerCase())i|=4;else if("*"!=r.type)return null;if(r.subtype.toLowerCase()==n.subtype.toLowerCase())i|=2;else if("*"!=r.subtype)return null;var a=Object.keys(r.params);if(a.length>0){if(!a.every(function(e){return"*"==r.params[e]||(r.params[e]||"").toLowerCase()==(n.params[e]||"").toLowerCase()}))return null;i|=1}return{i:t,o:r.i,q:r.q,s:i}}function preferredMediaTypes(e,r){var t=parseAccept(void 0===e?"*/*":e||"");if(!r)return t.filter(isQuality).sort(compareSpecs).map(function(e){return e.full});var n=r.map(function(e,r){return getMediaTypePriority(e,t,r)});return n.filter(isQuality).sort(compareSpecs).map(function(e){return r[n.indexOf(e)]})}function compareSpecs(e,r){return r.q-e.q||r.s-e.s||e.o-r.o||e.i-r.i||0}function isQuality(e){return e.q>0}function quoteCount(e){for(var r=0,t=0;-1!==(t=e.indexOf('"',t));)r++,t++;return r}function splitMediaTypes(e){for(var r=e.split(","),t=1,n=0;t<r.length;t++)quoteCount(r[n])%2==0?r[++n]=r[t]:r[n]+=","+r[t];return r.length=n+1,r}module.exports=preferredMediaTypes,preferredMediaTypes.preferredMediaTypes=preferredMediaTypes;

},{}],180:[function(require,module,exports){
(function (process){
"use strict";function onFinished(e,n){return isFinished(e)!==!1?(defer(n,null,e),e):(attachListener(e,n),e)}function isFinished(e){var n=e.socket;return"boolean"==typeof e.finished?Boolean(e.finished||n&&!n.writable):"boolean"==typeof e.complete?Boolean(e.upgrade||!n||!n.readable||e.complete&&!e.readable):void 0}function attachFinishedListener(e,n){function i(e){o.cancel(),s.cancel(),r=!0,n(e)}function t(n){e.removeListener("socket",t),r||o===s&&(s=first([[n,"error","close"]],i))}var o,s,r=!1;return o=s=first([[e,"end","finish"]],i),e.socket?void t(e.socket):(e.on("socket",t),void(void 0===e.socket&&patchAssignSocket(e,t)))}function attachListener(e,n){var i=e.__onFinished;i&&i.queue||(i=e.__onFinished=createListener(e),attachFinishedListener(e,i)),i.queue.push(n)}function createListener(e){function n(i){if(e.__onFinished===n&&(e.__onFinished=null),n.queue){var t=n.queue;n.queue=null;for(var o=0;o<t.length;o++)t[o](i,e)}}return n.queue=[],n}function patchAssignSocket(e,n){var i=e.assignSocket;"function"==typeof i&&(e.assignSocket=function(e){i.call(this,e),n(e)})}module.exports=onFinished,module.exports.isFinished=isFinished;var first=require("ee-first"),defer="function"==typeof setImmediate?setImmediate:function(e){process.nextTick(e.bind.apply(e,arguments))};

}).call(this,require('_process'))
},{"_process":201,"ee-first":90}],181:[function(require,module,exports){
"use strict";var TYPED_OK="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;exports.assign=function(r){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var e=t.shift();if(e){if("object"!=typeof e)throw new TypeError(e+"must be non-object");for(var n in e)e.hasOwnProperty(n)&&(r[n]=e[n])}}return r},exports.shrinkBuf=function(r,t){return r.length===t?r:r.subarray?r.subarray(0,t):(r.length=t,r)};var fnTyped={arraySet:function(r,t,e,n,a){if(t.subarray&&r.subarray)return void r.set(t.subarray(e,e+n),a);for(var o=0;n>o;o++)r[a+o]=t[e+o]},flattenChunks:function(r){var t,e,n,a,o,s;for(n=0,t=0,e=r.length;e>t;t++)n+=r[t].length;for(s=new Uint8Array(n),a=0,t=0,e=r.length;e>t;t++)o=r[t],s.set(o,a),a+=o.length;return s}},fnUntyped={arraySet:function(r,t,e,n,a){for(var o=0;n>o;o++)r[a+o]=t[e+o]},flattenChunks:function(r){return[].concat.apply([],r)}};exports.setTyped=function(r){r?(exports.Buf8=Uint8Array,exports.Buf16=Uint16Array,exports.Buf32=Int32Array,exports.assign(exports,fnTyped)):(exports.Buf8=Array,exports.Buf16=Array,exports.Buf32=Array,exports.assign(exports,fnUntyped))},exports.setTyped(TYPED_OK);

},{}],182:[function(require,module,exports){
"use strict";function adler32(e,r,o,t){for(var d=65535&e|0,l=e>>>16&65535|0,u=0;0!==o;){u=o>2e3?2e3:o,o-=u;do d=d+r[t++]|0,l=l+d|0;while(--u);d%=65521,l%=65521}return d|l<<16|0}module.exports=adler32;

},{}],183:[function(require,module,exports){
module.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};

},{}],184:[function(require,module,exports){
"use strict";function makeTable(){for(var r,a=[],c=0;256>c;c++){r=c;for(var e=0;8>e;e++)r=1&r?3988292384^r>>>1:r>>>1;a[c]=r}return a}function crc32(r,a,c,e){var o=crcTable,t=e+c;r=-1^r;for(var n=e;t>n;n++)r=r>>>8^o[255&(r^a[n])];return-1^r}var crcTable=makeTable();module.exports=crc32;

},{}],185:[function(require,module,exports){
"use strict";function err(t,e){return t.msg=msg[e],e}function rank(t){return(t<<1)-(t>4?9:0)}function zero(t){for(var e=t.length;--e>=0;)t[e]=0}function flush_pending(t){var e=t.state,_=e.pending;_>t.avail_out&&(_=t.avail_out),0!==_&&(utils.arraySet(t.output,e.pending_buf,e.pending_out,_,t.next_out),t.next_out+=_,e.pending_out+=_,t.total_out+=_,t.avail_out-=_,e.pending-=_,0===e.pending&&(e.pending_out=0))}function flush_block_only(t,e){trees._tr_flush_block(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,flush_pending(t.strm)}function put_byte(t,e){t.pending_buf[t.pending++]=e}function putShortMSB(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function read_buf(t,e,_,a){var s=t.avail_in;return s>a&&(s=a),0===s?0:(t.avail_in-=s,utils.arraySet(e,t.input,t.next_in,s,_),1===t.state.wrap?t.adler=adler32(t.adler,e,s,_):2===t.state.wrap&&(t.adler=crc32(t.adler,e,s,_)),t.next_in+=s,t.total_in+=s,s)}function longest_match(t,e){var _,a,s=t.max_chain_length,n=t.strstart,i=t.prev_length,r=t.nice_match,l=t.strstart>t.w_size-MIN_LOOKAHEAD?t.strstart-(t.w_size-MIN_LOOKAHEAD):0,h=t.window,o=t.w_mask,d=t.prev,u=t.strstart+MAX_MATCH,f=h[n+i-1],E=h[n+i];t.prev_length>=t.good_match&&(s>>=2),r>t.lookahead&&(r=t.lookahead);do if(_=e,h[_+i]===E&&h[_+i-1]===f&&h[_]===h[n]&&h[++_]===h[n+1]){n+=2,_++;do;while(h[++n]===h[++_]&&h[++n]===h[++_]&&h[++n]===h[++_]&&h[++n]===h[++_]&&h[++n]===h[++_]&&h[++n]===h[++_]&&h[++n]===h[++_]&&h[++n]===h[++_]&&u>n);if(a=MAX_MATCH-(u-n),n=u-MAX_MATCH,a>i){if(t.match_start=e,i=a,a>=r)break;f=h[n+i-1],E=h[n+i]}}while((e=d[e&o])>l&&0!==--s);return i<=t.lookahead?i:t.lookahead}function fill_window(t){var e,_,a,s,n,i=t.w_size;do{if(s=t.window_size-t.lookahead-t.strstart,t.strstart>=i+(i-MIN_LOOKAHEAD)){utils.arraySet(t.window,t.window,i,i,0),t.match_start-=i,t.strstart-=i,t.block_start-=i,_=t.hash_size,e=_;do a=t.head[--e],t.head[e]=a>=i?a-i:0;while(--_);_=i,e=_;do a=t.prev[--e],t.prev[e]=a>=i?a-i:0;while(--_);s+=i}if(0===t.strm.avail_in)break;if(_=read_buf(t.strm,t.window,t.strstart+t.lookahead,s),t.lookahead+=_,t.lookahead+t.insert>=MIN_MATCH)for(n=t.strstart-t.insert,t.ins_h=t.window[n],t.ins_h=(t.ins_h<<t.hash_shift^t.window[n+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[n+MIN_MATCH-1])&t.hash_mask,t.prev[n&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=n,n++,t.insert--,!(t.lookahead+t.insert<MIN_MATCH)););}while(t.lookahead<MIN_LOOKAHEAD&&0!==t.strm.avail_in)}function deflate_stored(t,e){var _=65535;for(_>t.pending_buf_size-5&&(_=t.pending_buf_size-5);;){if(t.lookahead<=1){if(fill_window(t),0===t.lookahead&&e===Z_NO_FLUSH)return BS_NEED_MORE;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var a=t.block_start+_;if((0===t.strstart||t.strstart>=a)&&(t.lookahead=t.strstart-a,t.strstart=a,flush_block_only(t,!1),0===t.strm.avail_out))return BS_NEED_MORE;if(t.strstart-t.block_start>=t.w_size-MIN_LOOKAHEAD&&(flush_block_only(t,!1),0===t.strm.avail_out))return BS_NEED_MORE}return t.insert=0,e===Z_FINISH?(flush_block_only(t,!0),0===t.strm.avail_out?BS_FINISH_STARTED:BS_FINISH_DONE):t.strstart>t.block_start&&(flush_block_only(t,!1),0===t.strm.avail_out)?BS_NEED_MORE:BS_NEED_MORE}function deflate_fast(t,e){for(var _,a;;){if(t.lookahead<MIN_LOOKAHEAD){if(fill_window(t),t.lookahead<MIN_LOOKAHEAD&&e===Z_NO_FLUSH)return BS_NEED_MORE;if(0===t.lookahead)break}if(_=0,t.lookahead>=MIN_MATCH&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+MIN_MATCH-1])&t.hash_mask,_=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==_&&t.strstart-_<=t.w_size-MIN_LOOKAHEAD&&(t.match_length=longest_match(t,_)),t.match_length>=MIN_MATCH)if(a=trees._tr_tally(t,t.strstart-t.match_start,t.match_length-MIN_MATCH),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=MIN_MATCH){t.match_length--;do t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+MIN_MATCH-1])&t.hash_mask,_=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart;while(0!==--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else a=trees._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(a&&(flush_block_only(t,!1),0===t.strm.avail_out))return BS_NEED_MORE}return t.insert=t.strstart<MIN_MATCH-1?t.strstart:MIN_MATCH-1,e===Z_FINISH?(flush_block_only(t,!0),0===t.strm.avail_out?BS_FINISH_STARTED:BS_FINISH_DONE):t.last_lit&&(flush_block_only(t,!1),0===t.strm.avail_out)?BS_NEED_MORE:BS_BLOCK_DONE}function deflate_slow(t,e){for(var _,a,s;;){if(t.lookahead<MIN_LOOKAHEAD){if(fill_window(t),t.lookahead<MIN_LOOKAHEAD&&e===Z_NO_FLUSH)return BS_NEED_MORE;if(0===t.lookahead)break}if(_=0,t.lookahead>=MIN_MATCH&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+MIN_MATCH-1])&t.hash_mask,_=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=MIN_MATCH-1,0!==_&&t.prev_length<t.max_lazy_match&&t.strstart-_<=t.w_size-MIN_LOOKAHEAD&&(t.match_length=longest_match(t,_),t.match_length<=5&&(t.strategy===Z_FILTERED||t.match_length===MIN_MATCH&&t.strstart-t.match_start>4096)&&(t.match_length=MIN_MATCH-1)),t.prev_length>=MIN_MATCH&&t.match_length<=t.prev_length){s=t.strstart+t.lookahead-MIN_MATCH,a=trees._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-MIN_MATCH),t.lookahead-=t.prev_length-1,t.prev_length-=2;do++t.strstart<=s&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+MIN_MATCH-1])&t.hash_mask,_=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart);while(0!==--t.prev_length);if(t.match_available=0,t.match_length=MIN_MATCH-1,t.strstart++,a&&(flush_block_only(t,!1),0===t.strm.avail_out))return BS_NEED_MORE}else if(t.match_available){if(a=trees._tr_tally(t,0,t.window[t.strstart-1]),a&&flush_block_only(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return BS_NEED_MORE}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(a=trees._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<MIN_MATCH-1?t.strstart:MIN_MATCH-1,e===Z_FINISH?(flush_block_only(t,!0),0===t.strm.avail_out?BS_FINISH_STARTED:BS_FINISH_DONE):t.last_lit&&(flush_block_only(t,!1),0===t.strm.avail_out)?BS_NEED_MORE:BS_BLOCK_DONE}function deflate_rle(t,e){for(var _,a,s,n,i=t.window;;){if(t.lookahead<=MAX_MATCH){if(fill_window(t),t.lookahead<=MAX_MATCH&&e===Z_NO_FLUSH)return BS_NEED_MORE;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=MIN_MATCH&&t.strstart>0&&(s=t.strstart-1,a=i[s],a===i[++s]&&a===i[++s]&&a===i[++s])){n=t.strstart+MAX_MATCH;do;while(a===i[++s]&&a===i[++s]&&a===i[++s]&&a===i[++s]&&a===i[++s]&&a===i[++s]&&a===i[++s]&&a===i[++s]&&n>s);t.match_length=MAX_MATCH-(n-s),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=MIN_MATCH?(_=trees._tr_tally(t,1,t.match_length-MIN_MATCH),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(_=trees._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),_&&(flush_block_only(t,!1),0===t.strm.avail_out))return BS_NEED_MORE}return t.insert=0,e===Z_FINISH?(flush_block_only(t,!0),0===t.strm.avail_out?BS_FINISH_STARTED:BS_FINISH_DONE):t.last_lit&&(flush_block_only(t,!1),0===t.strm.avail_out)?BS_NEED_MORE:BS_BLOCK_DONE}function deflate_huff(t,e){for(var _;;){if(0===t.lookahead&&(fill_window(t),0===t.lookahead)){if(e===Z_NO_FLUSH)return BS_NEED_MORE;break}if(t.match_length=0,_=trees._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,_&&(flush_block_only(t,!1),0===t.strm.avail_out))return BS_NEED_MORE}return t.insert=0,e===Z_FINISH?(flush_block_only(t,!0),0===t.strm.avail_out?BS_FINISH_STARTED:BS_FINISH_DONE):t.last_lit&&(flush_block_only(t,!1),0===t.strm.avail_out)?BS_NEED_MORE:BS_BLOCK_DONE}function lm_init(t){t.window_size=2*t.w_size,zero(t.head),t.max_lazy_match=configuration_table[t.level].max_lazy,t.good_match=configuration_table[t.level].good_length,t.nice_match=configuration_table[t.level].nice_length,t.max_chain_length=configuration_table[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=MIN_MATCH-1,t.match_available=0,t.ins_h=0}function DeflateState(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=Z_DEFLATED,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new utils.Buf16(2*HEAP_SIZE),this.dyn_dtree=new utils.Buf16(2*(2*D_CODES+1)),this.bl_tree=new utils.Buf16(2*(2*BL_CODES+1)),zero(this.dyn_ltree),zero(this.dyn_dtree),zero(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new utils.Buf16(MAX_BITS+1),this.heap=new utils.Buf16(2*L_CODES+1),zero(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new utils.Buf16(2*L_CODES+1),zero(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function deflateResetKeep(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=Z_UNKNOWN,e=t.state,e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?INIT_STATE:BUSY_STATE,t.adler=2===e.wrap?0:1,e.last_flush=Z_NO_FLUSH,trees._tr_init(e),Z_OK):err(t,Z_STREAM_ERROR)}function deflateReset(t){var e=deflateResetKeep(t);return e===Z_OK&&lm_init(t.state),e}function deflateSetHeader(t,e){return t&&t.state?2!==t.state.wrap?Z_STREAM_ERROR:(t.state.gzhead=e,Z_OK):Z_STREAM_ERROR}function deflateInit2(t,e,_,a,s,n){if(!t)return Z_STREAM_ERROR;var i=1;if(e===Z_DEFAULT_COMPRESSION&&(e=6),0>a?(i=0,a=-a):a>15&&(i=2,a-=16),1>s||s>MAX_MEM_LEVEL||_!==Z_DEFLATED||8>a||a>15||0>e||e>9||0>n||n>Z_FIXED)return err(t,Z_STREAM_ERROR);8===a&&(a=9);var r=new DeflateState;return t.state=r,r.strm=t,r.wrap=i,r.gzhead=null,r.w_bits=a,r.w_size=1<<r.w_bits,r.w_mask=r.w_size-1,r.hash_bits=s+7,r.hash_size=1<<r.hash_bits,r.hash_mask=r.hash_size-1,r.hash_shift=~~((r.hash_bits+MIN_MATCH-1)/MIN_MATCH),r.window=new utils.Buf8(2*r.w_size),r.head=new utils.Buf16(r.hash_size),r.prev=new utils.Buf16(r.w_size),r.lit_bufsize=1<<s+6,r.pending_buf_size=4*r.lit_bufsize,r.pending_buf=new utils.Buf8(r.pending_buf_size),r.d_buf=r.lit_bufsize>>1,r.l_buf=3*r.lit_bufsize,r.level=e,r.strategy=n,r.method=_,deflateReset(t)}function deflateInit(t,e){return deflateInit2(t,e,Z_DEFLATED,MAX_WBITS,DEF_MEM_LEVEL,Z_DEFAULT_STRATEGY)}function deflate(t,e){var _,a,s,n;if(!t||!t.state||e>Z_BLOCK||0>e)return t?err(t,Z_STREAM_ERROR):Z_STREAM_ERROR;if(a=t.state,!t.output||!t.input&&0!==t.avail_in||a.status===FINISH_STATE&&e!==Z_FINISH)return err(t,0===t.avail_out?Z_BUF_ERROR:Z_STREAM_ERROR);if(a.strm=t,_=a.last_flush,a.last_flush=e,a.status===INIT_STATE)if(2===a.wrap)t.adler=0,put_byte(a,31),put_byte(a,139),put_byte(a,8),a.gzhead?(put_byte(a,(a.gzhead.text?1:0)+(a.gzhead.hcrc?2:0)+(a.gzhead.extra?4:0)+(a.gzhead.name?8:0)+(a.gzhead.comment?16:0)),put_byte(a,255&a.gzhead.time),put_byte(a,a.gzhead.time>>8&255),put_byte(a,a.gzhead.time>>16&255),put_byte(a,a.gzhead.time>>24&255),put_byte(a,9===a.level?2:a.strategy>=Z_HUFFMAN_ONLY||a.level<2?4:0),put_byte(a,255&a.gzhead.os),a.gzhead.extra&&a.gzhead.extra.length&&(put_byte(a,255&a.gzhead.extra.length),put_byte(a,a.gzhead.extra.length>>8&255)),a.gzhead.hcrc&&(t.adler=crc32(t.adler,a.pending_buf,a.pending,0)),a.gzindex=0,a.status=EXTRA_STATE):(put_byte(a,0),put_byte(a,0),put_byte(a,0),put_byte(a,0),put_byte(a,0),put_byte(a,9===a.level?2:a.strategy>=Z_HUFFMAN_ONLY||a.level<2?4:0),put_byte(a,OS_CODE),a.status=BUSY_STATE);else{var i=Z_DEFLATED+(a.w_bits-8<<4)<<8,r=-1;r=a.strategy>=Z_HUFFMAN_ONLY||a.level<2?0:a.level<6?1:6===a.level?2:3,i|=r<<6,0!==a.strstart&&(i|=PRESET_DICT),i+=31-i%31,a.status=BUSY_STATE,putShortMSB(a,i),0!==a.strstart&&(putShortMSB(a,t.adler>>>16),putShortMSB(a,65535&t.adler)),t.adler=1}if(a.status===EXTRA_STATE)if(a.gzhead.extra){for(s=a.pending;a.gzindex<(65535&a.gzhead.extra.length)&&(a.pending!==a.pending_buf_size||(a.gzhead.hcrc&&a.pending>s&&(t.adler=crc32(t.adler,a.pending_buf,a.pending-s,s)),flush_pending(t),s=a.pending,a.pending!==a.pending_buf_size));)put_byte(a,255&a.gzhead.extra[a.gzindex]),a.gzindex++;a.gzhead.hcrc&&a.pending>s&&(t.adler=crc32(t.adler,a.pending_buf,a.pending-s,s)),a.gzindex===a.gzhead.extra.length&&(a.gzindex=0,a.status=NAME_STATE)}else a.status=NAME_STATE;if(a.status===NAME_STATE)if(a.gzhead.name){s=a.pending;do{if(a.pending===a.pending_buf_size&&(a.gzhead.hcrc&&a.pending>s&&(t.adler=crc32(t.adler,a.pending_buf,a.pending-s,s)),flush_pending(t),s=a.pending,a.pending===a.pending_buf_size)){n=1;break}n=a.gzindex<a.gzhead.name.length?255&a.gzhead.name.charCodeAt(a.gzindex++):0,put_byte(a,n)}while(0!==n);a.gzhead.hcrc&&a.pending>s&&(t.adler=crc32(t.adler,a.pending_buf,a.pending-s,s)),0===n&&(a.gzindex=0,a.status=COMMENT_STATE)}else a.status=COMMENT_STATE;if(a.status===COMMENT_STATE)if(a.gzhead.comment){s=a.pending;do{if(a.pending===a.pending_buf_size&&(a.gzhead.hcrc&&a.pending>s&&(t.adler=crc32(t.adler,a.pending_buf,a.pending-s,s)),flush_pending(t),s=a.pending,a.pending===a.pending_buf_size)){n=1;break}n=a.gzindex<a.gzhead.comment.length?255&a.gzhead.comment.charCodeAt(a.gzindex++):0,put_byte(a,n)}while(0!==n);a.gzhead.hcrc&&a.pending>s&&(t.adler=crc32(t.adler,a.pending_buf,a.pending-s,s)),0===n&&(a.status=HCRC_STATE)}else a.status=HCRC_STATE;if(a.status===HCRC_STATE&&(a.gzhead.hcrc?(a.pending+2>a.pending_buf_size&&flush_pending(t),a.pending+2<=a.pending_buf_size&&(put_byte(a,255&t.adler),put_byte(a,t.adler>>8&255),t.adler=0,a.status=BUSY_STATE)):a.status=BUSY_STATE),0!==a.pending){if(flush_pending(t),0===t.avail_out)return a.last_flush=-1,Z_OK}else if(0===t.avail_in&&rank(e)<=rank(_)&&e!==Z_FINISH)return err(t,Z_BUF_ERROR);if(a.status===FINISH_STATE&&0!==t.avail_in)return err(t,Z_BUF_ERROR);if(0!==t.avail_in||0!==a.lookahead||e!==Z_NO_FLUSH&&a.status!==FINISH_STATE){var l=a.strategy===Z_HUFFMAN_ONLY?deflate_huff(a,e):a.strategy===Z_RLE?deflate_rle(a,e):configuration_table[a.level].func(a,e);if(l!==BS_FINISH_STARTED&&l!==BS_FINISH_DONE||(a.status=FINISH_STATE),l===BS_NEED_MORE||l===BS_FINISH_STARTED)return 0===t.avail_out&&(a.last_flush=-1),Z_OK;if(l===BS_BLOCK_DONE&&(e===Z_PARTIAL_FLUSH?trees._tr_align(a):e!==Z_BLOCK&&(trees._tr_stored_block(a,0,0,!1),e===Z_FULL_FLUSH&&(zero(a.head),0===a.lookahead&&(a.strstart=0,a.block_start=0,a.insert=0))),flush_pending(t),0===t.avail_out))return a.last_flush=-1,Z_OK}return e!==Z_FINISH?Z_OK:a.wrap<=0?Z_STREAM_END:(2===a.wrap?(put_byte(a,255&t.adler),put_byte(a,t.adler>>8&255),put_byte(a,t.adler>>16&255),put_byte(a,t.adler>>24&255),put_byte(a,255&t.total_in),put_byte(a,t.total_in>>8&255),put_byte(a,t.total_in>>16&255),put_byte(a,t.total_in>>24&255)):(putShortMSB(a,t.adler>>>16),putShortMSB(a,65535&t.adler)),flush_pending(t),a.wrap>0&&(a.wrap=-a.wrap),0!==a.pending?Z_OK:Z_STREAM_END)}function deflateEnd(t){var e;return t&&t.state?(e=t.state.status,e!==INIT_STATE&&e!==EXTRA_STATE&&e!==NAME_STATE&&e!==COMMENT_STATE&&e!==HCRC_STATE&&e!==BUSY_STATE&&e!==FINISH_STATE?err(t,Z_STREAM_ERROR):(t.state=null,e===BUSY_STATE?err(t,Z_DATA_ERROR):Z_OK)):Z_STREAM_ERROR}var utils=require("../utils/common"),trees=require("./trees"),adler32=require("./adler32"),crc32=require("./crc32"),msg=require("./messages"),Z_NO_FLUSH=0,Z_PARTIAL_FLUSH=1,Z_FULL_FLUSH=3,Z_FINISH=4,Z_BLOCK=5,Z_OK=0,Z_STREAM_END=1,Z_STREAM_ERROR=-2,Z_DATA_ERROR=-3,Z_BUF_ERROR=-5,Z_DEFAULT_COMPRESSION=-1,Z_FILTERED=1,Z_HUFFMAN_ONLY=2,Z_RLE=3,Z_FIXED=4,Z_DEFAULT_STRATEGY=0,Z_UNKNOWN=2,Z_DEFLATED=8,MAX_MEM_LEVEL=9,MAX_WBITS=15,DEF_MEM_LEVEL=8,LENGTH_CODES=29,LITERALS=256,L_CODES=LITERALS+1+LENGTH_CODES,D_CODES=30,BL_CODES=19,HEAP_SIZE=2*L_CODES+1,MAX_BITS=15,MIN_MATCH=3,MAX_MATCH=258,MIN_LOOKAHEAD=MAX_MATCH+MIN_MATCH+1,PRESET_DICT=32,INIT_STATE=42,EXTRA_STATE=69,NAME_STATE=73,COMMENT_STATE=91,HCRC_STATE=103,BUSY_STATE=113,FINISH_STATE=666,BS_NEED_MORE=1,BS_BLOCK_DONE=2,BS_FINISH_STARTED=3,BS_FINISH_DONE=4,OS_CODE=3,Config=function(t,e,_,a,s){this.good_length=t,this.max_lazy=e,this.nice_length=_,this.max_chain=a,this.func=s},configuration_table;configuration_table=[new Config(0,0,0,0,deflate_stored),new Config(4,4,8,4,deflate_fast),new Config(4,5,16,8,deflate_fast),new Config(4,6,32,32,deflate_fast),new Config(4,4,16,16,deflate_slow),new Config(8,16,32,32,deflate_slow),new Config(8,16,128,128,deflate_slow),new Config(8,32,128,256,deflate_slow),new Config(32,128,258,1024,deflate_slow),new Config(32,258,258,4096,deflate_slow)],exports.deflateInit=deflateInit,exports.deflateInit2=deflateInit2,exports.deflateReset=deflateReset,exports.deflateResetKeep=deflateResetKeep,exports.deflateSetHeader=deflateSetHeader,exports.deflate=deflate,exports.deflateEnd=deflateEnd,exports.deflateInfo="pako deflate (from Nodeca project)";

},{"../utils/common":181,"./adler32":182,"./crc32":184,"./messages":189,"./trees":190}],186:[function(require,module,exports){
"use strict";var BAD=30,TYPE=12;module.exports=function(i,e){var o,a,t,d,n,l,s,f,r,b,c,u,v,m,w,h,k,_,x,g,A,B,D,p,E;o=i.state,a=i.next_in,p=i.input,t=a+(i.avail_in-5),d=i.next_out,E=i.output,n=d-(e-i.avail_out),l=d+(i.avail_out-257),s=o.dmax,f=o.wsize,r=o.whave,b=o.wnext,c=o.window,u=o.hold,v=o.bits,m=o.lencode,w=o.distcode,h=(1<<o.lenbits)-1,k=(1<<o.distbits)-1;i:do{15>v&&(u+=p[a++]<<v,v+=8,u+=p[a++]<<v,v+=8),_=m[u&h];e:for(;;){if(x=_>>>24,u>>>=x,v-=x,x=_>>>16&255,0===x)E[d++]=65535&_;else{if(!(16&x)){if(0===(64&x)){_=m[(65535&_)+(u&(1<<x)-1)];continue e}if(32&x){o.mode=TYPE;break i}i.msg="invalid literal/length code",o.mode=BAD;break i}g=65535&_,x&=15,x&&(x>v&&(u+=p[a++]<<v,v+=8),g+=u&(1<<x)-1,u>>>=x,v-=x),15>v&&(u+=p[a++]<<v,v+=8,u+=p[a++]<<v,v+=8),_=w[u&k];o:for(;;){if(x=_>>>24,u>>>=x,v-=x,x=_>>>16&255,!(16&x)){if(0===(64&x)){_=w[(65535&_)+(u&(1<<x)-1)];continue o}i.msg="invalid distance code",o.mode=BAD;break i}if(A=65535&_,x&=15,x>v&&(u+=p[a++]<<v,v+=8,x>v&&(u+=p[a++]<<v,v+=8)),A+=u&(1<<x)-1,A>s){i.msg="invalid distance too far back",o.mode=BAD;break i}if(u>>>=x,v-=x,x=d-n,A>x){if(x=A-x,x>r&&o.sane){i.msg="invalid distance too far back",o.mode=BAD;break i}if(B=0,D=c,0===b){if(B+=f-x,g>x){g-=x;do E[d++]=c[B++];while(--x);B=d-A,D=E}}else if(x>b){if(B+=f+b-x,x-=b,g>x){g-=x;do E[d++]=c[B++];while(--x);if(B=0,g>b){x=b,g-=x;do E[d++]=c[B++];while(--x);B=d-A,D=E}}}else if(B+=b-x,g>x){g-=x;do E[d++]=c[B++];while(--x);B=d-A,D=E}for(;g>2;)E[d++]=D[B++],E[d++]=D[B++],E[d++]=D[B++],g-=3;g&&(E[d++]=D[B++],g>1&&(E[d++]=D[B++]))}else{B=d-A;do E[d++]=E[B++],E[d++]=E[B++],E[d++]=E[B++],g-=3;while(g>2);g&&(E[d++]=E[B++],g>1&&(E[d++]=E[B++]))}break}}break}}while(t>a&&l>d);g=v>>3,a-=g,v-=g<<3,u&=(1<<v)-1,i.next_in=a,i.next_out=d,i.avail_in=t>a?5+(t-a):5-(a-t),i.avail_out=l>d?257+(l-d):257-(d-l),o.hold=u,o.bits=v};

},{}],187:[function(require,module,exports){
"use strict";function ZSWAP32(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function InflateState(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new utils.Buf16(320),this.work=new utils.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function inflateResetKeep(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=HEAD,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new utils.Buf32(ENOUGH_LENS),t.distcode=t.distdyn=new utils.Buf32(ENOUGH_DISTS),t.sane=1,t.back=-1,Z_OK):Z_STREAM_ERROR}function inflateReset(e){var t;return e&&e.state?(t=e.state,t.wsize=0,t.whave=0,t.wnext=0,inflateResetKeep(e)):Z_STREAM_ERROR}function inflateReset2(e,t){var a,i;return e&&e.state?(i=e.state,0>t?(a=0,t=-t):(a=(t>>4)+1,48>t&&(t&=15)),t&&(8>t||t>15)?Z_STREAM_ERROR:(null!==i.window&&i.wbits!==t&&(i.window=null),i.wrap=a,i.wbits=t,inflateReset(e))):Z_STREAM_ERROR}function inflateInit2(e,t){var a,i;return e?(i=new InflateState,e.state=i,i.window=null,a=inflateReset2(e,t),a!==Z_OK&&(e.state=null),a):Z_STREAM_ERROR}function inflateInit(e){return inflateInit2(e,DEF_WBITS)}function fixedtables(e){if(virgin){var t;for(lenfix=new utils.Buf32(512),distfix=new utils.Buf32(32),t=0;144>t;)e.lens[t++]=8;for(;256>t;)e.lens[t++]=9;for(;280>t;)e.lens[t++]=7;for(;288>t;)e.lens[t++]=8;for(inflate_table(LENS,e.lens,0,288,lenfix,0,e.work,{bits:9}),t=0;32>t;)e.lens[t++]=5;inflate_table(DISTS,e.lens,0,32,distfix,0,e.work,{bits:5}),virgin=!1}e.lencode=lenfix,e.lenbits=9,e.distcode=distfix,e.distbits=5}function updatewindow(e,t,a,i){var n,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new utils.Buf8(s.wsize)),i>=s.wsize?(utils.arraySet(s.window,t,a-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n=s.wsize-s.wnext,n>i&&(n=i),utils.arraySet(s.window,t,a-i,n,s.wnext),i-=n,i?(utils.arraySet(s.window,t,a-i,i,0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0}function inflate(e,t){var a,i,n,s,l,r,o,d,f,c,h,E,b,k,_,m,u,w,R,T,g,D,S,x,A=0,v=new utils.Buf8(4),O=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return Z_STREAM_ERROR;a=e.state,a.mode===TYPE&&(a.mode=TYPEDO),l=e.next_out,n=e.output,o=e.avail_out,s=e.next_in,i=e.input,r=e.avail_in,d=a.hold,f=a.bits,c=r,h=o,D=Z_OK;e:for(;;)switch(a.mode){case HEAD:if(0===a.wrap){a.mode=TYPEDO;break}for(;16>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}if(2&a.wrap&&35615===d){a.check=0,v[0]=255&d,v[1]=d>>>8&255,a.check=crc32(a.check,v,2,0),d=0,f=0,a.mode=FLAGS;break}if(a.flags=0,a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&d)<<8)+(d>>8))%31){e.msg="incorrect header check",a.mode=BAD;break}if((15&d)!==Z_DEFLATED){e.msg="unknown compression method",a.mode=BAD;break}if(d>>>=4,f-=4,g=(15&d)+8,0===a.wbits)a.wbits=g;else if(g>a.wbits){e.msg="invalid window size",a.mode=BAD;break}a.dmax=1<<g,e.adler=a.check=1,a.mode=512&d?DICTID:TYPE,d=0,f=0;break;case FLAGS:for(;16>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}if(a.flags=d,(255&a.flags)!==Z_DEFLATED){e.msg="unknown compression method",a.mode=BAD;break}if(57344&a.flags){e.msg="unknown header flags set",a.mode=BAD;break}a.head&&(a.head.text=d>>8&1),512&a.flags&&(v[0]=255&d,v[1]=d>>>8&255,a.check=crc32(a.check,v,2,0)),d=0,f=0,a.mode=TIME;case TIME:for(;32>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}a.head&&(a.head.time=d),512&a.flags&&(v[0]=255&d,v[1]=d>>>8&255,v[2]=d>>>16&255,v[3]=d>>>24&255,a.check=crc32(a.check,v,4,0)),d=0,f=0,a.mode=OS;case OS:for(;16>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}a.head&&(a.head.xflags=255&d,a.head.os=d>>8),512&a.flags&&(v[0]=255&d,v[1]=d>>>8&255,a.check=crc32(a.check,v,2,0)),d=0,f=0,a.mode=EXLEN;case EXLEN:if(1024&a.flags){for(;16>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}a.length=d,a.head&&(a.head.extra_len=d),512&a.flags&&(v[0]=255&d,v[1]=d>>>8&255,a.check=crc32(a.check,v,2,0)),d=0,f=0}else a.head&&(a.head.extra=null);a.mode=EXTRA;case EXTRA:if(1024&a.flags&&(E=a.length,E>r&&(E=r),E&&(a.head&&(g=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Array(a.head.extra_len)),utils.arraySet(a.head.extra,i,s,E,g)),512&a.flags&&(a.check=crc32(a.check,i,E,s)),r-=E,s+=E,a.length-=E),a.length))break e;a.length=0,a.mode=NAME;case NAME:if(2048&a.flags){if(0===r)break e;E=0;do g=i[s+E++],a.head&&g&&a.length<65536&&(a.head.name+=String.fromCharCode(g));while(g&&r>E);if(512&a.flags&&(a.check=crc32(a.check,i,E,s)),r-=E,s+=E,g)break e}else a.head&&(a.head.name=null);a.length=0,a.mode=COMMENT;case COMMENT:if(4096&a.flags){if(0===r)break e;E=0;do g=i[s+E++],a.head&&g&&a.length<65536&&(a.head.comment+=String.fromCharCode(g));while(g&&r>E);if(512&a.flags&&(a.check=crc32(a.check,i,E,s)),r-=E,s+=E,g)break e}else a.head&&(a.head.comment=null);a.mode=HCRC;case HCRC:if(512&a.flags){for(;16>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}if(d!==(65535&a.check)){e.msg="header crc mismatch",a.mode=BAD;break}d=0,f=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),e.adler=a.check=0,a.mode=TYPE;break;case DICTID:for(;32>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}e.adler=a.check=ZSWAP32(d),d=0,f=0,a.mode=DICT;case DICT:if(0===a.havedict)return e.next_out=l,e.avail_out=o,e.next_in=s,e.avail_in=r,a.hold=d,a.bits=f,Z_NEED_DICT;e.adler=a.check=1,a.mode=TYPE;case TYPE:if(t===Z_BLOCK||t===Z_TREES)break e;case TYPEDO:if(a.last){d>>>=7&f,f-=7&f,a.mode=CHECK;break}for(;3>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}switch(a.last=1&d,d>>>=1,f-=1,3&d){case 0:a.mode=STORED;break;case 1:if(fixedtables(a),a.mode=LEN_,t===Z_TREES){d>>>=2,f-=2;break e}break;case 2:a.mode=TABLE;break;case 3:e.msg="invalid block type",a.mode=BAD}d>>>=2,f-=2;break;case STORED:for(d>>>=7&f,f-=7&f;32>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}if((65535&d)!==(d>>>16^65535)){e.msg="invalid stored block lengths",a.mode=BAD;break}if(a.length=65535&d,d=0,f=0,a.mode=COPY_,t===Z_TREES)break e;case COPY_:a.mode=COPY;case COPY:if(E=a.length){if(E>r&&(E=r),E>o&&(E=o),0===E)break e;utils.arraySet(n,i,s,E,l),r-=E,s+=E,o-=E,l+=E,a.length-=E;break}a.mode=TYPE;break;case TABLE:for(;14>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}if(a.nlen=(31&d)+257,d>>>=5,f-=5,a.ndist=(31&d)+1,d>>>=5,f-=5,a.ncode=(15&d)+4,d>>>=4,f-=4,a.nlen>286||a.ndist>30){e.msg="too many length or distance symbols",a.mode=BAD;break}a.have=0,a.mode=LENLENS;case LENLENS:for(;a.have<a.ncode;){for(;3>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}a.lens[O[a.have++]]=7&d,d>>>=3,f-=3}for(;a.have<19;)a.lens[O[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,S={bits:a.lenbits},D=inflate_table(CODES,a.lens,0,19,a.lencode,0,a.work,S),a.lenbits=S.bits,D){e.msg="invalid code lengths set",a.mode=BAD;break}a.have=0,a.mode=CODELENS;case CODELENS:for(;a.have<a.nlen+a.ndist;){for(;A=a.lencode[d&(1<<a.lenbits)-1],_=A>>>24,m=A>>>16&255,u=65535&A,!(f>=_);){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}if(16>u)d>>>=_,f-=_,a.lens[a.have++]=u;else{if(16===u){for(x=_+2;x>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}if(d>>>=_,f-=_,0===a.have){e.msg="invalid bit length repeat",a.mode=BAD;break}g=a.lens[a.have-1],E=3+(3&d),d>>>=2,f-=2}else if(17===u){for(x=_+3;x>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}d>>>=_,f-=_,g=0,E=3+(7&d),d>>>=3,f-=3}else{for(x=_+7;x>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}d>>>=_,f-=_,g=0,E=11+(127&d),d>>>=7,f-=7}if(a.have+E>a.nlen+a.ndist){e.msg="invalid bit length repeat",a.mode=BAD;break}for(;E--;)a.lens[a.have++]=g}}if(a.mode===BAD)break;if(0===a.lens[256]){e.msg="invalid code -- missing end-of-block",a.mode=BAD;break}if(a.lenbits=9,S={bits:a.lenbits},D=inflate_table(LENS,a.lens,0,a.nlen,a.lencode,0,a.work,S),a.lenbits=S.bits,D){e.msg="invalid literal/lengths set",a.mode=BAD;break}if(a.distbits=6,a.distcode=a.distdyn,S={bits:a.distbits},D=inflate_table(DISTS,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,S),a.distbits=S.bits,D){e.msg="invalid distances set",a.mode=BAD;break}if(a.mode=LEN_,t===Z_TREES)break e;case LEN_:a.mode=LEN;case LEN:if(r>=6&&o>=258){e.next_out=l,e.avail_out=o,e.next_in=s,e.avail_in=r,a.hold=d,a.bits=f,inflate_fast(e,h),l=e.next_out,n=e.output,o=e.avail_out,s=e.next_in,i=e.input,r=e.avail_in,d=a.hold,f=a.bits,a.mode===TYPE&&(a.back=-1);break}for(a.back=0;A=a.lencode[d&(1<<a.lenbits)-1],_=A>>>24,m=A>>>16&255,u=65535&A,!(f>=_);){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}if(m&&0===(240&m)){for(w=_,R=m,T=u;A=a.lencode[T+((d&(1<<w+R)-1)>>w)],_=A>>>24,m=A>>>16&255,u=65535&A,!(f>=w+_);){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}d>>>=w,f-=w,a.back+=w}if(d>>>=_,f-=_,a.back+=_,a.length=u,0===m){a.mode=LIT;break}if(32&m){a.back=-1,a.mode=TYPE;break}if(64&m){e.msg="invalid literal/length code",a.mode=BAD;break}a.extra=15&m,a.mode=LENEXT;case LENEXT:if(a.extra){for(x=a.extra;x>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}a.length+=d&(1<<a.extra)-1,d>>>=a.extra,f-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=DIST;case DIST:for(;A=a.distcode[d&(1<<a.distbits)-1],_=A>>>24,m=A>>>16&255,u=65535&A,!(f>=_);){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}if(0===(240&m)){for(w=_,R=m,T=u;A=a.distcode[T+((d&(1<<w+R)-1)>>w)],_=A>>>24,m=A>>>16&255,u=65535&A,!(f>=w+_);){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}d>>>=w,f-=w,a.back+=w}if(d>>>=_,f-=_,a.back+=_,64&m){e.msg="invalid distance code",a.mode=BAD;break}a.offset=u,a.extra=15&m,a.mode=DISTEXT;case DISTEXT:if(a.extra){for(x=a.extra;x>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}a.offset+=d&(1<<a.extra)-1,d>>>=a.extra,f-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){e.msg="invalid distance too far back",a.mode=BAD;break}a.mode=MATCH;case MATCH:if(0===o)break e;if(E=h-o,a.offset>E){if(E=a.offset-E,E>a.whave&&a.sane){e.msg="invalid distance too far back",a.mode=BAD;break}E>a.wnext?(E-=a.wnext,b=a.wsize-E):b=a.wnext-E,E>a.length&&(E=a.length),k=a.window}else k=n,b=l-a.offset,E=a.length;E>o&&(E=o),o-=E,a.length-=E;do n[l++]=k[b++];while(--E);0===a.length&&(a.mode=LEN);break;case LIT:if(0===o)break e;n[l++]=a.length,o--,a.mode=LEN;break;case CHECK:if(a.wrap){for(;32>f;){if(0===r)break e;r--,d|=i[s++]<<f,f+=8}if(h-=o,e.total_out+=h,a.total+=h,h&&(e.adler=a.check=a.flags?crc32(a.check,n,h,l-h):adler32(a.check,n,h,l-h)),h=o,(a.flags?d:ZSWAP32(d))!==a.check){e.msg="incorrect data check",a.mode=BAD;break}d=0,f=0}a.mode=LENGTH;case LENGTH:if(a.wrap&&a.flags){for(;32>f;){if(0===r)break e;r--,d+=i[s++]<<f,f+=8}if(d!==(4294967295&a.total)){e.msg="incorrect length check",a.mode=BAD;break}d=0,f=0}a.mode=DONE;case DONE:D=Z_STREAM_END;break e;case BAD:D=Z_DATA_ERROR;break e;case MEM:return Z_MEM_ERROR;case SYNC:default:return Z_STREAM_ERROR}return e.next_out=l,e.avail_out=o,e.next_in=s,e.avail_in=r,a.hold=d,a.bits=f,(a.wsize||h!==e.avail_out&&a.mode<BAD&&(a.mode<CHECK||t!==Z_FINISH))&&updatewindow(e,e.output,e.next_out,h-e.avail_out)?(a.mode=MEM,Z_MEM_ERROR):(c-=e.avail_in,h-=e.avail_out,e.total_in+=c,e.total_out+=h,a.total+=h,a.wrap&&h&&(e.adler=a.check=a.flags?crc32(a.check,n,h,e.next_out-h):adler32(a.check,n,h,e.next_out-h)),e.data_type=a.bits+(a.last?64:0)+(a.mode===TYPE?128:0)+(a.mode===LEN_||a.mode===COPY_?256:0),(0===c&&0===h||t===Z_FINISH)&&D===Z_OK&&(D=Z_BUF_ERROR),D)}function inflateEnd(e){if(!e||!e.state)return Z_STREAM_ERROR;var t=e.state;return t.window&&(t.window=null),e.state=null,Z_OK}function inflateGetHeader(e,t){var a;return e&&e.state?(a=e.state,0===(2&a.wrap)?Z_STREAM_ERROR:(a.head=t,t.done=!1,Z_OK)):Z_STREAM_ERROR}var utils=require("../utils/common"),adler32=require("./adler32"),crc32=require("./crc32"),inflate_fast=require("./inffast"),inflate_table=require("./inftrees"),CODES=0,LENS=1,DISTS=2,Z_FINISH=4,Z_BLOCK=5,Z_TREES=6,Z_OK=0,Z_STREAM_END=1,Z_NEED_DICT=2,Z_STREAM_ERROR=-2,Z_DATA_ERROR=-3,Z_MEM_ERROR=-4,Z_BUF_ERROR=-5,Z_DEFLATED=8,HEAD=1,FLAGS=2,TIME=3,OS=4,EXLEN=5,EXTRA=6,NAME=7,COMMENT=8,HCRC=9,DICTID=10,DICT=11,TYPE=12,TYPEDO=13,STORED=14,COPY_=15,COPY=16,TABLE=17,LENLENS=18,CODELENS=19,LEN_=20,LEN=21,LENEXT=22,DIST=23,DISTEXT=24,MATCH=25,LIT=26,CHECK=27,LENGTH=28,DONE=29,BAD=30,MEM=31,SYNC=32,ENOUGH_LENS=852,ENOUGH_DISTS=592,MAX_WBITS=15,DEF_WBITS=MAX_WBITS,virgin=!0,lenfix,distfix;exports.inflateReset=inflateReset,exports.inflateReset2=inflateReset2,exports.inflateResetKeep=inflateResetKeep,exports.inflateInit=inflateInit,exports.inflateInit2=inflateInit2,exports.inflate=inflate,exports.inflateEnd=inflateEnd,exports.inflateGetHeader=inflateGetHeader,exports.inflateInfo="pako inflate (from Nodeca project)";

},{"../utils/common":181,"./adler32":182,"./crc32":184,"./inffast":186,"./inftrees":188}],188:[function(require,module,exports){
"use strict";var utils=require("../utils/common"),MAXBITS=15,ENOUGH_LENS=852,ENOUGH_DISTS=592,CODES=0,LENS=1,DISTS=2,lbase=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],lext=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],dbase=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],dext=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];module.exports=function(r,S,e,f,t,i,u,o){var E,l,s,n,I,N,T,B,D,O=o.bits,a=0,b=0,A=0,L=0,M=0,X=0,d=0,G=0,H=0,U=0,_=null,x=0,c=new utils.Buf16(MAXBITS+1),m=new utils.Buf16(MAXBITS+1),v=null,w=0;for(a=0;MAXBITS>=a;a++)c[a]=0;for(b=0;f>b;b++)c[S[e+b]]++;for(M=O,L=MAXBITS;L>=1&&0===c[L];L--);if(M>L&&(M=L),0===L)return t[i++]=20971520,t[i++]=20971520,o.bits=1,0;for(A=1;L>A&&0===c[A];A++);for(A>M&&(M=A),G=1,a=1;MAXBITS>=a;a++)if(G<<=1,G-=c[a],0>G)return-1;if(G>0&&(r===CODES||1!==L))return-1;for(m[1]=0,a=1;MAXBITS>a;a++)m[a+1]=m[a]+c[a];for(b=0;f>b;b++)0!==S[e+b]&&(u[m[S[e+b]]++]=b);if(r===CODES?(_=v=u,N=19):r===LENS?(_=lbase,x-=257,v=lext,w-=257,N=256):(_=dbase,v=dext,N=-1),U=0,b=0,a=A,I=i,X=M,d=0,s=-1,H=1<<M,n=H-1,r===LENS&&H>ENOUGH_LENS||r===DISTS&&H>ENOUGH_DISTS)return 1;for(var C=0;;){C++,T=a-d,u[b]<N?(B=0,D=u[b]):u[b]>N?(B=v[w+u[b]],D=_[x+u[b]]):(B=96,D=0),E=1<<a-d,l=1<<X,A=l;do l-=E,t[I+(U>>d)+l]=T<<24|B<<16|D|0;while(0!==l);for(E=1<<a-1;U&E;)E>>=1;if(0!==E?(U&=E-1,U+=E):U=0,b++,0===--c[a]){if(a===L)break;a=S[e+u[b]]}if(a>M&&(U&n)!==s){for(0===d&&(d=M),I+=A,X=a-d,G=1<<X;L>X+d&&(G-=c[X+d],!(0>=G));)X++,G<<=1;if(H+=1<<X,r===LENS&&H>ENOUGH_LENS||r===DISTS&&H>ENOUGH_DISTS)return 1;s=U&n,t[s]=M<<24|X<<16|I-i|0}}return 0!==U&&(t[I+U]=a-d<<24|64<<16|0),o.bits=M,0};

},{"../utils/common":181}],189:[function(require,module,exports){
"use strict";module.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"};

},{}],190:[function(require,module,exports){
"use strict";function zero(e){for(var _=e.length;--_>=0;)e[_]=0}function d_code(e){return 256>e?_dist_code[e]:_dist_code[256+(e>>>7)]}function put_short(e,_){e.pending_buf[e.pending++]=255&_,e.pending_buf[e.pending++]=_>>>8&255}function send_bits(e,_,t){e.bi_valid>Buf_size-t?(e.bi_buf|=_<<e.bi_valid&65535,put_short(e,e.bi_buf),e.bi_buf=_>>Buf_size-e.bi_valid,e.bi_valid+=t-Buf_size):(e.bi_buf|=_<<e.bi_valid&65535,e.bi_valid+=t)}function send_code(e,_,t){send_bits(e,t[2*_],t[2*_+1])}function bi_reverse(e,_){var t=0;do t|=1&e,e>>>=1,t<<=1;while(--_>0);return t>>>1}function bi_flush(e){16===e.bi_valid?(put_short(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):e.bi_valid>=8&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}function gen_bitlen(e,_){var t,r,i,n,s,d,a=_.dyn_tree,l=_.max_code,c=_.stat_desc.static_tree,o=_.stat_desc.has_stree,b=_.stat_desc.extra_bits,f=_.stat_desc.extra_base,u=_.stat_desc.max_length,p=0;for(n=0;MAX_BITS>=n;n++)e.bl_count[n]=0;for(a[2*e.heap[e.heap_max]+1]=0,t=e.heap_max+1;HEAP_SIZE>t;t++)r=e.heap[t],n=a[2*a[2*r+1]+1]+1,n>u&&(n=u,p++),a[2*r+1]=n,r>l||(e.bl_count[n]++,s=0,r>=f&&(s=b[r-f]),d=a[2*r],e.opt_len+=d*(n+s),o&&(e.static_len+=d*(c[2*r+1]+s)));if(0!==p){do{for(n=u-1;0===e.bl_count[n];)n--;e.bl_count[n]--,e.bl_count[n+1]+=2,e.bl_count[u]--,p-=2}while(p>0);for(n=u;0!==n;n--)for(r=e.bl_count[n];0!==r;)i=e.heap[--t],i>l||(a[2*i+1]!==n&&(e.opt_len+=(n-a[2*i+1])*a[2*i],a[2*i+1]=n),r--)}}function gen_codes(e,_,t){var r,i,n=new Array(MAX_BITS+1),s=0;for(r=1;MAX_BITS>=r;r++)n[r]=s=s+t[r-1]<<1;for(i=0;_>=i;i++){var d=e[2*i+1];0!==d&&(e[2*i]=bi_reverse(n[d]++,d))}}function tr_static_init(){var e,_,t,r,i,n=new Array(MAX_BITS+1);for(t=0,r=0;LENGTH_CODES-1>r;r++)for(base_length[r]=t,e=0;e<1<<extra_lbits[r];e++)_length_code[t++]=r;for(_length_code[t-1]=r,i=0,r=0;16>r;r++)for(base_dist[r]=i,e=0;e<1<<extra_dbits[r];e++)_dist_code[i++]=r;for(i>>=7;D_CODES>r;r++)for(base_dist[r]=i<<7,e=0;e<1<<extra_dbits[r]-7;e++)_dist_code[256+i++]=r;for(_=0;MAX_BITS>=_;_++)n[_]=0;for(e=0;143>=e;)static_ltree[2*e+1]=8,e++,n[8]++;for(;255>=e;)static_ltree[2*e+1]=9,e++,n[9]++;for(;279>=e;)static_ltree[2*e+1]=7,e++,n[7]++;for(;287>=e;)static_ltree[2*e+1]=8,e++,n[8]++;for(gen_codes(static_ltree,L_CODES+1,n),e=0;D_CODES>e;e++)static_dtree[2*e+1]=5,static_dtree[2*e]=bi_reverse(e,5);static_l_desc=new StaticTreeDesc(static_ltree,extra_lbits,LITERALS+1,L_CODES,MAX_BITS),static_d_desc=new StaticTreeDesc(static_dtree,extra_dbits,0,D_CODES,MAX_BITS),static_bl_desc=new StaticTreeDesc(new Array(0),extra_blbits,0,BL_CODES,MAX_BL_BITS)}function init_block(e){var _;for(_=0;L_CODES>_;_++)e.dyn_ltree[2*_]=0;for(_=0;D_CODES>_;_++)e.dyn_dtree[2*_]=0;for(_=0;BL_CODES>_;_++)e.bl_tree[2*_]=0;e.dyn_ltree[2*END_BLOCK]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function bi_windup(e){e.bi_valid>8?put_short(e,e.bi_buf):e.bi_valid>0&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function copy_block(e,_,t,r){bi_windup(e),r&&(put_short(e,t),put_short(e,~t)),utils.arraySet(e.pending_buf,e.window,_,t,e.pending),e.pending+=t}function smaller(e,_,t,r){var i=2*_,n=2*t;return e[i]<e[n]||e[i]===e[n]&&r[_]<=r[t]}function pqdownheap(e,_,t){for(var r=e.heap[t],i=t<<1;i<=e.heap_len&&(i<e.heap_len&&smaller(_,e.heap[i+1],e.heap[i],e.depth)&&i++,!smaller(_,r,e.heap[i],e.depth));)e.heap[t]=e.heap[i],t=i,i<<=1;e.heap[t]=r}function compress_block(e,_,t){var r,i,n,s,d=0;if(0!==e.last_lit)do r=e.pending_buf[e.d_buf+2*d]<<8|e.pending_buf[e.d_buf+2*d+1],i=e.pending_buf[e.l_buf+d],d++,0===r?send_code(e,i,_):(n=_length_code[i],send_code(e,n+LITERALS+1,_),s=extra_lbits[n],0!==s&&(i-=base_length[n],send_bits(e,i,s)),r--,n=d_code(r),send_code(e,n,t),s=extra_dbits[n],0!==s&&(r-=base_dist[n],send_bits(e,r,s)));while(d<e.last_lit);send_code(e,END_BLOCK,_)}function build_tree(e,_){var t,r,i,n=_.dyn_tree,s=_.stat_desc.static_tree,d=_.stat_desc.has_stree,a=_.stat_desc.elems,l=-1;for(e.heap_len=0,e.heap_max=HEAP_SIZE,t=0;a>t;t++)0!==n[2*t]?(e.heap[++e.heap_len]=l=t,e.depth[t]=0):n[2*t+1]=0;for(;e.heap_len<2;)i=e.heap[++e.heap_len]=2>l?++l:0,n[2*i]=1,e.depth[i]=0,e.opt_len--,d&&(e.static_len-=s[2*i+1]);for(_.max_code=l,t=e.heap_len>>1;t>=1;t--)pqdownheap(e,n,t);i=a;do t=e.heap[1],e.heap[1]=e.heap[e.heap_len--],pqdownheap(e,n,1),r=e.heap[1],e.heap[--e.heap_max]=t,e.heap[--e.heap_max]=r,n[2*i]=n[2*t]+n[2*r],e.depth[i]=(e.depth[t]>=e.depth[r]?e.depth[t]:e.depth[r])+1,n[2*t+1]=n[2*r+1]=i,e.heap[1]=i++,pqdownheap(e,n,1);while(e.heap_len>=2);e.heap[--e.heap_max]=e.heap[1],gen_bitlen(e,_),gen_codes(n,l,e.bl_count)}function scan_tree(e,_,t){var r,i,n=-1,s=_[1],d=0,a=7,l=4;for(0===s&&(a=138,l=3),_[2*(t+1)+1]=65535,r=0;t>=r;r++)i=s,s=_[2*(r+1)+1],++d<a&&i===s||(l>d?e.bl_tree[2*i]+=d:0!==i?(i!==n&&e.bl_tree[2*i]++,e.bl_tree[2*REP_3_6]++):10>=d?e.bl_tree[2*REPZ_3_10]++:e.bl_tree[2*REPZ_11_138]++,d=0,n=i,0===s?(a=138,l=3):i===s?(a=6,l=3):(a=7,l=4))}function send_tree(e,_,t){var r,i,n=-1,s=_[1],d=0,a=7,l=4;for(0===s&&(a=138,l=3),r=0;t>=r;r++)if(i=s,s=_[2*(r+1)+1],!(++d<a&&i===s)){if(l>d){do send_code(e,i,e.bl_tree);while(0!==--d)}else 0!==i?(i!==n&&(send_code(e,i,e.bl_tree),d--),send_code(e,REP_3_6,e.bl_tree),send_bits(e,d-3,2)):10>=d?(send_code(e,REPZ_3_10,e.bl_tree),send_bits(e,d-3,3)):(send_code(e,REPZ_11_138,e.bl_tree),send_bits(e,d-11,7));d=0,n=i,0===s?(a=138,l=3):i===s?(a=6,l=3):(a=7,l=4)}}function build_bl_tree(e){var _;for(scan_tree(e,e.dyn_ltree,e.l_desc.max_code),scan_tree(e,e.dyn_dtree,e.d_desc.max_code),build_tree(e,e.bl_desc),_=BL_CODES-1;_>=3&&0===e.bl_tree[2*bl_order[_]+1];_--);return e.opt_len+=3*(_+1)+5+5+4,_}function send_all_trees(e,_,t,r){var i;for(send_bits(e,_-257,5),send_bits(e,t-1,5),send_bits(e,r-4,4),i=0;r>i;i++)send_bits(e,e.bl_tree[2*bl_order[i]+1],3);send_tree(e,e.dyn_ltree,_-1),send_tree(e,e.dyn_dtree,t-1)}function detect_data_type(e){var _,t=4093624447;for(_=0;31>=_;_++,t>>>=1)if(1&t&&0!==e.dyn_ltree[2*_])return Z_BINARY;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return Z_TEXT;for(_=32;LITERALS>_;_++)if(0!==e.dyn_ltree[2*_])return Z_TEXT;return Z_BINARY}function _tr_init(e){static_init_done||(tr_static_init(),static_init_done=!0),e.l_desc=new TreeDesc(e.dyn_ltree,static_l_desc),e.d_desc=new TreeDesc(e.dyn_dtree,static_d_desc),e.bl_desc=new TreeDesc(e.bl_tree,static_bl_desc),e.bi_buf=0,e.bi_valid=0,init_block(e)}function _tr_stored_block(e,_,t,r){send_bits(e,(STORED_BLOCK<<1)+(r?1:0),3),copy_block(e,_,t,!0)}function _tr_align(e){send_bits(e,STATIC_TREES<<1,3),send_code(e,END_BLOCK,static_ltree),bi_flush(e)}function _tr_flush_block(e,_,t,r){var i,n,s=0;e.level>0?(e.strm.data_type===Z_UNKNOWN&&(e.strm.data_type=detect_data_type(e)),build_tree(e,e.l_desc),build_tree(e,e.d_desc),s=build_bl_tree(e),i=e.opt_len+3+7>>>3,n=e.static_len+3+7>>>3,i>=n&&(i=n)):i=n=t+5,i>=t+4&&-1!==_?_tr_stored_block(e,_,t,r):e.strategy===Z_FIXED||n===i?(send_bits(e,(STATIC_TREES<<1)+(r?1:0),3),compress_block(e,static_ltree,static_dtree)):(send_bits(e,(DYN_TREES<<1)+(r?1:0),3),send_all_trees(e,e.l_desc.max_code+1,e.d_desc.max_code+1,s+1),compress_block(e,e.dyn_ltree,e.dyn_dtree)),init_block(e),r&&bi_windup(e)}function _tr_tally(e,_,t){return e.pending_buf[e.d_buf+2*e.last_lit]=_>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&_,e.pending_buf[e.l_buf+e.last_lit]=255&t,e.last_lit++,0===_?e.dyn_ltree[2*t]++:(e.matches++,_--,e.dyn_ltree[2*(_length_code[t]+LITERALS+1)]++,e.dyn_dtree[2*d_code(_)]++),e.last_lit===e.lit_bufsize-1}var utils=require("../utils/common"),Z_FIXED=4,Z_BINARY=0,Z_TEXT=1,Z_UNKNOWN=2,STORED_BLOCK=0,STATIC_TREES=1,DYN_TREES=2,MIN_MATCH=3,MAX_MATCH=258,LENGTH_CODES=29,LITERALS=256,L_CODES=LITERALS+1+LENGTH_CODES,D_CODES=30,BL_CODES=19,HEAP_SIZE=2*L_CODES+1,MAX_BITS=15,Buf_size=16,MAX_BL_BITS=7,END_BLOCK=256,REP_3_6=16,REPZ_3_10=17,REPZ_11_138=18,extra_lbits=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],extra_dbits=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],extra_blbits=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],bl_order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],DIST_CODE_LEN=512,static_ltree=new Array(2*(L_CODES+2));zero(static_ltree);var static_dtree=new Array(2*D_CODES);zero(static_dtree);var _dist_code=new Array(DIST_CODE_LEN);zero(_dist_code);var _length_code=new Array(MAX_MATCH-MIN_MATCH+1);zero(_length_code);var base_length=new Array(LENGTH_CODES);zero(base_length);var base_dist=new Array(D_CODES);zero(base_dist);var StaticTreeDesc=function(e,_,t,r,i){this.static_tree=e,this.extra_bits=_,this.extra_base=t,this.elems=r,this.max_length=i,this.has_stree=e&&e.length},static_l_desc,static_d_desc,static_bl_desc,TreeDesc=function(e,_){this.dyn_tree=e,this.max_code=0,this.stat_desc=_},static_init_done=!1;exports._tr_init=_tr_init,exports._tr_stored_block=_tr_stored_block,exports._tr_flush_block=_tr_flush_block,exports._tr_tally=_tr_tally,exports._tr_align=_tr_align;

},{"../utils/common":181}],191:[function(require,module,exports){
"use strict";function ZStream(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}module.exports=ZStream;

},{}],192:[function(require,module,exports){
module.exports={"2.16.840.1.101.3.4.1.1": "aes-128-ecb",
"2.16.840.1.101.3.4.1.2": "aes-128-cbc",
"2.16.840.1.101.3.4.1.3": "aes-128-ofb",
"2.16.840.1.101.3.4.1.4": "aes-128-cfb",
"2.16.840.1.101.3.4.1.21": "aes-192-ecb",
"2.16.840.1.101.3.4.1.22": "aes-192-cbc",
"2.16.840.1.101.3.4.1.23": "aes-192-ofb",
"2.16.840.1.101.3.4.1.24": "aes-192-cfb",
"2.16.840.1.101.3.4.1.41": "aes-256-ecb",
"2.16.840.1.101.3.4.1.42": "aes-256-cbc",
"2.16.840.1.101.3.4.1.43": "aes-256-ofb",
"2.16.840.1.101.3.4.1.44": "aes-256-cfb"
}
},{}],193:[function(require,module,exports){
var asn1=require("asn1.js"),RSAPrivateKey=asn1.define("RSAPrivateKey",function(){this.seq().obj(this.key("version")["int"](),this.key("modulus")["int"](),this.key("publicExponent")["int"](),this.key("privateExponent")["int"](),this.key("prime1")["int"](),this.key("prime2")["int"](),this.key("exponent1")["int"](),this.key("exponent2")["int"](),this.key("coefficient")["int"]())});exports.RSAPrivateKey=RSAPrivateKey;var RSAPublicKey=asn1.define("RSAPublicKey",function(){this.seq().obj(this.key("modulus")["int"](),this.key("publicExponent")["int"]())});exports.RSAPublicKey=RSAPublicKey;var PublicKey=asn1.define("SubjectPublicKeyInfo",function(){this.seq().obj(this.key("algorithm").use(AlgorithmIdentifier),this.key("subjectPublicKey").bitstr())});exports.PublicKey=PublicKey;var AlgorithmIdentifier=asn1.define("AlgorithmIdentifier",function(){this.seq().obj(this.key("algorithm").objid(),this.key("none").null_().optional(),this.key("curve").objid().optional(),this.key("params").seq().obj(this.key("p")["int"](),this.key("q")["int"](),this.key("g")["int"]()).optional())}),PrivateKeyInfo=asn1.define("PrivateKeyInfo",function(){this.seq().obj(this.key("version")["int"](),this.key("algorithm").use(AlgorithmIdentifier),this.key("subjectPrivateKey").octstr())});exports.PrivateKey=PrivateKeyInfo;var EncryptedPrivateKeyInfo=asn1.define("EncryptedPrivateKeyInfo",function(){this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(),this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(),this.key("kdeparams").seq().obj(this.key("salt").octstr(),this.key("iters")["int"]())),this.key("cipher").seq().obj(this.key("algo").objid(),this.key("iv").octstr()))),this.key("subjectPrivateKey").octstr())});exports.EncryptedPrivateKey=EncryptedPrivateKeyInfo;var DSAPrivateKey=asn1.define("DSAPrivateKey",function(){this.seq().obj(this.key("version")["int"](),this.key("p")["int"](),this.key("q")["int"](),this.key("g")["int"](),this.key("pub_key")["int"](),this.key("priv_key")["int"]())});exports.DSAPrivateKey=DSAPrivateKey,exports.DSAparam=asn1.define("DSAparam",function(){this["int"]()});var ECPrivateKey=asn1.define("ECPrivateKey",function(){this.seq().obj(this.key("version")["int"](),this.key("privateKey").octstr(),this.key("parameters").optional().explicit(0).use(ECParameters),this.key("publicKey").optional().explicit(1).bitstr())});exports.ECPrivateKey=ECPrivateKey;var ECParameters=asn1.define("ECParameters",function(){this.choice({namedCurve:this.objid()})});exports.signature=asn1.define("signature",function(){this.seq().obj(this.key("r")["int"](),this.key("s")["int"]())});

},{"asn1.js":3}],194:[function(require,module,exports){
(function (Buffer){
var findProc=/Proc-Type: 4,ENCRYPTED\r?\nDEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)\r?\n\r?\n([0-9A-z\n\r\+\/\=]+)\r?\n/m,startRegex=/^-----BEGIN (.*) KEY-----\r?\n/m,fullRegex=/^-----BEGIN (.*) KEY-----\r?\n([0-9A-z\n\r\+\/\=]+)\r?\n-----END \1 KEY-----$/m,evp=require("evp_bytestokey"),ciphers=require("browserify-aes");module.exports=function(e,r){var a,n=e.toString(),t=n.match(findProc);if(t){var f="aes"+t[1],c=new Buffer(t[2],"hex"),s=new Buffer(t[3].replace(/\r?\n/g,""),"base64"),i=evp(r,c.slice(0,8),parseInt(t[1],10)).key,p=[],u=ciphers.createDecipheriv(f,i,c);p.push(u.update(s)),p.push(u["final"]()),a=Buffer.concat(p)}else{var o=n.match(fullRegex);a=new Buffer(o[2].replace(/\r?\n/g,""),"base64")}var E=n.match(startRegex)[1]+" KEY";return{tag:E,data:a}};

}).call(this,require("buffer").Buffer)
},{"browserify-aes":34,"buffer":60,"evp_bytestokey":111}],195:[function(require,module,exports){
(function (Buffer){
function parseKeys(e){var r;"object"!=typeof e||Buffer.isBuffer(e)||(r=e.passphrase,e=e.key),"string"==typeof e&&(e=new Buffer(e));var a,t,s=fixProc(e,r),i=s.tag,c=s.data;switch(i){case"PUBLIC KEY":switch(t=asn1.PublicKey.decode(c,"der"),a=t.algorithm.algorithm.join(".")){case"1.2.840.113549.1.1.1":return asn1.RSAPublicKey.decode(t.subjectPublicKey.data,"der");case"1.2.840.10045.2.1":return t.subjectPrivateKey=t.subjectPublicKey,{type:"ec",data:t};case"1.2.840.10040.4.1":return t.algorithm.params.pub_key=asn1.DSAparam.decode(t.subjectPublicKey.data,"der"),{type:"dsa",data:t.algorithm.params};default:throw new Error("unknown key id "+a)}throw new Error("unknown key type "+i);case"ENCRYPTED PRIVATE KEY":c=asn1.EncryptedPrivateKey.decode(c,"der"),c=decrypt(c,r);case"PRIVATE KEY":switch(t=asn1.PrivateKey.decode(c,"der"),a=t.algorithm.algorithm.join(".")){case"1.2.840.113549.1.1.1":return asn1.RSAPrivateKey.decode(t.subjectPrivateKey,"der");case"1.2.840.10045.2.1":return{curve:t.algorithm.curve,privateKey:asn1.ECPrivateKey.decode(t.subjectPrivateKey,"der").privateKey};case"1.2.840.10040.4.1":return t.algorithm.params.priv_key=asn1.DSAparam.decode(t.subjectPrivateKey,"der"),{type:"dsa",params:t.algorithm.params};default:throw new Error("unknown key id "+a)}throw new Error("unknown key type "+i);case"RSA PUBLIC KEY":return asn1.RSAPublicKey.decode(c,"der");case"RSA PRIVATE KEY":return asn1.RSAPrivateKey.decode(c,"der");case"DSA PRIVATE KEY":return{type:"dsa",params:asn1.DSAPrivateKey.decode(c,"der")};case"EC PRIVATE KEY":return c=asn1.ECPrivateKey.decode(c,"der"),{curve:c.parameters.value,privateKey:c.privateKey};default:throw new Error("unknown key type "+i)}}function decrypt(e,r){var a=e.algorithm.decrypt.kde.kdeparams.salt,t=parseInt(e.algorithm.decrypt.kde.kdeparams.iters.toString(),10),s=aesid[e.algorithm.decrypt.cipher.algo.join(".")],i=e.algorithm.decrypt.cipher.iv,c=e.subjectPrivateKey,d=parseInt(s.split("-")[1],10)/8,n=compat.pbkdf2Sync(r,a,t,d),o=ciphers.createDecipheriv(s,n,i),u=[];return u.push(o.update(c)),u.push(o["final"]()),Buffer.concat(u)}var asn1=require("./asn1"),aesid=require("./aesid.json"),fixProc=require("./fixProc"),ciphers=require("browserify-aes"),compat=require("pbkdf2");module.exports=parseKeys,parseKeys.signature=asn1.signature;

}).call(this,require("buffer").Buffer)
},{"./aesid.json":192,"./asn1":193,"./fixProc":194,"browserify-aes":34,"buffer":60,"pbkdf2":199}],196:[function(require,module,exports){
"use strict";function parseurl(r){var e=r.url;if(void 0!==e){var a=r._parsedUrl;return fresh(e,a)?a:(a=fastparse(e),a._raw=e,r._parsedUrl=a)}}function originalurl(r){var e=r.originalUrl;if("string"!=typeof e)return parseurl(r);var a=r._parsedOriginalUrl;return fresh(e,a)?a:(a=fastparse(e),a._raw=e,r._parsedOriginalUrl=a)}function fastparse(r){var e="string"==typeof r&&simplePathRegExp.exec(r);if(e){var a=e[1],l=e[2]||null,s=void 0!==Url?new Url:{};return s.path=r,s.href=r,s.pathname=a,s.search=l,s.query=l&&l.substr(1),s}return parse(r)}function fresh(r,e){return"object"==typeof e&&null!==e&&(void 0===Url||e instanceof Url)&&e._raw===r}var url=require("url"),parse=url.parse,Url=url.Url,simplePathRegExp=/^(\/\/?(?!\/)[^\?#\s]*)(\?[^#\s]*)?$/;module.exports=parseurl,module.exports.original=originalurl;

},{"url":250}],197:[function(require,module,exports){
(function (process){
function normalizeArray(r,t){for(var e=0,n=r.length-1;n>=0;n--){var s=r[n];"."===s?r.splice(n,1):".."===s?(r.splice(n,1),e++):e&&(r.splice(n,1),e--)}if(t)for(;e--;e)r.unshift("..");return r}function filter(r,t){if(r.filter)return r.filter(t);for(var e=[],n=0;n<r.length;n++)t(r[n],n,r)&&e.push(r[n]);return e}var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,splitPath=function(r){return splitPathRe.exec(r).slice(1)};exports.resolve=function(){for(var r="",t=!1,e=arguments.length-1;e>=-1&&!t;e--){var n=e>=0?arguments[e]:process.cwd();if("string"!=typeof n)throw new TypeError("Arguments to path.resolve must be strings");n&&(r=n+"/"+r,t="/"===n.charAt(0))}return r=normalizeArray(filter(r.split("/"),function(r){return!!r}),!t).join("/"),(t?"/":"")+r||"."},exports.normalize=function(r){var t=exports.isAbsolute(r),e="/"===substr(r,-1);return r=normalizeArray(filter(r.split("/"),function(r){return!!r}),!t).join("/"),r||t||(r="."),r&&e&&(r+="/"),(t?"/":"")+r},exports.isAbsolute=function(r){return"/"===r.charAt(0)},exports.join=function(){var r=Array.prototype.slice.call(arguments,0);return exports.normalize(filter(r,function(r,t){if("string"!=typeof r)throw new TypeError("Arguments to path.join must be strings");return r}).join("/"))},exports.relative=function(r,t){function e(r){for(var t=0;t<r.length&&""===r[t];t++);for(var e=r.length-1;e>=0&&""===r[e];e--);return t>e?[]:r.slice(t,e-t+1)}r=exports.resolve(r).substr(1),t=exports.resolve(t).substr(1);for(var n=e(r.split("/")),s=e(t.split("/")),i=Math.min(n.length,s.length),o=i,u=0;i>u;u++)if(n[u]!==s[u]){o=u;break}for(var l=[],u=o;u<n.length;u++)l.push("..");return l=l.concat(s.slice(o)),l.join("/")},exports.sep="/",exports.delimiter=":",exports.dirname=function(r){var t=splitPath(r),e=t[0],n=t[1];return e||n?(n&&(n=n.substr(0,n.length-1)),e+n):"."},exports.basename=function(r,t){var e=splitPath(r)[2];return t&&e.substr(-1*t.length)===t&&(e=e.substr(0,e.length-t.length)),e},exports.extname=function(r){return splitPath(r)[3]};var substr="b"==="ab".substr(-1)?function(r,t,e){return r.substr(t,e)}:function(r,t,e){return 0>t&&(t=r.length+t),r.substr(t,e)};

}).call(this,require('_process'))
},{"_process":201}],198:[function(require,module,exports){
function pathtoRegexp(e,n,t){t=t||{},n=n||[];var r,o=t.strict,a=t.end!==!1,f=t.sensitive?"":"i",i=0,p=n.length,g=0,s=0;if(e instanceof RegExp){for(;r=MATCHING_GROUP_REGEXP.exec(e.source);)n.push({name:s++,optional:!1,offset:r.index});return e}if(Array.isArray(e))return e=e.map(function(e){return pathtoRegexp(e,n,t).source}),new RegExp("(?:"+e.join("|")+")",f);for(e=("^"+e+(o?"":"/"===e[e.length-1]?"?":"/?")).replace(/\/\(/g,"/(?:").replace(/([\/\.])/g,"\\$1").replace(/(\\\/)?(\\\.)?:(\w+)(\(.*?\))?(\*)?(\?)?/g,function(e,t,r,o,a,f,p,g){t=t||"",r=r||"",a=a||"([^\\/"+r+"]+?)",p=p||"",n.push({name:o,optional:!!p,offset:g+i});var s=""+(p?"":t)+"(?:"+r+(p?t:"")+a+(f?"((?:[\\/"+r+"].+?)?)":"")+")"+p;return i+=s.length-e.length,s}).replace(/\*/g,function(e,t){for(var r=n.length;r-- >p&&n[r].offset>t;)n[r].offset+=3;return"(.*)"});r=MATCHING_GROUP_REGEXP.exec(e);){for(var c=0,l=r.index;"\\"===e.charAt(--l);)c++;c%2!==1&&((p+g===n.length||n[p+g].offset>r.index)&&n.splice(p+g,0,{name:s++,optional:!1,offset:r.index}),g++)}return e+=a?"$":"/"===e[e.length-1]?"":"(?=\\/|$)",new RegExp(e,f)}module.exports=pathtoRegexp;var MATCHING_GROUP_REGEXP=/\((?!\?)/g;

},{}],199:[function(require,module,exports){
(function (Buffer){
function pbkdf2(e,r,t,f,n,o){if("function"==typeof n&&(o=n,n=void 0),"function"!=typeof o)throw new Error("No callback provided to pbkdf2");var a=pbkdf2Sync(e,r,t,f,n);setTimeout(function(){o(void 0,a)})}function pbkdf2Sync(e,r,t,f,n){if("number"!=typeof t)throw new TypeError("Iterations not a number");if(0>t)throw new TypeError("Bad iterations");if("number"!=typeof f)throw new TypeError("Key length not a number");if(0>f||f>MAX_ALLOC)throw new TypeError("Bad key length");n=n||"sha1",Buffer.isBuffer(e)||(e=new Buffer(e,"binary")),Buffer.isBuffer(r)||(r=new Buffer(r,"binary"));var o,a=1,i=new Buffer(f),p=new Buffer(r.length+4);r.copy(p,0,0,r.length);for(var c,u,y=1;a>=y;y++){p.writeUInt32BE(y,r.length);var d=createHmac(n,e).update(p).digest();o||(o=d.length,u=new Buffer(o),a=Math.ceil(f/o),c=f-(a-1)*o),d.copy(u,0,0,o);for(var w=1;t>w;w++){d=createHmac(n,e).update(d).digest();for(var b=0;o>b;b++)u[b]^=d[b]}var h=(y-1)*o,B=y===a?c:o;u.copy(i,h,0,B)}return i}var createHmac=require("create-hmac"),MAX_ALLOC=Math.pow(2,30)-1;exports.pbkdf2=pbkdf2,exports.pbkdf2Sync=pbkdf2Sync;

}).call(this,require("buffer").Buffer)
},{"buffer":60,"create-hmac":74}],200:[function(require,module,exports){
(function (process){
"use strict";function nextTick(e){for(var s=new Array(arguments.length-1),n=0;n<s.length;)s[n++]=arguments[n];process.nextTick(function(){e.apply(null,s)})}!process.version||0===process.version.indexOf("v0.")||0===process.version.indexOf("v1.")&&0!==process.version.indexOf("v1.8.")?module.exports=nextTick:module.exports=process.nextTick;

}).call(this,require('_process'))
},{"_process":201}],201:[function(require,module,exports){
function cleanUpNextTick(){draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue()}function drainQueue(){if(!draining){var e=setTimeout(cleanUpNextTick);draining=!0;for(var n=queue.length;n;){for(currentQueue=queue,queue=[];++queueIndex<n;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,n=queue.length}currentQueue=null,draining=!1,clearTimeout(e)}}function Item(e,n){this.fun=e,this.array=n}function noop(){}var process=module.exports={},queue=[],draining=!1,currentQueue,queueIndex=-1;process.nextTick=function(e){var n=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)n[r-1]=arguments[r];queue.push(new Item(e,n)),1!==queue.length||draining||setTimeout(drainQueue,0)},Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.binding=function(e){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(e){throw new Error("process.chdir is not supported")},process.umask=function(){return 0};

},{}],202:[function(require,module,exports){
"use strict";function alladdrs(r,e){var i=forwarded(r);if(!e)return i;"function"!=typeof e&&(e=compile(e));for(var t=0;t<i.length-1;t++)e(i[t],t)||(i.length=t+1);return i}function compile(r){if(!r)throw new TypeError("argument is required");var e="string"==typeof r?[r]:r;if(!Array.isArray(e))throw new TypeError("unsupported trust argument");for(var i=0;i<e.length;i++)r=e[i],ipranges.hasOwnProperty(r)&&(r=ipranges[r],e.splice.apply(e,[i,1].concat(r)),i+=r.length-1);return compileTrust(compileRangeSubnets(e))}function compileRangeSubnets(r){for(var e=new Array(r.length),i=0;i<r.length;i++)e[i]=parseipNotation(r[i]);return e}function compileTrust(r){var e=r.length;return 0===e?trustNone:1===e?trustSingle(r[0]):trustMulti(r)}function parseipNotation(r){var e,i,t,n,a=r.lastIndexOf("/");if(e=-1!==a?r.substring(0,a):r,!isip(e))throw new TypeError("invalid IP address: "+e);if(e=parseip(e),i=e.kind(),t="ipv6"===i?128:32,n=-1!==a?r.substring(a+1,r.length):t,"number"!=typeof n&&(n=digitre.test(n)?parseInt(n,10):isip(n)?parseNetmask(n):0),"ipv6"===e.kind()&&e.isIPv4MappedAddress()&&(e=e.toIPv4Address(),n=t>=n?n-96:n),0>=n||n>t)throw new TypeError("invalid range on address: "+r);return[e,n]}function parseNetmask(r){var e,i,t=parseip(r);switch(t.kind()){case"ipv4":e=t.octets,i=8;break;case"ipv6":e=t.parts,i=16}for(var n,a=Math.pow(2,i)-1,s=0,p=0;p<e.length;p++){n=e[p]&a;{if(n!==a){for(;n;)n=n<<1&a,s+=1;break}s+=i}}return s}function proxyaddr(r,e){if(!r)throw new TypeError("req argument is required");if(!e)throw new TypeError("trust argument is required");var i=alladdrs(r,e),t=i[i.length-1];return t}function trustNone(){return!1}function trustMulti(r){return function(e){if(!isip(e))return!1;for(var i,t,n,a,s,p,o=parseip(e),u=o.kind(),d=0;d<r.length;d++){if(t=r[d],n=t[0],a=n.kind(),s=t[1],p=o,u!==a){if("ipv6"!==u||"ipv4"!==a||!o.isIPv4MappedAddress())continue;i=i||o.toIPv4Address(),p=i}if(p.match(n,s))return!0}return!1}}function trustSingle(r){var e=r[0],i=e.kind(),t="ipv4"===i,n=r[1];return function(r){if(!isip(r))return!1;var a=parseip(r),s=a.kind();return s===i?a.match(e,n):t&&"ipv6"===s&&a.isIPv4MappedAddress()?a.toIPv4Address().match(e,n):!1}}module.exports=proxyaddr,module.exports.all=alladdrs,module.exports.compile=compile;var forwarded=require("forwarded"),ipaddr=require("ipaddr.js"),digitre=/^[0-9]+$/,isip=ipaddr.isValid,parseip=ipaddr.parse,ipranges={linklocal:["169.254.0.0/16","fe80::/10"],loopback:["127.0.0.1/8","::1/128"],uniquelocal:["10.0.0.0/8","172.16.0.0/12","192.168.0.0/16","fc00::/7"]};

},{"forwarded":129,"ipaddr.js":162}],203:[function(require,module,exports){
exports.publicEncrypt=require("./publicEncrypt"),exports.privateDecrypt=require("./privateDecrypt"),exports.privateEncrypt=function(r,p){return exports.publicEncrypt(r,p,!0)},exports.publicDecrypt=function(r,p){return exports.privateDecrypt(r,p,!0)};

},{"./privateDecrypt":205,"./publicEncrypt":206}],204:[function(require,module,exports){
(function (Buffer){
function i2ops(e){var r=new Buffer(4);return r.writeUInt32BE(e,0),r}var createHash=require("create-hash");module.exports=function(e,r){for(var t,a=new Buffer(""),n=0;a.length<r;)t=i2ops(n++),a=Buffer.concat([a,createHash("sha1").update(e).update(t).digest()]);return a.slice(0,r)};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"create-hash":71}],205:[function(require,module,exports){
(function (Buffer){
function oaep(r,e){var n=(r.modulus,r.modulus.byteLength()),t=(e.length,createHash("sha1").update(new Buffer("")).digest()),i=t.length;if(0!==e[0])throw new Error("decryption error");var o=e.slice(1,i+1),u=e.slice(i+1),a=xor(o,mgf(u,i)),c=xor(u,mgf(a,n-i-1));if(compare(t,c.slice(0,i)))throw new Error("decryption error");for(var f=i;0===c[f];)f++;if(1!==c[f++])throw new Error("decryption error");return c.slice(f)}function pkcs1(r,e,n){for(var t=e.slice(0,2),i=2,o=0;0!==e[i++];)if(i>=e.length){o++;break}var u=e.slice(2,i-1);e.slice(i-1,i);if(("0002"!==t.toString("hex")&&!n||"0001"!==t.toString("hex")&&n)&&o++,u.length<8&&o++,o)throw new Error("decryption error");return e.slice(i)}function compare(r,e){r=new Buffer(r),e=new Buffer(e);var n=0,t=r.length;r.length!==e.length&&(n++,t=Math.min(r.length,e.length));for(var i=-1;++i<t;)n+=r[i]^e[i];return n}var parseKeys=require("parse-asn1"),mgf=require("./mgf"),xor=require("./xor"),bn=require("bn.js"),crt=require("browserify-rsa"),createHash=require("create-hash"),withPublic=require("./withPublic");module.exports=function(r,e,n){var t;t=r.padding?r.padding:n?1:4;var i=parseKeys(r),o=i.modulus.byteLength();if(e.length>o||new bn(e).cmp(i.modulus)>=0)throw new Error("decryption error");var u;u=n?withPublic(new bn(e),i):crt(e,i);var a=new Buffer(o-u.length);if(a.fill(0),u=Buffer.concat([a,u],o),4===t)return oaep(i,u);if(1===t)return pkcs1(i,u,n);if(3===t)return u;throw new Error("unknown padding")};

}).call(this,require("buffer").Buffer)
},{"./mgf":204,"./withPublic":207,"./xor":208,"bn.js":19,"browserify-rsa":50,"buffer":60,"create-hash":71,"parse-asn1":195}],206:[function(require,module,exports){
(function (Buffer){
function oaep(e,r){var n=e.modulus.byteLength(),o=r.length,t=createHash("sha1").update(new Buffer("")).digest(),f=t.length,u=2*f;if(o>n-u-2)throw new Error("message too long");var a=new Buffer(n-o-u-2);a.fill(0);var s=n-f-1,i=randomBytes(f),w=xor(Buffer.concat([t,a,new Buffer([1]),r],s),mgf(i,s)),c=xor(i,mgf(w,f));return new bn(Buffer.concat([new Buffer([0]),c,w],n))}function pkcs1(e,r,n){var o=r.length,t=e.modulus.byteLength();if(o>t-11)throw new Error("message too long");var f;return n?(f=new Buffer(t-o-3),f.fill(255)):f=nonZero(t-o-3),new bn(Buffer.concat([new Buffer([0,n?1:2]),f,new Buffer([0]),r],t))}function nonZero(e,r){for(var n,o=new Buffer(e),t=0,f=randomBytes(2*e),u=0;e>t;)u===f.length&&(f=randomBytes(2*e),u=0),n=f[u++],n&&(o[t++]=n);return o}var parseKeys=require("parse-asn1"),randomBytes=require("randombytes"),createHash=require("create-hash"),mgf=require("./mgf"),xor=require("./xor"),bn=require("bn.js"),withPublic=require("./withPublic"),crt=require("browserify-rsa"),constants={RSA_PKCS1_OAEP_PADDING:4,RSA_PKCS1_PADDIN:1,RSA_NO_PADDING:3};module.exports=function(e,r,n){var o;o=e.padding?e.padding:n?1:4;var t,f=parseKeys(e);if(4===o)t=oaep(f,r);else if(1===o)t=pkcs1(f,r,n);else{if(3!==o)throw new Error("unknown padding");if(t=new bn(r),t.cmp(f.modulus)>=0)throw new Error("data too long for modulus")}return n?crt(t,f):withPublic(t,f)};

}).call(this,require("buffer").Buffer)
},{"./mgf":204,"./withPublic":207,"./xor":208,"bn.js":19,"browserify-rsa":50,"buffer":60,"create-hash":71,"parse-asn1":195,"randombytes":213}],207:[function(require,module,exports){
(function (Buffer){
function withPublic(e,n){return new Buffer(e.toRed(bn.mont(n.modulus)).redPow(new bn(n.publicExponent)).fromRed().toArray())}var bn=require("bn.js");module.exports=withPublic;

}).call(this,require("buffer").Buffer)
},{"bn.js":19,"buffer":60}],208:[function(require,module,exports){
module.exports=function(r,e){for(var n=r.length,o=-1;++o<n;)r[o]^=e[o];return r};

},{}],209:[function(require,module,exports){
(function (global){
!function(e){function o(e){throw new RangeError(T[e])}function n(e,o){for(var n=e.length,r=[];n--;)r[n]=o(e[n]);return r}function r(e,o){var r=e.split("@"),t="";r.length>1&&(t=r[0]+"@",e=r[1]),e=e.replace(S,".");var u=e.split("."),i=n(u,o).join(".");return t+i}function t(e){for(var o,n,r=[],t=0,u=e.length;u>t;)o=e.charCodeAt(t++),o>=55296&&56319>=o&&u>t?(n=e.charCodeAt(t++),56320==(64512&n)?r.push(((1023&o)<<10)+(1023&n)+65536):(r.push(o),t--)):r.push(o);return r}function u(e){return n(e,function(e){var o="";return e>65535&&(e-=65536,o+=P(e>>>10&1023|55296),e=56320|1023&e),o+=P(e)}).join("")}function i(e){return 10>e-48?e-22:26>e-65?e-65:26>e-97?e-97:b}function f(e,o){return e+22+75*(26>e)-((0!=o)<<5)}function c(e,o,n){var r=0;for(e=n?M(e/j):e>>1,e+=M(e/o);e>L*C>>1;r+=b)e=M(e/L);return M(r+(L+1)*e/(e+m))}function l(e){var n,r,t,f,l,s,d,a,p,h,v=[],g=e.length,w=0,m=I,j=A;for(r=e.lastIndexOf(E),0>r&&(r=0),t=0;r>t;++t)e.charCodeAt(t)>=128&&o("not-basic"),v.push(e.charCodeAt(t));for(f=r>0?r+1:0;g>f;){for(l=w,s=1,d=b;f>=g&&o("invalid-input"),a=i(e.charCodeAt(f++)),(a>=b||a>M((x-w)/s))&&o("overflow"),w+=a*s,p=j>=d?y:d>=j+C?C:d-j,!(p>a);d+=b)h=b-p,s>M(x/h)&&o("overflow"),s*=h;n=v.length+1,j=c(w-l,n,0==l),M(w/n)>x-m&&o("overflow"),m+=M(w/n),w%=n,v.splice(w++,0,m)}return u(v)}function s(e){var n,r,u,i,l,s,d,a,p,h,v,g,w,m,j,F=[];for(e=t(e),g=e.length,n=I,r=0,l=A,s=0;g>s;++s)v=e[s],128>v&&F.push(P(v));for(u=i=F.length,i&&F.push(E);g>u;){for(d=x,s=0;g>s;++s)v=e[s],v>=n&&d>v&&(d=v);for(w=u+1,d-n>M((x-r)/w)&&o("overflow"),r+=(d-n)*w,n=d,s=0;g>s;++s)if(v=e[s],n>v&&++r>x&&o("overflow"),v==n){for(a=r,p=b;h=l>=p?y:p>=l+C?C:p-l,!(h>a);p+=b)j=a-h,m=b-h,F.push(P(f(h+j%m,0))),a=M(j/m);F.push(P(f(a,0))),l=c(r,w,u==i),r=0,++u}++r,++n}return F.join("")}function d(e){return r(e,function(e){return F.test(e)?l(e.slice(4).toLowerCase()):e})}function a(e){return r(e,function(e){return O.test(e)?"xn--"+s(e):e})}var p="object"==typeof exports&&exports&&!exports.nodeType&&exports,h="object"==typeof module&&module&&!module.nodeType&&module,v="object"==typeof global&&global;v.global!==v&&v.window!==v&&v.self!==v||(e=v);var g,w,x=2147483647,b=36,y=1,C=26,m=38,j=700,A=72,I=128,E="-",F=/^xn--/,O=/[^\x20-\x7E]/,S=/[\x2E\u3002\uFF0E\uFF61]/g,T={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},L=b-y,M=Math.floor,P=String.fromCharCode;if(g={version:"1.4.1",ucs2:{decode:t,encode:u},decode:l,encode:s,toASCII:a,toUnicode:d},"function"==typeof define&&"object"==typeof define.amd&&define.amd)define("punycode",function(){return g});else if(p&&h)if(module.exports==p)h.exports=g;else for(w in g)g.hasOwnProperty(w)&&(p[w]=g[w]);else e.punycode=g}(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],210:[function(require,module,exports){
"use strict";function hasOwnProperty(r,e){return Object.prototype.hasOwnProperty.call(r,e)}module.exports=function(r,e,t,n){e=e||"&",t=t||"=";var o={};if("string"!=typeof r||0===r.length)return o;var a=/\+/g;r=r.split(e);var s=1e3;n&&"number"==typeof n.maxKeys&&(s=n.maxKeys);var p=r.length;s>0&&p>s&&(p=s);for(var y=0;p>y;++y){var u,c,i,l,f=r[y].replace(a,"%20"),v=f.indexOf(t);v>=0?(u=f.substr(0,v),c=f.substr(v+1)):(u=f,c=""),i=decodeURIComponent(u),l=decodeURIComponent(c),hasOwnProperty(o,i)?isArray(o[i])?o[i].push(l):o[i]=[o[i],l]:o[i]=l}return o};var isArray=Array.isArray||function(r){return"[object Array]"===Object.prototype.toString.call(r)};

},{}],211:[function(require,module,exports){
"use strict";function map(r,e){if(r.map)return r.map(e);for(var t=[],n=0;n<r.length;n++)t.push(e(r[n],n));return t}var stringifyPrimitive=function(r){switch(typeof r){case"string":return r;case"boolean":return r?"true":"false";case"number":return isFinite(r)?r:"";default:return""}};module.exports=function(r,e,t,n){return e=e||"&",t=t||"=",null===r&&(r=void 0),"object"==typeof r?map(objectKeys(r),function(n){var i=encodeURIComponent(stringifyPrimitive(n))+t;return isArray(r[n])?map(r[n],function(r){return i+encodeURIComponent(stringifyPrimitive(r))}).join(e):i+encodeURIComponent(stringifyPrimitive(r[n]))}).join(e):n?encodeURIComponent(stringifyPrimitive(n))+t+encodeURIComponent(stringifyPrimitive(r)):""};var isArray=Array.isArray||function(r){return"[object Array]"===Object.prototype.toString.call(r)},objectKeys=Object.keys||function(r){var e=[];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&e.push(t);return e};

},{}],212:[function(require,module,exports){
"use strict";exports.decode=exports.parse=require("./decode"),exports.encode=exports.stringify=require("./encode");

},{"./decode":210,"./encode":211}],213:[function(require,module,exports){
(function (process,global,Buffer){
"use strict";function oldBrowser(){throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11")}function randomBytes(r,o){if(r>65536)throw new Error("requested too many random bytes");var e=new global.Uint8Array(r);r>0&&crypto.getRandomValues(e);var t=new Buffer(e.buffer);return"function"==typeof o?process.nextTick(function(){o(null,t)}):t}var crypto=global.crypto||global.msCrypto;crypto&&crypto.getRandomValues?module.exports=randomBytes:module.exports=oldBrowser;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"_process":201,"buffer":60}],214:[function(require,module,exports){
"use strict";function rangeParser(r,e){var s=!0,a=e.indexOf("=");if(-1==a)return-2;var t=e.slice(a+1).split(",").map(function(e){var e=e.split("-"),a=parseInt(e[0],10),t=parseInt(e[1],10);return isNaN(a)?(a=r-t,t=r-1):isNaN(t)&&(t=r-1),t>r-1&&(t=r-1),(isNaN(a)||isNaN(t)||a>t||0>a)&&(s=!1),{start:a,end:t}});return t.type=e.slice(0,a),s?t:-1}module.exports=rangeParser;

},{}],215:[function(require,module,exports){
(function (process,global,Buffer){
"use strict";function getDecoder(e){if(!e)return null;try{return iconv.getDecoder(e)}catch(r){if(!iconvEncodingMessageRegExp.test(r.message))throw r;throw createError(415,"specified encoding unsupported","encoding.unsupported",{encoding:e})}}function getRawBody(e,r,t){var n=t,o=r||{};if(r!==!0&&"string"!=typeof r||(o={encoding:r}),"function"==typeof r&&(n=r,o={}),void 0!==n&&"function"!=typeof n)throw new TypeError("argument callback must be a function");if(!n&&!global.Promise)throw new TypeError("argument callback is required");var i=o.encoding!==!0?o.encoding:"utf-8",a=bytes.parse(o.limit),c=null==o.length||isNaN(o.length)?null:parseInt(o.length,10);return n?readStream(e,i,c,a,n):new Promise(function(r,t){readStream(e,i,c,a,function(e,n){return e?t(e):void r(n)})})}function halt(e){unpipe(e),"function"==typeof e.pause&&e.pause()}function createError(e,r,t,n){var o=new Error;Error.captureStackTrace(o,createError);for(var i in n)o[i]=n[i];return o.message=r,o.status=e,o.statusCode=e,Object.defineProperty(o,"type",{value:t,enumerable:!0,writable:!0,configurable:!0}),o}function readStream(e,r,t,n,o){function i(){function r(){l(),t[0]&&halt(e),o.apply(null,t)}for(var t=new Array(arguments.length),n=0;n<t.length;n++)t[n]=arguments[n];s=!0,d?process.nextTick(r):r()}function a(){s||i(createError(400,"request aborted","request.aborted",{code:"ECONNABORTED",expected:t,length:t,received:p}))}function c(e){s||(p+=e.length,f?m+=f.write(e):m.push(e),null!==n&&p>n&&i(createError(413,"request entity too large","entity.too.large",{limit:n,received:p})))}function u(e){if(!s){if(e)return i(e);if(null!==t&&p!==t)i(createError(400,"request size did not match content length","request.size.invalid",{expected:t,length:t,received:p}));else{var r=f?m+(f.end()||""):Buffer.concat(m);l(),i(null,r)}}}function l(){m=null,e.removeListener("aborted",a),e.removeListener("data",c),e.removeListener("end",u),e.removeListener("error",u),e.removeListener("close",l)}var s=!1,d=!0;if(null!==n&&null!==t&&t>n)return i(createError(413,"request entity too large","entity.too.large",{expected:t,length:t,limit:n}));var g=e._readableState;if(e._decoder||g&&(g.encoding||g.decoder))return i(createError(500,"stream encoding should not be set","stream.encoding.set"));var f,p=0;try{f=getDecoder(r)}catch(v){return i(v)}var m=f?"":[];e.on("aborted",a),e.on("close",l),e.on("data",c),e.on("end",u),e.on("error",u),d=!1}var bytes=require("bytes"),iconv=require("iconv-lite"),unpipe=require("unpipe");module.exports=getRawBody;var iconvEncodingMessageRegExp=/^Encoding not recognized: /;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"_process":201,"buffer":60,"bytes":216,"iconv-lite":157,"unpipe":249}],216:[function(require,module,exports){
"use strict";function bytes(e,r){return"string"==typeof e?parse(e):"number"==typeof e?format(e,r):null}function format(e,r){if(!numberIsFinite(e))return null;var a=Math.abs(e),t=r&&r.thousandsSeparator||"",o=r&&void 0!==r.decimalPlaces?r.decimalPlaces:2,s=Boolean(r&&r.fixedDecimals),n="B";a>=map.tb?n="TB":a>=map.gb?n="GB":a>=map.mb?n="MB":a>=map.kb&&(n="kB");var m=e/map[n.toLowerCase()],p=m.toFixed(o);return s||(p=p.replace(formatDecimalsRegExp,"$1")),t&&(p=p.replace(formatThousandsRegExp,t)),p+n}function parse(e){if("number"==typeof e&&!isNaN(e))return e;if("string"!=typeof e)return null;var r,a=parseRegExp.exec(e),t="b";return a?(r=parseFloat(a[1]),t=a[4].toLowerCase()):(r=parseInt(e,10),t="b"),Math.floor(map[t]*r)}module.exports=bytes,module.exports.format=format,module.exports.parse=parse;var formatThousandsRegExp=/\B(?=(\d{3})+(?!\d))/g,formatDecimalsRegExp=/(?:\.0*|(\.[^0]+)0+)$/,map={b:1,kb:1024,mb:1<<20,gb:1<<30,tb:1024*(1<<30)},numberIsFinite=Number.isFinite||function(e){return"number"==typeof e&&isFinite(e)},parseRegExp=/^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb)$/i;

},{}],217:[function(require,module,exports){
module.exports=require("./lib/_stream_duplex.js");

},{"./lib/_stream_duplex.js":218}],218:[function(require,module,exports){
"use strict";function Duplex(e){return this instanceof Duplex?(Readable.call(this,e),Writable.call(this,e),e&&e.readable===!1&&(this.readable=!1),e&&e.writable===!1&&(this.writable=!1),this.allowHalfOpen=!0,e&&e.allowHalfOpen===!1&&(this.allowHalfOpen=!1),void this.once("end",onend)):new Duplex(e)}function onend(){this.allowHalfOpen||this._writableState.ended||processNextTick(onEndNT,this)}function onEndNT(e){e.end()}function forEach(e,t){for(var r=0,i=e.length;i>r;r++)t(e[r],r)}var objectKeys=Object.keys||function(e){var t=[];for(var r in e)t.push(r);return t};module.exports=Duplex;var processNextTick=require("process-nextick-args"),util=require("core-util-is");util.inherits=require("inherits");var Readable=require("./_stream_readable"),Writable=require("./_stream_writable");util.inherits(Duplex,Readable);for(var keys=objectKeys(Writable.prototype),v=0;v<keys.length;v++){var method=keys[v];Duplex.prototype[method]||(Duplex.prototype[method]=Writable.prototype[method])}

},{"./_stream_readable":220,"./_stream_writable":222,"core-util-is":69,"inherits":161,"process-nextick-args":200}],219:[function(require,module,exports){
"use strict";function PassThrough(r){return this instanceof PassThrough?void Transform.call(this,r):new PassThrough(r)}module.exports=PassThrough;var Transform=require("./_stream_transform"),util=require("core-util-is");util.inherits=require("inherits"),util.inherits(PassThrough,Transform),PassThrough.prototype._transform=function(r,s,i){i(null,r)};

},{"./_stream_transform":221,"core-util-is":69,"inherits":161}],220:[function(require,module,exports){
(function (process){
"use strict";function ReadableState(e,t){Duplex=Duplex||require("./_stream_duplex"),e=e||{},this.objectMode=!!e.objectMode,t instanceof Duplex&&(this.objectMode=this.objectMode||!!e.readableObjectMode);var r=e.highWaterMark,n=this.objectMode?16:16384;this.highWaterMark=r||0===r?r:n,this.highWaterMark=~~this.highWaterMark,this.buffer=[],this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.defaultEncoding=e.defaultEncoding||"utf8",this.ranOut=!1,this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,e.encoding&&(StringDecoder||(StringDecoder=require("string_decoder/").StringDecoder),this.decoder=new StringDecoder(e.encoding),this.encoding=e.encoding)}function Readable(e){return Duplex=Duplex||require("./_stream_duplex"),this instanceof Readable?(this._readableState=new ReadableState(e,this),this.readable=!0,e&&"function"==typeof e.read&&(this._read=e.read),void Stream.call(this)):new Readable(e)}function readableAddChunk(e,t,r,n,a){var i=chunkInvalid(t,r);if(i)e.emit("error",i);else if(null===r)t.reading=!1,onEofChunk(e,t);else if(t.objectMode||r&&r.length>0)if(t.ended&&!a){var d=new Error("stream.push() after EOF");e.emit("error",d)}else if(t.endEmitted&&a){var d=new Error("stream.unshift() after end event");e.emit("error",d)}else{var o;!t.decoder||a||n||(r=t.decoder.write(r),o=!t.objectMode&&0===r.length),a||(t.reading=!1),o||(t.flowing&&0===t.length&&!t.sync?(e.emit("data",r),e.read(0)):(t.length+=t.objectMode?1:r.length,a?t.buffer.unshift(r):t.buffer.push(r),t.needReadable&&emitReadable(e))),maybeReadMore(e,t)}else a||(t.reading=!1);return needMoreData(t)}function needMoreData(e){return!e.ended&&(e.needReadable||e.length<e.highWaterMark||0===e.length)}function computeNewHighWaterMark(e){return e>=MAX_HWM?e=MAX_HWM:(e--,e|=e>>>1,e|=e>>>2,e|=e>>>4,e|=e>>>8,e|=e>>>16,e++),e}function howMuchToRead(e,t){return 0===t.length&&t.ended?0:t.objectMode?0===e?0:1:null===e||isNaN(e)?t.flowing&&t.buffer.length?t.buffer[0].length:t.length:0>=e?0:(e>t.highWaterMark&&(t.highWaterMark=computeNewHighWaterMark(e)),e>t.length?t.ended?t.length:(t.needReadable=!0,0):e)}function chunkInvalid(e,t){var r=null;return Buffer.isBuffer(t)||"string"==typeof t||null===t||void 0===t||e.objectMode||(r=new TypeError("Invalid non-string/buffer chunk")),r}function onEofChunk(e,t){if(!t.ended){if(t.decoder){var r=t.decoder.end();r&&r.length&&(t.buffer.push(r),t.length+=t.objectMode?1:r.length)}t.ended=!0,emitReadable(e)}}function emitReadable(e){var t=e._readableState;t.needReadable=!1,t.emittedReadable||(debug("emitReadable",t.flowing),t.emittedReadable=!0,t.sync?processNextTick(emitReadable_,e):emitReadable_(e))}function emitReadable_(e){debug("emit readable"),e.emit("readable"),flow(e)}function maybeReadMore(e,t){t.readingMore||(t.readingMore=!0,processNextTick(maybeReadMore_,e,t))}function maybeReadMore_(e,t){for(var r=t.length;!t.reading&&!t.flowing&&!t.ended&&t.length<t.highWaterMark&&(debug("maybeReadMore read 0"),e.read(0),r!==t.length);)r=t.length;t.readingMore=!1}function pipeOnDrain(e){return function(){var t=e._readableState;debug("pipeOnDrain",t.awaitDrain),t.awaitDrain&&t.awaitDrain--,0===t.awaitDrain&&EElistenerCount(e,"data")&&(t.flowing=!0,flow(e))}}function nReadingNextTick(e){debug("readable nexttick read 0"),e.read(0)}function resume(e,t){t.resumeScheduled||(t.resumeScheduled=!0,processNextTick(resume_,e,t))}function resume_(e,t){t.reading||(debug("resume read 0"),e.read(0)),t.resumeScheduled=!1,e.emit("resume"),flow(e),t.flowing&&!t.reading&&e.read(0)}function flow(e){var t=e._readableState;if(debug("flow",t.flowing),t.flowing)do var r=e.read();while(null!==r&&t.flowing)}function fromList(e,t){var r,n=t.buffer,a=t.length,i=!!t.decoder,d=!!t.objectMode;if(0===n.length)return null;if(0===a)r=null;else if(d)r=n.shift();else if(!e||e>=a)r=i?n.join(""):1===n.length?n[0]:Buffer.concat(n,a),n.length=0;else if(e<n[0].length){var o=n[0];r=o.slice(0,e),n[0]=o.slice(e)}else if(e===n[0].length)r=n.shift();else{r=i?"":new Buffer(e);for(var l=0,u=0,s=n.length;s>u&&e>l;u++){var o=n[0],h=Math.min(e-l,o.length);i?r+=o.slice(0,h):o.copy(r,l,0,h),h<o.length?n[0]=o.slice(h):n.shift(),l+=h}}return r}function endReadable(e){var t=e._readableState;if(t.length>0)throw new Error("endReadable called on non-empty stream");t.endEmitted||(t.ended=!0,processNextTick(endReadableNT,t,e))}function endReadableNT(e,t){e.endEmitted||0!==e.length||(e.endEmitted=!0,t.readable=!1,t.emit("end"))}function forEach(e,t){for(var r=0,n=e.length;n>r;r++)t(e[r],r)}function indexOf(e,t){for(var r=0,n=e.length;n>r;r++)if(e[r]===t)return r;return-1}module.exports=Readable;var processNextTick=require("process-nextick-args"),isArray=require("isarray"),Buffer=require("buffer").Buffer;Readable.ReadableState=ReadableState;var EE=require("events"),EElistenerCount=function(e,t){return e.listeners(t).length},Stream;!function(){try{Stream=require("stream")}catch(e){}finally{Stream||(Stream=require("events").EventEmitter)}}();var Buffer=require("buffer").Buffer,util=require("core-util-is");util.inherits=require("inherits");var debugUtil=require("util"),debug=void 0;debug=debugUtil&&debugUtil.debuglog?debugUtil.debuglog("stream"):function(){};var StringDecoder;util.inherits(Readable,Stream);var Duplex,Duplex;Readable.prototype.push=function(e,t){var r=this._readableState;return r.objectMode||"string"!=typeof e||(t=t||r.defaultEncoding,t!==r.encoding&&(e=new Buffer(e,t),t="")),readableAddChunk(this,r,e,t,!1)},Readable.prototype.unshift=function(e){var t=this._readableState;return readableAddChunk(this,t,e,"",!0)},Readable.prototype.isPaused=function(){return this._readableState.flowing===!1},Readable.prototype.setEncoding=function(e){return StringDecoder||(StringDecoder=require("string_decoder/").StringDecoder),this._readableState.decoder=new StringDecoder(e),this._readableState.encoding=e,this};var MAX_HWM=8388608;Readable.prototype.read=function(e){debug("read",e);var t=this._readableState,r=e;if(("number"!=typeof e||e>0)&&(t.emittedReadable=!1),0===e&&t.needReadable&&(t.length>=t.highWaterMark||t.ended))return debug("read: emitReadable",t.length,t.ended),0===t.length&&t.ended?endReadable(this):emitReadable(this),null;if(e=howMuchToRead(e,t),0===e&&t.ended)return 0===t.length&&endReadable(this),null;var n=t.needReadable;debug("need readable",n),(0===t.length||t.length-e<t.highWaterMark)&&(n=!0,debug("length less than watermark",n)),(t.ended||t.reading)&&(n=!1,debug("reading or ended",n)),n&&(debug("do read"),t.reading=!0,t.sync=!0,0===t.length&&(t.needReadable=!0),this._read(t.highWaterMark),t.sync=!1),n&&!t.reading&&(e=howMuchToRead(r,t));var a;return a=e>0?fromList(e,t):null,null===a&&(t.needReadable=!0,e=0),t.length-=e,0!==t.length||t.ended||(t.needReadable=!0),r!==e&&t.ended&&0===t.length&&endReadable(this),null!==a&&this.emit("data",a),a},Readable.prototype._read=function(e){this.emit("error",new Error("not implemented"))},Readable.prototype.pipe=function(e,t){function r(e){debug("onunpipe"),e===s&&a()}function n(){debug("onend"),e.end()}function a(){debug("cleanup"),e.removeListener("close",o),e.removeListener("finish",l),e.removeListener("drain",c),e.removeListener("error",d),e.removeListener("unpipe",r),s.removeListener("end",n),s.removeListener("end",a),s.removeListener("data",i),b=!0,!h.awaitDrain||e._writableState&&!e._writableState.needDrain||c()}function i(t){debug("ondata");var r=e.write(t);!1===r&&(1!==h.pipesCount||h.pipes[0]!==e||1!==s.listenerCount("data")||b||(debug("false write response, pause",s._readableState.awaitDrain),s._readableState.awaitDrain++),s.pause())}function d(t){debug("onerror",t),u(),e.removeListener("error",d),0===EElistenerCount(e,"error")&&e.emit("error",t)}function o(){e.removeListener("finish",l),u()}function l(){debug("onfinish"),e.removeListener("close",o),u()}function u(){debug("unpipe"),s.unpipe(e)}var s=this,h=this._readableState;switch(h.pipesCount){case 0:h.pipes=e;break;case 1:h.pipes=[h.pipes,e];break;default:h.pipes.push(e)}h.pipesCount+=1,debug("pipe count=%d opts=%j",h.pipesCount,t);var f=(!t||t.end!==!1)&&e!==process.stdout&&e!==process.stderr,p=f?n:a;h.endEmitted?processNextTick(p):s.once("end",p),e.on("unpipe",r);var c=pipeOnDrain(s);e.on("drain",c);var b=!1;return s.on("data",i),e._events&&e._events.error?isArray(e._events.error)?e._events.error.unshift(d):e._events.error=[d,e._events.error]:e.on("error",d),e.once("close",o),e.once("finish",l),e.emit("pipe",s),h.flowing||(debug("pipe resume"),s.resume()),e},Readable.prototype.unpipe=function(e){var t=this._readableState;if(0===t.pipesCount)return this;if(1===t.pipesCount)return e&&e!==t.pipes?this:(e||(e=t.pipes),t.pipes=null,t.pipesCount=0,t.flowing=!1,e&&e.emit("unpipe",this),this);if(!e){var r=t.pipes,n=t.pipesCount;t.pipes=null,t.pipesCount=0,t.flowing=!1;for(var a=0;n>a;a++)r[a].emit("unpipe",this);return this}var i=indexOf(t.pipes,e);return-1===i?this:(t.pipes.splice(i,1),t.pipesCount-=1,1===t.pipesCount&&(t.pipes=t.pipes[0]),e.emit("unpipe",this),this)},Readable.prototype.on=function(e,t){var r=Stream.prototype.on.call(this,e,t);if("data"===e&&!1!==this._readableState.flowing&&this.resume(),"readable"===e&&!this._readableState.endEmitted){var n=this._readableState;n.readableListening||(n.readableListening=!0,n.emittedReadable=!1,n.needReadable=!0,n.reading?n.length&&emitReadable(this,n):processNextTick(nReadingNextTick,this))}return r},Readable.prototype.addListener=Readable.prototype.on,Readable.prototype.resume=function(){var e=this._readableState;return e.flowing||(debug("resume"),e.flowing=!0,resume(this,e)),this},Readable.prototype.pause=function(){return debug("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(debug("pause"),this._readableState.flowing=!1,this.emit("pause")),this},Readable.prototype.wrap=function(e){var t=this._readableState,r=!1,n=this;e.on("end",function(){if(debug("wrapped end"),t.decoder&&!t.ended){var e=t.decoder.end();e&&e.length&&n.push(e)}n.push(null)}),e.on("data",function(a){if(debug("wrapped data"),t.decoder&&(a=t.decoder.write(a)),(!t.objectMode||null!==a&&void 0!==a)&&(t.objectMode||a&&a.length)){var i=n.push(a);i||(r=!0,e.pause())}});for(var a in e)void 0===this[a]&&"function"==typeof e[a]&&(this[a]=function(t){return function(){return e[t].apply(e,arguments)}}(a));var i=["error","close","destroy","pause","resume"];return forEach(i,function(t){e.on(t,n.emit.bind(n,t))}),n._read=function(t){debug("wrapped _read",t),r&&(r=!1,e.resume())},n},Readable._fromList=fromList;

}).call(this,require('_process'))
},{"./_stream_duplex":218,"_process":201,"buffer":60,"core-util-is":69,"events":110,"inherits":161,"isarray":223,"process-nextick-args":200,"stream":241,"string_decoder/":246,"util":31}],221:[function(require,module,exports){
"use strict";function TransformState(r){this.afterTransform=function(t,n){return afterTransform(r,t,n)},this.needTransform=!1,this.transforming=!1,this.writecb=null,this.writechunk=null,this.writeencoding=null}function afterTransform(r,t,n){var e=r._transformState;e.transforming=!1;var i=e.writecb;if(!i)return r.emit("error",new Error("no writecb in Transform class"));e.writechunk=null,e.writecb=null,null!==n&&void 0!==n&&r.push(n),i(t);var a=r._readableState;a.reading=!1,(a.needReadable||a.length<a.highWaterMark)&&r._read(a.highWaterMark)}function Transform(r){if(!(this instanceof Transform))return new Transform(r);Duplex.call(this,r),this._transformState=new TransformState(this);var t=this;this._readableState.needReadable=!0,this._readableState.sync=!1,r&&("function"==typeof r.transform&&(this._transform=r.transform),"function"==typeof r.flush&&(this._flush=r.flush)),this.once("prefinish",function(){"function"==typeof this._flush?this._flush(function(r){done(t,r)}):done(t)})}function done(r,t){if(t)return r.emit("error",t);var n=r._writableState,e=r._transformState;if(n.length)throw new Error("calling transform done when ws.length != 0");if(e.transforming)throw new Error("calling transform done when still transforming");return r.push(null)}module.exports=Transform;var Duplex=require("./_stream_duplex"),util=require("core-util-is");util.inherits=require("inherits"),util.inherits(Transform,Duplex),Transform.prototype.push=function(r,t){return this._transformState.needTransform=!1,Duplex.prototype.push.call(this,r,t)},Transform.prototype._transform=function(r,t,n){throw new Error("not implemented")},Transform.prototype._write=function(r,t,n){var e=this._transformState;if(e.writecb=n,e.writechunk=r,e.writeencoding=t,!e.transforming){var i=this._readableState;(e.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark)}},Transform.prototype._read=function(r){var t=this._transformState;null!==t.writechunk&&t.writecb&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0};

},{"./_stream_duplex":218,"core-util-is":69,"inherits":161}],222:[function(require,module,exports){
"use strict";function nop(){}function WriteReq(e,t,r){this.chunk=e,this.encoding=t,this.callback=r,this.next=null}function WritableState(e,t){Duplex=Duplex||require("./_stream_duplex"),e=e||{},this.objectMode=!!e.objectMode,t instanceof Duplex&&(this.objectMode=this.objectMode||!!e.writableObjectMode);var r=e.highWaterMark,i=this.objectMode?16:16384;this.highWaterMark=r||0===r?r:i,this.highWaterMark=~~this.highWaterMark,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1;var n=e.decodeStrings===!1;this.decodeStrings=!n,this.defaultEncoding=e.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(e){onwrite(t,e)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.bufferedRequestCount=0,this.corkedRequestsFree=new CorkedRequest(this),this.corkedRequestsFree.next=new CorkedRequest(this)}function Writable(e){return Duplex=Duplex||require("./_stream_duplex"),this instanceof Writable||this instanceof Duplex?(this._writableState=new WritableState(e,this),this.writable=!0,e&&("function"==typeof e.write&&(this._write=e.write),"function"==typeof e.writev&&(this._writev=e.writev)),void Stream.call(this)):new Writable(e)}function writeAfterEnd(e,t){var r=new Error("write after end");e.emit("error",r),processNextTick(t,r)}function validChunk(e,t,r,i){var n=!0;if(!Buffer.isBuffer(r)&&"string"!=typeof r&&null!==r&&void 0!==r&&!t.objectMode){var f=new TypeError("Invalid non-string/buffer chunk");e.emit("error",f),processNextTick(i,f),n=!1}return n}function decodeChunk(e,t,r){return e.objectMode||e.decodeStrings===!1||"string"!=typeof t||(t=new Buffer(t,r)),t}function writeOrBuffer(e,t,r,i,n){r=decodeChunk(t,r,i),Buffer.isBuffer(r)&&(i="buffer");var f=t.objectMode?1:r.length;t.length+=f;var u=t.length<t.highWaterMark;if(u||(t.needDrain=!0),t.writing||t.corked){var s=t.lastBufferedRequest;t.lastBufferedRequest=new WriteReq(r,i,n),s?s.next=t.lastBufferedRequest:t.bufferedRequest=t.lastBufferedRequest,t.bufferedRequestCount+=1}else doWrite(e,t,!1,f,r,i,n);return u}function doWrite(e,t,r,i,n,f,u){t.writelen=i,t.writecb=u,t.writing=!0,t.sync=!0,r?e._writev(n,t.onwrite):e._write(n,f,t.onwrite),t.sync=!1}function onwriteError(e,t,r,i,n){--t.pendingcb,r?processNextTick(n,i):n(i),e._writableState.errorEmitted=!0,e.emit("error",i)}function onwriteStateUpdate(e){e.writing=!1,e.writecb=null,e.length-=e.writelen,e.writelen=0}function onwrite(e,t){var r=e._writableState,i=r.sync,n=r.writecb;if(onwriteStateUpdate(r),t)onwriteError(e,r,i,t,n);else{var f=needFinish(r);f||r.corked||r.bufferProcessing||!r.bufferedRequest||clearBuffer(e,r),i?asyncWrite(afterWrite,e,r,f,n):afterWrite(e,r,f,n)}}function afterWrite(e,t,r,i){r||onwriteDrain(e,t),t.pendingcb--,i(),finishMaybe(e,t)}function onwriteDrain(e,t){0===t.length&&t.needDrain&&(t.needDrain=!1,e.emit("drain"))}function clearBuffer(e,t){t.bufferProcessing=!0;var r=t.bufferedRequest;if(e._writev&&r&&r.next){var i=t.bufferedRequestCount,n=new Array(i),f=t.corkedRequestsFree;f.entry=r;for(var u=0;r;)n[u]=r,r=r.next,u+=1;doWrite(e,t,!0,t.length,n,"",f.finish),t.pendingcb++,t.lastBufferedRequest=null,t.corkedRequestsFree=f.next,f.next=null}else{for(;r;){var s=r.chunk,o=r.encoding,a=r.callback,c=t.objectMode?1:s.length;if(doWrite(e,t,!1,c,s,o,a),r=r.next,t.writing)break}null===r&&(t.lastBufferedRequest=null)}t.bufferedRequestCount=0,t.bufferedRequest=r,t.bufferProcessing=!1}function needFinish(e){return e.ending&&0===e.length&&null===e.bufferedRequest&&!e.finished&&!e.writing}function prefinish(e,t){t.prefinished||(t.prefinished=!0,e.emit("prefinish"))}function finishMaybe(e,t){var r=needFinish(t);return r&&(0===t.pendingcb?(prefinish(e,t),t.finished=!0,e.emit("finish")):prefinish(e,t)),r}function endWritable(e,t,r){t.ending=!0,finishMaybe(e,t),r&&(t.finished?processNextTick(r):e.once("finish",r)),t.ended=!0,e.writable=!1}function CorkedRequest(e){var t=this;this.next=null,this.entry=null,this.finish=function(r){var i=t.entry;for(t.entry=null;i;){var n=i.callback;e.pendingcb--,n(r),i=i.next}e.corkedRequestsFree?e.corkedRequestsFree.next=t:e.corkedRequestsFree=t}}module.exports=Writable;var processNextTick=require("process-nextick-args"),asyncWrite=processNextTick,Buffer=require("buffer").Buffer;Writable.WritableState=WritableState;var util=require("core-util-is");util.inherits=require("inherits");var internalUtil={deprecate:require("util-deprecate")},Stream;!function(){try{Stream=require("stream")}catch(e){}finally{Stream||(Stream=require("events").EventEmitter)}}();var Buffer=require("buffer").Buffer;util.inherits(Writable,Stream);var Duplex;WritableState.prototype.getBuffer=function(){for(var e=this.bufferedRequest,t=[];e;)t.push(e),e=e.next;return t},function(){try{Object.defineProperty(WritableState.prototype,"buffer",{get:internalUtil.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")})}catch(e){}}();var Duplex;Writable.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe. Not readable."))},Writable.prototype.write=function(e,t,r){var i=this._writableState,n=!1;return"function"==typeof t&&(r=t,t=null),Buffer.isBuffer(e)?t="buffer":t||(t=i.defaultEncoding),"function"!=typeof r&&(r=nop),i.ended?writeAfterEnd(this,r):validChunk(this,i,e,r)&&(i.pendingcb++,n=writeOrBuffer(this,i,e,t,r)),n},Writable.prototype.cork=function(){var e=this._writableState;e.corked++},Writable.prototype.uncork=function(){var e=this._writableState;e.corked&&(e.corked--,e.writing||e.corked||e.finished||e.bufferProcessing||!e.bufferedRequest||clearBuffer(this,e))},Writable.prototype.setDefaultEncoding=function(e){if("string"==typeof e&&(e=e.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((e+"").toLowerCase())>-1))throw new TypeError("Unknown encoding: "+e);this._writableState.defaultEncoding=e},Writable.prototype._write=function(e,t,r){r(new Error("not implemented"))},Writable.prototype._writev=null,Writable.prototype.end=function(e,t,r){var i=this._writableState;"function"==typeof e?(r=e,e=null,t=null):"function"==typeof t&&(r=t,t=null),null!==e&&void 0!==e&&this.write(e,t),i.corked&&(i.corked=1,this.uncork()),i.ending||i.finished||endWritable(this,i,r)};

},{"./_stream_duplex":218,"buffer":60,"core-util-is":69,"events":110,"inherits":161,"process-nextick-args":200,"stream":241,"util-deprecate":252}],223:[function(require,module,exports){
var toString={}.toString;module.exports=Array.isArray||function(r){return"[object Array]"==toString.call(r)};

},{}],224:[function(require,module,exports){
module.exports=require("./lib/_stream_passthrough.js");

},{"./lib/_stream_passthrough.js":219}],225:[function(require,module,exports){
var Stream=function(){try{return require("stream")}catch(r){}}();exports=module.exports=require("./lib/_stream_readable.js"),exports.Stream=Stream||exports,exports.Readable=exports,exports.Writable=require("./lib/_stream_writable.js"),exports.Duplex=require("./lib/_stream_duplex.js"),exports.Transform=require("./lib/_stream_transform.js"),exports.PassThrough=require("./lib/_stream_passthrough.js");

},{"./lib/_stream_duplex.js":218,"./lib/_stream_passthrough.js":219,"./lib/_stream_readable.js":220,"./lib/_stream_transform.js":221,"./lib/_stream_writable.js":222,"stream":241}],226:[function(require,module,exports){
module.exports=require("./lib/_stream_transform.js");

},{"./lib/_stream_transform.js":221}],227:[function(require,module,exports){
module.exports=require("./lib/_stream_writable.js");

},{"./lib/_stream_writable.js":222}],228:[function(require,module,exports){
(function (Buffer){
function bytesToWords(r){for(var f=[],n=0,t=0;n<r.length;n++,t+=8)f[t>>>5]|=r[n]<<24-t%32;return f}function wordsToBytes(r){for(var f=[],n=0;n<32*r.length;n+=8)f.push(r[n>>>5]>>>24-n%32&255);return f}function processBlock(r,f,n){for(var t=0;16>t;t++){var o=n+t,e=f[o];f[o]=16711935&(e<<8|e>>>24)|4278255360&(e<<24|e>>>8)}var u,l,s,h,c,i,a,v,d,p;i=u=r[0],a=l=r[1],v=s=r[2],d=h=r[3],p=c=r[4];var g;for(t=0;80>t;t+=1)g=u+f[n+zl[t]]|0,g+=16>t?f1(l,s,h)+hl[0]:32>t?f2(l,s,h)+hl[1]:48>t?f3(l,s,h)+hl[2]:64>t?f4(l,s,h)+hl[3]:f5(l,s,h)+hl[4],g=0|g,g=rotl(g,sl[t]),g=g+c|0,u=c,c=h,h=rotl(s,10),s=l,l=g,g=i+f[n+zr[t]]|0,g+=16>t?f5(a,v,d)+hr[0]:32>t?f4(a,v,d)+hr[1]:48>t?f3(a,v,d)+hr[2]:64>t?f2(a,v,d)+hr[3]:f1(a,v,d)+hr[4],g=0|g,g=rotl(g,sr[t]),g=g+p|0,i=p,p=d,d=rotl(v,10),v=a,a=g;g=r[1]+s+d|0,r[1]=r[2]+h+p|0,r[2]=r[3]+c+i|0,r[3]=r[4]+u+a|0,r[4]=r[0]+l+v|0,r[0]=g}function f1(r,f,n){return r^f^n}function f2(r,f,n){return r&f|~r&n}function f3(r,f,n){return(r|~f)^n}function f4(r,f,n){return r&n|f&~n}function f5(r,f,n){return r^(f|~n)}function rotl(r,f){return r<<f|r>>>32-f}function ripemd160(r){var f=[1732584193,4023233417,2562383102,271733878,3285377520];"string"==typeof r&&(r=new Buffer(r,"utf8"));var n=bytesToWords(r),t=8*r.length,o=8*r.length;n[t>>>5]|=128<<24-t%32,n[(t+64>>>9<<4)+14]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8);for(var e=0;e<n.length;e+=16)processBlock(f,n,e);for(e=0;5>e;e++){var u=f[e];f[e]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8)}var l=wordsToBytes(f);return new Buffer(l)}var zl=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],zr=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],sl=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],sr=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11],hl=[0,1518500249,1859775393,2400959708,2840853838],hr=[1352829926,1548603684,1836072691,2053994217,0];module.exports=ripemd160;

}).call(this,require("buffer").Buffer)
},{"buffer":60}],229:[function(require,module,exports){
(function (Buffer){
"use strict";function send(e,t,r){return new SendStream(e,t,r)}function SendStream(e,t,r){var i=r||{};if(this.options=i,this.path=t,this.req=e,this._etag=void 0!==i.etag?Boolean(i.etag):!0,this._dotfiles=void 0!==i.dotfiles?i.dotfiles:"ignore","ignore"!==this._dotfiles&&"allow"!==this._dotfiles&&"deny"!==this._dotfiles)throw new TypeError('dotfiles option must be "allow", "deny", or "ignore"');this._hidden=Boolean(i.hidden),void 0!==i.hidden&&deprecate("hidden: use dotfiles: '"+(this._hidden?"allow":"ignore")+"' instead"),void 0===i.dotfiles&&(this._dotfiles=void 0),this._extensions=void 0!==i.extensions?normalizeList(i.extensions,"extensions option"):[],this._index=void 0!==i.index?normalizeList(i.index,"index option"):["index.html"],this._lastModified=void 0!==i.lastModified?Boolean(i.lastModified):!0,this._maxage=i.maxAge||i.maxage,this._maxage="string"==typeof this._maxage?ms(this._maxage):Number(this._maxage),this._maxage=isNaN(this._maxage)?0:Math.min(Math.max(0,this._maxage),maxMaxAge),this._root=i.root?resolve(i.root):null,!this._root&&i.from&&this.from(i.from)}function containsDotFile(e){for(var t=0;t<e.length;t++)if("."===e[t][0])return!0;return!1}function decode(e){try{return decodeURIComponent(e)}catch(t){return-1}}function normalizeList(e,t){for(var r=[].concat(e||[]),i=0;i<r.length;i++)if("string"!=typeof r[i])throw new TypeError(t+" must be array of strings or false");return r}var createError=require("http-errors"),debug=require("debug")("send"),deprecate=require("depd")("send"),destroy=require("destroy"),escapeHtml=require("escape-html"),parseRange=require("range-parser"),Stream=require("stream"),mime=require("mime"),fresh=require("fresh"),path=require("path"),fs=require("fs"),normalize=path.normalize,join=path.join,etag=require("etag"),EventEmitter=require("events").EventEmitter,ms=require("ms"),onFinished=require("on-finished"),statuses=require("statuses"),extname=path.extname,maxMaxAge=31536e6,resolve=path.resolve,sep=path.sep,toString=Object.prototype.toString,upPathRegexp=/(?:^|[\\\/])\.\.(?:[\\\/]|$)/;module.exports=send,module.exports.mime=mime;var listenerCount=EventEmitter.listenerCount||function(e,t){return e.listeners(t).length};SendStream.prototype.__proto__=Stream.prototype,SendStream.prototype.etag=deprecate["function"](function(e){return e=Boolean(e),debug("etag %s",e),this._etag=e,this},"send.etag: pass etag as option"),SendStream.prototype.hidden=deprecate["function"](function(e){return e=Boolean(e),debug("hidden %s",e),this._hidden=e,this._dotfiles=void 0,this},"send.hidden: use dotfiles option"),SendStream.prototype.index=deprecate["function"](function e(t){var e=t?normalizeList(t,"paths argument"):[];return debug("index %o",t),this._index=e,this},"send.index: pass index as option"),SendStream.prototype.root=function(e){return e=String(e),this._root=resolve(e),this},SendStream.prototype.from=deprecate["function"](SendStream.prototype.root,"send.from: pass root as option"),SendStream.prototype.root=deprecate["function"](SendStream.prototype.root,"send.root: pass root as option"),SendStream.prototype.maxage=deprecate["function"](function(e){return e="string"==typeof e?ms(e):Number(e),isNaN(e)&&(e=0),1/0==e&&(e=31536e6),debug("max-age %d",e),this._maxage=e,this},"send.maxage: pass maxAge as option"),SendStream.prototype.error=function t(e,t){if(0!==listenerCount(this,"error"))return this.emit("error",createError(t,e,{expose:!1}));var r=this.res,i=statuses[e];r._headers=null,r.statusCode=e,r.setHeader("Content-Type","text/plain; charset=UTF-8"),r.setHeader("Content-Length",Buffer.byteLength(i)),r.setHeader("X-Content-Type-Options","nosniff"),r.end(i)},SendStream.prototype.hasTrailingSlash=function(){return"/"==this.path[this.path.length-1]},SendStream.prototype.isConditionalGET=function(){return this.req.headers["if-none-match"]||this.req.headers["if-modified-since"]},SendStream.prototype.removeContentHeaderFields=function(){for(var e=this.res,t=Object.keys(e._headers||{}),r=0;r<t.length;r++){var i=t[r];"content-"===i.substr(0,8)&&"content-location"!==i&&e.removeHeader(i)}},SendStream.prototype.notModified=function(){var e=this.res;debug("not modified"),this.removeContentHeaderFields(),e.statusCode=304,e.end()},SendStream.prototype.headersAlreadySent=function(){var e=new Error("Can't set headers after they are sent.");debug("headers already sent"),this.error(500,e)},SendStream.prototype.isCachable=function(){var e=this.res;return e.statusCode>=200&&e.statusCode<300||304==e.statusCode},SendStream.prototype.onStatError=function(e){switch(e.code){case"ENAMETOOLONG":case"ENOENT":case"ENOTDIR":this.error(404,e);break;default:this.error(500,e)}},SendStream.prototype.isFresh=function(){return fresh(this.req.headers,this.res._headers)},SendStream.prototype.isRangeFresh=function(){var e=this.req.headers["if-range"];return e?~e.indexOf('"')?~e.indexOf(this.res._headers.etag):Date.parse(this.res._headers["last-modified"])<=Date.parse(e):!0},SendStream.prototype.redirect=function(e){if(0!==listenerCount(this,"directory"))return void this.emit("directory");if(this.hasTrailingSlash())return void this.error(403);var t=e+"/",r='Redirecting to <a href="'+escapeHtml(t)+'">'+escapeHtml(t)+"</a>\n",i=this.res;i.statusCode=301,i.setHeader("Content-Type","text/html; charset=UTF-8"),i.setHeader("Content-Length",Buffer.byteLength(r)),i.setHeader("X-Content-Type-Options","nosniff"),i.setHeader("Location",t),i.end(r)},SendStream.prototype.pipe=function(e){var t=this._root;this.res=e;var r=decode(this.path);if(-1===r)return this.error(400);if(~r.indexOf("\x00"))return this.error(400);var i;if(null!==t){if(upPathRegexp.test(normalize("."+sep+r)))return debug('malicious path "%s"',r),this.error(403);r=normalize(join(t,r)),t=normalize(t+sep),i=r.substr(t.length).split(sep)}else{if(upPathRegexp.test(r))return debug('malicious path "%s"',r),this.error(403);i=normalize(r).split(sep),r=resolve(r)}if(containsDotFile(i)){var n=this._dotfiles;switch(void 0===n&&(n="."===i[i.length-1][0]?this._hidden?"allow":"ignore":"allow"),debug('%s dotfile "%s"',n,r),n){case"allow":break;case"deny":return this.error(403);case"ignore":default:return this.error(404)}}return this._index.length&&"/"===this.path[this.path.length-1]?(this.sendIndex(r),e):(this.sendFile(r),e)},SendStream.prototype.send=function(e,t){var r=t.size,i=this.options,n={},s=this.res,o=this.req,a=o.headers.range,d=i.start||0;if(s._header)return this.headersAlreadySent();if(debug('pipe "%s"',e),this.setHeader(e,t),this.type(e),this.isConditionalGET()&&this.isCachable()&&this.isFresh())return this.notModified();if(r=Math.max(0,r-d),void 0!==i.end){var h=i.end-d+1;r>h&&(r=h)}if(a){if(a=parseRange(r,a),this.isRangeFresh()||(debug("range stale"),a=-2),-1==a)return debug("range unsatisfiable"),s.setHeader("Content-Range","bytes */"+t.size),this.error(416);-2!=a&&1===a.length&&(debug("range %j",a),s.statusCode=206,s.setHeader("Content-Range","bytes "+a[0].start+"-"+a[0].end+"/"+r),d+=a[0].start,r=a[0].end-a[0].start+1)}for(var p in i)n[p]=i[p];return n.start=d,n.end=Math.max(d,d+r-1),s.setHeader("Content-Length",r),"HEAD"==o.method?s.end():void this.stream(e,n)},SendStream.prototype.sendFile=function(e){function t(n){if(i._extensions.length<=r)return n?i.onStatError(n):i.error(404);var s=e+"."+i._extensions[r++];debug('stat "%s"',s),fs.stat(s,function(e,r){return e?t(e):r.isDirectory()?t():(i.emit("file",s,r),void i.send(s,r))})}var r=0,i=this;debug('stat "%s"',e),fs.stat(e,function(r,n){return r&&"ENOENT"===r.code&&!extname(e)&&e[e.length-1]!==sep?t(r):r?i.onStatError(r):n.isDirectory()?i.redirect(i.path):(i.emit("file",e,n),void i.send(e,n))})},SendStream.prototype.sendIndex=function(e){function t(n){if(++r>=i._index.length)return n?i.onStatError(n):i.error(404);var s=join(e,i._index[r]);debug('stat "%s"',s),fs.stat(s,function(e,r){return e?t(e):r.isDirectory()?t():(i.emit("file",s,r),void i.send(s,r))})}var r=-1,i=this;t()},SendStream.prototype.stream=function(e,t){var r=!1,i=this,n=this.res,s=(this.req,fs.createReadStream(e,t));this.emit("stream",s),s.pipe(n),onFinished(n,function(){r=!0,destroy(s)}),s.on("error",function(e){r||(r=!0,destroy(s),i.onStatError(e))}),s.on("end",function(){i.emit("end")})},SendStream.prototype.type=function(e){var t=this.res;if(!t.getHeader("Content-Type")){var r=mime.lookup(e),i=mime.charsets.lookup(r);debug("content-type %s",r),t.setHeader("Content-Type",r+(i?"; charset="+i:""))}},SendStream.prototype.setHeader=function(e,t){var r=this.res;if(this.emit("headers",r,e,t),r.getHeader("Accept-Ranges")||r.setHeader("Accept-Ranges","bytes"),r.getHeader("Cache-Control")||r.setHeader("Cache-Control","public, max-age="+Math.floor(this._maxage/1e3)),this._lastModified&&!r.getHeader("Last-Modified")){var i=t.mtime.toUTCString();debug("modified %s",i),r.setHeader("Last-Modified",i)}if(this._etag&&!r.getHeader("ETag")){var n=etag(t);debug("etag %s",n),r.setHeader("ETag",n)}};

}).call(this,require("buffer").Buffer)
},{"buffer":60,"debug":76,"depd":78,"destroy":85,"escape-html":108,"etag":109,"events":110,"fresh":130,"fs":58,"http-errors":137,"mime":171,"ms":174,"on-finished":180,"path":197,"range-parser":214,"statuses":240,"stream":241}],230:[function(require,module,exports){
(function (Buffer){
"use strict";function serveStatic(e,r){if(!e)throw new TypeError("root path required");if("string"!=typeof e)throw new TypeError("root path must be a string");var t=Object.create(r||null),n=t.fallthrough!==!1,o=t.redirect!==!1,a=t.setHeaders;if(a&&"function"!=typeof a)throw new TypeError("option setHeaders must be function");t.maxage=t.maxage||t.maxAge||0,t.root=resolve(e);var s=o?createRedirectDirectoryListener():createNotFoundDirectoryListener();return function(e,r,o){if("GET"!==e.method&&"HEAD"!==e.method)return n?o():(r.statusCode=405,r.setHeader("Allow","GET, HEAD"),r.setHeader("Content-Length","0"),void r.end());var i=!n,u=parseUrl.original(e),l=parseUrl(e).pathname;"/"===l&&"/"!==u.pathname.substr(-1)&&(l="");var c=send(e,l,t);c.on("directory",s),a&&c.on("headers",a),n&&c.on("file",function(){i=!0}),c.on("error",function(e){return!i&&e.statusCode<500?void o():void o(e)}),c.pipe(r)}}function collapseLeadingSlashes(e){for(var r=0;r<e.length&&"/"===e[r];r++);return r>1?"/"+e.substr(r):e}function createNotFoundDirectoryListener(){return function(){this.error(404)}}function createRedirectDirectoryListener(){return function(){if(this.hasTrailingSlash())return void this.error(404);var e=parseUrl.original(this.req);e.path=null,e.pathname=collapseLeadingSlashes(e.pathname+"/");var r=url.format(e),t='Redirecting to <a href="'+escapeHtml(r)+'">'+escapeHtml(r)+"</a>\n",n=this.res;n.statusCode=303,n.setHeader("Content-Type","text/html; charset=UTF-8"),n.setHeader("Content-Length",Buffer.byteLength(t)),n.setHeader("X-Content-Type-Options","nosniff"),n.setHeader("Location",r),n.end(t)}}var escapeHtml=require("escape-html"),parseUrl=require("parseurl"),resolve=require("path").resolve,send=require("send"),url=require("url");module.exports=serveStatic,module.exports.mime=send.mime;

}).call(this,require("buffer").Buffer)
},{"buffer":60,"escape-html":108,"parseurl":196,"path":197,"send":229,"url":250}],231:[function(require,module,exports){
(function (Buffer){
function Hash(t,i){this._block=new Buffer(t),this._finalSize=i,this._blockSize=t,this._len=0,this._s=0}Hash.prototype.update=function(t,i){"string"==typeof t&&(i=i||"utf8",t=new Buffer(t,i));for(var s=this._len+=t.length,e=this._s||0,h=0,o=this._block;s>e;){for(var l=Math.min(t.length,h+this._blockSize-e%this._blockSize),_=l-h,n=0;_>n;n++)o[e%this._blockSize+n]=t[n+h];e+=_,h+=_,e%this._blockSize===0&&this._update(o)}return this._s=e,this},Hash.prototype.digest=function(t){var i=8*this._len;this._block[this._len%this._blockSize]=128,this._block.fill(0,this._len%this._blockSize+1),i%(8*this._blockSize)>=8*this._finalSize&&(this._update(this._block),this._block.fill(0)),this._block.writeInt32BE(i,this._blockSize-4);var s=this._update(this._block)||this._hash();return t?s.toString(t):s},Hash.prototype._update=function(){throw new Error("_update must be implemented by subclass")},module.exports=Hash;

}).call(this,require("buffer").Buffer)
},{"buffer":60}],232:[function(require,module,exports){
var exports=module.exports=function(e){e=e.toLowerCase();var r=exports[e];if(!r)throw new Error(e+" is not supported (we accept pull requests)");return new r};exports.sha=require("./sha"),exports.sha1=require("./sha1"),exports.sha224=require("./sha224"),exports.sha256=require("./sha256"),exports.sha384=require("./sha384"),exports.sha512=require("./sha512");

},{"./sha":233,"./sha1":234,"./sha224":235,"./sha256":236,"./sha384":237,"./sha512":238}],233:[function(require,module,exports){
(function (Buffer){
function Sha(){this.init(),this._w=W,Hash.call(this,64,56)}function rotl5(t){return t<<5|t>>>27}function rotl30(t){return t<<30|t>>>2}function ft(t,i,h,r){return 0===t?i&h|~i&r:2===t?i&h|i&r|h&r:i^h^r}var inherits=require("inherits"),Hash=require("./hash"),K=[1518500249,1859775393,-1894007588,-899497514],W=new Array(80);inherits(Sha,Hash),Sha.prototype.init=function(){return this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520,this},Sha.prototype._update=function(t){for(var i=this._w,h=0|this._a,r=0|this._b,s=0|this._c,e=0|this._d,n=0|this._e,_=0;16>_;++_)i[_]=t.readInt32BE(4*_);for(;80>_;++_)i[_]=i[_-3]^i[_-8]^i[_-14]^i[_-16];for(var a=0;80>a;++a){var o=~~(a/20),u=rotl5(h)+ft(o,r,s,e)+n+i[a]+K[o]|0;n=e,e=s,s=rotl30(r),r=h,h=u}this._a=h+this._a|0,this._b=r+this._b|0,this._c=s+this._c|0,this._d=e+this._d|0,this._e=n+this._e|0},Sha.prototype._hash=function(){var t=new Buffer(20);return t.writeInt32BE(0|this._a,0),t.writeInt32BE(0|this._b,4),t.writeInt32BE(0|this._c,8),t.writeInt32BE(0|this._d,12),t.writeInt32BE(0|this._e,16),t},module.exports=Sha;

}).call(this,require("buffer").Buffer)
},{"./hash":231,"buffer":60,"inherits":161}],234:[function(require,module,exports){
(function (Buffer){
function Sha1(){this.init(),this._w=W,Hash.call(this,64,56)}function rotl1(t){return t<<1|t>>>31}function rotl5(t){return t<<5|t>>>27}function rotl30(t){return t<<30|t>>>2}function ft(t,i,h,r){return 0===t?i&h|~i&r:2===t?i&h|i&r|h&r:i^h^r}var inherits=require("inherits"),Hash=require("./hash"),K=[1518500249,1859775393,-1894007588,-899497514],W=new Array(80);inherits(Sha1,Hash),Sha1.prototype.init=function(){return this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520,this},Sha1.prototype._update=function(t){for(var i=this._w,h=0|this._a,r=0|this._b,s=0|this._c,n=0|this._d,e=0|this._e,_=0;16>_;++_)i[_]=t.readInt32BE(4*_);for(;80>_;++_)i[_]=rotl1(i[_-3]^i[_-8]^i[_-14]^i[_-16]);for(var a=0;80>a;++a){var o=~~(a/20),u=rotl5(h)+ft(o,r,s,n)+e+i[a]+K[o]|0;e=n,n=s,s=rotl30(r),r=h,h=u}this._a=h+this._a|0,this._b=r+this._b|0,this._c=s+this._c|0,this._d=n+this._d|0,this._e=e+this._e|0},Sha1.prototype._hash=function(){var t=new Buffer(20);return t.writeInt32BE(0|this._a,0),t.writeInt32BE(0|this._b,4),t.writeInt32BE(0|this._c,8),t.writeInt32BE(0|this._d,12),t.writeInt32BE(0|this._e,16),t},module.exports=Sha1;

}).call(this,require("buffer").Buffer)
},{"./hash":231,"buffer":60,"inherits":161}],235:[function(require,module,exports){
(function (Buffer){
function Sha224(){this.init(),this._w=W,Hash.call(this,64,56)}var inherits=require("inherits"),Sha256=require("./sha256"),Hash=require("./hash"),W=new Array(64);inherits(Sha224,Sha256),Sha224.prototype.init=function(){return this._a=3238371032,this._b=914150663,this._c=812702999,this._d=4144912697,this._e=4290775857,this._f=1750603025,this._g=1694076839,this._h=3204075428,this},Sha224.prototype._hash=function(){var t=new Buffer(28);return t.writeInt32BE(this._a,0),t.writeInt32BE(this._b,4),t.writeInt32BE(this._c,8),t.writeInt32BE(this._d,12),t.writeInt32BE(this._e,16),t.writeInt32BE(this._f,20),t.writeInt32BE(this._g,24),t},module.exports=Sha224;

}).call(this,require("buffer").Buffer)
},{"./hash":231,"./sha256":236,"buffer":60,"inherits":161}],236:[function(require,module,exports){
(function (Buffer){
function Sha256(){this.init(),this._w=W,Hash.call(this,64,56)}function ch(t,i,h){return h^t&(i^h)}function maj(t,i,h){return t&i|h&(t|i)}function sigma0(t){return(t>>>2|t<<30)^(t>>>13|t<<19)^(t>>>22|t<<10)}function sigma1(t){return(t>>>6|t<<26)^(t>>>11|t<<21)^(t>>>25|t<<7)}function gamma0(t){return(t>>>7|t<<25)^(t>>>18|t<<14)^t>>>3}function gamma1(t){return(t>>>17|t<<15)^(t>>>19|t<<13)^t>>>10}var inherits=require("inherits"),Hash=require("./hash"),K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],W=new Array(64);inherits(Sha256,Hash),Sha256.prototype.init=function(){return this._a=1779033703,this._b=3144134277,this._c=1013904242,this._d=2773480762,this._e=1359893119,this._f=2600822924,this._g=528734635,this._h=1541459225,this},Sha256.prototype._update=function(t){for(var i=this._w,h=0|this._a,s=0|this._b,r=0|this._c,n=0|this._d,_=0|this._e,a=0|this._f,e=0|this._g,u=0|this._h,o=0;16>o;++o)i[o]=t.readInt32BE(4*o);for(;64>o;++o)i[o]=gamma1(i[o-2])+i[o-7]+gamma0(i[o-15])+i[o-16]|0;for(var f=0;64>f;++f){var c=u+sigma1(_)+ch(_,a,e)+K[f]+i[f]|0,m=sigma0(h)+maj(h,s,r)|0;u=e,e=a,a=_,_=n+c|0,n=r,r=s,s=h,h=c+m|0}this._a=h+this._a|0,this._b=s+this._b|0,this._c=r+this._c|0,this._d=n+this._d|0,this._e=_+this._e|0,this._f=a+this._f|0,this._g=e+this._g|0,this._h=u+this._h|0},Sha256.prototype._hash=function(){var t=new Buffer(32);return t.writeInt32BE(this._a,0),t.writeInt32BE(this._b,4),t.writeInt32BE(this._c,8),t.writeInt32BE(this._d,12),t.writeInt32BE(this._e,16),t.writeInt32BE(this._f,20),t.writeInt32BE(this._g,24),t.writeInt32BE(this._h,28),t},module.exports=Sha256;

}).call(this,require("buffer").Buffer)
},{"./hash":231,"buffer":60,"inherits":161}],237:[function(require,module,exports){
(function (Buffer){
function Sha384(){this.init(),this._w=W,Hash.call(this,128,112)}var inherits=require("inherits"),SHA512=require("./sha512"),Hash=require("./hash"),W=new Array(160);inherits(Sha384,SHA512),Sha384.prototype.init=function(){return this._ah=3418070365,this._bh=1654270250,this._ch=2438529370,this._dh=355462360,this._eh=1731405415,this._fh=2394180231,this._gh=3675008525,this._hh=1203062813,this._al=3238371032,this._bl=914150663,this._cl=812702999,this._dl=4144912697,this._el=4290775857,this._fl=1750603025,this._gl=1694076839,this._hl=3204075428,this},Sha384.prototype._hash=function(){function h(h,i,s){t.writeInt32BE(h,s),t.writeInt32BE(i,s+4)}var t=new Buffer(48);return h(this._ah,this._al,0),h(this._bh,this._bl,8),h(this._ch,this._cl,16),h(this._dh,this._dl,24),h(this._eh,this._el,32),h(this._fh,this._fl,40),t},module.exports=Sha384;

}).call(this,require("buffer").Buffer)
},{"./hash":231,"./sha512":238,"buffer":60,"inherits":161}],238:[function(require,module,exports){
(function (Buffer){
function Sha512(){this.init(),this._w=W,Hash.call(this,128,112)}function Ch(h,t,i){return i^h&(t^i)}function maj(h,t,i){return h&t|i&(h|t)}function sigma0(h,t){return(h>>>28|t<<4)^(t>>>2|h<<30)^(t>>>7|h<<25)}function sigma1(h,t){return(h>>>14|t<<18)^(h>>>18|t<<14)^(t>>>9|h<<23)}function Gamma0(h,t){return(h>>>1|t<<31)^(h>>>8|t<<24)^h>>>7}function Gamma0l(h,t){return(h>>>1|t<<31)^(h>>>8|t<<24)^(h>>>7|t<<25)}function Gamma1(h,t){return(h>>>19|t<<13)^(t>>>29|h<<3)^h>>>6}function Gamma1l(h,t){return(h>>>19|t<<13)^(t>>>29|h<<3)^(h>>>6|t<<26)}function getCarry(h,t){return t>>>0>h>>>0?1:0}var inherits=require("inherits"),Hash=require("./hash"),K=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591],W=new Array(160);inherits(Sha512,Hash),Sha512.prototype.init=function(){return this._ah=1779033703,this._bh=3144134277,this._ch=1013904242,this._dh=2773480762,this._eh=1359893119,this._fh=2600822924,this._gh=528734635,this._hh=1541459225,this._al=4089235720,this._bl=2227873595,this._cl=4271175723,this._dl=1595750129,this._el=2917565137,this._fl=725511199,this._gl=4215389547,this._hl=327033209,this},Sha512.prototype._update=function(h){for(var t=this._w,i=0|this._ah,s=0|this._bh,_=0|this._ch,r=0|this._dh,a=0|this._eh,e=0|this._fh,l=0|this._gh,n=0|this._hh,g=0|this._al,f=0|this._bl,u=0|this._cl,c=0|this._dl,m=0|this._el,o=0|this._fl,y=0|this._gl,C=0|this._hl,d=0;32>d;d+=2)t[d]=h.readInt32BE(4*d),t[d+1]=h.readInt32BE(4*d+4);for(;160>d;d+=2){var b=t[d-30],p=t[d-30+1],v=Gamma0(b,p),G=Gamma0l(p,b);b=t[d-4],p=t[d-4+1];var w=Gamma1(b,p),S=Gamma1l(p,b),B=t[d-14],E=t[d-14+1],I=t[d-32],j=t[d-32+1],H=G+E|0,q=v+B+getCarry(H,G)|0;H=H+S|0,q=q+w+getCarry(H,S)|0,H=H+j|0,q=q+I+getCarry(H,j)|0,t[d]=q,t[d+1]=H}for(var W=0;160>W;W+=2){q=t[W],H=t[W+1];var x=maj(i,s,_),A=maj(g,f,u),k=sigma0(i,g),z=sigma0(g,i),D=sigma1(a,m),F=sigma1(m,a),J=K[W],L=K[W+1],M=Ch(a,e,l),N=Ch(m,o,y),O=C+F|0,P=n+D+getCarry(O,C)|0;O=O+N|0,P=P+M+getCarry(O,N)|0,O=O+L|0,P=P+J+getCarry(O,L)|0,O=O+H|0,P=P+q+getCarry(O,H)|0;var Q=z+A|0,R=k+x+getCarry(Q,z)|0;n=l,C=y,l=e,y=o,e=a,o=m,m=c+O|0,a=r+P+getCarry(m,c)|0,r=_,c=u,_=s,u=f,s=i,f=g,g=O+Q|0,i=P+R+getCarry(g,O)|0}this._al=this._al+g|0,this._bl=this._bl+f|0,this._cl=this._cl+u|0,this._dl=this._dl+c|0,this._el=this._el+m|0,this._fl=this._fl+o|0,this._gl=this._gl+y|0,this._hl=this._hl+C|0,this._ah=this._ah+i+getCarry(this._al,g)|0,this._bh=this._bh+s+getCarry(this._bl,f)|0,this._ch=this._ch+_+getCarry(this._cl,u)|0,this._dh=this._dh+r+getCarry(this._dl,c)|0,this._eh=this._eh+a+getCarry(this._el,m)|0,this._fh=this._fh+e+getCarry(this._fl,o)|0,this._gh=this._gh+l+getCarry(this._gl,y)|0,this._hh=this._hh+n+getCarry(this._hl,C)|0},Sha512.prototype._hash=function(){function h(h,i,s){t.writeInt32BE(h,s),t.writeInt32BE(i,s+4)}var t=new Buffer(64);return h(this._ah,this._al,0),h(this._bh,this._bl,8),h(this._ch,this._cl,16),h(this._dh,this._dl,24),h(this._eh,this._el,32),h(this._fh,this._fl,40),h(this._gh,this._gl,48),h(this._hh,this._hl,56),t},module.exports=Sha512;

}).call(this,require("buffer").Buffer)
},{"./hash":231,"buffer":60,"inherits":161}],239:[function(require,module,exports){
module.exports={
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "306": "(Unused)",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Unordered Collection",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
}
},{}],240:[function(require,module,exports){
function status(t){if("number"==typeof t){if(!status[t])throw new Error("invalid status code: "+t);return t}if("string"!=typeof t)throw new TypeError("code must be a number or string");var s=parseInt(t,10);if(!isNaN(s)){if(!status[s])throw new Error("invalid status code: "+s);return s}if(s=status[t.toLowerCase()],!s)throw new Error('invalid status message: "'+t+'"');return s}var codes=require("./codes.json");module.exports=status,status.codes=Object.keys(codes).map(function(t){t=~~t;var s=codes[t];return status[t]=s,status[s]=status[s.toLowerCase()]=t,t}),status.redirect={300:!0,301:!0,302:!0,303:!0,305:!0,307:!0,308:!0},status.empty={204:!0,205:!0,304:!0},status.retry={502:!0,503:!0,504:!0};

},{"./codes.json":239}],241:[function(require,module,exports){
function Stream(){EE.call(this)}module.exports=Stream;var EE=require("events").EventEmitter,inherits=require("inherits");inherits(Stream,EE),Stream.Readable=require("readable-stream/readable.js"),Stream.Writable=require("readable-stream/writable.js"),Stream.Duplex=require("readable-stream/duplex.js"),Stream.Transform=require("readable-stream/transform.js"),Stream.PassThrough=require("readable-stream/passthrough.js"),Stream.Stream=Stream,Stream.prototype.pipe=function(e,r){function t(r){e.writable&&!1===e.write(r)&&m.pause&&m.pause()}function n(){m.readable&&m.resume&&m.resume()}function a(){u||(u=!0,e.end())}function o(){u||(u=!0,"function"==typeof e.destroy&&e.destroy())}function i(e){if(s(),0===EE.listenerCount(this,"error"))throw e}function s(){m.removeListener("data",t),e.removeListener("drain",n),m.removeListener("end",a),m.removeListener("close",o),m.removeListener("error",i),e.removeListener("error",i),m.removeListener("end",s),m.removeListener("close",s),e.removeListener("close",s)}var m=this;m.on("data",t),e.on("drain",n),e._isStdio||r&&r.end===!1||(m.on("end",a),m.on("close",o));var u=!1;return m.on("error",i),e.on("error",i),m.on("end",s),m.on("close",s),e.on("close",s),e.emit("pipe",m),e};

},{"events":110,"inherits":161,"readable-stream/duplex.js":217,"readable-stream/passthrough.js":224,"readable-stream/readable.js":225,"readable-stream/transform.js":226,"readable-stream/writable.js":227}],242:[function(require,module,exports){
(function (global){
var ClientRequest=require("./lib/request"),extend=require("xtend"),statusCodes=require("builtin-status-codes"),url=require("url"),http=exports;http.request=function(t,e){t="string"==typeof t?url.parse(t):extend(t);var r=-1===global.location.protocol.search(/^https?:$/)?"http:":"",s=t.protocol||r,o=t.hostname||t.host,n=t.port,u=t.path||"/";o&&-1!==o.indexOf(":")&&(o="["+o+"]"),t.url=(o?s+"//"+o:"")+(n?":"+n:"")+u,t.method=(t.method||"GET").toUpperCase(),t.headers=t.headers||{};var C=new ClientRequest(t);return e&&C.on("response",e),C},http.get=function(t,e){var r=http.request(t,e);return r.end(),r},http.Agent=function(){},http.Agent.defaultMaxSockets=4,http.STATUS_CODES=statusCodes,http.METHODS=["CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REPORT","SEARCH","SUBSCRIBE","TRACE","UNLOCK","UNSUBSCRIBE"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/request":244,"builtin-status-codes":62,"url":250,"xtend":258}],243:[function(require,module,exports){
(function (global){
function checkTypeSupport(e){try{return xhr.responseType=e,xhr.responseType===e}catch(r){}return!1}function isFunction(e){return"function"==typeof e}exports.fetch=isFunction(global.fetch)&&isFunction(global.ReadableByteStream),exports.blobConstructor=!1;try{new Blob([new ArrayBuffer(1)]),exports.blobConstructor=!0}catch(e){}var xhr=new global.XMLHttpRequest;xhr.open("GET",global.location.host?"/":"https://example.com");var haveArrayBuffer="undefined"!=typeof global.ArrayBuffer,haveSlice=haveArrayBuffer&&isFunction(global.ArrayBuffer.prototype.slice);exports.arraybuffer=haveArrayBuffer&&checkTypeSupport("arraybuffer"),exports.msstream=!exports.fetch&&haveSlice&&checkTypeSupport("ms-stream"),exports.mozchunkedarraybuffer=!exports.fetch&&haveArrayBuffer&&checkTypeSupport("moz-chunked-arraybuffer"),exports.overrideMimeType=isFunction(xhr.overrideMimeType),exports.vbArray=isFunction(global.VBArray),xhr=null;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],244:[function(require,module,exports){
(function (process,global,Buffer){
function decideMode(e){return capability.fetch?"fetch":capability.mozchunkedarraybuffer?"moz-chunked-arraybuffer":capability.msstream?"ms-stream":capability.arraybuffer&&e?"arraybuffer":capability.vbArray&&e?"text:vbarray":"text"}function statusValid(e){try{var t=e.status;return null!==t&&0!==t}catch(r){return!1}}var capability=require("./capability"),inherits=require("inherits"),response=require("./response"),stream=require("readable-stream"),toArrayBuffer=require("to-arraybuffer"),IncomingMessage=response.IncomingMessage,rStates=response.readyStates,ClientRequest=module.exports=function(e){var t=this;stream.Writable.call(t),t._opts=e,t._body=[],t._headers={},e.auth&&t.setHeader("Authorization","Basic "+new Buffer(e.auth).toString("base64")),Object.keys(e.headers).forEach(function(r){t.setHeader(r,e.headers[r])});var r;if("prefer-streaming"===e.mode)r=!1;else if("allow-wrong-content-type"===e.mode)r=!capability.overrideMimeType;else{if(e.mode&&"default"!==e.mode&&"prefer-fast"!==e.mode)throw new Error("Invalid value for opts.mode");r=!0}t._mode=decideMode(r),t.on("finish",function(){t._onFinish()})};inherits(ClientRequest,stream.Writable),ClientRequest.prototype.setHeader=function(e,t){var r=this,o=e.toLowerCase();-1===unsafeHeaders.indexOf(o)&&(r._headers[o]={name:e,value:t})},ClientRequest.prototype.getHeader=function(e){var t=this;return t._headers[e.toLowerCase()].value},ClientRequest.prototype.removeHeader=function(e){var t=this;delete t._headers[e.toLowerCase()]},ClientRequest.prototype._onFinish=function(){var e=this;if(!e._destroyed){var t,r=e._opts,o=e._headers;if("POST"!==r.method&&"PUT"!==r.method&&"PATCH"!==r.method||(t=capability.blobConstructor?new global.Blob(e._body.map(function(e){return toArrayBuffer(e)}),{type:(o["content-type"]||{}).value||""}):Buffer.concat(e._body).toString()),"fetch"===e._mode){var n=Object.keys(o).map(function(e){return[o[e].name,o[e].value]});global.fetch(e._opts.url,{method:e._opts.method,headers:n,body:t,mode:"cors",credentials:r.withCredentials?"include":"same-origin"}).then(function(t){e._fetchResponse=t,e._connect()},function(t){e.emit("error",t)})}else{var s=e._xhr=new global.XMLHttpRequest;try{s.open(e._opts.method,e._opts.url,!0)}catch(a){return void process.nextTick(function(){e.emit("error",a)})}"responseType"in s&&(s.responseType=e._mode.split(":")[0]),"withCredentials"in s&&(s.withCredentials=!!r.withCredentials),"text"===e._mode&&"overrideMimeType"in s&&s.overrideMimeType("text/plain; charset=x-user-defined"),Object.keys(o).forEach(function(e){s.setRequestHeader(o[e].name,o[e].value)}),e._response=null,s.onreadystatechange=function(){switch(s.readyState){case rStates.LOADING:case rStates.DONE:e._onXHRProgress()}},"moz-chunked-arraybuffer"===e._mode&&(s.onprogress=function(){e._onXHRProgress()}),s.onerror=function(){e._destroyed||e.emit("error",new Error("XHR error"))};try{s.send(t)}catch(a){return void process.nextTick(function(){e.emit("error",a)})}}}},ClientRequest.prototype._onXHRProgress=function(){var e=this;statusValid(e._xhr)&&!e._destroyed&&(e._response||e._connect(),e._response._onXHRProgress())},ClientRequest.prototype._connect=function(){var e=this;e._destroyed||(e._response=new IncomingMessage(e._xhr,e._fetchResponse,e._mode),e.emit("response",e._response))},ClientRequest.prototype._write=function(e,t,r){var o=this;o._body.push(e),r()},ClientRequest.prototype.abort=ClientRequest.prototype.destroy=function(){var e=this;e._destroyed=!0,e._response&&(e._response._destroyed=!0),e._xhr&&e._xhr.abort()},ClientRequest.prototype.end=function(e,t,r){var o=this;"function"==typeof e&&(r=e,e=void 0),stream.Writable.prototype.end.call(o,e,t,r)},ClientRequest.prototype.flushHeaders=function(){},ClientRequest.prototype.setTimeout=function(){},ClientRequest.prototype.setNoDelay=function(){},ClientRequest.prototype.setSocketKeepAlive=function(){};var unsafeHeaders=["accept-charset","accept-encoding","access-control-request-headers","access-control-request-method","connection","content-length","cookie","cookie2","date","dnt","expect","host","keep-alive","origin","referer","te","trailer","transfer-encoding","upgrade","user-agent","via"];

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./capability":243,"./response":245,"_process":201,"buffer":60,"inherits":161,"readable-stream":225,"to-arraybuffer":247}],245:[function(require,module,exports){
(function (process,global,Buffer){
var capability=require("./capability"),inherits=require("inherits"),stream=require("readable-stream"),rStates=exports.readyStates={UNSENT:0,OPENED:1,HEADERS_RECEIVED:2,LOADING:3,DONE:4},IncomingMessage=exports.IncomingMessage=function(e,r,s){function a(){u.read().then(function(e){if(!t._destroyed){if(e.done)return void t.push(null);t.push(new Buffer(e.value)),a()}})}var t=this;if(stream.Readable.call(t),t._mode=s,t.headers={},t.rawHeaders=[],t.trailers={},t.rawTrailers=[],t.on("end",function(){process.nextTick(function(){t.emit("close")})}),"fetch"===s){t._fetchResponse=r,t.url=r.url,t.statusCode=r.status,t.statusMessage=r.statusText;for(var n,o,i=r.headers[Symbol.iterator]();n=(o=i.next()).value,!o.done;)t.headers[n[0].toLowerCase()]=n[1],t.rawHeaders.push(n[0],n[1]);var u=r.body.getReader();a()}else{t._xhr=e,t._pos=0,t.url=e.responseURL,t.statusCode=e.status,t.statusMessage=e.statusText;var h=e.getAllResponseHeaders().split(/\r?\n/);if(h.forEach(function(e){var r=e.match(/^([^:]+):\s*(.*)/);if(r){var s=r[1].toLowerCase();"set-cookie"===s?(void 0===t.headers[s]&&(t.headers[s]=[]),t.headers[s].push(r[2])):void 0!==t.headers[s]?t.headers[s]+=", "+r[2]:t.headers[s]=r[2],t.rawHeaders.push(r[1],r[2])}}),t._charset="x-user-defined",!capability.overrideMimeType){var d=t.rawHeaders["mime-type"];if(d){var f=d.match(/;\s*charset=([^;])(;|$)/);f&&(t._charset=f[1].toLowerCase())}t._charset||(t._charset="utf-8")}}};inherits(IncomingMessage,stream.Readable),IncomingMessage.prototype._read=function(){},IncomingMessage.prototype._onXHRProgress=function(){var e=this,r=e._xhr,s=null;switch(e._mode){case"text:vbarray":if(r.readyState!==rStates.DONE)break;try{s=new global.VBArray(r.responseBody).toArray()}catch(a){}if(null!==s){e.push(new Buffer(s));break}case"text":try{s=r.responseText}catch(a){e._mode="text:vbarray";break}if(s.length>e._pos){var t=s.substr(e._pos);if("x-user-defined"===e._charset){for(var n=new Buffer(t.length),o=0;o<t.length;o++)n[o]=255&t.charCodeAt(o);e.push(n)}else e.push(t,e._charset);e._pos=s.length}break;case"arraybuffer":if(r.readyState!==rStates.DONE)break;s=r.response,e.push(new Buffer(new Uint8Array(s)));break;case"moz-chunked-arraybuffer":if(s=r.response,r.readyState!==rStates.LOADING||!s)break;e.push(new Buffer(new Uint8Array(s)));break;case"ms-stream":if(s=r.response,r.readyState!==rStates.LOADING)break;var i=new global.MSStreamReader;i.onprogress=function(){i.result.byteLength>e._pos&&(e.push(new Buffer(new Uint8Array(i.result.slice(e._pos)))),e._pos=i.result.byteLength)},i.onload=function(){e.push(null)},i.readAsArrayBuffer(s)}e._xhr.readyState===rStates.DONE&&"ms-stream"!==e._mode&&e.push(null)};

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./capability":243,"_process":201,"buffer":60,"inherits":161,"readable-stream":225}],246:[function(require,module,exports){
function assertEncoding(e){if(e&&!isBufferEncoding(e))throw new Error("Unknown encoding: "+e)}function passThroughWrite(e){return e.toString(this.encoding)}function utf16DetectIncompleteChar(e){this.charReceived=e.length%2,this.charLength=this.charReceived?2:0}function base64DetectIncompleteChar(e){this.charReceived=e.length%3,this.charLength=this.charReceived?3:0}var Buffer=require("buffer").Buffer,isBufferEncoding=Buffer.isEncoding||function(e){switch(e&&e.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}},StringDecoder=exports.StringDecoder=function(e){switch(this.encoding=(e||"utf8").toLowerCase().replace(/[-_]/,""),assertEncoding(e),this.encoding){case"utf8":this.surrogateSize=3;break;case"ucs2":case"utf16le":this.surrogateSize=2,this.detectIncompleteChar=utf16DetectIncompleteChar;break;case"base64":this.surrogateSize=3,this.detectIncompleteChar=base64DetectIncompleteChar;break;default:return void(this.write=passThroughWrite)}this.charBuffer=new Buffer(6),this.charReceived=0,this.charLength=0};StringDecoder.prototype.write=function(e){for(var t="";this.charLength;){var r=e.length>=this.charLength-this.charReceived?this.charLength-this.charReceived:e.length;if(e.copy(this.charBuffer,this.charReceived,0,r),this.charReceived+=r,this.charReceived<this.charLength)return"";e=e.slice(r,e.length),t=this.charBuffer.slice(0,this.charLength).toString(this.encoding);var h=t.charCodeAt(t.length-1);if(!(h>=55296&&56319>=h)){if(this.charReceived=this.charLength=0,0===e.length)return t;break}this.charLength+=this.surrogateSize,t=""}this.detectIncompleteChar(e);var i=e.length;this.charLength&&(e.copy(this.charBuffer,0,e.length-this.charReceived,i),i-=this.charReceived),t+=e.toString(this.encoding,0,i);var i=t.length-1,h=t.charCodeAt(i);if(h>=55296&&56319>=h){var c=this.surrogateSize;return this.charLength+=c,this.charReceived+=c,this.charBuffer.copy(this.charBuffer,c,0,c),e.copy(this.charBuffer,0,0,c),t.substring(0,i)}return t},StringDecoder.prototype.detectIncompleteChar=function(e){for(var t=e.length>=3?3:e.length;t>0;t--){var r=e[e.length-t];if(1==t&&r>>5==6){this.charLength=2;break}if(2>=t&&r>>4==14){this.charLength=3;break}if(3>=t&&r>>3==30){this.charLength=4;break}}this.charReceived=t},StringDecoder.prototype.end=function(e){var t="";if(e&&e.length&&(t=this.write(e)),this.charReceived){var r=this.charReceived,h=this.charBuffer,i=this.encoding;t+=h.slice(0,r).toString(i)}return t};

},{"buffer":60}],247:[function(require,module,exports){
var Buffer=require("buffer").Buffer;module.exports=function(e){if(e instanceof Uint8Array){if(0===e.byteOffset&&e.byteLength===e.buffer.byteLength)return e.buffer;if("function"==typeof e.buffer.slice)return e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)}if(Buffer.isBuffer(e)){for(var f=new Uint8Array(e.length),r=e.length,t=0;r>t;t++)f[t]=e[t];return f.buffer}throw new Error("Argument must be a Buffer")};

},{"buffer":60}],248:[function(require,module,exports){
"use strict";function typeis(e,r){var t,n=r,i=tryNormalizeType(e);if(!i)return!1;if(n&&!Array.isArray(n))for(n=new Array(arguments.length-1),t=0;t<n.length;t++)n[t]=arguments[t+1];if(!n||!n.length)return i;var o;for(t=0;t<n.length;t++)if(mimeMatch(normalize(o=n[t]),i))return"+"===o[0]||-1!==o.indexOf("*")?i:o;return!1}function hasbody(e){return void 0!==e.headers["transfer-encoding"]||!isNaN(e.headers["content-length"])}function typeofrequest(e,r){var t=r;if(!hasbody(e))return null;if(arguments.length>2){t=new Array(arguments.length-1);for(var n=0;n<t.length;n++)t[n]=arguments[n+1]}var i=e.headers["content-type"];return typeis(i,t)}function normalize(e){if("string"!=typeof e)return!1;switch(e){case"urlencoded":return"application/x-www-form-urlencoded";case"multipart":return"multipart/*"}return"+"===e[0]?"*/*"+e:-1===e.indexOf("/")?mime.lookup(e):e}function mimeMatch(e,r){if(e===!1)return!1;var t=r.split("/"),n=e.split("/");return 2!==t.length||2!==n.length?!1:"*"!==n[0]&&n[0]!==t[0]?!1:"*+"===n[1].substr(0,2)?n[1].length<=t[1].length+1&&n[1].substr(1)===t[1].substr(1-n[1].length):"*"===n[1]||n[1]===t[1]}function normalizeType(e){var r=typer.parse(e);return r.parameters=void 0,typer.format(r)}function tryNormalizeType(e){try{return normalizeType(e)}catch(r){return null}}var typer=require("media-typer"),mime=require("mime-types");module.exports=typeofrequest,module.exports.is=typeis,module.exports.hasBody=hasbody,module.exports.normalize=normalize,module.exports.match=mimeMatch;

},{"media-typer":164,"mime-types":170}],249:[function(require,module,exports){
"use strict";function hasPipeDataListeners(e){for(var n=e.listeners("data"),r=0;r<n.length;r++)if("ondata"===n[r].name)return!0;return!1}function unpipe(e){if(!e)throw new TypeError("argument stream is required");if("function"==typeof e.unpipe)return void e.unpipe();if(hasPipeDataListeners(e))for(var n,r=e.listeners("close"),t=0;t<r.length;t++)n=r[t],"cleanup"!==n.name&&"onclose"!==n.name||n.call(e)}module.exports=unpipe;

},{}],250:[function(require,module,exports){
"use strict";function Url(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function urlParse(t,s,e){if(t&&util.isObject(t)&&t instanceof Url)return t;var h=new Url;return h.parse(t,s,e),h}function urlFormat(t){return util.isString(t)&&(t=urlParse(t)),t instanceof Url?t.format():Url.prototype.format.call(t)}function urlResolve(t,s){return urlParse(t,!1,!0).resolve(s)}function urlResolveObject(t,s){return t?urlParse(t,!1,!0).resolveObject(s):s}var punycode=require("punycode"),util=require("./util");exports.parse=urlParse,exports.resolve=urlResolve,exports.resolveObject=urlResolveObject,exports.format=urlFormat,exports.Url=Url;var protocolPattern=/^([a-z0-9.+-]+:)/i,portPattern=/:[0-9]*$/,simplePathPattern=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,delims=["<",">",'"',"`"," ","\r","\n","	"],unwise=["{","}","|","\\","^","`"].concat(delims),autoEscape=["'"].concat(unwise),nonHostChars=["%","/","?",";","#"].concat(autoEscape),hostEndingChars=["/","?","#"],hostnameMaxLen=255,hostnamePartPattern=/^[+a-z0-9A-Z_-]{0,63}$/,hostnamePartStart=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,unsafeProtocol={javascript:!0,"javascript:":!0},hostlessProtocol={javascript:!0,"javascript:":!0},slashedProtocol={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},querystring=require("querystring");Url.prototype.parse=function(t,s,e){if(!util.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var h=t.indexOf("?"),r=-1!==h&&h<t.indexOf("#")?"?":"#",a=t.split(r),o=/\\/g;a[0]=a[0].replace(o,"/"),t=a.join(r);var n=t;if(n=n.trim(),!e&&1===t.split("#").length){var i=simplePathPattern.exec(n);if(i)return this.path=n,this.href=n,this.pathname=i[1],i[2]?(this.search=i[2],s?this.query=querystring.parse(this.search.substr(1)):this.query=this.search.substr(1)):s&&(this.search="",this.query={}),this}var l=protocolPattern.exec(n);if(l){l=l[0];var u=l.toLowerCase();this.protocol=u,n=n.substr(l.length)}if(e||l||n.match(/^\/\/[^@\/]+@[^@\/]+/)){var p="//"===n.substr(0,2);!p||l&&hostlessProtocol[l]||(n=n.substr(2),this.slashes=!0)}if(!hostlessProtocol[l]&&(p||l&&!slashedProtocol[l])){for(var c=-1,f=0;f<hostEndingChars.length;f++){var m=n.indexOf(hostEndingChars[f]);-1!==m&&(-1===c||c>m)&&(c=m)}var v,g;g=-1===c?n.lastIndexOf("@"):n.lastIndexOf("@",c),-1!==g&&(v=n.slice(0,g),n=n.slice(g+1),this.auth=decodeURIComponent(v)),c=-1;for(var f=0;f<nonHostChars.length;f++){var m=n.indexOf(nonHostChars[f]);-1!==m&&(-1===c||c>m)&&(c=m)}-1===c&&(c=n.length),this.host=n.slice(0,c),n=n.slice(c),this.parseHost(),this.hostname=this.hostname||"";var y="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!y)for(var P=this.hostname.split(/\./),f=0,d=P.length;d>f;f++){var q=P[f];if(q&&!q.match(hostnamePartPattern)){for(var b="",O=0,j=q.length;j>O;O++)b+=q.charCodeAt(O)>127?"x":q[O];if(!b.match(hostnamePartPattern)){var x=P.slice(0,f),U=P.slice(f+1),C=q.match(hostnamePartStart);C&&(x.push(C[1]),U.unshift(C[2])),U.length&&(n="/"+U.join(".")+n),this.hostname=x.join(".");break}}}this.hostname.length>hostnameMaxLen?this.hostname="":this.hostname=this.hostname.toLowerCase(),y||(this.hostname=punycode.toASCII(this.hostname));var A=this.port?":"+this.port:"",w=this.hostname||"";this.host=w+A,this.href+=this.host,y&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==n[0]&&(n="/"+n))}if(!unsafeProtocol[u])for(var f=0,d=autoEscape.length;d>f;f++){var E=autoEscape[f];if(-1!==n.indexOf(E)){var I=encodeURIComponent(E);I===E&&(I=escape(E)),n=n.split(E).join(I)}}var R=n.indexOf("#");-1!==R&&(this.hash=n.substr(R),n=n.slice(0,R));var S=n.indexOf("?");if(-1!==S?(this.search=n.substr(S),this.query=n.substr(S+1),s&&(this.query=querystring.parse(this.query)),n=n.slice(0,S)):s&&(this.search="",this.query={}),n&&(this.pathname=n),slashedProtocol[u]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var A=this.pathname||"",k=this.search||"";this.path=A+k}return this.href=this.format(),this},Url.prototype.format=function(){var t=this.auth||"";t&&(t=encodeURIComponent(t),t=t.replace(/%3A/i,":"),t+="@");var s=this.protocol||"",e=this.pathname||"",h=this.hash||"",r=!1,a="";this.host?r=t+this.host:this.hostname&&(r=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(r+=":"+this.port)),this.query&&util.isObject(this.query)&&Object.keys(this.query).length&&(a=querystring.stringify(this.query));var o=this.search||a&&"?"+a||"";return s&&":"!==s.substr(-1)&&(s+=":"),this.slashes||(!s||slashedProtocol[s])&&r!==!1?(r="//"+(r||""),e&&"/"!==e.charAt(0)&&(e="/"+e)):r||(r=""),h&&"#"!==h.charAt(0)&&(h="#"+h),o&&"?"!==o.charAt(0)&&(o="?"+o),e=e.replace(/[?#]/g,function(t){return encodeURIComponent(t)}),o=o.replace("#","%23"),s+r+e+o+h},Url.prototype.resolve=function(t){return this.resolveObject(urlParse(t,!1,!0)).format()},Url.prototype.resolveObject=function(t){if(util.isString(t)){var s=new Url;s.parse(t,!1,!0),t=s}for(var e=new Url,h=Object.keys(this),r=0;r<h.length;r++){var a=h[r];e[a]=this[a]}if(e.hash=t.hash,""===t.href)return e.href=e.format(),e;if(t.slashes&&!t.protocol){for(var o=Object.keys(t),n=0;n<o.length;n++){var i=o[n];"protocol"!==i&&(e[i]=t[i])}return slashedProtocol[e.protocol]&&e.hostname&&!e.pathname&&(e.path=e.pathname="/"),e.href=e.format(),e}if(t.protocol&&t.protocol!==e.protocol){if(!slashedProtocol[t.protocol]){for(var l=Object.keys(t),u=0;u<l.length;u++){var p=l[u];e[p]=t[p]}return e.href=e.format(),e}if(e.protocol=t.protocol,t.host||hostlessProtocol[t.protocol])e.pathname=t.pathname;else{for(var c=(t.pathname||"").split("/");c.length&&!(t.host=c.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==c[0]&&c.unshift(""),c.length<2&&c.unshift(""),e.pathname=c.join("/")}if(e.search=t.search,e.query=t.query,e.host=t.host||"",e.auth=t.auth,e.hostname=t.hostname||t.host,e.port=t.port,e.pathname||e.search){var f=e.pathname||"",m=e.search||"";e.path=f+m}return e.slashes=e.slashes||t.slashes,e.href=e.format(),e}var v=e.pathname&&"/"===e.pathname.charAt(0),g=t.host||t.pathname&&"/"===t.pathname.charAt(0),y=g||v||e.host&&t.pathname,P=y,d=e.pathname&&e.pathname.split("/")||[],c=t.pathname&&t.pathname.split("/")||[],q=e.protocol&&!slashedProtocol[e.protocol];if(q&&(e.hostname="",e.port=null,e.host&&(""===d[0]?d[0]=e.host:d.unshift(e.host)),e.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===c[0]?c[0]=t.host:c.unshift(t.host)),t.host=null),y=y&&(""===c[0]||""===d[0])),g)e.host=t.host||""===t.host?t.host:e.host,e.hostname=t.hostname||""===t.hostname?t.hostname:e.hostname,e.search=t.search,e.query=t.query,d=c;else if(c.length)d||(d=[]),d.pop(),d=d.concat(c),e.search=t.search,e.query=t.query;else if(!util.isNullOrUndefined(t.search)){if(q){e.hostname=e.host=d.shift();var b=e.host&&e.host.indexOf("@")>0?e.host.split("@"):!1;b&&(e.auth=b.shift(),e.host=e.hostname=b.shift())}return e.search=t.search,e.query=t.query,util.isNull(e.pathname)&&util.isNull(e.search)||(e.path=(e.pathname?e.pathname:"")+(e.search?e.search:"")),e.href=e.format(),e}if(!d.length)return e.pathname=null,e.search?e.path="/"+e.search:e.path=null,e.href=e.format(),e;for(var O=d.slice(-1)[0],j=(e.host||t.host||d.length>1)&&("."===O||".."===O)||""===O,x=0,U=d.length;U>=0;U--)O=d[U],"."===O?d.splice(U,1):".."===O?(d.splice(U,1),x++):x&&(d.splice(U,1),x--);if(!y&&!P)for(;x--;x)d.unshift("..");!y||""===d[0]||d[0]&&"/"===d[0].charAt(0)||d.unshift(""),j&&"/"!==d.join("/").substr(-1)&&d.push("");var C=""===d[0]||d[0]&&"/"===d[0].charAt(0);if(q){e.hostname=e.host=C?"":d.length?d.shift():"";var b=e.host&&e.host.indexOf("@")>0?e.host.split("@"):!1;b&&(e.auth=b.shift(),e.host=e.hostname=b.shift())}return y=y||e.host&&d.length,y&&!C&&d.unshift(""),d.length?e.pathname=d.join("/"):(e.pathname=null,e.path=null),util.isNull(e.pathname)&&util.isNull(e.search)||(e.path=(e.pathname?e.pathname:"")+(e.search?e.search:"")),e.auth=t.auth||e.auth,e.slashes=e.slashes||t.slashes,e.href=e.format(),e},Url.prototype.parseHost=function(){var t=this.host,s=portPattern.exec(t);s&&(s=s[0],":"!==s&&(this.port=s.substr(1)),t=t.substr(0,t.length-s.length)),t&&(this.hostname=t)};

},{"./util":251,"punycode":209,"querystring":212}],251:[function(require,module,exports){
"use strict";module.exports={isString:function(n){return"string"==typeof n},isObject:function(n){return"object"==typeof n&&null!==n},isNull:function(n){return null===n},isNullOrUndefined:function(n){return null==n}};

},{}],252:[function(require,module,exports){
(function (global){
function deprecate(r,e){function o(){if(!t){if(config("throwDeprecation"))throw new Error(e);config("traceDeprecation")?console.trace(e):console.warn(e),t=!0}return r.apply(this,arguments)}if(config("noDeprecation"))return r;var t=!1;return o}function config(r){try{if(!global.localStorage)return!1}catch(e){return!1}var o=global.localStorage[r];return null==o?!1:"true"===String(o).toLowerCase()}module.exports=deprecate;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],253:[function(require,module,exports){
module.exports=function(o){return o&&"object"==typeof o&&"function"==typeof o.copy&&"function"==typeof o.fill&&"function"==typeof o.readUInt8};

},{}],254:[function(require,module,exports){
(function (process,global){
function inspect(e,r){var t={seen:[],stylize:stylizeNoColor};return arguments.length>=3&&(t.depth=arguments[2]),arguments.length>=4&&(t.colors=arguments[3]),isBoolean(r)?t.showHidden=r:r&&exports._extend(t,r),isUndefined(t.showHidden)&&(t.showHidden=!1),isUndefined(t.depth)&&(t.depth=2),isUndefined(t.colors)&&(t.colors=!1),isUndefined(t.customInspect)&&(t.customInspect=!0),t.colors&&(t.stylize=stylizeWithColor),formatValue(t,e,t.depth)}function stylizeWithColor(e,r){var t=inspect.styles[r];return t?"["+inspect.colors[t][0]+"m"+e+"["+inspect.colors[t][1]+"m":e}function stylizeNoColor(e,r){return e}function arrayToHash(e){var r={};return e.forEach(function(e,t){r[e]=!0}),r}function formatValue(e,r,t){if(e.customInspect&&r&&isFunction(r.inspect)&&r.inspect!==exports.inspect&&(!r.constructor||r.constructor.prototype!==r)){var n=r.inspect(t,e);return isString(n)||(n=formatValue(e,n,t)),n}var i=formatPrimitive(e,r);if(i)return i;var o=Object.keys(r),s=arrayToHash(o);if(e.showHidden&&(o=Object.getOwnPropertyNames(r)),isError(r)&&(o.indexOf("message")>=0||o.indexOf("description")>=0))return formatError(r);if(0===o.length){if(isFunction(r)){var u=r.name?": "+r.name:"";return e.stylize("[Function"+u+"]","special")}if(isRegExp(r))return e.stylize(RegExp.prototype.toString.call(r),"regexp");if(isDate(r))return e.stylize(Date.prototype.toString.call(r),"date");if(isError(r))return formatError(r)}var c="",a=!1,l=["{","}"];if(isArray(r)&&(a=!0,l=["[","]"]),isFunction(r)){var p=r.name?": "+r.name:"";c=" [Function"+p+"]"}if(isRegExp(r)&&(c=" "+RegExp.prototype.toString.call(r)),isDate(r)&&(c=" "+Date.prototype.toUTCString.call(r)),isError(r)&&(c=" "+formatError(r)),0===o.length&&(!a||0==r.length))return l[0]+c+l[1];if(0>t)return isRegExp(r)?e.stylize(RegExp.prototype.toString.call(r),"regexp"):e.stylize("[Object]","special");e.seen.push(r);var f;return f=a?formatArray(e,r,t,s,o):o.map(function(n){return formatProperty(e,r,t,s,n,a)}),e.seen.pop(),reduceToSingleString(f,c,l)}function formatPrimitive(e,r){if(isUndefined(r))return e.stylize("undefined","undefined");if(isString(r)){var t="'"+JSON.stringify(r).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(t,"string")}return isNumber(r)?e.stylize(""+r,"number"):isBoolean(r)?e.stylize(""+r,"boolean"):isNull(r)?e.stylize("null","null"):void 0}function formatError(e){return"["+Error.prototype.toString.call(e)+"]"}function formatArray(e,r,t,n,i){for(var o=[],s=0,u=r.length;u>s;++s)hasOwnProperty(r,String(s))?o.push(formatProperty(e,r,t,n,String(s),!0)):o.push("");return i.forEach(function(i){i.match(/^\d+$/)||o.push(formatProperty(e,r,t,n,i,!0))}),o}function formatProperty(e,r,t,n,i,o){var s,u,c;if(c=Object.getOwnPropertyDescriptor(r,i)||{value:r[i]},c.get?u=c.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):c.set&&(u=e.stylize("[Setter]","special")),hasOwnProperty(n,i)||(s="["+i+"]"),u||(e.seen.indexOf(c.value)<0?(u=isNull(t)?formatValue(e,c.value,null):formatValue(e,c.value,t-1),u.indexOf("\n")>-1&&(u=o?u.split("\n").map(function(e){return"  "+e}).join("\n").substr(2):"\n"+u.split("\n").map(function(e){return"   "+e}).join("\n"))):u=e.stylize("[Circular]","special")),isUndefined(s)){if(o&&i.match(/^\d+$/))return u;s=JSON.stringify(""+i),s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=e.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=e.stylize(s,"string"))}return s+": "+u}function reduceToSingleString(e,r,t){var n=0,i=e.reduce(function(e,r){return n++,r.indexOf("\n")>=0&&n++,e+r.replace(/\u001b\[\d\d?m/g,"").length+1},0);return i>60?t[0]+(""===r?"":r+"\n ")+" "+e.join(",\n  ")+" "+t[1]:t[0]+r+" "+e.join(", ")+" "+t[1]}function isArray(e){return Array.isArray(e)}function isBoolean(e){return"boolean"==typeof e}function isNull(e){return null===e}function isNullOrUndefined(e){return null==e}function isNumber(e){return"number"==typeof e}function isString(e){return"string"==typeof e}function isSymbol(e){return"symbol"==typeof e}function isUndefined(e){return void 0===e}function isRegExp(e){return isObject(e)&&"[object RegExp]"===objectToString(e)}function isObject(e){return"object"==typeof e&&null!==e}function isDate(e){return isObject(e)&&"[object Date]"===objectToString(e)}function isError(e){return isObject(e)&&("[object Error]"===objectToString(e)||e instanceof Error)}function isFunction(e){return"function"==typeof e}function isPrimitive(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||"undefined"==typeof e}function objectToString(e){return Object.prototype.toString.call(e)}function pad(e){return 10>e?"0"+e.toString(10):e.toString(10)}function timestamp(){var e=new Date,r=[pad(e.getHours()),pad(e.getMinutes()),pad(e.getSeconds())].join(":");return[e.getDate(),months[e.getMonth()],r].join(" ")}function hasOwnProperty(e,r){return Object.prototype.hasOwnProperty.call(e,r)}var formatRegExp=/%[sdj%]/g;exports.format=function(e){if(!isString(e)){for(var r=[],t=0;t<arguments.length;t++)r.push(inspect(arguments[t]));return r.join(" ")}for(var t=1,n=arguments,i=n.length,o=String(e).replace(formatRegExp,function(e){if("%%"===e)return"%";if(t>=i)return e;switch(e){case"%s":return String(n[t++]);case"%d":return Number(n[t++]);case"%j":try{return JSON.stringify(n[t++])}catch(r){return"[Circular]"}default:return e}}),s=n[t];i>t;s=n[++t])o+=isNull(s)||!isObject(s)?" "+s:" "+inspect(s);return o},exports.deprecate=function(e,r){function t(){if(!n){if(process.throwDeprecation)throw new Error(r);process.traceDeprecation?console.trace(r):console.error(r),n=!0}return e.apply(this,arguments)}if(isUndefined(global.process))return function(){return exports.deprecate(e,r).apply(this,arguments)};if(process.noDeprecation===!0)return e;var n=!1;return t};var debugs={},debugEnviron;exports.debuglog=function(e){if(isUndefined(debugEnviron)&&(debugEnviron=process.env.NODE_DEBUG||""),e=e.toUpperCase(),!debugs[e])if(new RegExp("\\b"+e+"\\b","i").test(debugEnviron)){var r=process.pid;debugs[e]=function(){var t=exports.format.apply(exports,arguments);console.error("%s %d: %s",e,r,t)}}else debugs[e]=function(){};return debugs[e]},exports.inspect=inspect,inspect.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},inspect.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},exports.isArray=isArray,exports.isBoolean=isBoolean,exports.isNull=isNull,exports.isNullOrUndefined=isNullOrUndefined,exports.isNumber=isNumber,exports.isString=isString,exports.isSymbol=isSymbol,exports.isUndefined=isUndefined,exports.isRegExp=isRegExp,exports.isObject=isObject,exports.isDate=isDate,exports.isError=isError,exports.isFunction=isFunction,exports.isPrimitive=isPrimitive,exports.isBuffer=require("./support/isBuffer");var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];exports.log=function(){console.log("%s - %s",timestamp(),exports.format.apply(exports,arguments))},exports.inherits=require("inherits"),exports._extend=function(e,r){if(!r||!isObject(r))return e;for(var t=Object.keys(r),n=t.length;n--;)e[t[n]]=r[t[n]];return e};

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":253,"_process":201,"inherits":161}],255:[function(require,module,exports){
exports=module.exports=function(r,o){if(r&&o)for(var e in o)r[e]=o[e];return r};

},{}],256:[function(require,module,exports){
"use strict";function append(r,e){if("string"!=typeof r)throw new TypeError("header argument is required");if(!e)throw new TypeError("field argument is required");for(var a=Array.isArray(e)?e:parse(String(e)),t=0;t<a.length;t++)if(separators.test(a[t]))throw new TypeError("field argument contains an invalid header");if("*"===r)return r;var n=r,i=parse(r.toLowerCase());if(-1!==a.indexOf("*")||-1!==i.indexOf("*"))return"*";for(var t=0;t<a.length;t++){var o=a[t].toLowerCase();-1===i.indexOf(o)&&(i.push(o),n=n?n+", "+a[t]:a[t])}return n}function parse(r){return r.trim().split(/ *, */)}function vary(r,e){if(!r||!r.getHeader||!r.setHeader)throw new TypeError("res argument is required");var a=r.getHeader("Vary")||"",t=Array.isArray(a)?a.join(", "):String(a);(a=append(t,e))&&r.setHeader("Vary",a)}module.exports=vary,module.exports.append=append;var separators=/[\(\)<>@,;:\\"\/\[\]\?=\{\}\u0020\u0009]/;

},{}],257:[function(require,module,exports){
function Context(){}var indexOf=require("indexof"),Object_keys=function(e){if(Object.keys)return Object.keys(e);var t=[];for(var r in e)t.push(r);return t},forEach=function(e,t){if(e.forEach)return e.forEach(t);for(var r=0;r<e.length;r++)t(e[r],r,e)},defineProp=function(){try{return Object.defineProperty({},"_",{}),function(e,t,r){Object.defineProperty(e,t,{writable:!0,enumerable:!1,configurable:!0,value:r})}}catch(e){return function(e,t,r){e[t]=r}}}(),globals=["Array","Boolean","Date","Error","EvalError","Function","Infinity","JSON","Math","NaN","Number","Object","RangeError","ReferenceError","RegExp","String","SyntaxError","TypeError","URIError","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","eval","isFinite","isNaN","parseFloat","parseInt","undefined","unescape"];Context.prototype={};var Script=exports.Script=function(e){return this instanceof Script?void(this.code=e):new Script(e)};Script.prototype.runInContext=function(e){if(!(e instanceof Context))throw new TypeError("needs a 'context' argument.");var t=document.createElement("iframe");t.style||(t.style={}),t.style.display="none",document.body.appendChild(t);var r=t.contentWindow,n=r.eval,o=r.execScript;!n&&o&&(o.call(r,"null"),n=r.eval),forEach(Object_keys(e),function(t){r[t]=e[t]}),forEach(globals,function(t){e[t]&&(r[t]=e[t])});var c=Object_keys(r),i=n.call(r,this.code);return forEach(Object_keys(r),function(t){(t in e||-1===indexOf(c,t))&&(e[t]=r[t])}),forEach(globals,function(t){t in e||defineProp(e,t,r[t])}),document.body.removeChild(t),i},Script.prototype.runInThisContext=function(){return eval(this.code)},Script.prototype.runInNewContext=function(e){var t=Script.createContext(e),r=this.runInContext(t);return forEach(Object_keys(t),function(r){e[r]=t[r]}),r},forEach(Object_keys(Script.prototype),function(e){exports[e]=Script[e]=function(t){var r=Script(t);return r[e].apply(r,[].slice.call(arguments,1))}}),exports.createScript=function(e){return exports.Script(e)},exports.createContext=Script.createContext=function(e){var t=new Context;return"object"==typeof e&&forEach(Object_keys(e),function(r){t[r]=e[r]}),t};

},{"indexof":160}],258:[function(require,module,exports){
function extend(){for(var r={},e=0;e<arguments.length;e++){var t=arguments[e];for(var n in t)hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r}module.exports=extend;var hasOwnProperty=Object.prototype.hasOwnProperty;

},{}],259:[function(require,module,exports){
(function (process,__dirname){
"use strict";var express=require("express"),http=require("http"),bodyParser=require("body-parser"),path=require("path"),port=process.env.PORT||8080,app=express(),server=http.createServer(app);app.use(bodyParser.json()),app.use(bodyParser.urlencoded({extended:!1})),app.use(express["static"](path.join(__dirname,"public"))),app.get("/",function(e,r){r.send("wassup dawg")}),server.listen(port,function(){console.log("http server listening on port: ",port)});

}).call(this,require('_process'),"/")
},{"_process":201,"body-parser":20,"express":112,"http":242,"path":197}]},{},[259]);

/*
   mocha -w testbuilddataset.js
*/
console.log('running testbuilddataset');
var assert=require("assert");
var ucs2string=require("../uniutil").ucs2string;
var ucs=function(c){
	if(c)
		return c.match(/^u/)?ucs2string(parseInt(c.substr(1),16)):c;
}
console.log('D=require("../builddataset")');
var D=require("../builddataset");

describe("10 原始檔案 "+D.file,function(){
	it("11 原始字數 59093200",function(){
		assert.deepEqual(D.nChars,59093200);
	});
	it("12 原始列數 407419",function(){
		assert.deepEqual(D.nLines,407419);
	});
	var i1=2;
	it("13 首筆資料 abcabc_sandbox",function(){
		var g=D.getGlyph(D.line[i1]);	
		assert.deepEqual(g.name,"abcabc_sandbox");
		assert.deepEqual(g.related,"u3013");
		assert.deepEqual(g.data,"99:0:0:0:0:163:200:u571f-01:0:0:0$99:0:0:58:0:200:200:u757f:0:0:0");
	});
	var i9=407415;
	it("14 末筆資料 zzzfelis_livermorium",function(){
		var g=D.getGlyph(D.line[i9]);	
		assert.deepEqual(g.name,"zzzfelis_livermorium");
		assert.deepEqual(g.related,"u3013");
		assert.deepEqual(g.data,"1:0:32:138:18:138:57$1:0:0:96:57:179:57$2:7:8:106:72:119:104:123:159$2:0:7:163:74:156:126:144:174$1:0:0:90:174:186:174$2:0:7:58:16:44:59:16:93$2:7:8:57:28:79:39:88:55$1:0:0:37:72:87:72$1:0:0:22:104:92:104$1:32:32:57:72:57:165$2:7:8:24:121:37:135:39:155$2:0:7:83:120:77:136:68:152$2:0:7:20:178:56:170:90:158");
	});
});

describe("20 分區寫出 datasetxxx.txt",function(){
	it("21 資料筆數 407399",function(){
		assert.deepEqual(D.gdata.length,407399);
	//	console.log(D.gdata.length)
		assert.deepEqual(D.gdata[0],"99:0:0:0:0:163:200:u571f-01:0:0:0$99:0:0:58:0:200:200:u757f:0:0:0");
	//	console.log(D.gdata[0]);
		assert.deepEqual(D.keys['abcabc_sandbox'],0);
	//	console.log(D.keys['abcabc_sandbox']);
		assert.deepEqual(D.getData('abcabc_sandbox'),"99:0:0:0:0:163:200:u571f-01:0:0:0$99:0:0:58:0:200:200:u757f:0:0:0");
	//	console.log(D.getData('abcabc_sandbox'));
		assert.deepEqual(D.getData('zzzfelis_livermorium'),"1:0:32:138:18:138:57$1:0:0:96:57:179:57$2:7:8:106:72:119:104:123:159$2:0:7:163:74:156:126:144:174$1:0:0:90:174:186:174$2:0:7:58:16:44:59:16:93$2:7:8:57:28:79:39:88:55$1:0:0:37:72:87:72$1:0:0:22:104:92:104$1:32:32:57:72:57:165$2:7:8:24:121:37:135:39:155$2:0:7:83:120:77:136:68:152$2:0:7:20:178:56:170:90:158");
	//	console.log(D.getData('zzzfelis_livermorium'));
	});
})

describe("30 Unicode 分析",function(){
	it("31 所有中文 unicodesOnly 筆數 80459",function(){
		assert.deepEqual(D.unicodesOnly.length,80459);
	});
	it("32 部件擷取 abcabc_sandbox getComponents u571f-01 u757f",function(){
		assert.deepEqual(D.getComponents("abcabc_sandbox"),["u571f-01","u757f"]);
	});
	it("33 所有組字 components 筆數 79336",function(){
		assert.deepEqual(Object.keys(D.theComponents).length,79336);
	});
	it("34 部件頻次 partsUsedFr u8279-03 "+ucs("u8279-03")+" 3046",function(){
		assert.deepEqual(D.partsUsedFr['u8279-03'],3046);
	});
	it("35 所有部件 partsUsedFr 筆數 21476",function(){
		assert.deepEqual(Object.keys(D.partsUsedFr).length,21476);
	});
	it("36 部件排序 partsSorted 首5筆 u8279-03 艹 u6c35-01 氵 u53e3-01 口 u6728-01 木 u624c-01 扌",function(){
		var s=D.partsSorted.slice(0,5).map(function(u){
			return u+' '+ucs(u);
		}).join(' ');
		assert.deepEqual(s,"u8279-03 艹 u6c35-01 氵 u53e3-01 口 u6728-01 木 u624c-01 扌");
	});
	it("37 外加部件 nonUnicodeParts 筆數 16766",function(){
		assert.deepEqual(D.nonUnicodeParts.length,16766);
	});
})

describe("40 Unicode 擷取",function(){
	it("41 nonUnicodeParts 筆數 16766",function(){
		assert.deepEqual(D.nonUnicodeParts.length,16766);
	});
})
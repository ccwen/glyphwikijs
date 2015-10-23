console.log('loading builddataset');
var fs=require('fs');
var bsearch=require("./bsearch");
var ucs2string=require("./uniutil").ucs2string;
var ucs=function(c){
	if(c)
		return c.match(/^u/)?ucs2string(parseInt(c.substr(1),16)):c;
}
var keys={}, gdata=[];

var getGlyph=function(line){
	var fields=line.split(/\s+\|\s+/);
	return {name:fields[0].trim(), data:fields[2].trim()}
}
var d3=function(n){
	n=n.toString();
	return '00'.substr(0,3-n.length)+n;
}
var getData=function(key){
	//console.log(key)
	var i=keys[key];
//	console.log('keys["'+key+'"]='+i);
//	console.log('gdata['+i+']="'+gdata[i]+'"');
	if(i!==undefined)
		return gdata[i];
}
var file, text, nChars, line, nLines;
file='../dump_newest_only.txt';
console.log('reading '+file)
text=fs.readFileSync(file,'utf8').replace(/@\d+/g,''); ///// unrelated 115858, 59093200-58977342
nChars=text.length;
console.log(nChars+' characters read as input text');
line=text.split(/\r?\n/);
nLines=line.length;
console.log('split text into '+nLines+' lines as line[0] to line['+(nLines-1)+']');
var buildDataset=function(){
	var i1=2,j=0;
	var i9=407415;
	for(var i=i1; i<=i9; i++){
		var L=line[i];
		if(L.match(/undefined$/)) continue;
		var g=getGlyph(L);
		gdata[j]=g.data;
		keys[g.name]=j++;
		if(j%1000===0){
			var k=Math.floor((j-1)/1000), f='dataset'+d3(k)+'.txt';
			k=k*1000;
		//	if(j<10000)
		//		console.log('writing '+f+' '+k+'~'+j+' gdata written');
		//	fs.writeFileSync(f,gdata.slice(k,j).join('\n'))
		}
	}
	var k=Math.floor((j-1)/1000), f='dataset'+d3(k)+'.txt';
	k=k*1000;
//	console.log('writing '+f+' '+k+'~'+j+' gdata written');
//	fs.writeFileSync(f,gdata.slice(k,j).join('\n'));
}
var theComponents={},nComponents=0;
var getComponents=function(unicode){
//	console.log('getComponents("'+unicode+'")');
	var cc=theComponents[unicode];
//	console.log('cc=theComponents["'+unicode+'"]='+cc);
	if(cc)
		return cc;
	var d=getData(unicode);
//	console.log('d=getData("'+unicode+'")="'+d+'"');
	cc=d.match(/:([a-z][^:$]+)(:|\$|$)/g);
//	console.log('cc=d.match(/:(\D+)(\$|$)/g)='+cc);
	if(cc) {
		cc=cc.map(function(c){
			var n=c.match(/[^:$]+/)[0];
			return n;
		});
		theComponents[unicode]=cc;
		nComponents++;
	}
	return cc;
}
var partsUsedFr={};
var partsSorted=[];
var nonUnicodeParts=[];
var unicodesOnly=[];
var pUnicode=/^u[0-9a-f]{4,5}$/;
var checkNonUnicodeParts=function(unicode){
	var cc=getComponents(unicode);
	if(!cc) return
	var nu=[];
	cc.forEach(function(c){
		if(!c)return;
		var fr=partsUsedFr[c]||0
		partsUsedFr[c]=fr;
		if(!fr&&!c.match(pUnicode)){
			// non Unicode Part first used
			nonUnicodeParts.push(c);
		}
		partsUsedFr[c]++;
	})
}
var analyzeUnicodeOnly=function(){
	var names=Object.keys(keys);
	names.forEach(function(name){
		if(name.match(pUnicode)) {
			var code=name.substr(1), u=parseInt(code,16);
			if(u>=0x3400&&u<0x9fe9||u>=0x20000&&u<=0x2cea1){
				// 包括 ExtA u3400~u4dbf, ExtB u20000~u2A6D6, ExtC u2A700~u2B734, ...
				unicodesOnly.push((u<0x10000?'0':'')+code);
				checkNonUnicodeParts(name);
			}
		}
	})
	console.log('Unicode Only 筆數: '+unicodesOnly.length);
	fs.writeFileSync('unicodeOnly.txt', unicodesOnly.sort().join(' '));
	console.log('nonUnicode Parts 筆數: '+nonUnicodeParts.length);
	fs.writeFileSync('nonUnicodeParts.txt', nonUnicodeParts.join(' '));
	var kk=Object.keys(theComponents);
	var cc=kk.map(function(u){
		return u+' '+ucs(u)+' <== '+theComponents[u].map(function(u){
			return u+' '+ucs(u);
		}).join(' ');
	})
	console.log('components 筆數: '+Object.keys(theComponents).length);
	fs.writeFileSync('components.txt', cc.join('\r\n'));
	var list=Object.keys(partsUsedFr);
	console.log('partsUsedFr list: '+list.length);
	partsSorted=list.sort(function(a,b){
		return partsUsedFr[b]-partsUsedFr[a]; // 從大到小排序
	})
	list=partsSorted.map(function(u){
		return u+' '+ucs(u)+' '+partsUsedFr[u];
	})
	fs.writeFileSync('partsSortedFr.txt', list.join('\r\n'));
}
var glyphs=[], glyph={}, gNames=[];
var buildAllGlyphs=function(){
	gNames=unicodesOnly.concat(nonUnicodeParts);
	console.log('gNames',gNames.length);
	gNames=gNames.map(function(g,i){
		if(i<80459){
			g=g.replace(/^0?/,function(m0){
				return 'u';
			})
		}
		glyph[g]=i;
		glyphs[i]=getData(g);
		return g;
	})
	fs.writeFileSync('gNames.js','module.exports='+JSON.stringify(gNames));
	fs.writeFileSync('glyphs.js','module.exports='+JSON.stringify(glyphs));
	fs.writeFileSync('glyph.js','module.exports='+JSON.stringify(glyph));
}
console.log('buildDataset');
buildDataset();
console.log('analyzeUnicodeOnly');
analyzeUnicodeOnly();
console.log('buildAllGlyphs');
buildAllGlyphs();
module.exports={
	file: file,
	text: text,
	nChars: nChars,
	line: line,
	nLines: nLines,
	gdata: gdata,
	keys: keys,
	partsUsedFr: partsUsedFr,
	partsSorted: partsSorted,
	unicodesOnly: unicodesOnly,
	nonUnicodeParts: nonUnicodeParts,
	theComponents: theComponents,
	gNames: gNames,
	glyphs: glyphs,
	glyph: glyph,
	ucs: ucs,
	getData: getData,
	getGlyph: getGlyph,
	getComponents: getComponents
};

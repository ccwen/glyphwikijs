var fs=require('fs');
var keys={}, gdata=[];

var getGlyph=function(line){
	var fields=line.split(/\s+\|\s+/);
	var name=fields[0].trim();
	var related=fields[1];
	var data=fields[2].trim();
	return {name:name, related:related, data:data}
}
var d3=function(n){
	n=n.toString();
	return '00'.substr(0,3-n.length)+n;
}
var getData=function(key){
	//console.log(key)
	var i=keys[key];
	console.log('keys["'+key+'"]='+i);
	console.log('gdata['+i+']="'+gdata[i]+'"');
	if(i!==undefined)
		return gdata[i];
}

var builddataset=function(){
	var i1=2,j=0;
	var i9=407415;
	var lines=fs.readFileSync('dump_newest_only.txt','utf8').split(/\r?\n/);
	for(var i=i1; i<=i9; i++){
		var g=getGlyph(lines[i]);
		gdata[j]=g.data;
		keys[g.name]=j++;
		if(j%1000===0){
			var k=Math.floor((j-1)/1000), f='dataset'+d3(k)+'.txt';
			k=k*1000;
			console.log(f+' '+k+'~'+j+' gdata written');
		}
	}
	var k=Math.floor((j-1)/1000), f='dataset'+d3(k)+'.txt';
	k=k*1000;
	console.log(f+' '+k+'~'+j+' gdata written');
	fs.writeFileSync(f,gdata.slice(k,j).join('\n'));	
}
module.exports={build:builddataset,getData:getData,gdata:gdata,getGlyph:getGlyph,keys:keys};

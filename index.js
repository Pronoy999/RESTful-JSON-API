const http=require('http');
const url=require('url');
var handler={};
handler.notFound=function(data,callback){
    callback(404);
};
handler.hello=function(data,callback){
    callback(200,{'Data':data});
};
var router={
    'hello':handler.hello
};
var httpServer=http.createServer(function(req,res){
    var parsedUrl=url.parse(req.url,true);
    var path=parsedUrl.pathname;
    var trimmedPath=path.replace(/^\/+|\/+$/g, '');
    req.on('data',function(){
        console.log('Getting data');
    });
    req.on('end',function(){
        var chosenHandler=typeof(router[trimmedPath])!=='undefined'? router[trimmedPath]: handler.notFound;
        var data={
            'msg':'Welcome to my API.'
        }
        chosenHandler(data,function(statusCode,payload){
            statusCode=typeof(statusCode)=='number'?statusCode:404;
            payload=typeof(payload)=='object'?payload:{};
            res.setHeader('Content-Type','application/json');
            var responseObject=JSON.stringify(payload);
            res.writeHead(statusCode);
            res.end(responseObject);
        })
    });
});
httpServer.listen(7000,function(){
    console.log('Server up and Running on 7000');
});
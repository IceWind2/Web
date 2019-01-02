const lotCount = 2;
var restify = require('restify');
let curId = 1;
let lotData = loadData(curId);
let curTime = lotData.lotTime;
let curPrice = lotData.startingPrice;
let cnt =0;


function loadData(id) {
    if (id > lotCount) {
        return null;
    }
    return require('C:/Projects/Web/server/files/lot' + id + '.json');
}

//                        restify server
//------------------------------------------------------------------------
const server = restify.createServer();



server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.post('/api/:func', function (req, res, next) {
    if (lotData == null) {
        res.send({'data':null, 'time':curTime, 'price':curPrice});
    }
    else {
        const str = req.params.func;
        console.log(cnt, str);
        cnt++;
        if (str == 'raise') {
            updatePrice();
        }
        else if (str == 'load') {
            res.send({'data': lotData, 'time': curTime, 'price': curPrice});
        }
    }
    next();
});

server.get("/*", restify.plugins.serveStatic({
    directory: 'C:/Projects/Web/client',
    default: 'index.html'
}));

server.listen(8080, function() {
    console.log('%s listening at %s %s', server.name, server.url, __dirname);
});

//------------------------------------------------------------------------


//                          pusher
//------------------------------------------------------------------------
var Pusher = require('pusher');

var pusher = new Pusher({
    appId: '610722',
    key: '38ecf7a6ace49c5cc386',
    secret: 'd1ff38b7728088313cde',
    cluster: 'eu',
    encrypted: true
});

function updatePrice() {
    curPrice += lotData.priceStep;
    curTime = lotData.lotTime;
    pusher.trigger("my-channel", "betRaised", {'price':curPrice,'time':curTime});
}

//------------------------------------------------------------------------



//                       timer
//------------------------------------------------------------------------
Timer();

function Timer() {
    if (curTime == 0) {
        curId++;
        lotData = loadData(curId);
        if (lotData != null) {
            curTime = lotData.lotTime;
            curPrice = lotData.startingPrice;
        }
    }
    curTime -= 1;
}

setInterval(Timer, 1000);
//------------------------------------------------------------------------



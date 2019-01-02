let isOnline = false;
Pusher.logToConsole = true;

//                          Initialisation
//------------------------------------------------------------------------
getLot();

function  getLot() {
    $.post("http://localhost:8080/api/load", onSuccess);

    function onSuccess(res) {
        if (res['data'] == null) {
            setDefault();
            return;
        }
        lotdata = res['data'];
        document.getElementById("lotName").innerHTML = lotdata.lotName;
        document.getElementById("lotDescription").innerHTML = lotdata.lotDescription;
        document.getElementById("price").innerHTML = res['price'] + " $";
        document.getElementById("picture").innerHTML = "<img src=\"" + lotdata.picture + "\" alt='" + lotdata.lotName + "'>";
        document.getElementById("timer").innerHTML = format(~~(res['time'] / 60)) + ":" + format(res['time'] % 60);
        isOnline = true;
        document.getElementById("price button").disabled = false;
    }
}
//------------------------------------------------------------------------




//                        Pusher
//------------------------------------------------------------------------
var pusher = new Pusher('38ecf7a6ace49c5cc386', {
    cluster: 'eu',
    forceTLS: true
});

var channel = pusher.subscribe('my-channel');
channel.bind('betRaised', function (res) {
    document.getElementById("price").innerHTML = res['price'] + " $";
    document.getElementById("timer").innerHTML = format(~~(res['time'] / 60)) + ":" + format(res['time'] % 60);
});
//------------------------------------------------------------------------





//                         Buttons
//------------------------------------------------------------------------
const priceButton = document.getElementById("price button");
const nextButton = document.getElementById("next button");

Rx.Observable.fromEvent(priceButton, 'click').subscribe(() => {
    console.log('11');
    $.post("http://localhost:8080/api/raise");
    console.log('22');
});

Rx.Observable.fromEvent(nextButton, 'click').subscribe(() => {
    getLot();
    document.getElementById("next button").hidden = true;
});
//------------------------------------------------------------------------




//                           Timer
//------------------------------------------------------------------------

if (isOnline) startTimer();

function startTimer(){
    if (!isOnline) {
        return;
    }
    let currentTime = document.getElementById("timer").innerHTML.split(':');
    let minutes = Number.parseInt(currentTime[0]);
    let seconds = Number.parseInt(currentTime[1]);
    if (minutes == 0 && seconds == 0) {
        alert("Sold for " + document.getElementById("price").innerHTML);
        document.getElementById("next button").hidden = false;
        document.getElementById("price button").disabled = true;
        isOnline = false;
        return;
    }
    if (seconds == 0) {
        minutes -= 1;
        seconds = 60;
    }
    seconds -= 1;
    document.getElementById("timer").innerHTML = format(minutes) + ":" + format(seconds);
}

setInterval(startTimer, 1000);

function format(time){
    if(Number.parseInt(time) < 10) return "0" + time;
    else return time;
}
//------------------------------------------------------------------------

function setDefault() {
    document.getElementById("lotName").innerHTML = 'Auction';
    document.getElementById("lotDescription").innerHTML = 'Auction is currently offline.';
    document.getElementById("price").innerHTML = "0 $";
    document.getElementById("picture").innerHTML = "<img src=\"https://www.porthlevenfoodfestival.com/wp-content/uploads/2017/02/auction.jpg\">";
    document.getElementById("timer").innerHTML = '00:00';
    isOnline = false;
    document.getElementById("price button").disabled = true;
}
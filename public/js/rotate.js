var remainingDuration = 0;
if (currentView) {
    remainingDuration = currentView.duration;
}
var tId = setInterval(checkForNewView, 10000);

function checkForNewView() {
    //update remaining duration
    remainingDuration = remainingDuration - 10000 / 1000;
    
    if (remainingDuration <= 0) {
        checkForNextView();
    } else {
        //standard check for emergency
        var emergencyUrl = '/broadcasts/' + currentView.channelCode + '/emergency';
        $.get(emergencyUrl, function(data) {
            if (!data && currentView.priority == 0) {
                checkForNextView();
            } else if (data && data.url != currentView.url) {
                swapView(data);
                resetTimer(10000);
            }
        });
    }
};

function checkForNextView() {
    //call the next view url
    var nextUrl = '/broadcasts/' + currentView.channelCode + '/' + currentView.priority + '/next';
    $.get(nextUrl, function(data) {
        if (!data) {
            alert("error retrieving view");
            return;
        }
        swapView(data);
        resetTimer(10000);
    });
}

function swapView(newView) {
    currentView = newView;
    $('#frameContent')[0].src = currentView.url;
    remainingDuration = currentView.duration;
};

function resetTimer(interval) {
    abortTimer();
    tId = setInterval(checkForNewView, interval);
};

function abortTimer() {
    clearTimeout(tId);
};
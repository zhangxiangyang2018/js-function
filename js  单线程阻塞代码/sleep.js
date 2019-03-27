function sleep(milliSeconds){
    var startTime = new Date().getTime(); // get the current time    
    while (new Date().getTime() < startTime + milliSeconds);
}
console.log('start...');
sleep(3000);
console.log('end...');

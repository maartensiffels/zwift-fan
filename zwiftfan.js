var ZwiftAccount = require("zwift-mobile-api"); // load Zwift api library

// Choose the mode you want to use ->  1 = speed, 2 = power, 3 = heart  rate
var mode = 1;

// Add your Zwift credentials and ID
var account = new ZwiftAccount("username", "password"); // put Zwift credentials between " " 
var riderID = "12345" ;  // put riderID between " " 

// Add your Particle deviceID and accessToken
var deviceID = "yourDeviceIdGoesHere" ; // put deviceID between " " 
var accessToken =  "yourAccessTokenGoesHere" // put accessToken between " " 

// Speed settings
var speed1 = 0 ; // speed in km/hour above wich fan goes to speed 1 (make this -1 to have the fan always turn, even when your speed is zero, nice for cooling down)
var speed2 = 25 ; // speed in km/hour above wich fan goes to speed 2
var speed3 = 50 ; // speed in km/hour above wich fan goes to speed 3

// Power settings -> function in beta
var power1 = 0 ; // power in watt above wich fan goes to speed 1 (make this -1 to have the fan always turn, even when your not cycling, nice for cooling down)
var power2 = 150 ; // power in watt above wich fan goes to speed 2
var power3 = 225 ; // power in watt above wich fan goes to speed 3

// heartRate setings -> function in beta
var heartRate1 = 0 ; // heartRate in bpm above wich fan goes to speed 1 (make this -1 to have the fan always turn, even when your heart rate monitor fails)
var heartRate2 = 150 ; // heartRate in bpm above wich fan goes to speed 2
var heartRate3 = 165 ; // heartRate in bpm above wich fan goes to speed 3

// END OF SETTINGS YOU CAN / NEED TO EDIT !!

var request = require('request'); // load api library
var world = account.getWorld(1); // get Zwift world data

// set all relays to the off position
request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r1,LOW'}})
request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r2,LOW'}})
request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r3,LOW'}})
request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r4,LOW'}})

function refreshData()
{
    x = 1; // run the script every x second(s)

world.riderStatus(riderID).then(status => {
// print Zwift metrics to the console/terminal

console.log("#zwiftfan#");
// console.log(status); // JSON of rider status (uncomment to write all data zwift generates on a rider in the terminal)
console.log("speed: "+status.riderStatus.speed); 
console.log("power: "+status.riderStatus.power); 
console.log("heart: "+status.riderStatus.heartrate);
console.log(" ");

// evaluate the speed and switch the right relay
if ((status.riderStatus.speed == (speed1*1000000) && mode == 1) || (status.riderStatus.power == power1 && mode == 2)  || (status.riderStatus.heartRate == heartRate1 && mode == 3)) { 
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r1,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r2,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r3,LOW'}}) ;
	}

if ((status.riderStatus.speed > ((speed1*1000000) && status.riderStatus.speed <= (speed2*1000000)) && mode == 1) || ((status.riderStatus.power > power1 && status.riderStatus.power <= power2  && mode == 2)) || ((status.riderStatus.heartRate > heartRate1 && status.riderStatus.heartRate <= heartRate2) && mode == 3)) { 
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r1,HIGH'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r2,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r3,LOW'}}) ;
	}
	
if ((status.riderStatus.speed > ((speed2*1000000) && status.riderStatus.speed <= (speed3*1000000)) && mode == 1) || ((status.riderStatus.power > power2 && status.riderStatus.power <= power3 && mode == 2)) || ((status.riderStatus.heartRate > heartRate2 && status.riderStatus.heartRate <= heartRate3) && mode == 3)) { 
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r1,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r2,HIGH'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r3,LOW'}}) ;
	}

if ((status.riderStatus.speed > (speed3*1000000) && mode == 1) || (status.riderStatus.power > power3 && mode == 2)  || (status.riderStatus.heartRate > heartRate3 && mode == 3)) { 
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r1,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r2,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r3,HIGH'}}) ;
	}
});

   setTimeout(refreshData, x*1000);
}

refreshData(); // execute function
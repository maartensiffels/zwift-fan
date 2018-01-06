var ZwiftAccount = require("zwift-mobile-api"); // don't edit this line

// settings you HAVE to edit are below this line //
var account = new ZwiftAccount("username", "password"); // put in your Zwift credentials between " " 
var riderID = "12345" ;  // put your Zwift ID between " " 
var deviceID = "yourDeviceIdGoesHere" ; // between " " 
var accessToken =  "yourAccessTokenGoesHere" // between " " 
// end of settings you HAVE to edit // 

// settings you CAN edit are below this line //
var speed1 = -1 ; // speed in km/hour above wich fan goes to speed 1, default is 0 but make this -1 to have the fan always turn, even when your speed is zero
var speed2 = 25 ; // speed in km/hour above wich fan goes to speed 2, default is 25
var speed3 = 50 ; // speed in km/hour above wich fan goes to speed 3, default is 50
// end of settings you CAN edit //

var request = require('request');  
var world = account.getWorld(1);  

request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r1,LOW'}})
request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r2,LOW'}})
request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r3,LOW'}})
request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r4,LOW'}})

function refreshData()
{
    x = 1;  //  run every x seconds 

world.riderStatus(riderID).then(status => {
console.log(status.riderStatus.speed); 

if (status.riderStatus.speed == (speed1*1000000)) { 
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r1,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r2,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r3,LOW'}}) ;
	}
	if (status.riderStatus.speed > (speed1*1000000) && status.riderStatus.speed <= (speed2*1000000)) { 
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r1,HIGH'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r2,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r3,LOW'}}) ;
	}
	if (status.riderStatus.speed > (speed2*1000000) && status.riderStatus.speed <= (speed3*1000000) ) { 
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r1,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r2,HIGH'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r3,LOW'}}) ;
	}
	if (status.riderStatus.speed > (speed3*1000000)) { 
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r1,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r2,LOW'}}) ;
	request.post('https://api.particle.io/v1/devices/'+deviceID+'/relay?access_token='+accessToken, {form:{params:'r3,HIGH'}}) ;
	}
});

   setTimeout(refreshData, x*1000);
}
refreshData(); // execute function
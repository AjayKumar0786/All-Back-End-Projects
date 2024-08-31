// intitialize the socket
const socket = io();

//ask for your current location
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        //extract the latitude and longitude
      const{latitude,longitude}= position.coords;
      // emit the location to backend 
      socket.emit("send-location",{latitude,longitude});
    },(error)=>{
        console.log(error)
    },
{
    // set some options for it
    enableHighAccuracy:true,
    timeout:5000,
    maximumAge:0
})
}

//L.map for initializte the map and browser ask for your location and setView is basically ask the langitude and latitude and the 10 is the zoom 
// here initialize the map
const map = L.map("map").setView([0,0],16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap"
}).addTo(map);

//create a markeres object inside which simply we show the markers id inside in
const markers = {};
//recevee the location to broadcast to everyone
socket.on("receive-location",(data)=>{
    const{id,latitude,longitude} = data;
    //set the latitude and longitude
    map.setView([latitude,longitude]);
   //check if markse id is already exists then update the latitude and longitude
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        //else make new one
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})
// now if user disconnected than simply remove the marker from the map
socket.on("user-disconnected", (id)=>{
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
})
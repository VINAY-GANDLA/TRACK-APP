const socket = io();
const username = prompt("Enter Your Name:");

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude,longitude } = position.coords;
        socket.emit("send-location", { long:longitude, lat:latitude });
    },
        (error) => console.error(error),
        {
            enableHighAccuracy: true,
            timeout: 4000,
            maximumAge:0
    })
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: `vinays Map`
}).addTo(map);

const markers = {};
socket.on("receive-location", (res) => {
    const { id, long, lat } = res;  
    map.setView([lat, long],10);
    // const marker = L.marker([lat, long]).addTo(map).bindPopup(`${username}`).openPopup();
    if (markers[id]) {
        markers[id].setLatLng([lat, long]);
    }
    else {
        markers[id] = L.marker([lat, long]).addTo(map).bindPopup(`${username}`).openPopup();
    }
});

socket.on('user-disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
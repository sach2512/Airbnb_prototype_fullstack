

let maptoken= Token
mapboxgl.accessToken =maptoken
console.log(maptoken);

const map = new mapboxgl.Map({
container: 'map', // container ID
center: coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});
const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates)//listing.geometry.coordinates
        .addTo(map);

        const popup = new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
        .setLngLat(e.lngLat)
        .setHTML("<h1> exact location will be shared on booking</h1>")
        .setMaxWidth("300px")
        .addTo(map);
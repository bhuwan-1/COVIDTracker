mapboxgl.accessToken = 'pk.eyJ1IjoiamlnbWUiLCJhIjoiY2tjOTM5a3EzMWhkMjJ5bWc0ZjRrazA4NyJ9.7gVQ-PWLYFWm7RSNcqj0gg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: [0, 0], // starting position [lng, lat]
    minZoom: 1.2,
    zoom: 1,
    attributionControl: false // starting zoom
});

  var nav = new mapboxgl.NavigationControl({
    visualizePitch: true
  });
map.addControl(nav, 'top-left');

let url = "https://corona.lmao.ninja/v2/countries?&sort"; //API Endpoints


async function fetchCoronaData() {
    try {
        let response = await fetch(url);
        let json = await response.json();
        return json;
    } catch (error) {
        console.log('There is an error while catching the data');
    }
}
fetchCoronaData().then(result => {
    console.log(result); //Debugging 
    result.forEach(res => {
        const {cases,active,country,population,deaths,todayCases,todayDeaths,recovered,critical,casesPerOneMillion,deathsPerOneMillion,tests} = res;
        let latitude = res.countryInfo.lat;
        let longitude = res.countryInfo.long;
        let flag = res.countryInfo.flag;

        
        var geojson = { 
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
              },
              properties: {
                title: country,
                description: `<br><img src="${flag}"> <br>Total Cases: ${cases} <br> active cases: ${active}<br>`,
              }
            }]
          };
        
        geojson.features.forEach(marker =>{
            var el = document.createElement('div');
            el.className = 'marker';
            
        if(cases > 50000){
            el.style.backgroundColor = '#ff006f9f';
            el.style.border = '#ff006e'
        };
            new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ 
                offset: 25,
                maxWidth: 200,
                maxHeight:200
            })
            .setHTML('<h2>' + marker.properties.title + '</h2> <h3>' + marker.properties.description + '</h3>'))
            .addTo(map);
        })
        //table
        let table = document.querySelector('.country-data');
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);
        var cell10 = row.insertCell(9);
        var cell11 = row.insertCell(10);
        var cell12 = row.insertCell(11);

        cell1.innerHTML = country;
        cell2.innerHTML = population;
        cell3.innerHTML = cases;
        cell4.innerHTML = active;
        cell6.innerHTML = deaths;
        cell5.innerHTML = "+"+todayCases;
        cell7.innerHTML = "+"+todayDeaths;
        cell9.innerHTML = recovered;
        cell8.innerHTML = critical;
        cell10.innerHTML = casesPerOneMillion;
        cell11.innerHTML = deathsPerOneMillion;
        cell12.innerHTML = tests;
        
        if(cell7.innerHTML != "+0"){
          cell7.style.backgroundColor = 'rgb(223, 65, 91)';
        }
        if(cell5.innerHTML != "+0"){
          cell5.style.backgroundColor = 'rgb(89, 235, 89)';
        }
    });  
});

let theme = document.querySelector("#theme");


function change(style){
  theme.href = style;
  localStorage.setItem('theme', style);
}
let getTheme = localStorage.getItem('theme');

//Local Storage (similar to cookies)
if(getTheme === null){
  change('style.css');
}else{
  change(getTheme);
}

Template.map.rendered = function () {

  var map

  window.addEventListener("deviceorientation", handleOrientation, true)

  function handleOrientation(event) {
    var degrees = event.alpha
    map.setBearing(degrees)
  }

  mapboxgl.util.getJSON('https://www.mapbox.com/mapbox-gl-styles/styles/outdoors-v7.json', function (err, style) {
    if (err) throw err

    mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGllbGtva2VlIiwiYSI6Ilk5QUppQXMifQ.A-pV1_4Mx4p_o94_QYGM6Q'

    map = new mapboxgl.Map({
      container: 'map',
      style: style,
      center: [52, 5],
      zoom: 6,
      hash: true
    })

    map.on('style.load', function() {
      var query = Locations.find()

      query.observe({
        added: function (location) {

          var geojson = EJSON.parse(location.geojson)

          if (geojson) {

            map.addSource(location._id, {
              "type": "geojson",
              "data": geojson
            })

            map.addLayer({
              "id": location._id,
              "type": "symbol",
              "interactive": true,
              "source": location._id,
              "layout": {
                "line-join": "round",
                "line-cap": "round",
                "icon-image": "heart-12",
                "text-field": location.title,
                "text-font": "Open Sans Semibold, Arial Unicode MS Bold",
                "text-offset": [0, 0.6],
                "text-anchor": "top"
              },
              "paint": {
                "line-color": "#888",
                "line-width": 8,
                "text-size": 12,
              }
            })
          }
        }
      })
    })

    map.on('click', function(e) {
        map.featuresAt(e.point, {radius: 20}, function(err, features) {
            if (err) throw err
            if (features[0] && features[0].layer.id) {
              Router.go('/locations/' + features[0].layer.id)
            }
        })
    })
  })
}

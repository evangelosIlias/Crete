
var map;

function initMap() {

  // Point Style//

  const fillStyle = new ol.style.Fill({
    color: [84, 118, 255, 1]
  })

  // Lines Style //

  const lineStyle = new ol.style.Stroke({
    color: [33, 119, 222, 1],
    width: 3,
    lineCap: 'round',
    lineJoin: 'bevel',
    lineDash: [4, 6]
  })

    // Points Style //
    // This is a regular coloured style for points if required in the future
    // const regularShape = new ol.style.RegularShape({
    // fill: new ol.style.Fill({
    // color: [252, 57, 15, 1]
    // }),
    // points: 3, 
    // radius: 15  
    // })

   // Points Style with images//

  const iconCitiesStyle = new ol.style.Icon({
    src: './images/cities.png',
    size: [100, 100],
    offset: [0, 0],
    opacity: 0.9,
    scale: 0.4,
  })

  const iconAmenitiesStyle = new ol.style.Icon({
    src: './images/amenities.png',
    size: [100, 100],
    offset: [0, 0],
    opacity: 1,
    scale: 0.3
  })

  const iconBathing_water_quality = new ol.style.Icon({
    src: './images/swim.png',
    size: [100, 100],
    offset: [0, 0],
    opacity: 1,
    scale: 0.3
  })

  const iconAirports = new ol.style.Icon({
    src: './images/airports.png',
    size: [100, 100],
    offset: [0, 0],
    opacity: 1,
    scale: 0.35
  })
    
  // Cities Vector Points //

  const cities = new ol.layer.VectorImage({
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
          url: 'data/cities.geojson'
        }),
        visible: false,
        title: 'Cities',
        style: new ol.style.Style({
        image: iconCitiesStyle
        })
        });

  // Airports Vector Points //     
  
  const airports = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
        url: 'data/airports.geojson'
      }),
      visible: false,
      title: 'Airports',
      style: new ol.style.Style({
      image: iconAirports
      })
      });

  // Amenities Vector Points //
  
  const amenities = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
        url: 'data/amenities.geojson'
    }),
    visible: false,
    title: 'Amenities',
    style: new ol.style.Style({
    image: iconAmenitiesStyle,
    })
  });

  // Bathing water quality Vector Points //

  const bathing_water_quality = new ol.layer.VectorImage({
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
          url: 'data/bathing_water_quality.geojson'
      }),
      visible: false,
      title: 'Swimming Areas',
      style: new ol.style.Style({
      image: iconBathing_water_quality 
      })    
  });

  // Rivers Vector Lines //

  const rivers = new ol.layer.VectorImage({
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
          url: 'data/rivers.geojson'
    }),
    visible: false,
    title: 'Rivers',
    style: new ol.style.Style({
    stroke: lineStyle  
    })
  })

  // Boundaries Vector Polygons //

  const boundaries = new ol.layer.VectorImage({
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
          url: 'data/boundaries.geojson'
    }),
    visible: false,
    title: 'Boundaries',
  })

  // Open Street Map //

  const osm = new ol.layer.Tile({
       source: new ol.source.OSM(),
        title: 'Open Street Map',
        type: 'base',
        visible: false
        });

   // Humanitarian Steet Map //
   
  const Humanitarian = new ol.layer.Tile({
     source: new ol.source.OSM({
      url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
     }),
     title: 'Humanitarian',
     type: 'base'
    });

   // CartoDB Base Map //

  const cartoDBBaseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
    url: 'https://{1-4}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{scale}.png'
    }),
    title: 'CartoDB',
    type: 'base',
    visible: true,
    });
   
  // Bing Map Layer //
        
  //Bing_aerial= new ol.layer.Tile({
    //  source: new ol.source.BingMaps({
      //  key: 'AooSh7y-RVPWnOcID-MVAAzubSIoGkAIPIkvupFAZE6ORlPoggYNgNIfD2kufGIh',
       // imagerySet: 'AerialWithLabels'
        //  }),
        // title: 'Bing Aerial',
        //type: 'base'
         // });         
  
  // My view //        
          
  myview = new ol.View({
    center: ol.proj.fromLonLat([25.144, 35.338], "EPSG:3857", "EPSG:2100",),
    zoom: 7,
    projection: ('EPSG:2100', 'EPSG:3857'),
    });
 
  // Map Control //

  map = new ol.Map({
    target: 'mymap',
    keyboardEventTarget: document,
    layers:[osm, Humanitarian, cartoDBBaseLayer, cities, airports, amenities, bathing_water_quality, rivers, boundaries],
    view: myview,
    controls:[
        new ol.control.Zoom(),
        new ol.control.ZoomSlider(),
        new ol.control.ScaleLine(),
        new ol.control.LayerSwitcher(),
        new ol.control.FullScreen(),
        new ol.control.ZoomToExtent()
      ]});
    
    // Vector Feature Pop up Message //

      const overlayContainerElement = document.querySelector('.overlay-container');
      const overlayLayer = new ol.Overlay({
        element: overlayContainerElement
      })
      map.addOverlay(overlayLayer);
      const overlayFeatureTitle = document.getElementById('Points');
    
      map.on ('click', function(e){
        overlayLayer.setPosition(undefined);
          map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            let clickedCoordinate = e.coordinate;
            overlayLayer.setPosition(clickedCoordinate);
            if (feature.get('NAME') !== undefined){
              overlayFeatureTitle.innerHTML = feature.get('NAME');
              }
            else if (feature.get('type') !== undefined){
              overlayFeatureTitle.innerHTML = feature.get('type');
              }
            else if (feature.get('coast_name') !== undefined){
              overlayFeatureTitle.innerHTML = feature.get('coast_name');
              }
            else if (feature.get('altname1') !== undefined){
              overlayFeatureTitle.innerHTML = feature.get('altname1');
              }
            else if (feature.get('NAME_LATIN') !== undefined){
              overlayFeatureTitle.innerHTML = feature.get('NAME_LATIN');
              }
            else {
              overlayFeatureTitle.innerHTML = feature.get('Name');
              }},
              {
            layerFilter: function(layerCanditate){
            return layerCanditate.get('title')
            },
            })})  
         
    // Map interaction by default
    const selectInteraction = new ol.interaction.Select();
      map.addInteraction(selectInteraction);
}
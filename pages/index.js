import React, { useState, useRef, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGL, { Marker } from 'react-map-gl';
import Head from 'next/head';
import ChartComponent from "/components/graph";
import styles from '../styles/home.module.css';
import { setSensor, getSensor,  setLocation, getLocation, setTimestamp1,  setTimestamp2 } from './api/updateChoices';
import { getLocations } from "../components/locations";

export default function Home() {
  const [activeTab, setActiveTab] = useState('map');
  const [activeSensor, setActiveSensor] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [leftWidth, setLeftWidth] = useState(85);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [locations, setLocations] = useState([]);
  const [viewport, setViewport] = useState({latitude: 52.001849897641435, longitude: 4.367876594409242, zoom: 19, width: '100%', height: '100vh'});
  const [dateTime1, setDateTime1] = useState(() => {
    const now = new Date();
    now.setMonth(now.getMonth() - 2);
    const isoString = now.toISOString().replace("T", "^").split(".")[0]; 
    return isoString;
  });
  const [dateTime2, setDateTime2] = useState(() => {
    const now = new Date();
    return now.toISOString().replace("T", "^").split(".")[0]; 
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSensorClick = (sensor) => {
    setSensor(sensor);
    setActiveSensor(sensor);
  };
  const handleLocationClick = (location) => {
    setLocation(location);
  }
  const handleMouseDown = () => {
    isDraggingRef.current = true;
    document.body.style.userSelect = 'none';
  };
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.body.style.userSelect = '';
  };
  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newLeftWidth >= 15 && newLeftWidth <= 85) {
      setLeftWidth(newLeftWidth);
    }
  };
  const handleDateTimeChange1 = (e) => {
    const value = e.target.value;
    const formattedValue = value.replace("T", "^"); 
    setTimestamp1(formattedValue);
  };
  const handleDateTimeChange2 = (e) => {
    const value = e.target.value;
    const formattedValue = value.replace("T", "^"); 
    setTimestamp2(formattedValue);
  };
  const refreshChart = () => {
    setRefreshKey((prevKey) => prevKey + 1); 
  };
  
  useEffect(() => {
    setActiveSensor(getSensor());
    setLocation(getLocation());
    setDateTime1(setTimestamp1(dateTime1));
    setDateTime2(setTimestamp2(dateTime2));
    async function fetchLocations() {
      try {
        const fetchedLocations = await getLocations();
        setLocations(fetchedLocations); 
      } 
      catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchLocations();    
  }, []);

  return (
    <>
    <Head>
        <title>Pioneerbot</title>
        <meta name="description" content="Welcome to the Pioneerbot homepage!" />
        <link rel="shortcut icon" href="turtlebot.png" type="image/png" />
    </Head>
    
    <main>
    <div  className={styles.container} style={{ height: '100vh', display: 'flex', flexDirection: 'column' }} 
    ref={containerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} >
      <div style={{ display: 'flex', height: '100%'}}>
        <div className={styles.leftPanel}  style={{ width: `${leftWidth}%`, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <button onClick={() => setActiveTab('map')} className={`${styles.buttonLeftPanel} ${activeTab === 'map' ? styles.activeTab : ''}`} >Map</button>
            <button onClick={() => setActiveTab('turtlebot')}  className={`${styles.buttonLeftPanel} ${activeTab === 'turtlebot' ? styles.activeTab : ''}`}  >TurtleBot</button>
          </div>

          {activeTab === 'map' && (
            <div style={{ width: '100%', height: '100%' }}>
              <ReactMapGL
                {...viewport} mapStyle="mapbox://styles/mapbox/satellite-v9" mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} 
                onMove={(evt) => setViewport(evt.viewState)} style={{ width: '100%', height: '100%' }} >
                {locations.map((location, index) => ( <Marker key={index} latitude={location.latitude} longitude={location.longitude}> 
                  <img src={selectedMarker === index ? "/selected-marker.svg" : "/marker.svg"} style={{ width: '25px', height: '25px', cursor: 'pointer', transform: 'translateY(-50%)' }} 
                  onClick={() => { setSelectedMarker(selectedMarker === index ? null : index); handleLocationClick(location.id); refreshChart(); }}/></Marker>))}
              </ReactMapGL>
            </div>
          )}

          {activeTab === 'turtlebot' && ( 
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>TurtleBot information</h1>
              <p>Place your content here, e.g. Nav2 module or anything else. </p>
            </div>
            
          )}
        </div>

        <div className={styles.divider} onMouseDown={handleMouseDown} />

        <div className={styles.rightPanel} style={{ width: `${100 - leftWidth}%`, height: '100vh' }}>
          <h2 style={{ display: 'flex', justifyContent: 'space-evenly' }}>Datavisualisation</h2>
          {selectedMarker == null && (
            <div className={styles.graphContainer}> <p>Select a pin to view data. </p> </div>
          )}
          {selectedMarker !== null && (
            <div className={styles.graphContainer}>
              <p>Select a sensor and a timerange to view corresponding data.</p>
              <div>
              <button onClick={() => { handleSensorClick('temperature'); refreshChart(); }}  className={`${styles.button} ${styles.temperature} ${ activeSensor === 'temperature' ? styles['active-temperature'] : '' }`} > Temperature </button>
              <button onClick={() => { handleSensorClick('humidity'); refreshChart(); }} className={`${styles.button} ${styles.humidity} ${ activeSensor === 'humidity' ? styles['active-humidity'] : '' }`} > Humidity </button>
              <button onClick={() => { handleSensorClick('light_intensity'); refreshChart(); }}  className={`${styles.button} ${styles.light_intensity} ${ activeSensor === 'light_intensity' ? styles['active-light_intensity'] : '' }`} > Light Intensity </button>
              <button onClick={() => { handleSensorClick('co2'); refreshChart(); }}  className={`${styles.button} ${styles.co2} ${ activeSensor === 'co2' ? styles['active-co2'] : '' }`} > CO2  </button>
                <div className={styles.nobreaker}>
                  <label className={styles.labelleft} > Starttijd: </label>
                  <input className={styles.datetime} type="datetime-local" id="datetime1"  onChange={(e) => { handleDateTimeChange1(e); refreshChart(); }} />
                </div>
                <div className={styles.nobreaker}>
                  <label className={styles.labelleft} > Eindtijd: </label>
                  <input className={styles.datetime} type="datetime-local" id="datetime2" onChange={(e) => { handleDateTimeChange2(e); refreshChart(); }} />
                </div>
              </div> 
              <ChartComponent key={refreshKey}/> 
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.iconContainer}><a href="https://youtu.be/dQw4w9WgXcQ?si=FwJG3ld_9r2V9mx2" target="_blank" rel="noopener noreferrer"><img src="/goose.png" alt="Goose"/></a></div>
    </div>
  
  </main>
  </>
  );
}
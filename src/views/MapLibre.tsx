import React from 'react';
import MapLibreComponent from '../components/Maps/MapLibreComponent';

const MapLibreView = () => {

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex'
        }}>
            <MapLibreComponent />
        </div>
    );
}

export default MapLibreView;
import React from 'react';
import DeckComponent from '../components/Maps/DeckComponent';

const DeckView = () => {

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex'
        }}>
            <DeckComponent />
        </div>
    );
}

export default DeckView;
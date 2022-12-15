import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {

    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate('/maplibre')}>MapLibre</button>
            <button onClick={() => navigate('/deck')}>Deck</button>
        </div>
    );
}

export default Index;
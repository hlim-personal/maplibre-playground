import React from 'react';
import { PixiComponent } from '../components/Pixi/PixiComponent';

export const Charting = (props) => {

    return (
        <div style={{ width: "100vw", display: 'flex', marginTop: '100px', justifyContent: 'center' }}>
            <PixiComponent />
        </div>
    );
}
import React from 'react';
import { randomGeometricBrownianMotion } from '@d3fc/d3fc-random-data';

const DataCalculator = () => {
    const brownianData = randomGeometricBrownianMotion().steps(1e5)(1);

    return (
        <div>

        </div>
    )
}

export default DataCalculator

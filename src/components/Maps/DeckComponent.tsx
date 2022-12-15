import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers/typed';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Map, MapRef, NavigationControl } from 'react-map-gl';
import { useSelector } from 'react-redux';
import DeckGlOverlay from './DeckGlOverlay';
import { MapStyle } from './MapStyle';
import GeoApi from '../../data/geo/Api';
import { deckDataState } from '../../data/geo/Reducer';

const DeckComponent = () => {
    const mapRef = useRef<MapRef>(null);

    const initialViewState = {
        latitude: 40.73,
        longitude: -73.9,
        zoom: 10,
        pitch: 0
    }

    const rawData = useSelector(deckDataState);
    const [data, setData] = useState<Array<any> | null>(null);

    useEffect(() => {
        if (!rawData) {
            GeoApi.loadDeckData(() => {
                console.log('loaded data')
            })
        } else {
            const mappedData = rawData.map(d => {
                return {
                    coordinates: [d.pickup_longitude, d.pickup_latitude],
                    total: d.total_amount
                }
            })
            setData(mappedData);
        }
    }, [rawData])

    const dataLayer = useMemo(() => {
        if (!data) {
            return null;
        }

        return new HeatmapLayer({
            id: 'heatmapLayer',
            data: data,
            getPosition: d => d.coordinates,
            getWeight: d => d.total
        })
    }, [data])

    return (
        <div style={{
            display: 'flex',
            flexGrow: 1
        }}>
            <Map
                mapStyle={MapStyle}
                ref={mapRef}
                mapLib={maplibregl}
                initialViewState={initialViewState}
            >
                <NavigationControl position='bottom-right' showZoom visualizePitch />

                {data &&
                    <DeckGlOverlay
                        layers={[dataLayer]}
                    />
                }
            </Map >
        </div>
    );
}

export default DeckComponent; 
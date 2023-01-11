import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Map, MapRef, NavigationControl } from 'react-map-gl';
import { useSelector } from 'react-redux';
import DeckGlOverlay from './DeckGlOverlay';
import { MapStyle } from './MapStyle';
import GeoApi from '../../data/geo/Api';
import { deckDataState } from '../../data/geo/Reducer';
import { scaleThreshold } from 'd3-scale';


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
    const [geoJsonData, setGeoJsonData] = useState<any | null>(null);
    const [colorPalette, setColorPalette] = useState<any[]>([
        [26, 152, 80],
        [102, 189, 99],
        [166, 217, 106],
        [217, 239, 139],
        [255, 255, 191],
        [254, 224, 139],
        [253, 174, 97],
        [244, 109, 67],
        [215, 48, 39],
        [168, 0, 0],
        [200, 0, 0],
        [255, 0, 0],
        [255, 85, 85],
        [255, 170, 170],
        [255, 255, 255]
    ]);
    const COLOR_SCALE:any = scaleThreshold<number, number[]>()
        .domain([0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 50, 100, 350, 500])
        .range(colorPalette)

    console.log(COLOR_SCALE(14.5))

    useEffect(() => {
        if (!rawData) {
            GeoApi.loadDeckData(() => {
                console.log('loaded data')
            })
        } else {
            let maxtotal_amount = 0;
            let mintotal_amount = 100;
            rawData.forEach(d => {
                if (d.total_amount > maxtotal_amount) {
                    maxtotal_amount = d.total_amount;
                }
                
                if (d.total_amount < mintotal_amount) {
                    mintotal_amount = d.total_amount;
                }
            });
            
            const mappedData = rawData.map(d => {
                return {
                    coordinates: [d.pickup_longitude, d.pickup_latitude],
                    total: d.total_amount
                }
            })
            setData(mappedData);

            const geoJsonFeatures = rawData.map(d => {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [d.pickup_longitude, d.pickup_latitude]
                    },
                    properties: {
                        total: d.total_amount
                    }
                }
            });

            setGeoJsonData({
                type: 'FeatureCollection',
                features: geoJsonFeatures
            })
        }
    }, [rawData])

    const dataLayer = useMemo(() => {
        if (!data) {
            return null;
        }

        // const getFillColor = function (d: any) {
        //     const total = d.properties.total;
        //     if (!total) {
        //         return [255, 255, 255];
        //     } else {
        //         switch(total) {
        //             case total > 0 && total < 10:
        //              return [255, 0, 0];
        //             case total > 10 && total < 20:
        //                 return [0, 255, 0];
        //             default:
        //                 return [0, 0, 255];
        //         }
        //     }
        // }

        return new GeoJsonLayer({
            id: 'geoJsonLayer',
            data: geoJsonData,
            pointType: 'circle',      
            filled: true,
            pointRadiusMinPixels: 2,
            getFillColor: (d:any) => COLOR_SCALE(d.properties.total),
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
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
import geostats from 'geostats'
import colorbrewer from 'colorbrewer';
import ControlPanel2 from './ControlPanel/ControlPanel2';

const DeckComponent = () => {
    const mapRef = useRef<MapRef>(null);

    const initialViewState = {
        latitude: 40.73,
        longitude: -73.9,
        zoom: 10,
        pitch: 0
    }

    const rawData = useSelector(deckDataState);
    const [data, setData] = useState<any>(null);
    const [displayedFeature, setDisplayedFeature] = useState<string>('total_amount');
    const [numClasses, setNumClasses] = useState<number>(8);
    const [colorScheme, setColorScheme] = useState<string>('YlOrRd');
    const [currentClassification, setCurrentClassification] = useState<any>('stdDeviation');
    const [domain, setDomain] = useState<any>([1, 100]);
    console.log(numClasses)
      
    const getBuckets = (series) => {
        switch(currentClassification) {
            case 'eqInterval':
                return series.getClassEqInterval(numClasses);
            case 'stdDeviation':
                return series.getClassStdDeviation(numClasses);
            case 'quantile':
                return series.getClassQuantile(numClasses);                    
            case 'arithmeticProgression':
                return series.getClassArithmeticProgression(numClasses);
                default:
                    return series.getClassEqInterval(numClasses);
        }
    } 

    const hexToRgb = (hex) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ] : null;
    }
      
    const colors = (colorbrewer[colorScheme][numClasses+1]).map(d => hexToRgb(d));
    const COLOR_SCALE:any = scaleThreshold<number, number[]>()
            .domain(domain)
            .range(colors);

    useEffect(() => {
        if (!rawData) {
            GeoApi.loadDeckData(() => {
                console.log('loaded data')
            })
        } else {
            const featureArr = rawData.map(d => d[displayedFeature]);
            const series1 = new geostats(featureArr);
            const buckets = getBuckets(series1);
            const intBuckets = buckets.map(d => Math.floor(d));
            setDomain(intBuckets);

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

            setData({
                type: 'FeatureCollection',
                features: geoJsonFeatures
            })
        }
    }, [rawData])

    const dataLayer = useMemo(() => {
        if (!data || !domain) {
            return null;
        }        

        return new GeoJsonLayer({
            id: 'geoJsonLayer',
            data: data,
            pointType: 'circle',      
            filled: true,
            pointRadiusMinPixels: 2,
            getFillColor: (d:any) => COLOR_SCALE(d.properties.total),
        })
    }, [data, colorScheme, currentClassification, numClasses])

    return (
        <div style={{
            display: 'flex',
            flexGrow: 1
        }}>
            <ControlPanel2 setColorScheme={setColorScheme} currentClassification={currentClassification} setCurrentClassification={setCurrentClassification} numClasses={numClasses} setNumClasses={setNumClasses}/>
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
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
    const [data, setData] = useState<Array<any> | null>(null);
    const [geoJsonData, setGeoJsonData] = useState<any | null>(null);
    const [displayedFeature, setDisplayedFeature] = useState<string>('total_amount');
    const [numClasses, setNumClasses] = useState<number>(8);
    console.log(numClasses)
    const [colorScheme, setColorScheme] = useState<string>('YlOrRd');
    const [colors, setColors] = useState<any[] | null >(null)
    const [currentClassification, setCurrentClassification] = useState<any>('stdDeviation');
    const [domain, setDomain] = useState<any>(null);
    // const [colorPalette, setColorPalette] = useState<any[]>([
    //     [26, 152, 80],
    //     [102, 189, 99],
    //     [166, 217, 106],
    //     [217, 239, 139],
    //     [255, 255, 191],
    //     [254, 224, 139],
    //     [253, 174, 97],
    //     [244, 109, 67],
    //     [215, 48, 39],
    //     [168, 0, 0],
    //     [200, 0, 0],
    //     [255, 0, 0],
    //     [255, 85, 85],
    //     [255, 170, 170],
    //     [255, 255, 255]
    // ]);
        

    useEffect(() => {
        if (!rawData) {
            GeoApi.loadDeckData(() => {
                console.log('loaded data')
            })
        } else {
            // let maxtotal_amount = 0;
            // let mintotal_amount = 100;
            // rawData.forEach(d => {
            //     if (d.total_amount > maxtotal_amount) {
            //         maxtotal_amount = d.total_amount;
            //     }
                
            //     if (d.total_amount < mintotal_amount) {
            //         mintotal_amount = d.total_amount;
            //     }
            // });

            const featureArr = rawData.map(d => d[displayedFeature]);
            const series1 = new geostats(featureArr);
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

            const buckets = getBuckets(series1);
            const intBuckets = buckets.map(d => Math.floor(d));
            setDomain(intBuckets);
            
                 
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
        if (!geoJsonData || !domain) {
            return null;
        }

        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16)
            ] : null;
          }          


        const colors = (colorbrewer[colorScheme][numClasses+1]).map(d => hexToRgb(d));
        setColors(colors)

        const COLOR_SCALE:any = scaleThreshold<number, number[]>()
            .domain(domain)
            .range(colors);

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
    }, [data, colorScheme, currentClassification, numClasses])

    return (
        <div style={{
            display: 'flex',
            flexGrow: 1
        }}>
            <ControlPanel2 colors={colors} setColorScheme={setColorScheme} currentClassification={currentClassification} setCurrentClassification={setCurrentClassification} numClasses={numClasses} setNumClasses={setNumClasses}/>
            <Map
                mapStyle={MapStyle}
                ref={mapRef}
                mapLib={maplibregl}
                initialViewState={initialViewState}
            >
                <NavigationControl position='bottom-right' showZoom visualizePitch />

                {geoJsonData &&
                    <DeckGlOverlay
                        layers={[dataLayer]}
                    />
                }
            </Map >
        </div>
    );
}

export default DeckComponent; 
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapLayerMouseEvent, PointLike } from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Layer, MapRef, NavigationControl, Popup, Source } from 'react-map-gl';
import { useSelector } from 'react-redux';
import { MapStyle } from './MapStyle';
import GeoApi from '../../data/geo/Api';
import { libreDataState } from '../../data/geo/Reducer';
import _ from 'lodash'
import ControlPanel from './ControlPanel/ControlPanel';

interface IPopupData {
    label: string;
    latitude: number;
    longitude: number;
}

const MapLibreComponent = () => {
    const mapRef = useRef<MapRef>(null);
    const initialViewState = {
        latitude: -43.5,
        longitude: 172.6,
        zoom: 10,
        pitch: 0
    }

    const [popupData, setPopupData] = useState<IPopupData | null>(null);
    const data = useSelector(libreDataState);
    const [componentData, setComponentData] = useState(null)
    const [displayProperty, setDisplayProperty] = useState('Type');
    const [symbology, setSymbology] = useState(null);
    const equipmentLayerId = 'equipmentLayer';
    
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    useEffect(() => {
        if (!data) {
            GeoApi.loadLibreData(() => {
                console.log('loaded data')
            })
        }
    }, [data])

    useMemo(() => {
        if (data!== null) {
            const uniqueCategories = data.features.map((item:any) => item.properties[displayProperty])
                .filter((value: any, index, self) => self.indexOf(value) === index );
                
            const symbologyArr = uniqueCategories.map((category: string) => {
                const color = getRandomColor();
                return (
                    {
                        category: category,
                        color: color
                    }
                )
            })
            setSymbology(symbologyArr)
                
            const updatedFeatures = data.features.map((d:any) => {
                const colorIndex = symbologyArr.findIndex((element : { category: string, color: string}) => {
                    return (element.category === d.properties.Type)
                })

                const updatedProperties = {...d.properties, symbology: symbologyArr[colorIndex].color}
            
                return (
                    {
                        ...d,
                        properties: updatedProperties
                    }
                )
            })
            setComponentData({...data, features: updatedFeatures})
        }
    }, [data])

    const getBoundingBoxFromMouseEvent = (e: MapLayerMouseEvent, radius?: number): [PointLike, PointLike] => {
        let extension = radius ? radius : 2.5;
        return [
            [e.point.x - extension, e.point.y - extension],
            [e.point.x + extension, e.point.y + extension]
        ]
    }

    const handleClick = (e: MapLayerMouseEvent) => {
        const bbox = getBoundingBoxFromMouseEvent(e);
        const features = mapRef.current?.queryRenderedFeatures(bbox);
        if (features && features.length > 0) {
            const firstEquipment: any = features[0];
            console.log(firstEquipment);
            setPopupData({
                latitude: firstEquipment.geometry.coordinates[1],
                longitude: firstEquipment.geometry.coordinates[0],
                label: firstEquipment.properties['Type']
            })
        }
    }

    // const renderColor = (featureType : string) => {
    //     const colorIndex = colors.findIndex((element : { name: string, color: string}) => {
    //        return (element.name === featureType)
    //     })
    //     return (colors[colorIndex].color)
    // }

    return (
        <div style={{
            display: 'flex',
            flexGrow: 1
        }}>
            {componentData &&
                <ControlPanel displayProperty={displayProperty} componentData={componentData} setComponentData={setComponentData} symbology={symbology}/>
            }
            <Map
                mapStyle={MapStyle}
                ref={mapRef}
                mapLib={maplibregl}
                initialViewState={initialViewState}
                interactiveLayerIds={[equipmentLayerId]}
                onClick={handleClick}
            >
                <NavigationControl position='bottom-right' showZoom visualizePitch />

                {componentData &&
                    <Source
                        id='dataSrc'
                        type='geojson'
                        data={componentData}
                    >
                        <Layer
                            id={equipmentLayerId}
                            type='circle'
                            paint={{
                                'circle-color': ['get', 'symbology'],
                                // 'circle-color': ['case', ["boolean", ["==", ["get", "Type"], "Skateboard Rail"], false], renderColor("Skateboard Rail"), 'green'],
                                'circle-radius': 5,
                                'circle-stroke-color': 'black',
                                'circle-stroke-width': .5

                            }}
                        />
                    </Source>
                }

                {popupData &&
                    <Popup latitude={popupData.latitude} longitude={popupData.longitude} onClose={() => setPopupData(null)}>
                        {popupData.label}
                    </Popup>
                }

            </Map >
        </div>
    );
}

export default MapLibreComponent;
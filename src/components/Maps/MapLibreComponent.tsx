import React, { useEffect, useRef, useState } from 'react';
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
    const [colors, setColors] = useState([
        {
            name: 'Basketball Hoop',
            color: '#FF4500'
        },
        {
            name: 'Goal Posts',
            color: '#FFD700'
        },
        {
            name: "Netball Hoop",
            color: "#DAA520"
        },
        {
            name: "Tennis Practice Wall",
            color: "#808000"
        },
        {
            name: "Skateboard Ramp",
            color: "#7CFC00"
        },
        {
            name: "Cricket Net",
            color: "#228B22"
        }, 
        {
            name: "Volleyball Net",
            color: "#00FFFF"
        },
        {
            name: "Softball Net",
            color: "#1E90FF"
        },
        {
            name: "Skateboard Rail",
            color: "#87CEFA"
        },
        {
            name: "Skateboard Steps",
            color: "#4B0082"
        },
        {
            name: "Skateboard Bowl",
            color: "#9370DB"
        },
        {
            name: "BMX Ramp",
            color: "#FF00FF"
        },
        {
            name: "Tennis Net",
            color: "#FAEBD7"
        },
        {
            name: "BMX See-Saw",
            color: "#800000"
        },
        {
            name: "Frisbee Basket",
            color: "#A9A9A9"
        },
        {
            name: "Table Tennis Table",
            color: "#FFE4E1"
        },
        {
            name: "unknown",
            color: "#A0522D" 
        },
        {
            name: "Not in list",
            color: "#F5FFFA"
        },
    ])

    if (data !== null) {
        const uniqueTypes = data.features.map((item:any) => item.properties.Type)
            .filter((value: any, index, self) => self.indexOf(value) === index );
    }

    const equipmentLayerId = 'equipmentLayer';

    useEffect(() => {
        if (!data) {
            GeoApi.loadLibreData(() => {
                console.log('loaded data')
            })
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

    const renderColor = (featureType : string) => {
        const colorIndex = colors.findIndex((element : { name: string, color: string}) => {
           return (element.name === featureType)
        })
        return (colors[colorIndex].color)
    }

    return (
        <div style={{
            display: 'flex',
            flexGrow: 1
        }}>
            <ControlPanel colors={colors} setColors={setColors}/>
            <Map
                mapStyle={MapStyle}
                ref={mapRef}
                mapLib={maplibregl}
                initialViewState={initialViewState}
                interactiveLayerIds={[equipmentLayerId]}
                onClick={handleClick}
            >
                <NavigationControl position='bottom-right' showZoom visualizePitch />

                {data &&
                    <Source
                        id='dataSrc'
                        type='geojson'
                        data={data}
                    >
                        <Layer
                            id={equipmentLayerId}
                            type='circle'
                            paint={{
                                'circle-color': ['case', ["boolean", ["==", ["get", "Type"], "Skateboard Rail"], false], renderColor("Skateboard Rail"), 'green'],
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
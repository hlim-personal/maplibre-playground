import React from 'react'
import styles from './ControlPanel.module.css'

type Props = {
    displayProperty: string,
    componentData: any,
    setComponentData: (value: any) => void,
    symbology: any
}

const ControlPanel = (props: Props) => {
    const { displayProperty, componentData, setComponentData, symbology } = props

    const handleChange = (e) => {
        const updatedFeatures :any = componentData.features.map(d => {
            let updatedProperties = {}
            if (d.properties[displayProperty] == e.target.name) {
                updatedProperties = {...d.properties, symbology: e.target.value}   
            } else {
                updatedProperties = d.properties
            }
            return (
                {
                    ...d,
                    properties: updatedProperties
                }
            )
        })

        setComponentData({...componentData, features: updatedFeatures}) // [
    }

    return (
        <div className={styles.controlpanel}>
            <div className={styles.title}>
                Feature Key
            </div>
            <div className={styles.featuresBSox}>
                 {
                    symbology.map((d: any)=> {
                        return (
                            <div className={styles.featureColorLines}>
                                <div className={styles.feature}>{d.category}</div>
                                <input type="color" name={d.category} value={d.color} onChange={handleChange}/>
                            </div>
                        )
                    })
                 }
            </div>
        </div>
    )
}

export default ControlPanel

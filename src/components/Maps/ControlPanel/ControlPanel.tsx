import React from 'react'
import styles from './ControlPanel.module.css'

type Props = {
    colors: any,
    setColors: (value: any) => void;
}

const ControlPanel = (props: Props) => {
    const { colors, setColors } = props

    const handleChange = (e) => {
        const updatedColors :any = colors.map(element => {
            if (element.name == e.target.name) {
                return {...element, color: e.target.value}
            }
            return element
        })
        setColors(updatedColors) 
    }

    return (
        <div className={styles.controlpanel}>
            <div className={styles.title}>
                Feature Key
            </div>
            <div className={styles.featuresBSox}>
                 {
                    colors.map((element: {name: string, color: string})=> {
                        return (
                            <div className={styles.featureColorLines}>
                                <div className={styles.feature}>{element.name}</div>
                                <input type="color" name={element.name} value={element.color} onChange={handleChange}/>
                            </div>
                        )
                    })
                 }
            </div>
        </div>
    )
}

export default ControlPanel

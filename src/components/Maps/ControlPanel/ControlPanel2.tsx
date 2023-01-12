import React, { useEffect, useMemo, useRef, useState } from 'react';
import Styles from './ControlPanel.module.css';
import colorbrewer from 'colorbrewer';

interface Props {
    colors: any[] | null;
    setColorScheme: any;
    currentClassification: string;
    setCurrentClassification: (value: string) => void;
    numClasses: number;
    setNumClasses: (value: number) => void;
}

const ControlPanel2 = (props: Props) => {
    const { colors, setColorScheme, currentClassification, setCurrentClassification, numClasses, setNumClasses } = props;

    const colorset1 = colorbrewer['YlGnBu'][9];
    const colorset2 = colorbrewer['YlOrRd'][9];
    const colorset3 = colorbrewer['RdPu'][9];

    const handleChange = (e: any) => {
        if (e.target.name === 'numClasses') {
            setNumClasses(Number(e.target.value))
        } else if (e.target.name === 'classification') {
            setCurrentClassification(e.target.value)
        }
    }

    return (
        <div className={Styles.controlpanel}>
            <div className={Styles.title}>
                Data Vis Options
            </div>
            <div className={Styles.featuresBox}>
                    <div className={Styles.feature}>Number of data classes:</div>
                    <select name="numClasses" onChange={handleChange}>
                        <option value="2">3</option>
                        <option value="5">6</option>
                        <option value="8">9</option>
                    </select>
                    {/* <div className={Styles.feature}>Number of data classes:</div>
                    <select name="classification" onChange={handleChange}>
                        <option value="stdDeviation">3</option>
                        <option value="5">6</option>
                        <option value="8">9</option>
                    </select> */}
                    <div className={Styles.feature}>Select Colour Scheme</div>
                    <div className={Styles.colorsBox}>
                        <div className={Styles.colorband} onClick={() => setColorScheme('YlGnBu')}>
                        {
                            colorset1.map((d, i) => {
                                return (
                                    
                                        <div style={{ backgroundColor: d, height: '10px', width: '10px' }}></div>          
                                )
                            })
                        }
                        </div>
                        <div className={Styles.colorband} onClick={() => setColorScheme('YlOrRd')}>
                        {
                            colorset2.map((d, i) => {
                                return (
                                    
                                        <div style={{ backgroundColor: d, height: '10px', width: '10px' }}></div>          
                                )
                            })
                        }
                        </div>
                        <div className={Styles.colorband} onClick={() => setColorScheme('RdPu')}>
                        {
                            colorset3.map((d, i) => {
                                return (
                                    
                                        <div style={{ backgroundColor: d, height: '10px', width: '10px' }}></div>          
                                )
                            })
                        }
                        </div>
                    </div>

                    
                        
                        
                    
            </div>
        </div>
    );
};

export default ControlPanel2;
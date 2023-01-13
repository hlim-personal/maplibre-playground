import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialSymbologyState } from './State';
import { geostats } from 'geostats';
import colorbrewer from 'colorbrewer';

const SymbologySlice = createSlice({
    name: 'Symbology',
    initialState: initialSymbologyState,
    reducers: {
        setNumClasses: (state, action: PayloadAction<number>) => {
            state.numClasses = action.payload;
        },
        setColorScheme: (state, action: PayloadAction<string>) => {
            state.colorScheme = action.payload;
        },
        setCurrentClassification: (state, action: PayloadAction<string>) => {
            state.currentClassification = action.payload;
        },
        setDataArray: (state, action: PayloadAction<number[]>) => {
            state.dataArray = action.payload;
        },
        setDomain: (state) => {
            // const series = new geostats(action.payload);
            // const buckets = getBuckets(series, state.currentClassification, state.numClasses);
            state.domain = selectDomain(state);
        },
        setColors: (state) => {
            // const colors = (colorbrewer[state.colorScheme][state.numClasses+1]).map(d => hexToRgb(d));
            state.colors = selectColors(state);
        }       
    }
})

export const SymbologyActions = SymbologySlice.actions;

export const numClassesState = (state): any => state.symbology.numClasses;
export const colorSchemeState = (state): any => state.symbology.colorScheme;
export const currentClassificationState = (state): any => state.symbology.currentClassification;
export const dataArrayState = (state): any => state.symbology.dataArray;
export const domainState = (state): any => state.symbology.domain;
export const colorsState = (state): any => state.symbology.colors;

const selectDomain = createSelector(numClassesState, currentClassificationState, dataArrayState, (numClasses, currentClassification, dataArray) => {
    const series = new geostats(dataArray);
    return (getBuckets(series, currentClassification, numClasses));  
})
const selectColors = createSelector(numClassesState, colorSchemeState, (numClasses, colorScheme) => {
    return (colorbrewer[colorScheme][numClasses+1]).map(d => hexToRgb(d)); 
})

export default SymbologySlice.reducer;

const getBuckets = (series: any, currentClassification: string, numClasses) => {
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
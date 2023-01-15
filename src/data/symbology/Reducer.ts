import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import colorbrewer from 'colorbrewer';
import geostats from 'geostats';
import { initialSymbologyState } from './State';

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
    }
})

export const SymbologyActions = SymbologySlice.actions;

export const numClassesState = (state): any => state.symbology.numClasses;
export const colorSchemeState = (state): any => state.symbology.colorScheme;
export const currentClassificationState = (state): any => state.symbology.currentClassification;
export const dataArrayState = (state): any => state.symbology.dataArray;

export const domainState = createSelector(numClassesState, currentClassificationState, dataArrayState, (numClasses, currentClassification, dataArray) => {
    const series = new geostats(dataArray);
    const buckets = getBuckets(series, currentClassification, numClasses);
    console.log(buckets)
    return (buckets);
})

export const colorState = createSelector(numClassesState, colorSchemeState, (numClasses, colorScheme) => {
    return (colorbrewer[colorScheme][numClasses + 1]).map(d => hexToRgb(d));
})

export default SymbologySlice.reducer;

const getBuckets = (series: any, currentClassification: string, numClasses) => {
    switch (currentClassification) {
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
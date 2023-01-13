import { configureStore } from '@reduxjs/toolkit';
import GeoReducer from '../data/geo/Reducer';
import SymbologyReducer from '../data/symbology/Reducer';

export const store = configureStore({
    reducer: {
        geo: GeoReducer,
        symbology: SymbologyReducer
    }
});

export default store;

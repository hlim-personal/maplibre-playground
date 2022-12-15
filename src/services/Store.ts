import { configureStore } from '@reduxjs/toolkit';
import GeoReducer from '../data/geo/Reducer';

export const store = configureStore({
    reducer: {
        geo: GeoReducer
    },
});

export default store;

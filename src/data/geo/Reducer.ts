import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialGeoState } from './State';

const GeoSlice = createSlice({
    name: 'Geo',
    initialState: initialGeoState,
    reducers: {
        loadLibreData(state, action: PayloadAction<any>) {
            state.libreData = action.payload;
        },
        loadDeckData(state, action: PayloadAction<any>) {
            state.deckData = action.payload;
        }
    }
})

export const GeoActions = GeoSlice.actions;

export const libreDataState = (state): any => state.geo.libreData;
export const deckDataState = (state): any => state.geo.deckData;

export default GeoSlice.reducer;
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import store from './services/Store';
import DeckView from './views/Deck';
import IndexView from './views/Index';
import MapLibreView from './views/MapLibre';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<IndexView />} />
                    <Route path='/maplibre' element={<MapLibreView />} />
                    <Route path='/deck' element={<DeckView />} />
                </Routes>
            </BrowserRouter>
        </Provider>

    );
}

export default App;

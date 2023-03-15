import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import D3FCGraph from './components/Maps/D3FCGraph/D3FCGraph';
import D3FCGraphExp from './components/Maps/D3FCGraphExperiment/D3FCGraphExperiment';
import D3FCGraphPractice from './components/Maps/D3FCPractice/D3FCPractice';
import D3FCScatter from './components/Maps/D3FCScatter/D3FCScatter';
import D3Graph from './components/Maps/D3Graph/D3Graph';
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
                    <Route path='/d3fc' element={<D3FCGraph />} />
                    <Route path='/d3' element={<D3Graph />} />
                    <Route path='/d3fcpractice' element={<D3FCGraphPractice />} />
                    <Route path='/d3fcexp' element={<D3FCGraphExp />} />
                    <Route path='/d3fcscatter' element={<D3FCScatter />} />
                </Routes>
            </BrowserRouter>
        </Provider>

    );
}

export default App;

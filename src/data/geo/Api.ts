import { GeoActions } from './Reducer';
import sportsEquipmentData from './sportsEquipment.json';
import taxiData from './taxidata.json';
import store from '../../services/Store';

const Api = {
    loadLibreData: (callback?: () => void) => {
        store.dispatch(GeoActions.loadLibreData(sportsEquipmentData));

        if (callback) {
            callback();
        }
    },
    loadDeckData: (callback?: () => void) => {
        store.dispatch(GeoActions.loadDeckData(taxiData));

        if (callback) {
            callback();
        }
    }
}

export default Api;
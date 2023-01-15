import { SymbologyActions } from './Reducer';
import store from '../../services/Store';

const Api = {
    setNumClasses: (numClasses: number) => {
        store.dispatch(SymbologyActions.setNumClasses(numClasses));
    },
    setColorScheme: (colorScheme: string) => {
        store.dispatch(SymbologyActions.setColorScheme(colorScheme));
    },
    setCurrentClassification: (currentClassification: string) => {
        store.dispatch(SymbologyActions.setCurrentClassification(currentClassification));
    },
    setDataArray: (dataArray: number[]) => {
        store.dispatch(SymbologyActions.setDataArray(dataArray));
    },
    // setDomain: () => {
    //     store.dispatch(SymbologyActions.setDomain());
    // },
    // setColors: () => {
    //     store.dispatch(SymbologyActions.setColors());
    // }
}

export default Api;

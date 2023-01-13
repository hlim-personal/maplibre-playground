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
    setDomain: (series: number[]) => {
        store.dispatch(SymbologyActions.setDomain(series));
    },
    setColors: (colors: number[][]) => {
        store.dispatch(SymbologyActions.setColors(colors));
    }
}

export default Api;

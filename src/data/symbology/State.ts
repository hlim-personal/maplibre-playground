export interface ISymbologyState {
    numClasses: number;
    colorScheme: string;
    currentClassification: string;
    colors: number[][];
    domain: number[];
    dataArray: number[]; 
}

export const initialSymbologyState: ISymbologyState = {
    numClasses: 8,
    colorScheme: 'YlOrRd',
    currentClassification: 'stdDeviation',
    colors: [[255, 255, 204], [255, 237, 160], [254, 217, 118], [254, 178, 76], [253, 141, 60], [252, 78, 42], [227, 26, 28], [189, 0, 38], [128, 0, 38]],
    domain: [0, 100],
    dataArray: []
}
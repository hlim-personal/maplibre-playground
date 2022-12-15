import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed';
import PropTypes from 'prop-types';
import { useControl } from 'react-map-gl';

const DeckGlOverlay = (props: MapboxOverlayProps & {
    interleaved?: boolean;
}) => {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

DeckGlOverlay.propTypes = {
    layers: PropTypes.array
}
export default DeckGlOverlay;
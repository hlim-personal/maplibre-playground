import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Graphics, Sprite, Stage } from '@pixi/react';
import * as PIXI from 'pixi.js';

export const DraggablePoint = ({ tint, x, y, ...props }) => {
    const isDragging = React.useRef(false);
    const offset = React.useRef({ x: 0, y: 0 });
    const [position, setPosition] = React.useState({ x: x || 0, y: y || 0 })
    const [alpha, setAlpha] = React.useState(1);
    const [zIndex, setZIndex] = React.useState<number>(1);

    function onStart(e) {
        isDragging.current = true;
        offset.current = {
            x: e.data.global.x - position.x,
            y: e.data.global.y - position.y
        };

        setAlpha(0.5);
        const newIndex = zIndex + 1;
        setZIndex(newIndex);
    }

    function onEnd() {
        isDragging.current = false;
        setAlpha(1);
    }

    function onMove(e) {
        if (isDragging.current) {
            setPosition({
                x: e.data.global.x - offset.current.x,
                y: e.data.global.y - offset.current.y,
            })
        }
    }

    return (
        <Sprite
            {...props}
            alpha={alpha}
            position={position}
            texture={PIXI.Texture.WHITE}
            width={50}
            height={50}
            zIndex={zIndex}
            tint={tint}
            pointerdown={onStart}
            pointerup={onEnd}
            pointerupoutside={onEnd}
            pointermove={onMove}
            eventMode={'dynamic'}
        />
    );
};

export const PixiContainer = ({ height, width }) => {
    const [app, setApp] = useState<any>(null);
    // const [dragTarget, setDragTarget] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    let dragTarget: any = null;

    useEffect(() => {
        if (!app && containerRef.current) {

        }
    }, [app, containerRef]);


    const draw = useCallback((g) => {
        g.clear();
        g.beginFill('red');
        g.drawCircle(50, 50, 5);
        g.endFill();
    }, [])








    return (
        // <div style={{ position: 'absolute', height: height, width: width }} ref={containerRef} />
        <Stage width={width} height={height} options={{ backgroundAlpha: 0 }}  >
            <Container sortableChildren>

                <DraggablePoint tint={0xff00ff} x={50} y={50} />
            </Container>
        </Stage>

    );
}
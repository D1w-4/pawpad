import React, { useCallback, useEffect, useRef } from 'react';
import { NesEmulator } from './NesEmulator';

export function Nes(): JSX.Element {
    let nes: NesEmulator;
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (ref.current) {
            nes = new NesEmulator(ref.current);
        }
    }, []);

    const onSelectFile = useCallback((event: React.SyntheticEvent<HTMLInputElement>) => {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            nes && nes.loadRom(event.currentTarget.files[0]);
        }
    }, []);

    return (
        <>
        <input type="file" onChange={ onSelectFile }/>
        <canvas ref={ ref } width={ 256 } height={ 240 } style={ { height: '100vh' } }></canvas>
        </>
    )
}

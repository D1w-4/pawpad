import React from 'react';
import { Button } from '@material-ui/core';
import { Nes } from './emulators/Nes';

const App: React.FC = () => {
  return (
        <>
        <Nes/>
        <Button color={'secondary'}> s</Button>
        </>
  );
}

export default App;

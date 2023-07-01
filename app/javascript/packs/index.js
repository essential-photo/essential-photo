import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {ContextProvider} from '../src/context';
import App from '../src/App';
import '../src/index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <ContextProvider>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ContextProvider>
);
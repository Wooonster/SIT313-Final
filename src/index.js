import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { TitleProvider } from './Context/title.context';
import { PictureProvider } from './Context/uploadpicture.context';
import { SearchProvider } from './Context/search.context';
import { MarkdownProvider } from './Context/editor.context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <TitleProvider>
      <MarkdownProvider>
        <PictureProvider>
          <SearchProvider>
            <StrictMode>
              <App />
            </StrictMode>
          </SearchProvider>
        </PictureProvider>
      </MarkdownProvider>
    </TitleProvider>
  </BrowserRouter>
);
import React from 'react';
import {createRoot} from 'react-dom/client';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Application from './application';
import './assets/styles/dots.css';
// Get the root element
const rootElement = document.getElementById('root');

if (rootElement) {
  // Create a root using createRoot
  const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
  <Application/>
  </BrowserRouter>,
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
} 
else 
{
  console.error('Root element not found');
}
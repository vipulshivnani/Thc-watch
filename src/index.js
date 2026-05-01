import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

window.storage = {
  get: async (k) => {
    const v = localStorage.getItem(k);
    return v ? { value: v } : null;
  },
  set: async (k, v) => {
    localStorage.setItem(k, v);
    return { key: k, value: v };
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
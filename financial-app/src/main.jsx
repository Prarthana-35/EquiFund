import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';
// import { ThemeProvider } from "@material-tailwind/react";
import './index.css';

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
   {/* <ThemeProvider> */}
      <App />
    {/* </ThemeProvider> */}
  </Provider>
);

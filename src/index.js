import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Web3Context, { Web3Provider } from './context/Web3Context';
import { ExplorePageProvider } from './context/ExplorePageContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const muiTheme = createTheme({
  typography: {
    fontFamily: [
      '"Poppins"', 
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(',')
  }
})

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <ExplorePageProvider>
        <ThemeProvider theme={muiTheme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </ExplorePageProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

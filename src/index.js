import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoPage from './pages/NoPage';
import reportWebVitals from './reportWebVitals';
import HomePage from './pages/HomePage';

export default function Main() {
  return (
    <BrowserRouter basename="/">
      <Routes>
      
          <Route index element={<HomePage/>}/>
          <Route path="/ga1" element={<App/>}/>

        <Route path="*" element={<NoPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Main/>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

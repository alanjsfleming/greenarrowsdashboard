import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoPage from './pages/NoPage';
import reportWebVitals from './reportWebVitals';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Signup from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import Configure from './pages/components/Configure';
import PasswordReset from './pages/PasswordReset'
import UserSetup from './pages/UserSetup'
import { RaceProvider } from './contexts/RaceContext';

export default function Main() {
  return (
    <AuthProvider>
      <RaceProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/details" element={<PrivateRoute><App /></PrivateRoute>}/>
            <Route path="/logout" element={<Logout />}/>
            <Route path="/register" element={<Signup />}/>
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/user-setup" element={<UserSetup />}/>
            <Route path="/configure" element={<PrivateRoute><Configure /></PrivateRoute>} />
            <Route path="/user-setup" element={<PrivateRoute> <UserSetup /> </PrivateRoute>} />
          <Route path="*" element={<NoPage/>}/>
          </Routes>
        </BrowserRouter>
      </RaceProvider>
    </AuthProvider>
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
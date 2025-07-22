import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './HomePage';
import Signup from './SignUp';
import FirstPage from './FirstPage';
import Login from './Login';
import PostSelect from './PostSelect';
import Lost from './Lost';
import Found from './Found';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteAdmin from './components/ProtectedRouteAdmin';
import AdminHomePage from './AdminHomePage';
import AdminLogin from './AdminLogin';
import ScrollToTop from './components/ScrollToTop';
import RouteWithLoader from './components/RouteWithLoader';
import HowItWorks from './HowItWorks';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
        <Route path ='/' element = {<App/>}/>
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <RouteWithLoader>
                <HomePage />
              </RouteWithLoader>
            </ProtectedRoute>
          }
        />
        <Route path ='/signup' element = {<RouteWithLoader><Signup/></RouteWithLoader>}/>
        <Route path ='/firstpage' element = {<RouteWithLoader><FirstPage/></RouteWithLoader>}/>
        <Route path ='/login' element = {<RouteWithLoader><Login/></RouteWithLoader>}/>
        <Route path ='/post' 
              element = {
              <ProtectedRoute><RouteWithLoader>
                <PostSelect/></RouteWithLoader>
              </ProtectedRoute>}/>
        <Route path ='/lost' element = {<ProtectedRoute><RouteWithLoader><Lost/></RouteWithLoader></ProtectedRoute>}/>
        <Route path ='/howitworks' element = {<ProtectedRoute><RouteWithLoader><HowItWorks/></RouteWithLoader></ProtectedRoute>}/>
        <Route path ='/found' element = {<ProtectedRoute><RouteWithLoader><Found/></RouteWithLoader></ProtectedRoute>}/>
        <Route path ='/adminlogin' element = {<RouteWithLoader><AdminLogin/></RouteWithLoader>}/>
        <Route path="/adminhomepage" element={ <ProtectedRouteAdmin><RouteWithLoader><AdminHomePage/></RouteWithLoader></ProtectedRouteAdmin>}/>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import UserLogin from './pages/User Registration/UserLogin';
import UserSignup from './pages/User Registration/UserSignup';
import CaptainLogin from './pages/Captain Registration/CaptainLogin';
import CaptainSignup from './pages/Captain Registration/CaptainSignup';
import UserForgotPSD from './pages/User Registration/UserForgotPSD';
import Home from './pages/Home';
import UserProtectWrapper from './pages/User Registration/UserProtectWrapper';
import UserLogout from './pages/User Registration/UserLogout';
import CaptainHome from './pages/CaptainHome';
import CaptainForgotPSD from './pages/Captain Registration/CaptainForgotPSD';
import CaptainLogout from './pages/Captain Registration/CaptainLogout';
import CaptainProtectWrapper from './pages/Captain Registration/CaptainProtectWrapper';
import Riding from './pages/Riding';
import CaptainRiding from './pages/CaptainRiding';

const App = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Start />} />
                <Route path='/login' element={<UserLogin />} />
                <Route path='/login/forgot-psd' element={<UserForgotPSD />} />
                <Route path='/signup' element={<UserSignup />} />
                <Route path='/home' element={
                    <UserProtectWrapper>
                        <Home/>
                    </UserProtectWrapper>}
                />
                <Route path='/users/logout' element={
                    <UserProtectWrapper>
                        <UserLogout />
                    </UserProtectWrapper>}
                />
                <Route path='/riding' element={
                    <UserProtectWrapper>
                        <Riding />
                    </UserProtectWrapper>
                } />

                <Route path='/captain-login' element={<CaptainLogin />} />
                <Route path='/captain-login/forgot-psd' element={<CaptainForgotPSD />} />
                <Route path='/captain-signup' element={<CaptainSignup />} />
                <Route path='/captain-home' element={<CaptainProtectWrapper>
                        <CaptainHome/>
                    </CaptainProtectWrapper>} />
                <Route path='/captains/logout' element={
                    <CaptainProtectWrapper>
                        <CaptainLogout />
                    </CaptainProtectWrapper>}
                />
                <Route path='/captain-riding' element={
                    <CaptainProtectWrapper>
                        <CaptainRiding/>
                    </CaptainProtectWrapper>}
                />
            </Routes>
        </div>
    )
}

export default App
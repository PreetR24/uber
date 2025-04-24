import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import UserContext from './context/UserContext';
import CaptainContext from './context/CaptainContext.jsx';
import SocketContext from './context/SocketContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={googleClientId}>
        <StrictMode>
            <CaptainContext>
                <UserContext>
                    <SocketContext>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </SocketContext>
                </UserContext>
            </CaptainContext>
        </StrictMode>
    </GoogleOAuthProvider>
);

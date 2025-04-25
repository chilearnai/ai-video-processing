// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { host } from '../config';

// // Функция для проверки авторизации
// const isAuthenticated = () => {
//     // Предположим, что токен хранится в localStorage
//     const token = localStorage.getItem('token'); // Или используйте cookie
//     return !!token; // Если токен есть, то пользователь авторизован
// };

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!isAuthenticated()) {
//             // Если пользователь не авторизован, перенаправить на
//             window.location.href = `${host}/sign-in`;
//         }
//     }, [navigate]);

//     // Если пользователь авторизован, отобразить содержимое
//     return <>{isAuthenticated() && children}</>;
// };

// export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  isAuth: boolean;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuth, children }) => {
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

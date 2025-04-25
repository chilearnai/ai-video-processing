import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Предположим, что функция для получения токена выглядит так:
const getToken = () => {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1] || localStorage.getItem('access_token')
  );
};

// Пример функции для валидации токена (асинхронный запрос на сервер)
const validateToken = async (token: string): Promise<{ valid: boolean }> => {
  try {
    const response = await fetch(`/api/validate-token?token=${token}`);
    const data = await response.json();
    return { valid: data.valid };
  } catch (error) {
    console.error('Ошибка валидации токена:', error);
    return { valid: false };
  }
};

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        navigate('/sign-in'); // Перенаправляем на страницу авторизации
        return;
      }

      try {
        const { valid } = await validateToken(token);
        if (!valid) {
          navigate('/sign-in'); // Если токен недействителен, перенаправляем
        } else {
          setIsAuthenticated(true); // Если токен валиден, даем доступ
        }
      } catch (error) {
        navigate('/sign-in'); // Перенаправляем в случае ошибки
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Пока идет проверка, показываем индикатор загрузки
  }

  return <>{isAuthenticated && children}</>;
};

export default AuthWrapper;

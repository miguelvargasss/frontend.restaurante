import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { LoginForm } from '../../components/auth/LoginForm';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginAsync, selectIsAuthenticated, selectIsLoading, selectError } from '../../redux/authSlice';
import type { LoginRequest } from '../../types/auth.types';
import logoDonaJulia from '../../conf/Julia-restaurant.jpg';
import styles from './LoginPage.module.css';

// ============================================
// Componente LoginPage
// ============================================

export const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectIsLoading);
    const error = useAppSelector(selectError);

    // Configurar message API
    const [messageApi, contextHolder] = message.useMessage();

    // Mostrar error como mensaje flotante
    useEffect(() => {
        if (error) {
            messageApi.error({
                content: error,
                duration: 4,
                style: {
                    marginTop: '20px',
                },
            });
        }
    }, [error, messageApi]);

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            messageApi.success({
                content: '¡Inicio de sesión exitoso!',
                duration: 2,
            });
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        }
    }, [isAuthenticated, navigate, messageApi]);

    const handleLogin = async (credentials: LoginRequest) => {
        try {
            await dispatch(loginAsync(credentials)).unwrap();
            // El useEffect se encargará de mostrar el mensaje y la redirección
        } catch (err) {
            // El error ya está manejado en el slice y se mostrará en el useEffect
            console.error('Error al iniciar sesión:', err);
        }
    };

    return (
        <>
            {contextHolder}
            <div className={styles.pageContainer}>
                {/* Fondo degradado */}
                <div className={styles.background} />

                {/* Elementos decorativos del fondo */}
                <div className={styles.decorativeCircle1} />
                <div className={styles.decorativeCircle2} />

                {/* Card principal */}
                <div className={styles.loginCard}>
                    {/* Título ARRIBA */}
                    <h1 className={styles.title}>Iniciar Sesión</h1>

                    {/* Logo */}
                    <div className={styles.logoContainer}>
                        <img
                            src={logoDonaJulia}
                            alt="Doña Julia Logo"
                            className={styles.logo}
                        />
                    </div>

                    {/* Formulario SIN error alert (ahora es mensaje flotante) */}
                    <LoginForm
                        onSubmit={handleLogin}
                        isLoading={isLoading}
                        error={null}
                        showTitle={false}
                    />
                </div>
            </div>
        </>
    );
};

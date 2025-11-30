import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import styles from './ErrorPage.module.css';

// ============================================
// 403 - Acceso Denegado
// ============================================

export const Error403: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <Result
                    status="403"
                    title={<span className={styles.errorCode}>403</span>}
                    subTitle={
                        <span className={styles.errorMessage}>
                            Lo sentimos, no estás autorizado para acceder a esta página
                        </span>
                    }
                    icon={
                        <div className={styles.iconContainer}>
                            <LockOutlined className={styles.errorIcon} />
                        </div>
                    }
                    extra={
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate('/dashboard')}
                            className={styles.backButton}
                        >
                            Volver al Inicio
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

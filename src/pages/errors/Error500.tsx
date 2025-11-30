import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import styles from './ErrorPage.module.css';

// ============================================
// 500 - Error Interno del Servidor
// ============================================

export const Error500: React.FC = () => {
    const navigate = useNavigate();

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <Result
                    status="500"
                    title={<span className={styles.errorCode}>500</span>}
                    subTitle={
                        <span className={styles.errorMessage}>
                            Ha ocurrido un problema interno
                        </span>
                    }
                    icon={
                        <div className={styles.iconContainer}>
                            <WarningOutlined className={styles.errorIcon} />
                        </div>
                    }
                    extra={[
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleRefresh}
                            className={styles.backButton}
                            key="refresh"
                        >
                            Reintentar
                        </Button>,
                        <Button
                            size="large"
                            onClick={() => navigate('/dashboard')}
                            key="home"
                        >
                            Volver al Inicio
                        </Button>
                    ]}
                />
            </div>
        </div>
    );
};

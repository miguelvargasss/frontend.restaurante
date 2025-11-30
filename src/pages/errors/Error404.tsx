import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './ErrorPage.module.css';

// ============================================
// 404 - Página No Encontrada
// ============================================

export const Error404: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <Result
                    status="404"
                    title={<span className={styles.errorCode}>404</span>}
                    subTitle={
                        <span className={styles.errorMessage}>
                            Ha ocurrido un problema al cargar la página
                        </span>
                    }
                    icon={
                        <div className={styles.iconContainer}>
                            <QuestionCircleOutlined className={styles.errorIcon} />
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

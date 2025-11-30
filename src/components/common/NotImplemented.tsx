import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './NotImplemented.module.css';

// ============================================
// Props del componente
// ============================================

interface NotImplementedProps {
    moduleName: string;
    description?: string;
}

// ============================================
// Componente NotImplemented (404)
// ============================================

export const NotImplemented: React.FC<NotImplementedProps> = ({
    moduleName,
    description = 'Este módulo está en desarrollo',
}) => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Result
                status="404"
                title={moduleName}
                subTitle={description}
                extra={
                    <Button type="primary" onClick={() => navigate('/dashboard')}>
                        Volver al Dashboard
                    </Button>
                }
            />
        </div>
    );
};

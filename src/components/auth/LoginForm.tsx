import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { LoginRequest } from '../../types/auth.types';
import styles from './LoginForm.module.css';

// ============================================
// Props del componente
// ============================================

interface LoginFormProps {
    onSubmit: (credentials: LoginRequest) => void;
    isLoading?: boolean;
    error?: string | null;
    showTitle?: boolean;
}

// ============================================
// Componente LoginForm
// ============================================

export const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    isLoading = false,
    showTitle = true
}) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: LoginRequest) => {
        onSubmit(values);
    };

    return (
        <div className={styles.formContainer}>
            {showTitle && <h1 className={styles.title}>Iniciar Sesión</h1>}

            <Form
                form={form}
                name="login"
                onFinish={handleSubmit}
                autoComplete="off"
                layout="vertical"
                className={styles.form}
            >
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Por favor ingresa tu correo electrónico' },
                        { type: 'email', message: 'Por favor ingresa un correo válido' },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined className={styles.inputIcon} />}
                        placeholder="Correo electrónico"
                        size="large"
                        className={styles.input}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Por favor ingresa tu contraseña' },
                        { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className={styles.inputIcon} />}
                        placeholder="Contraseña"
                        size="large"
                        className={styles.input}
                    />
                </Form.Item>

                <Form.Item className={styles.submitButtonContainer}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={isLoading}
                        className={styles.submitButton}
                        block
                    >
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

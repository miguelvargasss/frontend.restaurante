import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import type { CreateUserRequest, Profile } from '../../types/user.types';
import { userService } from '../../services/user.service';
import { buildApiUrl } from '../../conf/api.config';
import styles from './CreateUserModal.module.css';

const { Option } = Select;

// ============================================
// Props del componente
// ============================================

interface CreateUserModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CreateUserModal
// ============================================

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(false);

    // Cargar perfiles al abrir el modal
    useEffect(() => {
        if (open) {
            loadProfiles();
        }
    }, [open]);

    const loadProfiles = async () => {
        setLoadingProfiles(true);
        try {
            console.log('Cargando perfiles...');
            const data = await userService.getProfiles();
            console.log('Perfiles cargados:', data);
            setProfiles(data);
            
            if (!data || data.length === 0) {
                message.warning('No hay perfiles disponibles. Contacta al administrador.');
            }
        } catch (error) {
            message.error('Error al cargar perfiles');
            console.error('Error loading profiles:', error);
            setProfiles([]);
        } finally {
            setLoadingProfiles(false);
        }
    };

    const handleSubmit = async (values: any) => {
        console.log('🔵 handleSubmit iniciado');
        console.log('📝 Valores del formulario:', values);
        console.log('📋 Tipo de profileId recibido:', typeof values.profileId, '| Valor:', values.profileId);
        console.log('📋 Perfiles disponibles:', profiles);
        
        // Validación adicional del profileId
        if (!values.profileId) {
            message.error('Debes seleccionar un perfil');
            return;
        }
        
        const profileIdNumber = Number(values.profileId);
        if (isNaN(profileIdNumber) || profileIdNumber <= 0) {
            message.error('El perfil seleccionado no es válido');
            return;
        }
        
        setLoading(true);
        try {
            const userData: CreateUserRequest = {
                email: values.email,
                password: values.password,
                name: values.firstName,
                lastName: values.lastName,
                profileId: profileIdNumber,
                isActive: values.isActive === true,
            };

            console.log('📤 Enviando datos al backend:', userData);
            console.log('📤 JSON.stringify del body:', JSON.stringify(userData));
            console.log('🔗 URL del endpoint:', buildApiUrl('/users'));

            const result = await userService.createUser(userData);
            console.log('✅ Respuesta del backend:', result);
            
            message.success('Usuario Registrado');
            
            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al crear usuario:', error);
            if (error instanceof Error) {
                message.error(`Error de Registro: ${error.message}`);
            } else {
                message.error('Error de Registro');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Registro Usuario"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={700}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ isActive: true, profileId: undefined }}
                className={styles.form}
            >
                <div className={styles.formRow}>
                    <Form.Item
                        label="Perfil"
                        name="profileId"
                        rules={[{ required: true, message: 'Selecciona un perfil' }]}
                        className={styles.formItem}
                    >
                        <Select
                            placeholder="Seleccionar perfil"
                            loading={loadingProfiles}
                            disabled={loadingProfiles}
                            size="large"
                        >
                            {profiles.map((profile) => (
                                <Option key={profile.id} value={profile.id}>
                                    {profile.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Estado"
                        name="isActive"
                        rules={[{ required: true, message: 'Selecciona el estado' }]}
                        className={styles.formItem}
                    >
                        <Select placeholder="Seleccionar estado" size="large">
                            <Option value={true}>
                                <span style={{ color: '#52c41a' }}>● Activo</span>
                            </Option>
                            <Option value={false}>
                                <span style={{ color: '#ff4d4f' }}>● Inactivo</span>
                            </Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className={styles.formRow}>
                    <Form.Item
                        label="Nombre(s)"
                        name="firstName"
                        rules={[{ required: true, message: 'Ingresa el nombre' }]}
                        className={styles.formItem}
                    >
                        <Input placeholder="Nombre" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Apellidos"
                        name="lastName"
                        rules={[{ required: true, message: 'Ingresa los apellidos' }]}
                        className={styles.formItem}
                    >
                        <Input placeholder="Apellidos" size="large" />
                    </Form.Item>
                </div>

                <div className={styles.formRow}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Ingresa el email' },
                            { type: 'email', message: 'Email inválido' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input placeholder="usuario@email.com" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Contraseña"
                        name="password"
                        rules={[
                            { required: true, message: 'Ingresa la contraseña' },
                            { min: 6, message: 'Mínimo 6 caracteres' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input.Password placeholder="Contraseña" size="large" />
                    </Form.Item>
                </div>

                <div className={styles.formActions}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        className={styles.submitButton}
                    >
                        Registro
                    </Button>
                    <Button 
                        onClick={handleCancel} 
                        size="large"
                        className={styles.cancelButton}
                    >
                        Cancel
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

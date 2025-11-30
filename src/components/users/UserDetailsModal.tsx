import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, Spin } from 'antd';
import type { UpdateUserRequest, Profile } from '../../types/user.types';
import { userService } from '../../services/user.service';
import styles from './UserDetailsModal.module.css';

const { Option } = Select;

// ============================================
// Props del componente
// ============================================

interface UserDetailsModalProps {
    open: boolean;
    userId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente UserDetailsModal
// ============================================

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
    open,
    userId,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(false);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(false);

    // Cargar perfiles y usuario al abrir el modal
    useEffect(() => {
        if (open && userId) {
            // Cargar perfiles primero, luego el usuario
            loadProfilesAndUser(userId);
        }
    }, [open, userId]);

    const loadProfilesAndUser = async (id: number) => {
        // Primero cargar perfiles
        await loadProfiles();
        // Luego cargar el usuario (para que el dropdown ya tenga las opciones)
        await loadUser(id);
    };

    const loadProfiles = async () => {
        setLoadingProfiles(true);
        try {
            const data = await userService.getProfiles();
            setProfiles(data);
        } catch (error) {
            message.error('Error al cargar perfiles');
            console.error('Error loading profiles:', error);
        } finally {
            setLoadingProfiles(false);
        }
    };

    const loadUser = async (id: number) => {
        setLoadingUser(true);
        try {
            const user = await userService.getUserById(id);

            console.log('👤 Usuario cargado:', user);
            console.log('📋 ProfileId del usuario:', user.profileId);

            // Rellenar el formulario con los datos del usuario
            form.setFieldsValue({
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                profileId: user.profileId,  // ✅ Esto debe coincidir con un ID de perfil
                isActive: user.isActive,
                password: '', // No mostramos la contraseña actual
            });

            console.log('✅ Formulario establecido con profileId:', user.profileId);
        } catch (error) {
            message.error('Error al cargar usuario');
            console.error('Error loading user:', error);
        } finally {
            setLoadingUser(false);
        }
    };

    const handleSubmit = async (values: any) => {
        if (!userId) return;

        setLoading(true);
        try {
            const updateData: UpdateUserRequest = {
                name: values.name,
                lastName: values.lastName,
                email: values.email,
                profileId: Number(values.profileId),
                isActive: values.isActive,
            };

            // Solo incluir password si se proporcionó uno nuevo
            if (values.password && values.password.trim() !== '') {
                // Nota: El backend necesitará manejar la actualización de contraseña
                console.log('Nueva contraseña proporcionada');
            }

            await userService.updateUser(userId, updateData);
            message.success('Usuario actualizado correctamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al actualizar usuario');
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
            title="Datos Usuario"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={700}
            centered
            className={styles.modal}
        >
            {loadingUser ? (
                <div className={styles.loadingContainer}>
                    <Spin size="large" />
                </div>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
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
                            name="name"
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
                                { min: 6, message: 'Mínimo 6 caracteres' },
                            ]}
                            className={styles.formItem}
                            help="Dejar en blanco para mantener la contraseña actual"
                        >
                            <Input.Password
                                placeholder="Nueva contraseña (opcional)"
                                size="large"
                            />
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
                            Actualizar
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
            )}
        </Modal>
    );
};

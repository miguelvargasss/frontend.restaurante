import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, Spin, Switch } from 'antd';
import type { UpdateProfileRequest } from '../../types/profile.types';
import { profileService } from '../../services/profile.service';
import styles from './ProfileDetailsModal.module.css';

const { Option } = Select;
const { TextArea } = Input;

// ============================================
// Props del componente
// ============================================

interface ProfileDetailsModalProps {
    open: boolean;
    profileId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente ProfileDetailsModal
// ============================================

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
    open,
    profileId,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);

    // Cargar perfil al abrir el modal
    useEffect(() => {
        if (open && profileId) {
            loadProfile(profileId);
        }
    }, [open, profileId]);

    const loadProfile = async (id: number) => {
        setLoadingProfile(true);
        try {
            const profile = await profileService.getProfileById(id);

            // Rellenar el formulario con los datos del perfil
            form.setFieldsValue({
                name: profile.name,
                description: profile.description,
                hasAdminAccess: profile.hasAdminAccess || false,
                isActive: profile.isActive !== undefined ? profile.isActive : true,
            });
        } catch (error) {
            message.error('Error al cargar perfil');
            console.error('Error loading profile:', error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleSubmit = async (values: any) => {
        if (!profileId) return;

        setLoading(true);
        try {
            const updateData: UpdateProfileRequest = {
                name: values.name,
                description: values.description,
                hasAdminAccess: values.hasAdminAccess,
                isActive: values.isActive,
            };

            console.log('📤 Actualizando perfil:', updateData);

            await profileService.updateProfile(profileId, updateData);
            message.success('Perfil actualizado correctamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al actualizar perfil');
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
            title="Datos Perfil"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={700}
            centered
            className={styles.modal}
        >
            {loadingProfile ? (
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
                            label="Nombre del Perfil"
                            name="name"
                            rules={[{ required: true, message: 'Ingresa el nombre del perfil' }]}
                            className={styles.formItem}
                        >
                            <Input placeholder="Ej: Administrador" size="large" />
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

                    <Form.Item
                        label="Descripción"
                        name="description"
                        rules={[{ required: true, message: 'Ingresa la descripción' }]}
                    >
                        <TextArea
                            placeholder="Descripción del perfil"
                            rows={4}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Acceso de Administrador"
                        name="hasAdminAccess"
                        valuePropName="checked"
                        tooltip="Los perfiles con acceso de administrador tienen permisos completos"
                    >
                        <Switch
                            checkedChildren="Sí"
                            unCheckedChildren="No"
                        />
                    </Form.Item>

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
                            Cancelar
                        </Button>
                    </div>
                </Form>
            )}
        </Modal>
    );
};

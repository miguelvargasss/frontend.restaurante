import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import type { CreateComplaintRequest } from '../../types/complaint.types';
import { complaintService } from '../../services/complaint.service';
import styles from './CreateComplaintModal.module.css';

const { TextArea } = Input;

// ============================================
// Props del componente
// ============================================

interface CreateComplaintModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CreateComplaintModal
// ============================================

export const CreateComplaintModal: React.FC<CreateComplaintModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const complaintData: CreateComplaintRequest = {
                name: values.name,
                detail: values.detail,
            };

            await complaintService.createComplaint(complaintData);
            message.success('Reclamo creado exitosamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al crear reclamo:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al crear reclamo');
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
            title="Registro Reclamos"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
            >
                <Form.Item
                    label="Nombre"
                    name="name"
                    rules={[
                        { required: true, message: 'Ingresa el nombre' },
                        { max: 100, message: 'Máximo 100 caracteres' },
                    ]}
                    className={styles.formItem}
                >
                    <Input placeholder="Alvaro Julca Moró" size="large" />
                </Form.Item>

                <Form.Item
                    label="Detalles"
                    name="detail"
                    rules={[
                        { required: true, message: 'Ingresa los detalles' },
                        { max: 500, message: 'Máximo 500 caracteres' },
                    ]}
                    className={styles.formItem}
                >
                    <TextArea
                        placeholder="Autosize height based on content lines"
                        rows={4}
                        maxLength={500}
                        showCount
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
                        Registrar
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

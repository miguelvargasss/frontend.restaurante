import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import type { UpdateComplaintRequest } from '../../types/complaint.types';
import { complaintService } from '../../services/complaint.service';
import styles from './ComplaintDetailsModal.module.css';

const { TextArea } = Input;

// ============================================
// Props del componente
// ============================================

interface ComplaintDetailsModalProps {
    open: boolean;
    complaintId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente ComplaintDetailsModal
// ============================================

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
    open,
    complaintId,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (open && complaintId) {
            loadComplaintData();
        }
    }, [open, complaintId]);

    const loadComplaintData = async () => {
        if (!complaintId) return;

        setLoadingData(true);
        try {
            const complaint = await complaintService.getComplaintById(complaintId);
            form.setFieldsValue({
                name: complaint.name,
                detail: complaint.detail,
            });
        } catch (error) {
            message.error('Error al cargar datos del reclamo');
            console.error('Error loading complaint:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (values: any) => {
        if (!complaintId) return;

        setLoading(true);
        try {
            const updateData: UpdateComplaintRequest = {
                name: values.name,
                detail: values.detail,
                status: 'Pendiente',
                isActive: true,
            };

            await complaintService.updateComplaint(complaintId, updateData);
            message.success('Reclamo actualizado exitosamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al actualizar reclamo:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al actualizar reclamo');
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
            title="Detalles de Reclamo"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered
        >
            {loadingData ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div>
            ) : (
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
                        <Input placeholder="Nombre completo" size="large" />
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
                            placeholder="Detalles del reclamo"
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
                            Actualizar
                        </Button>
                    </div>
                </Form>
            )}
        </Modal>
    );
};

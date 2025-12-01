import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Tabs } from 'antd';
import type { CreateSuggestionRequest } from '../../types/suggestion.types';
import type { CreateComplaintRequest } from '../../types/complaint.types';
import { suggestionService } from '../../services/suggestion.service';
import { complaintService } from '../../services/complaint.service';
import styles from './CreateSuggestionComplaintModal.module.css';

const { TextArea } = Input;

// ============================================
// Props del componente
// ============================================

interface CreateSuggestionComplaintModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CreateSuggestionComplaintModal
// ============================================

export const CreateSuggestionComplaintModal: React.FC<CreateSuggestionComplaintModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('suggestion');

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (activeTab === 'suggestion') {
                const suggestionData: CreateSuggestionRequest = {
                    name: values.customerName,
                    details: values.details,
                };

                await suggestionService.createSuggestion(suggestionData);
                message.success('Sugerencia creada exitosamente');
            } else {
                const complaintData: CreateComplaintRequest = {
                    name: values.customerName,
                    detail: values.details,
                };

                await complaintService.createComplaint(complaintData);
                message.success('Reclamo creado exitosamente');
            }

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al crear:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al crear');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setActiveTab('suggestion');
        onClose();
    };

    const suggestionTab = (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.form}
        >
            <Form.Item
                label="Nombre"
                name="customerName"
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
                name="details"
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
    );

    const complaintTab = (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.form}
        >
            <Form.Item
                label="Nombre"
                name="customerName"
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
                name="details"
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
                    Siguiente
                </Button>
            </div>
        </Form>
    );

    const items = [
        {
            key: 'suggestion',
            label: 'Sugerencia',
            children: suggestionTab,
        },
        {
            key: 'complaint',
            label: 'Reclamo',
            children: complaintTab,
        },
    ];

    return (
        <Modal
            title={activeTab === 'suggestion' ? 'Registro Sugerencias' : 'Registro Reclamos'}
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered
        >
            <Tabs
                activeKey={activeTab}
                items={items}
                onChange={setActiveTab}
                className={styles.tabs}
            />
        </Modal>
    );
};

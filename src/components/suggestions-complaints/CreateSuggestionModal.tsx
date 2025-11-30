import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import type { CreateSuggestionRequest } from '../../types/suggestion.types';
import { suggestionService } from '../../services/suggestion.service';
import styles from './CreateSuggestionModal.module.css';

const { TextArea } = Input;

// ============================================
// Props del componente
// ============================================

interface CreateSuggestionModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CreateSuggestionModal
// ============================================

export const CreateSuggestionModal: React.FC<CreateSuggestionModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const suggestionData: CreateSuggestionRequest = {
                name: values.name,
                details: values.details,
            };

            await suggestionService.createSuggestion(suggestionData);
            message.success('Sugerencia creada exitosamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al crear sugerencia:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al crear sugerencia');
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
            title="Registro Sugerencias"
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
        </Modal>
    );
};

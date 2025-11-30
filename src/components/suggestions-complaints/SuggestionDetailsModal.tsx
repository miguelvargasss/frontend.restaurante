import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import type { Suggestion, UpdateSuggestionRequest } from '../../types/suggestion.types';
import { suggestionService } from '../../services/suggestion.service';
import styles from './SuggestionDetailsModal.module.css';

const { TextArea } = Input;

// ============================================
// Props del componente
// ============================================

interface SuggestionDetailsModalProps {
    open: boolean;
    suggestionId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente SuggestionDetailsModal
// ============================================

export const SuggestionDetailsModal: React.FC<SuggestionDetailsModalProps> = ({
    open,
    suggestionId,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (open && suggestionId) {
            loadSuggestionData();
        }
    }, [open, suggestionId]);

    const loadSuggestionData = async () => {
        if (!suggestionId) return;

        setLoadingData(true);
        try {
            const suggestion = await suggestionService.getSuggestionById(suggestionId);
            form.setFieldsValue({
                name: suggestion.name,
                details: suggestion.details,
            });
        } catch (error) {
            message.error('Error al cargar datos de la sugerencia');
            console.error('Error loading suggestion:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (values: any) => {
        if (!suggestionId) return;

        setLoading(true);
        try {
            const updateData: UpdateSuggestionRequest = {
                name: values.name,
                details: values.details,
                status: 'Pendiente',
                isActive: true,
            };

            await suggestionService.updateSuggestion(suggestionId, updateData);
            message.success('Sugerencia actualizada exitosamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al actualizar sugerencia:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al actualizar sugerencia');
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
            title="Detalles de Sugerencia"
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
                        name="details"
                        rules={[
                            { required: true, message: 'Ingresa los detalles' },
                            { max: 500, message: 'Máximo 500 caracteres' },
                        ]}
                        className={styles.formItem}
                    >
                        <TextArea
                            placeholder="Detalles de la sugerencia"
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

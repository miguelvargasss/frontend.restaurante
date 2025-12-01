import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, message } from 'antd';
import type { UpdateTableRequest } from '../../types/table.types';
import { tableService } from '../../services/table.service';
import styles from './TableDetailsModal.module.css';

// ============================================
// Props del componente
// ============================================

interface TableDetailsModalProps {
    open: boolean;
    tableId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente TableDetailsModal
// ============================================

export const TableDetailsModal: React.FC<TableDetailsModalProps> = ({
    open,
    tableId,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    // Cargar datos de la mesa al abrir el modal
    useEffect(() => {
        if (open && tableId) {
            loadTableData();
        }
    }, [open, tableId]);

    const loadTableData = async () => {
        if (!tableId) return;

        setLoadingData(true);
        try {
            const table = await tableService.getTableById(tableId);

            form.setFieldsValue({
                name: table.name,
                environment: table.environment,
                capacity: table.capacity,
                isActive: table.isActive,
            });
        } catch (error) {
            message.error('Error al cargar datos de la mesa');
            console.error('Error loading table:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (values: any) => {
        if (!tableId) return;

        setLoading(true);
        try {
            const tableData: UpdateTableRequest = {
                name: values.name,
                environment: values.environment,
                capacity: values.capacity,
                isActive: values.isActive === true,
            };

            await tableService.updateTable(tableId, tableData);
            message.success('Mesa actualizada exitosamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al actualizar mesa:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al actualizar mesa');
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
            title="Detalles de Mesa"
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
                <div className={styles.formRow}>
                    <Form.Item
                        label="Nombre"
                        name="name"
                        rules={[
                            { required: true, message: 'Ingresa el nombre de la mesa' },
                            { max: 20, message: 'Máximo 20 caracteres' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input placeholder="Nombre" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Estado"
                        name="isActive"
                        valuePropName="checked"
                        className={styles.formItem}
                    >
                        <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
                    </Form.Item>
                </div>

                <div className={styles.formRow}>
                    <Form.Item
                        label="Ambiente"
                        name="environment"
                        rules={[
                            { required: true, message: 'Ingresa el ambiente' },
                            { max: 50, message: 'Máximo 50 caracteres' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input placeholder="Salón Principal" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Capacidad"
                        name="capacity"
                        rules={[
                            { required: true, message: 'Ingresa la capacidad' },
                            { type: 'number', min: 1, max: 50, message: 'Capacidad entre 1 y 50' },
                        ]}
                        className={styles.formItem}
                    >
                        <InputNumber
                            placeholder="12"
                            size="large"
                            style={{ width: '100%' }}
                            min={1}
                            max={50}
                        />
                    </Form.Item>
                </div>

                <div className={styles.formActions}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading || loadingData}
                        size="large"
                        className={styles.submitButton}
                    >
                        Actualizar
                    </Button>
                    <Button onClick={handleCancel} size="large" className={styles.cancelButton}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

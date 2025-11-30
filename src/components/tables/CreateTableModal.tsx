import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, message } from 'antd';
import type { CreateTableRequest } from '../../types/table.types';
import { tableService } from '../../services/table.service';
import styles from './CreateTableModal.module.css';

// ============================================
// Props del componente
// ============================================

interface CreateTableModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CreateTableModal
// ============================================

export const CreateTableModal: React.FC<CreateTableModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const tableData: CreateTableRequest = {
                name: values.name,
                environment: values.environment,
                capacity: values.capacity,
                isActive: values.isActive === true,
            };

            await tableService.createTable(tableData);
            message.success('Mesa creada exitosamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al crear mesa:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al crear mesa');
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
            title="Registro de Mesa"
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
                initialValues={{ isActive: true }}
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
                        loading={loading}
                        size="large"
                        className={styles.submitButton}
                    >
                        Actualizar
                    </Button>
                    <Button onClick={handleCancel} size="large" className={styles.cancelButton}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

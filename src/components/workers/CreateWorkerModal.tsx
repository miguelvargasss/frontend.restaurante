import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import type { CreateWorkerRequest } from '../../types/worker.types';
import { workerService } from '../../services/worker.service';
import styles from './CreateWorkerModal.module.css';

// ============================================
// Props del componente
// ============================================

interface CreateWorkerModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CreateWorkerModal
// ============================================

export const CreateWorkerModal: React.FC<CreateWorkerModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const workerData: CreateWorkerRequest = {
                name: values.name,
                lastName: values.lastName,
                dni: values.dni,
                phone: values.phone,
                email: values.email || undefined,
                salary: values.salary,
            };

            await workerService.createWorker(workerData);
            message.success('Trabajador creado exitosamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al crear trabajador:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al crear trabajador');
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
            title="Registro Trabajador"
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
                        label="Nombre(s)"
                        name="name"
                        rules={[
                            { required: true, message: 'Ingresa el nombre' },
                            { max: 100, message: 'Máximo 100 caracteres' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input placeholder="Nombre" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Apellidos"
                        name="lastName"
                        rules={[
                            { required: true, message: 'Ingresa los apellidos' },
                            { max: 100, message: 'Máximo 100 caracteres' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input placeholder="Apellidos" size="large" />
                    </Form.Item>
                </div>

                <div className={styles.formRow}>
                    <Form.Item
                        label="DNI"
                        name="dni"
                        rules={[
                            { required: true, message: 'Ingresa el DNI' },
                            { type: 'number', message: 'Debe ser un número' },
                        ]}
                        className={styles.formItem}
                    >
                        <InputNumber
                            placeholder="11111111"
                            size="large"
                            style={{ width: '100%' }}
                            controls={false}
                            min={10000000}
                            max={99999999}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Teléfono"
                        name="phone"
                        rules={[
                            { required: true, message: 'Ingresa el teléfono' },
                            { len: 9, message: 'Debe tener 9 caracteres' },
                            { pattern: /^[0-9]+$/, message: 'Solo números' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input placeholder="999999999" size="large" maxLength={9} />
                    </Form.Item>
                </div>

                <div className={styles.formRow}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { type: 'email', message: 'Email inválido' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input placeholder="user@gmail.com" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Sueldo"
                        name="salary"
                        rules={[
                            { required: true, message: 'Ingresa el sueldo' },
                            { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' },
                        ]}
                        className={styles.formItem}
                    >
                        <InputNumber
                            placeholder="$ 00.00"
                            size="large"
                            style={{ width: '100%' }}
                            min={0}
                            step={0.01}
                            precision={2}
                            prefix="S/"
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
                        Registro
                    </Button>
                    <Button onClick={handleCancel} size="large" className={styles.cancelButton}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

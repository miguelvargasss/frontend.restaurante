import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, message, Select } from 'antd';
import type { CreateTableRequest } from '../../types/table.types';
import type { Lounge } from '../../types/lounge.types';
import { tableService } from '../../services/table.service';
import { loungeService } from '../../services/lounge.service';
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
    const [lounges, setLounges] = useState<Lounge[]>([]);

    useEffect(() => {
        if (open) {
            loadLounges();
        }
    }, [open]);

    const loadLounges = async () => {
        try {
            const response = await loungeService.getLounges({
                isActive: true,
                pageSize: 100,
            });
            setLounges(response.lounges);
        } catch (error) {
            console.error('Error al cargar ambientes:', error);
            message.error('Error al cargar ambientes');
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const selectedLounge = lounges.find(l => l.id === values.loungeId);
            
            const tableData: CreateTableRequest = {
                name: values.name,
                environment: selectedLounge?.Name || (selectedLounge as any)?.name || '',
                capacity: values.capacity,
                loungeId: values.loungeId,
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
                        name="loungeId"
                        rules={[
                            { required: true, message: 'Selecciona el ambiente' },
                        ]}
                        className={styles.formItem}
                    >
                        <Select
                            placeholder="Seleccionar ambiente"
                            size="large"
                            showSearch
                            optionFilterProp="children"
                            onChange={(value) => {
                                const selected = lounges.find(l => l.id === value);
                                const loungeName = selected?.Name || (selected as any)?.name || '';
                                form.setFieldsValue({ environment: loungeName });
                            }}
                        >
                            {lounges.map((lounge) => (
                                <Select.Option key={lounge.id} value={lounge.id}>
                                    {lounge.Name || (lounge as any).name}
                                </Select.Option>
                            ))}
                        </Select>
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
                        Registrar
                    </Button>
                    <Button onClick={handleCancel} size="large" className={styles.cancelButton}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

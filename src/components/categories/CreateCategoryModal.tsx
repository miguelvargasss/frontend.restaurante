import React, { useState } from 'react';
import { Modal, Form, Input, Switch, Button, message } from 'antd';
import type { CreateCategoryRequest } from '../../types/category.types';
import { categoryService } from '../../services/category.service';
import styles from './CreateCategoryModal.module.css';

const { TextArea } = Input;

// ============================================
// Props del componente
// ============================================

interface CreateCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CreateCategoryModal
// ============================================

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const categoryData: CreateCategoryRequest = {
                name: values.name,
                description: values.description,
                isActive: values.isActive === true,
            };

            await categoryService.createCategory(categoryData);
            message.success('Categoría creada exitosamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al crear categoría:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al crear categoría');
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
            title="Crear Categoría"
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
                            { required: true, message: 'Ingresa el nombre de la categoría' },
                            { max: 50, message: 'Máximo 50 caracteres' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input placeholder="Entradas" size="large" />
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

                <Form.Item
                    label="Descripción"
                    name="description"
                    rules={[{ max: 200, message: 'Máximo 200 caracteres' }]}
                    className={styles.formItem}
                >
                    <TextArea
                        placeholder="Descripción de la categoría"
                        rows={4}
                        maxLength={200}
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
                        Crear
                    </Button>
                    <Button onClick={handleCancel} size="large" className={styles.cancelButton}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

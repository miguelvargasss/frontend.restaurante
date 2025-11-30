import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { CreateProductRequest } from '../../types/product.types';
import type { CategorySimple } from '../../types/category.types';
import { productService } from '../../services/product.service';
import { categoryService } from '../../services/category.service';
import styles from './CreateProductModal.module.css';

const { TextArea } = Input;
const { Option } = Select;

// ============================================
// Props del componente
// ============================================

interface CreateProductModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CreateProductModal
// ============================================

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<CategorySimple[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Cargar categorías al abrir el modal
    useEffect(() => {
        if (open) {
            loadCategories();
        }
    }, [open]);

    const loadCategories = async () => {
        setLoadingCategories(true);
        try {
            const data = await categoryService.getCategoriesSimple();
            setCategories(data);

            if (!data || data.length === 0) {
                message.warning('No hay categorías disponibles. Crea una categoría primero.');
            }
        } catch (error) {
            message.error('Error al cargar categorías');
            console.error('Error loading categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const productData: CreateProductRequest = {
                name: values.name,
                price: values.price,
                description: values.description,
                imageUrl: values.imageUrl,
                categoryId: Number(values.categoryId),
                isActive: values.isActive === true,
            };

            await productService.createProduct(productData);
            message.success('Producto creado exitosamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al crear producto:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al crear producto');
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
            title="Registro de Producto"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={700}
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
                        label="Categoría"
                        name="categoryId"
                        rules={[{ required: true, message: 'Selecciona una categoría' }]}
                        className={styles.formItem}
                    >
                        <Select
                            placeholder="Categoría"
                            size="large"
                            loading={loadingCategories}
                            disabled={categories.length === 0}
                        >
                            {categories.map((category) => (
                                <Option key={category.id} value={category.id}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
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
                        label="Nombre"
                        name="name"
                        rules={[
                            { required: true, message: 'Ingresa el nombre del producto' },
                            { max: 100, message: 'Máximo 100 caracteres' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input placeholder="Nombre" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Precio"
                        name="price"
                        rules={[
                            { required: true, message: 'Ingresa el precio' },
                            { type: 'number', min: 0.01, message: 'El precio debe ser mayor a 0' },
                        ]}
                        className={styles.formItem}
                    >
                        <InputNumber
                            placeholder="Precio"
                            size="large"
                            style={{ width: '100%' }}
                            prefix="S/"
                            min={0.01}
                            step={0.01}
                            precision={2}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Descripción"
                    name="description"
                    rules={[{ max: 500, message: 'Máximo 500 caracteres' }]}
                    className={styles.formItem}
                >
                    <TextArea
                        placeholder="Nombre"
                        rows={4}
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    label="Subir Imagen"
                    name="imageUrl"
                    className={styles.formItem}
                >
                    <div className={styles.uploadContainer}>
                        <Upload
                            beforeUpload={() => false}
                            maxCount={1}
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />} size="large" block>
                                Click or drag file to this area to upload
                            </Button>
                        </Upload>
                        <p className={styles.uploadHint}>
                            O ingresa la URL de la imagen:
                        </p>
                        <Input
                            placeholder="https://ejemplo.com/imagen.jpg"
                            size="large"
                            onChange={(e) => form.setFieldValue('imageUrl', e.target.value)}
                        />
                    </div>
                </Form.Item>

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

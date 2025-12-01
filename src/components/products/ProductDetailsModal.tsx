import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Button, message } from 'antd';
import type { UpdateProductRequest } from '../../types/product.types';
import type { CategorySimple } from '../../types/category.types';
import { productService } from '../../services/product.service';
import { categoryService } from '../../services/category.service';
import styles from './ProductDetailsModal.module.css';

const { TextArea } = Input;
const { Option } = Select;

// ============================================
// Props del componente
// ============================================

interface ProductDetailsModalProps {
    open: boolean;
    productId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente ProductDetailsModal
// ============================================

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
    open,
    productId,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [categories, setCategories] = useState<CategorySimple[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Cargar datos del producto y categorías al abrir el modal
    useEffect(() => {
        if (open && productId) {
            loadProductData();
            loadCategories();
        }
    }, [open, productId]);

    const loadProductData = async () => {
        if (!productId) return;

        setLoadingData(true);
        try {
            const product = await productService.getProductById(productId);

            form.setFieldsValue({
                name: product.name,
                price: product.price,
                description: product.description,
                imageUrl: product.imageUrl,
                categoryId: product.categoryId,
                isActive: product.isActive,
            });
        } catch (error) {
            message.error('Error al cargar datos del producto');
            console.error('Error loading product:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const loadCategories = async () => {
        setLoadingCategories(true);
        try {
            const data = await categoryService.getCategoriesSimple();
            setCategories(data);
        } catch (error) {
            message.error('Error al cargar categorías');
            console.error('Error loading categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleSubmit = async (values: any) => {
        if (!productId) return;

        setLoading(true);
        try {
            const productData: UpdateProductRequest = {
                name: values.name,
                price: values.price,
                description: values.description,
                imageUrl: values.imageUrl,
                categoryId: Number(values.categoryId),
                isActive: values.isActive === true,
            };

            await productService.updateProduct(productId, productData);
            message.success('Producto actualizado exitosamente');

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al actualizar producto');
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
            title="Detalles de Producto"
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
                            disabled={loadingData || categories.length === 0}
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
                        placeholder="Descripción del producto"
                        rows={4}
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    label="URL de Imagen"
                    name="imageUrl"
                    className={styles.formItem}
                >
                    <Input
                        placeholder="https://ejemplo.com/imagen.jpg"
                        size="large"
                    />
                </Form.Item>

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

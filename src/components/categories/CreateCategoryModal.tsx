import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Input, Space, message, Popconfirm, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { categoryService } from '../../services/category.service';
import type { Category } from '../../types/category.types';
import styles from './CreateCategoryModal.module.css';

interface CreateCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (open) {
            loadCategories();
        }
    }, [open]);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryService.getCategories();
            setCategories(response.categories);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            message.error('Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newCategoryName.trim()) {
            message.warning('Ingrese un nombre para la categoría');
            return;
        }

        try {
            await categoryService.createCategory({
                name: newCategoryName.trim(),
                description: newCategoryDescription.trim(),
                isActive: true,
            });
            message.success('Categoría creada exitosamente');
            setNewCategoryName('');
            setNewCategoryDescription('');
            setIsCreating(false);
            loadCategories();
            onSuccess();
        } catch (error) {
            console.error('Error al crear categoría:', error);
            message.error('Error al crear categoría');
        }
    };

    const handleUpdate = async (category: Category, newName: string, newDescription?: string) => {
        if (!newName.trim()) {
            message.warning('El nombre no puede estar vacío');
            return;
        }

        try {
            await categoryService.updateCategory(category.id, {
                name: newName.trim(),
                description: newDescription || category.description,
                isActive: category.isActive,
            });
            message.success('Categoría actualizada exitosamente');
            setEditingCategory(null);
            loadCategories();
            onSuccess();
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            message.error('Error al actualizar categoría');
        }
    };

    const handleToggleActive = async (category: Category) => {
        try {
            await categoryService.updateCategory(category.id, {
                name: category.name,
                description: category.description,
                isActive: !category.isActive,
            });
            message.success(`Categoría ${!category.isActive ? 'activada' : 'desactivada'} exitosamente`);
            loadCategories();
            onSuccess();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            message.error('Error al cambiar estado de la categoría');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await categoryService.deleteCategory(id);
            message.success('Categoría eliminada exitosamente');
            loadCategories();
            onSuccess();
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('Error al eliminar categoría');
            }
        }
    };

    const columns: ColumnsType<Category> = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Category) => {
                if (editingCategory?.id === record.id) {
                    return (
                        <Input
                            defaultValue={text}
                            onPressEnter={(e) => handleUpdate(record, e.currentTarget.value)}
                            onBlur={(e) => {
                                if (e.target.value !== text) {
                                    handleUpdate(record, e.target.value);
                                } else {
                                    setEditingCategory(null);
                                }
                            }}
                            autoFocus
                        />
                    );
                }
                return text;
            },
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Estado',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            render: (isActive: boolean, record: Category) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleToggleActive(record)}
                    checkedChildren="Activo"
                    unCheckedChildren="Inactivo"
                />
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: 120,
            render: (_, record: Category) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => setEditingCategory(record)}
                        disabled={editingCategory?.id === record.id}
                    />
                    <Popconfirm
                        title="¿Eliminar categoría?"
                        description="Esta acción no se puede deshacer"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Modal
            title="Gestión de Categorías"
            open={open}
            onCancel={() => {
                setIsCreating(false);
                setNewCategoryName('');
                setNewCategoryDescription('');
                onClose();
            }}
            footer={null}
            width={800}
            centered
        >
            <div className={styles.container}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div className={styles.actions}>
                        {!isCreating ? (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsCreating(true)}
                            >
                                Nueva Categoría
                            </Button>
                        ) : (
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Input
                                    placeholder="Nombre de la categoría"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    style={{ width: '100%' }}
                                    autoFocus
                                />
                                <Input.TextArea
                                    placeholder="Descripción (opcional)"
                                    value={newCategoryDescription}
                                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                                    rows={3}
                                    maxLength={200}
                                    showCount
                                />
                                <Space>
                                    <Button type="primary" onClick={handleCreate}>
                                        Crear
                                    </Button>
                                    <Button onClick={() => {
                                        setIsCreating(false);
                                        setNewCategoryName('');
                                        setNewCategoryDescription('');
                                    }}>
                                        Cancelar
                                    </Button>
                                </Space>
                            </Space>
                        )}
                    </div>

                    <Table
                        columns={columns}
                        dataSource={categories}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} categorías`,
                        }}
                    />
                </Space>
            </div>
        </Modal>
    );
};

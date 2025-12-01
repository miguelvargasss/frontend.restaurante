import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Input, Space, message, Popconfirm, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { loungeService } from '../../services/lounge.service';
import type { Lounge } from '../../types/lounge.types';
import styles from './LoungeManagementModal.module.css';

interface LoungeManagementModalProps {
    open: boolean;
    onClose: () => void;
    onLoungeChange?: () => void;
}

export const LoungeManagementModal: React.FC<LoungeManagementModalProps> = ({ 
    open, 
    onClose,
    onLoungeChange 
}) => {
    const [lounges, setLounges] = useState<Lounge[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingLounge, setEditingLounge] = useState<Lounge | null>(null);
    const [newLoungeName, setNewLoungeName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (open) {
            loadLounges();
        }
    }, [open]);

    const loadLounges = async () => {
        setLoading(true);
        try {
            const response = await loungeService.getLounges({
                page: 1,
                pageSize: 100,
            });
            console.log('Ambientes recibidos:', response.lounges);
            setLounges(response.lounges);
        } catch (error) {
            console.error('Error al cargar ambientes:', error);
            message.error('Error al cargar ambientes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newLoungeName.trim()) {
            message.warning('Ingrese un nombre para el ambiente');
            return;
        }

        try {
            await loungeService.createLounge({
                Name: newLoungeName.trim(),
                isActive: true,
            });
            message.success('Ambiente creado exitosamente');
            setNewLoungeName('');
            setIsCreating(false);
            loadLounges();
            onLoungeChange?.();
        } catch (error) {
            console.error('Error al crear ambiente:', error);
            message.error('Error al crear ambiente');
        }
    };

    const handleUpdate = async (lounge: Lounge, newName: string) => {
        if (!newName.trim()) {
            message.warning('El nombre no puede estar vacío');
            return;
        }

        try {
            await loungeService.updateLounge(lounge.id, {
                Name: newName.trim(),
                isActive: lounge.isActive,
            });
            message.success('Ambiente actualizado exitosamente');
            setEditingLounge(null);
            loadLounges();
            onLoungeChange?.();
        } catch (error) {
            console.error('Error al actualizar ambiente:', error);
            message.error('Error al actualizar ambiente');
        }
    };

    const handleToggleActive = async (lounge: Lounge) => {
        try {
            await loungeService.updateLounge(lounge.id, {
                Name: lounge.Name,
                isActive: !lounge.isActive,
            });
            message.success(`Ambiente ${!lounge.isActive ? 'activado' : 'desactivado'} exitosamente`);
            loadLounges();
            onLoungeChange?.();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            message.error('Error al cambiar estado del ambiente');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await loungeService.deleteLounge(id);
            message.success('Ambiente eliminado exitosamente');
            loadLounges();
            onLoungeChange?.();
        } catch (error) {
            console.error('Error al eliminar ambiente:', error);
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('Error al eliminar ambiente');
            }
        }
    };

    const columns: ColumnsType<Lounge> = [
        {
            title: 'Nombre',
            dataIndex: 'Name',
            key: 'Name',
            render: (text: string, record: Lounge) => {
                // Soportar tanto 'Name' como 'name' del backend
                const displayName = text || (record as any).name || '';
                
                if (editingLounge?.id === record.id) {
                    return (
                        <Input
                            defaultValue={displayName}
                            onPressEnter={(e) => handleUpdate(record, e.currentTarget.value)}
                            onBlur={(e) => {
                                if (e.target.value !== displayName) {
                                    handleUpdate(record, e.target.value);
                                } else {
                                    setEditingLounge(null);
                                }
                            }}
                            autoFocus
                        />
                    );
                }
                return displayName;
            },
        },
        {
            title: 'Estado',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            render: (isActive: boolean, record: Lounge) => (
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
            render: (_, record: Lounge) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => setEditingLounge(record)}
                        disabled={editingLounge?.id === record.id}
                    />
                    <Popconfirm
                        title="¿Eliminar ambiente?"
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
            title="Gestión de Ambientes"
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
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
                                Nuevo Ambiente
                            </Button>
                        ) : (
                            <Space>
                                <Input
                                    placeholder="Nombre del ambiente"
                                    value={newLoungeName}
                                    onChange={(e) => setNewLoungeName(e.target.value)}
                                    onPressEnter={handleCreate}
                                    style={{ width: 200 }}
                                    autoFocus
                                />
                                <Button type="primary" onClick={handleCreate}>
                                    Crear
                                </Button>
                                <Button onClick={() => {
                                    setIsCreating(false);
                                    setNewLoungeName('');
                                }}>
                                    Cancelar
                                </Button>
                            </Space>
                        )}
                    </div>

                    <Table
                        columns={columns}
                        dataSource={lounges}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} ambientes`,
                        }}
                    />
                </Space>
            </div>
        </Modal>
    );
};

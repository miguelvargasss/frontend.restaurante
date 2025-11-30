import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Tag, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { CreateUserModal } from '../../components/users/CreateUserModal';
import { UserDetailsModal } from '../../components/users/UserDetailsModal';
import { userService } from '../../services/user.service';
import type { User } from '../../types/user.types';
import styles from './UsuariosPage.module.css';

// ============================================
// Página de Gestión de Usuarios
// ============================================

export const UsuariosPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        loadUsers();
    }, [pagination.current, pagination.pageSize, searchText]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers({
                search: searchText,
                page: pagination.current,
                pageSize: pagination.pageSize,
            });
            setUsers(response.users);
            setPagination((prev) => ({ ...prev, total: response.total }));
        } catch (error) {
            message.error('Error al cargar usuarios');
            setUsers([]);
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await userService.deleteUser(id);
            message.success('Usuario eliminado');
            loadUsers();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('Error al eliminar usuario');
            }
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handleOpenDetails = (userId: number) => {
        setSelectedUserId(userId);
        setDetailsModalOpen(true);
    };

    const handleCloseDetails = () => {
        setSelectedUserId(null);
        setDetailsModalOpen(false);
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '25%',
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Perfil',
            dataIndex: 'profileName',
            key: 'profileName',
            width: '15%',
        },
        {
            title: 'Estado',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '12%',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'success' : 'error'}>
                    {isActive ? 'Activo' : 'Inactivo'}
                </Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: '23%',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="middle"
                        onClick={() => handleOpenDetails(record.id)}
                    >
                        Detalles
                    </Button>
                    <Popconfirm
                        title="¿Eliminar Permanentemente?"
                        description="Esta acción no se puede deshacer"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger size="middle">
                            Eliminar
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Gestión De Usuarios</h1>

            <div className={styles.card}>
                <div className={styles.header}>
                    <h2 className={styles.subtitle}>Lista de Usuarios</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalOpen(true)}
                    >
                        Crear Usuario
                    </Button>
                </div>

                <div className={styles.searchContainer}>
                    <Input
                        placeholder="Nombre y Apellidos"
                        prefix={<SearchOutlined />}
                        onChange={(e) => handleSearch(e.target.value)}
                        className={styles.searchInput}
                        allowClear
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showTotal: (total) => `Total Usuarios: ${total}`,
                        onChange: (page, pageSize) => {
                            setPagination({ current: page, pageSize, total: pagination.total });
                        },
                    }}
                    className={styles.table}
                />
            </div>

            <CreateUserModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={loadUsers}
            />

            <UserDetailsModal
                open={detailsModalOpen}
                userId={selectedUserId}
                onClose={handleCloseDetails}
                onSuccess={loadUsers}
            />
        </div>
    );
};

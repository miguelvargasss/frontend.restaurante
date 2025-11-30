import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { CreateProfileModal } from '../../components/profiles/CreateProfileModal';
import { ProfileDetailsModal } from '../../components/profiles/ProfileDetailsModal';
import { profileService } from '../../services/profile.service';
import type { ProfileListItem } from '../../types/profile.types';
import styles from './PerfilesPage.module.css';

// ============================================
// Página de Gestión de Perfiles
// ============================================

export const PerfilesPage: React.FC = () => {
    const [profiles, setProfiles] = useState<ProfileListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        loadProfiles();
    }, [pagination.current, pagination.pageSize, searchText]);

    const loadProfiles = async () => {
        setLoading(true);
        try {
            const response = await profileService.getProfiles({
                search: searchText,
                page: pagination.current,
                pageSize: pagination.pageSize,
            });
            setProfiles(response.profiles);
            setPagination((prev) => ({ ...prev, total: response.total }));
        } catch (error) {
            message.error('Error al cargar perfiles');
            setProfiles([]);
            console.error('Error loading profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await profileService.deleteProfile(id);
            message.success('Perfil eliminado');
            loadProfiles();
        } catch (error) {
            console.error('Error al eliminar perfil:', error);
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('Error al eliminar perfil');
            }
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handleOpenDetails = (profileId: number) => {
        setSelectedProfileId(profileId);
        setDetailsModalOpen(true);
    };

    const handleCloseDetails = () => {
        setSelectedProfileId(null);
        setDetailsModalOpen(false);
    };

    const columns: ColumnsType<ProfileListItem> = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
        },
        {
            title: 'Fecha Creación',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: '20%',
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
            <h1 className={styles.title}>Gestión De Perfiles</h1>

            <div className={styles.card}>
                <div className={styles.header}>
                    <h2 className={styles.subtitle}>Lista de Perfiles</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalOpen(true)}
                    >
                        Crear Perfil
                    </Button>
                </div>

                <div className={styles.searchContainer}>
                    <Input
                        placeholder="Nombre"
                        prefix={<SearchOutlined />}
                        onChange={(e) => handleSearch(e.target.value)}
                        className={styles.searchInput}
                        allowClear
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={profiles}
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
                />
            </div>

            <CreateProfileModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={loadProfiles}
            />

            <ProfileDetailsModal
                open={detailsModalOpen}
                profileId={selectedProfileId}
                onClose={handleCloseDetails}
                onSuccess={loadProfiles}
            />
        </div>
    );
};

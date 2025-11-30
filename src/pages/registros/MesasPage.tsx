import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Popconfirm, message, Tag } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Table as TableType } from '../../types/table.types';
import { tableService } from '../../services/table.service';
import { CreateTableModal } from '../../components/tables/CreateTableModal';
import { TableDetailsModal } from '../../components/tables/TableDetailsModal';
import styles from './MesasPage.module.css';

// ============================================
// Componente MesasPage
// ============================================

export const MesasPage: React.FC = () => {
    const [tables, setTables] = useState<TableType[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // Estados para modales
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

    // Cargar mesas al montar el componente
    useEffect(() => {
        loadTables();
    }, [pagination.current, pagination.pageSize, searchText]);

    const loadTables = async () => {
        setLoading(true);
        try {
            const response = await tableService.getTables({
                page: pagination.current,
                pageSize: pagination.pageSize,
                search: searchText || undefined,
            });

            setTables(response.tables);
            setPagination((prev) => ({
                ...prev,
                total: response.total,
            }));
        } catch (error) {
            message.error('Error al cargar mesas');
            console.error('Error loading tables:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handleTableChange = (newPagination: any) => {
        setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
            total: pagination.total,
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await tableService.deleteTable(id);
            message.success('Mesa eliminada exitosamente');
            loadTables();
        } catch (error) {
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al eliminar mesa');
            }
        }
    };

    const handleCreateSuccess = () => {
        loadTables();
    };

    const handleViewDetails = (tableId: number) => {
        setSelectedTableId(tableId);
        setDetailsModalOpen(true);
    };

    const handleDetailsSuccess = () => {
        loadTables();
    };

    // Definición de columnas de la tabla
    const columns: ColumnsType<TableType> = [
        {
            title: 'ID Mesa',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Ambiente',
            dataIndex: 'environment',
            key: 'environment',
            width: '25%',
        },
        {
            title: 'Capacidad',
            dataIndex: 'capacity',
            key: 'capacity',
            width: '15%',
        },
        {
            title: 'Estado',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '15%',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Activo' : 'Inactivo'}
                </Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: '25%',
            render: (_, record) => (
                <div className={styles.actions}>
                    <Button
                        type="primary"
                        size="small"
                        className={styles.detailsButton}
                        onClick={() => handleViewDetails(record.id)}
                    >
                        Detalles
                    </Button>
                    <Popconfirm
                        title="¿Estás seguro de eliminar esta mesa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button danger size="small" className={styles.deleteButton}>
                            Eliminar
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Gestión De Mesas</h1>
            </div>

            {/* Barra de búsqueda y botón */}
            <div className={styles.toolbar}>
                <div className={styles.leftSection}>
                    <h2 className={styles.subtitle}>Lista De Mesas</h2>
                    <Input
                        placeholder="Mesa"
                        prefix={<SearchOutlined />}
                        className={styles.searchInput}
                        onChange={(e) => handleSearch(e.target.value)}
                        allowClear
                    />
                </div>
                <div className={styles.rightSection}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => setCreateModalOpen(true)}
                        className={styles.createButton}
                    >
                        Crear Mesa
                    </Button>
                </div>
            </div>

            {/* Tabla de mesas */}
            <Table
                columns={columns}
                dataSource={tables}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total Usuarios ${total}`,
                    pageSizeOptions: ['10', '20', '50'],
                }}
                onChange={handleTableChange}
                className={styles.table}
            />

            {/* Modales */}
            <CreateTableModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <TableDetailsModal
                open={detailsModalOpen}
                tableId={selectedTableId}
                onClose={() => {
                    setDetailsModalOpen(false);
                    setSelectedTableId(null);
                }}
                onSuccess={handleDetailsSuccess}
            />
        </div>
    );
};

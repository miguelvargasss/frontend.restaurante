import React, { useState, useEffect } from 'react';
import { Input, Button, Table, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Worker } from '../../types/worker.types';
import { workerService } from '../../services/worker.service';
import { CreateWorkerModal } from '../../components/workers/CreateWorkerModal';
import { WorkerDetailsModal } from '../../components/workers/WorkerDetailsModal';
import { DeleteWorkerModal } from '../../components/workers/DeleteWorkerModal';
import styles from './WorkersPage.module.css';

// ============================================
// Componente WorkersPage
// ============================================

export const WorkersPage: React.FC = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
    const [selectedWorkerName, setSelectedWorkerName] = useState('');

    // Cargar trabajadores al montar el componente
    useEffect(() => {
        loadWorkers();
    }, [pagination.current, pagination.pageSize, searchText]);

    const loadWorkers = async () => {
        setLoading(true);
        try {
            const response = await workerService.getWorkers({
                page: pagination.current,
                pageSize: pagination.pageSize,
                search: searchText || undefined,
            });

            setWorkers(response.workers);
            setPagination((prev) => ({
                ...prev,
                total: response.total,
            }));
        } catch (error) {
            message.error('Error al cargar trabajadores');
            console.error('Error loading workers:', error);
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

    const handleCreateSuccess = () => {
        loadWorkers();
    };

    const handleViewDetails = (workerId: number) => {
        setSelectedWorkerId(workerId);
        setDetailsModalOpen(true);
    };

    const handleDetailsSuccess = () => {
        loadWorkers();
    };

    const handleDeleteClick = (workerId: number, workerName: string) => {
        setSelectedWorkerId(workerId);
        setSelectedWorkerName(workerName);
        setDeleteModalOpen(true);
    };

    const handleDeleteSuccess = () => {
        loadWorkers();
    };

    // Definición de columnas de la tabla
    const columns: ColumnsType<Worker> = [
        {
            title: 'Nombre(s)',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
        },
        {
            title: 'Apellidos',
            dataIndex: 'lastName',
            key: 'lastName',
            width: '15%',
        },
        {
            title: 'DNI',
            dataIndex: 'dni',
            key: 'dni',
            width: '12%',
        },
        {
            title: 'N° Teléfono',
            dataIndex: 'phone',
            key: 'phone',
            width: '12%',
        },
        {
            title: 'Sueldo',
            dataIndex: 'salary',
            key: 'salary',
            width: '12%',
            render: (salary: number) => `S/ ${salary.toFixed(2)}`,
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: '20%',
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
                    <Button
                        danger
                        size="small"
                        className={styles.deleteButton}
                        onClick={() => handleDeleteClick(record.id, `${record.name} ${record.lastName}`)}
                    >
                        Eliminar
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Gestión De Trabajadores</h1>
            </div>

            {/* Barra de búsqueda y botón */}
            <div className={styles.toolbar}>
                <div className={styles.leftSection}>
                    <h2 className={styles.subtitle}>Lista de Trabajadores</h2>
                    <Input
                        placeholder="Nombre y Apellidos"
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
                        Crear Trabajador
                    </Button>
                </div>
            </div>

            {/* Tabla de trabajadores */}
            <Table
                columns={columns}
                dataSource={workers}
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
            <CreateWorkerModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <WorkerDetailsModal
                open={detailsModalOpen}
                workerId={selectedWorkerId}
                onClose={() => {
                    setDetailsModalOpen(false);
                    setSelectedWorkerId(null);
                }}
                onSuccess={handleDetailsSuccess}
            />

            <DeleteWorkerModal
                open={deleteModalOpen}
                workerId={selectedWorkerId}
                workerName={selectedWorkerName}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedWorkerId(null);
                    setSelectedWorkerName('');
                }}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
};

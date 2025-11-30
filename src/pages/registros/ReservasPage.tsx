import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Popconfirm, message, Tag, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Reserve } from '../../types/reserve.types';
import { reserveService } from '../../services/reserve.service';
import { CreateReserveModal } from '../../components/reserves/CreateReserveModal';
import { ReserveDetailsModal } from '../../components/reserves/ReserveDetailsModal';
import styles from './ReservasPage.module.css';
import dayjs from 'dayjs';

// ============================================
// Componente ReservasPage
// ============================================

export const ReservasPage: React.FC = () => {
    const [reserves, setReserves] = useState<Reserve[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // Estados para modales
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedReserveId, setSelectedReserveId] = useState<number | null>(null);

    // Cargar reservas al montar el componente
    useEffect(() => {
        loadReserves();
    }, [pagination.current, pagination.pageSize, searchText, selectedDate]);

    const loadReserves = async () => {
        setLoading(true);
        try {
            const response = await reserveService.getReserves({
                page: pagination.current,
                pageSize: pagination.pageSize,
                search: searchText || undefined,
                startDate: selectedDate || undefined,
            });

            setReserves(response.reserves);
            setPagination((prev) => ({
                ...prev,
                total: response.total,
            }));
        } catch (error) {
            message.error('Error al cargar reservas');
            console.error('Error loading reserves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handleDateChange = (date: any) => {
        if (date) {
            setSelectedDate(date.format('YYYY-MM-DD'));
        } else {
            setSelectedDate(null);
        }
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
            await reserveService.deleteReserve(id);
            message.success('Reserva eliminada exitosamente');
            loadReserves();
        } catch (error) {
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al eliminar reserva');
            }
        }
    };

    const handleCreateSuccess = () => {
        loadReserves();
    };

    const handleViewDetails = (reserveId: number) => {
        setSelectedReserveId(reserveId);
        setDetailsModalOpen(true);
    };

    const handleDetailsSuccess = () => {
        loadReserves();
    };

    // Definición de columnas de la tabla
    const columns: ColumnsType<Reserve> = [
        {
            title: 'Nombre',
            dataIndex: 'customerName',
            key: 'customerName',
            width: '20%',
        },
        {
            title: 'Teléfono',
            dataIndex: 'phone',
            key: 'phone',
            width: '15%',
        },
        {
            title: 'Fecha',
            dataIndex: 'reservationDate',
            key: 'reservationDate',
            width: '15%',
            render: (date: string) => dayjs(date).format('DD-MM-YYYY'),
        },
        {
            title: 'Hora',
            dataIndex: 'reservationDate',
            key: 'time',
            width: '10%',
            render: (date: string) => dayjs(date).format('HH:mm A'),
        },
        {
            title: 'Estado',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '15%',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Activo' : 'Cancelado'}
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
                        title="¿Estás seguro de eliminar esta reserva?"
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
                <h1 className={styles.title}>Gestión De Reservas</h1>
            </div>

            {/* Barra de búsqueda y botón */}
            <div className={styles.toolbar}>
                <div className={styles.leftSection}>
                    <h2 className={styles.subtitle}>Lista de Reservas</h2>
                    <Input
                        placeholder="Nombre y Apellidos"
                        prefix={<SearchOutlined />}
                        className={styles.searchInput}
                        onChange={(e) => handleSearch(e.target.value)}
                        allowClear
                    />
                    <DatePicker
                        placeholder="2020-11-08"
                        className={styles.datePicker}
                        onChange={handleDateChange}
                        format="YYYY-MM-DD"
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
                        Crear Reserva
                    </Button>
                </div>
            </div>

            {/* Tabla de reservas */}
            <Table
                columns={columns}
                dataSource={reserves}
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
            <CreateReserveModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <ReserveDetailsModal
                open={detailsModalOpen}
                reserveId={selectedReserveId}
                onClose={() => {
                    setDetailsModalOpen(false);
                    setSelectedReserveId(null);
                }}
                onSuccess={handleDetailsSuccess}
            />
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Popconfirm, message, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Suggestion } from '../../types/suggestion.types';
import type { Complaint } from '../../types/complaint.types';
import { suggestionService } from '../../services/suggestion.service';
import { complaintService } from '../../services/complaint.service';
import { CreateSuggestionModal } from '../../components/suggestions-complaints/CreateSuggestionModal';
import { CreateComplaintModal } from '../../components/suggestions-complaints/CreateComplaintModal';
import { SuggestionDetailsModal } from '../../components/suggestions-complaints/SuggestionDetailsModal';
import { ComplaintDetailsModal } from '../../components/suggestions-complaints/ComplaintDetailsModal';
import styles from './SugerenciasReclamosPage.module.css';

const { Option } = Select;

// ============================================
// Componente SugerenciasReclamosPage
// ============================================

export const SugerenciasReclamosPage: React.FC = () => {
    const [data, setData] = useState<(Suggestion | Complaint)[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<'suggestions' | 'complaints'>('suggestions');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // Estados para modales
    const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
    const [complaintModalOpen, setComplaintModalOpen] = useState(false);
    const [suggestionDetailsOpen, setSuggestionDetailsOpen] = useState(false);
    const [complaintDetailsOpen, setComplaintDetailsOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    // Cargar datos al montar el componente
    useEffect(() => {
        loadData();
    }, [pagination.current, pagination.pageSize, searchText, filterType]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (filterType === 'suggestions') {
                const response = await suggestionService.getSuggestions({
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    search: searchText || undefined,
                });

                setData(response.suggestions);
                setPagination((prev) => ({
                    ...prev,
                    total: response.total,
                }));
            } else {
                const response = await complaintService.getComplaints({
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    search: searchText || undefined,
                });

                setData(response.claims);
                setPagination((prev) => ({
                    ...prev,
                    total: response.total,
                }));
            }
        } catch (error) {
            message.error(`Error al cargar ${filterType === 'suggestions' ? 'sugerencias' : 'reclamos'}`);
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handleFilterChange = (value: 'suggestions' | 'complaints') => {
        setFilterType(value);
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
            if (filterType === 'suggestions') {
                await suggestionService.deleteSuggestion(id);
                message.success('Sugerencia eliminada exitosamente');
            } else {
                await complaintService.deleteComplaint(id);
                message.success('Reclamo eliminado exitosamente');
            }
            loadData();
        } catch (error) {
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al eliminar');
            }
        }
    };

    const handleCreateSuccess = () => {
        loadData();
    };

    const handleViewDetails = (id: number) => {
        setSelectedItemId(id);
        if (filterType === 'suggestions') {
            setSuggestionDetailsOpen(true);
        } else {
            setComplaintDetailsOpen(true);
        }
    };

    const handleDetailsSuccess = () => {
        loadData();
    };

    // Definición de columnas de la tabla
    const columns: ColumnsType<Suggestion | Complaint> = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Detalles',
            key: 'details',
            width: '45%',
            render: (_, record: any) => {
                const details = filterType === 'suggestions' ? record.details : record.detail;
                if (!details) return '-';
                return details.length > 80
                    ? `${details.substring(0, 80)}...`
                    : details;
            },
        },
        {
            title: 'Categoría',
            key: 'category',
            width: '15%',
            render: () => (
                <span>{filterType === 'suggestions' ? 'Sugerencia' : 'Reclamo'}</span>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: '15%',
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
                        title={`¿Estás seguro de eliminar esta ${filterType === 'suggestions' ? 'sugerencia' : 'reclamo'}?`}
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
                <h1 className={styles.title}>Gestión De Sugerencias / Reclamos</h1>
            </div>

            {/* Barra de búsqueda y botón */}
            <div className={styles.toolbar}>
                <div className={styles.leftSection}>
                    <h2 className={styles.subtitle}>
                        {filterType === 'suggestions' ? 'Lista de Sugerencias' : 'Lista de Reclamos'}
                    </h2>
                    <Select
                        value={filterType}
                        onChange={handleFilterChange}
                        size="large"
                        className={styles.filterSelect}
                    >
                        <Option value="suggestions">Sugerencias</Option>
                        <Option value="complaints">Reclamos</Option>
                    </Select>
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
                        onClick={() => setSuggestionModalOpen(true)}
                        className={styles.createButton}
                    >
                        Sugerencia
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => setComplaintModalOpen(true)}
                        className={styles.createButton}
                    >
                        Reclamos
                    </Button>
                </div>
            </div>

            {/* Tabla */}
            <Table
                columns={columns}
                dataSource={data}
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
            <CreateSuggestionModal
                open={suggestionModalOpen}
                onClose={() => setSuggestionModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <CreateComplaintModal
                open={complaintModalOpen}
                onClose={() => setComplaintModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <SuggestionDetailsModal
                open={suggestionDetailsOpen}
                suggestionId={selectedItemId}
                onClose={() => {
                    setSuggestionDetailsOpen(false);
                    setSelectedItemId(null);
                }}
                onSuccess={handleDetailsSuccess}
            />

            <ComplaintDetailsModal
                open={complaintDetailsOpen}
                complaintId={selectedItemId}
                onClose={() => {
                    setComplaintDetailsOpen(false);
                    setSelectedItemId(null);
                }}
                onSuccess={handleDetailsSuccess}
            />
        </div>
    );
};

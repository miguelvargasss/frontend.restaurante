import React, { useState, useEffect } from 'react';
import { Button, message, Spin, Table, Tag, Tabs } from 'antd';
import { ExclamationCircleOutlined, UserOutlined, ArrowDownOutlined, ArrowUpOutlined, RiseOutlined } from '@ant-design/icons';
import { smallBoxService } from '../../services/smallBox.service';
import type { SmallBox, CashMovement } from '../../types/smallBox.types';
import { OpenCashBoxModal } from '../../components/caja/OpenCashBoxModal';
import { CloseCashBoxModal } from '../../components/caja/CloseCashBoxModal';
import { CashMovementModal } from '../../components/caja/CashMovementModal';
import styles from './CajaPage.module.css';
import type { ColumnsType } from 'antd/es/table';

// ============================================
// Componente CajaPage
// ============================================

export const CajaPage: React.FC = () => {
    const [activeBox, setActiveBox] = useState<SmallBox | null>(null);
    const [loading, setLoading] = useState(true);
    const [openModalVisible, setOpenModalVisible] = useState(false);
    const [closeModalVisible, setCloseModalVisible] = useState(false);
    const [movementModalVisible, setMovementModalVisible] = useState(false);
    const [movementType, setMovementType] = useState<'Ingreso' | 'Egreso'>('Egreso');

    useEffect(() => {
        loadActiveBox();
    }, []);

    const loadActiveBox = async () => {
        setLoading(true);
        try {
            const box = await smallBoxService.getActiveSmallBox();
            setActiveBox(box);
        } catch (error) {
            console.error('Error al cargar caja activa:', error);
            message.error('Error al cargar información de caja');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenSuccess = () => {
        message.success('Caja abierta exitosamente');
        loadActiveBox();
    };

    const handleCloseSuccess = () => {
        message.success('Caja cerrada exitosamente');
        setActiveBox(null);
    };

    const handleMovementSuccess = () => {
        message.success('Movimiento registrado exitosamente');
        loadActiveBox();
    };

    const handleOpenMovementModal = (type: 'Ingreso' | 'Egreso') => {
        setMovementType(type);
        setMovementModalVisible(true);
    };

    // Columnas para la tabla de movimientos
    const movementsColumns: ColumnsType<CashMovement> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            align: 'center',
        },
        {
            title: 'Tipo',
            dataIndex: 'movementType',
            key: 'movementType',
            width: 120,
            align: 'center',
            render: (type: string) => (
                <Tag color={type === 'Ingreso' ? 'success' : 'error'} style={{ fontWeight: 500 }}>
                    {type}
                </Tag>
            ),
        },
        {
            title: 'Monto',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            align: 'right',
            render: (amount: number, record: CashMovement) => (
                <span style={{
                    color: record.movementType === 'Ingreso' ? '#52c41a' : '#ff4d4f',
                    fontWeight: 600,
                    fontSize: 15
                }}>
                    {record.movementType === 'Ingreso' ? '+' : '-'} S/ {amount.toFixed(2)}
                </span>
            ),
        },
        {
            title: 'Concepto',
            dataIndex: 'concept',
            key: 'concept',
            ellipsis: true,
        },
        {
            title: 'Fecha',
            dataIndex: 'movementDate',
            key: 'movementDate',
            width: 180,
            render: (date: string) => new Date(date).toLocaleString('es-PE'),
        },
    ];

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    // Estado: Sin caja activa
    if (!activeBox) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Gestión De Caja Chica</h1>
                </div>

                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <ExclamationCircleOutlined />
                    </div>
                    <div className={styles.emptyMessage}>
                        • Sesión de Caja Inactiva
                    </div>
                    <p style={{ color: '#8c8c8c', marginBottom: 24 }}>
                        No hay sesión de caja activa
                    </p>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => setOpenModalVisible(true)}
                        className={styles.startButton}
                    >
                        Iniciar Sesión de Caja
                    </Button>
                </div>

                <OpenCashBoxModal
                    open={openModalVisible}
                    onClose={() => setOpenModalVisible(false)}
                    onSuccess={handleOpenSuccess}
                />
            </div>
        );
    }

    // Estado: Caja activa
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Gestión De Caja Chica</h1>
                    <div className={styles.successBadge}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#52c41a' }} />
                        Caja Habilitada con Éxito
                    </div>
                </div>
                <Button
                    danger
                    size="large"
                    onClick={() => setCloseModalVisible(true)}
                    className={styles.closeButton}
                >
                    Cerrar Sesión
                </Button>
            </div>

            <div className={styles.activeContent}>
                {/* Información del usuario */}
                <div className={styles.statusSection}>
                    <div className={styles.statusTitle}>• Sesión de Caja Activa</div>
                </div>

                <div className={styles.statusSection}>
                    <div className={styles.statusTitle}>Usuario:</div>
                    <div className={styles.userInfo}>
                        <UserOutlined />
                        {activeBox.userName || 'Admin Sistema'}
                    </div>
                </div>

                {/* Balance Total */}
                <div className={styles.balanceSection}>
                    <div className={styles.balanceTitle}>Balance Total Actual:</div>
                    <div className={styles.balanceAmount}>
                        S/ {activeBox.currentBalance.toFixed(2)}
                    </div>
                </div>

                {/* Tarjetas de resumen */}
                <div className={styles.summaryCards}>
                    <div className={`${styles.summaryCard} ${styles.expense}`}>
                        <div className={styles.summaryCardTitle}>Total de Egresos:</div>
                        <div className={styles.summaryCardAmount}>
                            <ArrowDownOutlined />
                            {activeBox.totalExpense.toFixed(2)} S/
                        </div>
                        <div className={styles.summaryCardSubtitle}>
                            {activeBox.cashMovements.filter(m => m.movementType === 'Egreso').length} Egresos
                        </div>
                    </div>

                    <div className={`${styles.summaryCard} ${styles.income}`}>
                        <div className={styles.summaryCardTitle}>Total de Ingresos:</div>
                        <div className={styles.summaryCardAmount}>
                            <ArrowUpOutlined />
                            {activeBox.totalIncome.toFixed(2)} S/
                        </div>
                        <div className={styles.summaryCardSubtitle}>
                            {activeBox.cashMovements.filter(m => m.movementType === 'Ingreso').length} Ingresos
                        </div>
                    </div>

                    <div className={`${styles.summaryCard} ${styles.net}`}>
                        <div className={styles.summaryCardTitle}>Movimiento Neto:</div>
                        <div className={styles.summaryCardAmount}>
                            <RiseOutlined />
                            {(activeBox.totalIncome - activeBox.totalExpense).toFixed(2)} S/
                        </div>
                        <div className={styles.summaryCardSubtitle}>Diferencia</div>
                    </div>
                </div>

                <div className={styles.statusSection}>
                    <div className={styles.statusTitle}>Movimientos:</div>
                    <div className={styles.userInfo}>
                        {activeBox.cashMovements.length} Registros
                    </div>
                </div>

                {/* Botones de acción */}
                <div className={styles.actionsSection}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => handleOpenMovementModal('Egreso')}
                        danger
                    >
                        Registrar Egreso
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => handleOpenMovementModal('Ingreso')}
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    >
                        Registrar Ingreso
                    </Button>
                </div>

                {/* Tabs con Movimientos y Balance por Método de Pago */}
                <div className={styles.tabsSection}>
                    <Tabs
                        defaultActiveKey="movements"
                        items={[
                            {
                                key: 'movements',
                                label: 'Movimientos',
                                children: (
                                    <Table
                                        columns={movementsColumns}
                                        dataSource={activeBox.cashMovements}
                                        rowKey="id"
                                        pagination={{
                                            pageSize: 10,
                                            showSizeChanger: true,
                                            showTotal: (total) => `Total ${total} movimientos`,
                                        }}
                                        locale={{
                                            emptyText: 'No hay movimientos registrados',
                                        }}
                                    />
                                ),
                            },
                            {
                                key: 'reports',
                                label: 'Reportes',
                                children: (
                                    <div className={styles.paymentMethodCards}>
                                        <div className={styles.paymentMethodCard}>
                                            <div className={styles.paymentMethodName}>Efectivo</div>
                                            <div className={styles.paymentMethodBalance}>
                                                S/ {activeBox.currentBalance.toFixed(2)}
                                            </div>
                                            <div className={styles.paymentMethodDetails}>
                                                Inicial: S/ {activeBox.initialAmount.toFixed(2)}
                                            </div>
                                            <div className={`${styles.paymentMethodMovement} ${styles.positive}`}>
                                                Movimiento: +S/ {(activeBox.currentBalance - activeBox.initialAmount).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Modales */}
            <CloseCashBoxModal
                open={closeModalVisible}
                cashBox={activeBox}
                onClose={() => setCloseModalVisible(false)}
                onSuccess={handleCloseSuccess}
            />

            <CashMovementModal
                open={movementModalVisible}
                movementType={movementType}
                smallBoxId={activeBox.id}
                onClose={() => setMovementModalVisible(false)}
                onSuccess={handleMovementSuccess}
            />
        </div>
    );
};

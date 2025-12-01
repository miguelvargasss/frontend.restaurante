import React, { useState, useEffect } from 'react';
import { Modal, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { orderService } from '../../services/order.service';
import type { Order } from '../../types/order.types';
import dayjs from 'dayjs';

interface OrderHistoryModalProps {
    open: boolean;
    onClose: () => void;
    tableId?: number | null;
    onPay?: (totalAmount: number) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ open, onClose, tableId, onPay }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        if (open) {
            loadOrders();
        }
    }, [open, pagination.current]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            // Si se pasó tableId, traer todas las órdenes de esa mesa (incluidas las pendientes)
            if (tableId) {
                const response = await orderService.getOrders({
                    tableId: tableId,
                    page: 1,
                    pageSize: 100,
                });
                setOrders(response.orders);
                setPagination(prev => ({ ...prev, total: response.total }));
            } else {
                const response = await orderService.getOrders({
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    isPaid: true, // Solo órdenes pagadas para historial global
                });
                setOrders(response.orders);
                setPagination(prev => ({ ...prev, total: response.total }));
            }
        } catch (error) {
            message.error('Error al cargar historial de órdenes');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<Order> = [
        {
            title: 'N° Orden',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            width: '15%',
        },
        {
            title: 'Mesa',
            dataIndex: 'tableName',
            key: 'tableName',
            width: '15%',
        },
        {
            title: 'Fecha',
            dataIndex: 'orderDate',
            key: 'orderDate',
            width: '20%',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: '15%',
            render: (total: number) => `S/ ${total.toFixed(2)}`,
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            render: (status: string) => (
                <Tag color={status === 'Completada' ? 'green' : 'blue'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Cliente',
            dataIndex: 'customerName',
            key: 'customerName',
            width: '20%',
            render: (name: string | null) => name || '-',
        },
    ];

    // Calcular total de órdenes pendientes
    const unpaidOrders = orders.filter(order => !order.isPaid);
    const totalUnpaid = unpaidOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const hasPendingOrders = unpaidOrders.length > 0;

    const handlePayClick = () => {
        if (onPay && hasPendingOrders) {
            onPay(totalUnpaid);
        }
    };

    // Mostrar una lista simple si se filtró por mesa, sino la tabla completa
    return (
        <Modal
            title={tableId ? `Historial - Mesa ${tableId}` : 'Historial de Órdenes'}
            open={open}
            onCancel={onClose}
            footer={null}
            width={tableId ? 700 : 900}
            centered
        >
            {tableId ? (
                <div>
                    {loading && <p>Cargando...</p>}
                    {!loading && orders.length === 0 && <p>No hay órdenes para esta mesa</p>}
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {orders.map(order => (
                            <div key={order.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <strong>Orden #{order.orderNumber || order.id}</strong>
                                        <div style={{ color: '#666' }}>{order.orderDate ? dayjs(order.orderDate).format('DD/MM/YYYY HH:mm') : '-'}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 600 }}>S/ {order.total?.toFixed(2) ?? '0.00'}</div>
                                        <div style={{ color: order.isPaid ? '#16a34a' : '#ff4d4f' }}>
                                            {order.isPaid ? 'Pagada' : 'Pendiente'}
                                        </div>
                                    </div>
                                </div>
                                {order.orderDetails && (
                                    <div style={{ marginTop: 8, color: '#444' }}>
                                        {order.orderDetails.map((d: any) => (
                                            <div key={d.productId}>{d.quantity} x {d.productName} — S/ {(d.unitPrice * d.quantity).toFixed(2)}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Total y botón de pago */}
                    {hasPendingOrders && (
                        <div style={{ 
                            marginTop: '20px', 
                            padding: '16px', 
                            backgroundColor: '#f5f5f5', 
                            borderRadius: '8px' 
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '12px'
                            }}>
                                <span style={{ fontSize: '16px', fontWeight: 500 }}>
                                    Órdenes pendientes: {unpaidOrders.length}
                                </span>
                                <span style={{ fontSize: '20px', fontWeight: 700, color: '#1890ff' }}>
                                    Total: S/ {totalUnpaid.toFixed(2)}
                                </span>
                            </div>
                            <button
                                onClick={handlePayClick}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#ff4d4f',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff7875'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff4d4f'}
                            >
                                Pagar Cuenta
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={orders}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onChange: (page) => setPagination(prev => ({ ...prev, current: page })),
                        showTotal: (total) => `Total ${total} órdenes`,
                    }}
                />
            )}
        </Modal>
    );
};

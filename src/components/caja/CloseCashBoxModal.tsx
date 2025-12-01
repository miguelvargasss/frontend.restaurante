import React, { useState } from 'react';
import { Modal, Form, InputNumber, Input, Button, message, Alert, Divider, Table, Tag } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { smallBoxService } from '../../services/smallBox.service';
import type { SmallBox, CashMovement } from '../../types/smallBox.types';
import styles from './CloseCashBoxModal.module.css';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;

// ============================================
// Props del componente
// ============================================

interface CloseCashBoxModalProps {
    open: boolean;
    cashBox: SmallBox;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CloseCashBoxModal
// ============================================

export const CloseCashBoxModal: React.FC<CloseCashBoxModalProps> = ({
    open,
    cashBox,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [finalAmount, setFinalAmount] = useState(0);

    const difference = finalAmount - cashBox.currentBalance;

    // Columnas para la tabla de movimientos
    const movementsColumns: ColumnsType<CashMovement> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center',
        },
        {
            title: 'Tipo',
            dataIndex: 'movementType',
            key: 'movementType',
            width: 100,
            align: 'center',
            render: (type: string) => (
                <Tag color={type === 'Ingreso' ? 'success' : 'error'}>
                    {type}
                </Tag>
            ),
        },
        {
            title: 'Monto',
            dataIndex: 'amount',
            key: 'amount',
            width: 120,
            align: 'right',
            render: (amount: number, record: CashMovement) => (
                <span style={{
                    color: record.movementType === 'Ingreso' ? '#52c41a' : '#ff4d4f',
                    fontWeight: 600
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
            width: 160,
            render: (date: string) => new Date(date).toLocaleString('es-PE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
        },
    ];

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await smallBoxService.closeSmallBox(cashBox.id, {
                finalAmount: values.finalAmount,
                additionalNote: values.additionalNote,
            });

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al cerrar caja:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al cerrar caja');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFinalAmount(0);
        onClose();
    };

    return (
        <Modal
            title="Cerrar Sesión de Caja Chica"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={1000}
            centered
            styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
        >
            <Alert
                message="Arqueo de Caja"
                description="Realice el conteo físico del dinero y registre el monto final real."
                type="warning"
                icon={<WarningOutlined />}
                showIcon
                style={{ marginBottom: 24 }}
            />

            {/* Resumen de la sesión */}
            <div className={styles.summarySection}>
                <h3 className={styles.summaryTitle}>Resumen de la Sesión</h3>

                <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Total de Ingresos</span>
                        <span className={`${styles.summaryValue} ${styles.income}`}>
                            S/ {cashBox.totalIncome.toFixed(2)}
                        </span>
                    </div>

                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Total de Egresos</span>
                        <span className={`${styles.summaryValue} ${styles.expense}`}>
                            S/ {cashBox.totalExpense.toFixed(2)}
                        </span>
                    </div>

                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Movimientos</span>
                        <span className={styles.summaryValue}>
                            S/ {(cashBox.totalIncome - cashBox.totalExpense).toFixed(2)}
                        </span>
                    </div>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Balance Inicial:</span>
                    <span className={styles.summaryValue}>S/ {cashBox.initialAmount.toFixed(2)}</span>
                </div>

                <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel} style={{ fontWeight: 600, fontSize: 16 }}>
                        Balance Calculado:
                    </span>
                    <span className={styles.summaryValue} style={{ fontWeight: 700, fontSize: 18, color: '#1890ff' }}>
                        S/ {cashBox.currentBalance.toFixed(2)}
                    </span>
                </div>

                <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Total de Movimientos:</span>
                    <span className={styles.summaryValue}>{cashBox.cashMovements.length} registros</span>
                </div>
            </div>

            {/* Tabla de movimientos */}
            <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 12, fontWeight: 600 }}>Detalle de Movimientos:</h4>
                <Table
                    columns={movementsColumns}
                    dataSource={cashBox.cashMovements}
                    rowKey="id"
                    pagination={{ pageSize: 5, size: 'small' }}
                    size="small"
                    locale={{ emptyText: 'No hay movimientos' }}
                />
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
            >
                <Form.Item
                    label="Monto Final Real (Arqueo):"
                    name="finalAmount"
                    rules={[
                        { required: true, message: 'Ingresa el monto final real' },
                        { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' },
                    ]}
                >
                    <InputNumber
                        placeholder="S/ 00.00"
                        size="large"
                        style={{ width: '100%' }}
                        min={0}
                        step={0.01}
                        precision={2}
                        prefix="S/"
                        onChange={(value) => setFinalAmount(value || 0)}
                    />
                </Form.Item>

                {/* Diferencia */}
                {finalAmount > 0 && (
                    <div className={`${styles.differenceSection} ${difference >= 0 ? styles.positive : styles.negative}`}>
                        <div className={styles.differenceLabel}>Diferencia (Arqueo vs Calculado):</div>
                        <div className={styles.differenceAmount}>
                            {difference >= 0 ? '+' : ''}S/ {difference.toFixed(2)}
                        </div>
                        <div className={styles.differenceNote}>
                            {difference > 0 && '⚠️ Sobrante detectado'}
                            {difference < 0 && '⚠️ Faltante detectado'}
                            {difference === 0 && '✓ Arqueo conforme'}
                        </div>
                    </div>
                )}

                <Form.Item
                    label="Notas de Cierre:"
                    name="additionalNote"
                >
                    <TextArea
                        placeholder="Observaciones sobre el cierre de caja..."
                        rows={3}
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <div className={styles.formActions}>
                    <Button
                        danger
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        className={styles.submitButton}
                    >
                        Cerrar Caja
                    </Button>
                    <Button onClick={handleCancel} size="large" className={styles.cancelButton}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

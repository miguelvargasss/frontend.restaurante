import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, TimePicker, Button, message } from 'antd';
import type { CreateReserveRequest } from '../../types/reserve.types';
import type { TableSimple } from '../../types/table.types';
import { reserveService } from '../../services/reserve.service';
import { tableService } from '../../services/table.service';
import styles from './CreateReserveModal.module.css';
import dayjs from 'dayjs';

const { Option } = Select;

// ============================================
// Props del componente
// ============================================

interface CreateReserveModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CreateReserveModal
// ============================================

export const CreateReserveModal: React.FC<CreateReserveModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tables, setTables] = useState<TableSimple[]>([]);
    const [loadingTables, setLoadingTables] = useState(false);
    const [showAmountField, setShowAmountField] = useState(false);

    // Cargar mesas al abrir el modal
    useEffect(() => {
        if (open) {
            loadTables();
        }
    }, [open]);

    const loadTables = async () => {
        setLoadingTables(true);
        try {
            const data = await tableService.getTablesSimple();
            setTables(data);
        } catch (error) {
            message.error('Error al cargar mesas');
            console.error('Error loading tables:', error);
        } finally {
            setLoadingTables(false);
        }
    };

    const handleAdvancePaymentChange = (value: string) => {
        if (value === 'Si') {
            setShowAmountField(true);
            form.setFieldValue('advancePayment', true);
        } else {
            setShowAmountField(false);
            form.setFieldValue('advancePayment', false);
            form.setFieldValue('amount', 0);
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            // Combinar fecha y hora
            const reservationDate = dayjs(values.reservationDate)
                .hour(values.reservationTime.hour())
                .minute(values.reservationTime.minute())
                .second(0)
                .toISOString();

            const reserveData: CreateReserveRequest = {
                customerName: values.customerName,
                phone: values.phone,
                numberOfPeople: values.numberOfPeople,
                advancePayment: values.advancePayment === true,
                amount: values.advancePayment ? values.amount : 0,
                reservationDate: reservationDate,
                tableId: values.tableId ? Number(values.tableId) : undefined,
                isActive: true,
            };

            await reserveService.createReserve(reserveData);
            message.success('Reserva creada exitosamente');

            form.resetFields();
            setShowAmountField(false);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al crear reserva:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al crear reserva');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setShowAmountField(false);
        onClose();
    };

    return (
        <Modal
            title="Registro Reserva"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
                initialValues={{ advancePaymentSelect: 'No' }}
            >
                <Form.Item
                    label="Nombre Completo"
                    name="customerName"
                    rules={[
                        { required: true, message: 'Ingresa el nombre completo' },
                        { max: 100, message: 'Máximo 100 caracteres' },
                    ]}
                    className={styles.formItem}
                >
                    <Input placeholder="Ingresar Nombre Completo" size="large" />
                </Form.Item>

                <div className={styles.formRow}>
                    <Form.Item
                        label="Teléfono"
                        name="phone"
                        rules={[
                            { required: true, message: 'Ingresa el teléfono' },
                            { max: 9, message: 'Máximo 9 caracteres' },
                            { pattern: /^[0-9]+$/, message: 'Solo números' },
                        ]}
                        className={styles.formItem}
                    >
                        <Input placeholder="user@gmail.com" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Mesa"
                        name="tableId"
                        className={styles.formItem}
                    >
                        <Select
                            placeholder="M - 10"
                            size="large"
                            loading={loadingTables}
                            allowClear
                        >
                            {tables.map((table) => (
                                <Option key={table.id} value={table.id}>
                                    {table.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <div className={styles.formRow}>
                    <Form.Item
                        label="Fecha Reserva"
                        name="reservationDate"
                        rules={[{ required: true, message: 'Selecciona la fecha' }]}
                        className={styles.formItem}
                    >
                        <DatePicker
                            placeholder="00/00/0000"
                            size="large"
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Hora Reserva"
                        name="reservationTime"
                        rules={[{ required: true, message: 'Selecciona la hora' }]}
                        className={styles.formItem}
                    >
                        <TimePicker
                            placeholder="17:90 PM"
                            size="large"
                            style={{ width: '100%' }}
                            format="HH:mm"
                            use12Hours={false}
                        />
                    </Form.Item>
                </div>

                <div className={styles.formRow}>
                    <Form.Item
                        label="N° Personas"
                        name="numberOfPeople"
                        rules={[
                            { required: true, message: 'Ingresa el número de personas' },
                            { type: 'number', min: 1, max: 100, message: 'Entre 1 y 100 personas' },
                        ]}
                        className={styles.formItem}
                    >
                        <InputNumber
                            placeholder="07"
                            size="large"
                            style={{ width: '100%' }}
                            min={1}
                            max={100}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Pago Por Adelantado"
                        name="advancePaymentSelect"
                        className={styles.formItem}
                    >
                        <Select
                            placeholder="Si"
                            size="large"
                            onChange={handleAdvancePaymentChange}
                        >
                            <Option value="Si">Si</Option>
                            <Option value="No">No</Option>
                        </Select>
                    </Form.Item>
                </div>

                {showAmountField && (
                    <Form.Item
                        label="Monto Adelantado"
                        name="amount"
                        rules={[
                            { required: true, message: 'Ingresa el monto' },
                            { type: 'number', min: 0.01, message: 'El monto debe ser mayor a 0' },
                        ]}
                        className={styles.formItem}
                    >
                        <InputNumber
                            placeholder="$ 00.00"
                            size="large"
                            style={{ width: '100%' }}
                            prefix="S/"
                            min={0.01}
                            step={0.01}
                            precision={2}
                        />
                    </Form.Item>
                )}

                <Form.Item hidden name="advancePayment">
                    <Input />
                </Form.Item>

                <div className={styles.formActions}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        className={styles.submitButton}
                    >
                        Registro
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

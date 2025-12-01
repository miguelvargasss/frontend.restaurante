import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Input, Button, message, Alert, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { smallBoxService } from '../../services/smallBox.service';
import { paymentMethodService } from '../../services/paymentMethod.service';
import type { PaymentMethod } from '../../types/paymentMethod.types';
import styles from './OpenCashBoxModal.module.css';

const { TextArea } = Input;

// ============================================
// Props del componente
// ============================================

interface OpenCashBoxModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente OpenCashBoxModal
// ============================================

export const OpenCashBoxModal: React.FC<OpenCashBoxModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [initialAmount, setInitialAmount] = useState(0);

    useEffect(() => {
        if (open) {
            loadPaymentMethods();
            form.setFieldsValue({ paymentMethodId: 1 }); // Efectivo por defecto
        }
    }, [open]);

    const loadPaymentMethods = async () => {
        try {
            const methods = await paymentMethodService.getAll();
            setPaymentMethods(methods);
        } catch (error) {
            console.error('Error al cargar métodos de pago:', error);
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await smallBoxService.openSmallBox({
                initialAmount: values.initialAmount,
                additionalNote: values.additionalNote,
            });

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al abrir caja:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al abrir caja');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setInitialAmount(0);
        onClose();
    };

    return (
        <Modal
            title="Abrir Sesión de Caja Chica"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={700}
            centered
        >
            <Alert
                message="Abrir Caja Chica"
                description="Inicie su caja chica con un saldo inicial en soles para poder habilitar Pedidos."
                type="info"
                icon={<InfoCircleOutlined />}
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
                initialValues={{ paymentMethodId: 1, initialAmount: 0 }}
            >
                <div className={styles.formRow}>
                    <Form.Item
                        label="Balance Inicial (Efectivo)"
                        style={{ flex: 1 }}
                    >
                        <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 8 }}>
                            Método de Pago:
                        </div>
                        <Form.Item
                            name="paymentMethodId"
                            noStyle
                        >
                            <Select size="large" disabled>
                                {paymentMethods.map(method => (
                                    <Select.Option key={method.id} value={method.id}>
                                        {method.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item
                        label="Monto Inicial (Soles):"
                        name="initialAmount"
                        rules={[
                            { required: true, message: 'Ingresa el monto inicial' },
                            { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' },
                        ]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            placeholder="S/ 67.00"
                            size="large"
                            style={{ width: '100%' }}
                            min={0}
                            step={0.01}
                            precision={2}
                            prefix="S/"
                            onChange={(value) => setInitialAmount(value || 0)}
                        />
                    </Form.Item>
                </div>

                <div className={styles.totalSection}>
                    <div className={styles.totalLabel}>Total de Balances Iniciales:</div>
                    <div className={styles.totalAmount}>S/ {initialAmount.toFixed(2)}</div>
                </div>

                <Form.Item
                    label="Notas Adicionales:"
                    name="additionalNote"
                >
                    <TextArea
                        placeholder="Observaciones sobre la apertura de Caja..."
                        rows={4}
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <div className={styles.formActions}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        className={styles.submitButton}
                    >
                        Iniciar
                    </Button>
                    <Button onClick={handleCancel} size="large" className={styles.cancelButton}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

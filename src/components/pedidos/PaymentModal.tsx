import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, message, Alert, Divider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { paymentMethodService } from '../../services/paymentMethod.service';
import type { PaymentMethod } from '../../types/paymentMethod.types';
import jsPDF from 'jspdf';
import styles from './PaymentModal.module.css';

interface CartItem {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    unitPrice: number;
}

interface PaymentModalProps {
    open: boolean;
    tableName: string;
    cart: CartItem[];
    total: number;
    userName?: string;
    onClose: () => void;
    onConfirm: (paymentData: PaymentData) => Promise<void>;
}

export interface PaymentData {
    voucherType: string;
    customerDni: string;
    customerName: string;
    paymentMethodId: number;
    amount: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    open,
    tableName,
    cart,
    total,
    userName = 'Usuario',
    onClose,
    onConfirm,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [voucherType, setVoucherType] = useState<string>('Boleta');

    useEffect(() => {
        if (open) {
            loadPaymentMethods();
            form.setFieldsValue({
                voucherType: 'Boleta',
                paymentMethodId: 1, // Efectivo por defecto
                amount: total,
            });
            setVoucherType('Boleta');
        }
    }, [open, total]);

    const loadPaymentMethods = async () => {
        try {
            const methods = await paymentMethodService.getAll();
            setPaymentMethods(methods);
        } catch (error) {
            console.error('Error al cargar métodos de pago:', error);
        }
    };

    const generateTicketPDF = () => {
        try {
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, 200] // Formato ticket 80mm ancho
            });

            let y = 10;
            const lineHeight = 5;
            const margin = 5;

            // Encabezado
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('TICKET DE PEDIDO', 40, y, { align: 'center' });
            y += lineHeight * 2;

            // Línea separadora
            doc.setLineWidth(0.5);
            doc.line(margin, y, 75, y);
            y += lineHeight;

            // Información de la mesa y usuario
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('Mesa:', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.text(tableName, 20, y);
            y += lineHeight;

            doc.setFont('helvetica', 'bold');
            doc.text('Atendido por:', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.text(userName, 30, y);
            y += lineHeight;

            doc.setFont('helvetica', 'bold');
            doc.text('Fecha:', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.text(new Date().toLocaleString('es-PE'), 20, y);
            y += lineHeight * 1.5;

            // Línea separadora
            doc.line(margin, y, 75, y);
            y += lineHeight;

            // Encabezado de productos
            doc.setFont('helvetica', 'bold');
            doc.text('PRODUCTOS', 40, y, { align: 'center' });
            y += lineHeight;
            doc.line(margin, y, 75, y);
            y += lineHeight;

            // Lista de productos
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            
            cart.forEach((item) => {
                const itemTotal = item.unitPrice * item.quantity;
                
                // Nombre del producto
                doc.setFont('helvetica', 'bold');
                doc.text(item.productName, margin, y);
                y += lineHeight;
                
                // Cantidad y precio
                doc.setFont('helvetica', 'normal');
                const itemLine = `${item.quantity} x S/ ${item.unitPrice.toFixed(2)}`;
                doc.text(itemLine, margin + 2, y);
                doc.text(`S/ ${itemTotal.toFixed(2)}`, 70, y, { align: 'right' });
                y += lineHeight * 1.2;
            });

            // Línea separadora
            y += lineHeight * 0.5;
            doc.setLineWidth(0.5);
            doc.line(margin, y, 75, y);
            y += lineHeight;

            // Subtotal
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('SUBTOTAL:', margin, y);
            doc.text(`S/ ${total.toFixed(2)}`, 70, y, { align: 'right' });
            y += lineHeight * 2;

            // Línea separadora doble
            doc.line(margin, y, 75, y);
            y += 1;
            doc.line(margin, y, 75, y);
            y += lineHeight * 2;

            // Pie de página
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text('Gracias por su preferencia', 40, y, { align: 'center' });

            // Guardar PDF
            doc.save(`ticket_${tableName}_${Date.now()}.pdf`);
            message.success('Ticket generado exitosamente');
        } catch (error) {
            console.error('Error al generar ticket:', error);
            message.error('Error al generar el ticket');
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const paymentData: PaymentData = {
                voucherType: values.voucherType,
                customerDni: values.customerDni,
                customerName: values.customerName,
                paymentMethodId: values.paymentMethodId,
                amount: values.amount,
            };

            await onConfirm(paymentData);
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Error al procesar pago:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al procesar el pago');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Lista de Productos"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={900}
            centered
        >
            <div className={styles.modalContent}>
                {/* Lado izquierdo: Lista de productos */}
                <div className={styles.leftPanel}>
                    <div className={styles.productsList}>
                        {cart.map((item, index) => (
                            <div key={item.productId} className={styles.productItem}>
                                <div className={styles.productInfo}>
                                    <h4>{item.productName}</h4>
                                    <p>Masa artesanal frita rellena de abundante queso blanco derretido.</p>
                                </div>
                                <div className={styles.productDetails}>
                                    <span className={styles.quantity}>{item.quantity} Uni.</span>
                                    <span className={styles.price}>S/ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Divider />

                    <div className={styles.totalSection}>
                        <span>Total:</span>
                        <span className={styles.totalAmount}>S/ {total.toFixed(2)}</span>
                    </div>

                    <Button type="default" block size="large" className={styles.printButton} onClick={generateTicketPDF}>
                        Imprimir
                    </Button>
                </div>

                {/* Lado derecho: Formulario de pago */}
                <div className={styles.rightPanel}>
                    <div className={styles.paymentHeader}>
                        <h3>Pago Cuenta</h3>
                        <Alert
                            message={`${tableName}`}
                            description="Registre el monto final a pagar del cliente."
                            type="info"
                            icon={<InfoCircleOutlined />}
                            showIcon
                            style={{ marginBottom: 20 }}
                        />
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className={styles.form}
                    >
                        <div className={styles.formRow}>
                            <Form.Item
                                label="Comprobante:"
                                name="voucherType"
                                rules={[{ required: true, message: 'Seleccione tipo de comprobante' }]}
                                style={{ flex: 1 }}
                            >
                                <Select 
                                    size="large"
                                    onChange={(value) => {
                                        setVoucherType(value);
                                        form.setFieldsValue({ customerDni: '' });
                                    }}
                                >
                                    <Select.Option value="Boleta">Boleta</Select.Option>
                                    <Select.Option value="Factura">Factura</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={voucherType === 'Factura' ? 'RUC:' : 'DNI:'}
                                name="customerDni"
                                rules={[
                                    { required: true, message: `Ingrese ${voucherType === 'Factura' ? 'RUC' : 'DNI'}` },
                                    { 
                                        pattern: voucherType === 'Factura' ? /^\d{11}$/ : /^\d{8}$/,
                                        message: voucherType === 'Factura' 
                                            ? 'RUC debe tener 11 dígitos' 
                                            : 'DNI debe tener 8 dígitos'
                                    },
                                ]}
                                style={{ flex: 1 }}
                            >
                                <Input
                                    size="large"
                                    placeholder={voucherType === 'Factura' ? '20111111111' : '11111111'}
                                    maxLength={voucherType === 'Factura' ? 11 : 8}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label="Nombre Completo:"
                            name="customerName"
                            rules={[{ required: true, message: 'Ingrese nombre completo' }]}
                        >
                            <Input
                                size="large"
                                placeholder="Ingresar nombre y apellidos"
                            />
                        </Form.Item>

                        <div className={styles.formRow}>
                            <Form.Item
                                label="Método de Pago"
                                name="paymentMethodId"
                                rules={[{ required: true, message: 'Seleccione método de pago' }]}
                                style={{ flex: 1 }}
                            >
                                <Select size="large">
                                    {paymentMethods.map(method => (
                                        <Select.Option key={method.id} value={method.id}>
                                            {method.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Monto"
                                name="amount"
                                rules={[
                                    { required: true, message: 'Ingrese monto' },
                                    { type: 'number', min: 0, message: 'Monto inválido' },
                                ]}
                                style={{ flex: 1 }}
                            >
                                <InputNumber
                                    size="large"
                                    style={{ width: '100%' }}
                                    min={0}
                                    step={0.01}
                                    precision={2}
                                    placeholder="00.00"
                                />
                            </Form.Item>
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            block
                            className={styles.submitButton}
                        >
                            Procesar
                        </Button>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

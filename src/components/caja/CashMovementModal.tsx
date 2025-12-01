import React, { useState } from 'react';
import { Modal, Form, InputNumber, Input, Button, message, Radio } from 'antd';
import { smallBoxService } from '../../services/smallBox.service';
import styles from './CashMovementModal.module.css';

const { TextArea } = Input;

// ============================================
// Props del componente
// ============================================

interface CashMovementModalProps {
    open: boolean;
    movementType: 'Ingreso' | 'Egreso';
    smallBoxId: number;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente CashMovementModal
// ============================================

export const CashMovementModal: React.FC<CashMovementModalProps> = ({
    open,
    movementType: initialMovementType,
    smallBoxId,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [movementType, setMovementType] = useState<'Ingreso' | 'Egreso'>(initialMovementType);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await smallBoxService.addCashMovement({
                movementType: values.movementType,
                amount: values.amount,
                concept: values.concept,
                smallBoxId: smallBoxId,
            });

            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al registrar movimiento:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al registrar movimiento');
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
            title="Registrar Movimiento de Caja"
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
                initialValues={{ movementType: initialMovementType }}
            >
                <Form.Item
                    label="Tipo de Movimiento:"
                    name="movementType"
                    rules={[{ required: true, message: 'Selecciona el tipo de movimiento' }]}
                >
                    <Radio.Group
                        size="large"
                        onChange={(e) => setMovementType(e.target.value)}
                        className={styles.radioGroup}
                    >
                        <Radio.Button value="Ingreso" className={styles.radioIncome}>
                            Ingreso
                        </Radio.Button>
                        <Radio.Button value="Egreso" className={styles.radioExpense}>
                            Egreso
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="Monto:"
                    name="amount"
                    rules={[
                        { required: true, message: 'Ingresa el monto' },
                        { type: 'number', min: 0.01, message: 'Debe ser mayor a 0' },
                    ]}
                >
                    <InputNumber
                        placeholder="S/ 00.00"
                        size="large"
                        style={{ width: '100%' }}
                        min={0.01}
                        step={0.01}
                        precision={2}
                        prefix="S/"
                    />
                </Form.Item>

                <Form.Item
                    label="Concepto:"
                    name="concept"
                    rules={[
                        { required: true, message: 'Ingresa el concepto del movimiento' },
                        { max: 500, message: 'Máximo 500 caracteres' },
                    ]}
                >
                    <TextArea
                        placeholder="Describe el motivo del movimiento..."
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
                        style={{
                            backgroundColor: movementType === 'Ingreso' ? '#52c41a' : '#ff4d4f',
                            borderColor: movementType === 'Ingreso' ? '#52c41a' : '#ff4d4f',
                        }}
                    >
                        Registrar {movementType}
                    </Button>
                    <Button onClick={handleCancel} size="large" className={styles.cancelButton}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

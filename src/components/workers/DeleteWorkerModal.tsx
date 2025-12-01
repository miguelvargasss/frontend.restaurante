import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { workerService } from '../../services/worker.service';
import styles from './DeleteWorkerModal.module.css';

// ============================================
// Props del componente
// ============================================

interface DeleteWorkerModalProps {
    open: boolean;
    workerId: number | null;
    workerName: string;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Componente DeleteWorkerModal
// ============================================

export const DeleteWorkerModal: React.FC<DeleteWorkerModalProps> = ({
    open,
    workerId,
    workerName,
    onClose,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!workerId) return;

        setLoading(true);
        try {
            await workerService.deleteWorker(workerId);
            message.success('Trabajador eliminado exitosamente');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al eliminar trabajador:', error);
            if (error instanceof Error) {
                // Verificar si es error de protección
                if (error.message.includes('órdenes') || error.message.includes('reservas')) {
                    message.warning({
                        content: error.message,
                        duration: 5,
                    });
                } else {
                    message.error(`Error: ${error.message}`);
                }
            } else {
                message.error('Error al eliminar trabajador');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <span>
                    <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
                    Confirmar Eliminación
                </span>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={500}
            centered
            className={styles.modal}
        >
            <div className={styles.message}>
                ¿Estás seguro de que deseas eliminar al trabajador{' '}
                <span className={styles.workerName}>{workerName}</span>?
            </div>

            <div className={styles.warning}>
                ⚠️ Esta acción no se puede deshacer. Si el trabajador tiene órdenes o reservas asociadas,
                no podrá ser eliminado.
            </div>

            <div className={styles.actions}>
                <Button
                    danger
                    type="primary"
                    onClick={handleDelete}
                    loading={loading}
                    size="large"
                    className={styles.deleteButton}
                >
                    Eliminar
                </Button>
                <Button onClick={onClose} size="large" className={styles.cancelButton}>
                    Cancelar
                </Button>
            </div>
        </Modal>
    );
};

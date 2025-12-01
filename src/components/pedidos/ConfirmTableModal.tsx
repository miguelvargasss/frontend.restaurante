import React from 'react';
import { Modal } from 'antd';
import styles from './ConfirmTableModal.module.css';

interface ConfirmTableModalProps {
    open: boolean;
    tableName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmTableModal: React.FC<ConfirmTableModalProps> = ({
    open,
    tableName,
    onConfirm,
    onCancel,
}) => {
    return (
        <Modal
            title="Confirmar Uso de Mesa"
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            width={400}
        >
            <div className={styles.content}>
                <p className={styles.message}>
                    ¿Deseas habilitar la <strong>{tableName}</strong> para realizar pedidos?
                </p>
                <div className={styles.buttons}>
                    <button className={styles.btnNo} onClick={onCancel}>
                        No
                    </button>
                    <button className={styles.btnYes} onClick={onConfirm}>
                        Sí
                    </button>
                </div>
            </div>
        </Modal>
    );
};

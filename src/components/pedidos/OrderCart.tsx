import React from 'react';
import { Modal, Button, InputNumber, Divider } from 'antd';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './OrderCart.module.css';

interface CartItem {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    unitPrice: number;
}

interface OrderCartProps {
    open: boolean;
    cart: CartItem[];
    onClose: () => void;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onConfirm: () => void;
}

export const OrderCart: React.FC<OrderCartProps> = ({
    open,
    cart,
    onClose,
    onUpdateQuantity,
    onRemoveItem,
    onConfirm,
}) => {
    const total = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    const handleQuantityChange = (productId: number, delta: number) => {
        const item = cart.find(i => i.productId === productId);
        if (item) {
            const newQuantity = item.quantity + delta;
            if (newQuantity > 0) {
                onUpdateQuantity(productId, newQuantity);
            }
        }
    };

    return (
        <Modal
            title="Lista de Productos"
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
            centered
        >
            <div className={styles.cartContent}>
                {cart.length === 0 ? (
                    <div className={styles.emptyCart}>
                        <p>No hay productos en el carrito</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.cartItems}>
                            {cart.map(item => (
                                <div key={item.productId} className={styles.cartItem}>
                                    <div className={styles.itemInfo}>
                                        <h4>{item.productName}</h4>
                                        <p className={styles.itemDescription}>
                                            Masa artesanal frita rellena de abundante queso blanco derretido.
                                        </p>
                                    </div>

                                    <div className={styles.itemActions}>
                                        <div className={styles.quantityControl}>
                                            <Button
                                                size="small"
                                                icon={<MinusOutlined />}
                                                onClick={() => handleQuantityChange(item.productId, -1)}
                                            />
                                            <span className={styles.quantity}>{item.quantity} Uni.</span>
                                            <Button
                                                size="small"
                                                icon={<PlusOutlined />}
                                                onClick={() => handleQuantityChange(item.productId, 1)}
                                            />
                                        </div>

                                        <span className={styles.itemPrice}>
                                            S/ {(item.unitPrice * item.quantity).toFixed(2)}
                                        </span>

                                        <Button
                                            danger
                                            size="small"
                                            onClick={() => onRemoveItem(item.productId)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Divider />

                        <div className={styles.cartFooter}>
                            <div className={styles.total}>
                                <span>Total:</span>
                                <span className={styles.totalAmount}>S/ {total.toFixed(2)}</span>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={onConfirm}
                            >
                                Enviar
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

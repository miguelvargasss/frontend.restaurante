import React, { useState, useEffect } from 'react';
import { Select, Input, Card, Button, Badge, message, Spin, Pagination } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, ArrowLeftOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { tableService } from '../../services/table.service';
import { productService } from '../../services/product.service';
import { categoryService } from '../../services/category.service';
import { orderService } from '../../services/order.service';
import { smallBoxService } from '../../services/smallBox.service';
import { loungeService } from '../../services/lounge.service';
import { OrderCart } from '../../components/pedidos/OrderCart';
import { PaymentModal, type PaymentData } from '../../components/pedidos/PaymentModal';
import { OrderHistoryModal } from '../../components/pedidos/OrderHistoryModal';
import { ConfirmTableModal } from '../../components/pedidos/ConfirmTableModal';
import type { Table } from '../../types/table.types';
import type { Product } from '../../types/product.types';
import type { Category } from '../../types/category.types';
import type { Lounge } from '../../types/lounge.types';
import type { CreateOrderRequest, OrderDetail } from '../../types/order.types';
import styles from './PedidosPage.module.css';

interface CartItem {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    unitPrice: number;
}

export const PedidosPage: React.FC = () => {
    // Obtener usuario actual del Redux store
    const currentUser = useSelector((state: RootState) => state.auth.user);

    // Estados
    const [tables, setTables] = useState<Table[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [lounges, setLounges] = useState<Lounge[]>([]);
    const [selectedLoungeId, setSelectedLoungeId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTables, setTotalTables] = useState(0);
    const [cartModalVisible, setCartModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [confirmTableModalVisible, setConfirmTableModalVisible] = useState(false);
    const [tableToConfirm, setTableToConfirm] = useState<Table | null>(null);
    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
    const [allPendingOrders, setAllPendingOrders] = useState<CartItem[]>([]);
    const pageSize = 10;

    useEffect(() => {
        loadTables();
        loadCategories();
        loadLounges();
    }, [currentPage, selectedLoungeId]);

    // Auto-refresh cada 10 segundos (solo cuando no hay mesa seleccionada)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!selectedTable) {
                loadTables();
            }
        }, 10000); // 10 segundos

        return () => clearInterval(interval);
    }, [selectedTable, currentPage]);

    useEffect(() => {
        if (selectedTable) {
            loadProducts();
        }
    }, [selectedTable, selectedCategory, searchTerm]);

    const loadTables = async () => {
        setLoading(true);
        try {
            console.log('🔄 Cargando mesas...');
            const response = await tableService.getTablesWithOrders({
                page: currentPage,
                pageSize: pageSize,
                loungeId: selectedLoungeId || undefined,
            });

            console.log('✅ Respuesta recibida:', response);

            // Validar que la respuesta tenga la estructura esperada
            if (!response || !Array.isArray(response.tables)) {
                console.error('❌ Estructura de respuesta inválida:', response);
                throw new Error('La respuesta del servidor no tiene el formato esperado');
            }

            // Mapear las mesas con información del backend
            const mappedTables = response.tables.map(table => ({
                ...table,
                tableNumber: table.name,
                location: table.loungeName || table.environment,
                // isOccupied, occupiedBy, etc. ya vienen del backend
            }));

            console.log('📋 Mesas mapeadas:', mappedTables);
            setTables(mappedTables);
            setTotalTables(response.total || 0);
        } catch (error) {
            console.error('❌ Error al cargar mesas:', error);
            if (error instanceof Error) {
                message.error(`Error al cargar mesas: ${error.message}`);
            } else {
                message.error('Error al cargar mesas');
            }
            // En caso de error, asegurar que no se quede cargando
            setTables([]);
            setTotalTables(0);
        } finally {
            console.log('🏁 Finalizando carga de mesas');
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            console.log('🔄 Cargando categorías...');
            const response = await categoryService.getCategories();
            console.log('✅ Categorías recibidas:', response);

            if (!response || !Array.isArray(response.categories)) {
                console.error('❌ Estructura de categorías inválida:', response);
                setCategories([]);
                return;
            }

            setCategories(response.categories);
        } catch (error) {
            console.error('❌ Error al cargar categorías:', error);
            setCategories([]);
            // No mostramos error al usuario para categorías, ya que no es crítico
        }
    };

    const loadLounges = async () => {
        try {
            const response = await loungeService.getLounges({
                isActive: true,
                pageSize: 100,
            });
            setLounges(response.lounges);
        } catch (error) {
            console.error('Error al cargar ambientes:', error);
            setLounges([]);
        }
    };

    const loadProducts = async () => {
        try {
            const response = await productService.getProducts({
                categoryId: selectedCategory || undefined,
                search: searchTerm || undefined,
                isActive: true,
            });
            setProducts(response.products);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            message.error('Error al cargar productos');
        }
    };

    const handleTableSelect = (table: Table) => {
        // Si la mesa ya está ocupada por otro usuario, no permitir acceso
        if (table.isOccupied && table.occupiedByUserId && table.occupiedByUserId !== currentUser?.id) {
            message.warning(`Esta mesa está siendo usada por ${table.occupiedBy}`);
            return;
        }

        // Si la mesa está ocupada por el usuario actual y tiene pedidos activos (currentOrderId existe), entrar directamente
        if (table.isOccupied && table.occupiedByUserId === currentUser?.id && table.currentOrderId) {
            setSelectedTable(table);
            setCurrentOrderId(table.currentOrderId);
            return;
        }

        // Si la mesa está libre (no ocupada), mostrar modal de confirmación
        setTableToConfirm(table);
        setConfirmTableModalVisible(true);
    };

    const handleConfirmTableUse = () => {
        if (!tableToConfirm) return;

        // Marcar la mesa como ocupada por el usuario actual
        setSelectedTable(tableToConfirm);
        setCart([]);
        
        // Actualizar estado local de la mesa
        setTables(prev => prev.map(t => {
            if (t.id === tableToConfirm.id) {
                return {
                    ...t,
                    isOccupied: true,
                    occupiedBy: currentUser?.name || 'Usuario',
                    occupiedByUserId: currentUser?.id,
                } as Table;
            }
            return t;
        }));

        setConfirmTableModalVisible(false);
        setTableToConfirm(null);
        message.success(`Mesa ${tableToConfirm.tableNumber} habilitada para pedidos`);
    };

    const handleCancelTableConfirm = () => {
        setConfirmTableModalVisible(false);
        setTableToConfirm(null);
    };

    const handlePayExistingOrder = async (table: Table) => {
        // Cargar la orden existente y abrir modal de pago
        setSelectedTable(table);
        if (table.currentOrderId) {
            setCurrentOrderId(table.currentOrderId);
            
            // Cargar detalles de la orden para mostrar en el modal de pago
            try {
                const order = await orderService.getOrderById(table.currentOrderId);
                if (order.orderDetails) {
                    const cartFromOrder: CartItem[] = order.orderDetails.map(detail => ({
                        productId: detail.productId || 0,
                        productName: detail.productName,
                        quantity: detail.quantity,
                        unitPrice: detail.unitPrice,
                        productPrice: detail.unitPrice,
                    }));
                    setCart(cartFromOrder);
                }
            } catch (error) {
                console.error('Error al cargar orden:', error);
                message.error('Error al cargar detalles del pedido');
            }
        }
        setPaymentModalVisible(true);
    };

    const handleAddToCart = (product: Product) => {
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            const newItem: CartItem = {
                productId: product.id,
                quantity: 1,
                unitPrice: product.price,
                productName: product.name,
                productPrice: product.price,
            };
            setCart([...cart, newItem]);
        }
        message.success(`${product.name} agregado al carrito`);
    };

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        setCart(cart.map(item =>
            item.productId === productId
                ? { ...item, quantity }
                : item
        ));
    };

    const handleRemoveItem = (productId: number) => {
        setCart(cart.filter(item => item.productId !== productId));
        message.success('Producto eliminado del carrito');
    };

    const handleConfirmOrder = async () => {
        if (!selectedTable) return;

        try {
            // Verificar que hay caja activa
            await smallBoxService.getActiveSmallBox();
        } catch (error) {
            message.error('No hay caja activa. Por favor, abra una caja antes de crear pedidos.');
            return;
        }

        setLoading(true);
        try {
            const orderDetails: OrderDetail[] = cart.map(item => {
                const subTotal = item.unitPrice * item.quantity;
                return {
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subTotal: subTotal,
                    total: subTotal,
                };
            });

            const orderRequest: CreateOrderRequest = {
                tableId: selectedTable.id,
                paymentMethodId: 1, // Temporal, se actualizará en el pago
                orderDetails: orderDetails,
                observations: '',
            };

            const createdOrder = await orderService.createOrder(orderRequest);
            setCurrentOrderId(createdOrder.id);

            // Actualizar estado local de la mesa para reflejar que tiene un pedido pendiente
            setTables(prev => prev.map(t => {
                if (t.id === selectedTable.id) {
                    return {
                        ...t,
                        isOccupied: true,
                        occupiedBy: currentUser?.name || t.occupiedBy,
                        occupiedByUserId: currentUser?.id || t.occupiedByUserId,
                        currentOrderId: createdOrder.id,
                        currentOrderStatus: 'Pendiente',
                        currentOrderIsPaid: false,
                    } as Table;
                }
                return t;
            }));

            message.success('Pedido enviado exitosamente');
            
            // Limpiar el carrito después de enviar
            setCart([]);
            setCartModalVisible(false);
            
            // Recargar mesas para sincronizar con backend (async)
            loadTables();
        } catch (error) {
            console.error('Error al crear pedido:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al crear el pedido');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePayFromHistory = async (totalAmount: number) => {
        if (!selectedTable) return;

        // Cargar todas las órdenes pendientes de la mesa para mostrar en el modal de pago
        try {
            const response = await orderService.getOrders({
                tableId: selectedTable.id,
                isPaid: false,
            });

            const unpaidOrders = response.orders;
            
            // Convertir todas las órdenes a items del carrito para mostrar en el modal
            const allItems: CartItem[] = [];
            unpaidOrders.forEach(order => {
                if (order.orderDetails) {
                    order.orderDetails.forEach(detail => {
                        allItems.push({
                            productId: detail.productId || 0,
                            productName: detail.productName,
                            quantity: detail.quantity,
                            unitPrice: detail.unitPrice,
                            productPrice: detail.unitPrice,
                        });
                    });
                }
            });

            setAllPendingOrders(allItems);
            setHistoryModalVisible(false);
            setPaymentModalVisible(true);
        } catch (error) {
            console.error('Error al cargar órdenes pendientes:', error);
            message.error('Error al cargar las órdenes pendientes');
        }
    };

    const handleConfirmPayment = async (paymentData: PaymentData) => {
        if (!selectedTable) {
            message.error('No hay mesa seleccionada');
            return;
        }

        // Verificar que hay caja activa
        try {
            await smallBoxService.getActiveSmallBox();
        } catch (error) {
            message.error('No hay caja activa. Por favor, abra una caja antes de procesar pagos.');
            return;
        }

        try {
            // Obtener todas las órdenes pendientes de la mesa
            const response = await orderService.getOrders({
                tableId: selectedTable.id,
                isPaid: false,
            });

            const unpaidOrders = response.orders;

            if (unpaidOrders.length === 0) {
                message.warning('No hay órdenes pendientes para pagar');
                return;
            }

            // Procesar cada orden: primero actualizar info del cliente, luego marcar como pagada
            for (const order of unpaidOrders) {
                // Actualizar información del cliente y método de pago
                await orderService.updateOrder(order.id, {
                    tableId: selectedTable.id,
                    paymentMethodId: paymentData.paymentMethodId,
                    status: 'Completada',
                    customerName: paymentData.customerName,
                    isPaid: false, // Aún no, esto lo hace markAsPaid
                });

                // Marcar como pagado - ESTO CREA EL MOVIMIENTO EN CAJA
                await orderService.markAsPaid(order.id);
            }

            message.success(`${unpaidOrders.length} orden(es) pagada(s) exitosamente. Ingreso registrado en caja.`);

            // Actualizar estado local de la mesa para reflejar que ya está pagada (disponible)
            setTables(prev => prev.map(t => {
                if (t.id === selectedTable.id) {
                    return {
                        ...t,
                        isOccupied: false,
                        occupiedBy: undefined,
                        occupiedByUserId: undefined,
                        currentOrderId: undefined,
                        currentOrderStatus: undefined,
                        currentOrderIsPaid: undefined,
                    } as Table;
                }
                return t;
            }));

            // Resetear estado
            setPaymentModalVisible(false);
            setSelectedTable(null);
            setCart([]);
            setCurrentOrderId(null);
            setAllPendingOrders([]);

            // Recargar mesas para sincronizar con backend
            loadTables();
        } catch (error) {
            console.error('Error al procesar pago:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al procesar el pago');
            }
        }
    };

    const handleBackToTables = () => {
        setSelectedTable(null);
        setCart([]);
    };

    const getTableStatus = (table: Table) => {
        if (selectedTable?.id === table.id) return 'selected';
        
        // Mesa ocupada por el usuario actual con pedidos = in-process (azul)
        if (table.isOccupied && table.occupiedByUserId === currentUser?.id && table.currentOrderIsPaid === false) {
            return 'in-process';
        }
        
        // Mesa con pedidos sin pagar de otro usuario = no accesible
        if (table.isOccupied && table.occupiedByUserId && table.occupiedByUserId !== currentUser?.id) {
            return 'in-process';
        }
        
        // Mesa libre o pagada = disponible
        return 'available';
    };

    const getTableColor = (status: string) => {
        switch (status) {
            case 'available': return styles.available;
            case 'in-process': return styles.inProcess;
            case 'ready-to-pay': return styles.readyToPay;
            case 'selected': return styles.selected;
            default: return '';
        }
    };

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const paymentTotal = allPendingOrders.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    // Vista de selección de mesas
    if (!selectedTable) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Pedidos</h1>
                </div>

                <div className={styles.content}>
                    <div className={styles.filterSection}>
                        <h3>Lista de Mesas</h3>
                        <Select
                            placeholder="Seleccionar ambiente"
                            style={{ width: 200 }}
                            value={selectedLoungeId}
                            onChange={setSelectedLoungeId}
                            allowClear
                        >
                            {lounges.map(lounge => (
                                <Select.Option key={lounge.id} value={lounge.id}>
                                    {lounge.Name}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    <div className={styles.tablesGrid}>
                        {tables.map(table => {
                            const status = getTableStatus(table);
                            const isOwnTable = table.occupiedByUserId === currentUser?.id;
                            const hasUnpaidOrders = table.isOccupied && table.currentOrderIsPaid === false;
                            
                            return (
                                <Card
                                    key={table.id}
                                    className={`${styles.tableCard} ${getTableColor(status)}`}
                                    hoverable={status === 'available' || (isOwnTable && hasUnpaidOrders)}
                                    onClick={() => handleTableSelect(table)}
                                >
                                    <div className={styles.tableHeader}>
                                        <h3>MESA {table.tableNumber}</h3>
                                        <span className={styles.tableStatus}>
                                            {table.isOccupied ? (isOwnTable ? 'En Uso' : table.occupiedBy || 'Ocupada') : 'Libre'}
                                        </span>
                                    </div>
                                    <div className={styles.tableInfo}>
                                        <p>{table.location}</p>
                                        <p>Capacidad: {table.capacity}</p>
                                    </div>
                                    {table.isOccupied && (
                                        <div className={styles.occupiedInfo}>
                                            <p>Atendida por: <strong>{table.occupiedBy}</strong></p>
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>

                    <div className={styles.pagination}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalTables}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                            showTotal={(total) => `Total ${total} mesas`}
                        />
                    </div>
                </div>

                {/* Modal de confirmación de mesa */}
                <ConfirmTableModal
                    open={confirmTableModalVisible}
                    tableName={`Mesa ${tableToConfirm?.tableNumber || ''}`}
                    onConfirm={handleConfirmTableUse}
                    onCancel={handleCancelTableConfirm}
                />
            </div>
        );
    }

    // Vista de productos (cuando hay mesa seleccionada)
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBackToTables}
                        style={{ marginRight: 16 }}
                    >
                        Volver
                    </Button>
                    <h1 className={styles.title}>Pedidos - Mesa {selectedTable.tableNumber}</h1>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Button
                        icon={<UnorderedListOutlined />}
                        size="large"
                        onClick={() => setHistoryModalVisible(true)}
                        title="Ver historial de órdenes"
                    >
                        Historial
                    </Button>
                    <Badge count={cartItemCount} showZero>
                        <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            size="large"
                            disabled={cart.length === 0}
                            onClick={() => setCartModalVisible(true)}
                        >
                            Pedido
                        </Button>
                    </Badge>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.filterSection}>
                    <h3>Lista de Entradas</h3>
                    <div className={styles.filters}>
                        <Select
                            placeholder="Categoría"
                            style={{ width: 200 }}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            allowClear
                        >
                            {categories.map(cat => (
                                <Select.Option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </Select.Option>
                            ))}
                        </Select>
                        <Input
                            placeholder="Nombre"
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.productsGrid}>
                    {products.map(product => (
                        <Card
                            key={product.id}
                            className={styles.productCard}
                            cover={
                                <div className={styles.productImage}>
                                    <img
                                        src={product.imageUrl || '/placeholder-product.png'}
                                        alt={product.name}
                                    />
                                </div>
                            }
                        >
                            <div className={styles.productInfo}>
                                <span className={styles.productCategory}>
                                    {categories.find(c => c.id === product.categoryId)?.name || 'Entrada'}
                                </span>
                                <h4>{product.name}</h4>
                                <p className={styles.productDescription}>
                                    {product.description}
                                </p>
                                <div className={styles.productFooter}>
                                    <span className={styles.productPrice}>
                                        S/ {product.price.toFixed(2)}
                                    </span>
                                    <Button
                                        type="primary"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Agregar
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Modales */}
            <OrderCart
                open={cartModalVisible}
                cart={cart}
                onClose={() => setCartModalVisible(false)}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onConfirm={handleConfirmOrder}
            />

            <PaymentModal
                open={paymentModalVisible}
                tableName={`Mesa ${selectedTable.tableNumber} - ${selectedTable.location}`}
                cart={allPendingOrders.length > 0 ? allPendingOrders : cart}
                total={allPendingOrders.length > 0 ? paymentTotal : cartTotal}
                userName={currentUser?.name || 'Usuario'}
                onClose={() => {
                    setPaymentModalVisible(false);
                    setAllPendingOrders([]);
                }}
                onConfirm={handleConfirmPayment}
            />

            <OrderHistoryModal
                open={historyModalVisible}
                onClose={() => setHistoryModalVisible(false)}
                tableId={selectedTable?.id ?? null}
                onPay={handlePayFromHistory}
            />
        </div>
    );
};

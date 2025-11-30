import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Product } from '../../types/product.types';
import { productService } from '../../services/product.service';
import { CreateProductModal } from '../../components/products/CreateProductModal';
import { ProductDetailsModal } from '../../components/products/ProductDetailsModal';
import { CreateCategoryModal } from '../../components/categories/CreateCategoryModal';
import styles from './CartaPage.module.css';

// ============================================
// Componente CartaPage
// ============================================

export const CartaPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // Estados para modales
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [productDetailsModalOpen, setProductDetailsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    // Cargar productos al montar el componente
    useEffect(() => {
        loadProducts();
    }, [pagination.current, pagination.pageSize, searchText]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getProducts({
                page: pagination.current,
                pageSize: pagination.pageSize,
                search: searchText || undefined,
            });

            setProducts(response.products);
            setPagination((prev) => ({
                ...prev,
                total: response.total,
            }));
        } catch (error) {
            message.error('Error al cargar productos');
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handleTableChange = (newPagination: any) => {
        setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
            total: pagination.total,
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await productService.deleteProduct(id);
            message.success('Producto eliminado exitosamente');
            loadProducts();
        } catch (error) {
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al eliminar producto');
            }
        }
    };

    const handleProductSuccess = () => {
        loadProducts();
    };

    const handleCategorySuccess = () => {
        message.success('Ahora puedes crear productos con esta categoría');
    };

    const handleViewDetails = (productId: number) => {
        setSelectedProductId(productId);
        setProductDetailsModalOpen(true);
    };

    const handleProductDetailsSuccess = () => {
        loadProducts();
    };

    // Definición de columnas de la tabla
    const columns: ColumnsType<Product> = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Categoría',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: '15%',
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
            width: '15%',
            render: (price: number) => `S/ ${price.toFixed(2)}`,
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
            width: '35%',
            render: (description: string) => {
                if (!description) return '-';
                return description.length > 50
                    ? `${description.substring(0, 50)}...`
                    : description;
            },
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: '15%',
            render: (_, record) => (
                <div className={styles.actions}>
                    <Button
                        type="primary"
                        size="small"
                        className={styles.detailsButton}
                        onClick={() => handleViewDetails(record.id)}
                    >
                        Detalles
                    </Button>
                    <Popconfirm
                        title="¿Estás seguro de eliminar este producto?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button danger size="small" className={styles.deleteButton}>
                            Eliminar
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Gestión De Carta</h1>
            </div>

            {/* Barra de búsqueda y botones */}
            <div className={styles.toolbar}>
                <div className={styles.leftSection}>
                    <h2 className={styles.subtitle}>Lista Productos De Carta</h2>
                    <Input
                        placeholder="Nombre"
                        prefix={<SearchOutlined />}
                        className={styles.searchInput}
                        onChange={(e) => handleSearch(e.target.value)}
                        allowClear
                    />
                </div>
                <div className={styles.rightSection}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => setCategoryModalOpen(true)}
                        className={styles.createCategoryButton}
                    >
                        Crear Categoría
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => setProductModalOpen(true)}
                        className={styles.createButton}
                    >
                        Crear Producto
                    </Button>
                </div>
            </div>

            {/* Tabla de productos */}
            <Table
                columns={columns}
                dataSource={products}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total Usuarios ${total}`,
                    pageSizeOptions: ['10', '20', '50'],
                }}
                onChange={handleTableChange}
                className={styles.table}
            />

            {/* Modales */}
            <CreateProductModal
                open={productModalOpen}
                onClose={() => setProductModalOpen(false)}
                onSuccess={handleProductSuccess}
            />

            <ProductDetailsModal
                open={productDetailsModalOpen}
                productId={selectedProductId}
                onClose={() => {
                    setProductDetailsModalOpen(false);
                    setSelectedProductId(null);
                }}
                onSuccess={handleProductDetailsSuccess}
            />

            <CreateCategoryModal
                open={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onSuccess={handleCategorySuccess}
            />
        </div>
    );
};

import React from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    SettingOutlined,
    UserOutlined,
    IdcardOutlined,
    ShopOutlined,
    DollarOutlined,
    TeamOutlined,
    BarChartOutlined,
    FileTextOutlined,
    CoffeeOutlined,
    CalendarOutlined,
    CommentOutlined,
    TableOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import styles from './Sidebar.module.css';

const { Sider } = Layout;

// ============================================
// Props del Sidebar
// ============================================

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

// ============================================
// Componente Sidebar
// ============================================

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Configuración del menú
    const menuItems: MenuProps['items'] = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: 'configuracion',
            icon: <SettingOutlined />,
            label: 'Configuración',
            children: [
                {
                    key: '/configuracion/usuarios',
                    icon: <UserOutlined />,
                    label: 'Usuarios',
                },
                {
                    key: '/configuracion/perfiles',
                    icon: <IdcardOutlined />,
                    label: 'Perfiles',
                },
                {
                    key: '/configuracion/empresa',
                    icon: <ShopOutlined />,
                    label: 'Empresa',
                },
            ],
        },
        {
            key: '/caja',
            icon: <DollarOutlined />,
            label: 'Caja',
        },
        {
            key: '/trabajadores',
            icon: <TeamOutlined />,
            label: 'Trabajadores',
        },
        {
            key: 'reportes',
            icon: <BarChartOutlined />,
            label: 'Reportes',
            children: [
                {
                    key: '/reportes/gestion-cajas',
                    icon: <DollarOutlined />,
                    label: 'Gestión de Cajas',
                },
                {
                    key: '/reportes/ventas',
                    icon: <ShoppingCartOutlined />,
                    label: 'R. Ventas',
                },
                {
                    key: '/reportes/pedidos',
                    icon: <FileTextOutlined />,
                    label: 'R. Pedidos',
                },
            ],
        },
        {
            key: 'registros',
            icon: <FileTextOutlined />,
            label: 'Registros',
            children: [
                {
                    key: '/registros/carta',
                    icon: <CoffeeOutlined />,
                    label: 'Carta',
                },
                {
                    key: '/registros/reservas',
                    icon: <CalendarOutlined />,
                    label: 'Reservas',
                },
                {
                    key: '/registros/sugerencias-reclamos',
                    icon: <CommentOutlined />,
                    label: 'Sugerencias/Reclamos',
                },
                {
                    key: '/registros/mesas',
                    icon: <TableOutlined />,
                    label: 'Mesas',
                },
            ],
        },
        {
            key: '/pedidos',
            icon: <ShoppingCartOutlined />,
            label: 'Pedidos',
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
    };

    // Obtener la ruta activa
    const selectedKey = location.pathname;
    
    // Determinar qué submenús deben estar abiertos
    const getOpenKeys = (): string[] => {
        if (location.pathname.startsWith('/configuracion')) {
            return ['configuracion'];
        }
        if (location.pathname.startsWith('/reportes')) {
            return ['reportes'];
        }
        if (location.pathname.startsWith('/registros')) {
            return ['registros'];
        }
        return [];
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onToggle}
            className={styles.sider}
            width={250}
            theme="light"
        >
            <div className={styles.logo}>
                <ShopOutlined className={styles.logoIcon} />
                {!collapsed && <span className={styles.logoText}>Doña Julia</span>}
            </div>
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                defaultOpenKeys={getOpenKeys()}
                items={menuItems}
                onClick={handleMenuClick}
                className={styles.menu}
            />
        </Sider>
    );
};

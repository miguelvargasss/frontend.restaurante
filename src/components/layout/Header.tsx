import React from 'react';
import { Layout, Avatar, Badge, Dropdown } from 'antd';
import {
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutAsync } from '../../redux/authSlice';
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

// ============================================
// Props del Header
// ============================================

interface HeaderProps {
    collapsed: boolean;
    onToggle: () => void;
}

// ============================================
// Componente Header
// ============================================

export const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const handleLogout = async () => {
        await dispatch(logoutAsync());
        navigate('/login');
    };

    // Menú del usuario
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Mi Perfil',
            onClick: () => navigate('/perfil'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Configuración',
            onClick: () => navigate('/configuracion/usuarios'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Cerrar Sesión',
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <AntHeader className={styles.header}>
            <div className={styles.leftSection}>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: styles.trigger,
                    onClick: onToggle,
                })}
            </div>

            <div className={styles.rightSection}>
                {/* Notificaciones */}
                <Badge count={11} className={styles.notification}>
                    <BellOutlined className={styles.icon} />
                </Badge>

                {/* Usuario */}
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                    <div className={styles.userInfo}>
                        <Avatar
                            size="default"
                            icon={<UserOutlined />}
                            className={styles.avatar}
                        />
                        <span className={styles.userName}>{user?.name || 'Usuario'}</span>
                    </div>
                </Dropdown>
            </div>
        </AntHeader>
    );
};

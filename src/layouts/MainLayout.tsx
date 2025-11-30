import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import styles from './MainLayout.module.css';

const { Content } = Layout;

// ============================================
// Layout Principal de la Aplicación
// ============================================

export const MainLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const handleToggle = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout className={styles.layout}>
            <Sidebar collapsed={collapsed} onToggle={handleToggle} />
            <Layout className={`${styles.mainContent} ${collapsed ? styles.collapsed : ''}`}>
                <Header collapsed={collapsed} onToggle={handleToggle} />
                <Content className={styles.content}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Select, Checkbox, Button, message } from 'antd';
import type { Module, CreateProfileRequest } from '../../types/profile.types';
import { profileService } from '../../services/profile.service';
import styles from './CreateProfileModal.module.css';

const { TextArea } = Input;
const { Option } = Select;

// ============================================
// Props del componente
// ============================================

interface CreateProfileModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// ============================================
// Datos iniciales de módulos
// ============================================

const getInitialModules = (): Module[] => [
    {
        id: 'dashboard',
        name: 'dashboard',
        displayName: 'Dashboard',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Ver estadísticas', enabled: false },
            { name: 'Ver gráficos', enabled: false },
        ],
    },
    {
        id: 'usuarios',
        name: 'usuarios',
        displayName: 'Configuración - Usuarios',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Crear usuario', enabled: false },
            { name: 'Editar usuario', enabled: false },
            { name: 'Ver detalles', enabled: false },
        ],
    },
    {
        id: 'perfiles',
        name: 'perfiles',
        displayName: 'Configuración - Perfiles',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Crear perfil', enabled: false },
            { name: 'Asignar permisos', enabled: false },
            { name: 'Ver detalles', enabled: false },
        ],
    },
    {
        id: 'empresa',
        name: 'empresa',
        displayName: 'Configuración - Empresa',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Editar información', enabled: false },
            { name: 'Configurar horarios', enabled: false },
        ],
    },
    {
        id: 'caja',
        name: 'caja',
        displayName: 'Caja',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Abrir caja', enabled: false },
            { name: 'Cerrar caja', enabled: false },
            { name: 'Registrar movimiento', enabled: false },
        ],
    },
    {
        id: 'trabajadores',
        name: 'trabajadores',
        displayName: 'Trabajadores',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Crear trabajador', enabled: false },
            { name: 'Editar trabajador', enabled: false },
            { name: 'Ver asistencia', enabled: false },
        ],
    },
    {
        id: 'reporte-cajas',
        name: 'reporte-cajas',
        displayName: 'Reportes - Gestión de Cajas',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Exportar reporte', enabled: false },
            { name: 'Ver detalle', enabled: false },
        ],
    },
    {
        id: 'reporte-ventas',
        name: 'reporte-ventas',
        displayName: 'Reportes - Ventas',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Exportar reporte', enabled: false },
            { name: 'Ver estadísticas', enabled: false },
        ],
    },
    {
        id: 'reporte-pedidos',
        name: 'reporte-pedidos',
        displayName: 'Reportes - Pedidos',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Exportar reporte', enabled: false },
            { name: 'Ver detalle', enabled: false },
        ],
    },
    {
        id: 'carta',
        name: 'carta',
        displayName: 'Registros - Carta',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Crear plato', enabled: false },
            { name: 'Editar plato', enabled: false },
            { name: 'Gestionar categorías', enabled: false },
        ],
    },
    {
        id: 'reservas',
        name: 'reservas',
        displayName: 'Registros - Reservas',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Crear reserva', enabled: false },
            { name: 'Editar reserva', enabled: false },
            { name: 'Cancelar reserva', enabled: false },
        ],
    },
    {
        id: 'sugerencias',
        name: 'sugerencias',
        displayName: 'Registros - Sugerencias/Reclamos',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Ver sugerencias', enabled: false },
            { name: 'Responder reclamo', enabled: false },
        ],
    },
    {
        id: 'mesas',
        name: 'mesas',
        displayName: 'Registros - Mesas',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Crear mesa', enabled: false },
            { name: 'Editar mesa', enabled: false },
            { name: 'Asignar mesa', enabled: false },
        ],
    },
    {
        id: 'pedidos',
        name: 'pedidos',
        displayName: 'Pedidos',
        permissions: { view: false, edit: false, delete: false },
        components: [
            { name: 'Crear pedido', enabled: false },
            { name: 'Editar pedido', enabled: false },
            { name: 'Cancelar pedido', enabled: false },
            { name: 'Ver estado cocina', enabled: false },
        ],
    },
];

// ============================================
// Componente CreateProfileModal
// ============================================

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('perfil');
    const [modules, setModules] = useState<Module[]>(getInitialModules());
    const [selectedModule, setSelectedModule] = useState<string>('');

    const handlePermissionChange = (
        moduleId: string,
        permissionType: 'view' | 'edit' | 'delete',
        checked: boolean
    ) => {
        setModules((prev) =>
            prev.map((module) =>
                module.id === moduleId
                    ? {
                        ...module,
                        permissions: { ...module.permissions, [permissionType]: checked },
                    }
                    : module
            )
        );
    };

    const handleComponentChange = (
        moduleId: string,
        componentName: string,
        checked: boolean
    ) => {
        setModules((prev) =>
            prev.map((module) =>
                module.id === moduleId
                    ? {
                        ...module,
                        components: module.components.map((comp) =>
                            comp.name === componentName ? { ...comp, enabled: checked } : comp
                        ),
                    }
                    : module
            )
        );
    };

    const handleNextTab = async () => {
        try {
            // Validar que los campos de nombre y descripción estén llenos
            await form.validateFields(['name', 'description']);
            // Si la validación pasa, cambiar al tab de permisos
            setActiveTab('permisos');
        } catch (error) {
            // Si hay errores de validación, Ant Design los mostrará automáticamente
            console.log('Validación fallida:', error);
        }
    };

    const hasAnyPermission = (): boolean => {
        // Verificar si al menos un módulo tiene algún permiso activado
        return modules.some(module =>
            module.permissions.view ||
            module.permissions.edit ||
            module.permissions.delete ||
            module.components.some(comp => comp.enabled)
        );
    };

    const handleSubmit = async (values: any) => {
        // Validar que al menos un permiso esté seleccionado
        if (!hasAnyPermission()) {
            message.error('Debes seleccionar al menos un permiso para crear el perfil');
            return;
        }

        setLoading(true);
        try {
            const profileData: CreateProfileRequest = {
                name: values.name,
                description: values.description,
                modules: modules,
            };

            console.log('Enviando perfil al backend:', profileData);

            await profileService.createProfile(profileData);
            message.success('Perfil creado exitosamente');

            form.resetFields();
            setModules(getInitialModules());
            setSelectedModule('');
            setActiveTab('perfil');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al crear perfil:', error);
            if (error instanceof Error) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error('Error al crear perfil');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setModules(getInitialModules());
        setSelectedModule('');
        setActiveTab('perfil');
        onClose();
    };

    const renderPerfilTab = () => (
        <div className={styles.tabContent}>
            <Form.Item
                label="Nombre"
                name="name"
                rules={[{ required: true, message: 'Ingresa el nombre del perfil' }]}
            >
                <Input placeholder="Administrador" size="large" />
            </Form.Item>

            <Form.Item
                label="Descripción"
                name="description"
                rules={[{ required: true, message: 'Ingresa la descripción' }]}
            >
                <TextArea placeholder="Nota" rows={4} />
            </Form.Item>
        </div>
    );

    const renderPermisosTab = () => {
        const currentModule = modules.find((m) => m.id === selectedModule);

        return (
            <div className={styles.tabContent}>
                <Form.Item label="Opciones">
                    <Select
                        placeholder="Seleccionar módulo"
                        value={selectedModule || undefined}
                        onChange={setSelectedModule}
                        size="large"
                    >
                        {modules.map((module) => (
                            <Option key={module.id} value={module.id}>
                                {module.displayName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {currentModule && (
                    <div className={styles.permissionsContainer}>
                        <div className={styles.permissionSection}>
                            <h4>{currentModule.displayName}:</h4>
                            <div className={styles.permissionRow}>
                                <span className={styles.permissionLabel}>Permisos:</span>
                                <Checkbox
                                    checked={currentModule.permissions.view}
                                    onChange={(e) =>
                                        handlePermissionChange(
                                            currentModule.id,
                                            'view',
                                            e.target.checked
                                        )
                                    }
                                >
                                    Ver
                                </Checkbox>
                                <Checkbox
                                    checked={currentModule.permissions.edit}
                                    onChange={(e) =>
                                        handlePermissionChange(
                                            currentModule.id,
                                            'edit',
                                            e.target.checked
                                        )
                                    }
                                >
                                    Editar
                                </Checkbox>
                                <Checkbox
                                    checked={currentModule.permissions.delete}
                                    onChange={(e) =>
                                        handlePermissionChange(
                                            currentModule.id,
                                            'delete',
                                            e.target.checked
                                        )
                                    }
                                >
                                    Eliminar
                                </Checkbox>
                            </div>
                        </div>

                        {currentModule.components.length > 0 && (
                            <div className={styles.permissionSection}>
                                <div className={styles.permissionRow}>
                                    <span className={styles.permissionLabel}>Componentes:</span>
                                    {currentModule.components.map((component) => (
                                        <Checkbox
                                            key={component.name}
                                            checked={component.enabled}
                                            onChange={(e) =>
                                                handleComponentChange(
                                                    currentModule.id,
                                                    component.name,
                                                    e.target.checked
                                                )
                                            }
                                        >
                                            {component.name}
                                        </Checkbox>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const items = [
        {
            key: 'perfil',
            label: 'Perfil',
            children: renderPerfilTab(),
        },
        {
            key: 'permisos',
            label: 'Permisos',
            children: renderPermisosTab(),
        },
    ];

    return (
        <Modal
            title="Crear perfil nuevo"
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={800}
            centered
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
                <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} />

                <div className={styles.formActions}>
                    {activeTab === 'perfil' ? (
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleNextTab}
                            className={styles.nextButton}
                        >
                            Siguiente
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                className={styles.submitButton}
                            >
                                Registro
                            </Button>
                            <Button onClick={handleCancel} size="large">
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
            </Form>
        </Modal>
    );
};

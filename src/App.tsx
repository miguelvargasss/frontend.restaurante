import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { themeConfig } from './conf/theme.config';
import { LoginPage } from './pages/auth/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

// Páginas
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { UsuariosPage } from './pages/configuracion/UsuariosPage';
import { PerfilesPage } from './pages/configuracion/PerfilesPage';
import { EmpresaPage } from './pages/configuracion/EmpresaPage';
import { CajaPage } from './pages/CajaPage';
import { TrabajadoresPage } from './pages/TrabajadoresPage';
import { PedidosPage } from './pages/pedidos/PedidosPage';

// Reportes
import { GestionCajasPage } from './pages/reportes/GestionCajasPage';
import { VentasPage } from './pages/reportes/VentasPage';
import { PedidosReportePage } from './pages/reportes/PedidosReportePage';

// Registros
import { CartaPage } from './pages/registros/CartaPage';
import { ReservasPage } from './pages/registros/ReservasPage';
import { SugerenciasReclamosPage } from './pages/registros/SugerenciasReclamosPage';
import { MesasPage } from './pages/registros/MesasPage';

import './App.css';

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Routes>
        {/* Ruta de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Configuración */}
          <Route path="configuracion">
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="perfiles" element={<PerfilesPage />} />
            <Route path="empresa" element={<EmpresaPage />} />
          </Route>

          {/* Caja */}
          <Route path="caja" element={<CajaPage />} />

          {/* Trabajadores */}
          <Route path="trabajadores" element={<TrabajadoresPage />} />

          {/* Reportes */}
          <Route path="reportes">
            <Route path="gestion-cajas" element={<GestionCajasPage />} />
            <Route path="ventas" element={<VentasPage />} />
            <Route path="pedidos" element={<PedidosReportePage />} />
          </Route>

          {/* Registros */}
          <Route path="registros">
            <Route path="carta" element={<CartaPage />} />
            <Route path="reservas" element={<ReservasPage />} />
            <Route path="sugerencias-reclamos" element={<SugerenciasReclamosPage />} />
            <Route path="mesas" element={<MesasPage />} />
          </Route>

          {/* Pedidos */}
          <Route path="pedidos" element={<PedidosPage />} />
        </Route>

        {/* Ruta 404 - Redirige al dashboard si está autenticado */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;

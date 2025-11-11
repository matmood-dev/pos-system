import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import PosPage from './pages/PosPage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';
import OrdersPage from './pages/OrdersPage';
import SettingsPage from './pages/SettingsPage';
import { GlobalStyles } from './styles/GlobalStyles';
import { useState } from 'react';

function App() {
  const [activePage, setActivePage] = useState('pos');

  const renderPage = () => {
    switch (activePage) {
      case 'pos':
        return <PosPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'reports':
        return <ReportsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <PosPage />;
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'pos':
        return 'Point of Sale System';
      case 'inventory':
        return 'Inventory Management';
      case 'reports':
        return 'Sales Reports';
      case 'orders':
        return 'Order History';
      case 'settings':
        return 'Settings';
      default:
        return 'Point of Sale System';
    }
  };

  return (
    <ThemeProvider>
      <CartProvider>
        <GlobalStyles />
        <Layout
          activePage={activePage}
          onPageChange={setActivePage}
          title={getPageTitle()}
        >
          {renderPage()}
        </Layout>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
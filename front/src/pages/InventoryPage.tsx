import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  font-size: 2rem;
`;

const PageContent = styled.div`
  background: ${props => props.theme.colors.glass};
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid ${props => props.theme.colors.glassBorder};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const InventoryPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Inventory Management</PageTitle>
      <PageContent>
        <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '20px' }}>
          Manage your product inventory here.
        </p>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Current Stock</h3>
            <p style={{ margin: 0, color: '#666' }}>View and update product quantities</p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Low Stock Alerts</h3>
            <p style={{ margin: 0, color: '#666' }}>Products that need restocking</p>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default InventoryPage;
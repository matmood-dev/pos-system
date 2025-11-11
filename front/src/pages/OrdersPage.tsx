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

const OrdersPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Order History</PageTitle>
      <PageContent>
        <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '20px' }}>
          View and manage completed orders.
        </p>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Order #12345</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>2 items • $24.99 • Today 2:30 PM</p>
            </div>
            <span style={{
              padding: '5px 10px',
              background: '#10b981',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              Completed
            </span>
          </div>
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Order #12344</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>1 item • $12.99 • Yesterday 5:15 PM</p>
            </div>
            <span style={{
              padding: '5px 10px',
              background: '#10b981',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              Completed
            </span>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default OrdersPage;
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

const SettingsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Settings</PageTitle>
      <PageContent>
        <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '20px' }}>
          Configure your POS system settings.
        </p>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Store Information</h3>
            <p style={{ margin: 0, color: '#666' }}>Update store name, address, and contact details</p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Payment Methods</h3>
            <p style={{ margin: 0, color: '#666' }}>Configure accepted payment options</p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Printer Settings</h3>
            <p style={{ margin: 0, color: '#666' }}>Configure receipt and label printers</p>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default SettingsPage;
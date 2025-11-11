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

const ReportsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Sales Reports</PageTitle>
      <PageContent>
        <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '20px' }}>
          View detailed sales analytics and reports.
        </p>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Daily Sales</h3>
            <p style={{ margin: 0, color: '#666' }}>Today's revenue: $1,245.67</p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Weekly Summary</h3>
            <p style={{ margin: 0, color: '#666' }}>This week's total: $8,932.45</p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Top Products</h3>
            <p style={{ margin: 0, color: '#666' }}>Most popular items this month</p>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default ReportsPage;
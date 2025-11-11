import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar';
import type { NavItem } from './Sidebar';
import { HiCash, HiOutlineCog, HiOutlineClipboardList, HiOutlineChartBar, HiOutlineCheckCircle, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  transition: background 0.3s ease;
`;

const Header = styled.header`
  background: ${props => props.theme.gradients.primary};
  color: ${props => props.theme.colors.text};
  padding: 20px;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.large};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.theme.colors.glassBorder};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 300;
`;

const ThemeToggle = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.colors.glass};
  backdrop-filter: blur(20px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadows.medium};
  border: 1px solid ${props => props.theme.colors.glassBorder};

  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.large};
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.text};
  }
`;

const MainContent = styled.main<{ sidebarCollapsed: boolean }>`
  margin-left: ${props => props.sidebarCollapsed ? '80px' : '250px'};
  padding: 30px;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 81px);
  margin-top: 81px;
`;

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  activePage?: string;
  onPageChange?: (pageId: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Point of Sale System",
  activePage = "pos",
  onPageChange
}) => {
  const { toggleTheme, theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'pos',
      label: 'Point of Sale',
      icon: <HiCash />
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <HiOutlineCheckCircle />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <HiOutlineChartBar />
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <HiOutlineClipboardList />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <HiOutlineCog />
    }
  ];

  const handleNavItemClick = (itemId: string) => {
    if (onPageChange) {
      onPageChange(itemId);
    }
  };

  return (
    <LayoutContainer>
      <Header>
        <HeaderTitle>{title}</HeaderTitle>
        <ThemeToggle onClick={toggleTheme}>
          {theme.mode === 'light' ? (
            <HiOutlineMoon />
          ) : (
            <HiOutlineSun />
          )}
        </ThemeToggle>
      </Header>

      <Sidebar
        navItems={navItems}
        activeItem={activePage}
        onItemClick={handleNavItemClick}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <MainContent sidebarCollapsed={sidebarCollapsed}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
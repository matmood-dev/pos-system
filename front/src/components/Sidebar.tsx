import React from 'react';
import styled from 'styled-components';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

const SidebarContainer = styled.aside<{ collapsed: boolean }>`
  width: ${props => props.collapsed ? '80px' : '250px'};
  background: ${props => props.theme.colors.glass};
  backdrop-filter: blur(20px);
  border-right: 1px solid ${props => props.theme.colors.glassBorder};
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  box-shadow: ${props => props.theme.shadows.medium};
  position: fixed;
  left: 0;
  top: 81px; /* Header height + padding */
  height: calc(100vh - 81px);
  z-index: 100;
`;

const NavItem = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: ${props => props.active ? props.theme.colors.surface : 'transparent'};
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.text};
  border: none;
  border-radius: 0 25px 25px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 5px 15px 5px 0;
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '400'};
  border-left: 4px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};

  &:hover {
    background: ${props => props.theme.colors.surface};
    transform: translateX(5px);
    box-shadow: ${props => props.theme.shadows.small};
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 15px;
    flex-shrink: 0;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: -15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.colors.glass};
  backdrop-filter: blur(20px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.medium};
  border: 1px solid ${props => props.theme.colors.glassBorder};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.large};
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.colors.text};
  }
`;

const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  activeItem,
  onItemClick,
  collapsed = false,
  onToggle
}) => {
  return (
    <SidebarContainer collapsed={collapsed}>
      <ToggleButton onClick={onToggle}>
        {collapsed ? (
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </ToggleButton>

      {navItems.map((item) => (
        <NavItem
          key={item.id}
          active={activeItem === item.id}
          onClick={() => onItemClick(item.id)}
        >
          {item.icon}
          {!collapsed && item.label}
        </NavItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
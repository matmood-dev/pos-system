import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { Button } from '../components/Button';

// Mock products (replace with API call in production)
const mockProducts: Product[] = [
  { id: '1', name: 'Coffee', price: 3.99, category: 'Beverage' },
  { id: '2', name: 'Sandwich', price: 6.99, category: 'Food' },
  { id: '3', name: 'Cake', price: 4.99, category: 'Dessert' },
  { id: '4', name: 'Tea', price: 2.99, category: 'Beverage' },
  { id: '5', name: 'Burger', price: 8.99, category: 'Food' },
  { id: '6', name: 'Ice Cream', price: 3.49, category: 'Dessert' },
  { id: '7', name: 'Latte', price: 4.49, category: 'Beverage' },
  { id: '8', name: 'Pizza', price: 12.99, category: 'Food' },
  { id: '9', name: 'Cookie', price: 2.49, category: 'Dessert' },
];

const PosContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  background: ${props => props.theme.colors.glass};
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.glassBorder};
  backdrop-filter: blur(20px);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${props => props.theme.shadows.large}, ${props => props.theme.shadows.glow};
    border-color: ${props => props.theme.colors.accent};
  }
`;

const ProductName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;

const ProductPrice = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.accent};
`;

const ProductCategory = styled.span`
  display: inline-block;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textSecondary};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-top: 8px;
  border: 1px solid ${props => props.theme.colors.glassBorder};
`;

const CartSection = styled.div`
  background: ${props => props.theme.colors.glass};
  padding: 25px;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadows.medium};
  height: fit-content;
  position: sticky;
  top: 30px;
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.glassBorder};
`;

const CartTitle = styled.h2`
  margin: 0 0 20px 0;
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.glassBorder};
  padding-bottom: 10px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid ${props => props.theme.colors.glassBorder};
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const ItemPrice = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${props => props.theme.colors.glassBorder};
  background: ${props => props.theme.colors.glass};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  color: ${props => props.theme.colors.text};

  &:hover {
    background: ${props => props.theme.gradients.primary};
    color: white;
    border-color: ${props => props.theme.colors.accent};
    transform: scale(1.1);
  }
`;

const QuantityDisplay = styled.span`
  min-width: 30px;
  text-align: center;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Total = styled.div`
  margin: 25px 0 20px 0;
  padding: 15px;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  text-align: center;
  border: 1px solid ${props => props.theme.colors.glassBorder};
  backdrop-filter: blur(10px);
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  padding: 15px;
  font-size: 18px;
  font-weight: 600;
  background: ${props => props.theme.gradients.primary};
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.large};
  }

  &:disabled {
    background: ${props => props.theme.colors.glass};
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const ControlsSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.glassBorder};
  border-radius: 12px;
  font-size: 16px;
  flex: 1;
  max-width: 300px;
  background: ${props => props.theme.colors.glass};
  backdrop-filter: blur(10px);
  color: ${props => props.theme.colors.text};

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;

const CategoryButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background: ${props => props.active ? props.theme.gradients.primary : props.theme.colors.glass};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.active ? 'transparent' : props.theme.colors.glassBorder};
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
    background: ${props => props.active ? props.theme.gradients.primary : props.theme.colors.surface};
  }
`;

const PosPage: React.FC = () => {
  const { cart, addToCart, updateQuantity, clearCart, total } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(mockProducts.map(p => p.category))];
    return cats;
  }, []);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleCheckout = () => {
    alert(`Order placed! Total: $${total.toFixed(2)}`);
    clearCart();
  };

  return (
    <PosContainer>
      <div>
        <ControlsSection>
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {categories.map(category => (
            <CategoryButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </ControlsSection>
        <ProductGrid>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} onClick={() => addToCart(product)}>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
              <ProductCategory>{product.category}</ProductCategory>
            </ProductCard>
          ))}
        </ProductGrid>
      </div>
      <CartSection>
        <CartTitle>Shopping Cart</CartTitle>
        {cart.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', margin: '40px 0' }}>
            Your cart is empty
          </p>
        ) : (
          <>
            {cart.map((item) => (
              <CartItem key={item.product.id}>
                <ItemInfo>
                  <ItemName>{item.product.name}</ItemName>
                  <ItemPrice>${item.product.price.toFixed(2)} each</ItemPrice>
                </ItemInfo>
                <QuantityControls>
                  <QuantityButton
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                  >
                    -
                  </QuantityButton>
                  <QuantityDisplay>{item.quantity}</QuantityDisplay>
                  <QuantityButton
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                  >
                    +
                  </QuantityButton>
                </QuantityControls>
              </CartItem>
            ))}
            <Total>Total: ${total.toFixed(2)}</Total>
            <CheckoutButton onClick={handleCheckout} disabled={cart.length === 0}>
              Complete Order
            </CheckoutButton>
          </>
        )}
      </CartSection>
    </PosContainer>
  );
};

export default PosPage;
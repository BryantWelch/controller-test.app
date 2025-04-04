import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const BreadcrumbContainer = styled.div`
  display: flex;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const BreadcrumbItem = styled.span`
  &:after {
    content: '>';
    margin: 0 0.5rem;
    color: ${props => props.theme.colors.secondary};
  }
  
  &:last-child:after {
    content: '';
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Generate structured data for SEO
  const generateStructuredData = () => {
    const items = [{ position: 1, name: 'Home', item: 'https://controller-test.app/' }];
    
    pathnames.forEach((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      items.push({
        position: index + 2,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        item: `https://controller-test.app${routeTo}`
      });
    });
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map(item => ({
        '@type': 'ListItem',
        'position': item.position,
        'name': item.name,
        'item': item.item
      }))
    };
  };
  
  // Don't show breadcrumbs on homepage
  if (pathnames.length === 0) {
    return null;
  }
  
  return (
    <>
      <BreadcrumbContainer>
        <BreadcrumbItem>
          <Link to="/">Home</Link>
        </BreadcrumbItem>
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          return (
            <BreadcrumbItem key={name}>
              {isLast ? (
                <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
              ) : (
                <Link to={routeTo}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Link>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbContainer>
      
      {/* Add structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </>
  );
};

export default Breadcrumbs;

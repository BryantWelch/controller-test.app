import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useGamepad } from '../../hooks/useGamepad';
import { parseVendorProductId } from '../../data/controllerDatabase';
import { buildVendorProductDatabase, VendorProductMapping } from '../../data/gamepadVendorProductDatabase';

const TestContainer = styled.div`
  padding: ${theme.space.lg};
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.space.xl};
`;

const Title = styled.h2`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.space.md};
`;

const InfoSection = styled.div`
  margin-bottom: ${theme.space.lg};
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: ${theme.space.sm};
  padding: ${theme.space.sm};
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.sm};
`;

const Label = styled.div`
  width: 200px;
  font-weight: bold;
  color: ${theme.colors.textDark};
`;

const Value = styled.div`
  flex: 1;
  color: ${theme.colors.text};
  word-break: break-all;
`;

const SuccessValue = styled(Value)`
  color: ${theme.colors.primary};
`;

const ErrorValue = styled(Value)`
  color: ${theme.colors.secondary};
`;

const ControllerIdentifierTest: React.FC = () => {
  const { activeGamepad } = useGamepad();
  const [vendorProductDatabase, setVendorProductDatabase] = useState<VendorProductMapping>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const database = await buildVendorProductDatabase();
        setVendorProductDatabase(database);
        setLoading(false);
      } catch (error) {
        console.error('Error loading vendor/product database:', error);
        setLoading(false);
      }
    };

    loadDatabase();
  }, []);

  if (!activeGamepad) {
    return (
      <TestContainer>
        <Title>Controller Identification Test</Title>
        <ErrorValue>No controller detected. Please connect a controller and press a button.</ErrorValue>
      </TestContainer>
    );
  }

  if (loading) {
    return (
      <TestContainer>
        <Title>Controller Identification Test</Title>
        <Value>Loading controller database...</Value>
      </TestContainer>
    );
  }

  // Extract vendor/product ID from gamepad ID
  const vendorProductId = parseVendorProductId(activeGamepad.id);
  
  // Look up the controller name in our database
  const controllerName = vendorProductId && vendorProductDatabase[vendorProductId] 
    ? vendorProductDatabase[vendorProductId] 
    : 'Unknown controller';

  return (
    <TestContainer>
      <Title>Controller Identification Test</Title>
      
      <InfoSection>
        <InfoRow>
          <Label>Controller ID:</Label>
          <Value>{activeGamepad.id}</Value>
        </InfoRow>
        
        <InfoRow>
          <Label>Vendor:Product ID:</Label>
          {vendorProductId ? (
            <SuccessValue>{vendorProductId}</SuccessValue>
          ) : (
            <ErrorValue>Could not extract vendor/product ID</ErrorValue>
          )}
        </InfoRow>
        
        <InfoRow>
          <Label>Known Controller:</Label>
          {vendorProductId && vendorProductDatabase[vendorProductId] ? (
            <SuccessValue>{controllerName}</SuccessValue>
          ) : (
            <ErrorValue>Not found in database</ErrorValue>
          )}
        </InfoRow>
        
        <InfoRow>
          <Label>Model Detection:</Label>
          {activeGamepad.modelInfo ? (
            <SuccessValue>
              {activeGamepad.modelInfo.name} ({activeGamepad.modelInfo.manufacturer})
            </SuccessValue>
          ) : (
            <ErrorValue>Model not identified</ErrorValue>
          )}
        </InfoRow>
        
        <InfoRow>
          <Label>Controller Type:</Label>
          <Value>{activeGamepad.type}</Value>
        </InfoRow>
        
        {activeGamepad.modelInfo && (
          <InfoRow>
            <Label>Features:</Label>
            <Value>
              {activeGamepad.modelInfo.features.join(', ')}
            </Value>
          </InfoRow>
        )}
      </InfoSection>
      
      <InfoSection>
        <Title>Database Statistics</Title>
        <InfoRow>
          <Label>Known Controllers:</Label>
          <Value>{Object.keys(vendorProductDatabase).length}</Value>
        </InfoRow>
      </InfoSection>
    </TestContainer>
  );
};

export default ControllerIdentifierTest;

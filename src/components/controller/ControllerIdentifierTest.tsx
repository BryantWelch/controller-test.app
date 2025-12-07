import React, { useState, useEffect, memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { GamepadState } from '../../hooks/useGamepad';
import { extractVendorProductId, loadKnownGamepadsDatabase, getManufacturerFromVendorId } from '../../data/controllerDatabase';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TestContainer = styled.div`
  padding: ${theme.space.lg};
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.space.xl};
  animation: ${fadeIn} 0.3s ease;
`;

const Title = styled.h2`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.space.md};
  font-size: ${theme.fontSizes.xl};
`;

const SectionTitle = styled.h3`
  color: ${theme.colors.accent};
  margin: ${theme.space.lg} 0 ${theme.space.md} 0;
  font-size: ${theme.fontSizes.lg};
  border-bottom: 1px solid ${theme.colors.backgroundLight};
  padding-bottom: ${theme.space.sm};
`;

const InfoSection = styled.div`
  margin-bottom: ${theme.space.lg};
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: ${theme.space.sm};
  padding: ${theme.space.sm} ${theme.space.md};
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.sm};
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Label = styled.div`
  width: 180px;
  min-width: 180px;
  font-weight: 600;
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.sm};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
    margin-bottom: ${theme.space.xs};
  }
`;

const Value = styled.div`
  flex: 1;
  color: ${theme.colors.text};
  word-break: break-word;
  font-family: ${theme.fonts.monospace};
  font-size: ${theme.fontSizes.sm};
`;

const SuccessValue = styled(Value)`
  color: ${theme.colors.primary};
  font-weight: 500;
`;

const ErrorValue = styled(Value)`
  color: ${theme.colors.secondary};
  font-style: italic;
`;

const IdentificationCard = styled.div`
  background: linear-gradient(135deg, ${theme.colors.backgroundLight}, ${theme.colors.backgroundDark});
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.space.lg};
  margin-bottom: ${theme.space.lg};
  text-align: center;
`;

const ControllerName = styled.div`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.space.xs};
`;

const ManufacturerName = styled.div`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.accent};
  margin-bottom: ${theme.space.md};
`;

const ControllerType = styled.span`
  display: inline-block;
  padding: ${theme.space.xs} ${theme.space.md};
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.text};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  text-transform: uppercase;
  font-weight: 600;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.xs};
  margin-top: ${theme.space.sm};
`;

const FeatureTag = styled.span`
  padding: ${theme.space.xs} ${theme.space.sm};
  background-color: ${theme.colors.backgroundDark};
  color: ${theme.colors.textDark};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  border: 1px solid ${theme.colors.backgroundLight};
`;

const StatusIndicator = styled.span<{ success: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.xs};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.success ? theme.colors.primary : theme.colors.secondary};
  }
`;

interface ControllerIdentifierTestProps {
  gamepad: GamepadState;
}

const ControllerIdentifierTest: React.FC<ControllerIdentifierTestProps> = memo(({ gamepad }) => {
  const [vendorProductDatabase, setVendorProductDatabase] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const database = await loadKnownGamepadsDatabase();
        setVendorProductDatabase(database);
        setLoading(false);
      } catch (error) {
        console.error('Error loading vendor/product database:', error);
        setLoading(false);
      }
    };

    loadDatabase();
  }, []);

  if (loading) {
    return (
      <TestContainer>
        <Title>Controller Identification</Title>
        <Value>Loading controller database...</Value>
      </TestContainer>
    );
  }

  // Extract vendor/product ID from gamepad ID
  const vendorProductId = extractVendorProductId(gamepad.id);
  
  // Get manufacturer from vendor ID
  const vendorManufacturer = vendorProductId ? getManufacturerFromVendorId(vendorProductId) : 'Unknown';
  
  // Look up the controller name in our database
  const databaseControllerName = vendorProductId && vendorProductDatabase[vendorProductId] 
    ? vendorProductDatabase[vendorProductId] 
    : null;
    
  // Determine the best name and manufacturer to display
  const displayName = gamepad.modelInfo?.name || databaseControllerName || 'Unknown Controller';
  const displayManufacturer = gamepad.modelInfo?.manufacturer || vendorManufacturer;
  const isIdentified = !!(gamepad.modelInfo?.name || databaseControllerName);

  return (
    <TestContainer>
      <Title>Controller Identification</Title>
      
      {/* Main Identification Card */}
      <IdentificationCard>
        <ControllerName>{displayName}</ControllerName>
        <ManufacturerName>{displayManufacturer}</ManufacturerName>
        <ControllerType>{gamepad.type}</ControllerType>
        
        {gamepad.modelInfo?.features && gamepad.modelInfo.features.length > 0 && (
          <FeaturesList style={{ justifyContent: 'center', marginTop: theme.space.md }}>
            {gamepad.modelInfo.features.map((feature, index) => (
              <FeatureTag key={index}>{feature}</FeatureTag>
            ))}
          </FeaturesList>
        )}
      </IdentificationCard>
      
      {/* Identification Status */}
      <SectionTitle>Identification Status</SectionTitle>
      <InfoSection>
        <InfoRow>
          <Label>Detection Status:</Label>
          <StatusIndicator success={isIdentified}>
            {isIdentified ? 'Successfully Identified' : 'Using Generic Detection'}
          </StatusIndicator>
        </InfoRow>
        
        <InfoRow>
          <Label>Vendor:Product ID:</Label>
          {vendorProductId ? (
            <SuccessValue>{vendorProductId.toUpperCase()}</SuccessValue>
          ) : (
            <ErrorValue>Could not extract from gamepad ID</ErrorValue>
          )}
        </InfoRow>
        
        <InfoRow>
          <Label>Vendor (Manufacturer):</Label>
          {vendorManufacturer !== 'Unknown' ? (
            <SuccessValue>{vendorManufacturer}</SuccessValue>
          ) : (
            <ErrorValue>Unknown vendor</ErrorValue>
          )}
        </InfoRow>
        
        <InfoRow>
          <Label>Database Match:</Label>
          {databaseControllerName ? (
            <SuccessValue>{databaseControllerName}</SuccessValue>
          ) : (
            <ErrorValue>Not found in external database</ErrorValue>
          )}
        </InfoRow>
      </InfoSection>
      
      {/* Raw Data */}
      <SectionTitle>Raw Gamepad Data</SectionTitle>
      <InfoSection>
        <InfoRow>
          <Label>Gamepad ID String:</Label>
          <Value style={{ fontSize: theme.fontSizes.xs }}>{gamepad.id}</Value>
        </InfoRow>
        
        <InfoRow>
          <Label>Mapping:</Label>
          <Value>{gamepad.mapping || 'None'}</Value>
        </InfoRow>
        
        <InfoRow>
          <Label>Index:</Label>
          <Value>{gamepad.index}</Value>
        </InfoRow>
        
        <InfoRow>
          <Label>Buttons:</Label>
          <Value>{gamepad.buttons.length} buttons detected</Value>
        </InfoRow>
        
        <InfoRow>
          <Label>Axes:</Label>
          <Value>{gamepad.axes.length} axes detected</Value>
        </InfoRow>
      </InfoSection>
      
      {/* Database Info */}
      <SectionTitle>Database Statistics</SectionTitle>
      <InfoSection>
        <InfoRow>
          <Label>External DB Entries:</Label>
          <Value>{Object.keys(vendorProductDatabase).length} controllers</Value>
        </InfoRow>
      </InfoSection>
    </TestContainer>
  );
});

export default ControllerIdentifierTest;

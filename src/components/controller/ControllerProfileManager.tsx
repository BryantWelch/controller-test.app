import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { GamepadState } from '../../hooks/useGamepad';

const ProfileManagerContainer = styled.div`
  width: 100%;
  margin-bottom: ${theme.space.xl};
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.space.lg};
`;

const ProfileManagerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.space.md};
`;

const ProfileTitle = styled.h3`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.lg};
  margin: 0;
`;

const ProfileActions = styled.div`
  display: flex;
  gap: ${theme.space.sm};
`;

const ActionButton = styled(motion.button)`
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.text};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.xs} ${theme.space.sm};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
  
  &:hover {
    background-color: ${theme.colors.secondaryLight};
  }
`;

const ProfilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  margin-top: ${theme.space.md};
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.backgroundDark};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.backgroundLight};
    border-radius: 4px;
  }
`;

const ProfileCard = styled(motion.div)<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.space.md};
  background-color: ${props => props.isActive ? 'rgba(125, 252, 189, 0.1)' : theme.colors.backgroundDark};
  border-left: 3px solid ${props => props.isActive ? theme.colors.primary : 'transparent'};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.isActive ? 'rgba(125, 252, 189, 0.15)' : 'rgba(3, 111, 154, 0.1)'};
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileName = styled.div`
  font-size: ${theme.fontSizes.md};
  font-weight: 500;
  color: ${theme.colors.text};
`;

const ProfileDetails = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
  margin-top: ${theme.space.xs};
`;

const ProfileControls = styled.div`
  display: flex;
  gap: ${theme.space.xs};
`;

const ControlButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${theme.colors.textDark};
  cursor: pointer;
  font-size: ${theme.fontSizes.md};
  padding: ${theme.space.xs};
  
  &:hover {
    color: ${theme.colors.text};
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.space.lg};
  width: 100%;
  max-width: 500px;
  box-shadow: ${theme.shadows.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.space.lg};
`;

const ModalTitle = styled.h3`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xl};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.xl};
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.text};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.space.md};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${theme.space.xs};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${theme.space.sm};
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${theme.space.sm};
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.md};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.space.sm};
  margin-top: ${theme.space.lg};
`;

const ModalButton = styled(motion.button)<{ isPrimary?: boolean }>`
  background-color: ${props => props.isPrimary ? theme.colors.primary : theme.colors.backgroundLight};
  color: ${props => props.isPrimary ? theme.colors.backgroundDark : theme.colors.text};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.sm} ${theme.space.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${props => props.isPrimary ? '600' : '400'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.isPrimary ? theme.colors.primaryLight : theme.colors.backgroundDark};
  }
`;

interface ControllerProfile {
  id: string;
  name: string;
  description: string;
  controllerId: string;
  controllerType: string;
  deadZones: {
    leftStick: number;
    rightStick: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ControllerProfileManagerProps {
  gamepad: GamepadState | null;
  onLoadProfile: (profile: ControllerProfile) => void;
}

const ControllerProfileManager: React.FC<ControllerProfileManagerProps> = ({ 
  gamepad,
  onLoadProfile
}) => {
  // Define all hooks at the top level, before any conditional returns
  const [profiles, setProfiles] = useState<ControllerProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingProfile, setEditingProfile] = useState<ControllerProfile | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  
  // Load profiles from localStorage on component mount
  // This must be defined before any conditional returns
  useEffect(() => {
    // Skip the effect if no gamepad is connected
    if (!gamepad) return;
    
    const storedProfiles = localStorage.getItem('controllerProfiles');
    if (storedProfiles) {
      try {
        const parsedProfiles = JSON.parse(storedProfiles);
        setProfiles(parsedProfiles);
        
        // Check if there's a profile for this controller
        const matchingProfile = parsedProfiles.find(
          (p: ControllerProfile) => p.controllerId === gamepad.id
        );
        
        if (matchingProfile) {
          setActiveProfileId(matchingProfile.id);
        }
      } catch (error) {
        console.error('Error parsing profiles:', error);
      }
    }
  }, [gamepad]);
  
  // Early return if no gamepad is connected
  if (!gamepad) {
    return (
      <ProfileManagerContainer>
        <ProfileTitle>Controller Profiles</ProfileTitle>
        <div style={{ color: theme.colors.text, textAlign: 'center', padding: theme.space.lg }}>
          No controller connected. Connect a controller to manage profiles.
        </div>
      </ProfileManagerContainer>
    );
  }
  
  const openCreateModal = () => {
    setModalMode('create');
    setFormName(`${gamepad.modelInfo?.name || 'Controller'} Profile`);
    setFormDescription('');
    setEditingProfile(null);
    setShowModal(true);
  };
  
  const openEditModal = (profile: ControllerProfile) => {
    setModalMode('edit');
    setFormName(profile.name);
    setFormDescription(profile.description);
    setEditingProfile(profile);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  const saveProfile = () => {
    if (!formName.trim()) {
      alert('Please enter a profile name');
      return;
    }
    
    const now = new Date().toISOString();
    
    if (modalMode === 'create') {
      // Create new profile
      const newProfile: ControllerProfile = {
        id: `profile_${Date.now()}`,
        name: formName,
        description: formDescription,
        controllerId: gamepad.id,
        controllerType: gamepad.type?.toString() || 'generic',
        deadZones: {
          leftStick: gamepad.deadZones?.leftStick || 0.05,
          rightStick: gamepad.deadZones?.rightStick || 0.05
        },
        createdAt: now,
        updatedAt: now
      };
      
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      setActiveProfileId(newProfile.id);
      localStorage.setItem('controllerProfiles', JSON.stringify(updatedProfiles));
    } else if (modalMode === 'edit' && editingProfile) {
      // Update existing profile
      const updatedProfile: ControllerProfile = {
        ...editingProfile,
        name: formName,
        description: formDescription,
        deadZones: {
          leftStick: gamepad.deadZones?.leftStick ?? 0.05,
          rightStick: gamepad.deadZones?.rightStick ?? 0.05
        },
        updatedAt: now
      };
      
      const updatedProfiles = profiles.map(p => 
        p.id === updatedProfile.id ? updatedProfile : p
      );
      
      setProfiles(updatedProfiles);
      localStorage.setItem('controllerProfiles', JSON.stringify(updatedProfiles));
    }
    
    closeModal();
  };
  
  const deleteProfile = (profileId: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      const updatedProfiles = profiles.filter(p => p.id !== profileId);
      setProfiles(updatedProfiles);
      
      if (activeProfileId === profileId) {
        setActiveProfileId(null);
      }
      
      localStorage.setItem('controllerProfiles', JSON.stringify(updatedProfiles));
    }
  };
  
  const activateProfile = (profile: ControllerProfile) => {
    setActiveProfileId(profile.id);
    onLoadProfile(profile);
  };
  
  return (
    <ProfileManagerContainer>
      <ProfileManagerHeader>
        <ProfileTitle>Controller Profiles</ProfileTitle>
        <ProfileActions>
          <ActionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
          >
            ➕ New Profile
          </ActionButton>
        </ProfileActions>
      </ProfileManagerHeader>
      
      {profiles.length === 0 ? (
        <ProfileDetails>
          No profiles saved yet. Create a profile to save your controller settings.
        </ProfileDetails>
      ) : (
        <ProfilesList>
          {profiles
            .filter(profile => profile.controllerType === gamepad.type)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map(profile => (
              <ProfileCard 
                key={profile.id}
                isActive={profile.id === activeProfileId}
                onClick={() => activateProfile(profile)}
                whileHover={{ x: 5 }}
              >
                <ProfileInfo>
                  <ProfileName>{profile.name}</ProfileName>
                  <ProfileDetails>
                    Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
                  </ProfileDetails>
                </ProfileInfo>
                <ProfileControls>
                  <ControlButton
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(profile);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✏️
                  </ControlButton>
                  <ControlButton
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProfile(profile.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    🗑️
                  </ControlButton>
                </ProfileControls>
              </ProfileCard>
            ))}
        </ProfilesList>
      )}
      
      {showModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <ModalContent
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>
                {modalMode === 'create' ? 'Create New Profile' : 'Edit Profile'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <FormLabel htmlFor="profileName">Profile Name</FormLabel>
              <FormInput
                id="profileName"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="Enter profile name"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="profileDescription">Description (optional)</FormLabel>
              <FormTextarea
                id="profileDescription"
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Enter profile description"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Controller Settings</FormLabel>
              <ProfileDetails>
                Left Stick Dead Zone: {(gamepad.deadZones?.leftStick || 0.05).toFixed(2)}
                <br />
                Right Stick Dead Zone: {(gamepad.deadZones?.rightStick || 0.05).toFixed(2)}
              </ProfileDetails>
            </FormGroup>
            
            <ModalActions>
              <ModalButton onClick={closeModal}>Cancel</ModalButton>
              <ModalButton 
                isPrimary 
                onClick={saveProfile}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {modalMode === 'create' ? 'Create Profile' : 'Update Profile'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </ProfileManagerContainer>
  );
};

export default ControllerProfileManager;

import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import type { KeycloakInstance } from 'keycloak-js';

// Mock do keycloak-js
const mockKeycloakInstance: KeycloakInstance = {
  // Required properties
  init: jest.fn().mockResolvedValue(true),
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  accountManagement: jest.fn(),
  createLoginUrl: jest.fn(),
  createLogoutUrl: jest.fn(),
  createRegisterUrl: jest.fn(),
  createAccountUrl: jest.fn(),
  isTokenExpired: jest.fn(),
  updateToken: jest.fn().mockResolvedValue(true),
  clearToken: jest.fn(),
  hasRealmRole: jest.fn(),
  hasResourceRole: jest.fn(),
  loadUserProfile: jest.fn(),
  loadUserInfo: jest.fn(),
  redirectUri: '',
  
  // Token and auth state
  token: 'mock-jwt-token',
  tokenParsed: {},
  idToken: 'mock-id-token',
  idTokenParsed: {},
  refreshToken: 'mock-refresh-token',
  refreshTokenParsed: {},
  timeSkew: 0,
  authenticated: true,
  
  // User info
  realmAccess: { roles: [] },
  resourceAccess: {},
  
  // Callbacks
  onReady: jest.fn(),
  onAuthSuccess: jest.fn(),
  onAuthError: jest.fn(),
  onAuthRefreshSuccess: jest.fn(),
  onAuthRefreshError: jest.fn(),
  onAuthLogout: jest.fn(),
  onTokenExpired: jest.fn(),
} as unknown as KeycloakInstance;

// Mock the entire keycloak-js module
jest.mock('keycloak-js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockKeycloakInstance),
}));

describe('useAuth', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset the mock instance
    Object.assign(mockKeycloakInstance, {
      // Required properties
      init: jest.fn().mockResolvedValue(true),
      login: jest.fn(),
      logout: jest.fn().mockResolvedValue(undefined),
      register: jest.fn(),
      accountManagement: jest.fn(),
      createLoginUrl: jest.fn(),
      createLogoutUrl: jest.fn(),
      createRegisterUrl: jest.fn(),
      createAccountUrl: jest.fn(),
      isTokenExpired: jest.fn(),
      updateToken: jest.fn().mockResolvedValue(true),
      clearToken: jest.fn(),
      hasRealmRole: jest.fn(),
      hasResourceRole: jest.fn(),
      loadUserProfile: jest.fn(),
      loadUserInfo: jest.fn(),
      redirectUri: '',
      
      // Token and auth state
      token: 'mock-jwt-token',
      tokenParsed: {},
      idToken: 'mock-id-token',
      idTokenParsed: {},
      refreshToken: 'mock-refresh-token',
      refreshTokenParsed: {},
      timeSkew: 0,
      authenticated: true,
      
      // User info
      realmAccess: { roles: [] },
      resourceAccess: {},
      
      // Callbacks
      onReady: jest.fn(),
      onAuthSuccess: jest.fn(),
      onAuthError: jest.fn(),
      onAuthRefreshSuccess: jest.fn(),
      onAuthRefreshError: jest.fn(),
      onAuthLogout: jest.fn(),
      onTokenExpired: jest.fn(),
    });
  });

  it('deve autenticar e retornar isAuthenticated como true', async () => {
    const { result } = renderHook(() => useAuth());

    // Wait for the auth to be initialized
    await act(async () => {
      await new Promise(process.nextTick);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(mockKeycloakInstance.init).toHaveBeenCalled();
  });

  it('deve chamar logout do keycloak', async () => {
    const { result } = renderHook(() => useAuth());

    // Wait for the auth to be initialized
    await act(async () => {
      await new Promise(process.nextTick);
    });

    // Mock the logout to resolve immediately
    mockKeycloakInstance.logout = jest.fn().mockResolvedValue(undefined);

    // Call the logout function
    await act(async () => {
      await result.current.logout();
    });

    // Verify logout was called
    expect(mockKeycloakInstance.logout).toHaveBeenCalled();
  });

  it('deve lidar com erro durante o logout', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useAuth());

    // Wait for the auth to be initialized
    await act(async () => {
      await new Promise(process.nextTick);
    });

    // Mock the logout to reject with an error
    const error = new Error('Logout failed');
    mockKeycloakInstance.logout = jest.fn().mockRejectedValue(error);

    // Call the logout function
    await act(async () => {
      await result.current.logout();
    });

    // Verify logout was called and error was logged
    expect(mockKeycloakInstance.logout).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao fazer logout:', error);
    
    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});
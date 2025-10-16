/**
 * BroadcastChannel for Multi-Tab Synchronization
 * Synchronizes auth state (logout, token refresh) across browser tabs
 * Epic 7: Refresh Token System
 */

import type { SessionTokenMetadata } from '@/types/auth'

const CHANNEL_NAME = 'auth-sync'

type AuthMessage =
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESHED'; metadata: SessionTokenMetadata }
  | { type: 'LOGIN'; metadata: SessionTokenMetadata }

interface AuthBroadcastHandlers {
  onLogout?: () => void
  onTokenRefreshed?: (metadata: SessionTokenMetadata) => void
  onLogin?: (metadata: SessionTokenMetadata) => void
}

/**
 * Check if BroadcastChannel is supported (browser environment)
 */
function isBroadcastChannelSupported(): boolean {
  return typeof window !== 'undefined' && 'BroadcastChannel' in window
}

/**
 * Auth BroadcastChannel Manager
 * Handles synchronization of auth events across browser tabs/windows
 */
class AuthBroadcastManager {
  private channel: BroadcastChannel | null = null
  private handlers: AuthBroadcastHandlers = {}
  private isInitialized = false

  /**
   * Initialize broadcast channel with event handlers
   */
  public initialize(handlers: AuthBroadcastHandlers): void {
    if (!isBroadcastChannelSupported()) {
      console.warn('BroadcastChannel not supported in this environment')
      return
    }

    if (this.isInitialized) {
      console.warn('AuthBroadcastManager already initialized')
      return
    }

    this.handlers = handlers
    this.channel = new BroadcastChannel(CHANNEL_NAME)

    // Listen for messages from other tabs
    this.channel.onmessage = (event: MessageEvent<AuthMessage>) => {
      this.handleMessage(event.data)
    }

    this.isInitialized = true
  }

  /**
   * Broadcast logout event to other tabs
   */
  public broadcastLogout(): void {
    if (!this.channel) return

    const message: AuthMessage = { type: 'LOGOUT' }
    this.channel.postMessage(message)
  }

  /**
   * Broadcast token refresh event to other tabs
   */
  public broadcastTokenRefreshed(metadata: SessionTokenMetadata): void {
    if (!this.channel) return

    const message: AuthMessage = {
      type: 'TOKEN_REFRESHED',
      metadata,
    }
    this.channel.postMessage(message)
  }

  /**
   * Broadcast login event to other tabs
   */
  public broadcastLogin(metadata: SessionTokenMetadata): void {
    if (!this.channel) return

    const message: AuthMessage = {
      type: 'LOGIN',
      metadata,
    }
    this.channel.postMessage(message)
  }

  /**
   * Handle incoming messages from other tabs
   */
  private handleMessage(message: AuthMessage): void {
    switch (message.type) {
      case 'LOGOUT':
        this.handlers.onLogout?.()
        break

      case 'TOKEN_REFRESHED':
        this.handlers.onTokenRefreshed?.(message.metadata)
        break

      case 'LOGIN':
        this.handlers.onLogin?.(message.metadata)
        break

      default:
        console.warn('Unknown auth message type:', message)
    }
  }

  /**
   * Close broadcast channel and cleanup
   */
  public close(): void {
    if (this.channel) {
      this.channel.close()
      this.channel = null
    }
    this.isInitialized = false
    this.handlers = {}
  }

  /**
   * Check if broadcast manager is initialized
   */
  public isReady(): boolean {
    return this.isInitialized && this.channel !== null
  }
}

// Export singleton instance
export const authBroadcast = new AuthBroadcastManager()

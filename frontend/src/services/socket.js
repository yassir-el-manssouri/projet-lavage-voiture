import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this._userId = null;
  }

  connect(userId) {
    this._userId = userId;
    
    // Si déjà connecté et actif, ne pas recréer
    if (this.socket && this.socket.connected) return this.socket;
    
    // Si socket existe mais déconnecté, on le nettoie
    if (this.socket && !this.socket.connected) {
      this.socket.removeAllListeners();
      this.socket = null;
    }

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      if (this._userId) {
        this.socket.emit('join', this._userId);
      }
    });

    this.socket.on('reconnect', () => {
      console.log('Reconnected to socket server');
      if (this._userId) {
        this.socket.emit('join', this._userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this._userId = null;
    }
  }

  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }

  off(eventName, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(eventName, callback);
      } else {
        this.socket.off(eventName);
      }
    }
  }
}

export default new SocketService();

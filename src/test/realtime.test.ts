import WebSocket from 'ws';
import http from 'http';

describe('🔄 Tiempo Real - WebSocket', () => {
  let server: http.Server;
  let wsClient: WebSocket;

  beforeAll((done) => {
    server = require('../src/server'); // Asegúrate que tu server exporte la instancia
    setTimeout(done, 500); // Esperar a que arranque
  });

  afterAll((done) => {
    wsClient?.close();
    server.close(done);
  });

  it('WS01 - Conexión WebSocket estable', (done) => {
    wsClient = new WebSocket('ws://localhost:3000/realtime');

    wsClient.on('open', () => {
      expect(wsClient.readyState).toBe(WebSocket.OPEN);
      done();
    });

    wsClient.on('error', (err) => {
      done(err);
    });
  });

  it('WS02 - Recepción de evento de riego', (done) => {
    wsClient = new WebSocket('ws://localhost:3000/realtime');

    wsClient.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      expect(msg.tipo).toBe('riego');
      done();
    });

    wsClient.on('open', () => {
      // Simulamos que el servidor emita un evento
      setTimeout(() => {
        server.emit('evento_riego', { tipo: 'riego', zona: 'Zona 1' });
      }, 300);
    });
  });

  it('WS04 - Rechazo de conexión sin token (simulado)', (done) => {
    const invalidClient = new WebSocket('ws://localhost:3000/realtime?token=invalid');

    invalidClient.on('close', (code) => {
      expect([1008, 4001, 403]).toContain(code); // Códigos típicos de error
      done();
    });
  });
});

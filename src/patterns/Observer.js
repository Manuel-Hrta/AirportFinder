// Clase Observer para gestionar suscriptores
class Observer {
    constructor() {
      this.subscribers = [];
    }
  
    // Suscribir una función al observador
    subscribe(callback) {
      this.subscribers.push(callback);
    }
  
    // Notificar a todos los suscriptores
    notify(value) {
      this.subscribers.forEach(callback => callback(value));
    }
  }
  
export default new Observer();
  
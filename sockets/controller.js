const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  /* socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id );
    }); */

  socket.emit("ultimo-ticket", ticketControl.ultimo);
  socket.emit("estado-actual", ticketControl.ultimos4);
  socket.emit("tickets-pendientes", ticketControl.tickets.length);

  /* LÓGICA JACOB para visualizar COLAS de escritorio y nuevos tickets 
  //Evento para mostrar tickets pendientes en ESCRITORIOS
  socket.broadcast.on("tickets-pendientes", (callback) => {
    callback(ticketControl.tickets.length);

    //Evento que envia los ticket pendientes a los escritorios
    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);
  }); */

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);

    //TODO: Notificar que hay un nuevo ticket pendiente de asignar
    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);

    /* LÓGICA JACOB para visualizar COLAS de escritorio y nuevos tickets 
    //EVENTO para actualizar tickets recien creado  a escritorios
    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length); */
  });

  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio",
      });
    }

    const ticket = ticketControl.atenderTickets(escritorio);

    //TODO: Noticiar cambio en los últimos 4
    //Agregamos broadcast para que se emita el payload a todos los dispositivos conectados
    socket.broadcast.emit("estado-actual", ticketControl.ultimos4);
    socket.emit("tickets-pendientes", ticketControl.tickets.length);
    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);

    if (!ticket) {
      callback({
        ok: false,
        msg: "Ya no hay tickets pendientes",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });

  socket.on("ticket-Pendiente", (ticket) => {
    lblPendientes.innerText = payload;
  });
};

module.exports = {
  socketController,
};

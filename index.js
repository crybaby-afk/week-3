// index.js
document.addEventListener("DOMContentLoaded", () => {
  const filmsList = document.getElementById("films");
  const posterImg = document.getElementById("poster");
  const titleElement = document.getElementById("title");
  const runtimeElement = document.getElementById("runtime");
  const showtimeElement = document.getElementById("showtime");
  const availableTicketsElement = document.getElementById("available-tickets");
  const descriptionElement = document.getElementById("description"); 
  const buyTicketButton = document.getElementById("buy-ticket");

  fetch("http://localhost:3000/films")
      .then(response => response.json())
      .then(data => {
          data.forEach(film => {
              const filmItem = document.createElement("li");
              filmItem.className = "film item";
              filmItem.innerText = film.title;
              filmItem.dataset.id = film.id; 
              filmsList.appendChild(filmItem);

              filmItem.addEventListener("click", () => {
                  displayFilmDetails(film);
              });
          });

          if (data.length > 0) {
              displayFilmDetails(data[0]);
          }
      })
      .catch(error => console.error("Error fetching films:", error));

  function displayFilmDetails(film) {
      posterImg.src = film.poster;
      titleElement.innerText = film.title;
      runtimeElement.innerText = `Runtime: ${film.runtime}`;
      showtimeElement.innerText = `Showtime: ${film.showtime}`;
      const availableTickets = film.capacity - film.tickets_sold;
      availableTicketsElement.innerText = `Available Tickets: ${availableTickets}`;
      descriptionElement.innerText = film.description; 

      if (availableTickets > 0) {
          buyTicketButton.disabled = false;
          buyTicketButton.onclick = () => buyTicket(film);
      } else {
          buyTicketButton.disabled = true;
      }
  }

  function buyTicket(film) {
      const availableTickets = film.capacity - film.tickets_sold;
      if (availableTickets > 0) {
          film.tickets_sold += 1;
          const newAvailableTickets = film.capacity - film.tickets_sold;
          availableTicketsElement.innerText = `Available Tickets: ${newAvailableTickets}`;
          
          // Update the database
          fetch(`http://localhost:3000/films/${film.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ tickets_sold: film.tickets_sold }),
          })
          .then(response => response.json())
          .then(updatedFilm => {
              // Optionally update UI or do something with the updated film
          })
          .catch(error => console.error("Error updating tickets:", error));

          if (newAvailableTickets === 0) {
              buyTicketButton.disabled = true;
          }
      }
  }
});



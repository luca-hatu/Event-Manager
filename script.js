document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('eventForm');
    const eventList = document.getElementById('eventList');

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventName = document.getElementById('eventName').value;
        const eventDate = document.getElementById('eventDate').value;
        const eventTickets = document.getElementById('eventTickets').value;

        addEvent(eventName, eventDate, eventTickets);
        eventForm.reset();
    });

    function addEvent(name, date, tickets) {
        const li = document.createElement('li');
        const eventText = document.createElement('span');
        eventText.textContent = `${name} - ${date}`;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="material-icons">delete</i>';
        deleteButton.addEventListener('click', () => {
            eventList.removeChild(li);
        });

        const ticketCount = document.createElement('div');
        ticketCount.className = 'ticket-count';
        const ticketIcon = document.createElement('i');
        ticketIcon.className = 'material-icons';
        ticketIcon.textContent = 'confirmation_number';
        const ticketNumber = document.createElement('span');
        ticketNumber.textContent = `x ${tickets}`;

        ticketCount.appendChild(ticketIcon);
        ticketCount.appendChild(ticketNumber);

        li.appendChild(eventText);
        li.appendChild(ticketCount);
        li.appendChild(deleteButton);
        eventList.appendChild(li);
    }
});

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

        const importantButton = document.createElement('button');
        importantButton.className = 'icon-button';
        importantButton.innerHTML = '<i class="material-icons">star</i>';
        importantButton.addEventListener('click', () => {
            eventText.classList.toggle('important');
        });

        const editButton = document.createElement('button');
        editButton.className = 'icon-button';
        editButton.innerHTML = '<i class="material-icons">edit</i>';
        editButton.addEventListener('click', () => {
            editForm.style.display = 'flex';
            eventText.style.display = 'none';
            ticketCount.style.display = 'none';
            editButton.style.display = 'none';
            deleteButton.style.display = 'none';
            importantButton.style.display = 'none';
        });

        const editForm = document.createElement('div');
        editForm.className = 'edit-form';
        const editName = document.createElement('input');
        editName.type = 'text';
        editName.value = name;
        const editDate = document.createElement('input');
        editDate.type = 'date';
        editDate.value = date;
        const saveButton = document.createElement('button');
        saveButton.className = 'save-button';
        saveButton.innerHTML = '<i class="material-icons">save</i> Save';
        saveButton.addEventListener('click', () => {
            eventText.textContent = `${editName.value} - ${editDate.value}`;
            name = editName.value;
            date = editDate.value;
            editForm.style.display = 'none';
            eventText.style.display = 'block';
            ticketCount.style.display = 'flex';
            editButton.style.display = 'inline-block';
            deleteButton.style.display = 'inline-block';
            importantButton.style.display = 'inline-block';
        });

        editForm.appendChild(editName);
        editForm.appendChild(editDate);
        editForm.appendChild(saveButton);

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
        li.appendChild(importantButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        li.appendChild(editForm);
        eventList.appendChild(li);
    }
});

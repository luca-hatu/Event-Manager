document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('eventForm');
    const eventList = document.getElementById('eventList');

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventName = document.getElementById('eventName').value;
        const eventDate = document.getElementById('eventDate').value;

        addEvent(eventName, eventDate);
        eventForm.reset();
    });

    function addEvent(name, date) {
        const li = document.createElement('li');
        const eventText = document.createElement('span');
        eventText.textContent = `${name} - ${date}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            eventList.removeChild(li);
        });

        li.appendChild(eventText);
        li.appendChild(deleteButton);
        eventList.appendChild(li);
    }
});

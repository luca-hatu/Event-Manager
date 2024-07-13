document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('eventForm');
    const eventList = document.getElementById('eventList');
    const tagSelection = document.getElementById('tagSelection');
    const ticketModal = document.getElementById('ticketModal');
    const ticketForm = document.getElementById('ticketForm');
    const paymentSection = document.getElementById('paymentSection');
    const ticketSection = document.getElementById('ticketSection');
    const ticketDetails = document.getElementById('ticketDetails');
    const ticketQRCode = document.getElementById('ticketQRCode');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchBar = document.getElementById('searchBar');

    flatpickr(".datepicker", {
        dateFormat: "Y-m-d",
        minDate: "today"
    });

    const tagIcons = {
        cinema: 'local_movies',
        festival: 'celebration',
        'musical-concert': 'music_note',
        'classical-music': 'music_off',
        children: 'child_care',
    };

    let selectedTags = new Set();

    tagSelection.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-icon') || e.target.parentElement.classList.contains('tag-icon')) {
            const tagElement = e.target.classList.contains('tag-icon') ? e.target : e.target.parentElement;
            const tag = tagElement.dataset.tag;
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
                tagElement.classList.remove('selected');
            } else {
                selectedTags.add(tag);
                tagElement.classList.add('selected');
            }
            filterEvents();
        }
    });

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventName = document.getElementById('eventName').value;
        const eventDate = document.getElementById('eventDate').value;
        const eventTickets = document.getElementById('eventTickets').value;
        const ticketPrice = document.getElementById('ticketPrice').value;
        const eventLocation = document.getElementById('eventLocation').value;
        const eventTags = Array.from(selectedTags);

        addEvent(eventName, eventDate, eventTickets, ticketPrice, eventLocation, eventTags);
        eventForm.reset();
        selectedTags.clear();
        document.querySelectorAll('.tag-icon').forEach(icon => icon.classList.remove('selected'));

        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    });

    function addEvent(name, date, tickets, price, location, tags) {
        const li = document.createElement('li');
        li.classList.add(...tags);

        const eventText = document.createElement('span');
        eventText.textContent = `${name} - ${date} - ${location}`;

        const tagContainer = document.createElement('div');
        tagContainer.className = 'tag-container';

        tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            const icon = tagIcons[tag] || 'label';
            tagElement.innerHTML = `<i class="material-icons">${icon}</i>${tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')}`;
            tagContainer.appendChild(tagElement);
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

        const priceElement = document.createElement('div');
        priceElement.className = 'price';
        priceElement.textContent = `$${price}`;

        const sellButton = document.createElement('button');
        sellButton.innerHTML = '<i class="material-icons">attach_money</i>';
        sellButton.addEventListener('click', () => {
            openSellProcedure(name, location, price);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="material-icons">delete</i>';
        deleteButton.addEventListener('click', () => {
            eventList.removeChild(li);
        });

        const importantButton = document.createElement('button');
        importantButton.className = 'icon-button';
        importantButton.innerHTML = '<i class="material-icons">star_border</i>';
        importantButton.addEventListener('click', () => {
            li.classList.toggle('important');
            importantButton.innerHTML = `<i class="material-icons">${li.classList.contains('important') ? 'star' : 'star_border'}</i>`;
        });

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="material-icons">edit</i>';
        editButton.addEventListener('click', () => {
            const editForm = document.createElement('div');
            editForm.className = 'edit-form';
            editForm.innerHTML = `
                <input type="text" value="${name}" required>
                <input type="text" class="datepicker" value="${date}" required>
                <input type="number" value="${tickets}" required min="1">
                <input type="number" value="${price}" required min="1">
                <input type="text" value="${location}" required>
                <button type="submit" class="save-button"><i class="material-icons">save</i></button>
            `;
            li.appendChild(editForm);
            flatpickr(editForm.querySelector('.datepicker'), {
                dateFormat: "Y-m-d",
                minDate: "today"
            });
            editForm.querySelector('button').addEventListener('click', (e) => {
                e.preventDefault();
                const updatedName = editForm.querySelector('input[type="text"]').value;
                const updatedDate = editForm.querySelector('.datepicker').value;
                const updatedTickets = editForm.querySelector('input[type="number"]').value;
                const updatedPrice = editForm.querySelector('input[type="number"]').value;
                const updatedLocation = editForm.querySelector('input[type="text"]').value;
                li.querySelector('span').textContent = `${updatedName} - ${updatedDate} - ${updatedLocation}`;
                li.querySelector('.ticket-count span').textContent = `x ${updatedTickets}`;
                li.querySelector('.price').textContent = `$${updatedPrice}`;
                li.removeChild(editForm);
            });
            editButton.style.display = 'none';
        });

        const mapContainer = document.createElement('div');
        mapContainer.className = 'event-map';
        li.appendChild(mapContainer);
        initializeMap(mapContainer, location);

        li.appendChild(eventText);
        li.appendChild(tagContainer);
        li.appendChild(ticketCount);
        li.appendChild(priceElement);
        li.appendChild(sellButton);
        li.appendChild(deleteButton);
        li.appendChild(importantButton);
        li.appendChild(editButton);

        eventList.appendChild(li);
    }

    function openSellProcedure(eventName, eventLocation, ticketPrice) {
        ticketModal.style.display = 'block';
        paymentSection.classList.remove('hidden');
        ticketSection.classList.add('hidden');
        
        setTimeout(() => {
            paymentSection.classList.add('hidden');
            ticketSection.classList.remove('hidden');
            generateTicket(eventName, eventLocation, ticketPrice);
        }, 2000);
    }

    function generateTicket(eventName, eventLocation, ticketPrice) {
        ticketDetails.innerHTML = `
            <p><strong>Event:</strong> ${eventName}</p>
            <p><strong>Location:</strong> ${eventLocation}</p>
            <p><strong>Price:</strong> $${ticketPrice}</p>
        `;
        $('#ticketQRCode').qrcode({
            text: `Event: ${eventName}, Location: ${eventLocation}, Price: $${ticketPrice}`
        });
    }

    document.querySelector('.close').addEventListener('click', () => {
        ticketModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == ticketModal) {
            ticketModal.style.display = 'none';
        }
    });

    function initializeMap(container, address) {
        const map = L.map(container).setView([0, 0], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const latLng = [data[0].lat, data[0].lon];
                    L.marker(latLng).addTo(map).bindPopup(address);
                    map.setView(latLng, 13);
                } else {
                    alert('Location not found');
                }
            })
            .catch(error => {
                console.error('Error geocoding address:', error);
            });
    }

    function filterEvents() {
        const selectedFilter = document.querySelector('.filter-btn.selected');
        const filterTags = selectedFilter ? selectedFilter.dataset.filter : null;

        document.querySelectorAll('#eventList > li').forEach(eventItem => {
            if (filterTags === null || filterTags === 'all' || eventItem.classList.contains(filterTags)) {
                eventItem.style.display = 'list-item';
            } else {
                eventItem.style.display = 'none';
            }
        });
    }
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            filterEvents();
        });
    });
});

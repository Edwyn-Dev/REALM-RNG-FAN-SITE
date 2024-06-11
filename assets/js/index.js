$(document).ready(function () {
    const raceContainer = $('#race-container');
    let racesData = [];
    let filteredData = [];

    function formatNumber(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return value;
    }

    function renderRaces(data) {
        raceContainer.empty();
        data.forEach(details => {
            const card = $('<div class="race-card"></div>');
            const image = $('<div class="race-image"></div>').css('background-image', `url('images/${details.name.toLowerCase()}-${details.type.toLowerCase()}.jpg')`);
            const content = $('<div class="race-content"></div>');
            const title = $(`<div class="race-title">${details.name} (${details.type})</div>`);
            const description = $('<div class="race-description">Description for ' + details.name + ' (' + details.type + ')</div>');
            const stats = $('<div class="race-stats"></div>');

            stats.append(`<div class="race-stat"><span class="stat-label">❤️ ${formatNumber(100+details.health)}</div></span>`);
            stats.append(`<div class="race-stat"><span class="stat-label">🎲 1/${formatNumber(details.probability)}</div></span>`);
            stats.append(`<div class="race-stat"><span class="stat-label">${(details.rarity).toUpperCase()}</div></span>`);

            content.append(title, description, stats);
            card.append(image, content);
            raceContainer.append(card);
        });
    }

    function filterAndSortData(order = 'asc') {
        let data = filteredData;

        if ($('#search-bar').val().trim() !== '') {
            const searchTerm = $('#search-bar').val().toLowerCase();
            data = data.filter(race => race.name.toLowerCase().includes(searchTerm));
        }

        data.sort((a, b) => {
            if (order === 'asc') {
                return a.probability - b.probability;
            } else {
                return b.probability - a.probability;
            }
        });

        renderRaces(data);
    }

    $('#search-bar').on('input', function () {
        filterAndSortData();
    });

    $('#sort-asc').click(function () {
        filterAndSortData('asc');
    });

    $('#sort-desc').click(function () {
        filterAndSortData('desc');
    });

    $('.rarity-btn').click(function () {
        const rarity = $(this).data('rarity');
        filteredData = racesData.filter(race => race.rarity === rarity);
        filterAndSortData();
    });

    // Initial fetch and render
    fetch('assets/data/races.json')
        .then(response => response.json())
        .then(data => {
            racesData = data;
            filteredData = data;
            renderRaces(data);
        });
});

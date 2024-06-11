$(document).ready(function () {
    const raceContainer = $('#race-container');
    let racesData = [];
    let spellsData = [];
    let filteredData = [];
    let currentType = 'races';

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
            const card = $(`<div class="race-card"></div>`);
            const content = $(`<div class="race-content" data-rarity="${details.rarity}"></div>`);
            const title = $(`<div class="race-title">${details.name} (${details.type})</div>`);
            const stats = $('<div class="race-stats"></div>');

            stats.append(`<div class="race-stat"><span class="stat-label">❤️ ${formatNumber(100 + details.health)}</div></span>`);
            stats.append(`<div class="race-stat"><span class="stat-label">🎲 1 in ${formatNumber(details.probability)}</div></span>`);

            content.append(title, stats);
            card.append(content);
            raceContainer.append(card);
        });
    }

    function renderSpells(data) {
        raceContainer.empty();
        data.forEach(details => {
            const card = $(`<div class="race-card"></div>`);
            const content = $(`<div class="race-content" data-rarity="${details.rarity}"></div>`);
            const title = $(`<div class="race-title">${details.name}</div>`);
            const stats = $('<div class="race-stats"></div>');

            stats.append(`<div class="race-stat"><span class="stat-label">⚔️ ${formatNumber(details.damage)}</div></span>`);
            stats.append(`<div class="race-stat"><span class="stat-label">🎲 1 in ${formatNumber(details.probability)}</div></span>`);

            content.append(title, stats);
            card.append(content);
            raceContainer.append(card);
        });
    }

    function filterAndSortData(order = 'asc') {
        let data = filteredData;

        if ($('#search-bar').val().trim() !== '') {
            const searchTerm = $('#search-bar').val().toLowerCase();
            data = data.filter(item => item.name.toLowerCase().includes(searchTerm));
        }

        data.sort((a, b) => {
            if (order === 'asc') {
                return a.probability - b.probability;
            } else {
                return b.probability - a.probability;
            }
        });

        if (currentType === 'races') {
            renderRaces(data);
        } else {
            renderSpells(data);
        }
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
        switch (rarity) {
            case 'common':
                $('body').css('background-color', 'rgb(168, 168, 168, 0.80)');
                filteredData = (currentType === 'races' ? racesData : spellsData).filter(item => item.rarity === rarity);
                break;
            case 'un-common':
                $('body').css('background-color', 'rgb(17, 148, 17, 0.80)');
                filteredData = (currentType === 'races' ? racesData : spellsData).filter(item => item.rarity === rarity);
                break;
            case 'rare':
                $('body').css('background-color', 'rgb(64, 123, 199, 0.80)');
                filteredData = (currentType === 'races' ? racesData : spellsData).filter(item => item.rarity === rarity);
                break;
            case 'epic':
                $('body').css('background-color', 'rgba(158, 0, 158, 0.692, 0.80)');
                filteredData = (currentType === 'races' ? racesData : spellsData).filter(item => item.rarity === rarity);
                break;
            case 'legendary':
                $('body').css('background-color', 'rgb(170, 107, 12, 0.80)');
                filteredData = (currentType === 'races' ? racesData : spellsData).filter(item => item.rarity === rarity);
                break;
            case 'mythical':
                $('body').css('background-color', 'rgb(201, 35, 35, 0.80)');
                filteredData = (currentType === 'races' ? racesData : spellsData).filter(item => item.rarity === rarity);
                break;
            case 'all':
                $('body').css('background-color', 'rgb(44, 44, 44, 0.80)');
                filteredData = currentType === 'races' ? racesData : spellsData;
                break;
            default:
                $('body').css('background-color', ''); // Reset background for other cases
                filteredData = (currentType === 'races' ? racesData : spellsData).filter(item => item.rarity === rarity);
                break;
        }
        filterAndSortData();
    });

    $('#sort-race').click(function () {
        currentType = 'races';
        filteredData = racesData;
        filterAndSortData();
    });

    $('#sort-spells').click(function () {
        currentType = 'spells';
        filteredData = spellsData;
        filterAndSortData();
    });

    // Initial fetch and render
    fetch('assets/data/races.json')
        .then(response => response.json())
        .then(data => {
            racesData = data;
            if (currentType === 'races') {
                filteredData = data;
                renderRaces(data);
            }
        })
        .catch(error => {
            console.error('Error fetching races data:', error);
        });

    fetch('assets/data/spells.json')
        .then(response => response.json())
        .then(data => {
            spellsData = data;
            if (currentType === 'spells') {
                filteredData = data;
                renderSpells(data);
            }
        })
        .catch(error => {
            console.error('Error fetching spells data:', error);
        });
});

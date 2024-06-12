


$(document).ready(function () {
    const raceContainer = $('#race-container');
    function renderNextUpdate() {
        raceContainer.empty();
        const card = $(`<div class="race-card"></div>`);
        const content = $(`<div class="race-content"><p>The buttons below are prepared in advance in anticipation of future updates that could introduce new collectible content beyond spells, races, and taunts!</p></div>`);
        card.append(content);
        raceContainer.append(card);
    }
    let racesData = [];
    let spellsData = [];
    let tauntsData = [];
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

    function setIndex(data) {
        data.forEach((item, index) => {
            item.index = index + 1;
        });
    }
    function renderRaces(data) {
        raceContainer.empty();
        $('info-span-index').show()
        $('rarity-filters').show()
        data.forEach(details => {
            const card = $(`<div class="race-card"></div>`);
            const content = $(`<div class="race-content" data-rarity="${details.rarity}"></div>`);
            const title = $(`<div class="race-title">${details.type === 'normal' ? `` : `${details.type}`} ${details.name}</div>`);
            const spanIndex = $(`<span id="span-index">🗂️${details.index}</span>`);
            const stats = $('<div class="race-stats"></div>');

            stats.append(`<div class="race-stat"><span class="stat-label">❤️ ${formatNumber(100 + details.values)}</span></div>`);
            stats.append(`<div class="race-stat"><span class="stat-label">🎲 1 in ${formatNumber(details.probability)}</span></div>`);

            content.append(spanIndex, title, stats); // Ajoutez spanIndex avant title
            card.append(content);
            raceContainer.append(card);
        });
    }

    function renderSpells(data) {
        raceContainer.empty();
        $('info-span-index').show()
        $('rarity-filters').show()
        data.forEach(details => {
            const card = $(`<div class="race-card"></div>`);
            const content = $(`<div class="race-content" data-rarity="${details.rarity}"></div>`);
            const title = $(`<div class="race-title">${details.name}</div>`);
            const spanIndex = $(`<span id="span-index">🗂️${details.index}</span>`);
            const stats = $('<div class="race-stats"></div>');

            stats.append(`<div class="race-stat"><span class="stat-label">⚔️ ${formatNumber(details.values)}</span></div>`);
            stats.append(`<div class="race-stat"><span class="stat-label">🎲 1 in ${formatNumber(details.probability)}</span></div>`);

            content.append(spanIndex, title, stats); // Ajoutez spanIndex avant title
            card.append(content);
            raceContainer.append(card);
        });
    }

    function renderTaunts(data) {
        raceContainer.empty();
        $('info-span-index').hide()
        $('rarity-filters').hide()
        data.forEach(details => {
            const card = $(`<div class="race-card"></div>`);
            const content = $(`<div class="race-content" data-rarity="${details.rarity}"></div>`);
            const title = $(`<div class="race-title">${details.name}</div>`);
            const spanIndex = $(`<span id="span-index">🗂️${details.index}</span>`);
            const stats = $('<div class="race-stats"></div>');
            stats.append(`<div class="race-stat"><span class="stat-label">${formatNumber(details.values)}🪙</span></div>`);

            content.append(spanIndex, title, stats); // Ajoutez spanIndex avant title
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
                return a.values - b.values;
            } else {
                return b.values - a.values;
            }
        });
        switch (currentType) {
            case 'races':
                renderRaces(data);
                break;

            case 'spells':
                renderSpells(data);
                break;

            default:
                renderTaunts(data);
                break;
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
                filteredData = (currentType === 'races' ? racesData : (currentType === 'spells' ? spellsData : tauntsData)).filter(item => item.rarity === rarity);
                break;
            case 'un-common':
                filteredData = (currentType === 'races' ? racesData : (currentType === 'spells' ? spellsData : tauntsData)).filter(item => item.rarity === rarity);
                break;
            case 'rare':
                filteredData = (currentType === 'races' ? racesData : (currentType === 'spells' ? spellsData : tauntsData)).filter(item => item.rarity === rarity);
                break;
            case 'epic':
                filteredData = (currentType === 'races' ? racesData : (currentType === 'spells' ? spellsData : tauntsData)).filter(item => item.rarity === rarity);
                break;
            case 'legendary':
                filteredData = (currentType === 'races' ? racesData : (currentType === 'spells' ? spellsData : tauntsData)).filter(item => item.rarity === rarity);
                break;
            case 'mythical':
                filteredData = (currentType === 'races' ? racesData : (currentType === 'spells' ? spellsData : tauntsData)).filter(item => item.rarity === rarity);
                break;
            case 'all':
                filteredData = currentType === 'races' ? racesData : (currentType === 'spells' ? spellsData : tauntsData);
                break;
            default:
                filteredData = (currentType === 'races' ? racesData : (currentType === 'spells' ? spellsData : tauntsData)).filter(item => item.rarity === rarity);
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

    $('#sort-taunts').click(function () {
        currentType = 'taunts';
        filteredData = tauntsData;
        filterAndSortData();
    });

    $('#nextUpdate').click(function () {
        renderNextUpdate()
    });

    // Initial fetch and render
    fetch('assets/data/races.json')
        .then(response => response.json())
        .then(data => {
            setIndex(data); // Set index for races data
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
            setIndex(data); // Set index for spells data
            spellsData = data;
            if (currentType === 'spells') {
                filteredData = data;
                renderSpells(data);
            }
        })
        .catch(error => {
            console.error('Error fetching spells data:', error);
        });

    fetch('assets/data/taunts.json')
        .then(response => response.json())
        .then(data => {
            setIndex(data); // Set index for taunts data
            tauntsData = data;
            if (currentType === 'taunts') {
                filteredData = data;
                renderTaunts(data);
            }
        })
        .catch(error => {
            console.error('Error fetching taunts data:', error);
        });
});

$(document).ready(async function () {
    let racesData = [];
    let spellsData = [];

    function formatNumber(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return value;
    }

    function capitalize(str) {
        if (typeof str === 'string') {
            return str.replace(/^\w/, c => c.toUpperCase());
        } else {
            return '';
        }
    }

    function setIndex(data) {
        data.forEach((item, index) => {
            item.index = index + 1;
        });
    }

    async function fetchData() {
        try {
            let racesResponse = await fetch('assets/data/races.json');
            racesData = await racesResponse.json();
            setIndex(racesData);

            let spellsResponse = await fetch('assets/data/spells.json');
            spellsData = await spellsResponse.json();
            setIndex(spellsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    await fetchData();

    $('.part2').hide();
    $('.part3').hide();
    $('.part4').hide();

    let currentChoice, data;
    $('#roll-choice').on('change', function () {
        $('.part2').show();
        $('#disable-roll').hide();
        $('#dropdown-choice').empty();
        currentChoice = $('#roll-choice').val();
        data = currentChoice === 'races' ? racesData : spellsData;
        $('#dropdown-choice').append(`<option value="races" id="disable-choice">Choose your ${currentChoice}</option>`);

        function renderChoice(data) {
            data.forEach(details => {
                $('#dropdown-choice').append(`<option value="${details.type + '-' + details.name}">${details.type === 'normal' ? `` : `${capitalize(details.type)}`} ${details.name} | 🎲 1 in ${formatNumber(details.probability)}</option>`);
            });
        }
        renderChoice(data);
    });

    $('#dropdown-choice').on('change', function () {
        $('.part3').show();
        $('.part4').show();
    });

    $('#form').on('submit', function (e) {
        e.preventDefault();
        const attempts = parseInt($('#attemps').val());
        const selectedItem = $('#dropdown-choice').val();
        const selectedData = data.find(item => `${item.type}-${item.name}` === selectedItem);
        const probability = selectedData ? selectedData.probability : 0;
        
        if (probability > 0 && attempts > 0) {
            const avgRolls = simulateRolls(probability, attempts);
            displayResults(avgRolls, attempts, selectedData);
        } else {
            alert('Please select a valid item and enter a positive number of attempts.');
        }
    });

    function simulateRolls(probability, attempts) {
        let totalRolls = 0;
        const probabilityForCalculation = 1 / probability;

        for (let i = 0; i < attempts; i++) {
            let rolls = 0;
            let obtained = false;
            while (!obtained) {
                const randomNumber = Math.random();
                rolls++;
                if (randomNumber <= probabilityForCalculation) {
                    obtained = true;
                }
            }
            totalRolls += rolls;
        }
        return totalRolls / attempts;
    }

    function getRarityColor(rarity) {
        switch (rarity) {
            case 'common':
                return 'rgb(168, 168, 168)';
            case 'un-common':
                return 'rgb(17, 148, 17)';
            case 'rare':
                return 'rgb(64, 123, 199)';
            case 'epic':
                return 'rgb(133, 0, 133)';
            case 'legendary':
                return 'rgb(170, 107, 12)';
            case 'mythical':
                return 'rgb(201, 35, 35)';
            default:
                return 'rgba(44, 44, 44, 0.80)';
        }
    }

    function displayResults(avgRolls, attempts, selectedData) {
        const resultsDiv = $('#results');
        resultsDiv.empty();
        const card = $('<div class="result-card"></div>');
        const content = $(`<div class="result-content" data-rarity="${selectedData.rarity}" style="background-color: ${getRarityColor(selectedData.rarity)}"></div>`);
        const title = $(`<div class="result-title">${selectedData.type === 'normal' ? `` : `${capitalize(selectedData.type)}`} ${selectedData.name}</div>`);
        const stats = $('<div class="result-stats"></div>');
        stats.append(`<div class="result-stat"><span class="stat-label">🎲 ${formatNumber(avgRolls.toFixed(0))} Avg Rolls Needed</span></div>`);

        const toggleBar = $('<div class="toggle-bar"><span class="toggle-icon">▼</span> More Info</div>');
        const extraInfo = $(`<div class="extra-info"><p>This figure is an estimate based on a total of ${formatNumber(attempts)} simulations. It represents an idea of the average number of rolls needed to obtain the desired result.</p><p>Procedure: For each simulation, a random number between 0 and 1 is generated. If this number is less than or equal to the calculated probability (1 / Probability), the desired race or spell is obtained. The average is then calculated over all simulations.</p></div>`);

        toggleBar.on('click', function() {
            extraInfo.slideToggle();
            $(this).find('.toggle-icon').text($(this).find('.toggle-icon').text() === '▼' ? '▲' : '▼');
        });

        content.append(title, stats, toggleBar, extraInfo);
        card.append(content);
        resultsDiv.append(card);
    }
});

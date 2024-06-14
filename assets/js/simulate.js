$(document).ready(async function () {
    let racesData = [];
    let spellsData = [];
    let currentChoice, data;

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

    function setIndex(data) {
        data.forEach((item, index) => {
            item.index = index + 1;
        });
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function formatNumber(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
        }
        return value.toString();
    }

    $('.part2, .part3, .part4').hide();

    $('#roll-choice').on('change', function () {
        currentChoice = $(this).val();
        data = currentChoice === 'races' ? racesData : spellsData;
        $('#dropdown-choice').empty().append(`<option value="" id="disable-choice">Choose your ${currentChoice} (${data.length} available)</option>`);
        data.forEach(details => {
            $('#dropdown-choice').append(`<option value="${details.type + '-' + details.name}">${details.type === 'normal' ? '' : capitalize(details.type)} ${details.name} | 🎲  1 in ${formatNumber(details.probability)}</option>`);
        });
        $('.part2').show();
    });

    $('#dropdown-choice').on('change', function () {
        $('.part3, .part4').show();
        $('#disable-choice').hide();
    });

    $('#form').on('submit', function (e) {
        e.preventDefault();
        const attempts = parseInt($('#attemps').val(), 10);
        const selectedItem = $('#dropdown-choice').val();
        const selectedData = data.find(item => `${item.type}-${item.name}` === selectedItem);

        if (selectedData && attempts > 0) {
            const avgRolls = simulateRolls(selectedData.probability, attempts);
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
            while (Math.random() > probabilityForCalculation) {
                rolls++;
            }
            totalRolls += rolls;
        }
        return totalRolls / attempts;
    }

    function getRarityColor(rarity) {
        switch (rarity) {
            case 'common': return 'rgb(168, 168, 168)';
            case 'un-common': return 'rgb(17, 148, 17)';
            case 'rare': return 'rgb(64, 123, 199)';
            case 'epic': return 'rgb(133, 0, 133)';
            case 'legendary': return 'rgb(170, 107, 12)';
            case 'mythical': return 'rgb(201, 35, 35)';
            default: return 'rgba(44, 44, 44, 0.80)';
        }
    }

    const fallbackImgSrc = `assets/img/no image data.png`;

    function displayResults(avgRolls, attempts, selectedData) {
        const img = currentChoice === 'races' ? `assets/img/${currentChoice}/${(selectedData.name).toLowerCase()}/${(selectedData.type).toLowerCase()}-${(selectedData.name).toLowerCase()}.png` : `assets/img/${currentChoice}/icon/${(selectedData.name).toLowerCase()}.png`;
        const classImg = currentChoice === 'races' ? 'image-icon-races' : 'image-icon';
        const resultsDiv = $('#results');
        resultsDiv.empty();
        const card = $('<div class="result-card"></div>');
        const content = $(`<div class="result-content" data-rarity="${selectedData.rarity}" style="background-color: ${getRarityColor(selectedData.rarity)}"></div>`);
        const title = $(`<img class="${classImg}" src="${img}" onerror="this.src='${fallbackImgSrc}'"><div class="result-title">${selectedData.type === 'normal' ? '' : capitalize(selectedData.type)} ${selectedData.name}</div>`);
        const stats = $('<div class="result-stats"></simple>');
        stats.append(`<div class="result-stat"><span class="stat-label">🎲 ${formatNumber(avgRolls.toFixed(0))} Avg Rolls Needed</span></div>`);

        const toggleBar = $('<div class="toggle-bar"><span class="toggle-icon">▼</span> More Info</div>');
        const extraInfo = $(`<div class="extra-info"></div>`);
        extraInfo.html(`<p>This figure is an estimate based on a total of ${formatNumber(attempts)} simulations. It represents an idea of the average number of rolls needed to obtain the desired result.</p><p>Procedure: For each simulation, a random number between 0 and 1 is generated after each roll. If this number is less than or equal to the calculated probability (1 / Probability), the desired race or spell is obtained. This process is repeated until the desired race or spell is obtained for each simulation. The total number of rolls for all simulations is then summed and divided by the number of simulations to get the average.</p>`);
        toggleBar.on('click', function () {
            extraInfo.slideToggle();
            $(this).find('.toggle-icon').text($(this).find('.toggle-icon').text() === '▼' ? '▲' : '▼');
        });
        content.append(title, stats, toggleBar, extraInfo);
        card.append(content);
        resultsDiv.append(card);
    }
});

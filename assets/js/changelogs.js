$(document).ready(function () {
    let changelogsData = [];
    let currentIndex = 0;

    // Fetch and render the initial data
    fetch('assets/data/changelogs.json')
        .then(response => response.json())
        .then(data => {
            changelogsData = data;
            renderChangelog(currentIndex);
            updateButtons();
        })
        .catch(error => {
            console.error('Error fetching changelogs data:', error);
        });

    // Event listeners for navigation buttons
    $('#previous').click(function () {
        if (currentIndex > 0) {
            currentIndex--;
            renderChangelog(currentIndex);
            updateButtons();
        }
    });

    $('#next').click(function () {
        if (currentIndex < changelogsData.length - 1) {
            currentIndex++;
            renderChangelog(currentIndex);
            updateButtons();
        }
    });

    // Function to render the changelog content
    function renderChangelog(index) {
        const entry = changelogsData[index];
        let contentHtml = '';
        entry.content.forEach(line => {
            contentHtml += line;
        });
        $('#changelogs-container').html(contentHtml);

    }

    // Function to update the state of the buttons
    function updateButtons() {
        $('#previous').prop('disabled', currentIndex === 0);
        $('#next').prop('disabled', currentIndex === changelogsData.length - 1);
    }
});

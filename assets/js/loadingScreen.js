
$(document).ready(function() {
    // Initialize percentage
    let percentage = 0;
    const interval = 20; // Update every 20ms
    const duration = 1000; // Total duration of 2 seconds
    const increment = 100 / (duration / interval); // Calculate increment

    // Function to update the progress bar and percentage
    function updateProgressBar() {
        if (percentage <= 100) {
            $('.progress-bar').css('width', percentage*2 + '%');
            $('.loading-percentage').text(Math.floor(percentage) + '%');
            percentage += increment;
            setTimeout(updateProgressBar, interval);
        }
    }

    // Start updating the progress bar
    updateProgressBar();

    // Hide the loading screen after 2 seconds
    setTimeout(function() {
        $('.loadingScreen').fadeOut(500, function() {
            $('.container').fadeIn(500);
            $('.navbar').fadeIn(500);
        });
    }, 1000);
});

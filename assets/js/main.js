$(document).ready(function() {
    // Initialize AOS Animations
    AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-quad'
    });

    // Smooth scroll for navigation
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 70
        }, 600);
    });

    // Appointment Form Logic
    $('#appointment-form').on('submit', function(e) {
        e.preventDefault();

        // Collect Form Data
        const name = $('#patient-name').val();
        const mobile = $('#patient-mobile').val();
        const date = $('#appt-date').val();
        const time = $('#appt-time').val();
        const venue = $('input[name="venue"]:checked').val();
        const reason = $('#appt-reason').val();

        // Construct WhatsApp Message [cite: 562]
        const msg = `Appointment Booking - Dr. Mohammed Arman\n\n` +
                    `Patient Name: ${name}\n` +
                    `Mobile: ${mobile}\n` +
                    `Consultation Venue: ${venue}\n` +
                    `Preferred Date: ${date}\n` +
                    `Preferred Time: ${time}\n` +
                    `Reason for Visit: ${reason}\n\n` +
                    `--- Booked via dr.mohammed.arman.bd ---`;

        // Success Alert and Redirect [cite: 567]
        Swal.fire({
            title: 'Appointment Request Sent!',
            html: 'You are being redirected to WhatsApp to confirm with <b>Dr. Mohammed Arman</b>.',
            icon: 'success',
            timer: 3000,
            timerProgressBar: true,
            confirmButtonText: 'Open WhatsApp',
            confirmButtonColor: '#1565C0'
        }).then(() => {
            const encodedMsg = encodeURIComponent(msg);
            window.open(`https://wa.me/8801841760769?text=${encodedMsg}`, '_blank');
        });
    });
});

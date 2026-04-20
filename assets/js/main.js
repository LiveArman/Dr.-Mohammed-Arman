/* ============================================
   Dr. Mohammed Arman — Main JavaScript
   Physical Medicine Specialist Website
   ============================================ */

$(document).ready(function () {

  // ---- AOS Animation Init ----
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-quad',
    offset: 60
  });

  // ---- Set minimum date for appointment to today ----
  const today = new Date().toISOString().split('T')[0];
  $('#appt-date').attr('min', today);

  // ---- Mobile Menu Toggle ----
  $('#menu-toggle').on('click', function () {
    const $menu = $('#mobile-menu');
    $menu.toggleClass('open');
    if ($menu.hasClass('open')) {
      $menu.slideDown(300);
      $(this).find('i').removeClass('fa-bars').addClass('fa-times');
    } else {
      $menu.slideUp(300);
      $(this).find('i').removeClass('fa-times').addClass('fa-bars');
    }
  });

  // ---- Close mobile menu on link click ----
  $('.mobile-link').on('click', function () {
    $('#mobile-menu').slideUp(300);
    $('#menu-toggle').find('i').removeClass('fa-times').addClass('fa-bars');
  });

  // ---- Smooth Scroll for anchor links ----
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this).attr('href');
    if (target === '#') return;
    const $target = $(target);
    if ($target.length) {
      e.preventDefault();
      $('html, body').animate(
        { scrollTop: $target.offset().top - 75 },
        600,
        'swing'
      );
    }
  });

  // ---- Navbar scroll effect ----
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 50) {
      $('#navbar').addClass('scrolled');
    } else {
      $('#navbar').removeClass('scrolled');
    }

    // Back to top button
    if ($(this).scrollTop() > 400) {
      $('#back-to-top').addClass('visible').show();
    } else {
      $('#back-to-top').removeClass('visible').hide();
    }

    // Active nav highlighting
    updateActiveNav();
  });

  // ---- Back to Top ----
  $('#back-to-top').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500);
  });

  // ---- Counter Animation ----
  let countersStarted = false;
  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    $('.counter, .counter2').each(function () {
      const $el = $(this);
      const target = parseInt($el.data('target'), 10);
      const duration = target > 100 ? 2500 : 1500;
      $({ Counter: 0 }).animate(
        { Counter: target },
        {
          duration: duration,
          easing: 'swing',
          step: function () {
            $el.text(Math.ceil(this.Counter).toLocaleString());
          },
          complete: function () {
            $el.text(target.toLocaleString());
          }
        }
      );
    });
  }

  // Trigger counters when hero section is visible
  const $heroSection = $('#hero');
  function checkCounters() {
    if (!countersStarted && $heroSection.length) {
      const top = $heroSection.offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();
      if (windowBottom > top + 100) {
        startCounters();
      }
    }
  }
  $(window).on('scroll', checkCounters);
  // Also fire on page load (hero is visible on load)
  setTimeout(startCounters, 800);

  // ---- Active Nav Link ----
  function updateActiveNav() {
    const scrollPos = $(window).scrollTop() + 80;
    const sections = ['#hero', '#about', '#specialties', '#services', '#chambers', '#why-choose', '#testimonials', '#gallery', '#contact', '#appointment'];
    let currentSection = '';
    sections.forEach(function (id) {
      const $section = $(id);
      if ($section.length && $section.offset().top <= scrollPos) {
        currentSection = id;
      }
    });
    $('.nav-link').removeClass('active');
    if (currentSection) {
      $(`.nav-link[href="${currentSection}"]`).addClass('active');
    }
  }

  // ---- Online Payment Block ----
  $('#payment-online').on('change', function () {
    if ($(this).is(':checked')) {
      Swal.fire({
        icon: 'info',
        title: 'Online Payment Unavailable',
        text: 'Online payment is currently not available. Please select Offline payment.',
        confirmButtonColor: '#1565C0',
        confirmButtonText: 'Understood',
        customClass: { popup: 'rounded-2xl' }
      });
      $('#payment-offline').prop('checked', true);
    }
  });

  // ---- Time Pill Visual Selection ----
  $(document).on('change', '.time-pill input[type="radio"]', function () {
    $('.time-pill span').removeClass('selected-time');
    $(this).next('span').addClass('selected-time');
  });

  // ---- Appointment Form Submit ----
  $('#appointment-form').on('submit', function (e) {
    e.preventDefault();

    // Gather values
    const name     = $.trim($('#patient-name').val());
    const dob      = $.trim($('#patient-dob').val());
    const mobile   = $.trim($('#patient-mobile').val());
    const whatsapp = $.trim($('#patient-whatsapp').val());
    const location = $.trim($('#patient-location').val());
    const venue    = $('input[name="venue"]:checked').val() || '';
    const date     = $.trim($('#appt-date').val());
    const time     = $('input[name="time"]:checked').val() || '';
    const reason   = $.trim($('#appt-reason').val());
    const notes    = $.trim($('#appt-notes').val());

    // Validation
    if (!name || !dob || !mobile || !location || !venue || !date || !time || !reason) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill all required fields',
        html: 'Make sure to select a <b>Location</b>, <b>Date</b>, <b>Time slot</b>, and fill in all required patient information.',
        confirmButtonColor: '#1565C0',
        confirmButtonText: 'OK, Got it!'
      });
      return;
    }

    // Build WhatsApp message
    const msg =
      `*Appointment Booking — Dr. Mohammed Arman*\n\n` +
      `*Patient Name:* ${name}\n` +
      `*Date of Birth:* ${dob}\n` +
      `*Mobile:* ${mobile}\n` +
      (whatsapp ? `*WhatsApp:* ${whatsapp}\n` : '') +
      `*Location:* ${location}\n` +
      `*Consultation Venue:* ${venue}\n` +
      `*Preferred Date:* ${date}\n` +
      `*Preferred Time:* ${time}\n` +
      `*Payment Method:* Offline\n` +
      `*Reason for Visit:* ${reason}\n` +
      (notes ? `*Notes:* ${notes}\n` : '') +
      `\n---\n_Booked via dr.mohammed.arman.bd_`;

    // SweetAlert2 success popup → WhatsApp redirect
    Swal.fire({
      title: 'Appointment Request Sent!',
      html: `You are being redirected to WhatsApp to confirm your appointment with <b>Dr. Mohammed Arman</b>.`,
      icon: 'success',
      confirmButtonText: 'Open WhatsApp',
      confirmButtonColor: '#1565C0',
      timer: 4000,
      timerProgressBar: true,
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      customClass: { popup: 'swal2-popup' }
    }).then(function (result) {
      const waUrl = 'https://wa.me/8801841760769?text=' + encodeURIComponent(msg);
      window.open(waUrl, '_blank');
      // Reset form
      $('#appointment-form')[0].reset();
    });
  });

  // ---- Gallery Lightbox (simple modal) ----
  $('.gallery-item').on('click', function () {
    // Simple lightbox using SweetAlert2
    const $item = $(this);
    const title = $item.find('p').first().text() || 'Gallery';
    const subtitle = $item.find('p').last().text() || '';
    Swal.fire({
      title: title,
      text: subtitle,
      showConfirmButton: false,
      showCloseButton: true,
      backdrop: 'rgba(13, 71, 161, 0.8)'
    });
  });

  // ---- Smooth reveal animation on page load ----
  $('body').addClass('loaded');

  // ---- Lazy load iframes ---- (performance)
  if ('IntersectionObserver' in window) {
    const iframes = document.querySelectorAll('iframe[src]');
    const iframeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (!iframe.dataset.loaded) {
            iframe.dataset.loaded = true;
            iframeObserver.unobserve(iframe);
          }
        }
      });
    }, { rootMargin: '200px' });
    iframes.forEach(function (iframe) {
      iframeObserver.observe(iframe);
    });
  }

  // ---- Venue radio cards visual update ----
  $('input[name="venue"]').on('change', function () {
    $('.venue-card').removeClass('border-blue-600 bg-blue-50').addClass('border-gray-200');
    $(this).closest('.venue-card').removeClass('border-gray-200').addClass('border-blue-600 bg-blue-50');
  });

  // ---- Initialize: trigger first scroll check ----
  updateActiveNav();

}); // end document.ready

'use strict';

// Ensure jQuery is loaded before running the script
if (typeof jQuery === 'undefined') {
  throw new Error('jQuery is not loaded. Please make sure jQuery is included before this script.');
}

$(document).ready(function() {
  var $wrap = $(".wrapper"),
      $pages = $(".page"),
      pages = $pages.length, // Set the number of pages dynamically
      scrolling = false,
      currentPage = 1,
      $navPanel = $(".nav-panel"),
      $scrollBtn = $(".scroll-btn"),
      $navBtn = $(".nav-btn"),
      scrollSpeed = 1000; // Scroll speed can be adjusted as needed

  /*****************************
  ***** NAVIGATE FUNCTIONS *****
  *****************************/
  function manageClasses() {
    $pages.each(function(index) {
      if (index + 1 === currentPage) {
        $(this).css("transform", "rotateX(0deg) scale(1)");
      } else {
        $(this).css("transform", "rotateX(180deg) scale(0.8)");
      }
    });
    $navBtn.removeClass("active");
    $(".nav-btn[data-target=" + currentPage + "]").addClass("active");
    $navPanel.addClass("invisible");
    scrolling = true;
    setTimeout(function() {
      $navPanel.removeClass("invisible");
      scrolling = false;
    }, scrollSpeed);
    updateFocus();
  }

  function navigateUp() {
    if (currentPage > 1) {
      currentPage--;
    } else {
      currentPage = pages; // Loop back to the last page
    }
    manageClasses();
  }

  function navigateDown() {
    if (currentPage < pages) {
      currentPage++;
    } else {
      currentPage = 1; // Loop back to the first page
    }
    manageClasses();
  }

  /*********************
  ***** MOUSEWHEEL *****
  *********************/
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  $(document).on("wheel", debounce(function(e) {
    if (!scrolling) {
      if (e.originalEvent.deltaY < 0) {
        navigateUp();
      } else { 
        navigateDown();
      }
    }
  }, 200)); // Added debounce to improve performance

  /**************************
  ***** TOUCH SUPPORT ******
  **************************/
  $(document).on("touchstart", function(e) {
    let startY = e.originalEvent.touches[0].clientY;
    $(document).on("touchmove", function(e) {
      let moveY = e.originalEvent.touches[0].clientY;
      if (!scrolling) {
        if (startY - moveY > 50) {
          navigateDown();
        } else if (moveY - startY > 50) {
          navigateUp();
        }
      }
    });
    $(document).on("touchend", function() {
      $(document).off("touchmove touchend");
    });
  });

  /**************************
  ***** KEYBOARD SUPPORT ****
  **************************/
  $(document).on("keydown", function(e) {
    if (!scrolling) {
      if (e.key === "ArrowUp") {
        navigateUp();
      } else if (e.key === "ArrowDown") {
        navigateDown();
      }
    }
  });

  /**************************
  ***** RIGHT NAVIGATION ****
  **************************/

  /* NAV UP/DOWN BTN PAGE NAVIGATION */
  $(document).on("click", ".scroll-btn", function() {
    if (!scrolling) {
      if ($(this).hasClass("up")) {
        navigateUp();
      } else {
        navigateDown();
      }
      disableScrollButtons();
    }
  });

  /* NAV CIRCLE DIRECT PAGE BTN */
  $(document).on("click", ".nav-btn:not(.active)", function() {
    if (!scrolling) {
      var target = parseInt(this.dataset.target, 10); // Use dataset for better performance
      if (!isNaN(target) && target >= 1 && target <= pages) { // Add validation to ensure target is valid
        currentPage = target;
        manageClasses();
      }
    }
  });

  /**************************
  ***** INITIAL SETUP ******
  **************************/
  // Set active class to the first navigation button initially
  $(".nav-btn[data-target=" + currentPage + "]").addClass("active");
  manageClasses(); // Apply initial transformations

  // Disable scroll buttons temporarily while scrolling is in progress
  function disableScrollButtons() {
    $scrollBtn.prop('disabled', true);
    setTimeout(function() {
      $scrollBtn.prop('disabled', false);
    }, scrollSpeed);
  }

  // Progressive enhancement for JavaScript-disabled environments
  $(".nav-btn").each(function() {
    var target = $(this).attr("data-target");
    $(this).append('<a href="#page' + target + '" aria-label="Navigate to page ' + target + '" role="button">Page ' + target + '</a>');
  });

  // Throttling instead of debounce for scroll
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  $(document).on("wheel", throttle(function(e) {
    if (!scrolling) {
      if (e.originalEvent.deltaY < 0) {
        navigateUp();
      } else { 
        navigateDown();
      }
    }
  }, 200));

  // Modularize the code for better maintainability
  function initNavigation() {
    // All the code related to navigation setup goes here
  }

  function initEventHandlers() {
    // All event handlers setup code goes here
  }

  initNavigation();
  initEventHandlers();

  // Add dark/light theme toggle
  $("#theme-toggle").on("click", function() {
    $("body").toggleClass("dark-theme");
    localStorage.setItem("theme", $("body").hasClass("dark-theme") ? "dark" : "light");
  });

  if (localStorage.getItem("theme") === "dark") {
    $("body").addClass("dark-theme");
  }

  // Update focus for accessibility
  function updateFocus() {
    $pages.attr("tabindex", "-1");
    $pages.eq(currentPage - 1).attr("tabindex", "0").focus();
  }

  // Scroll to top/bottom buttons
  $(document).on("click", ".scroll-to-top", function() {
    currentPage = 1;
    manageClasses();
  });

  $(document).on("click", ".scroll-to-bottom", function() {
    currentPage = pages;
    manageClasses();
  });

  // Custom event for page change
  $(document).trigger("pageChange", [currentPage]);
  $(document).on("pageChange", function(e, page) {
    console.log("Page changed to:", page);
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const items = document.querySelectorAll(".accordion button");

  function toggleAccordion() {
    const itemToggle = this.getAttribute('aria-expanded');
    
    // Setze alle Elemente auf 'false', um sicherzustellen, dass nur ein Element expandiert
    items.forEach(item => item.setAttribute('aria-expanded', 'false'));
    
    // Wenn das aktuelle Element geschlossen war, öffne es
    if (itemToggle === 'false') {
      this.setAttribute('aria-expanded', 'true');
    }
  }

  // Füge den Event Listener für jedes Element hinzu
  items.forEach(item => item.addEventListener('click', toggleAccordion));
});
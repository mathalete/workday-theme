/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function () {
  var html,
    body,
    container,
    button,
    menu,
    menuWrapper,
    links,
    subMenus,
    i,
    len,
    focusableElements,
    firstFocusableElement,
    lastFocusableElement,
    hideBackground,
    homeLinkContainer,
    subMenuToggleButton,
    subMenuToggleButtons;

  container = document.getElementById("site-navigation");
  if (!container) {
    return;
  }

  button = document.getElementById("menu-toggle");
  if ("undefined" === typeof button) {
    return;
  }

  // Set vars.
  html = document.getElementsByTagName("html")[0];
  body = document.getElementsByTagName("body")[0];
  menu = container.getElementsByTagName("ul")[0];
  links = menu.getElementsByTagName("a");
  subMenus = menu.getElementsByTagName("ul");
  menuWrapper = document.getElementById("main-navigation-wrapper");
  var mastHead = document.getElementById("masthead");
  var homeLinkContainer = masthead.getElementsByTagName("p")[0];
  var mastHeadLink = homeLinkContainer.getElementsByTagName("a")[0];

  // main = document.getElementById("content");
  // footer = document.getElementById("colophon");
  // aside = document.getElementsByTagName("aside");

  // Hide menu toggle button if menu is empty and return early.
  if ("undefined" === typeof menu) {
    button.style.display = "none";
    return;
  }

  if (-1 === menu.className.indexOf("nav-menu")) {
    menu.className += " nav-menu";
  }

  // For webkit
  menu.setAttribute("role", "list");

  for (i = 0, len = subMenus.length; i < len; i++) {
    subMenus[i].setAttribute("role", "list");
  }

  // Small screen mobile nav

  button.onclick = function () {
    
    if (-1 !== container.className.indexOf("toggled")) {
      closeMenu(); // Close menu.
    } else {
      
      // Open nav panel
      html.className += " disable-scroll";
      body.className += " main-navigation-open";
      container.className += " toggled";
      button.className += " toggled";
      button.setAttribute("aria-label", "Close navigation panel");
      hideBackground = document.createElement("div");
      hideBackground.className += "fullScreen";
      main.setAttribute("aria-hidden", "true");
      masthead.insertAdjacentElement("afterend", hideBackground);
      homeLinkContainer.setAttribute("aria-hidden", "true");
      mastHeadLink.setAttribute("tabindex", "-1");
      
      // Set focusable elements inside main navigation.
      focusableElements = container.querySelectorAll([
        "a[href]",
        "area[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "button:not([disabled])",
        "iframe",
        "object",
        "embed",
        "[contenteditable]",
        '[tabindex]:not([tabindex^="-"])'
      ]);
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];

      // Redirect last Tab to first focusable element.
      lastFocusableElement.addEventListener("keydown", function (e) {
        if (e.keyCode === 9 && !e.shiftKey) {
          e.preventDefault();
          button.focus(); // Set focus on first element - that's actually close menu button.
        }
      });

      // Redirect first Shift+Tab to toggle button element.
      firstFocusableElement.addEventListener("keydown", function (e) {
        if (e.keyCode === 9 && e.shiftKey) {
          e.preventDefault();
          button.focus(); // Set focus on last element.
        }
      });

      // Redirect Shift+Tab from the toggle button to last focusable element.
      button.addEventListener("keydown", function (e) {
        if (e.keyCode === 9 && e.shiftKey) {
          e.preventDefault();
          lastFocusableElement.focus(); // Set focus on last element.
        }
      });
    }
  };

  // Close menu using Esc key.
  document.addEventListener("keyup", function (event) {
    if (event.keyCode == 27) {
      if (-1 !== container.className.indexOf("toggled")) {
        closeMenu(); // Close menu.
      }
    }
  });

  // Close menu clicking menu wrapper area.
  menuWrapper.onclick = function (e) {
    if (
      e.target == menuWrapper &&
      -1 !== container.className.indexOf("toggled")
    ) {
      closeMenu(); // Close menu.
    }
  };

  // Close menu function.
  function closeMenu() {
    html.className = html.className.replace(" disable-scroll", "");
    body.className = body.className.replace(" main-navigation-open", "");
    container.className = container.className.replace(" toggled", "");
    button.className = button.className.replace(" toggled", "");
    button.setAttribute("aria-label", "Open navigation panel");

    homeLinkContainer.removeAttribute("aria-hidden", "true");
    mastHeadLink.removeAttribute("tabindex", "-1");
    main.removeAttribute("aria-hidden", "true");

    // Remove the div that hides the bg when modal is opened
    if (hideBackground.parentNode) {
      hideBackground.parentNode.removeChild(hideBackground);
    }
    // Manage focus after a delay
    setTimeout(function () {
      button.focus();
    }, 350);
  }

  // Each time a menu link is focused or blurred, toggle focus.
  for (i = 0, len = links.length; i < len; i++) {
    var grandparent = links[i].parentElement.parentElement;
    if (grandparent.id !== 'primary-menu') {

       links[i].addEventListener("focus", toggleFocus, true);
       links[i].addEventListener("blur", toggleFocus, true);
    }

    var downArrowIcon = links[i].getElementsByTagName('svg')[0];
     
    if (downArrowIcon) {
       links[i].removeChild(downArrowIcon);
    }

  }

  function toggleElementFocus(e) {
    console.log('toggleElementFocus', e);
    if (-1 !== e.className.indexOf("focus")) {
      e.className = e.className.replace(" focus", "");
    } else {
      e.className += " focus";
    }
  }

  /**
   * Sets or removes .focus class on an element.
   */
  function toggleFocus() {
    var self = this;

    // Move up through the ancestors of the current link until we hit .nav-menu.
    while (-1 === self.className.indexOf("nav-menu")) {
      // On li elements toggle the class .focus.
      if ("li" === self.tagName.toLowerCase()) {
        toggleElementFocus(self);
      }

      self = self.parentElement;
    }
  }

  /**
   * Adds buttons for dropdown navigation menus on larger viewports
   */

   // Construct buttons

   for (i = 0, len = subMenus.length; i < len; i++) {
    var subMenuParentLink = subMenus[i].parentNode.firstElementChild;
    var subMenuParentLinkText =
      subMenus[i].parentNode.firstElementChild.innerHTML;

    // Set up IDs
    subMenuParentLink.setAttribute("id", "subMenu-parent-" + i);
    subMenus[i].setAttribute("id", "subMenu-" + i);

    // Hide the submenus on page load
    subMenus[i].className += "hide";

    // Insert a button with all required attributes
    var subMenuToggleButton = document.createElement("button");
    subMenuToggleButton.setAttribute("type", "button");
    subMenuToggleButton.setAttribute("id", "subMenu-toggle-" + i);
    subMenuToggleButton.setAttribute("data-toggle", "dropdown");
    subMenuToggleButton.setAttribute("data-target", "#subMenu-" + i);
    subMenuToggleButton.setAttribute("aria-expanded", "false");
    subMenuToggleButton.setAttribute("aria-controls", "subMenu-" + i);
    subMenuToggleButton.classList.add("collapsed", "subMenu-toggle");
    var insertSubMenuButton = subMenus[i].parentNode;
    insertSubMenuButton.insertBefore(subMenuToggleButton, subMenus[i]);

    // Give the button a name derived from link text
    subMenuToggleButton.setAttribute(
      "aria-label",
      subMenuParentLinkText + " submenu"
    );

    // Insert SVG
    subMenuToggleButton.innerHTML =
      "<svg aria-hidden='true' focusable='false' xmlns='http://www.w3.org/2000/svg' fill='current-color' width='1em' height='1em' viewBox='0 0 960 560'><defs/><path d='M480 344.181L268.869 131.889c-15.756-15.859-41.3-15.859-57.054 0-15.754 15.857-15.754 41.57 0 57.431l237.632 238.937c8.395 8.451 19.562 12.254 30.553 11.698 10.993.556 22.159-3.247 30.555-11.698L748.186 189.32c15.756-15.86 15.756-41.571 0-57.431s-41.299-15.859-57.051 0L480 344.181z'/></svg>";
  } // construct buttons

  // Button behaviour

  // Get all toggle buttons - including parents... so only works one level down
  var menuToggleButtons = document.querySelectorAll("[data-toggle=dropdown]");

  for (var i = 0, s = menuToggleButtons.length; i < s; i++) {
    var thisToggleButton = menuToggleButtons[i];

    thisToggleButton.addEventListener("click", function () {
      var isExpanded = this.getAttribute("aria-expanded");
      var thisSubMenu = this.getAttribute("data-target");

      // Toggle aria-expanded on this button, and toggle class on sibling submenu
      if (isExpanded == "true") {
        this.setAttribute("aria-expanded", "false");
        this.nextElementSibling.classList.add("hide");
      } else {
        this.setAttribute("aria-expanded", "true");
        this.nextElementSibling.classList.remove("hide");
      }
      // aria-expanded

      // Toggle class and attribute on siblings on level 1 submenus
      for (var j = 0, z = menuToggleButtons.length; j < z; j++) {
        if (menuToggleButtons[j] != this) {
          
          // Set aria-expanded to false on other dropdowns
          menuToggleButtons[j].setAttribute("aria-expanded", "false");

          // Get corresponding dropdown menus
          var siblingSubMenus = document.querySelector(
            menuToggleButtons[j].getAttribute("data-target")
          );

          // hide other menus that are opened
          siblingSubMenus.classList.add("hide");
        }
      } // for each sibling menuToggleButton

      // Get the submenu of the current button

      var thisSubMenu = document.querySelector(
        this.getAttribute("data-target")
      );

      // Pressing the escape key when focus is in a submenu closes it

      thisSubMenu.addEventListener("keydown", function (e) {
        switch (e.which) {
          case 27:
            e.preventDefault();
            var self = this;
            self.classList.add("hide");
            self.previousSibling.setAttribute("aria-expanded", "false");

            setTimeout(function () {
              self.previousSibling.focus();
            }, 350);
            break;
        } //switch
        
      }); // escape key

    }); // thisToggleButton click

  } // for menuToggleButtons

  /**
   * Closes submenu
   */

})();

/**
 * Skip link focus fix.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function () {
  var isIe = /(trident|msie)/i.test(navigator.userAgent);

  if (isIe && document.getElementById && window.addEventListener) {
    window.addEventListener(
      "hashchange",
      function () {
        var id = location.hash.substring(1),
          element;

        if (!/^[A-z0-9_-]+$/.test(id)) {
          return;
        }

        element = document.getElementById(id);

        if (element) {
          if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
            element.tabIndex = -1;
          }

          element.focus();
        }
      },
      false
    );
  }
})();
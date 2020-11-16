/*!
 * submenus.js
 *
 * This script does the following -
 * 
 *  - adds role="list" to the parent navigation <ul> and subsequent chlid <ul>
 *  - constructs and injects buttons as siblings to each submenu link
 *  - clicking that button will toggle the display of the corresponding submenu
 *  - clicking one submenu button will close any other submenus that are open
 *  - pressing the escape key when focus is inside a submenu will close it
 *  - pressing tab on the last link in a submenu will close that submenu
 *  - pressing shift/tab on the first link in a submenu will close that submenu
 *  - Clicking outside the menu when there is a submenu open will close all submenus
 * 
 *  Caveats
 *  - As per the Checathlon theme, submenus must not be more than 1 level deep
 */

(function () {
  var subMenus, menu;

  container = document.getElementById("site-navigation");
  menu = container.getElementsByTagName("ul")[0];
  subMenus = menu.getElementsByTagName("ul");

  // For webkit add role list
  menu.setAttribute("role", "list");

  // Sub menus

  if ( ! subMenus ) {
    return;
  }

  for (i = 0, len = subMenus.length; i < len; i++) {
    subMenus[i].setAttribute("role", "list");
  }

  for (i = 0, len = subMenus.length; i < len; i++) {
    var subMenuParentLink = subMenus[i].parentNode.firstElementChild;
    var subMenuParentLinkText =
      subMenus[i].parentNode.firstElementChild.innerHTML;

    // Set up IDs
    subMenuParentLink.setAttribute("id", "subMenu-parent-" + i);
    subMenus[i].setAttribute("id", "subMenu-" + i);

    // Hide the submenus on page load
    subMenus[i].className += " hide";

    // Insert a button with all required attributes
    var subMenuToggleButton = document.createElement("button");
    subMenuToggleButton.setAttribute("type", "button");
    subMenuToggleButton.setAttribute("id", "subMenu-toggle-" + i);
    subMenuToggleButton.setAttribute("data-toggle", "dropdown");
    subMenuToggleButton.setAttribute("data-target", "#subMenu-" + i);
    subMenuToggleButton.setAttribute("aria-expanded", "false");
    subMenuToggleButton.setAttribute("aria-controls", "subMenu-" + i);
    subMenuToggleButton.classList.add("subMenu-toggle");
    var insertSubMenuButton = subMenus[i].parentNode;
    insertSubMenuButton.insertBefore(subMenuToggleButton, subMenus[i]);

    // Insert SVG
    subMenuToggleButton.innerHTML =
      " <svg aria-hidden='true' focusable='false' xmlns='http://www.w3.org/2000/svg' fill='#007CB2' width='1em' height='1em' viewBox='0 0 960 560'><defs/><path d='M480 344.181L268.869 131.889c-15.756-15.859-41.3-15.859-57.054 0-15.754 15.857-15.754 41.57 0 57.431l237.632 238.937c8.395 8.451 19.562 12.254 30.553 11.698 10.993.556 22.159-3.247 30.555-11.698L748.186 189.32c15.756-15.86 15.756-41.571 0-57.431s-41.299-15.859-57.051 0L480 344.181z'/></svg>";

    // Give the button a name derived from link text
    subMenuToggleButton.setAttribute(
      "aria-label",
      subMenuParentLinkText + " submenu"
    );

    subMenus[i].setAttribute("aria-labelledby", "subMenu-toggle-" + i);

  } // construct buttons

  // Button behaviour

  // Get all toggle buttons 
  var menuToggleButtons = document.querySelectorAll("[data-toggle=dropdown]");

  for (var i = 0, s = menuToggleButtons.length; i < s; i++) {
    var thisToggleButton = menuToggleButtons[i];

    thisToggleButton.addEventListener("click", function () {
      var isExpanded = this.getAttribute("aria-expanded");
      var thisSubMenu = this.getAttribute("data-target");

      // Toggle class on button to visually indicate state
      this.classList.toggle('expanded');

      // Toggle aria-expanded on this button, and toggle class on sibling submenu
      if (isExpanded == "true") {
        this.setAttribute("aria-expanded", "false");
        this.nextElementSibling.classList.add("hide");
      } else {
        this.setAttribute("aria-expanded", "true");
        this.nextElementSibling.classList.remove("hide");
      }
      // aria-expanded

      // Toggle class and attribute on siblings
      for (var j = 0, z = menuToggleButtons.length; j < z; j++) {
        if (menuToggleButtons[j] != this) {
          // Set aria-expanded to false on other dropdowns
          menuToggleButtons[j].setAttribute("aria-expanded", "false");
          menuToggleButtons[j].classList.remove("expanded");

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
            self.previousSibling.classList.remove("expanded");

            setTimeout(function () {
              self.previousSibling.focus();
            }, 350);
            break;
        } //switch
      }); // escape key


    }); // thisToggleButton click
  } // for menuToggleButtons

  //I'm using "click" but it works with any event
  document.addEventListener('click', function(event) {
    var isClickInside = menu.contains(event.target);

    if (!isClickInside) {
      //the click was outside the specifiedElement, do something
      for (i = 0, len = subMenus.length; i < len; i++) {
        subMenus[i].classList.add("hide");
      }

      for (var a = 0, s = menuToggleButtons.length; a < s; a++) {
        menuToggleButtons[a].classList.remove("expanded");
        menuToggleButtons[a].setAttribute("aria-expanded","false");
      }
    }
  });

  // click
})(); // function


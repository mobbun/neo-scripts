// ==UserScript==
// @name         Neopets - Easy Active Swap
// @version      2026-01-24
// @description  change active from any page
// @author       joonji
// @match        *://*.neopets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.match(/http(s)?:\/\/(www\.)?neopets\.com\/home/i)) {

        const elements = document.querySelectorAll('.hp-carousel-pet');
        const x = [];

        elements.forEach(element => {
            x.push(element.getAttribute('data-name'));
        });

        const petList = [...new Set(x)];
        GM_setValue("pets", petList);
    }

    // for 2020 layout
    if(document.querySelector('#navprofiledropdown__2020')) {
        const a = document.querySelector('.profile-dropdown-link').textContent.trim();
        GM_setValue("activePet", a);
        const dropdown = createDropdownItems();
        dropdown.value = GM_getValue("activePet") || a;
        dropdown.style.marginLeft = '20px';
        const parent = document.querySelector('.nav-profile-dropdown-clock__2020');
        parent.appendChild(dropdown);

        dropdown.addEventListener('change', (event) => {
        const selectedPet = event.target.value;
        changeActivePet(selectedPet);
    });
    }
    // old layout
    else {
        const a = document.querySelector('.sidebarHeader.medText b').textContent.trim();
        GM_setValue("activePet", a);
        const dropdown = createDropdownItems();
        dropdown.value = GM_getValue("activePet") || a;
        const parent = document.querySelector('.activePet');
        parent.appendChild(dropdown);

        dropdown.addEventListener('change', (event) => {
        const selectedPet = event.target.value;
        changeActivePet(selectedPet);
    });
    }


    /* functionz */
    function createDropdownItems() {
        const x = document.createElement('select');
        x.id = 'active-dropdown';
        x.style.fontWeight = 'bold';

        const pets = GM_getValue("pets") || [];

        pets.forEach(petName => {
            const option = document.createElement('option');
            option.value = petName;
            option.textContent = petName;
            x.appendChild(option);
        });

        return x;
    }

    function changeActivePet(petName) {
        const currentPage = window.location.href;
        const url = `https://www.neopets.com/process_changepet.phtml?new_active_pet=${encodeURIComponent(petName)}`;
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                GM_setValue("activePet", petName);
                location.href = currentPage;
            } else {
                console.error('Failed to change active pet');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

})();

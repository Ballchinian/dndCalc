window.weaponChoices = [];
document.getElementById('weapon').addEventListener('click', function() {
    // Get the weapon input values
    const weaponName = document.querySelector('.weapon.name').value;
    const weaponHitDie = document.querySelector('.weapon.hit').value;
    const weaponDmgDie = document.querySelector('.weapon.dmg').value;


   
    const formatCheck = weaponDmgDie.replace(/[^\d+d+\d]/g, '').split(/d|\+/);
    //console.log(weaponName != '')

    var dmgDieCheck = true;
    let numRolled = 0;
    let diceRolled = 0;
    let modifier = 0;

    formatCheck.forEach((dmgDieSplit, index) => {
        if (dmgDieSplit === '0' || dmgDieSplit === '') {
            dmgDieCheck = false;
        } else {
            // Convert to a number
            const value = Number(dmgDieSplit);

            if (index === 0) {
                // First iteration: add to numRolled
                numRolled += value;
            } else if (index === 1) {
                // Second iteration: add to diceRolled
                diceRolled += value;
            } else if (index === 2) {
                // Third iteration: add to modifier
                modifier += value;
            }
        }
    });

    

    if (weaponName != '' && Number.isInteger(+weaponHitDie)==true && dmgDieCheck) {
        // Create a new weapon object with these values
        

        const weaponChoice = {
            hitDie: weaponHitDie,
            numRolled: numRolled,
            diceRolled: diceRolled,
            modifier: modifier
        };

        window.weaponChoices[weaponName] = weaponChoice;

        // Add the weapon to all action <select> elements
        const actionSelects = document.querySelectorAll('.action');
        actionSelects.forEach(function(select) {
            // Create a new option element
            const newOption = document.createElement('option');
            newOption.value = weaponName;
            newOption.textContent = `${weaponName} (Hit: ${weaponChoice.hitDie}, Dmg: ${weaponChoice.numRolled}d${weaponChoice.diceRolled}+${weaponChoice.modifier})`;

            // Append the new option to the <select> list
            select.appendChild(newOption);
        });

        // Optional: Clear the input fields after adding the weapon
        document.querySelector('.weapon.name').value = '';
        document.querySelector('.weapon.hit').value = '';
        document.querySelector('.weapon.dmg').value = '';
    }

    else {
        this.textContent = 'Not valid';
        setTimeout(() => {
            this.textContent = 'Add Weapon';
        }, 500);
    };

    
});
function hitAndCritChanceCal(greaterThanToHitTable) {
    //For crits
    if (greaterThanToHitTable >= 21) {
        var critChance = 0.05;
    } else if (greaterThanToHitTable >= 2 && greaterThanToHitTable <= 20) {
        var critChance = 1 - ((greaterThanToHitTable - 1) / 20);
    };

    //Normal hit chance using hitTable. More convinient to calculate as crits
    //Can canabalise hit chance into crit chance
    if (greaterThanToHitTable >= 31) {
        var hitChance = 0;
    } else if (greaterThanToHitTable >= 20 && greaterThanToHitTable <= 30) {
        var hitChance = 1 - ((greaterThanToHitTable - 10) / 20);  
    } else if (greaterThanToHitTable >= 13 && greaterThanToHitTable <= 19) {
        var hitChance = 0.5;
    } else if (greaterThanToHitTable >= 2 && greaterThanToHitTable <= 12) {
        var hitChance = (greaterThanToHitTable - 2) / 20;
    } else {
        var critChance = 0.95;
        var hitChance = 0;  
    }
    return [hitChance,critChance]
};

//For runic Weapon to be enabled
var runicWeaponToggle=false

//For all the buffs to affect action turn
document.getElementById('selectPlayerBuffsOrDebuffsButton').addEventListener('click', function() {

    const buffOrDebuff = document.getElementById('selectPlayerBuffsOrDebuffs').value;
    if (buffOrDebuff == 'runicWeapon') {
        runicWeaponToggle = true;
    } 
});

document.getElementById('deselectPlayerBuffsOrDebuffsButton').addEventListener('click',function() {
    const buffOrDebuff = document.getElementById('deselectPlayerBuffsOrDebuffs').value;
    if (buffOrDebuff == 'runicWeapon') {
        runicWeaponToggle = false;
    }
});

document.getElementById('selectFoeBuffsOrDebuffsButton').addEventListener('click', function () {
    const buffOrDebuff = document.getElementById('selectFoeBuffsOrDebuffs').value;
});

document.getElementById('deselectFoeBuffsOrDebuffsButton').addEventListener('click', function () {
    const buffOrDebuff = document.getElementById('deselectFoeBuffsOrDebuffs').value;
});


document.getElementById('action').addEventListener('click', function() {
    const actionSelects = document.querySelectorAll('.action');
    const initialAC = document.getElementById('ac').value;
    //const reflex = document.getElementById('reflex').value;
    const weaponChoices = window.weaponChoices;


    //Resets text for previous calculation 
    document.querySelectorAll('.action_reset').forEach(e => e.remove());

    var multiAttackPenalty = 0;

    if (document.getElementById('initialOffGuard').checked == true) {
        var offGuard=true;
    } else {
        var offGuard=false;
    }

    var totalDmg=0;
    const actionUpdate = document.getElementById('actionUpdate');

    actionSelects.forEach(function(select, index) {

        //Name of Weapon/Spell/Alternative
        const selectedAction = select.value;
        
        
        var newAC = initialAC;
        

        //Change to just select weapon eventually
        if (selectedAction !== 'grapple' && selectedAction !== 'trip') {


            //Stats of Weapon
            var currentWeapon = weaponChoices[selectedAction];
            var numRolled = currentWeapon.numRolled;
            var diceRolled = currentWeapon.diceRolled;
            var modifier = currentWeapon.modifier;
            var currentHitDie = parseInt(currentWeapon.hitDie);

            console.log(` numRolled ${numRolled} modifier ${modifier} currentHitDie ${currentHitDie}`)
            //For RunicWeapon/Body
            if (runicWeaponToggle == true) {
                numRolled += 1;
                modifier += 1;
                currentHitDie += 1;
                console.log(` numRolled ${numRolled} modifier ${modifier} currentHitDie ${currentHitDie}`)
            }
            

            //All the conditions
            if (multiAttackPenalty>0) {
                currentHitDie-=multiAttackPenalty*5
            }
            console.log(offGuard)

            if (offGuard==true) {
                newAC-=2;
            }
            //The plus 10 is what you need to roll extra to crit. It is used to
            //generate a table to values with how the hit/crit/miss chance interact 
            //The table is in hitTable.txt 
            var greaterThanToHitTable = newAC-currentHitDie+10;
            
            
            var [hitChance, critChance] = hitAndCritChanceCal(greaterThanToHitTable);
            
            //Calculates the avgDamage if it hits the target, damageGuess considers crit and missing
            const avgDamage = Math.round((numRolled*((diceRolled/2)+0.5)+modifier)*10)/10;
            const damageGuess = Math.round((critChance*avgDamage*2+hitChance*avgDamage)*10)/10;

            //For tracking the total damage of the character
            totalDmg+=damageGuess;
            
            //For formating %chances
            critChance=Math.round(critChance*100)
            hitChance=Math.round(hitChance*100)

            const actionWeaponDescription = document.createElement('p');
            actionWeaponDescription.textContent = `Action ${index+1}: ${selectedAction} does ${avgDamage} dmg on hit and ${damageGuess} dmg on average\nIt has a ${hitChance}% to hit and ${critChance}% to crit hit`;
            actionWeaponDescription.className = 'action_reset';
            actionUpdate.appendChild(actionWeaponDescription);
            
            multiAttackPenalty++;

        } else if (selectedAction == 'grapple' || selectedAction == 'trip') {
            
            const playerAthletics = parseInt(document.getElementById('playerAthletics').value);
            const foeReflex = parseInt(document.getElementById('foeReflex').value);
            const foeFortitude = parseInt(document.getElementById('foeFortitude').value);

            

            if (selectedAction == 'grapple') {
                //Remember to add conditions+status to these
                //Die need to be rolled in order to succeed
                var greaterThanToApply = 10+foeFortitude-playerAthletics;
                normalText = 'grab the foe';
                critText = 'restrain';
            }

            else {
                var greaterThanToApply = 10+foeReflex-playerAthletics;
                normalText = 'make the foe fall prone';
                critText = 'do 1d6 in addition';
            };
            
            if (multiAttackPenalty>0) {
                greaterThanToApply+=multiAttackPenalty*5
            }
            console.log(greaterThanToApply)
            var [hitChance, critChance] = hitAndCritChanceCal(greaterThanToApply+10);
            
            critChance=Math.round(critChance*100);
            hitChance=Math.round(hitChance*100);

            offGuard = true;
            const actionGraTriDescription = document.createElement('p');
            actionGraTriDescription.innerHTML = `Action ${index + 1}: ${selectedAction} has a ${hitChance}% to ${normalText} or a ${critChance}% to ${critText}`;

            actionGraTriDescription.className = 'action_reset';
            actionUpdate.appendChild(actionGraTriDescription);
            
            multiAttackPenalty++;

        }

        //To replace elsewhere
        
    });

    const actionTotalDmg = document.createElement('p');
    actionTotalDmg.textContent = `The total damage you do is ${totalDmg}`;
    actionTotalDmg.className = 'action_reset';
    actionUpdate.appendChild(actionTotalDmg);

});
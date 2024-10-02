document.addEventListener('DOMContentLoaded', function () {
  const selectPlayerElement = document.getElementById('selectPlayerConditions');
  const selectFoeElement = document.getElementById('selectFoeConditions');

  // Function to show the selected list and hide others for a given select element and condition class
  const updateConditions = (selectElement, conditionClass) => {
      const selectedValue = selectElement.value;
      const conditions = document.querySelectorAll(`.${conditionClass}`); // Select all <ol> elements with the specified class
      conditions.forEach(condition => {
          if (condition.classList.contains(selectedValue)) {
              condition.style.display = 'block'; // Show the selected condition
          } else {
              condition.style.display = 'none'; // Hide other conditions
          }
      });
  };

  // Add event listeners to both select elements
  selectPlayerElement.addEventListener('change', () => updateConditions(selectPlayerElement, 'playerCondition'));
  selectFoeElement.addEventListener('change', () => updateConditions(selectFoeElement, 'foeCondition'));

  // Initialize the correct condition lists on page load
  updateConditions(selectPlayerElement, 'playerCondition');
  updateConditions(selectFoeElement, 'foeCondition');
});

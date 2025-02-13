// VARIABLES

const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById("btnSearch");
const patients = [];

// EVENT HANDLING

addPatientButton.addEventListener("click", addPatient);
btnSearch.addEventListener("click", searchCondition);
// FUNCTIONS

function searchCondition() {
  const input = document.getElementById("conditionInput").value.toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  fetch("./health_analysis.json")
    .then((response) => response.json())
    .then((data) => {
      const condition = data.conditions.find(
        (item) => item.name.toLowerCase() === input
      );

      if (condition) {
        const symptoms = condition.symptoms.join(", ");
        const prevention = condition.prevention.join(", ");
        const treatment = condition.treatment;

        resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
        resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;

        resultDiv.innerHTML += `<p><strong>Symptopms:</strong> ${symptoms}</p>`;
        resultDiv.innerHTML += `<p><string>Prevention:</string> ${prevention}</p>`;
        resultDiv.innerHTML += `<p><string>Treatment:</string> ${treatment}</p>`;
      } else {
        resultDiv.innerHTML = "Condition not found.";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      resultDiv.innerHTML = "An error occurred while fetching data.";
    });
}

function addPatient() {
  const name = document.getElementById("name").value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const age = document.getElementById("age");
  const condition = document.getElementById("condition").value;

  if (name && gender && age && condition) {
    patients.push({ name, gender: gender.value, age, condition });
    resetForm();
    generateReport();
  }
}

function resetForm() {
  document.getElementById("name").value = "";
  document.querySelector('input[name="gender"]:checked').checked = false;
  document.getElementById("age").value = "";
  document.getElementById("condition").value = "";
}

function generateReport() {
  report.classList.remove("empty");
  report.innerHTML = "";

  const numPatients = patients.length;
  const conditionsCount = {
    Diabetes: 0,
    Thyroid: 0,
    "High Blood Pressure": 0,
  };

  let reportBreakDownContent = "";
  let genders = [];

  const genderConditionsCount = {
    Male: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
    Female: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
  };

  for (const patient of patients) {
    conditionsCount[patient.condition]++;
    genderConditionsCount[patient.gender][patient.condition]++;
  }

  for (const condition in conditionsCount) {
    reportBreakDownContent += `<p>${condition}: <span>${conditionsCount[condition]}</span></p>  `;
  }

  for (const gender in genderConditionsCount) {
    genders.push(gender);

    report.innerHTML += `${gender}: <br>`;
    for (const condition in genderConditionsCount[gender]) {
      report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
    }
  }

  // report.innerHTML = `Number of patients: ${numPatients} <br><br>`;
  // report.innerHTML += `Conditions Breakdown: <br>`;

  report.innerHTML = `<h3 class="report__count">Patients: ${numPatients}</h3>`;
  report.innerHTML += `
    <div class="report__breakdown">
      <h4 h4 class="report__heading">Condition Breakdown</h4>
      <div class="report__content">
        ${reportBreakDownContent}
      </div>
    </div>

    <div class="report__conditions">
      <h4 class="report__heading">Gender-based Conditions</h4>
      <div class="report__conditions--sub">
        
        <div>
          <h4 class="report__heading">${genders}</h4>
          <div class="report__content">
            <p>Diabetes: <span>1</span></p>
            <p>Thyroid: <span>0</span></p>
            <p>High Blood Pressure: <span>0</span></p>
          </div>
        </div>

        <div>
          <h4 class="report__heading">Male</h4>
          <div class="report__content">
            <p>Diabetes: <span>1</span></p>
            <p>Thyroid: <span>0</span></p>
            <p>High Blood Pressure: <span>0</span></p>
            </div>
          </div>
        </div>
    </div>
  `;

  // report.innerHTML += `<br>Gender-Based Conditions: <br>`;
}

const myProject = [];

function addProject(event) {
    event.preventDefault();

    const inputProjectTitle = document.getElementById("name").value;
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);
    const inputMessage = document.getElementById("message").value;
    const inputProjectImage = document.getElementById(
        "input-project-image"
    ).files;
    const checkboxGroup = document.querySelector(".checkbox-group");
    const checkedCheckboxes = checkboxGroup.querySelectorAll(
        'input[type="checkbox"]:checked'
    );
    const selectedTechnologies = [];

    checkedCheckboxes.forEach((checkbox) => {
        selectedTechnologies.push(checkbox.value);
    });

    if (inputProjectImage.length === 0) {
        alert("Please upload an image");
        return;
    }

    const image = URL.createObjectURL(inputProjectImage[0]);
    const timeDifference = endDate - startDate;
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    const project = {
        title: inputProjectTitle,
        content: inputMessage,
        image: image,
        dayDifferenceDuration: dayDifference,
        tech: selectedTechnologies,
    };

    myProject.unshift(project);
    console.log(myProject);
    renderMyproject();
}

function renderMyproject() {
    let html = ``;

    for (let index = 0; index < myProject.length; index++) {
        html += `<div class="card-project-display">
      <div class="card-project">
        <img
          src="${myProject[index].image}"
          alt="Project Image"
          class="card-image-projet"
        />
        <div class="card-content">
          <h2 class="card-title">  <a href="project-detail.html" target="_blank">${myProject[index].title}</a></h2>
          <p class="card-duration">Durasi: ${myProject[index].dayDifferenceDuration} days</p>
          <p class="card-duration">Teknologi yang digunakan ${myProject[index].tech}</p>
          <p class="card-description">${myProject[index].content}</p>
          <div class="card-icons">
            <img src="asset/img/web.png" alt="Web" class="icon" />
            <img src="asset/img/android.png" alt="Android" class="icon" />
            <img src="asset/img/javascript.png" alt="JavaScript" class="icon" />
          </div>
          <div class="card-buttons">
            <button class="btn edit-btn">Edit</button>
            <button class="btn delete-btn" onclick="deleteProject(${index})">Delete</button>
          </div>
        </div>
      </div>
      </div>
`;
    }

    document.getElementById("contents").innerHTML = html;
}

function deleteProject(index) {
    myProject.splice(index, 1);
    renderMyproject();
}

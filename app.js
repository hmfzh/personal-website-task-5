const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./src/views"));

app.use("/asset/css", express.static("./src/asset/css"));
app.use("/asset/img", express.static("./src/asset/img"));
app.use("/asset/js", express.static("./src/asset/js"));
// app.use("/asset/", express.static(path.join(__dirname, "./src/asset")));

// app.use("/views", express.static("./src/views"));
app.use(express.urlencoded({ extended: true }));

//routing
app.get("/", home);
app.get("/addmyproject", addmyproject);
app.get("/contact", contact);
app.get("/project-detail/:id", projectDetail);
app.post("/addmyproject", addmyprojectPost);
app.post("/delete-project/:id", projectDelete);
app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", editProjectPost);

const projects = [];

const hbs = require('hbs');
const { type } = require("os");

hbs.registerHelper('includes', function (array, value) {
    return Array.isArray(array) && array.includes(value);
});


async function projectDetail(req, res) {
    // const id = req.params.id;
    // console.log("ini id : ", id);
    // res.render("project-detail", { id });
    const { id } = req.params;

    const query = `SELECT * FROM addproject WHERE id = ${id}`;
    const results = await sequelize.query(query, { type: QueryTypes.SELECT });
    console.log(results[0]);

    res.render("project-detail", { project: results[0] });
}

function home(req, res) {
    res.render("index");
}

async function addmyproject(req, res) {
    const query = `SELECT * FROM addproject`
    const projects = await sequelize.query(query, { type: QueryTypes.SELECT })
    console.log("Data Add Project : ", projects)

    res.render("addmyproject", { projects });
}

function contact(req, res) {
    res.render("contact");
}

async function addmyprojectPost(req, res) {
    // console.log(req.body);
    // res.redirect("/")

    // const { title, message, start_date, end_date, technologies } = req.body;

    // const startDate = new Date(start_date);
    // const endDate = new Date(end_date);
    // const timeDifference = endDate - startDate;
    // const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // const selectedTechnologies = technologies || [];

    // projects.unshift({
    //     title,
    //     start_date,
    //     end_date,
    //     dayDifferenceDuration: dayDifference,
    //     technologies: selectedTechnologies,
    //     message,
    //     image:
    //         "https://cdn.dribbble.com/userupload/15413648/file/original-e6395c63b07b9dcbd324efbf6b44b52b.png?resize=1200x900",
    // });

    const title = req.body.title;
    const start_date = req.body.start_date;
    const endDate = req.body.end_date;
    const description = req.body.message;
    const selectedTechnologies = req.body.technologies;
    const dayDifference = calculateDayDifference(start_date, endDate);

    function calculateDayDifference(start_date, end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        const timeDifference = endDate - startDate;
        const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return dayDifference;
    }

    const query = `INSERT INTO public.addproject(title, start_date, end_date, description, technologies, message, image) VALUES ('${title}', '${start_date}', '${endDate}', '${dayDifference}', '${selectedTechnologies}', '${description}', 'https://cdn.dribbble.com/userupload/4084519/file/original-2f7d2700874c51f1984145a246abf213.png?resize=1024x768')`;

    const project = await sequelize.query(query, { type: QueryTypes.INSERT });
    console.log("Project berhasil ditambahkan: ", project);



    res.redirect("/addmyproject");
}


async function projectDelete(req, res) {
    const { id } = req.params;
    console.log("Blog index yang akan didelete : ", id);

    const query = `DELETE FROM addproject WHERE id = ${id}`
    await sequelize.query(query, { type: QueryTypes.DELETE });

    res.redirect("/addmyproject")
}

async function editProject(req, res) {
    const { id } = req.params;

    const query = `SELECT * FROM addproject WHERE id = ${id}`
    const project = await sequelize.query(query, { type: QueryTypes.SELECT })


    res.render("edit-project", { project: project[0] });
}

async function editProjectPost(req, res) {
    const { id } = req.params;
    const title = req.body.title;
    const start_date = req.body.start_date;
    const endDate = req.body.end_date;
    const description = req.body.message;
    const selectedTechnologies = req.body.technologies;
    const dayDifference = calculateDayDifference(start_date, endDate);

    function calculateDayDifference(start_date, end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        const timeDifference = endDate - startDate;
        const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return dayDifference;
    }

    const query = `UPDATE addproject set title='${title}',start_date='${start_date}',end_date='${endDate}',description='${dayDifference}',technologies='${selectedTechnologies}',message='${description}' where id = ${id}`;

    const project = await sequelize.query(query, { type: QueryTypes.UPDATE });
    console.log("Project berhasil ditambahkan: ", project);


    // const { title, message, start_date, end_date, technologies } = req.body;
    // console.log("Index diganti");
    // console.log("title ", title);
    // console.log("message ", message);
    // console.log("start_date ", start_date);
    // console.log("end_date ", end_date);
    // console.log("technologies ", technologies);

    // const startDate = new Date(start_date);
    // const endDate = new Date(end_date);
    // const timeDifference = endDate - startDate;
    // const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // const selectedTechnologies = technologies || [];

    // projects[index] = {
    //     title,
    //     message,
    //     start_date,
    //     end_date,
    //     dayDifferenceDuration: dayDifference,
    //     technologies: selectedTechnologies,
    //     technologies: technologies || [],
    //     image:
    //         "https://cdn.dribbble.com/userupload/15413648/file/original-e6395c63b07b9dcbd324efbf6b44b52b.png?resize=1200x900",
    // }

    res.redirect("/addmyproject");

}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

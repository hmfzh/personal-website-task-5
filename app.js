const express = require("express");
const app = express();
const port = 3120;
const path = require("path");

const config = require("./config/config.json");

const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

const bcrypt = require("bcrypt");

const session = require("express-session");

const flash = require("express-flash");

const upload = require("./src/middlewares/upload-file");
const moment = require('moment');

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./src/views"));

app.use(
    session({
        name: "my-session",
        secret: "jangankepo",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 5 // 5 Menit
        },
    })
);

app.use(flash());

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/asset/css", express.static("./src/asset/css"));
app.use("/asset/img", express.static("./src/asset/img"));
app.use("/asset/js", express.static("./src/asset/js"));
app.use(express.urlencoded({ extended: true }));



//routing
app.get("/", home);
app.get("/register", registerMe);
app.post("/register", registerMePost);

app.get("/login", loginMe);
app.post("/login", loginMePost);

app.post("/logout", logoutPost);


app.get("/addmyproject", addmyproject);
app.get("/contact", contact);
app.get("/project-detail/:id", projectDetail);
app.post("/addmyproject", upload.single("uploadimage"), addmyprojectPost);
app.post("/delete-project/:id", projectDelete);
app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", upload.single("imageedit"), editProjectPost);
app.get("/testimonial", testimonial);




const hbs = require('hbs');

hbs.registerHelper('formatDate', function (date) {
    return moment(date).format('YYYY-MM-DD');
});

hbs.registerHelper('includes', function (array, value) {
    return Array.isArray(array) && array.includes(value);
});

function home(req, res) {
    const user = req.session.user;
    console.log(user);
    res.render("index", { user });
}

function testimonial(req, res) {
    res.render("testimonial");
}

function logoutPost(req, res) {
    req.session.destroy(
        (err) => {
            if (err) return console.error("logout gagal")
            console.log("logout berhasil");
            res.redirect("/");
        }
    );

}

function loginMe(req, res) {
    res.render("login");
}

async function loginMePost(req, res) {
    const { email, password } = req.body;

    // Verifikasi Email
    const query = `SELECT * FROM users WHERE email='${email}'`;
    const user = await sequelize.query(query, { type: QueryTypes.SELECT });

    if (!user.length) {
        req.flash("error", "Email / password salah!");
        return res.redirect("/login");
    }
    console.log(password, user[0].password)
    const isVerfied = await bcrypt.compare(password, user[0].password)
    console.log("isVerfied Password: ", isVerfied)

    if (!isVerfied) {
        req.flash("error", "Email / password salah!");
        return res.redirect("/login");
    }

    req.flash("success", "Berhasil login!");
    req.session.user = user[0]

    res.redirect("/")
}


function registerMe(req, res) {
    res.render("register");
}

async function registerMePost(req, res) {
    const { name, password, email } = req.body;
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO users(name, email, password) VALUES('${name}', '${email}', '${hashedPassword}')`;
    await sequelize.query(query, { type: QueryTypes.INSERT });

    res.redirect("login");
}

async function addmyproject(req, res) {
    const query = `SELECT addproject.* ,users.name from addproject INNER JOIN users ON addproject.userid = users.id;`

    console.log(query);


    const projects = await sequelize.query(query, { type: QueryTypes.SELECT })

    const user = req.session.user;

    res.render("addmyproject", { projects, user });
}

function contact(req, res) {
    res.render("contact");
}

async function addmyprojectPost(req, res) {
    const title = req.body.title;
    const start_date = req.body.start_date;
    const endDate = req.body.end_date;
    const description = req.body.message;
    const selectedTechnologies = req.body.technologies;
    const dayDifference = calculateDayDifference(start_date, endDate);
    const { id } = req.session.user;
    console.log("file yang udah user upload", req.file)
    const imagePath = req.file.path;

    function calculateDayDifference(start_date, end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        const timeDifference = endDate - startDate;
        const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return dayDifference;
    }

    const query = `INSERT INTO public.addproject(title, start_date, end_date, description, technologies, message, image , userid) VALUES ('${title}', '${start_date}', '${endDate}', '${dayDifference}', '${selectedTechnologies}', '${description}', '${imagePath}', ${id})`;

    const project = await sequelize.query(query, { type: QueryTypes.INSERT });
    console.log("Project berhasil ditambahkan: ", project);

    res.redirect("/addmyproject");
}

async function projectDetail(req, res) {
    const { id } = req.params;
    const query = `SELECT * FROM addproject WHERE id = ${id}`;
    const results = await sequelize.query(query, { type: QueryTypes.SELECT });
    console.log(results[0]);


    res.render("project-detail", { project: results[0] });
}

async function projectDelete(req, res) {
    const { id } = req.params;
    const query = `DELETE FROM addproject WHERE id = ${id}`;
    await sequelize.query(query, { type: QueryTypes.DELETE });
    res.redirect("/addmyproject");
}

async function editProject(req, res) {

    const user = req.session.user;
    if (!user) {
        return res.redirect("/login");
    }

    const { id } = req.params;

    const query = `SELECT * FROM addproject WHERE id = ${id}`
    const project = await sequelize.query(query, { type: QueryTypes.SELECT })
    console.log("ini project dari edit", project);

    project[0].start_date = moment(project[0].start_date).format('YYYY-MM-DD');
    project[0].end_date = moment(project[0].end_date).format('YYYY-MM-DD');

    res.render("edit-project", { project: project[0] });
}

async function editProjectPost(req, res) {
    const { id } = req.params;


    const imagePath = req.file.path;

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

    const query = `UPDATE addproject set title='${title}',start_date='${start_date}',end_date='${endDate}',description='${dayDifference}',technologies='${selectedTechnologies}',message='${description}',image='${imagePath}' where id = ${id}`;

    const project = await sequelize.query(query, { type: QueryTypes.UPDATE });
    console.log("Project berhasil ditambahkan: ", project);

    res.redirect("/addmyproject");

}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

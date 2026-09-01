// =========================================================
// GLOBAL STATE
// =========================================================
const API_BASE_URL = "https://https://infrapredict-1.onrender.com";
let currentRole = "government";

let currentUser = null;

let currentPortal = null;

let charts = {};

let projects = [];


// =========================================================
// ROLE INFORMATION
// =========================================================

const roleInfo = {

    government: {

        title: "Government / MoSPI Login",

        description:
            "Monitor the complete infrastructure portfolio and prioritize interventions.",

        label:
            "GOVERNMENT / MOSPI PORTAL",

        dashboardTitle:
            "Infrastructure Overview",

        subtitle:
            "AI-powered monitoring of national infrastructure projects",

        name:
            "Government User",

        short:
            "Government / MoSPI",

        avatar:
            "G",

        heroTitle:
            "National Infrastructure Portfolio",

        heroDescription:
            "Monitor the complete infrastructure portfolio, identify risks and prioritize government interventions."

    },


    supervisor: {

        title:
            "Supervisor Login",

        description:
            "Inspect project health, verify updates and raise early warnings.",

        label:
            "SUPERVISOR PORTAL",

        dashboardTitle:
            "Supervisor Monitoring Dashboard",

        subtitle:
            "Verify project progress and monitor implementation risks",

        name:
            "Supervisor User",

        short:
            "Supervisor",

        avatar:
            "S",

        heroTitle:
            "Project Verification Center",

        heroDescription:
            "Verify contractor submissions, inspect project progress and identify implementation risks."

    },


    contractor: {

        title:
            "Contractor Login",

        description:
            "Update project progress, expenditure, milestones and site issues.",

        label:
            "CONTRACTOR PORTAL",

        dashboardTitle:
            "Contractor Project Dashboard",

        subtitle:
            "Update progress, expenditure, milestones and site issues",

        name:
            "Contractor User",

        short:
            "Contractor",

        avatar:
            "C",

        heroTitle:
            "My Assigned Projects",

        heroDescription:
            "Update assigned project progress, submit milestones and report site-level issues."

    }

};


// =========================================================
// SHORT DOM FUNCTION
// =========================================================

function $(id) {

    return document.getElementById(id);

}


// =========================================================
// OPEN LOGIN
// =========================================================

function openLogin(role) {

    currentRole = role;

    const info = roleInfo[role];

    $("landing").classList.add("hidden");

    $("dashboard").classList.add("hidden");

    $("login").classList.remove("hidden");

    $("loginTitle").textContent =
        info.title;

    $("loginDescription").textContent =
        info.description;

    $("loginRoleLabel").textContent =
        info.label;

    $("username").value = "";

    $("password").value = "";

    $("loginStatus").textContent = "";

    setTimeout(() => {

        $("username").focus();

    }, 100);

}


// =========================================================
// LANDING
// =========================================================

function showLanding() {

    $("login").classList.add("hidden");

    $("dashboard").classList.add("hidden");

    $("landing").classList.remove("hidden");

}


// =========================================================
// LOGIN
// =========================================================

async function handleLogin(event) {

    event.preventDefault();

    const username =
        $("username").value.trim().toUpperCase();

    const password =
        $("password").value;

    const status =
        $("loginStatus");

    status.textContent =
        "Connecting to backend...";

    status.style.color =
        "#71869a";


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/login`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        user_id: username,

                        password: password

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            status.textContent =
                data.message || "Login failed.";

            status.style.color =
                "#d94b55";

            return;
        }


        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        currentUser =
            data.user;

        currentRole =
            data.user.role;

        currentPortal =
            currentRole;

        window.currentUserRole =
            currentRole;


        status.textContent =
            "Login successful.";

        status.style.color =
            "#17945b";


        openDashboard();


    }

    catch (error) {

        console.error(error);

        status.textContent =
            "Backend connection failed. Start Flask server using: python app.py";

        status.style.color =
            "#d94b55";

    }

}


// =========================================================
// OPEN DASHBOARD
// =========================================================

function openDashboard() {

    const info =
        roleInfo[currentRole];


    $("login").classList.add("hidden");

    $("landing").classList.add("hidden");

    $("dashboard").classList.remove("hidden");


    $("sideRole").textContent =
        info.short;


    $("dashboardTitle").textContent =
        info.dashboardTitle;


    $("dashboardSubtitle").textContent =
        info.subtitle;


    $("profileName").textContent =
        info.name;


    $("profileRole").textContent =
        info.short;


    $("avatar").textContent =
        info.avatar;


    $("heroTitle").textContent =
        info.heroTitle;


    $("heroDescription").textContent =
        info.heroDescription;


    setupPortalAccess(currentRole);


    loadProjects();


    navigate(
        "overview",
        document.querySelector(
            '.nav-item[onclick*="overview"]'
        )
    );


    initCharts();

}


// =========================================================
// LOGOUT
// =========================================================

function logout() {

    currentUser = null;

    currentPortal = null;

    currentRole = "government";

    projects = [];


    Object.values(charts).forEach(chart => {

        if (chart) {

            try {
                chart.destroy();
            }

            catch (error) {}

        }

    });


    charts = {};


    $("dashboard").classList.add("hidden");

    $("login").classList.add("hidden");

    $("landing").classList.remove("hidden");

    $("loginForm").reset();

    showToast(
        "You have been logged out."
    );

}


// =========================================================
// PASSWORD
// =========================================================

function togglePassword() {

    const input =
        $("password");

    const btn =
        document.querySelector(".show-pass");


    if (input.type === "password") {

        input.type = "text";

        btn.textContent =
            "Hide";

    }

    else {

        input.type = "password";

        btn.textContent =
            "Show";

    }

}


// =========================================================
// FORGOT PASSWORD
// =========================================================

function forgotPassword(event) {

    event.preventDefault();

    showToast(
        "Password reset will be connected to the authentication system."
    );

}


// =========================================================
// PORTAL ACCESS
// =========================================================

function setupPortalAccess(role) {

    const container =
        $("portalAccess");


    if (!container) return;


    container.innerHTML = "";


    let portals = [];


    // GOVERNMENT
    if (role === "government") {

        portals = [

            {
                role: "government",
                name: "Government Portal",
                icon: "🏛",
                description:
                    "National infrastructure monitoring"
            },

            {
                role: "supervisor",
                name: "Supervisor Portal",
                icon: "✓",
                description:
                    "Inspect and verify projects"
            },

            {
                role: "contractor",
                name: "Contractor Portal",
                icon: "🏗",
                description:
                    "View contractor updates"
            }

        ];

    }


    // SUPERVISOR
    else if (role === "supervisor") {

        portals = [

            {
                role: "supervisor",
                name: "Supervisor Portal",
                icon: "✓",
                description:
                    "Inspect and verify projects"
            },

            {
                role: "contractor",
                name: "Contractor Portal",
                icon: "🏗",
                description:
                    "View contractor submissions"
            }

        ];

    }


    // CONTRACTOR
    else {

        portals = [

            {
                role: "contractor",
                name: "Contractor Portal",
                icon: "🏗",
                description:
                    "Manage assigned projects"
            }

        ];

    }


    portals.forEach(portal => {

        const button =
            document.createElement("button");


        button.className =
            "portal-nav-item";


        button.innerHTML = `

            <span class="portal-nav-icon">
                ${portal.icon}
            </span>

            <span>

                <strong>
                    ${portal.name}
                </strong>

                <small>
                    ${portal.description}
                </small>

            </span>

        `;


        button.onclick = () => {

            openPortal(portal.role);

        };


        container.appendChild(button);

    });

}


// =========================================================
// OPEN PORTAL
// =========================================================

function openPortal(targetRole) {

    const permissions = {

        government: [
            "government",
            "supervisor",
            "contractor"
        ],

        supervisor: [
            "supervisor",
            "contractor"
        ],

        contractor: [
            "contractor"
        ]

    };


    if (
        !permissions[currentRole] ||
        !permissions[currentRole].includes(targetRole)
    ) {

        showToast(
            "You do not have permission to access this portal."
        );

        return;

    }


    currentPortal =
        targetRole;


    const info =
        roleInfo[targetRole];


    $("sideRole").textContent =
        info.short;


    $("dashboardTitle").textContent =
        info.dashboardTitle;


    $("dashboardSubtitle").textContent =
        info.subtitle;


    $("profileRole").textContent =
        info.short;


    $("heroTitle").textContent =
        info.heroTitle;


    $("heroDescription").textContent =
        info.heroDescription;


    loadPortalProjects(targetRole);


    showToast(
        `${info.short} opened.`
    );

}


// =========================================================
// LOAD PROJECTS
// =========================================================

async function loadProjects() {

    await loadPortalProjects(currentRole);

}


// =========================================================
// LOAD PORTAL PROJECTS
// =========================================================

async function loadPortalProjects(role) {

    try {

        const response =
            await fetch(
                `http://127.0.0.1:5000/api/projects/${role}`
            );


        const data =
            await response.json();


        if (!data.success) {

            showToast(
                "Unable to load project data."
            );

            return;
        }


        projects =
            data.projects;


        renderProjects();

        renderPriorityProjects();


        updateRoleKPIs();


    }

    catch (error) {

        console.error(error);

        showToast(
            "Could not connect to project data."
        );

    }

}


// =========================================================
// ROLE KPI DATA
// =========================================================

function updateRoleKPIs() {

    if (!projects.length) return;


    const total =
        projects.length;


    const highRisk =
        projects.filter(
            p => p.risk >= 70
        ).length;


    const averageRisk =
        projects.reduce(
            (sum, p) => sum + p.risk,
            0
        ) / total;


    const onTrack =
        projects.filter(
            p =>
                p.status === "On Track" ||
                p.status === "Progress Submitted"
        ).length;


    $("kpiTotal").textContent =
        total;


    $("kpiHighRisk").textContent =
        highRisk;


    $("kpiRisk").innerHTML =
        averageRisk.toFixed(1) +
        '<span class="unit">/100</span>';


    $("kpiOnTrack").textContent =
        Math.round(
            (onTrack / total) * 100
        ) + "%";

}


// =========================================================
// RENDER PROJECT TABLE
// =========================================================

function renderProjects() {

    const tbody =
        document.querySelector(
            "#projectTable tbody"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    projects.forEach(project => {

        const row =
            document.createElement("tr");


        let riskClass =
            "low";


        if (project.risk >= 70) {

            riskClass = "high";

        }

        else if (project.risk >= 50) {

            riskClass = "medium";

        }


        let statusClass =
            "info";


        if (
            project.status === "Delayed" ||
            project.status === "Inspection Required"
        ) {

            statusClass = "delayed";

        }

        else if (
            project.status === "At Risk" ||
            project.status === "Verification Pending"
        ) {

            statusClass = "warning";

        }

        else if (
            project.status === "On Track"
        ) {

            statusClass = "track";

        }


        row.innerHTML = `

            <td>
                ${project.id}
            </td>

            <td>
                <b>${project.name}</b>
            </td>

            <td>
                ${project.agency}
            </td>

            <td>
                ${project.cost}
            </td>

            <td>

                <div class="progress">

                    <span
                        style="width:${project.progress}%">
                    </span>

                </div>

                ${project.progress}%

            </td>

            <td>

                <span class="risk ${riskClass}">

                    ${project.risk}

                </span>

            </td>

            <td>

                <span class="status ${statusClass}">

                    ${project.status}

                </span>

            </td>

        `;


        tbody.appendChild(row);

    });

}


// =========================================================
// PRIORITY PROJECTS
// =========================================================

function renderPriorityProjects() {

    const tbody =
        $("priorityTable");


    if (!tbody) return;


    tbody.innerHTML = "";


    projects
        .filter(p => p.risk >= 50)
        .slice(0, 4)
        .forEach(project => {

            let riskClass =
                project.risk >= 70
                    ? "high"
                    : "medium";


            let statusClass =
                "warning";


            if (
                project.status === "On Track" ||
                project.status === "Progress Submitted"
            ) {

                statusClass =
                    "track";

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <b>
                        ${project.name}
                    </b>

                    <small>
                        ${project.id}
                    </small>

                </td>

                <td>
                    ${project.sector}
                </td>

                <td>

                    <span class="risk ${riskClass}">

                        ${project.risk >= 70
                            ? "High"
                            : "Med"}

                        ${project.risk}

                    </span>

                </td>

                <td>
                    +${Math.max(
                        3,
                        Math.round(
                            project.risk / 6
                        )
                    )}.2%
                </td>

                <td>
                    ${project.delay}
                </td>

                <td>

                    <span class="status ${statusClass}">

                        ${project.status}

                    </span>

                </td>

            `;


            tbody.appendChild(row);

        });

}


// =========================================================
// NAVIGATION
// =========================================================

function navigate(page, button) {

    document
        .querySelectorAll(".page")
        .forEach(p =>
            p.classList.add("hidden")
        );


    const target =
        $("page-" + page);


    if (!target) return;


    target.classList.remove("hidden");


    document
        .querySelectorAll(".nav-item")
        .forEach(n =>
            n.classList.remove("active")
        );


    if (button) {

        button.classList.add("active");

    }


    const names = {

        overview:
            "Overview",

        projects:
            "Projects",

        risk:
            "Risk & Alerts",

        analytics:
            "Analytics",

        milestones:
            "Milestones",

        reports:
            "Reports"

    };


    $("pageName").textContent =
        names[page];


    if (page === "overview") {

        const info =
            roleInfo[currentPortal || currentRole];

        $("dashboardTitle").textContent =
            info.dashboardTitle;

        $("dashboardSubtitle").textContent =
            info.subtitle;

    }

    else {

        $("dashboardTitle").textContent =
            names[page];

    }


    if (page === "risk") {

        setTimeout(
            initRiskDistribution,
            100
        );

    }


    if (page === "analytics") {

        setTimeout(
            initCostDelay,
            100
        );

    }


    // Close mobile sidebar
    $("sidebar").classList.remove(
        "mobile-open"
    );

}


// =========================================================
// NAVIGATE TO PROJECTS
// =========================================================

function navigateToProjects() {

    const button =
        document.querySelector(
            '.nav-item[onclick*="projects"]'
        );


    navigate(
        "projects",
        button
    );

}


// =========================================================
// KPI FILTER
// =========================================================

function openKPI(type) {

    navigateToProjects();


    const banner =
        $("projectFilterBanner");


    if (!banner) return;


    let title = "";

    let description = "";


    if (type === "all") {

        title =
            "All Infrastructure Projects";

        description =
            "Complete monitored project portfolio.";

        renderProjects();

    }


    else if (type === "high-risk") {

        title =
            "High-Risk Projects";

        description =
            "Projects requiring immediate monitoring or intervention.";

        filterProjectRows(
            project =>
                project.risk >= 70
        );

    }


    else if (type === "risk") {

        title =
            "Project Risk Analysis";

        description =
            "Projects ranked according to AI-generated risk scores.";

        filterProjectRows(
            project =>
                project.risk >= 50
        );

    }


    else if (type === "on-track") {

        title =
            "Projects On Track";

        description =
            "Projects currently progressing within expected parameters.";

        filterProjectRows(
            project =>
                project.status === "On Track" ||
                project.status === "Progress Submitted"
        );

    }


    banner.classList.remove(
        "hidden"
    );


    banner.innerHTML = `

        <h3>
            ${title}
        </h3>

        <p>
            ${description}
        </p>

        <button
            onclick="openKPI('all')"
            style="
                margin-top:8px;
                border:0;
                background:transparent;
                color:#075b96;
                font-weight:700;
            "
        >

            Show All Projects

        </button>

    `;

}


// =========================================================
// FILTER PROJECT ROWS
// =========================================================

function filterProjectRows(condition) {

    const tbody =
        document.querySelector(
            "#projectTable tbody"
        );


    tbody.innerHTML = "";


    projects
        .filter(condition)
        .forEach(project => {

            let riskClass =
                project.risk >= 70
                    ? "high"
                    : project.risk >= 50
                        ? "medium"
                        : "low";


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${project.id}
                </td>

                <td>
                    <b>${project.name}</b>
                </td>

                <td>
                    ${project.agency}
                </td>

                <td>
                    ${project.cost}
                </td>

                <td>
                    ${project.progress}%
                </td>

                <td>

                    <span class="risk ${riskClass}">

                        ${project.risk}

                    </span>

                </td>

                <td>
                    ${project.status}
                </td>

            `;


            tbody.appendChild(row);

        });

}


// =========================================================
// SEARCH / FILTER
// =========================================================

function filterProjects() {

    const search =
        $("projectSearch")
            .value
            .toLowerCase();


    const sector =
        $("sectorFilter")
            .value;


    const risk =
        $("riskFilter")
            .value;


    const rows =
        document.querySelectorAll(
            "#projectTable tbody tr"
        );


    rows.forEach(row => {

        const text =
            row.innerText
                .toLowerCase();


        const matchesSearch =
            text.includes(search);


        const matchesSector =
            sector === "all" ||
            text.includes(
                sector.toLowerCase()
            );


        let matchesRisk = true;


        if (risk === "High") {

            matchesRisk =
                row.innerHTML.includes(
                    'class="risk high"'
                );

        }

        else if (risk === "Medium") {

            matchesRisk =
                row.innerHTML.includes(
                    'class="risk medium"'
                );

        }

        else if (risk === "Low") {

            matchesRisk =
                row.innerHTML.includes(
                    'class="risk low"'
                );

        }


        row.style.display =
            matchesSearch &&
            matchesSector &&
            matchesRisk
                ? ""
                : "none";

    });

}


// =========================================================
// CHARTS
// =========================================================

function initCharts() {

    setTimeout(() => {

        initRiskChart();

        initSectorChart();

    }, 100);

}


// =========================================================
// RISK CHART
// =========================================================

function initRiskChart() {

    const canvas =
        $("riskChart");


    if (!canvas) return;


    if (charts.risk) {

        charts.risk.destroy();

    }


    charts.risk =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: [

                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug"

                    ],

                    datasets: [{

                        label:
                            "Risk Score",

                        data: [

                            51,
                            49,
                            53,
                            50,
                            48,
                            47,
                            46,
                            45,
                            44,
                            43,
                            44,
                            42.6

                        ],

                        borderColor:
                            "#1769aa",

                        backgroundColor:
                            "rgba(23,105,170,.10)",

                        borderWidth:
                            3,

                        fill:
                            true,

                        tension:
                            .35,

                        pointRadius:
                            4,

                        pointBackgroundColor:
                            "#1769aa"

                    }]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        x: {

                            grid: {
                                display: false
                            }

                        },

                        y: {

                            grid: {
                                color: "#edf1f4"
                            }

                        }

                    }

                }

            }
        );

}


// =========================================================
// UPDATE RISK CHART
// =========================================================

function updateRiskChart(type) {

    if (!charts.risk) return;


    const values = {

        risk: [
            51,49,53,50,
            48,47,46,45,
            44,43,44,42.6
        ],

        delay: [
            38,36,39,37,
            35,34,33,32,
            34,31,32,31.8
        ],

        cost: [
            44,43,46,45,
            42,41,40,39,
            38,37,39,36
        ]

    };


    charts.risk
        .data
        .datasets[0]
        .data =
            values[type];


    charts.risk.update();

}


// =========================================================
// SECTOR DOUGHNUT
// =========================================================

function initSectorChart() {

    const canvas =
        $("sectorChart");


    if (!canvas) return;


    if (charts.sector) {

        charts.sector.destroy();

    }


    charts.sector =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",

                data: {

                    labels: [

                        "Transport",
                        "Energy",
                        "Water",
                        "Social",
                        "Other"

                    ],

                    datasets: [{

                        data: [

                            31,
                            24,
                            16,
                            12,
                            17

                        ],

                        backgroundColor: [

                            "#1769aa",
                            "#2b7bbb",
                            "#57a0c9",
                            "#7bb8d7",
                            "#b9d6e7"

                        ],

                        borderWidth:
                            0

                    }]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "68%",

                    plugins: {

                        legend: {
                            display: false
                        }

                    }

                }

            }
        );

}


// =========================================================
// RISK DISTRIBUTION
// =========================================================

function initRiskDistribution() {

    const canvas =
        $("riskDistributionChart");


    if (!canvas) return;


    if (charts.riskDistribution) {

        charts.riskDistribution.destroy();

    }


    charts.riskDistribution =
        new Chart(
            canvas,
            {

                type:
                    "bar",

                data: {

                    labels: [

                        "Low",
                        "Moderate",
                        "High",
                        "Critical"

                    ],

                    datasets: [{

                        label:
                            "Projects",

                        data: [

                            1054,
                            800,
                            101,
                            26

                        ],

                        backgroundColor: [

                            "#8bc7a6",
                            "#6daed0",
                            "#e7a451",
                            "#d85b61"

                        ],

                        borderRadius:
                            6

                    }]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            }
        );

}


// =========================================================
// COST DELAY
// =========================================================

function initCostDelay() {

    const canvas =
        $("costDelayChart");


    if (!canvas) return;


    if (charts.costDelay) {

        charts.costDelay.destroy();

    }


    charts.costDelay =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data: {

                    labels: [

                        "Q1 24",
                        "Q2 24",
                        "Q3 24",
                        "Q4 24",
                        "Q1 25",
                        "Q2 25",
                        "Q3 25",
                        "Q4 25",
                        "Q1 26",
                        "Q2 26"

                    ],

                    datasets: [

                        {

                            label:
                                "Cost Overrun %",

                            data: [

                                5.2,
                                6.1,
                                7.0,
                                7.8,
                                8.4,
                                9.1,
                                8.7,
                                8.1,
                                7.5,
                                7.2

                            ],

                            borderColor:
                                "#c87513",

                            tension:
                                .35,

                            pointRadius:
                                3

                        },


                        {

                            label:
                                "Delay Probability %",

                            data: [

                                21,
                                24,
                                27,
                                29,
                                34,
                                36,
                                35,
                                33,
                                32,
                                31.8

                            ],

                            borderColor:
                                "#1769aa",

                            tension:
                                .35,

                            pointRadius:
                                3

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                true,

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}


// =========================================================
// MOBILE SIDEBAR
// =========================================================

function toggleSidebar() {

    $("sidebar")
        .classList
        .toggle("mobile-open");

}


// =========================================================
// PRINT
// =========================================================

function printReport() {

    window.print();

}


// =========================================================
// TOAST
// =========================================================

let toastTimer;


function showToast(message) {

    const toast =
        $("toast");


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);

}

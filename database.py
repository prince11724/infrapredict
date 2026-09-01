import sqlite3
import random
from werkzeug.security import generate_password_hash

DATABASE = "infrastructure.db"


def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # =========================
    # USERS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL
        )
    """)

    # =========================
    # PROJECTS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT UNIQUE NOT NULL,
            project_name TEXT NOT NULL,
            sector TEXT NOT NULL,
            agency TEXT NOT NULL,
            cost REAL NOT NULL,
            progress INTEGER NOT NULL,
            risk_score INTEGER NOT NULL,
            status TEXT NOT NULL,
            contractor_id TEXT,
            supervisor_id TEXT
        )
    """)

    # =========================
    # ALERTS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT NOT NULL,
            message TEXT NOT NULL,
            severity TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    # =========================
    # MILESTONES
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS milestones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT NOT NULL,
            milestone_name TEXT NOT NULL,
            status TEXT NOT NULL,
            milestone_date TEXT
        )
    """)

    # =========================
    # USERS
    # =========================

    users = [
        ("GOV001", "GOV@123", "Government Administrator", "government"),

        ("SUP001", "SUP@123", "Rajesh Sharma", "supervisor"),
        ("SUP002", "SUP@456", "Amit Verma", "supervisor"),
        ("SUP003", "SUP@789", "Neha Singh", "supervisor"),

        ("CON001", "CON@123", "Arjun Contractors", "contractor"),
        ("CON002", "CON@456", "BuildTech Contractors", "contractor"),
        ("CON003", "CON@789", "National Infra Works", "contractor"),
    ]

    for user_id, password, name, role in users:

        existing = cursor.execute(
            "SELECT id FROM users WHERE user_id = ?",
            (user_id,)
        ).fetchone()

        if not existing:
            cursor.execute("""
                INSERT INTO users
                (user_id, password_hash, name, role)
                VALUES (?, ?, ?, ?)
            """, (
                user_id,
                generate_password_hash(password),
                name,
                role
            ))

    # =========================
    # GENERATE PROJECTS
    # =========================

    project_count = cursor.execute(
        "SELECT COUNT(*) AS count FROM projects"
    ).fetchone()["count"]

    if project_count == 0:

        random.seed(42)

        sectors = [
            "Transport",
            "Energy",
            "Water & Sanitation",
            "Social Infrastructure",
            "Railways",
            "Urban Development",
            "Telecommunications"
        ]

        agencies = [
            "Road Transport",
            "Power Ministry",
            "Jal Shakti",
            "Urban Affairs",
            "Railways",
            "Renewable Energy",
            "State Infrastructure Board"
        ]

        contractors = [
            "CON001",
            "CON002",
            "CON003"
        ]

        supervisors = [
            "SUP001",
            "SUP002",
            "SUP003"
        ]

        for i in range(1, 1982):

            project_id = f"PRJ-{1000 + i}"

            sector = random.choice(sectors)
            agency = random.choice(agencies)

            names = [
                "National Highway Development",
                "Regional Water Supply",
                "Eastern Grid Expansion",
                "Metro Infrastructure",
                "Solar Transmission Link",
                "Urban Development Project",
                "Rail Corridor Expansion",
                "Bridge Rehabilitation",
                "Smart City Infrastructure",
                "River Basin Development"
            ]

            project_name = (
                f"{random.choice(names)} "
                f"Package-{i}"
            )

            cost = random.randint(
                500,
                15000
            )

            progress = random.randint(
                10,
                98
            )

            risk = random.randint(
                10,
                90
            )

            if risk >= 75:
                status = "Delayed"
            elif risk >= 55:
                status = "At Risk"
            else:
                status = "On Track"

            contractor_id = contractors[
                (i - 1) % len(contractors)
            ]

            supervisor_id = supervisors[
                (i - 1) % len(supervisors)
            ]

            cursor.execute("""
                INSERT INTO projects
                (
                    project_id,
                    project_name,
                    sector,
                    agency,
                    cost,
                    progress,
                    risk_score,
                    status,
                    contractor_id,
                    supervisor_id
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                project_id,
                project_name,
                sector,
                agency,
                cost,
                progress,
                risk,
                status,
                contractor_id,
                supervisor_id
            ))

    # =========================
    # ALERTS
    # =========================

    alert_count = cursor.execute(
        "SELECT COUNT(*) AS count FROM alerts"
    ).fetchone()["count"]

    if alert_count == 0:

        alerts = [
            (
                "PRJ-1001",
                "Cost escalation detected",
                "high",
                "18 min ago"
            ),
            (
                "PRJ-1002",
                "Milestone delay predicted",
                "medium",
                "42 min ago"
            ),
            (
                "PRJ-1003",
                "Low expenditure velocity",
                "warning",
                "1 hr ago"
            ),
            (
                "PRJ-1004",
                "Monthly update received",
                "info",
                "2 hrs ago"
            )
        ]

        for alert in alerts:

            cursor.execute("""
                INSERT INTO alerts
                (
                    project_id,
                    message,
                    severity,
                    created_at
                )
                VALUES (?, ?, ?, ?)
            """, alert)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
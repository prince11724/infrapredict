from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# =========================================================
# FIXED USERS
# =========================================================

USERS = {
    "GOV001": {
        "password": "GOV@123",
        "role": "government",
        "name": "Government User"
    },

    "SUP001": {
        "password": "SUP@123",
        "role": "supervisor",
        "name": "Supervisor User"
    },

    "CON001": {
        "password": "CON@123",
        "role": "contractor",
        "name": "Contractor User"
    }
}


# =========================================================
# ROLE PERMISSIONS
# =========================================================

PORTAL_PERMISSIONS = {
    "government": [
        "government",
        "supervisor",
        "contractor"
    ],

    "supervisor": [
        "supervisor",
        "contractor"
    ],

    "contractor": [
        "contractor"
    ]
}


# =========================================================
# ROLE-SPECIFIC DATA
# =========================================================

PROJECTS = {

    "government": [
        {
            "id": "PRJ-1042",
            "name": "National Highway Package-42",
            "agency": "Road Transport",
            "sector": "Transport",
            "cost": "₹8,420 Cr",
            "progress": 62,
            "risk": 82,
            "riskLevel": "High",
            "status": "Delayed",
            "delay": "7 months"
        },
        {
            "id": "PRJ-0871",
            "name": "Eastern Grid Expansion",
            "agency": "Power",
            "sector": "Energy",
            "cost": "₹5,180 Cr",
            "progress": 71,
            "risk": 77,
            "riskLevel": "High",
            "status": "At Risk",
            "delay": "4 months"
        },
        {
            "id": "PRJ-1298",
            "name": "River Basin Water Project",
            "agency": "Jal Shakti",
            "sector": "Water",
            "cost": "₹3,960 Cr",
            "progress": 78,
            "risk": 61,
            "riskLevel": "Medium",
            "status": "At Risk",
            "delay": "2 months"
        },
        {
            "id": "PRJ-0654",
            "name": "Metro Corridor Phase III",
            "agency": "Urban Affairs",
            "sector": "Transport",
            "cost": "₹11,250 Cr",
            "progress": 88,
            "risk": 55,
            "riskLevel": "Medium",
            "status": "On Track",
            "delay": "1 month"
        },
        {
            "id": "PRJ-1411",
            "name": "Solar Transmission Link",
            "agency": "New & Renewable Energy",
            "sector": "Energy",
            "cost": "₹2,740 Cr",
            "progress": 46,
            "risk": 28,
            "riskLevel": "Low",
            "status": "On Track",
            "delay": "0 months"
        }
    ],

    "supervisor": [
        {
            "id": "PRJ-1042",
            "name": "National Highway Package-42",
            "agency": "Road Transport",
            "sector": "Transport",
            "cost": "₹8,420 Cr",
            "progress": 62,
            "risk": 82,
            "riskLevel": "High",
            "status": "Inspection Required",
            "delay": "7 months"
        },
        {
            "id": "PRJ-0871",
            "name": "Eastern Grid Expansion",
            "agency": "Power",
            "sector": "Energy",
            "cost": "₹5,180 Cr",
            "progress": 71,
            "risk": 77,
            "riskLevel": "High",
            "status": "Verification Pending",
            "delay": "4 months"
        },
        {
            "id": "PRJ-1298",
            "name": "River Basin Water Project",
            "agency": "Jal Shakti",
            "sector": "Water",
            "cost": "₹3,960 Cr",
            "progress": 78,
            "risk": 61,
            "riskLevel": "Medium",
            "status": "Inspection Scheduled",
            "delay": "2 months"
        }
    ],

    "contractor": [
        {
            "id": "PRJ-1042",
            "name": "National Highway Package-42",
            "agency": "Road Transport",
            "sector": "Transport",
            "cost": "₹8,420 Cr",
            "progress": 62,
            "risk": 82,
            "riskLevel": "High",
            "status": "Update Required",
            "delay": "7 months"
        },
        {
            "id": "PRJ-0871",
            "name": "Eastern Grid Expansion",
            "agency": "Power",
            "sector": "Energy",
            "cost": "₹5,180 Cr",
            "progress": 71,
            "risk": 77,
            "riskLevel": "High",
            "status": "Update Required",
            "delay": "4 months"
        },
        {
            "id": "PRJ-1298",
            "name": "River Basin Water Project",
            "agency": "Jal Shakti",
            "sector": "Water",
            "cost": "₹3,960 Cr",
            "progress": 78,
            "risk": 61,
            "riskLevel": "Medium",
            "status": "Progress Submitted",
            "delay": "2 months"
        }
    ]
}


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "InfraPredict AI backend is running"
    })


# =========================================================
# LOGIN
# =========================================================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No login data received"
        }), 400

    user_id = str(data.get("user_id", "")).strip().upper()
    password = str(data.get("password", ""))

    if user_id not in USERS:
        return jsonify({
            "success": False,
            "message": "Invalid User ID"
        }), 401

    user = USERS[user_id]

    if password != user["password"]:
        return jsonify({
            "success": False,
            "message": "Incorrect password"
        }), 401

    return jsonify({
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user_id,
            "name": user["name"],
            "role": user["role"]
        },
        "permissions": PORTAL_PERMISSIONS[user["role"]]
    })


# =========================================================
# PROJECTS
# =========================================================

@app.route("/api/projects/<role>", methods=["GET"])
def get_projects(role):

    role = role.lower()

    if role not in PROJECTS:
        return jsonify({
            "success": False,
            "message": "Invalid role"
        }), 400

    return jsonify({
        "success": True,
        "projects": PROJECTS[role]
    })


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "success": True,
        "message": "Backend connection successful"
    })


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    print("=" * 55)
    print("InfraPredict AI Backend")
    print("=" * 55)
    print("Server running at:")
    print("http://127.0.0.1:5000")
    print()
    print("LOGIN CREDENTIALS")
    print("-----------------")
    print("Government : GOV001 / GOV@123")
    print("Supervisor : SUP001 / SUP@123")
    print("Contractor : CON001 / CON@123")
    print("=" * 55)

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
// -----------------------------
// developed by Nagharaco
// Naghshara Cunsolting Company
// Nodejs Website -> Managing published services
//------------------------------


const path = require("path");

const services = [
<<<<<<< HEAD
  // {
  //   id: 2,
  //   name: "PostgreSQL",
  //   ip: "0.0.0.0",
  //   port: "5432",
  //   status: "stopped",
  //   health: false,
  //   health_call: "",
  //   start: "exec:",
  //   startup_timeout: 2 * 1000,
  //   icon: "postgresql-logo.png"
  // },
  {
    id: 4,
    name: "Geoserver Master",
    ip: "0.0.0.0",
    port: "8080",
    status: "stopped",
    health: false,
    health_call: {
      uri: "http://localhost:8080/geoserver/rest/workspaces",
      auth: {
        username: "admin",
        password: "@dministrat0r"
      },
      timeout: 30 * 1000
    },
    start: "spawn:run_geoserver_master.bat",
    startup_timeout: 5 * 1000,
    icon: "geoserver-logo.png"
  },
=======
>>>>>>> 9f110fed58c8d2710433a55315b8c2c53735304a
  {
    id: 1,
    name: "Caddy",
    ip: "0.0.0.0",
    port: "80",
    status: "stopped",
    health: false,
    health_call: {
      uri: "http://localhost:80",
      timeout: 10 * 1000
    },
    start: "spawn:run_caddy.bat",
    startup_timeout: 2 * 1000,
    icon: "caddy.svg"
  },{
    id: 2,
    name: "PostgreSQL",
    ip: "0.0.0.0",
    port: "5432",
    status: "stopped",
    health: true,
    health_call: "",
    start: "exec:",
    startup_timeout: 2 * 1000,
    icon: "postgresql-logo.png"
  },
  {
    id: 3,
    name: "Tomcat",
    ip: "0.0.0.0",
    port: "8088",
    status: "stopped",
    health: false,
    health_call: {
      uri: "http://127.0.0.1:8088/manager/text/list",
      auth: {
        username: "admin",
        password: "@dministrat0r"
      },
      timeout: 30 * 1000
    },
    start: "exec:",
    startup_timeout: 2 * 1000,
    icon: "apache-logo.png"
  },
	{
	id: 4,
	name: "Geoserver Master",
	ip: "0.0.0.0",
	port: "8080",
	status: "stopped",
	health: false,
	health_call: {
	  uri: "http://localhost:8080/geoserver/rest/workspaces",
	  auth: {
      username: "admin",
      password: "@dministrat0r"
	  },
	  timeout: 30 * 1000
	},
	start: "spawn:run_geoserver_master.bat",
	startup_timeout: 5 * 1000,
	icon: "geoserver-logo.png"
	},
	{
	id: 5,
	name: "Geoserver Slave1",
	ip: "0.0.0.0",
	port: "8081",
	status: "stopped",
	health: false,
	health_call: {
	  uri: "http://localhost:8081/geoserver/rest/workspaces",
	  auth: {
      username: "admin",
      password: "@dministrat0r"
	  },
	  timeout: 30 * 1000
	},
	start: "spawn:run_geoserver_slave1.bat",
	startup_timeout: 5 * 1000,
	icon: "geoserver-logo.png"
	},
	{
	id: 6,
	name: "Geoserver Slave2",
	ip: "0.0.0.0",
	port: "8082",
	status: "stopped",
	health: false,
	health_call: {
	  uri: "http://localhost:8082/geoserver/rest/workspaces",
	  auth: {
		username: "admin",
		password: "@dministrat0r"
	  },
	  timeout: 30 * 1000
	},
	start: "spawn:run_geoserver_slave2.bat",
	startup_timeout: 5 * 1000,
	icon: "geoserver-logo.png"
	},
  {
    id: 7,
    name: "TileService",
    ip: "0.0.0.0",
    port: "3000",
    status: "stopped",
    health: false,
    health_call: {
      uri: "http://localhost:3000",
      timeout: 10 * 1000
    },
    start: "spawn:run_tile_server.bat",
    startup_timeout: 2 * 1000,
    icon: "map.png"
  },
   {
	id: 8,
	name: "MapProxy",
	ip: "0.0.0.0",
	port: "9000",
	status: "stopped",
  health: false,
  health_call: {
    uri: "http://localhost:9000",
    timeout: 10 * 1000
  },
  start: "spawn:run_mapproxy.bat",
  startup_timeout: 2 * 1000,
	icon: "mapproxy.png"
  },
  {
    id: 9,
    name: "Python API",
    ip: "0.0.0.0",
    port: "5002",
    status: "stopped",
    health: false,
    health_call: {
      uri: "http://localhost:5002",
      auth: '',
      timeout: 20 * 1000
    },
    start: "spawn:run_python_server.bat",
    startup_timeout: 3 * 1000,
    icon: "python-logo.png"
  },
  // {
  //   id: 10,
  //   name: "Transalator",
  //   ip: "0.0.0.0",
  //   port: "8090",
  //   status: "stopped",
  //   health: false,
  //   health_call: {
  //     uri: "http://localhost:8090/status",
  //     timeout: 10 * 1000
  //   },
  //   start: "spawn:run_translator.bat",
  //   startup_timeout: 2 * 1000,
  //   icon: "translator.png"
  // },
]

const db = {
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "@dministrat0r",
  database: "postgres"
}

const dirs = {
  batDir: path.join(__dirname, '../data/bats/'),
  logDir: path.join(__dirname, '../logs/')
}

const timing = {
  monitoring_start_delay: 30 * 1000,  // strats after 30 sec.
  monitoring_interval: 60 * 1000      // repeats every 1 minute
}

module.exports = {
  services,
  db,
  dirs,
  timing
}
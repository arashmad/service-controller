// -----------------------------
// developed by Nagharaco
// Naghshara Cunsolting Company
// Nodejs Website -> Managing published services
//------------------------------


const winston = require('winston');
const { spawn, exec } = require("child_process");
const fs = require('fs');
const path = require('path');

const dirs = require('../../data/config').dirs;


const logger = winston.createLogger({
  'transports': [
    new winston.transports.File({
      filename: `${dirs.logDir}history.log`
    })
  ]
})


const findInArrayOfDicts = (array, option) => {
  for (item of array) {
    if (item[option.key] === option.val) {
      return item;
    }
  }
}

const sortArrayofDicts = (property, order) => {
  var sortOrder = order === 'asc' ? 1 : -1;
  return function (a, b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
};

const killProcess = (portNo) => new Promise((resolve, reject) => {
  const command0 = `netStat -ano | find ":${portNo}" | findstr LISTENING`;
  // const command0 = `netstat -ano -p tcp`;
  try {
    exec(command0, function (error, stdout) {
      if (error) {
        reject(error);
      } else {
        const allProcess = stdout.split('\r\n')
        allProcess.forEach((process, id) => {
          if (process && process !== "Active Connections") {
            const processProperties = process.match(/("[^"]+"|[^"\s]+)/g);
            const processPort = processProperties[1].split(":")[1]
            const processID = processProperties[4]
            if (processPort === portNo && processID !== '0') {
              try {
                const command1 = `taskkill /PID ${processProperties[4]} /F`;
                exec(command1, function (err, stdout, stderr) {
                  if (stdout) {
                    logger.log({
                      message: stdout.toString(),
                      level: 'info'
                    });
                    console.log(id, allProcess.length)
                    // if (id == allProcess.length - 1)
                    resolve({ servicePort: portNo, msg: `Service on PID -> ${portNo} was Killed.` });
                  }
                  if (stderr) {
                    logger.log({
                      message: stderr.toString(),
                      level: 'error'
                    });
                  }
                  if (err) {
                    reject('Access is Denied!')
                  }
                });
              } catch (error) {
                resolve({ msg: `Service on PID -> ${portNo} not.` });
              }
            }
          }
        })
      }
    });
  } catch (error) {
    reject(error);
  }
});

const setLockStatus = (id, lock) => new Promise((resolve, reject) => {
  console.log(id)
  console.log(lock)
  const _path_ = path.join(__dirname, "..\\..", "\\data\\serviceLock.txt")
  try {
    var newContent = ''
    const lockContent = fs.readFileSync(_path_, 'utf8')
    if (lockContent === 'undefined' || !lockContent) {
      newContent = JSON.stringify({ id, lock }) + '\r\n'
    } else {
      var tmp = []
      lockContent.split('\r\n').map(item => {
        if (item) {
          if (JSON.parse(item)['id'] == id) {
            tmp.push(JSON.stringify({ id, lock }))
          } else {
            tmp.push(item)
          }
        }
      })
      newContent = tmp.join('\r\n')
    }
    fs.writeFileSync(_path_, newContent)
    resolve()
  } catch (error) {
    reject(error.message)
  }
})

const getLockStatus = id => new Promise((resolve, reject) => {
  // console.log(id)
  const _path_ = path.join(__dirname, "..\\..", "\\data\\serviceLock.txt")
  try {
    const lockContent = fs.readFileSync(_path_, 'utf8')
    if (lockContent === 'undefined' || !lockContent) {
      resolve(false)
    } else {
      lockContent.split('\r\n').map(item => {
        if (JSON.parse(item)['id'] == id) {
          resolve(JSON.parse(item)['lock'])
        }
      })
      resolve(false)
    }

  } catch (error) {
    reject(error.message)
  }
})

const createFile = (fileNameExt, fileContent) => new Promise((resolve, reject) => {
  const textFilePath = path.join(__dirname, "..\\..", `\\data\\${fileNameExt}`)
  try {
    fs.writeFileSync(textFilePath, fileContent)
    resolve(`File <<${fileNameExt}>> was created successfully.`)
  } catch (error) {
    reject(`ERROR in creating file <<${fileNameExt}>> :\n ${error.message}`)
  }
})

const nowDateTime = () => {
  let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
  let [hour, minute, second] = new Date().toLocaleTimeString("en-US").split(/:| /);
  return `${year}-${month}-${date}:${hour}-${minute}-${second}`;
}


module.exports = {
  findInArrayOfDicts,
  sortArrayofDicts,
  killProcess,
  setLockStatus,
  getLockStatus,
  createFile,
  nowDateTime
}
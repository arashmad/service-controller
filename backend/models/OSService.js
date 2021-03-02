// // -----------------------------
// // developed by Nagharaco
// // Naghshara Cunsolting Company
// // Nodejs Website -> Managing published services
// //------------------------------

const winston = require('winston');
const { spawn, exec } = require("child_process");
const request = require('request');
const path = require('path');
const fs = require('fs');

const PGService = require('./PGService');
const dirs = require('../data/config').dirs;

const nowDateTime = require('../public/js/functions.js').nowDateTime;

const logger = winston.createLogger({
	'transports': [
		new winston.transports.File({
			filename: `${dirs.logDir}history.log`
		})
	]
})


class OSService {
	constructor(serviceInfo) {
		this.id = serviceInfo.id;
		this.name = serviceInfo.name;
		this.ip = serviceInfo.ip;
		this.port = serviceInfo.port;
		this.startup_timeout = serviceInfo.startup_timeout;
		this.status = serviceInfo.status;
		this.health = serviceInfo.health;
		this.health_call = serviceInfo.health_call;
		this.start = serviceInfo.start;
		this.start_call = serviceInfo.start_call ? serviceInfo.start_call : null;
		this.icon = serviceInfo.icon;
	}

	findServiceName = () => new Promise((resolve, reject) => {
		const command = `sc queryex type= service state= all | find /i "${this.name}"`;
		exec(command, function (err, stdout) {
			if (err) {
				reject('')
			} else {
				resolve(stdout.split('\n')[0].replace('SERVICE_NAME: ', ''))
			}
		});
	})

	setTime = () => new Promise((resolve, reject) => {
		const _path_ = path.join(__dirname, "..", "\\data\\serviceTime.txt")
		try {
			const t0 = nowDateTime().replace(/:/g, ',').replace(/-/g, ',')
			const temp = JSON.stringify({ id: this.id, time: t0 })

			var newContent = ''
			const timeContent = fs.readFileSync(_path_, 'utf8')

			if (timeContent === 'undefined' || !timeContent) {
				newContent = temp + '\r\n'
			} else {
				newContent = timeContent
				const checker = `"id":${this.id}`
				console.log(checker)
				console.log(timeContent)
				console.log(timeContent.indexOf(checker) < 0)
				if (timeContent.indexOf(checker) < 0) {
					newContent += temp + '\r\n'
				}
			}
			fs.writeFileSync(_path_, newContent)
			resolve(t0)
		} catch (error) {
			reject(error.message)
		}
	})

	getTime = (id) => new Promise((resolve, reject) => {
		const _path_ = path.join(__dirname, "..", "\\data\\serviceTime.txt")
		try {
			const timeContent = fs.readFileSync(_path_, 'utf8')
			if (timeContent === 'undefined' || !timeContent) {
				this.setTime()
				resolve('در حال محاسبه')
			} else {
				var found = false
				timeContent.split('\r\n').map(item => {
					if (item) {
						if (JSON.parse(item)['id'] == id) {
							found = true;
							const t0 = JSON.parse(item)['time'].split`,`.map(x => +x)
							const startTime = new Date(t0[0], t0[1], t0[2], t0[3], t0[4], t0[5])
							const t1 = nowDateTime().replace(/:/g, ',').replace(/-/g, ',').split`,`.map(x => +x)
							const nowTime = new Date(t1[0], t1[1], t1[2], t1[3], t1[4], t1[5])

							var diff = (nowTime.getTime() - startTime.getTime())
							var seconds = Math.floor(diff / 1000),
								minutes = Math.floor(seconds / 60),
								hours = Math.floor(minutes / 60),
								days = Math.floor(hours / 24),
								months = Math.floor(days / 30),
								years = Math.floor(days / 365);

							seconds %= 60;
							minutes %= 60;
							hours %= 24;
							days %= 30;
							months %= 12;

							var duration = `${hours}:${minutes}:${seconds}`
							if (days > 0)
								duration = `${days} ${duration}`
							else if (months > 0)
								duration = `${months}-${days} ${duration}`
							else if (years > 0)
								duration = `${years}-${months}-${days} ${duration}`

							resolve(duration)
							return true
						}
					}
				})
				if (!found) {
					this.setTime()
					resolve('در حال محاسبه')
				}
			}
		} catch (error) {
			reject(error.message)
		}
	})

	serviceStatus = () => new Promise((resolve, reject) => {
		const _this = this
		const ip_port = `${this.ip}:${this.port}`;
		const command = `netStat -ano | find ":${this.port}" | findstr LISTENING`;
		try {
			exec(command, function (err, stdout) {
				if (err) {
					resolve({ status: 'stopped', serviceInfo: [] })
				} else {
					if (stdout.indexOf(ip_port + ' ') >= 0) {
						var stdout_array = stdout.toString().split('\n');
						if (stdout_array.length == 0) {
							resolve({ status: 'stopped', serviceInfo: [] });
						} else {
							stdout_array.forEach(line => {
								if (line) {
									const serviceInfo = line.match(/("[^"]+"|[^"\s]+)/g);
									serviceInfo.forEach(item => {
										if (item === ip_port) {
											_this.getTime(_this.id)
												.then(time => {
													resolve({ status: 'running', serviceInfo: serviceInfo, time })
												})
												.catch(error => {
													resolve({ status: 'running', serviceInfo: serviceInfo, time: error })
												})
										}
									})
								}
							});
						}
					} else {
						resolve({ status: 'stopped', serviceInfo: [] });
					}
				}
			});
		} catch (error) {
			reject(error);
		}
	})

	serviceHealth = () => new Promise((resolve, reject) => {
		try {
			if (!this.health_call) {
				const pgEntity = new PGService();
				pgEntity.checkConnection()
					.then(() => resolve(true))
					.catch(() => resolve(false))
			} else {
				var data = {
					headers: { "content-type": "application/json" },
					timeout: this.health_call.timeout
				}
				if (this.health_call.auth && this.health_call.auth.username && this.health_call.auth.password)
					data.auth = {
						user: this.health_call.auth.username,
						pass: this.health_call.auth.password
					};
				request
					.get(this.health_call.uri, data)
					.on('response', res => {
						// console.log(res)
						if (res.statusCode == 200) {
							resolve(true)
						} else {
							resolve(false)
						}
					})
					.on('error', err => {
						// console.log(err)
						resolve(false)
					})
			}
		} catch (err) {
			reject(err)
		}
	})

	serviceStart = () => new Promise((resolve, reject) => {
		const _this = this
		var sName = this.name;
		var sPort = this.port;
		var times = {};
		var timeout = this.startup_timeout ? this.startup_timeout : 5000;

		this.serviceStatus()
			.then(serviceStatus => {
				if (serviceStatus.status === 'running') {
					const status = serviceStatus.serviceInfo[3];
					if (status === 'LISTENING') {
						resolve(`${sName.toUpperCase()} is running now on port ${sPort}.`)
					}
				} else {
					const processor = this.start.split(':')[0];

					if (processor === 'spawn') {
						const batFile = `${dirs.batDir}${this.start.split(':')[1]}`;
						const process = spawn('cmd.exe', ['/c', batFile]);

						process.stdout.on('data', data => {
							times[sName] = Date.now();

							const stdout = data.toString();
							logger.log({ message: stdout, level: 'info' });

							setTimeout(function () {
								if (times[sName] && times[sName] + timeout < Date.now()) {
									times[sName] = null;
									this.serviceStatus()
										.then(res => {
											const status = res.serviceInfo[3];
											if (status === 'LISTENING') {
												_this.setTime()
													.then(() => {
														resolve(`service ${sName.toUpperCase()} was started on port ${sPort}.`);
													})
													.catch(() => {
														console.log('AAAAAAAAAAAAAAAA')
													})
											}
										})
										.catch(() => {
											reject(`service ${sName.toUpperCase()} not running on port ${sPort}.`);
										})
								}
							}.bind(this), timeout)
						});

						process.stderr.on('data', data => {
							times[sName] = Date.now();

							const stderr = data.toString();
							logger.log({ message: stderr, level: 'error' });

							setTimeout(function () {
								if (times[sName] && times[sName] + timeout < Date.now()) {
									times[sName] = null;
									this.serviceStatus()
										.then(res => {
											const status = res.serviceInfo[3];
											if (status === 'LISTENING') {
												_this.setTime()
													.then(() => {
														resolve(`service ${sName.toUpperCase()} was started on port ${sPort}.`);
													})
													.catch(() => {
														console.log('AAAAAAAAAAAAAAAA')
													})
											}
										})
										.catch(() => {
											reject(`service ${sName.toUpperCase()} not running on port ${sPort}.`);
										})
								}
							}.bind(this), timeout)

						});
					}
					else if (processor === 'exec') {
						this.findServiceName()
							.then(nameOfService => {
								const command = `net start ${nameOfService}`;
								exec(command, function (err, stdout, stderr) {
									if (stdout) {
										logger.log({
											message: stdout.toString(),
											level: 'info'
										});
										_this.setTime()
										resolve(`service ${sName.toUpperCase()} was started on port ${sPort}.`);
									}
									if (stderr) {
										logger.log({
											message: stderr.toString(),
											level: 'error'
										});
									}
									if (err) {
										reject(err);
									}
								});
							})
							.catch(() => reject(''))
					}
				}
			})
			.catch(() => {
				reject('')
			})
	})

	serviceStop = () => new Promise((resolve, reject) => {
		var sName = this.name;
		var sPort = this.port;
		this.serviceStatus()
			.then(statusOfService => {
				const status = statusOfService.serviceInfo[3];
				if (status === 'LISTENING') {
					try {
						const command = `taskkill /PID ${statusOfService.serviceInfo[4]} /F`;
						// console.log(command)
						exec(command, function (err, stdout, stderr) {
							if (stdout) {
								logger.log({
									message: stdout.toString(),
									level: 'info'
								});
								resolve({ msg: `service ${sName.toUpperCase()} on port ${sPort} was terminated.` });
							}
							if (stderr) {
								logger.log({
									message: stderr.toString(),
									level: 'error'
								});
							}
							if (err) {
								resolve({ msg: err, status: -1 });
							}
						});
					} catch (error) {
						reject(error);
					}
				}
			})
			.catch(error => {
				resolve({ msg: `service ${sName.toUpperCase()} has alreay been stopped.` });
			})
	});
};

module.exports = OSService;
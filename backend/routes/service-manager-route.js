// -----------------------------
// developed by Nagharaco
// Naghshara Cunsolting Company
// Nodejs Website -> Managing published services
//------------------------------


const express = require('express');
const route = express.Router();

const OSService = require('../models/OSService');
const deployedServices = require('../data/config').services;
const timing = require('../data/config').timing;

const findInArrayOfDicts = require('../public/js/functions').findInArrayOfDicts;
const sortArrayofDicts = require('../public/js/functions').sortArrayofDicts;
const killProcess = require('../public/js/functions').killProcess;
const getLockStatus = require('../public/js/functions').getLockStatus;
const setLockStatus = require('../public/js/functions').setLockStatus;
const nowDateTime = require('../public/js/functions').nowDateTime;

console.log('\n\n---------------------------------------------');
console.log('----------|.......................|----------');
console.log('----------| Services Initializing |----------');
console.log('----------|.......................|----------');
console.log('---------------------------------------------');
for (service of deployedServices) {
	const serviceEntity = new OSService(service);
	serviceEntity.serviceStatus()
		.then(statusOfService => {
			serviceEntity.serviceHealth()
				.then(healthOfService => {
					if (statusOfService.status === 'running') {
						if (!healthOfService) {
							serviceEntity.serviceStop()
								.then(() => {
									serviceEntity.serviceStart()
										.then(() => {
											serviceEntity.serviceStatus()
												.then(statusOfService => {
													serviceEntity.serviceHealth()
														.then(healthOfService => {
															console.log({
																id: serviceEntity.id,
																processId: statusOfService.serviceInfo[4],
																status: statusOfService.status,
																health: statusOfService.status === 'stopped' ? false : healthOfService,
																live: statusOfService.time
															})
														})
														.catch(error => console.log(error))
												})
												.catch(error => console.log(error))
										})
										.catch(error => console.log(error))
								})
								.catch(error => console.log(error))
						} else {
							console.log({
								id: serviceEntity.id,
								processId: statusOfService.serviceInfo[4],
								status: statusOfService.status,
								health: statusOfService.status === 'stopped' ? false : healthOfService,
								live: statusOfService.time
							})
						}
					} else {
						serviceEntity.serviceStart()
							.then(() => {
								serviceEntity.serviceStatus()
									.then(statusOfService => {
										serviceEntity.serviceHealth()
											.then(healthOfService => {
												console.log({
													id: serviceEntity.id,
													processId: statusOfService.serviceInfo[4],
													status: statusOfService.status,
													health: statusOfService.status === 'stopped' ? false : healthOfService,
													live: statusOfService.time
												})
											})
											.catch(error => console.log(1))
									})
									.catch(error => console.log(2))
							})
							.catch(error => console.log(error))
					}
				})
				.catch(error => console.log(4))
		})
		.catch(error => console.log(5))
};

setTimeout(() => {
	setInterval(() => {
		console.log('\n\n\n')
		console.log('.........................................................');
		console.log('.........................................................');
		console.log('................ Checking services status ...............');
		console.log(`.................... ${nowDateTime()} ....................`);

		for (service of deployedServices) {
			const serviceEntity = new OSService(service);
			serviceEntity.serviceStatus()
				.then(statusOfService => {
					serviceEntity.serviceHealth()
						.then(healthOfService => {
							if (statusOfService.status === 'running') {
								if (!healthOfService) {
									serviceEntity.serviceStop()
										.then(() => {
											serviceEntity.serviceStart()
												.then(() => {
													serviceEntity.serviceStatus()
														.then(statusOfService => {
															serviceEntity.serviceHealth()
																.then(healthOfService => {
																	console.log({
																		id: serviceEntity.id,
																		processId: statusOfService.serviceInfo[4],
																		status: statusOfService.status,
																		health: statusOfService.status === 'stopped' ? false : healthOfService,
																		live: statusOfService.time
																	})
																})
																.catch(error => console.log(error))
														})
														.catch(error => console.log(error))
												})
												.catch(error => console.log(error))
										})
										.catch(error => console.log(error))
								} else {
									console.log({
										id: serviceEntity.id,
										processId: statusOfService.serviceInfo[4],
										status: statusOfService.status,
										health: statusOfService.status === 'stopped' ? false : healthOfService,
										live: statusOfService.time
									})
								}
							} else {
								serviceEntity.serviceStart()
									.then(() => {
										serviceEntity.serviceStatus()
											.then(statusOfService => {
												serviceEntity.serviceHealth()
													.then(healthOfService => {
														console.log({
															id: serviceEntity.id,
															processId: statusOfService.serviceInfo[4],
															status: statusOfService.status,
															health: statusOfService.status === 'stopped' ? false : healthOfService,
															live: statusOfService.time
														})
													})
													.catch(error => console.log(error))
											})
											.catch(error => console.log(error))
									})
									.catch(error => console.log(error))
							}
						})
						.catch(error => console.log(error))
				})
				.catch(error => console.log(error))
		};
	}, timing.monitoring_interval);
}, timing.monitoring_start_delay);

route.get('/services', (req, res) => {

	console.log('\n\n_____________________________________');
	console.log('Request Received');
	console.log('Route => /services');

	res.json(deployedServices.sort(sortArrayofDicts('id', 'asc')));
});

route.post('/init', (req, res) => {

	console.log('\n\n_____________________________________');
	console.log('Request Received');
	console.log('Route => /init');

	const serviceName = req.body.serviceName;
	const searchService = { key: 'name', val: serviceName }
	const serviceEntity = new OSService(findInArrayOfDicts(deployedServices, searchService));

	serviceEntity.serviceStatus()
		.then(statusOfService => {
			serviceEntity.serviceHealth()
				.then(healthOfService => {
					if (statusOfService.status === 'running') {
						if (!healthOfService) {
							serviceEntity.serviceStop()
								.then(() => {
									getLockStatus(service.id)
										.then(lock => {
											if (lock) {
												console.log(`${serviceName} is locked`)
												res.json('');
											} else {
												setLockStatus(service.id, true)
													.then(() => {
														serviceEntity.serviceStart()
															.then(() => {
																serviceEntity.serviceStatus()
																	.then(statusOfService => {
																		serviceEntity.serviceHealth()
																			.then(healthOfService => {
																				setLockStatus(service.id, false)
																					.then(() => {
																						res.json({
																							id: serviceEntity.id,
																							processId: statusOfService.serviceInfo[4],
																							status: statusOfService.status,
																							health: statusOfService.status === 'stopped' ? false : healthOfService,
																							live: statusOfService.time
																						});
																					})
																					.catch(() => {
																						res.json('');
																					})
																			})
																			.catch(error => console.log(error))
																	})
																	.catch(error => console.log(error))
															})
															.catch(error => console.log(error))
													})
													.catch(() => { `Initiating Service ${serviceName} => setLockStatus => TRUE` })
											}
										})
										.catch(error => {
											res.json(error)
										})
								})
								.catch(error => console.log(error))
						} else {
							res.json({
								id: serviceEntity.id,
								processId: statusOfService.serviceInfo[4],
								status: statusOfService.status,
								health: statusOfService.status === 'stopped' ? false : healthOfService,
								live: statusOfService.time
							});
						}
					} else {
						getLockStatus(service.id)
							.then(lock => {
								if (lock) {
									console.log(`${serviceName} is locked`)
									res.json('');
								} else {
									setLockStatus(service.id, true)
										.then(() => {
											serviceEntity.serviceStart()
												.then(() => {
													serviceEntity.serviceStatus()
														.then(statusOfService => {
															serviceEntity.serviceHealth()
																.then(healthOfService => {
																	setLockStatus(service.id, false)
																		.then(() => {
																			res.json({
																				id: serviceEntity.id,
																				processId: statusOfService.serviceInfo[4],
																				status: statusOfService.status,
																				health: statusOfService.status === 'stopped' ? false : healthOfService,
																				live: statusOfService.time
																			});
																		})
																		.catch(() => {
																			res.json('');
																		})
																})
																.catch(error => console.log(error))
														})
														.catch(error => console.log(error))
												})
												.catch(error => console.log(error))
										})
										.catch(error => {
											res.json(error)
										})
								}
							})
							.catch(error => {
								res.json(error)
							})
					}
				})
				.catch(error => console.log(error))
		})
		.catch(error => console.log(error))
});

route.post('/stop', (req, res) => {

	console.log('\n\n_____________________________________');
	console.log('Request Received');
	console.log('Route => /stop');

	const serviceName = req.body.serviceName;
	const searchService = { key: 'name', val: serviceName }
	const service = findInArrayOfDicts(deployedServices, searchService);
	const serviceEntity = new OSService(service);

	serviceEntity.serviceStop()
		.then(() => {
			serviceEntity.serviceStatus()
				.then(statusOfService => {
					serviceEntity.serviceHealth()
						.then(healthOfService => {
							const result = {
								id: serviceEntity.id,
								processId: statusOfService.serviceInfo[4],
								status: statusOfService.status,
								health: statusOfService.status === 'stopped' ? false : healthOfService,
								live: statusOfService.time
							}
							setLockStatus(service.id, false)
								.then(() => {
									console.log(nowDateTime());
									console.log(`Terminated ${serviceName}...`);
									console.log(`Result:`);
									console.log(result);
									res.json(result);
								})
								.catch(() => {
									res.json('');
								})
						})
						.catch(error => console.log(error))
				})
				.catch(error => console.log(error))
		})
		.catch(error => console.log(error))
});

route.post('/start', (req, res) => {

	console.log('\n\n_____________________________________');
	console.log('Request Received');
	console.log('Route => /start');

	const serviceName = req.body.serviceName;
	const searchService = { key: 'name', val: serviceName }
	const service = findInArrayOfDicts(deployedServices, searchService);

	getLockStatus(service.id)
		.then(lock => {
			if (lock) {
				res.json('');
			} else {
				setLockStatus(service.id, true)
					.then(() => {
						const serviceEntity = new OSService(service);
						serviceEntity.serviceStart()
							.then(() => {
								serviceEntity.serviceStatus()
									.then(statusOfService => {
										serviceEntity.serviceHealth()
											.then(healthOfService => {
												const result = {
													id: serviceEntity.id,
													processId: statusOfService.serviceInfo[4],
													status: statusOfService.status,
													health: statusOfService.status === 'stopped' ? false : healthOfService,
													live: statusOfService.time
												}
												setLockStatus(service.id, false)
													.then(() => {
														console.log(nowDateTime());
														console.log(`Starting ${serviceName}...`);
														console.log(`Result:`);
														console.log(result);
														res.json(result);
													})
													.catch(() => {
														res.json('');
													})
											})
											.catch(error => console.log(error))
									})
									.catch(error => console.log(error))
							})
							.catch(error => console.log(error))
					})
					.catch(error => {
						res.send(error)
					})
			}
		})
		.catch(error => {
			res.json(error)
		})
});

route.post('/kill', (req, res) => {

	console.log('\n\n_____________________________________');
	console.log('Request Received');
	console.log('Route => /kill');

	const portNo = req.body.portNo;
	killProcess(portNo)
		.then(() => {
			const searchService = { key: 'port', val: portNo }
			const service = findInArrayOfDicts(deployedServices, searchService);
			const serviceEntity = new OSService(service);
			serviceEntity.serviceStatus()
				.then(statusOfService => {
					serviceEntity.serviceHealth()
						.then(healthOfService => {
							const result = {
								id: serviceEntity.id,
								processId: '',
								status: statusOfService.status,
								health: statusOfService.status === 'stopped' ? false : healthOfService,
								live: statusOfService.time
							}
							console.log(nowDateTime());
							console.log('Rout Result =>' + result);
							res.json(result);
						})
						.catch(error => console.log(1))
				})
				.catch(error => console.log(2))
		})
		.catch(error =>
			res.json(error)
		)
});

route.get('/restart', (req, res) => {
	console.log('\n============\nRestarting service\n============');
	const serviceName = req.body.serviceName;
	const searchService = { key: 'name', val: serviceName }
	const service = findInArrayOfDicts(deployedServices, searchService);
	const serviceEntity = new OSService(service);

	serviceEntity.serviceStop()
		.then(() => {
			serviceEntity.serviceStart()
				.then(() => {
					serviceEntity.serviceStatus()
						.then(statusOfService => {
							serviceEntity.serviceHealth()
								.then(healthOfService => {
									const result = {
										id: serviceEntity.id,
										processId: statusOfService.serviceInfo[4],
										status: statusOfService.status,
										health: statusOfService.status === 'stopped' ? false : healthOfService,
										live: statusOfService.time
									}
									console.log(`Re-starting ${serviceName}...`);
									console.log(`Result:`);
									console.log(result);
									res.json(result);
								})
								.catch(error => console.log(error))
						})
						.catch(error => console.log(error))
				})
				.catch(error => console.log(error))
		})
		.catch(error => console.log(error))
});

module.exports = route;
// -----------------------------
// developed by Nagharaco
// Naghshara Cunsolting Company
// Reactjs Website -> Managing published services
//------------------------------


import React, { Component, useState } from 'react'
import axios from 'axios'

import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'

export default class Manager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      services: [],
      lock: false,
      processToBeKilled: null
    }
  }

  searchInArrayofObjects = (array, key, value) => {
    return array.find(o => o[key] === value).id;
  }

  componentDidMount() {
    axios.get('http://localhost:8008/services')
      .then(response => {
        const services = response.data
        this.setState({
          services: services
        }, () => this.initService(services))
      })
      .catch(error => {
        console.log(error)
      })
  }

  _onHandleInputText = (e) => {
    this.setState({
      processToBeKilled: e.target.value
    })
  }

  initService = (services) => {
    this.setState({ lock: true })
    services.map((service, index) => {
      const serviceName = service.name
      axios.post('http://localhost:8008/init', { serviceName })
        .then(response => {
          const newService = response.data
          const serviceProcess = response.data.processId ? response.data.processId : 'unknown'
          const serviceStatus = response.data.status
          const serviceHealth = response.data.health
          const serviceLive = response.data.live
          this.setState(prevState => ({
            services: prevState.services.map(
              service => (service.id === newService.id ? Object.assign(service, { status: serviceStatus, health: serviceHealth, processId: serviceProcess, live: serviceLive }) : service)
            )
          }), () => {
            if (index === services.length - 1) {
              this.setState({ lock: false })
            }
          })
        })
        .catch(error => {
          console.log(error)
          this.setState({ lock: false })
        })
    })
  }

  startService = (name) => {
    this.setState({ lock: true })
    axios.post('http://localhost:8008/start', { serviceName: name })
      .then(response => {
        console.log(response.data)
        const newService = response.data
        const serviceProcess = response.data.processId ? response.data.processId : 'unknown'
        const serviceStatus = response.data.status
        const serviceHealth = response.data.health
        const serviceLive = response.data.live
        console.log(serviceStatus)
        this.setState(prevState => ({
          services: prevState.services.map(
            service => (service.id === newService.id ? Object.assign(service, { status: serviceStatus, health: serviceHealth, processId: serviceProcess, live: serviceLive }) : service)
          )
        }), () => {
          this.setState({ lock: false })
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({ lock: false })
      })
  }

  stopService = (name) => {
    this.setState({ lock: true })
    axios.post('http://localhost:8008/stop', { serviceName: name })
      .then(response => {
        const newService = response.data
        const serviceProcess = response.data.processId ? response.data.processId : 'unknown'
        const serviceStatus = response.data.status
        const serviceHealth = response.data.health
        const serviceLive = response.data.live
        this.setState(prevState => ({
          services: prevState.services.map(
            service => (service.id === newService.id ? Object.assign(service, { status: serviceStatus, health: serviceHealth, processId: serviceProcess, live: serviceLive }) : service)
          )
        }), () => {
          this.setState({ lock: false })
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({ lock: false })
      })
  }

  killProcess = (e) => {
    e.preventDefault();
    this.setState({ lock: true });
    debugger
    const portNo = this.state.processToBeKilled;
    axios.post('http://localhost:8008/kill', { portNo })
      .then(response => {
        const newService = response.data
        const serviceProcess = response.data.processId ? response.data.processId : 'unknown'
        const serviceStatus = response.data.status
        const serviceHealth = response.data.health
        const serviceLive = response.data.live
        this.setState(prevState => ({
          services: prevState.services.map(
            service => (service.id === newService.id ? Object.assign(service, { status: serviceStatus, health: serviceHealth, processId: serviceProcess, live: serviceLive }) : service)
          )
        }), () => {
          this.setState({ lock: false })
        })
      })
      .catch(error => {
        this.setState({ lock: false })
        console.log(error)
      })
  }

  createListServices = () => {
    return this.state.services.map(service => {
      return <Service
        key={service.id}
        serviceProperty={service}
        start={this.startService}
        stop={this.stopService} />
    })
  }

  render() {
    const { services, lock } = this.state
    console.log(this.state)
    return (
      <div>
        <div className="banned" style={{ display: lock ? 'block' : 'none' }}></div>
        <div className="banned-message" style={{ display: lock ? 'flex' : 'none' }}>منتظر بمانید...</div>
        <div className="container">
          <Jumbotron fluid>
            <Container>
              <h2>مدیریت سرویس‌ها</h2>
              <p className="lead">در این قسمت امکان مشاهده و مدیریت سرویس‌های سامانه را خواهید داشت.</p>
            </Container>
          </Jumbotron>
          <Container>
            <Row>
              <Col xs lg="8">
                <Table striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th></th>
                      <th>نام سرویس</th>
                      <th>پورت</th>
                      <th>پراسس</th>
                      <th>وضعیت<sup>1</sup></th>
                      <th>پاسخگویی<sup>2</sup></th>
                      <th>زمان زنده</th>
                      <th colSpan="2">کنترل<sup>3</sup></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      services.length
                        ? this.createListServices(services)
                        : <tr></tr>
                    }
                  </tbody>
                </Table>
              </Col>
              <Col>
                <Card style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>خاموش کردن دستی سرویس</Card.Title>
                    <hr />
                    <Card.Subtitle className="mb-2 text-muted">
                      در این قسمت با وارد کردن <Badge variant="info"> پورت </Badge> سرویس مورد نظر از جدول سمت راست، آن را به صورت دستی خاموش کنید .
                  </Card.Subtitle>
                    <hr />
                    <Form>
                      <Form.Group controlId="processId">
                        {/* <Form.Label>پورت روی سرور</Form.Label> */}
                        <Form.Control
                          type="text"
                          placeholder="پورت را وارد کنید ..."
                          onChange={(e) => this._onHandleInputText(e)} />
                      </Form.Group>
                      <hr />
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={(e) => this.killProcess(e)}>
                        خاموش کن!
                    </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        {/* <Alert /> */}
      </div>
    )
  }
}

const Service = props => {
  const service = props.serviceProperty
  const serviceStatus = service.status
  const serviceHealth = service.health
  let statusIcon, healthIcon

  if (serviceStatus === 'running') {
    statusIcon = "mdi-cloud md-text-success blink"
  } else if (serviceStatus === 'stopped') {
    statusIcon = "mdi-cloud-alert md-text-muted"
  } else {
    statusIcon = "mdi-loading mdi-spin"
  }

  if (serviceHealth == true) {
    healthIcon = "mdi-check-network md-text-muted"
  } else if (serviceHealth == false) {
    healthIcon = "mdi mdi-close-network-outline md-text-error"
  } else {
    healthIcon = "mdi-loading mdi-spin"
  }

  return (
    <tr>
      <td className="align-middle">{service.id}</td>
      <td className="align-middle">
        <img
          className="size-m service-logo"
          src={`/img/${service.icon}`}
          alt={`/img/${service.id}`} />
      </td>
      <td>{service.name}</td>
      <td>{service.port}</td>
      <td>{service.processId}</td>
      <td className="align-middle">
        <span className={`mdi mdi-24px ${statusIcon}`}></span>
      </td>
      <td className="align-middle">
        <span className={`mdi mdi-24px ${healthIcon}`}></span>
      </td>
      <td>{service.live}</td>
      <td>
        <Button
          size="sm"
          variant="outline-success"
          disabled={serviceStatus === 'running' ? true : false}
          onClick={serviceHealth !== 'running' ? () => props.start(service.name) : null}>
          روشن
        </Button>
      </td>
      <td>
        <Button
          size="sm"
          variant="outline-danger"
          disabled={serviceStatus === 'stopped' ? true : false}
          onClick={serviceHealth !== 'stopped' ? () => props.stop(`${service.name}`) : null}>
          خاموش
        </Button>
      </td>
    </tr>
  )
}

// const Alert = () => {
//   const [show, setShow] = useState(true);

//   if (show) {
//     return (
//       <Alert variant="danger" onClose={() => setShow(false)} dismissible>
//         <Alert.Heading>خاموش کردن سرویس</Alert.Heading>
//         <p>
//           سرویسی با پورت وارد شده یافت نشد.
//         </p>
//       </Alert>
//     );
//   }
//   return <Button onClick={() => setShow(true)}>Show Alert</Button>;
// }
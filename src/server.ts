import express from 'express'
import cors from 'cors'
import Soap from './soap'
// import crypto from 'crypto';
import serverlessExpress from '@vendia/serverless-express'
import {APIGatewayProxyEvent, Context} from 'aws-lambda'
import * as fs from "fs";
import * as process from "process";
import bodyParser from 'body-parser'
import bodyParserXml from 'body-parser-xml'
import HelloService from "./soap/services/hello-service";
import StandardListService from "./soap/services/standard-list-service";
// initialize
bodyParserXml(bodyParser);

try {
  console.log('try')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  import * as pack from './package.json'
} catch (e) {
  console.log('catch')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  import * as pack from '../package.json'
}

export interface ProcessEnv {
  [key: string]: string | undefined
}

// eslint-disable-next-line no-undef
const APP_NAME: string = pack.name
// eslint-disable-next-line no-undef
const APP_VERSION: string = pack.version
// const APP_ARCH_VERSION = 'v1'

if (typeof (process.env.PORT) === 'undefined') {
  process.env.PORT = String(8888) // Porta mais segura
}

if (typeof (process.env.APP_HOST) === 'undefined') {
  process.env.APP_HOST = "http://localhost:8888"
}

export default class Server {
  public express: express.Application
  private app: Soap

  public constructor() {
    this.express = express()
    this.app = new Soap()

    this.middlewares()
    this.routes()
  }

  private middlewares(): void {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(bodyParser.xml())
    this.express.set('view engine', 'pug')
    this.express.set('views', Server.getViewsPath())
    // this.express.use(morgan('combined'))
  }

  private routes(): void {
    const API_ROOT = process.env.API_ROOT || ''
    this.express.get(API_ROOT + '/', (req, res) => {
      const jsonBody: any = {
        app: `${APP_NAME}:${APP_VERSION}`,
        services: `${process.env.APP_HOST}/services`
      }
      return res.json(jsonBody)
    })
    this.express.get(API_ROOT + '/ping', (req, res) => {
      return res.json({message: 'PONG'})
    })

    this.express.get(API_ROOT + '/alive', (req, res) => {
      return res.json({app: "I 'am alive"})
    })

    this.express.get(API_ROOT + '/services', (req, res) => {
      res.set('Content-Type', 'text/html')
      res.render('services', { host: process.env.APP_HOST});
    })

    this.express.get(API_ROOT + '/import', (req, res) => {
      return res.json({app: "Import currently are not implemented"})
    })

    /**
     * Exemplo de WSDL
     */
    this.express.post(API_ROOT + '/SayHello', (req, res) => {

      let service = new HelloService()
      let response = service.execute(req)

      res.set('Content-Type', 'text/xml')
      res.send(Soap.response('helloservice', response.toXml()))
    })

    /**
     * Exemplo de WSDL
     */
    this.express.get(API_ROOT + '/SayHello', (req, res) => {
      if (req.url.indexOf("?wsdl") > -1) {
        let xml = Server.getWsdlFile('HelloService.wsdl')
        res.set('Content-Type', 'application/xml')
        res.send(xml)
      } else {
        res.set('status', 400)
        res.set('Content-Type', 'text/xml')
        res.send('<error>Bad request: REST not enabled</error>')
      }
    })

    /**
     * StandardList de WSDL
     */
    this.express.post(API_ROOT + '/StandardList', async (req, res) => {

      let service = new StandardListService()
      let response = await service.execute(req)

      res.set('Content-Type', 'text/xml')
      res.send(Soap.response('standardlist', response.toXml()))
    })
    /**
     * StandardList de WSDL
     */
    this.express.get(API_ROOT + '/StandardList', async (req, res) => {


      if (req.url.indexOf("?wsdl") > -1) {
        let xml = Server.getWsdlFile('StandardListService.wsdl')
        res.set('Content-Type', 'application/xml')
        res.send(xml)
      } else {

        let service = new StandardListService()
        let response = await service.execute(req)

        res.set('Content-Type', 'text/xml')
        res.send(Soap.response('standardlist', response.toXml()))
      }
    })

    this.express.get(API_ROOT + '/wsdl/:file_name', async (req, res) => {
      if (Server.fileExists(req.path)) {
        let xml = Server.getWsdlFile(req.path.replace('/wsdl',''))
        res.set('Content-Type', 'application/xml')
        res.send(xml)
      } else {
        res.set('status', 400)
        res.set('Content-Type', 'text/xml')
        res.send('<error>Bad request: REST not enabled</error>')
      }
    })
  }

  private static getViewsPath() {
    if (fs.existsSync(process.cwd() + `/src/soap/html`)) {
      return process.cwd() + `/src/soap/html`
    } else {
      return process.cwd() + `/soap/html`
    }
  }

  private static getHtmlFile(service) {
    if (fs.existsSync(process.cwd() + `/src/soap/html/${service}.html`)) {
      return fs.readFileSync(process.cwd() + `/src/soap/html/${service}.html`);
    } else {
      return fs.readFileSync(process.cwd() + `/soap/html/${service}.html`);
    }

  }

  private static getWsdlFile(service) {
    if (fs.existsSync(process.cwd() + `/src/soap/wsdl/${service}`)) {
      return fs.readFileSync(process.cwd() + `/src/soap/wsdl/${service}`);
    } else {
      return fs.readFileSync(process.cwd() + `/soap/wsdl/${service}`);
    }

  }

  private static fileExists(pathElement: string) {
    // pathElement = pathElement.replace('/wsdl/', '')
    // console.log(pathElement)
    if (fs.existsSync(process.cwd() + `/src/soap/${pathElement}`)) {
      return true
    } else if (fs.existsSync(process.cwd() + `/soap/${pathElement}`)){
      return true
    }
    return false;
  }

  static execute() {
    const server = new Server()
    const app = server.express
    return app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))
  }

  static lambda(
    event: APIGatewayProxyEvent,
    context: Context
  ) {
    const server = new Server()
    const app = server.express

    // @ts-ignore
    const serverless = serverlessExpress.createServer(app)
    // @ts-ignore
    return serverlessExpress.proxy(serverless, event, context)
  }

  static lambdaV2(
    event: APIGatewayProxyEvent,
    context: Context
  ) {
    const server = new Server()
    const app = server.express

    return serverlessExpress({app})
  }



}

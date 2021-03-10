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
import routes from './routes'
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

if (typeof (process.env.API_ROOT) === 'undefined') {
  process.env.API_ROOT = ""
}


export default class Server {
  public static APP_NAME: string = APP_NAME
  public static APP_VERSION: string = APP_VERSION
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
    routes(this.express)
  }

  public static getViewsPath() {
    if (fs.existsSync(process.cwd() + `/src/soap/html`)) {
      return process.cwd() + `/src/soap/html`
    } else {
      return process.cwd() + `/soap/html`
    }
  }

  public static getHtmlFile(service) {
    if (fs.existsSync(process.cwd() + `/src/soap/html/${service}.html`)) {
      return fs.readFileSync(process.cwd() + `/src/soap/html/${service}.html`);
    } else {
      return fs.readFileSync(process.cwd() + `/soap/html/${service}.html`);
    }

  }

  public static getWsdlFile(service) {
    if (fs.existsSync(process.cwd() + `/src/soap/wsdl/${service}`)) {
      return fs.readFileSync(process.cwd() + `/src/soap/wsdl/${service}`);
    } else {
      return fs.readFileSync(process.cwd() + `/soap/wsdl/${service}`);
    }

  }

  public static fileExists(pathElement: string) {
    // pathElement = pathElement.replace('/wsdl/', '')
    // console.log(pathElement)
    if (fs.existsSync(process.cwd() + `/src/soap/${pathElement}`)) {
      return true
    } else if (fs.existsSync(process.cwd() + `/soap/${pathElement}`)) {
      return true
    }
    return false;
  }

  static logRoutes(app) {
    app._router.stack.forEach(function (r) {
      if (r.route && r.route.path) {
        console.log(r.route.stack[0].method.toUpperCase(), r.route.path)
      }
    })
  }

  static execute() {
    const server = new Server()
    const app = server.express

    Server.logRoutes(app)

    return app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))
  }

  static lambda(
    event: APIGatewayProxyEvent,
    context: Context
  ) {
    const server = new Server()
    const app = server.express

    Server.logRoutes(app)

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

    Server.logRoutes(app)

    return serverlessExpress({app})
  }


  public static applyVars(xml: any, variables: any) {
    let xmlStr = xml.toString()
    if (variables) {
      for (let key in variables) {
        // Importante  para evitar o erro:
        // [Object: null prototype] {}
        // TypeError: Cannot convert object to primitive value
        if (key == "_locals") {
          continue
        }

        let regex = new RegExp(`#{${key}}`, 'g')
        try {
          if (variables.hasOwnProperty(key)) {
            xmlStr = xmlStr.replace(regex, variables[key] || '')
          }
        } catch (e) {
          console.error(e)
        }

      }
    }

    return xmlStr
  }
}

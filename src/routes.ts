import {Express} from "express";
import process from "process";
import HelloService from "./soap/services/hello-service";
import Soap from "./soap";
import NormaListService from "./soap/services/norma-list-service";
import Server from "./server";
import NormaGetService from "./soap/services/norma-get-service";




export default function routes (app:Express) {
  // Importante que esteja no escopo para evitar o erro:
  // [Object: null prototype] {}
  // TypeError: Cannot convert object to primitive value
  const defaultVars = {
    host: process.env.APP_HOST,
    root: process.env.API_ROOT
  }

  const API_ROOT = process.env.API_ROOT || ''

  app.get(API_ROOT + '/', (req, res) => {
    const jsonBody: any = {
      app: `${Server.APP_NAME}:${Server.APP_VERSION}`,
      services: `${process.env.APP_HOST}${API_ROOT}/services`
    }
    return res.json(jsonBody)
  })
  app.get(API_ROOT + '/ping', (req, res) => {
    return res.json({message: 'PONG'})
  })

  app.get(API_ROOT + '/alive', (req, res) => {
    return res.json({app: "I 'am alive"})
  })

  app.get(API_ROOT + '/services', (req, res) => {
    res.set('Content-Type', 'text/html')
    res.render('services', defaultVars);
  })

  /**
   * Exemplo de WSDL
   */
  app.post(API_ROOT + '/services/SayHello', (req, res) => {

    let service = new HelloService()
    let response = service.execute(req)

    res.set('Content-Type', 'text/xml')
    res.send(Soap.response('helloservice', response.toXml()))
  })

  /**
   * Exemplo de WSDL
   */
  app.get(API_ROOT + '/services/SayHello', (req, res) => {
    if (req.url.indexOf("?wsdl") > -1) {
      let xml = Server.getWsdlFile('HelloService.wsdl')
      xml = Server.applyVars(xml,defaultVars)
      res.set('Content-Type', 'application/xml')
      res.send(xml)
    } else {
      res.set('Status', 400)
      res.set('Content-Type', 'text/xml')
      res.send('<error>Bad request: REST not enabled</error>')
    }
  })

  /**
   * NormaList de WSDL
   */
  app.post(API_ROOT + '/services/NormaList', async (req, res) => {

    let service = new NormaListService()
    let response = await service.execute(req)

    res.set('Content-Type', 'text/xml')
    res.send(Soap.response('normaList', response.toXml()))
  })
  /**
   * NormaList de WSDL
   */
  app.get(API_ROOT + '/services/NormaList', async (req, res) => {


    if (req.url.indexOf("?wsdl") > -1) {
      let xml = Server.getWsdlFile('NormaListService.wsdl')
      xml = Server.applyVars(xml,defaultVars)
      res.set('Content-Type', 'application/xml')
      res.send(xml)
    } else {

      let service = new NormaListService()
      let response = await service.execute(req)

      res.set('Content-Type', 'text/xml')
      res.send(Soap.response('normalist', response.toXml()))
    }
  })
  /**
   * NormaList de WSDL
   */
  app.get(API_ROOT + '/services/NormaGet/:norma_id?', async (req, res) => {
    if (req.url.indexOf("?wsdl") > -1) {
      let xml = Server.getWsdlFile('NormaGetService.wsdl')
      xml = Server.applyVars(xml,defaultVars)
      res.set('Content-Type', 'application/xml')
      res.send(xml)
    } else {

      let service = new NormaGetService()
      let response = await service.execute(req)

      if (response.error) {
        res.set('Status', 400)
      }
      res.set('Content-Type', 'text/xml')
      res.send(Soap.response('normaget', response.toXml(), response.error))
    }
  })

  app.post(API_ROOT + '/services/NormaGet', async (req, res) => {
    let service = new NormaGetService()
    let response = await service.execute(req)

    if (response.error) {
      res.set('Status', 400)
    }
    res.set('Content-Type', 'text/xml')
    res.send(Soap.response('normaget', response.toXml(), response.error))
  })

  app.get(API_ROOT + '/wsdl/:file_name', async (req, res) => {
    if (Server.fileExists(req.path.replace(API_ROOT, ''))) {
      let xml = Server.getWsdlFile(req.path.replace('/wsdl','').replace(API_ROOT, ''))
      xml = Server.applyVars(xml,defaultVars)
      res.set('Content-Type', 'application/xml')
      res.send(xml)
    } else {
      res.set('Status', 400)
      res.set('Content-Type', 'text/xml')
      res.send('<error>Bad request: REST not enabled</error>')
    }
  })
}

import moment, { unitOfTime } from 'moment'
import _ from 'lodash'

export default class Soap {

  static response(urn, xml, error:boolean = false) {
    let error_header = ''
    if (error) {
      error_header = '<wsa:Action>http://www.w3.org/2005/08/addressing/soap/fault</wsa:Action>'
    }
    return `
        <soapenv:Envelope
            xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:urn="urn:examples:${urn}">
        <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
            ${error_header}
        </soapenv:Header>
          <soapenv:Body>
            ${xml}
          </soapenv:Body>
        </soapenv:Envelope>
        `
  }
}

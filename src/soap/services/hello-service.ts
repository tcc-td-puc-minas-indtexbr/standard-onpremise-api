
class SayHelloRequest {
  public firstName: string;
  constructor(firstName) {
    this.firstName = firstName
  }

}

class SayHelloResponse {
  public greeting: string;
  constructor(firstName) {
    this.greeting = `Hello ${firstName}`
  }

  toXml() {
    return `<urn:SayHelloResponse>
                <greeting xsi:type="xsd:string">${this.greeting}</greeting>
            </urn:SayHelloResponse>`
  }
}


export default class HelloService {

  buildRequest(req) {
    let firstName = ''
    if (req.body.hasOwnProperty('soapenv:Envelope')) {
      let xmlBody = req.body['soapenv:Envelope']['soapenv:Body']
      let sayHelloMessage = xmlBody[0]['urn:sayHello']
      let firstNameField = sayHelloMessage[0]['firstName']
      firstName = firstNameField[0]['_']
      firstName = firstName.replace(/(<([^>]+)>)/gi, "");
    }

    return new SayHelloRequest(firstName)
  }

  execute(req) {
    let request = this.buildRequest(req)
    return new SayHelloResponse(request.firstName)
  }
}

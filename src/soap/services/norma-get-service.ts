import Norma from "../types/norma";
import NormaRepository from "../../repository/norma-repository";

class NormaGetRequest {
  public id: number;
  constructor(id) {
    this.id = id

    if (isNaN(id) || id < 1) {
      this.id = null
    }
  }

}

class NormaGetResponse {
  public item: Norma;
  public error: boolean;
  public errorMessage: string;
  constructor(item: any) {
    this.item = null;
    this.error = true;
    this.errorMessage = 'Not found';
    if (item != null) {
      this.item = new Norma(item);
      this.error = false;
      this.errorMessage = '';
    }
  }

  toXml() {
    if (this.item != null) {
      let xml = this.item.toXml();
      return `<urn:NormaGetResponse>
                <urn:NormaGet>
                    ${xml}
                </urn:NormaGet>
            </urn:NormaGetResponse>`
    } else {
      return `<error>Bad request: Not found</error>`
    }

  }
}

export default class NormaGetService {
  buildRequest(req) {
    let id = ''
    if (req.body.hasOwnProperty('soapenv:Envelope')) {
      let xmlBody = req.body['soapenv:Envelope']['soapenv:Body']
      let sayHelloMessage = xmlBody[0]['urn:normaGet']
      let firstNameField = sayHelloMessage[0]['id']
      id = firstNameField[0]['_']
      id = id.replace(/(<([^>]+)>)/gi, "");
    } else if (req.params.hasOwnProperty('id')){
      id = req.params.id;
    }

    return new NormaGetRequest(id)
  }

  async execute(req) {
    let request = this.buildRequest(req)

    const repository = new NormaRepository()
    const item = await repository.get(request.id)
    // console.log('item', item)
    return new NormaGetResponse(item)

  }
}

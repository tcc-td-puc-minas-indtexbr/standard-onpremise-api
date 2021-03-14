import Norma from "../types/norma";
import NormaRepository from "../../repository/norma-repository";

class NormaGetRequest {
  public norma_id: number;
  constructor(norma_id) {
    this.norma_id = norma_id

    if (isNaN(norma_id) || norma_id < 1) {
      this.norma_id = null
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
    let norma_id = ''
    if (req.body.hasOwnProperty('soapenv:Envelope')) {
      let xmlBody = req.body['soapenv:Envelope']['soapenv:Body']
      let sayHelloMessage = xmlBody[0]['urn:normaGet']
      let firstNameField = sayHelloMessage[0]['norma_id']
      norma_id = firstNameField[0]['_']
      norma_id = norma_id.replace(/(<([^>]+)>)/gi, "");
    } else if (req.params.hasOwnProperty('norma_id')){
      norma_id = req.params.norma_id;
    }

    return new NormaGetRequest(norma_id)
  }

  async execute(req) {
    let request = this.buildRequest(req)

    const repository = new NormaRepository()
    const item = await repository.get(request.norma_id)
    // console.log('item', item)
    return new NormaGetResponse(item)

  }
}

import StandardApi from "../../rest/standard-api";
import Standard from "../types/standard";

class StandardListRequest {
  constructor() {
  }

}

class StandardListResponse {
  public list: Standard[];
  constructor(list: any) {
    this.list = []
    for (let key in list) {
      this.list.push(new Standard(list[key]))
    }
  }

  toXml() {
    let listXml = ''
      for (let key in this.list) {
        listXml += this.list[key].toXml()
      }
    return `<urn:StandardListResponse>
                <urn:StandardList>
                    ${listXml}
                </urn:StandardList>
            </urn:StandardListResponse>`
  }
}

export default class StandardListService {
  buildRequest(req) {
    return new StandardListRequest()
  }

  async execute(req) {
    let request = this.buildRequest(req)

    const api = new StandardApi()
    const list = await api.list()
    // console.log('list', list)
    return new StandardListResponse(list)

  }
}

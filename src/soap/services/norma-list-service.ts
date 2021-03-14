import Norma from "../types/norma";
import NormaRepository from "../../repository/norma-repository";

class NormaListRequest {
  constructor() {
  }

}

class NormaListResponse {
  public list: Norma[];
  constructor(list: any) {
    this.list = []
    for (let key in list) {
      this.list.push(new Norma(list[key]))
    }
  }

  toXml() {
    let listXml = ''
      for (let key in this.list) {
        listXml += this.list[key].toXml()
      }
    return `<urn:NormaListResponse>
                <urn:NormaList>
                    ${listXml}
                </urn:NormaList>
            </urn:NormaListResponse>`
  }
}

export default class NormaListService {
  buildRequest(req) {
    return new NormaListRequest()
  }

  async execute(req) {
    let request = this.buildRequest(req)

    const repository = new NormaRepository()
    const list = await repository.list()
    // console.log('list', list)
    return new NormaListResponse(list)

  }
}

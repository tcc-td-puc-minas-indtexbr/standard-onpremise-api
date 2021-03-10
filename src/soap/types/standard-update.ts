export default class StandardUpdate {

  uuid:	string

  constructor(listElement: any) {
    if (listElement) {
      Object.assign(this, listElement)
    }
  }


  toXml() {
    return `<urn:StandardUpdate>

            </urn:StandardUpdate>`;
  }
}

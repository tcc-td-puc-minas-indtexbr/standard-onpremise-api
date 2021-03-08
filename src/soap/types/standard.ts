export default class Standard {

  comite:	string
  currency:	string
  file:	string
  identification:	string
  language:	string
  objective:	string
  organization:	string
  pages:	number
  price:	number
  publication_date: string
  status:	string
  title:	string
  title_global_language:	string
  url:	string
  uuid:	string
  validity_start:	string

  constructor(listElement: any) {
    if (listElement) {
      Object.assign(this, listElement)
    }
  }


  toXml() {
    return `<urn:Standard>
              <comite type="xsd:string">${this.comite}</comite>
              <currency type="xsd:string">${this.currency}</currency>
              <file type="xsd:string">${this.file}</file>
              <identification type="xsd:string">${this.identification}</identification>
              <language type="xsd:string">${this.language}</language>
              <objective type="xsd:string">${this.objective}</objective>
              <organization type="xsd:string">${this.organization}</organization>
              <pages type="xsd:integer">${this.pages}</pages>
              <price type="xsd:decimal">${this.price}</price>
              <publication_date type="xsd:string">${this.publication_date}</publication_date>
              <status type="xsd:string">${this.status}</status>
              <title type="xsd:string">${this.title}</title>
              <title_global_language type="xsd:string">${this.title_global_language}</title_global_language>
              <url type="xsd:string">${this.url}</url>
              <uuid type="xsd:string">${this.uuid}</uuid>
              <validity_start type="xsd:string">${this.validity_start}</validity_start>
            </urn:Standard>`;
  }
}

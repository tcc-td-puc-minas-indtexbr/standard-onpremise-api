export default class Norma {

  norma_id: number
  codigo: string
  data_publicacao: string
  validade: string
  titulo: string
  comite: string
  status: string
  idioma: string
  organizacao: string
  preco: number
  moeda: string
  objetivo: string
  link: string
  arquivo: string

  constructor(listElement: any) {
    if (listElement) {
      Object.assign(this, listElement)
    }
  }


  toXml() {
    return `<urn:Norma>
              <norma_id type="xsd:number">${this.norma_id}</norma_id>
              <codigo type="xsd:string">${this.codigo}</codigo>
              <data_publicacao type="xsd:string">${this.data_publicacao}</data_publicacao>
              <validade type="xsd:string">${this.validade}</validade>
              <titulo type="xsd:string">${this.titulo}</titulo>
              <comite type="xsd:string">${this.comite}</comite>
              <status type="xsd:string">${this.status}</status>
              <idioma type="xsd:string">${this.idioma}</idioma>
              <organizacao type="xsd:string">${this.organizacao}</organizacao>
              <preco type="xsd:string">${this.preco}</preco>
              <moeda type="xsd:string">${this.moeda}</moeda>
              <objetivo type="xsd:string">${this.objetivo}</objetivo>
              <link type="xsd:string">${this.link}</link>
              <arquivo type="xsd:string">${this.arquivo}</arquivo>
            </urn:Norma>`;
  }
}

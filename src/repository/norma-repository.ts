import axios from 'axios'
import {response} from "express";
import fs from 'fs';
import process from "process";

function getLocalJson() {
  let data = [];
  if (fs.existsSync(process.cwd() + `/datasource/qualidade-e-seguranca.db.json`)) {
    const fileData = fs.readFileSync(process.cwd() + `/datasource/qualidade-e-seguranca.db.json`);
    try {
      data = JSON.parse(fileData)['norma']
    } catch (e) {
      console.error(e)
    }
  }

  return data;
}

export default class NormaRepository {
  private sourceJson: string;
  private remote: boolean;

  constructor() {
    this.sourceJson = 'https://services.hagatus.com.br/sigo-reader/v1/read/indtexbr/qualidade-e-seguranca.db.json'
    this.remote = true;
  }

  public async list() {
    if (this.remote) {
      return await axios.get(`${this.sourceJson}`)
        .then(response => {
          if (response.data.hasOwnProperty('norma') && response.status === 200) {
            return response.data.norma
          }
          return []
        }).catch(error => {
          console.error(new String(error))
          return getLocalJson()
        })
    } else {
      return getLocalJson()
    }

  }
  public async get(id) {
    let object = null
    const list = await this.list()

    for (const key in list) {
      const item = list[key]
      if (item.hasOwnProperty('norma_id') && item.norma_id == id) {
        object = item
        break
      }
    }
    return object
  }

}

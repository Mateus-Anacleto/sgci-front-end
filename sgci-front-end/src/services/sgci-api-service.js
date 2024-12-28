import axios from 'axios'

const apiSgci = axios.create({
  baseURL: process.env.API_SGCI
})

export class PessoaService {
  path = '/pessoas'

  create (pessoa) {
    return apiSgci.post(this.path, pessoa)
  }

  update (id, pessoa) {
    return apiSgci.put(this.path + '/' + id, pessoa)
  }

  getById (id) {
    return apiSgci.get(this.path + '/' + id)
  }

  findAll (params, config) {
    const finalConfig = Object.assign({ params }, config)
    return apiSgci.get(this.path, finalConfig)
  }

  delete (id) {
    return apiSgci.delete(this.path + '/' + id)
  }

  exportar () {
    return apiSgci.get(this.path + '/exportar-csv')
  }
}

export const pessoaService = new PessoaService()

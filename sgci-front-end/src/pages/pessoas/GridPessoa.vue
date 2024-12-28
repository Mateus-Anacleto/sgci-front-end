<template>
  <div class="q-pa-md bg">
    <div class="bg"></div>
      <div class="main-container">
        <div class="q-mb-md">
          <h4 class="title" style="margin-bottom: -5px;">Consulta de Pessoas</h4>
        </div>
      </div>
    <q-table
      class="my-sticky-header-last-column-table"
      flat bordered
      ref="tableRef"
      :rows="rows"
      :columns="columns"
      :rows-per-page-options="pagination.perpageOptions"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      @request="buscarPessoas">

      <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" :class="col.label === 'Ações' ? 'action_column' : ''">
              {{ col.label }}
            </q-th>
          </q-tr>
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" :class="col.label === 'Ações' ? 'action_column' : ''">
              <q-input v-if="col.name != 'actions'"
              :model-value="filters[col.name]"
              @change="val => filtroTrocado(col.name, val)"
              filled dense>
              </q-input>
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm text-center action_column">
            <q-btn class="btn-action q-ml-none" size="sm" round flat icon="visibility" @click="visualizar(props.row)">
              <q-tooltip>Visualizar</q-tooltip>
            </q-btn>
            <q-btn class="btn-action" size="sm" style="margin-right: 5px;" round flat icon="border_color"
              @click="editar(props.row)">
              <q-tooltip>Editar Registro</q-tooltip>
            </q-btn>
            <q-btn class="btn-action" size="sm" round flat icon="cancel" @click="confirmarRemocao(props.row)">
              <q-tooltip>Excluir Registro</q-tooltip>
            </q-btn>
          </q-td>
        </template>
    </q-table>
    <div class="row">
      <div class="col-12">
        <div style="float: right; margin-top: 20px;">
          <q-btn @click="exportar" style="margin-right: 10px; background-color: #2e8b57; color: white" label="Exportar CSV" caps class="btn-voltar" />
          <q-btn @click="cadastrar" type="submit" color="primary" label="Cadastrar Pessoa" class="btn-cadastrar"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { pessoaService } from 'src/services/sgci-api-service.js'
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()
    const tableRef = ref()
    const rows = ref([])
    const columns = ref([
      { name: 'id', align: 'center', label: 'Id', field: 'id' },
      { name: 'nome', align: 'left', label: 'Nome', field: 'nome' },
      { name: 'documento', align: 'left', label: 'Documento', field: 'documento' },
      { name: 'profissao', align: 'left', label: 'Profissão', field: 'profissao' },
      { name: 'tipo', align: 'left', label: 'Tipo de Pessoa', field: (row) => row.tipo, format: (val) => val === 'PESSOA_JURIDICA' ? 'Pessoa Jurídica' : 'Pessoa Física' },
      { name: 'actions', required: true, align: 'left', field: 'actions' }
    ])
    const loading = ref(false)
    const filters = {}
    const pagination = ref({
      sortBy: 'desc',
      descending: true,
      page: 1,
      rowsPerPage: 5,
      perpageOptions: [1, 5, 10, 15, 20]
    })

    function buscarPessoas (props) {
      const { page, rowsPerPage, sortBy, descending } = props === undefined ? pagination.value : props.pagination

      const pageAt = page - 1
      const fetchCount = rowsPerPage
      pagination.value.rowsPerPage = fetchCount

      // requirimentos que o back-end espera, page (número da página onde o usuário se encontra), size (a quantidade de itens por página), direction (direção ascendente ou descendente dos filtros)
      const req = { page: pageAt, size: fetchCount, direction: pagination.value.descending ? 'DESC' : 'ASC', ordenarPor: 'id' }

      // chamando o método presente em sgci-api-service para buscar todas as pessoas
      pessoaService.findAll(prepararFiltros(req)).then(retorno => {
        // atualizar as linhas da tabela conforme os dados presente no banco de dados
        rows.value.splice(0, rows.value.length, ...retorno.data.data) // retorna os valores que estão armazenados no back-end e passa para as linhas da nossa tabela
        pagination.value.page = retorno.data.page + 1 // mostra a página atual em que o usuário se encontra
        pagination.value.rowsNumber = retorno.data.totalRecords // quantidade de registros por página
        pagination.value.sortBy = sortBy // ordenação
        pagination.value.descending = descending
        loading.value = false
      })
    }

    // função que irá tratar os filtros
    function prepararFiltros (req) {
      const request = {}
      Object.assign(request, filters)
      for (const key of Object.keys(request)) {
        if (request[key] === null) {
          delete request[key]
          continue
        }
        if (typeof request[key] === 'object') {
          if (Array.isArray(request[key])) {
            continue
          }
          delete request[key]
          if (request[key].id) {
            request[key] = request[key].id
            continue
          }
          request[key] = request[key].value
        }
      }
      Object.assign(request, req)
      return request
    }

    onMounted(() => {
      // get initial data from server (1st page)
      tableRef.value.requestServerInteraction()
    })

    return {
      tableRef,
      loading,
      pagination,
      columns,
      rows,
      buscarPessoas,
      filters,
      $q
    }
  },
  methods: {
    exportar () {
      pessoaService.exportar().then(result => {
        this.downloadArquivoCsv(result.data, 'pessoas.csv')
        this.$q.notify({ message: 'Arquivo exportado com sucesso!', color: 'positive', textColor: 'white' })
      })
    },
    downloadArquivoCsv (base64, nomeArquivo) {
      const byteCharacters = atob(base64)
      const byteArrays = new Uint8Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i)
      }
      const blob = new Blob([byteArrays], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = nomeArquivo
      link.click()

      URL.revokeObjectURL(url)
    },
    filtroTrocado (campoNome, valor) {
      if (valor === null || valor === '') {
        delete this.filters[campoNome]
      } else {
        // possui a lógica para trabalhar com filtro não exatos de enums
        this.filters[campoNome] = valor
        if (campoNome === 'tipo') {
          const tipoEnumMap = {
            'Pessoa Jurídica': 'PESSOA_JURIDICA',
            'Pessoa Física': 'PESSOA_FISICA'
          }
          const lowerValor = valor.toLowerCase()
          const matchedKey = Object.keys(tipoEnumMap).find((key) =>
            key.toLowerCase().includes(lowerValor)
          )
          this.filters[campoNome] = tipoEnumMap[matchedKey] || valor // Usa o enum ou mantém o valor
        } else {
          this.filters[campoNome] = valor
        }
      }
      this.buscarPessoas()
    },
    visualizar (row) {
      this.$router.push('/pessoas/view/' + row.id)
    },
    cadastrar () {
      this.$router.push('/pessoas/form')
    },
    editar (row) {
      this.$router.push('/pessoas/form/' + row.id)
    },
    confirmarRemocao (row) {
      this.$q.dialog({
        title: 'Alerta',
        message: 'Tem certeza que deseja excluir o registro?',
        style: 'width: 300px',
        ok: {
          label: 'Remover',
          push: true,
          color: 'red'
        },
        cancel: {
          label: 'Cancelar',
          push: true,
          outline: true,
          color: 'blue'
        },
        persistent: true
      }).onOk(() => {
        pessoaService.delete(row.id).then(() => {
          this.$q.notify({ message: 'Registro removido com sucesso!', color: 'positive', textColor: 'white' })
          this.buscarPessoas()
        }).catch(error => {
          console.log(error)
        })
      })
    }
  }
}
</script>
<style lang="sass">
.my-sticky-header-last-column-table
  /* height or max-height is important */
  height: 100%

  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 100%

  td:last-child
    /* bg color is important for td; just specify one */
    background-color: #00b4ff

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:last-child th:last-child
    /* highest z-index */
    z-index: 3

  td:last-child
    z-index: 1

  td:last-child, th:last-child
    position: sticky
    right: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>

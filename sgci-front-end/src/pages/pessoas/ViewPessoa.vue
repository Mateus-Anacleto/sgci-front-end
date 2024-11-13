<template>
  <div>
    <q-form greedy ref="formPessoa" class="bg">
      <div class="bg"></div>
      <div class="main-container">

        <div class="q-mb-md">
          <h4 class="title">Visualizar Pessoa</h4>
          <div class="divisor-inline"></div>
        </div>

        <!--Campo Dados Pessoais-->
        <div class="q-pa-md">
          <h4 class="subTitle" style="margin-top: -15px; margin-bottom: 10px;">Dados Pessoais</h4>
          <div class="row q-gutter-lg q-mb-sm">
            <div class="col-5">
              <span class="tituloVisualizar">Nome: </span><span class="valorVisualizar">{{ pessoa?.nome }}</span>
            </div>
            <div class="col-3">
              <span class="tituloVisualizar">Documento: </span><span class="valorVisualizar">{{ pessoa?.documento }}</span>
            </div>
            <div class="col-3">
              <span class="tituloVisualizar">Profissão: </span><span class="valorVisualizar">{{ pessoa?.profissao }}</span>
            </div>
            <div class="col-5">
              <span class="tituloVisualizar">Tipo de Pessoa: </span><span class="valorVisualizar">{{ formatarPessoa(pessoa?.tipo) }}</span>
            </div>
            <div class="col-3">
              <span class="tituloVisualizar">Estado Civil: </span><span class="valorVisualizar">{{ formatarEstadoCivil(pessoa?.estadoCivil) }}</span>
            </div>
          </div>
        </div>
        <div class="divisor-inline"></div>
        <!--Campo Endereço-->
        <div class="q-pa-md">
          <h4 class="subTitle" style="margin-top: 5px;">Endereço</h4>
          <div class="row q-gutter-lg q-mb-sm">
            <div class="col-4">
              <span class="tituloVisualizar">CEP: </span><span class="valorVisualizar">{{ pessoa?.endereco.cep }}</span>
            </div>
            <div class="col-3">
              <span class="tituloVisualizar">Estado: </span><span class="valorVisualizar">{{ pessoa?.endereco.estado }}</span>
            </div>
            <div class="col-4">
              <span class="tituloVisualizar">Cidade: </span><span class="valorVisualizar">{{ pessoa?.endereco.cidade }}</span>
            </div>
            <div class="col-4">
              <span class="tituloVisualizar">Rua: </span><span class="valorVisualizar">{{ pessoa?.endereco.rua }}</span>
            </div>
            <div class="col-3">
              <span class="tituloVisualizar">Bairro: </span><span class="valorVisualizar">{{ pessoa?.endereco.bairro }}</span>
            </div>
            <div class="col-3">
              <span class="tituloVisualizar">Número: </span><span class="valorVisualizar">{{ pessoa?.endereco.numero }}</span>
            </div>
          </div>
        </div>
        <!--Campo Endereço-->

        <div class="row">
          <!--Botões-->
          <div class="col-12">
            <div style="float: right">
              <q-btn push style="margin-right: 15px;" text-color="primary" label="Voltar" class="btn-voltar" />
              <!-- <q-btn type="submit" color="primary" :label="pessoa.id ? 'Salvar' : 'Cadastrar'" class="btn-cadastrar" /> -->
            </div>
          </div>

        </div>
      </div>

    </q-form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { pessoaService } from 'src/services/sgci-api-service.js'

export default {
  name: 'CreateEditPessoa',
  setup () {
    const pessoa = ref({
      id: null,
      nome: null,
      tipo: null,
      documento: null,
      profissao: null,
      estadoCivil: null,
      endereco: ref({
        cep: null,
        estado: null,
        cidade: null,
        rua: null,
        bairro: null,
        numero: null
      })
    })
    return {
      pessoa
    }
  },
  mounted () {
    this.buscarPessoaParaVisualizacao()
  },
  methods: {
    buscarPessoaParaVisualizacao () {
      if (!this.$route.params.id) return
      pessoaService.getById(this.$route.params.id).then(retorno => {
        this.pessoa = retorno.data
      })
    },
    formatarPessoa (valor) {
      return valor === 'PESSOA_JURIDICA' ? 'Pessoa Jurídica' : 'Pessoa Física'
    },
    formatarEstadoCivil (valor) {
      return valor === 'SOLTEIRO' ? 'Solteiro' : valor === 'CASADO' ? 'Casado' : 'Divorciado'
    }
  }
}
</script>

<template>
  <div>
    <q-form greedy ref="formPessoa" @submit="cadastrar" class="bg">
      <div class="bg"></div>
      <div class="main-container">

        <div class="q-mb-md">
          <h4 class="title">Cadastrar Pessoa</h4>
          <div class="divisor-inline"></div>
        </div>

        <!--Campo Dados Pessoais-->
        <div class="q-pa-md">
          <h4 class="subTitle" style="margin-top: -15px;">Dados Pessoais</h4>
          <div class="row q-gutter-lg q-mb-sm">
            <div class="col-5">
              <q-input :rules="[vRequired]"
                v-model="pessoa.nome" label="Nome" dense />
            </div>
            <div class="col-3">
              <q-input :rules="[vRequired]"
                v-model="pessoa.documento" label="Documento" dense />
            </div>
            <div class="col-3">
              <q-input :rules="[vRequired]"
                v-model="pessoa.profissao" label="Profissão" dense />
            </div>
            <div class="col-6">
              <q-field ref="tipoPessoa" dense :model-value="pessoa.tipo" :rules="[vRequired]" label="Tipo de Pessoa" lazy-rules borderless stack-label>
                <template v-slot:control>
                <q-option-group
                    type="radio"
                    size="xs"
                    v-model="pessoa.tipo"
                    :options="optionsTipoPessoa"
                    color="primary"
                    inline />
                  </template>
              </q-field>
            </div>
            <div class="col-5">
              <q-field ref="pessoaEstadoCivil" dense :model-value="pessoa.estadoCivil" :rules="[vRequired]" label="Estado Civil" lazy-rules borderless stack-label>
                <template v-slot:control>
                <q-option-group
                    type="radio"
                    size="xs"
                    v-model="pessoa.estadoCivil"
                    :options="optionsEstadoCivil"
                    color="primary"
                    inline />
                  </template>
              </q-field>
            </div>
          </div>
        </div>
        <div class="divisor-inline"></div>
        <!--Campo Endereço-->
        <div class="q-pa-md">
          <h4 class="subTitle" style="">Endereço</h4>
          <div class="row q-gutter-lg q-mb-sm">
            <div class="col-2">
              <q-input :rules="[vRequired]"
                v-model="pessoa.endereco.cep" label="CEP" dense />
            </div>
            <div class="col-4">
              <q-input :rules="[vRequired]"
                v-model="pessoa.endereco.estado" label="Estado" dense />
            </div>
            <div class="col-5">
              <q-input :rules="[vRequired]"
                v-model="pessoa.endereco.cidade" label="Cidade" dense />
            </div>
            <div class="col-7">
              <q-input :rules="[vRequired]"
                v-model="pessoa.endereco.rua" label="Rua" dense />
            </div>
            <div class="col-3">
              <q-input :rules="[vRequired]"
                v-model="pessoa.endereco.bairro" label="Bairro" dense />
            </div>
            <div class="col-1">
              <q-input :rules="[vRequired]"
                v-model="pessoa.endereco.numero" label="Número" dense />
            </div>
          </div>
        </div>
        <!--Campo Endereço-->

        <div class="row">
          <!--Botões-->
          <div class="col-12">
            <div style="float: right">
              <q-btn push style="margin-right: 15px;" text-color="primary" label="Voltar" class="btn-voltar" />
              <q-btn type="submit" color="primary" label="Cadastrar" class="btn-cadastrar" />
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
      pessoa,
      optionsTipoPessoa: [
        {
          label: 'Pessoa Física',
          value: 'PESSOA_FISICA'
        },
        {
          label: 'Pessoa Jurídica',
          value: 'PESSOA_JURIDICA'
        }
      ],
      optionsEstadoCivil: [
        {
          label: 'Solteiro',
          value: 'SOLTEIRO'
        },
        {
          label: 'Casado',
          value: 'CASADO'
        },
        {
          label: 'Divorciado',
          value: 'DIVORCIADO'
        }
      ]
    }
  },
  watch: {
    'pessoa.tipo': {
      handler () {
        this.$refs.tipoPessoa.resetValidation()
      }
    },
    'pessoa.estadoCivil': {
      handler () {
        this.$refs.pessoaEstadoCivil.resetValidation()
      }
    }
  },
  methods: {
    cadastrar () {
      pessoaService.create(this.pessoa).then(response => {
        console.log('Pessoa cadastrada com sucesso!')
      })
    }
  }
}
</script>

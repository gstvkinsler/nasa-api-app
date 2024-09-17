<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn flat round dense icon="menu" @click="toggleLeftDrawer" />
          <span class="q-mx-md">Asteroides</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item>
          <q-btn @click="openCreateModal" color="secondary" class="full-width">
            Criar Card
          </q-btn>
        </q-item>
        <q-item>
          <q-item-section>
            <q-btn @click="saveFromNasa" color="primary" class="full-width">
              Importar Asteroides
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="createDialog" persistent>
      <q-card style="min-width: 500px !important">
        <q-card-section>
          <div class="text-h6">Criar Novo Asteroide</div>
          <q-input v-model="newAsteroid.name" label="Nome" />
          <q-input v-model="newAsteroid.close_approach_date" label="Data de Aproximação" type="date" />
          <q-input v-model="newAsteroid.magnitude" label="Magnitude" type="number" />
          <q-input v-model="newAsteroid.estimated_diameter" label="Diâmetro Estimado (km)" type="number" />
          <q-input v-model="newAsteroid.relative_velocity" label="Velocidade Relativa (km/h)" type="number" />
          <q-toggle v-model="newAsteroid.is_potentially_hazardous" label="Potencialmente Perigoso" />
          <q-input v-model="newAsteroid.nasa_jpl_url" label="URL NASA JPL" />
        </q-card-section>
        <q-card-actions>
          <q-btn @click="createAsteroid" color="primary" label="Salvar" />
          <q-btn @click="createDialog = false" flat label="Cancelar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { saveAsteroidsFromNasa, createAsteroid } from 'src/services/nasaService.js';

export default defineComponent({
  name: 'App',
  data() {
    return {
      leftDrawerOpen: false,
      createDialog: false,
      newAsteroid: {
        name: '',
        close_approach_date: '',
        magnitude: '',
        estimated_diameter: '',
        relative_velocity: '',
        is_potentially_hazardous: false,
        nasa_jpl_url: ''
      }
    };
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    openCreateModal() {
      this.createDialog = true;
    },
    async saveFromNasa() {
      try {
        const response = await saveAsteroidsFromNasa();
        console.log('Asteroides salvos com sucesso da NASA:', response);
        location.reload();
      } catch (error) {
        console.error('Erro ao salvar dados da NASA:', error);
      }
    },

    async createAsteroid() {
      try {
        const response = await createAsteroid(this.newAsteroid);
        console.log('Asteroide criado com sucesso:', response);
        this.createDialog = false;
        this.newAsteroid = {
          name: '',
          close_approach_date: '',
          magnitude: '',
          estimated_diameter: '',
          relative_velocity: '',
          is_potentially_hazardous: false,
          nasa_jpl_url: ''
        };
        location.reload();
      } catch (error) {
        console.error('Erro ao criar asteroide:', error);
      }
    }
  },

});
</script>

<style>
body {
  background-color: rgb(226, 226, 226);
}
</style>

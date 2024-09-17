<template>
  <div class="wrapper">
    <div class="section">
      <div class="header" >
        <span>Perigoso</span>
      </div>
      <div class="card-container">
        <q-card v-for="(asteroid, index) in hazardousAsteroids" :key="index" class="q-ma-xs card">
          <q-card-section>
              <div class="text-h6">{{ asteroid.name }}</div>
              <div class="text-subtitle1">Magnitude: {{ asteroid.magnitude }}</div>
              <div class="text-caption">Diâmetro Estimado (km): <br>{{ asteroid.estimated_diameter }}</div>
              <div style="margin-top: 5px;" :style="getDynamicStyle(asteroid.is_potentially_hazardous)">
                {{ asteroid.is_potentially_hazardous ? 'Perigoso' : 'Não Perigoso' }}
              </div>
            </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat color="primary" :href="asteroid.nasa_jpl_url" target="_blank">Detalhes</q-btn>
            <q-btn flat color="secondary" @click="openEditModal(asteroid)">Editar</q-btn>
            <q-btn flat color="red" @click="openDeleteConfirmModal(asteroid)">Excluir</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="section">
      <div class="header">
        <span>Asteroides</span>
      </div>
      <div class="card-container">
        <q-card v-for="(asteroid, index) in recentAsteroids" :key="index" class="q-ma-xs card">
          <q-card-section>
            <div class="text-h6">{{ asteroid.name }}</div>
            <div class="text-subtitle1">Magnitude: {{ asteroid.magnitude }}</div>
            <div class="text-caption">Diâmetro Estimado (km): <br>{{ asteroid.estimated_diameter }}</div>
            <div :style="getDynamicStyle(asteroid.is_potentially_hazardous)">
              {{ asteroid.is_potentially_hazardous ? 'Perigoso' : 'Não Perigoso' }}
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat color="primary" :href="asteroid.nasa_jpl_url" target="_blank">Detalhes</q-btn>
            <q-btn flat color="secondary" @click="openEditModal(asteroid)">Editar</q-btn>
            <q-btn flat color="red" @click="openDeleteConfirmModal(asteroid)">Excluir</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
  <q-dialog v-model="editDialog" persistent>
    <q-card style="min-width: 500px !important">
      <q-card-section>
        <div class="text-h6">Editar Asteroide</div>
        <q-input v-model="editAsteroid.name" label="Nome" />
        <q-input v-model="editAsteroid.close_approach_date" label="Data de Aproximação" type="date" />
        <q-input v-model="editAsteroid.magnitude" label="Magnitude" type="number" />
        <q-input v-model="editAsteroid.estimated_diameter" label="Diâmetro Estimado (km)" type="number" />
        <q-input v-model="editAsteroid.relative_velocity" label="Velocidade Relativa (km/h)" type="number" />
        <q-toggle v-model="editAsteroid.is_potentially_hazardous" label="Potencialmente Perigoso" />
        <q-input v-model="editAsteroid.nasa_jpl_url" label="URL NASA JPL" />
      </q-card-section>
      <q-card-actions>
        <q-btn @click="updateAsteroid" color="primary" label="Salvar" />
        <q-btn @click="editDialog = false" flat label="Cancelar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="deleteConfirmDialog" persistent>
    <q-card style="min-width: 400px !important">
      <q-card-section>
        <div class="text-h6">Confirmar Exclusão</div>
        <div>Tem certeza que deseja excluir o asteroide "{{ deleteAsteroid.name }}"?</div>
      </q-card-section>
      <q-card-actions>
        <q-btn @click="deleteAsteroidConfirmed" color="red" label="Excluir" />
        <q-btn @click="deleteConfirmDialog = false" flat label="Cancelar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>


<script>

import { fetchAsteroids, updateAsteroid, deleteAsteroid } from 'src/services/nasaService.js';

export default {
  data() {
    return {
      hazardousAsteroids: [],
      recentAsteroids: [],
      editDialog: false,
      editAsteroid: {},
      deleteConfirmDialog: false,
      deleteAsteroid: null,
    };
  },
  methods: {
    async getAsteroids() {
      try {
        const data = await fetchAsteroids();
        
        if (data && Array.isArray(data)) {
          this.hazardousAsteroids = data.filter(asteroid => asteroid.is_potentially_hazardous);
          
          const today = new Date();
          this.recentAsteroids = data.filter(asteroid => {
            const approachDate = new Date(asteroid.close_approach_date);
            return approachDate >= today.setDate(today.getDate() - 7);
          });
        } else {
          console.error('Formato de dados inesperado', data);
        }
      } catch (error) {
        console.error('Erro ao buscar asteroides:', error);
      }
    },

    openEditModal(asteroid) {
      this.editAsteroid = { ...asteroid }; 
      this.editDialog = true; 
    },
    
    async updateAsteroid() {
      try {
        const response = await updateAsteroid(this.editAsteroid);
        const index = this.hazardousAsteroids.findIndex(a => a.id === this.editAsteroid.id);
        if (index !== -1) {
          this.hazardousAsteroids[index] = this.editAsteroid;
        }
        this.editDialog = false; 
        console.log('Asteroide atualizado com sucesso:', response);
      } catch (error) {
        console.error('Erro ao atualizar asteroide:', error);
      }
    },

    getDynamicStyle(isPotentiallyHazardous) {
      let color = '#006400';
      let borderRadius = '4px';
      let backgroundColor = '#90EE90';
      let width = "100px"
      let textAlign = "center"
      let height = "23px"

      if (isPotentiallyHazardous) {
        color = '#800000';
        backgroundColor = '#FF6347';
        width = "70px"
        textAlign = "center"
      }
      
      return {
        height,
        color,
        borderRadius,
        backgroundColor,
        width,
        textAlign
      };
  },

    openDeleteConfirmModal(asteroid) {
        this.deleteAsteroid = asteroid;
        this.deleteConfirmDialog = true;
      },

    async deleteAsteroidConfirmed() {
        try {
          const response = await deleteAsteroid(this.deleteAsteroid.id);
          console.log('Asteroide excluído com sucesso:', response);

          this.hazardousAsteroids = this.hazardousAsteroids.filter(a => a.id !== this.deleteAsteroid.id);
          this.recentAsteroids = this.recentAsteroids.filter(a => a.id !== this.deleteAsteroid.id);

          this.deleteConfirmDialog = false;
        } catch (error) {
          console.error('Erro ao excluir asteroide:', error);
        }
    }
  },
  mounted() {
    this.getAsteroids(); // Chama os asteroides ao carregar o componente
  }
};
</script>

<style scoped>
.wrapper {
  margin-bottom: 32px;
  background-color: white;
  margin-left: 5px;
  border-radius: 10px;
}

.section {
  margin-top: 10px;
  margin-bottom: 32px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.header {
  margin-bottom: 10px;
  font-size: xx-large;
}

.header span{
  background-color: #fdba00;
  font-size: xx-large;
  padding: 5px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  color: white;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-left: 10px;
  margin-top: 10px
}

.card {
  max-width: 250px;
}
</style>

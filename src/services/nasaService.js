// src/services/nasaService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/asteroids';


export async function fetchAsteroids() {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar asteroides do banco de dados:', error);
    throw error;
  }
}

export async function saveAsteroidsFromNasa() {
  try {
    const response = await axios.post(`${API_BASE_URL}/fetch_and_save`);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar asteroides da NASA:', error);
    throw error;
  }
}

export async function saveAsteroids(asteroids) {
  try {
    const response = await axios.post(`${API_BASE_URL}/asteroids/save`, { asteroids });
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar asteroides:', error);
    throw error;
  }
}

export async function updateAsteroid(asteroid) {
  try {
    const response = await axios.put(`${API_BASE_URL}/${asteroid.id}`, asteroid);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar asteroide:', error);
    throw error;
  }
}

export async function createAsteroid(asteroid) {
  try {
    const response = await axios.post(`${API_BASE_URL}`, asteroid);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar asteroide:', error);
    throw error;
  }
}

export async function deleteAsteroid(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir asteroide:', error);
    throw error;
  }
}
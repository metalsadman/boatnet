// Vuex CouchDB Module

import { authService } from '@boatnet/bn-auth';
import { pouchService } from '../_services/pouch.service';
import moment from 'moment';
import Vue from 'vue';
import Vuex, { Module, ActionTree, MutationTree } from 'vuex';
import { AuthState } from '@boatnet/bn-auth';
import { CouchDBCredentials } from '@boatnet/bn-couch';
import { PouchDBState, PouchDBSyncStatus } from './types/types';

Vue.use(Vuex);
const LS_LAST_SYNC_DATE = 'lastSyncDate';
const lastSync = localStorage.getItem(LS_LAST_SYNC_DATE);
export const state: PouchDBState = {
  credentials: null,
  syncStatus: { syncActive: false},
  lastSyncDate: lastSync ? lastSync : undefined
};

const actions: ActionTree<PouchDBState, any> = {
  // Mutations are asynchronous
  async connect({ commit }: any, credentials: CouchDBCredentials) {
    commit('connectRequest', credentials);
    pouchService.$on('sync', (sync: PouchDBSyncStatus) => {
      commit('syncChanged', sync);
    });
    pouchService.$on('initialsync', (sync: PouchDBSyncStatus) => {
      commit('syncCompleted', sync);
    });
  },
  async disconnect({ commit }: any) {
    commit('disconnect');
  },
  async addTest({ commit }: any, todoMsg: { message: string }) {
    commit('addTest', todoMsg);
  }
};

const mutations: MutationTree<PouchDBState> = {
  // Mutations must by synchronous
  connectRequest(newState: any, credentials: CouchDBCredentials) {
    pouchService.connect(credentials);
    newState.credentials = credentials;
  },
  disconnect(newState: any) {
    newState.syncStatus = { syncActive: false};
    pouchService.disconnect();
    pouchService.$off('sync');
  },
  syncCompleted(newState: any, status: PouchDBSyncStatus) {
    const date = moment().format();
    localStorage.setItem(LS_LAST_SYNC_DATE, date);
    newState.lastSyncDate = date;
  },
  syncChanged(newState: any, status: PouchDBSyncStatus) {
    newState.syncStatus = status;
  },
  addTest(newState: any, testMsg: { message: string }) {
    pouchService.addTestRow(testMsg);
  }
};

export const pouchState: Module<PouchDBState, any> = {
  namespaced: true,
  state,
  actions,
  mutations
};

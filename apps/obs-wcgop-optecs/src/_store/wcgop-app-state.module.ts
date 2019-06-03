import Vue from 'vue';
import Vuex, { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { WcgopAppState, RootState } from '@/_store/types/types';
import { WcgopTrip, WcgopOperation, BoatnetUser, CouchID } from '@boatnet/bn-models';
import { pouchService } from '@boatnet/bn-pouch';

Vue.use(Vuex);

export const state: WcgopAppState = {
  currentTrip: undefined,
  currentHaul: undefined,
  isKeyboardEnabled: true,
  isSoundEnabled: true,
  currentFakeHaulId: ''
};

const actions: ActionTree<WcgopAppState, RootState> = {
  save({ commit }: any, trip: WcgopTrip) {
    commit('save', trip);
  },
  setCurrentTrip({ commit }: any, trip: WcgopTrip) {
    commit('setCurrentTrip', trip);
  },
  setCurrentHaul({ commit }: any, haul: WcgopOperation) {
    commit('setCurrentHaul', haul);
  },
  clear({ commit }: any) {
    commit('setCurrentTrip', undefined);
  },
  setKeyboardStatus({ commit }: any, isEnabled: boolean) {
    commit('setKeyboardStatus', isEnabled);
  },
  setSoundEnabled({ commit }: any, isEnabled: boolean) {
    commit('setSoundEnabled', isEnabled);
  },
  setFakeId({ commit }: any, fakeId: CouchID) {
    commit('setFakeId', fakeId);
  },
};

const mutations: MutationTree<WcgopAppState> = {
  save(newState: any, record: any) {
    try {
      if (record._id) {
        pouchService.db
          .put(pouchService.userDBName, record)
          .then((response: any) => {
            record._rev = response.rev;
          });
      }
    } catch (err) {
      console.log('not properly save to the database');
    }
  },
  setCurrentTrip(newState: any, trip: WcgopTrip) {
    newState.currentTrip = trip;
  },
  setCurrentHaul(newState: any, haul: WcgopOperation) {
    newState.currentHaul = haul;
  },
  setKeyboardStatus(newState: any, isEnabled: boolean) {
    newState.isKeyboardEnabled = isEnabled;
  },
  setSoundEnabled(newState: any, isEnabled: boolean) {
    newState.isSoundEnabled = isEnabled;
  },
  setFakeId(newState: any, fakeId: CouchID) {
    newState.currentFakeHaulId = fakeId;
  }


};

const getters: GetterTree<WcgopAppState, RootState> = {
  currentTrip(getState: WcgopAppState) {
    return getState.currentTrip;
  },
  currentHaul(getState: WcgopAppState) {
    return getState.currentHaul;
  },
  isSoundEnabled(getState: WcgopAppState) {
    return getState.isSoundEnabled;
  },
  currentFakeHaulID(getState: WcgopAppState) {
    return getState.currentFakeHaulId;
  }
};

export const appState: Module<WcgopAppState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};

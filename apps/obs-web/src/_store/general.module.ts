
import router from '../router';

import Vue from 'vue';
import Vuex, { Module, ActionTree, MutationTree } from 'vuex';
import { RootState } from '@/_store/types/types';
import { GeneralState } from '@/_store/types/types';
import {
  roles,
  portDecoder
} from '@/_store/data';

Vue.use(Vuex);

export const state: GeneralState = {
  roles,
  portDecoder
};

export const general: Module<GeneralState, RootState> = {
    namespaced: true,
    state,
  };

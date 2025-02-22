<template>
  <q-page padding>
    <div class="q-gutter-md">
      <div v-for="r in vertButtonCount" class="row" :key="`md-r-${r}`">
        <div v-for="c in horizButtonCount" class="col self-center" :key="`md-c-${c}`">
          <!-- TODO: this should be in a TallyState -->
          <tally-btn
            :layout="getButton(r,c)"
            :data="getData(r,c)"
            @dataChanged="handleDataChanged"
            @blankClicked="handleBlankClicked"
          />
        </div>
      </div>
    </div>
    <q-banner rounded inline-actions v-show="!!alert.message" class="bg-green text-white">
      {{alert.message}}
      <template v-slot:action>
        <q-btn flat label="Dismiss" @click="clearAlert"/>
      </template>
    </q-banner>
    <div class="q-pa-md">
      <component
        v-bind:is="currentControlComponent"
        @controlevent="handleControlEvent"
        @cancel="handleCancel"
        @selectedReason="handleSelectedReason"
        :speciesCode="currentSelectedSpecies.shortCode"
      ></component>
    </div>
    <q-dialog v-model="confirmReset" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red" text-color="white"/>
          <span class="q-ml-sm">Are you sure you want to reset tally data?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup/>
          <q-btn flat label="Reset Data" color="primary" @click="handleResetAllData" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <boatnet-add-species-dialog
      ref="addNamedSpeciesModal"
      @addNewSpecies="handleAddNamedSpecies"
      :speciesList="speciesList"
      position="left"
      @cancel="handleCancel"
    />
    <tally-weights-dialog
      ref="addTallyWeightsModal"
      @addNewSpecies="handleAddNamedSpecies"
      :buttonData="currentSelectedButton"
      :speciesData="currentSelectedButton"
      @cancel="handleCancel"
    />
    <tally-history-dialog ref="historyModal" @cancel="handleCancel"/>
    <tally-pdf-dialog ref="pdfModal" @generatePdf="handleGeneratePdf" @cancel="handleCancel"/>
    <tally-template-dialog
      ref="templateModal"
      @cancel="handleCancel"
      @selectedDefaultTemplate="handleSelectedDefaultTemplate"
      :templateData="tallyDefaultTemplates"
    />

    <div>Mode: {{tallyMode}}</div>
  </q-page>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';

import { pouchService, pouchState, PouchDBState } from '@boatnet/bn-pouch';

import {
  TallyLayoutRecordTypeName,
  TallyTemplateRecordTypeName,
  TallySpeciesRecordTypeName,
  TallyDataRecordTypeName,
  TallyButtonLayoutData,
  TallyOperationMode,
  TallyCountData,
  TallyHistory,
  TallyLayoutRecord,
  TallyDataRecord
} from '../_store/types';

import BoatnetAddSpeciesDialog from '@boatnet/bn-common';

import TallyBtn from '../components/tally/TallyBtn.vue';
import TallyControls from '../components/tally/TallyControls.vue';
import TallyLayoutControls from '../components/tally/TallyLayoutControls.vue';
import TallyAllTalliesControls from '../components/tally/TallyAllTalliesControls.vue';
import TallyAddExistingControls from '../components/tally/TallyAddExistingControls.vue';
import TallyAddNewButton from '../components/tally/TallyAddNewButton.vue';

import { WcgopAppState } from '../_store/types';
import { TallyState } from '../_store/types';
import { AlertState } from '../_store/index';
import { Species } from '@boatnet/bn-models';
import TallyWeightsForDialog from '../components/tally/TallyWeightsForDialog.vue';
import TallyHistoryDialog from '../components/tally/TallyHistoryDialog.vue';
import TallyTemplateManagerDialog from '../components/tally/TallyTemplateManagerDialog.vue';
import TallyPDFOptionsDialogVue from '../components/tally/TallyPDFOptionsDialog.vue';

Vue.component('tally-btn', TallyBtn);
Vue.component('tally-controls', TallyControls);
Vue.component('tally-layout-controls', TallyLayoutControls);
Vue.component('tally-alltallies-controls', TallyAllTalliesControls);
Vue.component('tally-addexisting-controls', TallyAddExistingControls);
Vue.component('tally-addnew-controls', TallyAddNewButton);
Vue.component('tally-weights-dialog', TallyWeightsForDialog);
Vue.component('tally-history-dialog', TallyHistoryDialog);
Vue.component('tally-pdf-dialog', TallyPDFOptionsDialogVue);
Vue.component('tally-template-dialog', TallyTemplateManagerDialog);
Vue.component(BoatnetAddSpeciesDialog);

@Component({
  pouch: {
    tallyLayouts() {
      return {
        database: pouchService.userDBName,
        selector: { type: TallyLayoutRecordTypeName },
        sort: [{ createdDate: 'desc' }]
      };
    },
    tallyData() {
      return {
        database: pouchService.userDBName,
        selector: { type: TallyDataRecordTypeName },
        sort: [{ createdDate: 'desc' }]
      };
    }
  }
})
export default class Tally extends Vue {
  @State('alert') private alert!: AlertState;
  @State('appState') private appState!: WcgopAppState;
  @State('pouchState') private pouchState!: PouchDBState;
  @State('tallyState') private tallyState!: TallyState;

  @Action('success', { namespace: 'alert' }) private successAlert: any;
  @Action('clear', { namespace: 'alert' }) private clearAlert: any;
  @Action('setSpeciesList', { namespace: 'pdfState' })
  private setSpeciesList: any;
  @Action('setData', { namespace: 'pdfState' }) private setData: any;
  @Action('generatePdf', { namespace: 'pdfState' }) private generatePdf: any;
  @Action('connectDB', { namespace: 'tallyState' }) private connectDB: any;
  @Action('updateButtonData', { namespace: 'tallyState' })
  private updateButtonData: any;
  @Action('reset', { namespace: 'tallyState' })
  private reset: any;
  @Action('setTallyIncDec', { namespace: 'tallyState' })
  private setTallyIncDec: any;
  @Action('setTallyOpMode', { namespace: 'tallyState' })
  private setTallyOpMode: any;
  @Action('setCurrentButtonIdx', { namespace: 'tallyState' })
  private setCurrentButtonIdx: any;
  @Action('setCurrentReason', { namespace: 'tallyState' })
  private setCurrentReason: any;
  @Action('incTempSpeciesCounter', { namespace: 'tallyState' })
  private incTempSpeciesCounter: any;
  @Action('resetTempSpeciesCounter', { namespace: 'tallyState' })
  private resetTempSpeciesCounter: any;
  @Action('assignNewButton', { namespace: 'tallyState' })
  private assignNewButton: any;
  @Action('swapButtons', { namespace: 'tallyState' })
  private swapButtons: any;
  @Action('deleteButton', { namespace: 'tallyState' })
  private deleteButton: any;
  @Action('reassignSpecies', { namespace: 'tallyState' })
  private reassignSpecies: any;
  @Action('setLastIncDecIndex', { namespace: 'tallyState' })
  private setLastIncDecIndex: any;
  @Action('clearLastIncDec', { namespace: 'tallyState' })
  private clearLastIncDec: any;
  @Action('addTallyHistory', { namespace: 'tallyState' })
  private addTallyHistory: any;
  @Action('setDefaultLayout', { namespace: 'tallyState' })
  private setDefaultLayout: any;

  @Getter('vertButtonCount', { namespace: 'tallyState' })
  private vertButtonCount!: number;
  @Getter('horizButtonCount', { namespace: 'tallyState' })
  private horizButtonCount!: number;
  @Getter('tallyMode', { namespace: 'tallyState' })
  private tallyMode!: TallyOperationMode;
  @Getter('currentReason', { namespace: 'tallyState' })
  private currentReason!: string;
  @Getter('tempCounter', { namespace: 'tallyState' })
  private tempCounter!: string;
  @Getter('currentTempName', { namespace: 'tallyState' })
  private currentTempName!: string;
  @Getter('incDecValue', { namespace: 'tallyState' })
  private incDecValue!: number;
  @Getter('currentTallyHistory', { namespace: 'tallyState' })
  private currentTallyHistory!: History[];
  @Getter('allTallyData', { namespace: 'tallyState' })
  private allTallyData!: TallyCountData[];

  private btnLabel = '';

  private currentControlComponent = 'tally-controls';

  private confirmReset = false;

  private currentSelectedSpecies: any = { shortCode: '' }; // TODO actual species type, move to vuex?

  private currentSelectedButton: any = {};

  private speciesList = [];
  private tallyDefaultTemplates = [];

  private isAddSpeciesDialogOpen = false;

  // Reactive rows from PouchDB
  private tallyLayouts!: any;
  private tallyData!: any;

  constructor() {
    super();

    this.setTallyOpMode(TallyOperationMode.Tally);
    this.populateSpeciesView(); // TODO consider use live pouch-vue view
    this.populateSpeciesShortList();
    this.populateTallyTemplatesView();
  }

  /**
   * TODO: If this is called before the initial sync, or a record is added later, the page needs to reload.
   * Review alternative methods or checks to reload (or reactive pouch-vue style, if performance allows)
   */
  public async populateSpeciesView() {
    const db = pouchService.db;
    const queryOptions = {
      include_docs: true
    };

    const species = await db.query(
      pouchService.lookupsDBName,
      'optecs_trawl/all_tally_species',
      queryOptions
    );

    this.speciesList = species.rows;
  }

  public async populateSpeciesShortList() {
    const db = pouchService.db;
    const speciesShort = await db.query(
      pouchService.lookupsDBName,
      'optecs_trawl/all_tally_species'
    );
    this.setSpeciesList(speciesShort.rows);
  }

  public async populateTallyTemplatesView() {
    const db = pouchService.db;
    const queryOptions = {
      include_docs: true,
      ascending: true
    };

    const templates = await db.query(
      pouchService.lookupsDBName,
      'optecs_trawl/tally_templates',
      queryOptions
    );

    this.tallyDefaultTemplates = templates.rows;
  }

  public handleDataChanged(data: any) {
    switch (this.tallyMode) {
      case TallyOperationMode.DeleteButtonSelect:
        this.setTallyOpMode(TallyOperationMode.Tally);
        this.deleteButton(data.button);
        return;
      case TallyOperationMode.MoveButtonSelect:
        this.currentSelectedButton = data.button;
        this.setCurrentButtonIdx(data.button.index);
        this.setTallyOpMode(TallyOperationMode.MoveSelectLocation);
        return;
      case TallyOperationMode.MoveSelectLocation:
        this.swapButtons({
          oldButton: this.currentSelectedButton,
          newIndex: data.button.index
        });
        this.setTallyOpMode(TallyOperationMode.Tally);
        return;
      case TallyOperationMode.AddExistingSpeciesSelectSpecies:
        this.currentSelectedButton = data.button;
        this.setCurrentButtonIdx(data.button.index);
        this.currentSelectedSpecies = {
          shortCode: data.button.labels.shortCode // TODO Full LOOKUP
        };
        this.handleControlEvent('select-exist-species');
        return;
      case TallyOperationMode.NameTempSpeciesSelect:
        if (data.button.labels.shortCode.startsWith('(TEMP')) {
          this.currentSelectedSpecies = {
            shortCode: data.button.labels.shortCode
          };
          this.handleControlEvent('rename-temp-species');
        }
        return;
      case TallyOperationMode.ModifyDispButtonSelect:
        this.currentSelectedButton = data.button;
        this.currentSelectedSpecies = {
          shortCode: data.button.labels.shortCode
        }; // TODO full species?
        this.setCurrentButtonIdx(data.button.index);
        this.setTallyOpMode(TallyOperationMode.ModifyDispSelectDisp);
        this.handleControlEvent('tally-addnew-controls');
        return;
      case TallyOperationMode.AllTalliesSelectSpecies:
        this.currentSelectedButton = data.button;
        this.currentSelectedSpecies = {
          shortCode: data.button.labels.shortCode
        }; // TODO full species?
        this.handleControlEvent('all-tallies');
        return;
      case TallyOperationMode.WeightsForSelectSpecies:
        this.currentSelectedButton = data.button;
        this.setCurrentButtonIdx(data.button.index);
        this.currentSelectedSpecies = {
          shortCode: data.button.labels.shortCode
        }; // TODO full species?
        this.setTallyOpMode(TallyOperationMode.WeightsForAddingWeight);
        this.openAddWeightsDialog();
        return;
    }

    data = {
      ...data,
      skipLayoutUpdate: true
    };
    this.setLastIncDecIndex(data.button.index);
    this.updateButtonData(data);
  }

  /**
   * handleBlankClicked: depending on state, assign or move a button
   */
  public handleBlankClicked(button: TallyButtonLayoutData) {
    if (this.tallyMode === TallyOperationMode.AddNamedSpeciesSelectLocation) {
      this.assignNewButton({
        species: this.currentSelectedSpecies,
        reason: this.currentReason,
        index: button.index
      });
      this.setTallyOpMode(TallyOperationMode.AddNamedSpeciesSelectType);
    } else if (this.tallyMode === TallyOperationMode.MoveSelectLocation) {
      this.swapButtons({
        oldButton: this.currentSelectedButton,
        newIndex: button.index
      });
      this.setTallyOpMode(TallyOperationMode.Tally);
    } else if (
      this.tallyMode === TallyOperationMode.AddExistingSpeciesSelectLocation
    ) {
      this.assignNewButton({
        species: { shortCode: this.currentSelectedButton.labels.shortCode }, // TODO Species full rec?
        reason: this.currentReason,
        index: button.index
      });
      this.setCurrentReason('');
      this.setTallyOpMode(TallyOperationMode.AddExistingSpeciesSelectReason);
    } else if (this.tallyMode === TallyOperationMode.AddTempSpeciesLocation) {
      this.assignNewButton({
        species: { shortCode: this.currentTempName },
        reason: this.currentReason,
        index: button.index
      });
      this.setCurrentReason('');
      this.setTallyOpMode(TallyOperationMode.AddTempSpeciesReason);
    }
  }

  public handleSelectedReason(reason: string) {
    this.setCurrentReason(reason);
    if (this.tallyMode === TallyOperationMode.AddNamedSpeciesSelectType) {
      this.setTallyOpMode(TallyOperationMode.AddNamedSpeciesSelectLocation);
    } else if (
      this.tallyMode === TallyOperationMode.AddExistingSpeciesSelectReason
    ) {
      this.setTallyOpMode(TallyOperationMode.AddExistingSpeciesSelectLocation);
    } else if (this.tallyMode === TallyOperationMode.AddTempSpeciesReason) {
      this.setTallyOpMode(TallyOperationMode.AddTempSpeciesLocation);
    } else if (this.tallyMode === TallyOperationMode.ModifyDispSelectDisp) {
      this.assignNewButton({
        species: { shortCode: this.currentSelectedButton.labels.shortCode }, // TODO full species?
        reason,
        index: this.currentSelectedButton.index
      });
      // Return to tally mode
      this.handleCancel();
    }
  }

  public closeAddSpeciesPopup() {
    (this.$refs.addNamedSpeciesModal as any).close();
    // TODO cleaner way to do this? (calling member of component)
  }

  public openAddSpeciesPopup() {
    (this.$refs.addNamedSpeciesModal as any).open();
  }

  public openHistoryPopup() {
    (this.$refs.historyModal as any).open();
  }

  public openPdfPopup() {
    (this.$refs.pdfModal as any).open();
  }

  public handleGeneratePdf(config: any) {
    this.setData({
      tripId: config.tripId,
      haulId: config.haulId,
      catchId: config.catchId
    });
    this.generatePdf(this.allTallyData);
  }

  public openTemplateManagerPopup() {
    (this.$refs.templateModal as any).open();
    // TODO cleaner way to do this? (calling member of component)
  }

  public closeAddWeightsDialog() {
    (this.$refs.addTallyWeightsModal as any).close();
    // TODO cleaner way to do this? (calling member of component)
  }

  public openAddWeightsDialog() {
    (this.$refs.addTallyWeightsModal as any).open();
    // TODO cleaner way to do this? (calling member of component)
  }

  public handleAddNamedSpecies(species: any) {
    // console.log('MODE', this.tallyMode);
    // console.log('SPECIES', species);
    switch (this.tallyMode) {
      case TallyOperationMode.AddNamedSpeciesSelectSpecies:
        // Side effect of close: switches back to tally mode
        this.closeAddSpeciesPopup();
        this.currentSelectedSpecies = species;
        this.setTallyOpMode(TallyOperationMode.AddNamedSpeciesSelectType);
        this.handleControlEvent('tally-addnew-controls');
        break;
      case TallyOperationMode.NameTempSpeciesSelectSpecies:
        this.reassignSpecies({
          oldSpeciesCode: this.currentSelectedSpecies.shortCode,
          newSpeciesCode: species.shortCode
        });
        const renameHistory: TallyHistory = {
          type: 'Rename',
          oldValue: this.currentSelectedSpecies.shortCode,
          newValue: species.shortCode
        };
        this.addTallyHistory(renameHistory);
        // Side effect of close: switches back to tally mode
        this.closeAddSpeciesPopup();
        break;
    }
  }

  public handleSelectedDefaultTemplate(template: TallyLayoutRecord) {
    this.setDefaultLayout(template);
    this.successAlert(
      'To use "' +
        template.description +
        '" template, click Reset Data (in Modify Layout)'
    );
  }

  public handleResetAllData() {
    this.reset();
    this.handleCancel();
  }

  public handleCancel() {
    // Generic Cancel - return to tally mode
    // TODO refactor into setTallyMode
    this.currentSelectedSpecies = {};
    this.setCurrentReason('');
    this.setCurrentButtonIdx(-1);
    this.currentSelectedButton = {};
    this.setTallyOpMode(TallyOperationMode.Tally);
    this.handleControlEvent('tally-mode');
  }

  public handleControlEvent(controlName: string) {
    switch (controlName) {
      case 'modify-layout':
        this.currentControlComponent = 'tally-layout-controls';
        this.clearLastIncDec();
        break;
      case 'modify-layout-done':
      case 'all-tallies-done':
      case 'tally-mode':
        this.setTallyOpMode(TallyOperationMode.Tally);
        this.currentControlComponent = 'tally-controls';
        break;
      case 'all-tallies-for':
        this.clearLastIncDec();
        if (
          this.tallyState.operationMode ===
          TallyOperationMode.AllTalliesSelectSpecies
        ) {
          this.handleCancel();
        } else {
          this.setTallyOpMode(TallyOperationMode.AllTalliesSelectSpecies);
        }
        break;
      case 'all-tallies':
        this.setTallyOpMode(TallyOperationMode.AllTallies);
        this.currentControlComponent = 'tally-alltallies-controls';
        break;
      case 'weights-for':
        this.clearLastIncDec();
        if (
          this.tallyState.operationMode ===
          TallyOperationMode.WeightsForSelectSpecies
        ) {
          this.handleCancel();
        } else {
          this.setTallyOpMode(TallyOperationMode.WeightsForSelectSpecies);
        }
        break;
      case 'tally-addnew-controls':
        this.currentControlComponent = 'tally-addnew-controls';
        break;
      case 'delete-button':
        this.setTallyOpMode(TallyOperationMode.DeleteButtonSelect);
        break;
      case 'move-button':
        this.setTallyOpMode(TallyOperationMode.MoveButtonSelect);
        break;
      case 'modify-disp':
        this.setTallyOpMode(TallyOperationMode.ModifyDispButtonSelect);
        break;
      case 'add-exist':
        this.setCurrentReason('');
        this.setTallyOpMode(TallyOperationMode.AddExistingSpeciesSelectSpecies);
        break;
      case 'add-temp-button':
        this.incTempSpeciesCounter();
        this.currentSelectedSpecies = {
          shortCode: this.currentTempName
        };
        this.setTallyOpMode(TallyOperationMode.AddTempSpeciesReason);
        this.currentControlComponent = 'tally-addexisting-controls';
        break;
      case 'select-exist-species':
        this.setTallyOpMode(TallyOperationMode.AddExistingSpeciesSelectReason);
        this.currentControlComponent = 'tally-addexisting-controls';
        break;
      case 'name-temp-button':
        this.setTallyOpMode(TallyOperationMode.NameTempSpeciesSelect);
        break;
      case 'reset-data':
        this.confirmReset = true;
        break;
      case 'tally-inc':
        this.setTallyIncDec(1);
        break;
      case 'tally-dec':
        this.setTallyIncDec(-1);
        break;
      case 'add-named-species':
        this.setTallyOpMode(TallyOperationMode.AddNamedSpeciesSelectSpecies);
        this.openAddSpeciesPopup();
        break;
      case 'history':
        this.openHistoryPopup();
        break;
      case 'generate-pdf':
        this.openPdfPopup();
        // this.handleGeneratePdf();
        break;
      case 'template-manager':
        this.openTemplateManagerPopup();
        break;
      case 'rename-temp-species':
        this.setTallyOpMode(TallyOperationMode.NameTempSpeciesSelectSpecies);
        this.openAddSpeciesPopup();
        break;
      default:
        console.log('Unhandled tally control event:', controlName);
        this.currentControlComponent = 'tally-controls';
        break;
    }
  }

  private getBtnIndex(row: number, column: number) {
    // Fixes weird 1-based v-for loops
    return column + (row - 1) * this.horizButtonCount - 1;
  }
  private getButton(row: number, column: number): TallyButtonLayoutData {
    const idx = this.getBtnIndex(row, column);
    if (
      !this.tallyState.tallyLayout
      //  TODO || !this.tallyState.tallyDataRec
    ) {
      return {
        index: idx,
        labels: { shortCode: '??', reason: '??' }
      };
      // temp fake data - indication that something is broken
    }

    return this.tallyState.tallyLayout.layoutData[idx];
  }

  private getData(row: number, column: number): TallyCountData {
    const idx = this.getBtnIndex(row, column);
    // return this.tallyState.tallyLayout.layoutData[idx];

    const targetButton = this.tallyState.tallyLayout.layoutData[idx];

    if (
      !targetButton ||
      !targetButton.labels ||
      !targetButton.labels.shortCode ||
      !this.tallyState.tallyDataRec
    ) {
      return { count: -1 };
    }
    const targetData = this.tallyState.tallyDataRec.data!.filter(
      (rec: TallyCountData) => {
        return (
          rec.shortCode === targetButton.labels!.shortCode &&
          rec.reason === targetButton.labels!.reason
        );
      }
    );
    if (targetData) {
      return targetData[0];
    } else {
      return { count: -1 };
    }
  }

  // --- Private Methods ---
  private mounted() {
    this.connectDB();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped></style>

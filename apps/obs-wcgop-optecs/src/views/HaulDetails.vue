<template>
  <q-page padding>
    <boatnet-tab-panel :size="4">
      <template v-slot:title1>
        <div class="text-h5 row justify-center">Haul #{{haulNum}} Info Part 1</div>
      </template>
      <template v-slot:content1>
        <div class="q-col-gutter-md row">
          <div class="col q-col-gutter-md">
            <div>
              <b>Biolist:</b>2
            </div>
            <boatnet-button-toggle
              title="Beaufort Scale:"
              :value.sync="currentHaul.beaufortValue"
              :options="beaufortOptions"
              :description="beaufortLookupVals[currentHaul.beaufortValue] ? beaufortLookupVals[currentHaul.beaufortValue].value : ''"
              @save="saveChanges"
            />
            <boatnet-button-toggle
              title="Gear Type:"
              :value.sync="currentHaul.gearType"
              :options="gearTypeOptions"
              :description="gearTypeLookupVals[currentHaul.gearType] ? gearTypeLookupVals[currentHaul.gearType].value : ''"
              @save="saveChanges"
            />

            <boatnet-button-toggle
              title="BRD Present?"
              :value.sync="currentHaul.legacy.isBrdPresent"
              :options="[
                {label: 'Y', value: true},
                {label: 'N', value: false}
                ]"
              @save="saveChanges"
            />
            <boatnet-button-toggle
              title="EFP?"
              :value.sync="currentHaul.isEfpUsed"
              :options="[
                {label: 'Y', value: true},
                {label: 'N', value: false}
                ]"
              @save="saveChanges"
            />
            <div>
              <boatnet-keyboard-select
                :value.sync="currentHaul.targetStrategy"
                label="Target Strategy"
                keyboardType="normal"
                :options="options"
                @filter="filterSpecies"
                @save="saveChanges"
              />
            </div>
          </div>
          <div class="col q-col-gutter-md"></div>
        </div>
      </template>
      <template v-slot:title2>
        <div class="text-h5 row justify-center">Haul #{{haulNum}} Gear Info</div>
      </template>
      <template v-slot:content2>
        <div class="q-col-gutter-md row q-pt-md">
          <div class="col q-col-gutter-md">
            <boatnet-keyboard-input
              :value.sync="currentHaul.totalHook"
              label="Total Hooks"
              keyboardType="numeric"
              @save="saveChanges"
            />
            <boatnet-keyboard-input
              :value.sync="currentHaul.totalHooksLost"
              label="Total Hooks Lost"
              keyboardType="numeric"
              @save="saveChanges"
            />
            <boatnet-keyboard-input
              :value.sync="currentHaul.totalGearSegments"
              label="Total Gear Segments"
              keyboardType="numeric"
              @save="saveChanges"
            />
            <boatnet-keyboard-input
              :value.sync="currentHaul.gearSegmentsLost"
              label="Total Gear Segments Lost"
              keyboardType="numeric"
              @save="saveChanges"
            />
            <boatnet-keyboard-input
              :value.sync="currentHaul.hooksSampled"
              label="Hooks Sampled"
              keyboardType="numeric"
              @save="saveChanges"
            />
            <boatnet-keyboard-input
              :value.sync="currentHaul.avgNumHooksPerSegment"
              label="Avg # of hooks per segment"
              keyboardType="numeric"
              @save="saveChanges"
            />

            <boatnet-button-toggle
              title="Is deterrent used?"
              :value.sync="currentHaul.isDeterrentUsed"
              :options="[
                {label: 'Y', value: true},
                {label: 'N', value: false}
                ]"
              @save="saveChanges"
            />
          </div>
          <div class="col q-col-gutter-md">
            <boatnet-keyboard-input
              :value.sync="currentHaul.avgSetSpeed"
              label="Avg set speed"
              keyboardType="numeric"
              @save="saveChanges"
            />

            <boatnet-button-toggle
              title="Floats Used?"
              :value.sync="currentHaul.floatsUsed"
              :options="[
                {label: 'Y', value: true},
                {label: 'N', value: false}
                ]"
              @save="saveChanges"
            />
            <boatnet-keyboard-input
              :value.sync="currentHaul.floatsPerSegment"
              label="Float per segment"
              keyboardType="numeric"
              @save="saveChanges"
            />

            <boatnet-button-toggle
              title="Sinkers Used?"
              :value.sync="currentHaul.floatsPerSegment"
              :options="[
                {label: 'Y', value: true},
                {label: 'N', value: false}
                ]"
              @save="saveChanges"
            />
            <boatnet-keyboard-input
              :value.sync="currentHaul.weightPerSinker"
              label="Weight per sinker"
              keyboardType="numeric"
              @save="saveChanges"
            />
            <boatnet-keyboard-input
              :value.sync="currentHaul.avgNumSinkersPerSegment"
              label="Avg # sinkers per segment"
              keyboardType="numeric"
              @save="saveChanges"
            />
          </div>
        </div>
      </template>
      <template v-slot:title3>
        <div class="text-h5 row justify-center">Haul #{{haulNum}} Info Part 2</div>
      </template>
      <template v-slot:content3>
        <div class="q-col-gutter-md row">
          <div class="col q-col-gutter-md">
            <div>
              <b>Biolist:</b>2
            </div>
            <boatnet-button-toggle
              title="Weight Calib"
              :value.sync="currentHaul.calWeight"
              :options="[
                {label: '11.00', value: '11.00'},
                {label: '11.05', value: '11.05'},
                {label: 'Scale Not Used', value: 'NA'}
                ]"
              @save="saveChanges"
            />
            <boatnet-button-toggle
              title="Gear Performance"
              :value.sync="currentHaul.gearPerformance"
              :options="gearPerformanceOptions"
              :description="gearPerformanceLookupVals[currentHaul.gearPerformance] ? gearPerformanceLookupVals[currentHaul.gearPerformance].value : ''"
              @save="saveChanges"
            />
            <boatnet-button-toggle
              title="OTC Weight Method"
              :value.sync="currentHaul.observerTotalCatch.weightMethod.description"
              :options="[
                {label: '14', value: '14'},
                {label: '6', value: '6'}
                ]"
              @save="saveChanges"
            />
            <boatnet-keyboard-input
              :value.sync="currentHaul.observerTotalCatch.measurement.value"
              label="Visual OTC"
              keyboardType="numeric"
              @save="saveChanges"
            />
            <boatnet-keyboard-input
              :value.sync="currentHaul.fit"
              label="Fit #"
              keyboardType="numeric"
              @save="saveChanges"
            />
          </div>
          <div class="col q-col-gutter-md"></div>
        </div>
      </template>
      <template v-slot:title4>
        <div class="text-h5 row justify-center">Locations</div>
      </template>
      <template v-slot:content4>
        <div class="q-col-gutter-md q-pt-md">
          <boatnet-locations :locations.sync="currentHaul.locations" @save="saveChanges"/>
        </div>
      </template>
    </boatnet-tab-panel>
  </q-page>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ListOptions } from 'davenport';
import { WcgopTrip, WcgopOperation } from '@boatnet/bn-models';
import { pouchService } from '@boatnet/bn-pouch';
import { Action, Getter } from 'vuex-class';

import moment from 'moment';

@Component
export default class Trips extends Vue {
  @Prop(Number) private haulNum!: number; // Passed by router
  private tab!: string; // Current tab (start or end)

  @Getter('currentHaul', { namespace: 'appState' })
  private currentHaulState!: WcgopOperation;
  @Action('setCurrentHaul', { namespace: 'appState' })
  private setCurrentHaul: any;

  @Getter('currentTrip', { namespace: 'appState' })
  private currentTrip!: WcgopTrip;

  @Action('save', { namespace: 'appState' })
  private save: any;

  private currentHaul: WcgopOperation = {
    operationNum: this.haulNum,
    type: 'wcgop-operation',
    observerTotalCatch: {
      measurement: {},
      weightMethod: {}
    },
    legacy: {}
  };
  private speciesList: string[] = [];

  private beaufortLookupVals: any[] = [];
  private beaufortOptions: any[] = [];

  private gearPerformanceLookupVals: any[] = [];
  private gearPerformanceOptions: any[] = [];

  private gearTypeLookupVals: any[] = [];
  private gearTypeOptions: any[] = [];

  private options: string[] = [];

  constructor() {
    super();
  }

  private async created() {
    if (this.currentHaulState._id) {
      try {
        this.currentHaul = await pouchService.db.get(
          pouchService.userDBName,
          this.currentHaulState._id
        );
      } catch (err) {
        console.log('could not find haul in database ' + err);
      }
    } else {
      try {
        await pouchService.db
          .post(pouchService.userDBName, this.currentHaul)
          .then((response: any) => {
            this.currentHaul._id = response.id;
            this.currentHaul._rev = response.rev;
          });
        this.setCurrentHaul(this.currentHaul);
        this.addHaulIdToTrips();
      } catch (err) {
        console.log(
          'Haul ' +
            this.currentHaul.operationNum +
            ' was not added to the database'
        );
      }
    }

    this.beaufortLookupVals = await this.getLookupVals(
      'optecs_trawl/all_beaufort_description'
    );
    this.beaufortOptions = this.getOptions(this.beaufortLookupVals);

    this.gearPerformanceLookupVals = await this.getLookupVals(
      'optecs_trawl/all_gear_performance_description'
    );
    this.gearPerformanceOptions = this.getOptions(
      this.gearPerformanceLookupVals
    );

    let gearLookUpTable: string;
    if (this.currentTrip.gearType && this.currentTrip.gearType === 'fixed') {
      gearLookUpTable = 'all_gear_type_fixed_gear';
    } else {
      gearLookUpTable = 'all_gear_type_trawl';
    }
    this.gearTypeLookupVals = await this.getLookupVals(
      'optecs_trawl/' + gearLookUpTable
    );
    this.gearTypeOptions = this.getOptions(this.gearTypeLookupVals);
    this.populateSpeciesList();
  }

  private addHaulIdToTrips() {
    if (this.currentTrip.operationIDs && this.currentHaul._id) {
      this.currentTrip.operationIDs = this.currentTrip.operationIDs.concat(
        this.currentHaul._id
      );
    } else if (this.currentHaul._id) {
      this.currentTrip.operationIDs = [this.currentHaul._id];
    }
    this.save(this.currentTrip);
  }

  private async getLookupVals(tableName: string) {
    let lookupVals;
    try {
      const descriptions = await pouchService.db.query(
        pouchService.lookupsDBName,
        tableName
      );
      lookupVals = descriptions.rows.map((row: any) => row);
      lookupVals.sort(this.sorter);
      return lookupVals.reduce(this.reducer, {});
    } catch (err) {
      console.log(err.message);
    }
  }

  private getOptions(lookups: any): any[] {
    const optionsHolder = [];
    for (const lookup of Object.keys(lookups)) {
      optionsHolder.push({ label: lookup, value: lookup });
    }
    return optionsHolder;
  }

  private sorter(a: any, b: any) {
    return a.key - b.key;
  }

  private reducer(accum: any, curr: any) {
    const lookup = 'key';
    accum[curr[lookup]] = curr;
    return accum;
  }

  private async populateSpeciesList() {
    const species = await pouchService.db.query(
      pouchService.lookupsDBName,
      'optecs_trawl/all_tally_species'
    );

    this.speciesList = species.rows;
  }

  private async filterSpecies(val: string, update: any, abort: any) {
    update(async () => {
      const valUpper = val.toUpperCase();
      this.options = this.speciesList
        .filter((s: any) => {
          return (
            s.key.startsWith(valUpper) ||
            s.value.commonName.toUpperCase().indexOf(valUpper) > -1
          );
        })
        .map((s: any) => {
          return {
            label: s.key + ': ' + s.value.commonName,
            ...s
          };
        });
    });
  }

  private saveChanges() {
    this.save(this.currentHaul);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

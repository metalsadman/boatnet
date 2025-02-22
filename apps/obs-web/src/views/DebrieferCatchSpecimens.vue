<template>
  <div>
    <div class="text-h6">Specimens</div>
    <q-table
      :data="WcgopCatchSpecimens"
      :columns="catchSpecimensColumns"
      dense
      row-key="id"
      :pagination.sync="pagination"
      :visible-columns="visibleCatchSpecimensColumns"
    >
      <template v-slot:top="props">
        <div v-if="$q.screen.gt.xs" class="col">
          <q-select
            outlined
            v-model="visibleCatchSpecimensColumns"
            multiple
            :options="catchSpecimensColumns"
            label="Visible Columns"
            style="width: 270px"
            option-label="label"
            option-value="name"
            emit-value
            :display-value="null"
          >
            <template v-slot:append>
              <q-btn
                round
                dense
                flat
                style="font-size: .5em"
                icon="fa fa-plus-circle"
                @click="addAll"
              />
              <q-btn
                round
                dense
                flat
                style="font-size: .5em"
                icon="fa fa-minus-circle"
                @click="removeAll"
              />
            </template>

            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label v-html="scope.opt.label"/>
                </q-item-section>
                <q-item-section avatar v-if="scope.selected">
                  <q-icon name="fa fa-check-circle"/>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="key" :props="props">{{ props.row.key }}</q-td>
          <q-td key="tripKey" :props="props">{{ props.row.trip.key }}</q-td>
          <q-td key="tripStatus" :props="props">{{ props.row.trip.tripStatus.description }}</q-td>
          <q-td key="vessel" :props="props">{{ props.row.trip.vessel.vesselName }}</q-td>
          <q-td key="program" :props="props">{{ props.row.trip.program.name }}</q-td>
          <q-td key="departurePort" :props="props">{{ props.row.trip.departurePort.name }}</q-td>
          <q-td key="departureDate" :props="props">{{ formatDate(props.row.trip.departureDate) }}</q-td>
          <q-td key="returnPort" :props="props">{{ props.row.trip.returnPort.name }}</q-td>
          <q-td key="returnDate" :props="props">{{ formatDate(props.row.trip.returnDate) }}</q-td>
          <q-td key="captain" :props="props">{{ props.row.trip.captain }}</q-td>
          <q-td key="isPartialTrip" :props="props">{{ props.row.trip.isPartialTrip }}</q-td>
          <q-td key="fishingDays" :props="props">{{ props.row.trip.fishingDays }}</q-td>
          <q-td
            key="fishery"
            :props="props"
          >{{ props.row.trip.fishery ? props.row.trip.fishery.description :'' }}</q-td>
          <q-td key="crewSize" :props="props">{{ props.row.trip.crewSize }}</q-td>
          <q-td key="firstReceiver" :props="props">{{ props.row.trip.firstReceiver }}</q-td>
          <q-td key="isFishProcessed" :props="props">{{ props.row.trip.isFishProcessed }}</q-td>
          <q-td key="logbookNum" :props="props">{{ props.row.trip.logbookNum }}</q-td>
          <q-td key="logbookType" :props="props">{{ props.row.trip.logbookType }}</q-td>
          <q-td key="observerLogbookNum" :props="props">{{ props.row.trip.observerLogbookNum }}</q-td>
          <q-td key="debriefer" :props="props">{{ props.row.trip.debriefer }}</q-td>
          <q-td key="brd" :props="props">{{ props.row.trip.brd }}</q-td>
          <q-td key="hlfc" :props="props">{{ props.row.trip.hlfc }}</q-td>
          <q-td key="fishTickets" :props="props">{{ props.row.trip.fishTickets }}</q-td>
          <q-td key="certificates" :props="props">{{ props.row.trip.certificates }}</q-td>
          <q-td key="waiver" :props="props">{{ props.row.trip.waiver }}</q-td>
          <q-td key="intendedGearType" :props="props">{{ props.row.trip.intendedGearType }}</q-td>
          <q-td key="operationNum" :props="props">{{ props.row.operationNum }}</q-td>
          <q-td
            key="observerTotalCatch"
            :props="props"
          >{{ props.row.observerTotalCatch.measurement.value.toFixed(2) }}</q-td>
          <q-td key="gearType" :props="props">{{ props.row.gearType.description }}</q-td>
          <q-td key="gearPerformance" :props="props">{{ props.row.gearPerformance.description }}</q-td>
          <q-td key="targetStrategy" :props="props">{{ props.row.targetStrategy }}</q-td>
          <q-td key="isEfpUsed" :props="props">{{ props.row.isEfpUsed }}</q-td>
          <q-td key="calWeight" :props="props">{{ props.row.calWeight }}</q-td>
          <q-td key="fit" :props="props">{{ props.row.fit }}</q-td>
          <q-td key="isGearLost" :props="props">{{ props.row.isGearLost }}</q-td>
          <q-td key="isDataQualityPassing" :props="props">{{ props.row.isDataQualityPassing }}</q-td>
          <q-td key="beaufortValue" :props="props">{{ props.row.beaufortValue }}</q-td>
          <q-td key="isDeterrentUsed" :props="props">{{ props.row.isDeterrentUsed }}</q-td>
          <q-td key="excluderType" :props="props">{{ props.row.legacy.excluderType }}</q-td>
          <q-td key="avgSoakTime" :props="props">{{ props.row.avgSoakTime }}</q-td>
          <q-td key="totalHooks" :props="props">{{ props.row.totalHooks }}</q-td>
          <q-td key="totalHooksLost" :props="props">{{ props.row.totalHooksLost }}</q-td>
          <q-td key="totalGearSegments" :props="props">{{ props.row.totalGearSegments }}</q-td>
          <q-td key="gearSegmentsLost" :props="props">{{ props.row.gearSegmentsLost }}</q-td>
          <q-td key="hooksSampled" :props="props">{{ props.row.hooksSampled }}</q-td>
          <q-td key="catchNum" :props="props">{{ props.row.catch.catchNum }}</q-td>
          <q-td key="disposition" :props="props">{{ props.row.catch.disposition.description }}</q-td>
          <q-td
            key="catchWM"
            :props="props"
          >{{ nullDescriptionCheck(props.row.catch.weightMethod) }}</q-td>
          <q-td key="catchWeight" :props="props">{{ nullValueCheck(props.row.catch.weight,true) }}</q-td>
        </q-tr>
        <q-td key="biosampleMethod" :props="props">{{ props.row.catch.specimen.biosampleMethod }}</q-td>
        <q-td key="discardReason" :props="props">{{ props.row.catch.specimen.discardReason }}</q-td>
        <q-td key="isAdiposePresent" :props="props">{{ props.row.catch.specimen.isAdiposePresent }}</q-td>
        <q-td key="bandId" :props="props">{{ props.row.catch.specimen.bandId }}</q-td>
        <q-td key="cwtCode" :props="props">{{ props.row.catch.specimen.cwtCode }}</q-td>
        <q-td key="cwtStatus" :props="props">{{ props.row.catch.specimen.cwtStatus }}</q-td>
        <q-td key="cwtType" :props="props">{{ props.row.catch.specimen.cwtType }}</q-td>
      </template>
    </q-table>
  </div>
</template>


<script lang="ts">
import { mapState } from 'vuex';
import router from 'vue-router';
import { State, Action, Getter } from 'vuex-class';
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  TripState,
  PermitState,
  UserState,
  GeneralState,
  DebrieferState
} from '../_store/types/types';
import {
  WcgopTrip,
  WcgopOperation,
  WcgopCatch,
  WcgopSpecimen,
  Basket
} from '@boatnet/bn-models';
import { CouchDBCredentials, couchService } from '@boatnet/bn-couch';
import { Client, CouchDoc, ListOptions } from 'davenport';
import { date } from 'quasar';
import { convertToObject } from 'typescript';

@Component
export default class DebrieferOperations extends Vue {
  @Action('error', { namespace: 'alert' }) private error: any;
  @State('debriefer') private debriefer!: DebrieferState;

  private WcgopTrips: WcgopTrip[] = [];
  private WcgopOperations: WcgopOperation[] = [];
  private WcgopCatchSpecies: WcgopCatch[] = [];
  private pagination = { rowsPerPage: 50 };
  private WcgopCatchSpecimens: WcgopSpecimen[] = [];

  private visibleCatchSpecimensColumns = [
    'tripKey',
    'operationNum',
    'catchNum',
    'disposition',
    'catchWM',
    'catchWeight',
    'biosampleMethod',
    'discardReason',
    'isAdiposePresent',
    'bandId',
    'cwtCode',
    'cwtStatus',
    'cwtType'
  ];

  private catchSpecimensColumns = [
    {
      name: 'tripKey',
      label: 'Trip ID',
      field: 'tripKey',
      align: 'left',
      sortable: true
    },
    {
      name: 'tripStatus',
      label: 'Trip Status',
      field: 'tripStatus',
      align: 'left',
      sortable: true
    },
    {
      name: 'vessel',
      label: 'Vessel',
      field: 'vessel',
      align: 'left',
      sortable: true
    },
    {
      name: 'program',
      label: 'Program',
      field: 'program',
      align: 'left',
      sortable: true
    },
    {
      name: 'departurePort',
      label: 'Departure Port',
      field: 'departurePort',
      align: 'left',
      sortable: true
    },
    {
      name: 'departureDate',
      label: 'Departure Date',
      field: 'departureDate',
      align: 'left',
      sortable: true
    },
    {
      name: 'returnPort',
      label: 'Return Port',
      field: 'returnPort',
      align: 'left',
      sortable: true
    },
    {
      name: 'returnDate',
      label: 'Return Date',
      field: 'returnDate',
      align: 'left',
      sortable: true
    },
    {
      name: 'captain',
      label: 'Skipper',
      field: 'captain',
      align: 'left',
      sortable: true
    },
    {
      name: 'isPartialTrip',
      label: 'Partial Trip',
      field: 'isPartialTrip',
      align: 'left',
      sortable: true
    },
    {
      name: 'fishingDays',
      label: 'Fishing Days',
      field: 'fishingDays',
      align: 'left',
      sortable: true
    },
    {
      name: 'fishery',
      label: 'Fishery',
      field: 'fishery',
      align: 'left',
      sortable: true
    },
    {
      name: 'crewSize',
      label: 'Crew Size',
      field: 'crewSize',
      align: 'left',
      sortable: true
    },
    {
      name: 'firstReceiver',
      label: 'First Receiver',
      field: 'firstReceiver',
      align: 'left',
      sortable: true
    },
    {
      name: 'isFishProcessed',
      label: 'Fish Processed',
      field: 'isFishProcessed',
      align: 'left',
      sortable: true
    },
    {
      name: 'logbookNum',
      label: 'Logbook #',
      field: 'logbookNum',
      align: 'left',
      sortable: true
    },
    {
      name: 'logbookType',
      label: 'Logbook Type',
      field: 'logbookType',
      align: 'left',
      sortable: true
    },
    {
      name: 'observerLogbookNum',
      label: 'Observer Logbook',
      field: 'observerLogbookNum',
      align: 'left',
      sortable: true
    },
    {
      name: 'debriefer',
      label: 'Debriefer',
      field: 'debriefer',
      align: 'left',
      sortable: true
    },
    { name: 'brd', label: 'BRD', field: 'brd', align: 'left', sortable: true },
    {
      name: 'hlfc',
      label: 'HLFC',
      field: 'hlfc',
      align: 'left',
      sortable: true
    },
    {
      name: 'fishTickets',
      label: 'Fish Tickets',
      field: 'fishTickets',
      align: 'left',
      sortable: true
    },
    {
      name: 'certificates',
      label: 'Certificates',
      field: 'certificates',
      align: 'left',
      sortable: true
    },
    {
      name: 'waiver',
      label: 'Waiver',
      field: 'waiver',
      align: 'left',
      sortable: true
    },
    {
      name: 'intendedGearType',
      label: 'Intended Gear Type',
      field: 'intendedGearType',
      align: 'left',
      sortable: true
    },
    {
      name: 'operationNum',
      label: 'Haul #',
      field: 'operationNum',
      align: 'left',
      sortable: true
    },
    {
      name: 'observerTotalCatch',
      label: 'OTC',
      field: 'observerTotalCatch',
      align: 'left',
      sortable: true
    },
    {
      name: 'gearType',
      label: 'Gear Type',
      field: 'gearType',
      align: 'left',
      sortable: true
    },
    {
      name: 'gearPerformance',
      label: 'Gear Performance',
      field: 'gearPerformance',
      align: 'left',
      sortable: true
    },
    {
      name: 'targetStrategy',
      label: 'Target Strategy',
      field: 'targetStrategy',
      align: 'left',
      sortable: true
    },
    {
      name: 'isEfpUsed',
      label: 'EFP',
      field: 'isEfpUsed',
      align: 'left',
      sortable: true
    },
    {
      name: 'calWeight',
      label: 'CAL Weight',
      field: 'calWeight',
      align: 'left',
      sortable: true
    },
    { name: 'fit', label: 'Fit', field: 'fit', align: 'left', sortable: true },
    {
      name: 'isGearLost',
      label: 'Gear Lost',
      field: 'isGearLost',
      align: 'left',
      sortable: true
    },
    {
      name: 'isDataQualityPassing',
      label: 'DQ Passed',
      field: 'isDataQualityPassing',
      align: 'left',
      sortable: true
    },
    {
      name: 'beaufortValue',
      label: 'Beaufort',
      field: 'beaufortValue',
      align: 'left',
      sortable: true
    },
    {
      name: 'isDeterrentUsed',
      label: 'Deterrent Used',
      field: 'isDeterrentUsed',
      align: 'left',
      sortable: true
    },
    {
      name: 'avgSoakTime',
      label: 'Avg Soak Time',
      field: 'avgSoakTime',
      align: 'left',
      sortable: true
    },
    {
      name: 'totalHooks',
      label: 'Total Hooks',
      field: 'totalHooks',
      align: 'left',
      sortable: true
    },
    {
      name: 'totalHooksLost',
      label: 'Excluder',
      field: 'totalHooksLost',
      align: 'left',
      sortable: true
    },
    {
      name: 'totalGearSegments',
      label: 'Total Gear Segments',
      field: 'totalGearSegments',
      align: 'left',
      sortable: true
    },
    {
      name: 'gearSegmentsLost',
      label: 'Gear Segments Lost',
      field: 'gearSegmentsLost',
      align: 'left',
      sortable: true
    },
    {
      name: 'hooksSampled',
      label: 'Hooks Sampled',
      field: 'hooksSampled',
      align: 'left',
      sortable: true
    },
    {
      name: 'catchNum',
      label: 'Catch #',
      field: 'catchNum',
      align: 'left',
      sortable: true
    },
    {
      name: 'disposition',
      label: 'Catch Disposition',
      field: 'disposition',
      align: 'left',
      sortable: true
    },
    {
      name: 'catchWM',
      label: 'Catch WM',
      field: 'catchWM',
      align: 'left',
      sortable: true
    },
    {
      name: 'catchWeight',
      label: 'Catch Weight (lbs)',
      field: 'catchWeight',
      align: 'left',
      sortable: true
    },
    {
      name: 'biosampleMethod',
      label: 'Bio Sample Method',
      field: 'biosampleMethod',
      align: 'left',
      sortable: true
    },
    {
      name: 'discardReason',
      label: 'Specimen Discard Reason',
      field: 'discardReason',
      align: 'left',
      sortable: true
    },
    {
      name: 'isAdiposePresent',
      label: 'Adipose Present?',
      field: 'isAdiposePresent',
      align: 'left',
      sortable: true
    },
    {
      name: 'bandId',
      label: 'Band ID',
      field: 'bandId',
      align: 'left',
      sortable: true
    },
    {
      name: 'cwtCode',
      label: 'CWT Code',
      field: 'cwtCode',
      align: 'left',
      sortable: true
    },
    {
      name: 'cwtStatus',
      label: 'CWT Status',
      field: 'cwtStatus',
      align: 'left',
      sortable: true
    },
    {
      name: 'cwtType',
      label: 'CWT Type',
      field: 'cwtType',
      align: 'left',
      sortable: true
    }
  ];

  private async getCatchSpecimens() {
    const masterDB: Client<any> = couchService.masterDB;
    try {
      const options: ListOptions = {
        keys: Object.keys(this.debriefer.WcgopOperationTripDict)
      };

      const operations = await masterDB.viewWithDocs<any>(
        'MainDocs',
        'all-operations',
        options
      );

      for (const row of operations.rows) {
        const operation = row.doc;

        for (const catchRow of operation.catches) {
          if (catchRow.specimens != null) {
            for (const catchSpecimenRow of catchRow.specimens) {
              const opCatch = Object.assign({}, row.doc);
              opCatch.key = row.key;
              opCatch.trip = this.debriefer.WcgopOperationTripDict[
                operation._id
              ];
              opCatch.catch = catchRow;
              opCatch.catch.basket = catchSpecimenRow;
              this.WcgopCatchSpecimens.push(opCatch);
            }
          }
        }
      }

      console.log(this.WcgopCatchSpecimens);
    } catch (err) {
      this.error(err);
    }
  }

  private created() {
    this.getCatchSpecimens();
  }

  private formatDate(inputDate: any) {
    return date.formatDate(inputDate, 'MM/DD/YYYY');
  }

  private nullValueCheck(input: any, round: boolean) {
    if (input) {
      if (round) {
        return input.value.toFixed(2);
      } else {
        return input.value;
      }
    }

    return '';
  }

  private nullDescriptionCheck(input: any) {
    if (input != null) {
      return input.description;
    }

    return '';
  }

  private addAll() {
    this.visibleCatchSpecimensColumns = this.catchSpecimensColumns.map(
      (catchSpecimensColumns) => catchSpecimensColumns.name
    );
  }

  private removeAll() {
    this.visibleCatchSpecimensColumns = [];
  }
}
</script>
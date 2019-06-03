import { WcgopTrip, WcgopOperation, CouchID } from '@boatnet/bn-models';

// Root state for app store
export interface RootState {
  version: string;
}

export interface AlertState {
  type: string | null;
  message: string | null;
}

export interface PdfState {
  tripId?: string;
  haulId?: string;
  catchId?: string;
}

export interface WcgopAppState {
  currentTrip?: WcgopTrip;
  currentHaul?: WcgopOperation;
  isKeyboardEnabled?: boolean;
  isSoundEnabled?: boolean;
  currentFakeHaulId?: CouchID;
}

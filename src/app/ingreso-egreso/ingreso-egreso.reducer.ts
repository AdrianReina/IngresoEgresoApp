import * as fromIngresoEgreso from './ingreso-egreso.actions';
import { IngresoEgresoModel } from './ingreso-egreso.model';

export interface IngresoEgresoState {
  items: IngresoEgresoModel[];
}

const estadoInicial: IngresoEgresoState = {
  items: [],
};

export function ingresoEgresoReducer(
  state = estadoInicial,
  action: fromIngresoEgreso.acciones
): IngresoEgresoState {
  switch (action.type) {
    case fromIngresoEgreso.SET_ITEMS:
      return {
        items: [
          ...action.items.map((item) => {
            return { ...item };
          }),
        ],
      };

    case fromIngresoEgreso.UNSET_ITEMS:
      return {
        items: [],
      };

    default:
      return state;
  }
}

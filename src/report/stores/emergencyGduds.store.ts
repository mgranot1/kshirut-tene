// import { trackPromise } from "react-promise-tracker";
// import { atom, selector } from "recoil";
// import TsavIrgunService from "../../shared/services/tsavIrgunService/tsavIrgun.service";
// import { IOption } from "../../shared/types/general.types";

// export const emergencyGdudsAtom = atom<IOption[]>({
//   key: "emergencyGdudsAtom",
//   default: [],
// });

// export const emergencyGdudsState = selector<IOption[]>({
//   key: "emergencyGdudsState",
//   async get({ get, getCallback }) {
//     const emergencyGdudsAtomValue = get(emergencyGdudsAtom);

//     if (emergencyGdudsAtomValue.length <= 0) {
//       const emergencyGduds = await trackPromise(
//         TsavIrgunService.getEmergencyGduds()
//       );

//       getCallback(({ set }) => {
//         return () => {
//           set(emergencyGdudsAtom, emergencyGduds);
//         };
//       });

//       return emergencyGduds;
//     }

//     return emergencyGdudsAtomValue;
//   },
// });

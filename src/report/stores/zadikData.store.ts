// export const zadikDataState = atom<IZadikData[] | undefined>({
//   key: "zadikDataState",
//   default: ZadikDataService.getZadiksData(),
// });

// export const useResetZadiks = () => {
//   const setZadiks = useSetRecoilState(zadikDataState);

//   const reset = async () => {
//     const newZadiks = await trackPromise(ZadikDataService.getZadiksData());
//     setZadiks(newZadiks);
//   };

//   return reset;
// };

// export const getUpdatedZadikData = (
//   zadiks: IZadikData[],
//   equipmentNumber: IZadikData["equipment"],
//   updatedZadik: Partial<IZadikData>
// ): IZadikData[] => {
//   return zadiks.map((zadik: IZadikData) => {
//     if (zadik.equipment === equipmentNumber) {
//       return { ...zadik, ...updatedZadik, lastUpdateTimestamp: new Date() };
//     }
//     return zadik;
//   });
// };

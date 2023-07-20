import { createMxDB, prim, refTo, listOf } from "./MxDB";

const testClient: (typeof types)["Client"] = {} as any;
// testClient.tanks.add({});

const { types } = createMxDB({
  name: "SampleApp",
  // rootSchema: {},
  tableSchemas: {
    Client: {
      name: prim<string>(``),
      phone: prim<string>(``),
      address: prim<string>(``),
      notes: prim<string>(``),
      tanks: listOf(`Tank`),
    },
    Tank: {
      fuelType: refTo(`FuelType`),
      length: prim<number>(null),
      width: prim<number>(null),
      height: prim<number>(null),
    },
    FuelType: {
      name: prim<string>(``),
      rate: prim<number>(null),
    },
  },
});

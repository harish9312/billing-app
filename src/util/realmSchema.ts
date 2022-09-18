import Realm from "realm";
const Cat = {
  name: "customer",
  properties: {
    _id: "objectId",
    name: "string",
    data: "array",
  },
};
export const realm = async () =>
  await Realm.open({
    schema: [Cat],
  });

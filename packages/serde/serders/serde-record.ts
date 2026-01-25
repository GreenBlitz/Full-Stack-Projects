// בס"ד
import { BitArray, rangeArr } from "../BitArray";
import type {
  FieldsRecordSerde,
  RecordDeserializer,
  RecordSerializer,
  Serde,
} from "../types";

export const serdeOptionalFieldsRecord = <T>(
  fieldsSerde: FieldsRecordSerde<T>
): Serde<Record<string, T>> => ({
  serializer(serializedData: BitArray, data: Record<string, T>) {
    const fieldsSerializers = fieldsSerde.serializer;

    const fieldsExistenceArray = new BitArray();
    const serializedFields = new BitArray();

    Object.keys(fieldsSerializers).forEach((field) => {
      const fieldValue = data[field];
      if (!fieldValue) {
        fieldsExistenceArray.insertBool(false);
        return;
      }
      fieldsExistenceArray.insertBool(true);
      fieldsSerializers[field](serializedFields, fieldValue);
    });
    serializedData.insertBitArray(fieldsExistenceArray);
    serializedData.insertBitArray(serializedFields);
  },
  deserializer(serializedData: BitArray): Record<string, T> {
    const fieldsDeserializers = fieldsSerde.deserializer;

    function fieldsExistenceBitCount(
      fields: RecordSerializer<T> | RecordDeserializer<T>
    ): number {
      return Object.keys(fields).length;
    }

    const data: Record<string, T> = {};
    const fieldsExistence: boolean[] = Array.from(
      rangeArr(fieldsExistenceBitCount(fieldsDeserializers)).map(() =>
        serializedData.consumeBool()
      )
    );

    Object.keys(fieldsDeserializers).forEach((field, index) => {
      if (!fieldsExistence[index]) {
        return;
      }
      const fieldData = fieldsDeserializers[field](serializedData);
      Reflect.set(data, field, fieldData);
    });

    return data;
  },
});

export const serdeRecord = <T>(
  fieldsSerde: FieldsRecordSerde<T>
): Serde<Record<string, T>> => ({
  serializer(serializedData: BitArray, data: Record<string, T>) {
    const fieldsSerializers = fieldsSerde.serializer;
    Object.keys(fieldsSerializers).forEach((field) => {
      fieldsSerializers[field](serializedData, data[field]);
    });
  },
  deserializer(serializedData: BitArray): Record<string, T> {
    const fieldsDeserializers = fieldsSerde.deserializer;
    const data: Record<string, T> = {};
    Object.keys(fieldsDeserializers).forEach((field) => {
      const fieldData = fieldsDeserializers[field](serializedData);
      Reflect.set(data, field, fieldData);
    });
    return data;
  },
});

export const serdeRecordFieldsBuilder = (
  fieldNamesSerdes: Record<string, Serde<unknown>>
): FieldsRecordSerde<unknown> => {
  const recordSerde = { serializer: {}, deserializer: {} };
  Object.entries(fieldNamesSerdes).forEach(([fieldName, fieldSerde]) => {
    recordSerde.serializer[fieldName] = fieldSerde.serializer;
    recordSerde.deserializer[fieldName] = fieldSerde.deserializer;
  });
  return recordSerde;
};

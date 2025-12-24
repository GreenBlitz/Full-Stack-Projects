// בס"ד
import type { BitArray } from "./BitArray";

export type Serializer<T> = (seriailzedData: BitArray, data: T) => void;
// return field name, and its appropriate Serializer
export type RecordSerializer<T> = Record<string, Serializer<T>>;

// returns the deserializedData
export type Deserializer<T> = (serializedData: BitArray) => T;
// return field name, and its appropriate Deserializer
export type RecordDeserializer<T> = Record<string, Deserializer<T>>;

export interface FieldsRecordSerde<T> {
  serializer: RecordSerializer<T>;
  deserializer: RecordDeserializer<T>;
}
export interface Serde<T> {
  serializer: Serializer<T>;
  deserializer: Deserializer<T>;
}

// בס"ד
import type { BitArray } from "./BitArray";

export type Serializer<T> = (seriailzedData: BitArray, data: T) => void;
export type RecordSerializer<T> = Record<string, Serializer<T>>;

export type Deserializer<T> = (serializedData: BitArray) => T;
export type RecordDeserializer<T> = Record<string, Deserializer<T>>;

export interface FieldsRecordSerde<T> {
  serializer: RecordSerializer<T>;
  deserializer: RecordDeserializer<T>;
}
export interface Serde<T> {
  serializer: Serializer<T>;
  deserializer: Deserializer<T>;
}

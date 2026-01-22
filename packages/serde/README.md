# @repo/serde

A TypeScript serialization/deserialization library that provides efficient bit-level serialization for various data types. This package enables you to convert JavaScript/TypeScript objects into compact binary representations (`Uint8Array`) and back.

## Features

- **Bit-level serialization**: Efficient storage using bit arrays for optimal space usage
- **Type-safe**: Full TypeScript support with generic types
- **Composable**: Build complex serializers from simple primitives
- **Zero dependencies**: Lightweight implementation
- **Multiple data types**: Support for booleans, numbers, strings, arrays, records, and optional values

## Installation

This is a private package within the monorepo. Import it using:

```typescript
import {
  serialize,
  deserialize,
  serdeBool,
  serdeString /* ... */,
} from "@repo/serde";
```

All serializers are exported from the main package, so you can import everything you need from `@repo/serde`.

## Basic Usage

```typescript
import { serialize, deserialize, serdeBool } from "@repo/serde";

// Create a serializer/deserializer pair
const boolSerde = serdeBool();

// Serialize data
const data = true;
const serialized = serialize(boolSerde.serializer, data);
// Returns: Uint8Array

// Deserialize data
const deserialized = deserialize(boolSerde.deserializer, serialized);
// Returns: true
```

## API Reference

### Core Functions

#### `serialize<T>(serializer: Serializer<T>, data: T): Uint8Array`

Serializes data of type `T` into a `Uint8Array` using the provided serializer.

#### `deserialize<T>(deserializer: Deserializer<T>, serializedData: Uint8Array): T`

Deserializes a `Uint8Array` back into data of type `T` using the provided deserializer.

### Type Definitions

#### `Serde<T>`

A pair of serializer and deserializer for type `T`:

```typescript
interface Serde<T> {
  serializer: Serializer<T>;
  deserializer: Deserializer<T>;
}
```

#### `Serializer<T>`

A function that writes data of type `T` into a `BitArray`.

#### `Deserializer<T>`

A function that reads data of type `T` from a `BitArray`.

## Available Serializers

### Boolean

```typescript
import { serdeBool } from "@repo/serde";

const boolSerde = serdeBool();
// Serde<boolean>
```

### Numbers

```typescript
import {
  serdeUnsignedInt,
  serdeSignedInt,
  serdeStringifiedNum,
} from "@repo/serde";

// Unsigned integer (specify bit count)
const unsignedSerde = serdeUnsignedInt(16); // 16-bit unsigned integer
// Serde<number>

// Signed integer (specify bit count)
const signedSerde = serdeSignedInt(16); // 16-bit signed integer
// Serde<number>

// Stringified number
const stringifiedSerde = serdeStringifiedNum(16);
// Serde<string>
```

### Strings

```typescript
import { serdeString, serdeEnumedString } from "@repo/serde";

// Regular string
const stringSerde = serdeString();
// Serde<string>

// Enum string (more efficient for fixed set of values)
const enumSerde = serdeEnumedString(["option1", "option2", "option3"] as const);
// Serde<"option1" | "option2" | "option3">
```

### Arrays

```typescript
import { serdeArray, serdeStringifiedArray, serdeBool } from "@repo/serde";

// Array of items
const arraySerde = serdeArray(serdeBool(), 12); // 12 bits for length
// Serde<boolean[]>

// Stringified array (serializes JSON string as array)
const stringifiedArraySerde = serdeStringifiedArray(serdeBool());
// Serde<string>
```

### Records/Objects

```typescript
import {
  serdeRecord,
  serdeOptionalFieldsRecord,
  serdeRecordFieldsBuilder,
  serdeString,
  serdeUnsignedInt,
} from "@repo/serde";

// Build record serializer from field serializers
const recordSerde = serdeRecordFieldsBuilder({
  name: serdeString(),
  age: serdeUnsignedInt(8),
});

// Required fields record
const requiredRecordSerde = serdeRecord(recordSerde);
// Serde<Record<string, unknown>>

// Optional fields record
const optionalRecordSerde = serdeOptionalFieldsRecord(recordSerde);
// Serde<Record<string, unknown>>
```

### Optional Values

```typescript
import { serdeOptional, serdeString } from "@repo/serde";

const optionalStringSerde = serdeOptional(serdeString());
// Serde<string | undefined>
```

## Examples

### Example 1: Simple Data Types

```typescript
import {
  serialize,
  deserialize,
  serdeBool,
  serdeUnsignedInt,
  serdeString,
} from "@repo/serde";

// Boolean
const boolSerde = serdeBool();
const boolData = serialize(boolSerde.serializer, true);
const boolResult = deserialize(boolSerde.deserializer, boolData); // true

// Number
const numSerde = serdeUnsignedInt(32);
const numData = serialize(numSerde.serializer, 42);
const numResult = deserialize(numSerde.deserializer, numData); // 42

// String
const strSerde = serdeString();
const strData = serialize(strSerde.serializer, "Hello, World!");
const strResult = deserialize(strSerde.deserializer, strData); // "Hello, World!"
```

### Example 2: Complex Objects

```typescript
import {
  serialize,
  deserialize,
  serdeRecord,
  serdeRecordFieldsBuilder,
  serdeString,
  serdeUnsignedInt,
  serdeArray,
  serdeOptional,
} from "@repo/serde";

// Define a user object serializer
const userSerde = serdeRecord(
  serdeRecordFieldsBuilder({
    name: serdeString(),
    age: serdeUnsignedInt(8),
    tags: serdeArray(serdeString()),
    email: serdeOptional(serdeString()),
  })
);

const user = {
  name: "John Doe",
  age: 30,
  tags: ["developer", "typescript"],
  email: "john@example.com",
};

// Serialize
const serialized = serialize(userSerde.serializer, user);

// Deserialize
const deserialized = deserialize(userSerde.deserializer, serialized);
// { name: "John Doe", age: 30, tags: ["developer", "typescript"], email: "john@example.com" }
```

### Example 3: Enum Strings

```typescript
import { serialize, deserialize, serdeEnumedString } from "@repo/serde";

type Status = "pending" | "approved" | "rejected";

const statusSerde = serdeEnumedString<Status>([
  "pending",
  "approved",
  "rejected",
]);

const status: Status = "approved";
const serialized = serialize(statusSerde.serializer, status);
const deserialized = deserialize(statusSerde.deserializer, serialized); // "approved"
```

## BitArray

The package uses a `BitArray` class internally for efficient bit-level manipulation. While typically not used directly, it's available for advanced use cases:

```typescript
import { BitArray } from "@repo/serde/BitArray";

const bitArray = new BitArray();
bitArray.insertBool(true);
bitArray.insertBool(false);
const result = bitArray.consume(); // Uint8Array
```

## Notes

- The serialization format is binary and not human-readable
- Serialized data is compact and space-efficient
- All serializers are composable - you can build complex serializers from simple ones
- The package uses UTF-8 encoding for strings
- Array length is encoded using 12 bits by default (configurable)
- String length is encoded using 12 bits

## Authors

Yotam Cohen & Yoni Kiriaty

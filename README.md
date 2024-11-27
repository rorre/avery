# Avery

Yet another validator and JSON parser with first class Typescript support and zod-like features. This time purely functional!

# Usage

```ts
import { avery as a } from 'avery';

const schema = a.array(
  a.array(
    a.object({
      name: a.string(),
      age: a.number(),
    })
  )
);

const result = schema.validate([
  [
    {
      name: 'John',
      age: 10,
    },
    {
      name: 'Jane',
      age: 20,
    },
  ],
]);

const data = result.unwrap();
console.log(data);
```

This example runs as-is, and will validate the data. If the data is invalid, it will throw an error with a detailed message of where it errors out. For example, the example will produce the data itself.

## Type Inference

You may be able to inference the type based on the schema you have built, just like zod!

```ts
import { InferSchema, avery as a } from 'avery';

const schema = a.object({
  name: a.string(),
  age: a.number(),
});

type Data = InferSchema<typeof schema>;
// The type will be:
// {
//   name: string;
//   age: number;
// }
```

# Validators

## String

Constructor: `a.string()`

Methods:

- `minLength(min: number)` - Minimum length of the string
- `maxLength(max: number)` - Maximum length of the string

```ts
const schema = a.string().minLength(3).maxLength(10);
schema.validate('Hello!');
```

## Number

Constructor: `a.number()`

Methods:

- `eq(value: number)` - Equal to the value
- `gt(value: number)` - Greater than the value
- `gte(value: number)` - Greater than or equal to the value
- `lt(value: number)` - Less than the value
- `lte(value: number)` - Less than or equal to the value
- `int()` - Must be an integer
- `finite()` - Must be a finite number

```ts
const schema = a.number().gt(10).lt(20);
schema.validate(15);
```

## Boolean

Constructor: `a.boolean()`

Methods:

- `eq(value: boolean)` - Equal to the value

```ts
const schema = a.boolean();
schema.validate(true);
```

## Array

Constructor: `a.array(item: Validator)`

```ts
const schema = a.array(a.number());
schema.validate([1, 2, 3]);
```

## Object

Constructor: `a.object(schema: Record<string, Validator>)`

```ts
const schema = a.object({
  name: a.string(),
  age: a.number(),
});

schema.validate({
  name: 'John',
  age: 20,
});
```

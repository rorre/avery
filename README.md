# Avery

Avery is a schema first and type-safe validation library. The purpose of this library is to show that you can build a type-safe validation library without using TypeScript's advanced type features. In addition to that, it is to show that you can build a validation library in purely functional programming style.

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

## How It Works

Avery works by first defining all the check functions. This check function will only do one thing, but it will be chained with other check functions to build out the whole schema validator. It is done in a structure `Validator`. This validator will contain the check function, and is completely immutable.

Naively, it can be represented in Typescript like this:

```ts
type Validator<T> = {
  check: (data: unknown) => Result<T>;
};
```

A validator may have additional properties to modify its check function as well. Such as `NumberValidator` will have `gt`, `lt`, `int`, etc. These properties will return a new validator with the check function modified in a way that will wrap the previous check function. Overall, it will make use of the idea of Higher Order Function to build out the schema.

Here is an example of how the `NumberValidator` is represented:

```ts
type NumberValidator = Validator<number> & {
  gt: (value: number) => NumberValidator;
  lt: (value: number) => NumberValidator;
  int: () => NumberValidator;
};
```

As you can see, the `NumberValidator` is a `Validator` with additional properties. These properties will return a new `NumberValidator` with the check function modified according to the method used. This ensures that a validator will not have any side effects, and is completely immutable. Not only that, we can chain these methods to build out the schema and ensure that each check only does one thing, adhering to the Single Responsibility Principle.

Here is an example of how chaining works:

```ts
const schema = a.number().gt(10).lt(20);
```

This will create a `NumberValidator` with the check function that checks if the data is greater than 10 and less than 20. This is done by chaining the methods `gt` and `lt` to the `NumberValidator`.

When you call `validate` on the schema, it will run the check function on the data. If it fails, it will throw an error with a detailed message of where it fails. If it passes, it will return a `Result` object. This `Result` object will contain the data that has been validated.

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

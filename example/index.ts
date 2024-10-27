import { avery as a } from 'avery';

const schema = a.object({
  username: a.string(),
  password: a.string(),
  role: a.array(a.string()),
  age: a.number(),
  extraData: a.object({
    hello: a.string(),
    skibidi: a.object({
      rizz: a.string(),
    }),
  }),
});

const res = schema.validate({
  username: 'hello',
  password: 'world',
  role: ['admin', 'user'],
  age: 20,
  extraData: {
    hello: 'world',
    skibidi: {
      rizz: 'aaa',
    },
  },
});

console.log(
  {
    // @ts-ignore
    [res.isOk()]: () => res.unwrap(),
    // @ts-ignore
    [res.isErr()]: () => res.unwrapErr(),
    // @ts-ignore
  }.true()
);
// const x = res.unwrapErr();
// console.log(x);

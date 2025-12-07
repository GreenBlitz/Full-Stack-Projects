// בס"ד

type TranslateValue<
  Value extends object,
  Key extends keyof Value = keyof Value
> = Value[Key] extends string | number ? Key : never;

export const endpointResultToDict = <Value extends object>(
  values: Value[],
  idKey: TranslateValue<Value>
) => {
  return values.reduce(
    (acc, value) => ({
      ...acc,
      [value[idKey] as string]: value,
    }),
    {}
  );
};

const foo = sst.aws.StepFunctions.pass({ name: "Foo" });
const bar = sst.aws.StepFunctions.succeed({ name: "Bar" });

const definition = foo.next(bar);

export const sampleStepFunction = new sst.aws.StepFunctions("MyStateMachine", {
  definition
});
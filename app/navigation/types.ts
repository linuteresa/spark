// Wave 1: the core loop, screen by screen. See docs/screen-data-contract.md
// for what each screen reads and writes.
export type RootStackParamList = {
  CheckIn: undefined;
  YourOptions: { checkInId: string };
  DailyChallenge: { assignmentId: string };
  CompleteReflect: { assignmentId: string };
  Streak: undefined;
};

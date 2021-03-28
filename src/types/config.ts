export type ConfigState = {
  language: string;
  logApiCalls: boolean;
}

export type ConfigAction = {
  type: string;
  payload: string | boolean;
}

export type ConfigDispatchType = (args: ConfigAction) => ConfigAction;

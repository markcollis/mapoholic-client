export type AuthState = {
  authenticated: string | null;
  errorMessage: string;
}

export type AuthAction = {
  type: string;
  payload: string;
}

export type AuthDispatchType = (args: AuthAction) => AuthAction;

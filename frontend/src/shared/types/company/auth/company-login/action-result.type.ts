export type ActionResult<T = undefined> =
  | {
      success: true;
      data: T;
      message?: string;
      redirectUrl?: string;
    }
  | {
      success: false;
      error: string;
    };


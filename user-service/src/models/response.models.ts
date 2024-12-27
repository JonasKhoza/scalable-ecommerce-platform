interface ResponseI {
  success: boolean;
  data?: any;
  metadata?: any;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
}

class ResponseStructure {
  public success: boolean;
  public data?: any;
  public metadata?: any;
  public error?: {
    code: number;
    message: string;
  };

  constructor(
    s: boolean,
    d?: any,
    mt?: any,
    err?: {
      code: number;
      message: string;
      details?: any;
    }
  ) {
    (this.success = s),
      (this.data = d),
      (this.metadata = mt),
      (this.error = err);
  }
}

export { ResponseI, ResponseStructure };
